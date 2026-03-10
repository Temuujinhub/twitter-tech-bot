/**
 * Twitter Tech Bot - Main Entry File
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { collectAllNews, saveArticles } from './newsCollector.js';
import { generateTweetContent } from './contentGenerator.js';
import { getArticleImage, cleanupOldImages } from './imageHandler.js';
import { createTwitterClient, postTweet, postTweetWithImage, getAccountInfo } from './twitterClient.js';

dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

async function loadConfig() {
  const sourcesPath = path.join(process.cwd(), 'config', 'sources.json');
  const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf-8'));

  const twitter = {
    apiKey: process.env.TWITTER_API_KEY,
    apiSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  };

  // Credentials шалгах
  const missing = Object.entries(twitter)
    .filter(([, v]) => !v || v.trim() === '')
    .map(([k]) => k);
  if (missing.length > 0) {
    throw new Error(`Twitter credentials дутуу байна: ${missing.join(', ')}\n` +
      'config/.env файлд тохируулна уу.');
  }

  return { twitter, sources };
}

const POSTED_LINKS_MAX = 300; // хэт том файл болохоос сэргийлэх

async function loadPostedLinks() {
  try {
    const postedPath = path.join(process.cwd(), 'data', 'posted_links.json');
    const data = await fs.readFile(postedPath, 'utf-8');
    const parsed = JSON.parse(data);
    // Legacy: array of strings эсвэл array of {link, title} objects
    return parsed.map(entry => (typeof entry === 'string' ? { link: entry, title: '' } : entry));
  } catch {
    return [];
  }
}

async function savePostedEntry(article) {
  try {
    const postedPath = path.join(process.cwd(), 'data', 'posted_links.json');
    const entries = await loadPostedLinks();
    entries.push({ link: article.link, title: article.title || '' });

    // Хэт том болохоос сэргийлж хамгийн сүүлийн 300-г хадгалах
    const trimmed = entries.slice(-POSTED_LINKS_MAX);
    await fs.writeFile(postedPath, JSON.stringify(trimmed, null, 2), 'utf-8');
    console.log(`✅ Posted entry хадгалагдлаа: ${article.link}`);
    console.log(`📊 Нийт posted entries: ${trimmed.length}`);
  } catch (error) {
    console.error('❌ Posted links хадгалахад алдаа:', error.message);
    throw error;
  }
}

function normalizeTitle(title) {
  return (title || '').toLowerCase().replace(/[^a-z0-9а-яёөүа-я\s]/gi, '').trim();
}

function isAlreadyPosted(article, postedEntries) {
  const link = article.link;
  const titleNorm = normalizeTitle(article.title);
  return postedEntries.some(entry => {
    if (entry.link === link) return true;
    // Гарчигийн 80%+ давхцал байвал давтагдсан гэж үзэх
    if (titleNorm && entry.title) {
      const entryNorm = normalizeTitle(entry.title);
      if (titleNorm.length > 20 && entryNorm.length > 20 && titleNorm === entryNorm) return true;
    }
    return false;
  });
}

export async function runBot() {
  console.log('🤖 Starting Twitter Tech Bot...');
  try {
    const config = await loadConfig();
    const twitterClient = createTwitterClient(config.twitter);
    await getAccountInfo(twitterClient);
    
    const articles = await collectAllNews(config.sources);
    if (!articles || articles.length === 0) {
      console.log('⚠️ No news found.');
      return;
    }
    
    await saveArticles(articles);
    
    // Өмнө нь post хийсэн мэдээнүүдийг шүүх (link болон гарчигаар)
    const postedEntries = await loadPostedLinks();
    console.log(`📊 Одоо байгаа posted entries: ${postedEntries.length}`);

    const freshArticles = articles.filter(article => {
      const isPosted = isAlreadyPosted(article, postedEntries);
      if (isPosted) {
        console.log(`⏭️  Алгасах (давтагдсан): ${(article.title || '').substring(0, 60)}`);
      }
      return !isPosted;
    });
    
    if (freshArticles.length === 0) {
      console.log('⚠️ Бүх мэдээ аль хэдийн post хийгдсэн байна.');
      console.log('💡 Шинэ мэдээ хүлээж байна...');
      return;
    }
    
    console.log(`✅ Шинэ мэдээ олдлоо: ${freshArticles.length}`);
    const bestArticle = freshArticles[0]; 
    console.log(`🎯 Best News Selected: ${bestArticle.title}`);
    console.log(`🔗 Link: ${bestArticle.link}`);
    
    // Хэрэв description хоосон бол link-с cheerio-оор татах
    if (!bestArticle.description || bestArticle.description.length < 30) {
      console.log('🔍 Description хоосон байна, web page-с татаж байна...');
      try {
        const axios = (await import('axios')).default;
        const response = await axios.get(bestArticle.link, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
          timeout: 10000
        });
        const $ = cheerio.load(response.data);
        const desc =
          $('meta[property="og:description"]').attr('content') ||
          $('meta[name="twitter:description"]').attr('content') ||
          $('meta[name="description"]').attr('content') ||
          '';
        if (desc && desc.length > 20) {
          bestArticle.description = desc.trim();
          console.log('✅ Description олдлоо:', bestArticle.description.substring(0, 100));
        }
      } catch (error) {
        console.log('⚠️ Description татаж чадсангүй:', error.message);
      }
    }
    
    const tweetText = await generateTweetContent(bestArticle);
    const imagePath = await getArticleImage(bestArticle);
    
    if (imagePath) {
      await postTweetWithImage(twitterClient, tweetText, imagePath);
    } else {
      await postTweet(twitterClient, tweetText);
    }
    
    // Post хийсэн мэдээний link болон гарчгийг хадгалах
    await savePostedEntry(bestArticle);
    
    console.log('✅ Success!');
    await cleanupOldImages(7);
  } catch (error) {
    console.error('❌ Bot Error:', error.message);
  }
}

export async function testMode() {
  console.log('🧪 Running Test Mode...');
  try {
    const config = await loadConfig();
    const articles = await collectAllNews(config.sources);
    if (articles.length > 0) {
      const tweet = await generateTweetContent(articles[0]);
      console.log('📝 Generated Tweet:', tweet);
    }
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

const mode = process.argv[2];
if (mode === 'test') {
  testMode();
} else {
  runBot();
}
