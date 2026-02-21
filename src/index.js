/**
 * Twitter Tech Bot - Main Entry File
 */

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs/promises';
import { collectAllNews, saveArticles } from './newsCollector.js';
import { generateTweetContent } from './contentGenerator.js';
import { getArticleImage, cleanupOldImages } from './imageHandler.js';
import { createTwitterClient, postTweet, postTweetWithImage, getAccountInfo } from './twitterClient.js';

dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

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
    sources
  };
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
    const bestArticle = articles[0]; 
    console.log(`🎯 Best News Selected: ${bestArticle.title}`);
    
    const tweetText = await generateTweetContent(bestArticle);
    const imagePath = await getArticleImage(bestArticle);
    
    if (imagePath) {
      await postTweetWithImage(twitterClient, tweetText, imagePath);
    } else {
      await postTweet(twitterClient, tweetText);
    }
    
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
