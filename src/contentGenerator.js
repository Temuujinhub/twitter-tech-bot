/**
 * AI Content Generator Module - Updated for Richer Content
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateTweetContent(article) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
    Чи бол технологийн мэдээг Монгол хэл дээр товч, ойлгомжтой, сонирхолтой байдлаар хүргэдэг мэргэжлийн сэтгүүлч юм.
    
    Дараах мэдээг ашиглан Twitter (X) дээр нийтлэх богино хэмжээний пост бэлтгэ.
    
    Мэдээний гарчиг: ${article.title}
    Мэдээний тайлбар: ${article.description}
    Эх сурвалж: ${article.source}
    
    Шаардлага:
    1. Монгол хэл дээр бичнэ.
    2. Мэдээний гол агуулгыг 2-3 өгүүлбэрт багтааж, маш товч бөгөөд сонирхолтой байдлаар бич.
    3. "Хиймэл оюун ухааны салбарт томоохон тэсрэлт болж..." гэх мэт ерөнхий үг хэллэг БҮҮ ашигла. Яг тухайн мэдээний онцлогийг дурд.
    4. Эможи ашигла (гэхдээ хэтрүүлж болохгүй).
    5. Төгсгөлд нь 2-3 холбогдох hashtag нэм (#Технологи #Инноваци гэх мэт).
    6. Нийт урт нь 280 тэмдэгтээс хэтрэхгүй байх ёстой.
    7. Зөвхөн бэлэн текстийг буцаа (хашилт, тайлбар хэрэггүй).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Gemini API алдаа:", error.message);
    return generateFallbackSummary(article);
  }
}

function generateFallbackSummary(article) {
  const title = article.title || '';
  const description = article.description || '';
  const text = `${title}. ${description}`;
  
  const insight = getTranslatedInsight(text, title);
  const hashtags = getHashtags(article);
  
  // Format: emoji + insight + hashtags (no duplicate title)
  let summary = `🔹 ${insight}\n\n${hashtags}`;

  if (summary.length > 280) {
    summary = summary.substring(0, 277) + '...';
  }
  
  return summary;
}

function getTranslatedInsight(text, title) {
  const lowerText = text.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  // Robot & Humanoid
  if (lowerText.includes('robot') || lowerText.includes('humanoid')) {
    if (lowerText.includes('work') || lowerText.includes('labor') || lowerText.includes('human')) {
      return "Робот технологийн ард нуугдаж буй хүний ажил: шинэ нээлт гарлаа.";
    }
    return "Робот технологи: шинэ ахиц дэвшил бүртгэгдлээ.";
  }
  
  // AI specific topics
  if (lowerText.includes('ai') || lowerText.includes('artificial intelligence')) {
    if (lowerText.includes('chatgpt') || lowerText.includes('openai')) {
      return "OpenAI-н шинэ бүтээл танилцуулагдлаа.";
    }
    if (lowerText.includes('google') || lowerText.includes('gemini') || lowerText.includes('bard')) {
      return "Google AI-д томоохон өөрчлөлт орлоо.";
    }
    if (lowerText.includes('training') || lowerText.includes('dataset')) {
      return "AI сургалтын шинэ арга танилцуулагдлаа.";
    }
    return "Хиймэл оюун ухаан: сонирхолтой ахиц гарлаа.";
  }
  
  // Space & Rockets
  if (lowerText.includes('spacex') || lowerText.includes('starship') || lowerText.includes('rocket')) {
    return "SpaceX: шинэ онгоцны туршилт амжилттай боллоо.";
  }
  if (lowerText.includes('nasa') || lowerText.includes('mars') || lowerText.includes('moon')) {
    return "Сансрын шинжлэх ухаанд шинэ нээлт гарлаа.";
  }
  
  // Tech Companies
  if (lowerText.includes('apple')) {
    if (lowerText.includes('iphone')) return "iPhone-ы шинэ загвар танилцуулагдлаа.";
    if (lowerText.includes('chip') || lowerText.includes('processor')) return "Apple өөрийн чип үйлдвэрлэлээ өргөжүүллээ.";
    return "Apple-ын шинэ бүтээгдэхүүн гарлаа.";
  }
  if (lowerText.includes('tesla') || lowerText.includes('electric vehicle')) {
    return "Цахилгаан машины салбарт шинэ мэдээ гарлаа.";
  }
  if (lowerText.includes('meta') || lowerText.includes('facebook')) {
    return "Meta-н шинэ технологи танилцуулагдлаа.";
  }
  
  // Crypto & Blockchain
  if (lowerText.includes('bitcoin') || lowerText.includes('crypto') || lowerText.includes('blockchain')) {
    return "Криптовалют зах зээлд шинэ хөдөлгөөн гарлаа.";
  }
  
  // General tech
  if (lowerText.includes('startup') || lowerText.includes('funding')) {
    return "Шинэ startup-д томоохон хөрөнгө оруулалт орлоо.";
  }
  
  // Shortened version of title for generic cases
  const shortTitle = title.split(' ').slice(0, 8).join(' ');
  return shortTitle.length > 50 ? shortTitle.substring(0, 50) + '...' : shortTitle;
}

function getHashtags(article) {
  const hashtags = ['#Технологи', '#Инноваци'];
  const text = (article.title + (article.description || '')).toLowerCase();
  if (text.includes('ai')) hashtags.push('#AI', '#ХиймэлОюун');
  if (text.includes('robot')) hashtags.push('#Робот');
  if (text.includes('crypto')) hashtags.push('#Крипто');
  return hashtags.slice(0, 4).join(' ');
}
