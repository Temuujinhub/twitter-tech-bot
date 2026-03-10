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
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 12000
    });
    const imagePath = path.join(process.cwd(), 'data', 'images', filename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, response.data);
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
      if (src.startsWith('http://') || src.startsWith('https://')) return src;
      if (src.startsWith('//')) return `${base.protocol}${src}`;
      if (src.startsWith('/')) return `${base.origin}${src}`;
      return null; // харьцангуй зам (relative path) - алгас
    };

    const rawUrl =
      $('meta[property="og:image:secure_url"]').attr('content') ||
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image:src"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content') ||
      $('article img[src]').not('[src*="logo"],[src*="icon"],[src*="avatar"]').first().attr('src') ||
      $('figure img[src]').first().attr('src') ||
      $('img[src]').filter((_, el) => {
        const src = $(el).attr('src') || '';
        const w = parseInt($(el).attr('width') || '0');
        return !src.includes('logo') && !src.includes('icon') && (w === 0 || w >= 300);
      }).first().attr('src') ||
      null;

    return toAbsolute(rawUrl);
  } catch (error) {
    console.error(`❌ Web scraping алдаа: ${error.message}`);
    return null;
  }
}

export async function getArticleImage(article) {
  let imageUrl = article.image;
  
  // Хэрэв RSS-с зураг олдоогүй бол web page-с scrape хийх
  if (!imageUrl && article.link) {
    console.log('🔍 Web page-с зураг хайж байна...');
    imageUrl = await scrapeImageFromArticle(article.link);
  }
  
  // Хэрэв зураг олдоогүй бол fallback зураг ашиглах
  if (!imageUrl) {
    console.log('⚠️ Зураг олдсонгүй, fallback зураг ашиглаж байна...');
    imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }
  
  const filename = `${Date.now()}_${(article.source || 'unknown').replace(/\s+/g, '_')}.jpg`;
  
  // Зургийг татаж авах
  let downloadedPath = await downloadImage(imageUrl, filename);
  
  // Хэрэв татаж чадаагүй бол fallback зураг ашиглах
  if (!downloadedPath) {
    console.log('⚠️ Зураг татаж чадсангүй, fallback зураг ашиглаж байна...');
    const fallbackUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
    downloadedPath = await downloadImage(fallbackUrl, `fallback_${filename}`);
  }
  
  // Хэрэв бүр fallback ч татаж чадаагүй бол
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
