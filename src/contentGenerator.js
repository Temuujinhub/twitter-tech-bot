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
  
  let summary = `🔹 ${title}\n\n${getTranslatedInsight(text)}\n\n${getHashtags(article)}`;

  if (summary.length > 280) {
    summary = summary.substring(0, 277) + '...';
  }
  
  return summary;
}

function getTranslatedInsight(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ai') || lowerText.includes('intelligence')) {
    return "Хиймэл оюун ухааны салбарт шинэ дэвшил гарлаа.";
  }
  if (lowerText.includes('spacex') || lowerText.includes('nasa') || lowerText.includes('space')) {
    return "Сансар судлалын салбарт шинэ амжилт бүртгэгдлээ.";
  }
  if (lowerText.includes('apple') || lowerText.includes('iphone') || lowerText.includes('chip')) {
    return "Технологийн шинэ төхөөрөмж танилцуулагдлаа.";
  }
  
  return "Технологийн ертөнцөд шинэ мэдээ гарлаа.";
}

function getHashtags(article) {
  const hashtags = ['#Технологи', '#Инноваци'];
  const text = (article.title + (article.description || '')).toLowerCase();
  if (text.includes('ai')) hashtags.push('#AI', '#ХиймэлОюун');
  if (text.includes('robot')) hashtags.push('#Робот');
  if (text.includes('crypto')) hashtags.push('#Крипто');
  return hashtags.slice(0, 4).join(' ');
}
