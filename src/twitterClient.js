/**
 * Twitter API холболт ба пост хийх модуль
 */

import { TwitterApi } from 'twitter-api-v2';
import fs from 'fs/promises';

/**
 * Twitter client үүсгэх
 */
export function createTwitterClient(credentials) {
  return new TwitterApi({
    appKey: credentials.apiKey,
    appSecret: credentials.apiSecret,
    accessToken: credentials.accessToken,
    accessSecret: credentials.accessSecret,
  });
}

/**
 * Tweet пост хийх (зураггүй)
 */
export async function postTweet(client, text) {
  try {
    console.log(`\n📤 Tweet илгээж байна...`);
    console.log(`📝 Текст: ${text.substring(0, 100)}...`);
    
    const tweet = await client.v2.tweet(text);
    
    console.log(`✅ Tweet амжилттай! ID: ${tweet.data.id}`);
    console.log(`🔗 https://twitter.com/user/status/${tweet.data.id}`);
    
    return tweet.data;
  } catch (error) {
    console.error(`❌ Tweet илгээхэд алдаа:`, error);
    throw error;
  }
}

/**
 * Зурагтай tweet пост хийх
 */
export async function postTweetWithImage(client, text, imagePath) {
  try {
    console.log(`\n📤 Зурагтай tweet илгээж байна...`);
    console.log(`📝 Текст: ${text.substring(0, 100)}...`);
    console.log(`🖼️  Зураг: ${imagePath}`);
    
    // Зургийг upload хийх
    const imageBuffer = await fs.readFile(imagePath);
    const mediaId = await client.v1.uploadMedia(imageBuffer, {
      mimeType: 'image/jpeg'
    });
    
    console.log(`✅ Зураг upload хийгдлээ. Media ID: ${mediaId}`);
    
    // Tweet илгээх
    const tweet = await client.v2.tweet({
      text: text,
      media: { media_ids: [mediaId] }
    });
    
    console.log(`✅ Зурагтай tweet амжилттай! ID: ${tweet.data.id}`);
    console.log(`🔗 https://twitter.com/user/status/${tweet.data.id}`);
    
    return tweet.data;
  } catch (error) {
    console.error(`❌ Зурагтай tweet илгээхэд алдаа:`, error);
    
    // Fallback: Зураггүй пост хийх
    console.log(`⚠️  Зураггүй пост хийж байна...`);
    return await postTweet(client, text);
  }
}

/**
 * Twitter account-ын мэдээлэл авах (тест)
 */
export async function getAccountInfo(client) {
  try {
    const user = await client.v2.me();
    console.log(`\n👤 Account: @${user.data.username}`);
    console.log(`📛 Нэр: ${user.data.name}`);
    console.log(`✅ Twitter API холбогдсон!\n`);
    return user.data;
  } catch (error) {
    console.error(`❌ Account мэдээлэл авахад алдаа:`, error);
    throw error;
  }
}

/**
 * Rate limit шалгах
 */
export async function checkRateLimit(client) {
  try {
    const rateLimits = await client.v2.rateLimits();
    const tweetLimit = rateLimits['tweets'];
    
    if (tweetLimit) {
      const remaining = tweetLimit.remaining;
      const limit = tweetLimit.limit;
      const reset = new Date(tweetLimit.reset * 1000);
      
      console.log(`\n📊 Rate Limit:`);
      console.log(`   Үлдсэн: ${remaining}/${limit}`);
      console.log(`   Reset: ${reset.toLocaleString('mn-MN')}`);
      
      return { remaining, limit, reset };
    }
  } catch (error) {
    console.error(`❌ Rate limit шалгахад алдаа:`, error);
  }
  
  return null;
}
