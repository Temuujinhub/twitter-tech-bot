/**
 * Зураг татаж авах болон боловсруулах модуль
 */

import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

/**
 * URL-аас зураг татаж авах
 */
export async function downloadImage(url, filename) {
  try {
    console.log(`🖼️  Зураг татаж байна: ${url}`);
    
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const imagePath = path.join(process.cwd(), 'data', 'images', filename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, response.data);
    
    console.log(`✅ Зураг хадгалагдлаа: ${filename}`);
    return imagePath;
  } catch (error) {
    console.error(`❌ Зураг татахад алдаа: ${error.message}`);
    return null;
  }
}

/**
 * Зургийг Twitter-т тохирох хэмжээнд оруулах
 */
export async function processImage(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '_processed.jpg');
    
    await sharp(imagePath)
      .resize(1200, 675, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    
    console.log(`✅ Зураг боловсруулагдлаа: ${path.basename(outputPath)}`);
    return outputPath;
  } catch (error) {
    console.error(`❌ Зураг боловсруулахад алдаа: ${error.message}`);
    return imagePath;
  }
}

/**
 * Зургийн URL шалгах
 */
export function isValidImageUrl(url) {
  if (!url) return false;
  
  // Жижиг thumbnail биш эсэхийг шалгах
  if (url.includes('thumbnail') && url.includes('self')) return false;
  if (url.includes('default') && url.includes('avatar')) return false;
  
  // Valid image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasImageExt = imageExtensions.some(ext => url.toLowerCase().includes(ext));
  
  // Valid domains
  const validDomains = ['imgur', 'cloudinary', 'media', 'cdn', 'image'];
  const hasValidDomain = validDomains.some(domain => url.toLowerCase().includes(domain));
  
  return hasImageExt || hasValidDomain;
}

/**
 * Article-аас зураг олж татах
 */
export async function getArticleImage(article) {
  // Article-д зураг байгаа эсэхийг шалгах
  if (!article.image || !isValidImageUrl(article.image)) {
    console.log('⚠️  Зураг олдсонгүй, текст пост хийнэ');
    return null;
  }
  
  const filename = `${Date.now()}_${article.source.replace(/\s+/g, '_')}.jpg`;
  const downloadedPath = await downloadImage(article.image, filename);
  
  if (!downloadedPath) return null;
  
  const processedPath = await processImage(downloadedPath);
  return processedPath;
}

/**
 * Хуучин зургуудыг устгах (цэвэрлэх)
 */
export async function cleanupOldImages(daysOld = 7) {
  try {
    const imagesDir = path.join(process.cwd(), 'data', 'images');
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
