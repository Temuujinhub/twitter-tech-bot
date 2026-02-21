/**
 * Twitter Tech Bot - Үндсэн файл
 * Шинэчлэгдсэн: 2026-02-21 16:38
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { collectAllNews, saveArticles } from './newsCollector.js';
import { generateTweetContent } from './contentGenerator.js';
import { getArticleImage, cleanupOldImages } from './imageHandler.js';
import { createTwitterClient, postTweet, postTweetWithImage, getAccountInfo } from './twitterClient.js';

// .env файл уншуулах
dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

/**
 * Тохиргоо унших
 */
async function loadConfig() {
  const sourcesPath = path.join(process.cwd(), 'config', 'sources.json');
  const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf-8'));
  
  return {
    twitter: {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    },
    sources,
    postsPerDay: parseInt(process.env.POSTS_PER_DAY) || 5,
  };
}

/**
 * Бот ажиллуулах - нэг удаагийн пост
 */
export async function runBot() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🤖 Twitter Tech Bot эхэллээ`);
  console.log(`📅 ${new Date().toLocaleString('mn-MN')}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    // 1. Тохиргоо унших
    console.log('📋 Тохиргоо уншиж байна...');
    const config = await loadConfig();
    
    // 2. Twitter холболт шалгах
    console.log('🔌 Twitter-тай холбогдож байна...');
    const twitterClient = createTwitterClient(config.twitter);
    await getAccountInfo(twitterClient);
    
    // 3. Мэдээ цуглуулах
    console.log('📰 Технологийн мэдээ цуглуулж байна...\n');
    const articles = await collectAllNews(config.sources);
    
    if (articles.length === 0) {
      console.log('⚠️  Мэдээ олдсонгүй. Дахин оролдоно уу.');
      return;
    }
    
    // Хадгалах
    await saveArticles(articles);
    
    // 4. Хамгийн өндөр оноотой мэдээг сонгох
    const bestArticle = articles[0]; 
    console.log(`\n🎯 Сонгосон шилдэг мэдээ (Оноо: ${bestArticle.score || 'N/A'}):`);
    console.log(`   Гарчиг: ${bestArticle.title}`);
    console.log(`   Эх сурвалж: ${bestArticle.source}`);
    
    // 5. Tweet контент үүсгэх
    console.log(`\n✍️  Монгол хэлээр контент үүсгэж байна...`);
    const tweetText = await generateTweetContent(bestArticle);
    console.log(`\n📝 Үүссэн контент:`);
    console.log(`${'─'.repeat(60)}`);
    console.log(tweetText);
    console.log(`${'─'.repeat(60)}`);
    console.log(`📏 Урт: ${tweetText.length} тэмдэгт`);
    
    // 6. Зураг татах (байвал)
    console.log(`\n🖼️  Зураг боловсруулж байна...`);
    const imagePath = await getArticleImage(bestArticle);
    
    // 7. Tweet пост хийх
    let tweet;
    if (imagePath) {
      tweet = await postTweetWithImage(twitterClient, tweetText, imagePath);
    } else {
      tweet = await postTweet(twitterClient, tweetText);
    }
    
    // 8. Амжилт
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Tweet амжилттай пост хийгдлээ!`);
    console.log(`🔗 https://twitter.com/user/status/${tweet.id}`);
    console.log(`${'='.repeat(60)}\n`);
    
    // 9. Хуучин зураг устгах
    await cleanupOldImages(7);
    
  } catch (error) {
    console.error(`\n❌ Алдаа гарлаа:`, error);
    console.error(`\n💡 Зөвлөмж:`);
    console.error(`   1. .env файл дахь Twitter API keys-ээ шалгана уу`);
    console.error(`   2. Internet холболтоо шалгана уу`);
    console.error(`   3. Twitter API rate limits-ыг шалгана уу\n`);
  }
}

/**
 * Тест горим - Twitter руу пост хийлгүйгээр шалгах
 */
export async function testMode() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ТЕСТ ГОРИМ - Twitter руу пост хийхгүй`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    const sourcesPath = path.join(process.cwd(), 'config', 'sources.json');
    const sources = JSON.parse(await fs.readFile(sourcesPath, 'utf-8'));
    
    console.log('📰 Мэдээ цуглуулж байна...\n');
    const articles = await collectAllNews(sources);
    
    if (articles.length === 0) {
      console.log('⚠️  Мэдээ олдсонгүй.');
      return;
    }
    
    const randomArticle = articles[Math.floor(Math.random() * Math.min(10, articles.length))];
    console.log(`\n🎯 Сонгосон мэдээ:`);
    console.log(`   Гарчиг: ${randomArticle.title}`);
    console.log(`   Эх: ${randomArticle.source}`);
    console.log(`   Линк: ${randomArticle.link}`);
    
    console.log(`\n✍️  Контент үүсгэж байна...`);
    const tweetText = await generateTweetContent(randomArticle);
    
    console.log(`\n📝 Үүссэн tweet:`);
    console.log(`${'─'.repeat(60)}`);
    console.log(tweetText);
    console.log(`${'─'.repeat(60)}`);
    console.log(`📏 Урт: ${tweetText.length}/280 тэмдэгт`);
    
    if (randomArticle.image) {
      console.log(`\n🖼️  Зураг: ${randomArticle.image}`);
    }
    
    console.log(`\n✅ Тест амжилттай!\n`);
  } catch (error) {
    console.error(`\n❌ Алдаа:`, error);
  }
}

// Хэрэв шууд ажиллуулбал
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2];
  if (mode === 'test') {
    testMode();
  } else {
    runBot();
  }
}
ss.argv[2];
  
  if (mode === 'test') {
    testMode();
  } else {
    runBot();
  }
}
}
