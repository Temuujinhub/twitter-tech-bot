/**
 * Дэлхийн технологийн мэдээ цуглуулах модуль
 * Шинэчлэгдсэн: 2026-02-21 16:15
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
      
      for (const item of feed.items.slice(0, 10)) {
        if (!item.title || !item.link) continue;

        let description = item.contentSnippet
          || item.summary
          || item.description
          || item['content:encoded']
          || item.content
          || '';

        if (description) {
          description = description.replace(/<[^>]*>/g, '').trim();
        }

        // RSS мэдээнд score байхгүй тул огноо-г ашиглан тооцоолох
        // Шинэ мэдээ = өндөр score (хамгийн шинэ нь 100, 1 хоног хуучин = 80, г.м.)
        let rssScore = 50;
        if (item.pubDate) {
          const hoursAgo = (Date.now() - new Date(item.pubDate).getTime()) / (1000 * 60 * 60);
          if (hoursAgo < 3) rssScore = 100;
          else if (hoursAgo < 6) rssScore = 90;
          else if (hoursAgo < 12) rssScore = 80;
          else if (hoursAgo < 24) rssScore = 70;
          else if (hoursAgo < 48) rssScore = 60;
          else rssScore = 40;
        }

        articles.push({
          title: item.title,
          link: item.link,
          description: description,
          source: source.name,
          topics: source.topics || ['Tech'],
          pubDate: item.pubDate,
          image: extractImageFromContent(item.content) || item.enclosure?.url,
          score: rssScore
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
    
    const articles = response.data.data.children
      .filter(post => post.data.title && post.data.url)
      .map(post => {
        const thumbnail = post.data.thumbnail;
        const hasValidThumbnail = thumbnail
          && thumbnail !== 'self'
          && thumbnail !== 'default'
          && thumbnail !== 'nsfw'
          && thumbnail.startsWith('http');
        return {
          title: post.data.title,
          link: post.data.url,
          description: post.data.selftext || '',
          source: 'Reddit r/technology',
          topics: ['Tech News'],
          score: post.data.score || 0,
          comments: post.data.num_comments,
          pubDate: post.data.created_utc ? new Date(post.data.created_utc * 1000).toISOString() : null,
          image: hasValidThumbnail ? thumbnail : null
        };
      });
    
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
    const storyIds = topStoriesRes.data.slice(0, 15);
    
    const articles = [];
    for (const id of storyIds) {
      try {
        const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        const story = storyRes.data;
        
        if (story.type === 'story' && story.url && story.title) {
          articles.push({
            title: story.title,
            link: story.url,
            description: story.text ? story.text.replace(/<[^>]*>/g, '').trim() : '',
            source: 'Hacker News',
            topics: ['Tech News'],
            score: story.score || 0,
            comments: story.descendants || 0,
            pubDate: story.time ? new Date(story.time * 1000).toISOString() : null
          });
        }
      } catch (e) { continue; }
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
  if (!keywords || keywords.length === 0) return articles;
  
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
  
  // PDF файлууд болон хуучин огноотой мэдээнүүдийг арилгах
  let filtered = allArticles.filter(article => {
    // PDF шүүх
    if (article.link && article.link.endsWith('.pdf')) {
      return false;
    }
    
    // Огноо шалгах - сүүлийн 7 хоногийн мэдээнүүд
    if (article.pubDate) {
      const pubDate = new Date(article.pubDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (pubDate < weekAgo) {
        return false;
      }
    }
    
    return true;
  });
  
  // Keyword filter
  if (config.keywords && config.keywords.length > 0) {
    filtered = filterByKeywords(filtered, config.keywords);
  }
  
  // Хэрэв шүүсний дараа мэдээ олдохгүй бол, бүх мэдээг ашиглах
  if (filtered.length === 0 && allArticles.length > 0) {
    console.log('⚠️ Түлхүүр үгээр мэдээ олдсонгүй, бүх мэдээг ашиглаж байна...');
    filtered = allArticles;
  }
  
  // Sort: Reddit/HN score-ийг normalize хийж, RSS огноо score-тай нэгтгэн эрэмбэлэх
  const maxScore = Math.max(...filtered.map(a => a.score || 0), 1);
  filtered.sort((a, b) => {
    // Engagement score: 0-100 хооронд normalize хийх
    const aEngagement = Math.min(((a.score || 0) / maxScore) * 100, 100);
    const bEngagement = Math.min(((b.score || 0) / maxScore) * 100, 100);
    // Ogno score: RSS-д аль хэдийн тооцоолсон (40-100), Reddit/HN-д engagement ашиглах
    const aIsRSS = a.source !== 'Reddit r/technology' && a.source !== 'Hacker News';
    const bIsRSS = b.source !== 'Reddit r/technology' && b.source !== 'Hacker News';
    const aFinal = aIsRSS ? (a.score || 50) : aEngagement;
    const bFinal = bIsRSS ? (b.score || 50) : bEngagement;
    return bFinal - aFinal;
  });
  
  console.log(`\n📊 Нийт цуглуулсан: ${allArticles.length} мэдээ`);
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
