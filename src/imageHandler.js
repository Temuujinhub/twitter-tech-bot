/**
 * Зураг татаж авах болон боловсруулах модуль
 */

import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import * as cheerio from 'cheerio';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200&h=675', // Robotics
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=675', // Tech/Circuit
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=675', // Security
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=675'  // AI
];

export async function downloadImage(url, filename) {
  try {
    // URL хүчинтэй эсэхийг шалгах
    if (!url || !url.startsWith('http')) {
      console.error(`❌ Зургийн URL хүчингүй: ${url}`);
      return null;
    }
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    // Зургийн MIME type шалгах
    const contentType = response.headers['content-type'] || '';
    if (!contentType.startsWith('image/')) {
      console.error(`❌ Зургийн төрөл буруу: ${contentType} (${url})`);
      return null;
    }

    // Хэт жижиг файл бол хүчингүй (< 2KB = placeholder эсвэл алдааны зураг)
    if (response.data.byteLength < 2048) {
      console.error(`❌ Зураг хэт жижиг (${response.data.byteLength} bytes): ${url}`);
      return null;
    }

    const imagePath = path.join(process.cwd(), 'data', 'images', filename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, response.data);
    console.log(`✅ Зураг татагдлаа: ${filename} (${Math.round(response.data.byteLength / 1024)}KB)`);
    return imagePath;
  } catch (error) {
    console.error(`❌ Зураг татахад алдаа: ${error.message}`);
    return null;
  }
}

export async function processImage(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '_processed.jpg');
    await sharp(imagePath)
      .resize(1200, 675, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    // Original файлыг устгах (disk хэмнэх)
    if (outputPath !== imagePath) {
      await fs.unlink(imagePath).catch(() => {});
    }
    return outputPath;
  } catch (error) {
    console.error(`❌ Зураг боловсруулахад алдаа: ${error.message}`);
    return imagePath;
  }
}

async function scrapeImageFromArticle(articleUrl) {
  try {
    const response = await axios.get(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 12000
    });

    const $ = cheerio.load(response.data);
    const base = new URL(articleUrl);

    // Absolute URL болгох helper
    const toAbsolute = (src) => {
      if (!src) return null;
      src = src.trim();
      if (src.startsWith('http://') || src.startsWith('https://')) return src;
      if (src.startsWith('//')) return `${base.protocol}${src}`;
      if (src.startsWith('/')) return `${base.origin}${src}`;
      return null; // харьцангуй зам (relative path) - алгас
    };

    // srcset-с хамгийн том зургийг авах helper
    const bestFromSrcset = (srcset) => {
      if (!srcset) return null;
      const parts = srcset.split(',').map(s => s.trim()).filter(Boolean);
      let best = null;
      let bestW = 0;
      for (const part of parts) {
        const [url, descriptor] = part.split(/\s+/);
        const w = descriptor ? parseInt(descriptor) : 0;
        if (w > bestW) { bestW = w; best = url; }
      }
      return best || (parts[parts.length - 1] || '').split(/\s+/)[0] || null;
    };

    // зураг шүүх: logo, icon, avatar, tracking pixel-ийг хасах
    const isValidImgSrc = (src) => {
      if (!src) return false;
      const lower = src.toLowerCase();
      return !lower.includes('logo') && !lower.includes('icon') &&
             !lower.includes('avatar') && !lower.includes('pixel') &&
             !lower.includes('spacer') && !lower.includes('blank');
    };

    // Meta tag-с зураг хайх (хамгийн найдвартай)
    const metaRaw =
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      null;

    if (metaRaw) {
      const abs = toAbsolute(metaRaw);
      if (abs) return abs;
    }

    // Article/figure дотроос хайх — srcset дэмжих
    const articleImgs = $('article img, figure img, [class*="hero"] img, [class*="featured"] img, [class*="thumbnail"] img')
      .not('[src*="logo"],[src*="icon"],[src*="avatar"],[src*="pixel"]')
      .toArray();

    for (const el of articleImgs) {
      const srcset = $(el).attr('srcset') || $(el).attr('data-srcset');
      const src = $(el).attr('src') || $(el).attr('data-src') || '';
      const w = parseInt($(el).attr('width') || '0');

      if (srcset) {
        const best = toAbsolute(bestFromSrcset(srcset));
        if (best) return best;
      }
      if (isValidImgSrc(src) && (w === 0 || w >= 300)) {
        const abs = toAbsolute(src);
        if (abs) return abs;
      }
    }

    // Бүх img-с хамгийн том хэмжээтэй зургийг хайх
    const rawUrl = $('img[src]').filter((_, el) => {
      const src = $(el).attr('src') || '';
      const w = parseInt($(el).attr('width') || '0');
      return isValidImgSrc(src) && (w === 0 || w >= 300);
    }).first().attr('src') || null;

    return toAbsolute(rawUrl);
  } catch (error) {
    console.error(`❌ Web scraping алдаа: ${error.message}`);
    return null;
  }
}

export async function getArticleImage(article) {
  let imageUrl = article.image;
  let imageSource = 'RSS';

  // Хэрэв RSS-с зураг олдоогүй бол web page-с scrape хийх
  if (!imageUrl && article.link) {
    console.log('🔍 Web page-с зураг хайж байна...');
    imageUrl = await scrapeImageFromArticle(article.link);
    if (imageUrl) imageSource = 'WebScrape';
  }

  // Хэрэв зураг олдоогүй бол fallback зураг ашиглах
  if (!imageUrl) {
    console.log('⚠️ Мэдээний зураг олдсонгүй, fallback зураг ашиглаж байна...');
    imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    imageSource = 'Fallback';
  }

  console.log(`🖼️  Зургийн эх сурвалж: ${imageSource} — ${imageUrl.substring(0, 80)}...`);
  const filename = `${Date.now()}_${(article.source || 'unknown').replace(/\s+/g, '_')}.jpg`;

  // Зургийг татаж авах
  let downloadedPath = await downloadImage(imageUrl, filename);

  // Хэрэв татаж чадаагүй бол өөр fallback зураг туршиж үзэх
  if (!downloadedPath) {
    console.log('⚠️ Зураг татаж чадсангүй, fallback зураг ашиглаж байна...');
    for (const fallbackUrl of FALLBACK_IMAGES) {
      if (fallbackUrl === imageUrl) continue;
      downloadedPath = await downloadImage(fallbackUrl, `fallback_${filename}`);
      if (downloadedPath) break;
    }
  }

  // Бүх fallback ч татаж чадаагүй бол текст пост хийнэ
  if (!downloadedPath) {
    console.log('⚠️ Зураг олдсонгүй, текст пост хийнэ');
    return null;
  }

  // Зургийг боловсруулах
  return await processImage(downloadedPath);
}

/**
 * Хуучин зургуудыг устгах (цэвэрлэх)
 */
export async function cleanupOldImages(daysOld = 7) {
  try {
    const imagesDir = path.join(process.cwd(), 'data', 'images');
    
    // Хавтас байгаа эсэхийг шалгах
    try {
      await fs.access(imagesDir);
    } catch {
      return; // Хавтас байхгүй бол юу ч хийхгүй
    }

    const files = await fs.readdir(imagesDir);
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000;
    
    let deletedCount = 0;
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);
      
      if (now - stats.mtimeMs > maxAge) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }
    
    if (deletedCount > 0) {
      console.log(`🗑️  ${deletedCount} хуучин зураг устгагдлаа`);
    }
  } catch (error) {
    console.error(`❌ Зураг цэвэрлэхэд алдаа: ${error.message}`);
  }
}
