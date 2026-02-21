/**
 * Зураг татаж авах болон боловсруулах модуль
 */

import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200&h=675', // Robotics
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200&h=675', // Tech/Circuit
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200&h=675', // Security
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=675'  // AI
];

export async function downloadImage(url, filename) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    const imagePath = path.join(process.cwd(), 'data', 'images', filename);
    await fs.mkdir(path.dirname(imagePath), { recursive: true });
    await fs.writeFile(imagePath, response.data);
    return imagePath;
  } catch (error) {
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
    return outputPath;
  } catch (error) {
    return imagePath;
  }
}

export async function getArticleImage(article) {
  let imageUrl = article.image;
  
  if (!imageUrl) {
    console.log('⚠️ Зураг олдсонгүй, fallback зураг ашиглаж байна...');
    imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  }
  
  const filename = `${Date.now()}.jpg`;
  const downloadedPath = await downloadImage(imageUrl, filename);
  
  if (!downloadedPath) {
    const secondTry = FALLBACK_IMAGES[0];
    const secondPath = await downloadImage(secondTry, `fallback_${filename}`);
    return secondPath ? await processImage(secondPath) : null;
  }
  
  return await processImage(downloadedPath);
}

export async function cleanupOldImages(daysOld = 7) {
  try {
    const imagesDir = path.join(process.cwd(), 'data', 'images');
    const files = await fs.readdir(imagesDir);
    const now = Date.now();
    for (const file of files) {
      const filePath = path.join(imagesDir, file);
      const stats = await fs.stat(filePath);
      if (now - stats.mtimeMs > daysOld * 24 * 60 * 60 * 1000) {
        await fs.unlink(filePath);
      }
    }
  } catch (e) {}
}
.log('⚠️  Зураг олдсонгүй, текст пост хийнэ');
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
