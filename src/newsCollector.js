/**
 * Дэлхийн технологийн мэдээ цуглуулах модуль
 */

import Parser from 'rss-parser';
import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';

const rssParser = new Parser();

/**
 * RSS Feed-үүдээс мэдээ цуглуулах
 */
export async function collectFromRSS(sources) {
  const articles = [];
  
  for (const source of sources) {
    try {
      console.log(`📰 ${source.name}-аас мэдээ татаж байна...`);
      const feed = await rssParser.parseURL(source.url);
      
      for (const item of feed.items.slice(0, 5)) {
        articles.push({
          title: item.title,
          link: item.link,
          description: item.contentSnippet || item.content || '',
          source: source.name,
          topics: source.topics,
          pubDate: item.pubDate,
          image: extractImageFromContent(item.content) || item.enclosure?.url
        });
      }
      
      console.log(`✅ ${source.name}: ${feed.items.length} мэдээ олдлоо`);
    } catch (error) {
      console.error(`❌ ${source.name} татахад алдаа: ${error.message}`);
    }
  }
  
  return articles;
}

/**
 * Reddit-аас trending мэдээ авах
 */
export async function collectFromReddit() {
  try {
    const response = await axios.get('https://www.reddit.com/r/technology/top/.json?limit=10', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const articles = response.data.data.children.map(post => ({
      title: post.data.title,
      link: post.data.url,
      description: post.data.selftext || '',
      source: 'Reddit r/technology',
      topics: ['Tech News'],
      score: post.data.score,
      comments: post.data.num_comments,
      image: post.data.thumbnail !== 'self' ? post.data.thumbnail : null
    }));
    
    console.log(`✅ Reddit: ${articles.length} мэдээ олдлоо`);
    return articles;
  } catch (error) {
    console.error(`❌ Reddit татахад алдаа: ${error.message}`);
    return [];
  }
}

/**
 * Hacker News-аас top stories авах
 */
export async function collectFromHackerNews() {
  try {
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const storyIds = topStoriesRes.data.slice(0, 10);
    
    const articles = [];
    for (const id of storyIds) {
      const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
      const story = storyRes.data;
      
      if (story.type === 'story' && story.url) {
        articles.push({
          title: story.title,
          link: story.url,
          description: story.text || '',
          source: 'Hacker News',
          topics: ['Tech News'],
          score: story.score,
          comments: story.descendants || 0
        });
      }
    }
    
    console.log(`✅ Hacker News: ${articles.length} мэдээ олдлоо`);
    return articles;
  } catch (error) {
    console.error(`❌ Hacker News татахад алдаа: ${error.message}`);
    return [];
  }
}

/**
 * HTML агуулгаас зураг олох
 */
function extractImageFromContent(html) {
  if (!html) return null;
  
  const $ = cheerio.load(html);
  const img = $('img').first();
  return img.attr('src') || null;
}

/**
 * Keyword-ээр мэдээ шүүх
 */
export function filterByKeywords(articles, keywords) {
  return articles.filter(article => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return keywords.some(keyword => text.includes(keyword.toLowerCase()));
  });
}

/**
 * Бүх эх сурвалжаас мэдээ цуглуулах
 */
export async function collectAllNews(config) {
  const allArticles = [];
  
  // RSS Feeds
  if (config.rssFeeds) {
    const rssArticles = await collectFromRSS(config.rssFeeds);
    allArticles.push(...rssArticles);
  }
  
  // Reddit
  const redditArticles = await collectFromReddit();
  allArticles.push(...redditArticles);
  
  // Hacker News
  const hnArticles = await collectFromHackerNews();
  allArticles.push(...hnArticles);
  
  // Keyword filter
  const filtered = config.keywords 
    ? filterByKeywords(allArticles, config.keywords)
    : allArticles;
  
  // Sort by date/score
  filtered.sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA;
  });
  
  console.log(`\n📊 Нийт: ${allArticles.length} мэдээ`);
  console.log(`🎯 Шүүгдсэн: ${filtered.length} мэдээ`);
  
  return filtered;
}

/**
 * Мэдээг файл руу хадгалах
 */
export async function saveArticles(articles, filename = 'latest_news.json') {
  const dataPath = path.join(process.cwd(), 'data', filename);
  await fs.writeFile(dataPath, JSON.stringify(articles, null, 2), 'utf-8');
  console.log(`💾 ${articles.length} мэдээ ${filename} файлд хадгалагдлаа`);
}
