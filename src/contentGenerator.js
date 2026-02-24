import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateTweetContent(article) {
  try {
    // Gemini 2.0 Flash ашиглах
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
    
    const prompt = `Та технологийн мэдээг Монгол хэл дээр товч хүргэдэг мэргэжилтэн.

МЭДЭЭ:
${article.title}
${article.description || ''}

ДААЛГАВАР: Энэ мэдээг Монгол хэл дээр 250 тэмдэгтэд багтаан бич.

Шаардлага:
- Мэдээний гол санааг Монгол хэлээр 2-3 өгүүлбэрт багтаа
- Төгсгөлд #Технологи #Инноваци болон холбогдох hashtag нэм
- 250 тэмдэгтээс хэтрэхгүй
- Зөвхөн текстийг буцаа`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log('✅ Gemini товчлол амжилттай');
    return response.text().trim();
  } catch (error) {
    console.log(`⚠️ Gemini алдаа: ${error.message}`);
    console.log('📝 Fallback ашиглаж байна...');
    return generateFallbackSummary(article);
  }
}

function generateFallbackSummary(article) {
  const title = article.title || '';
  const description = article.description || '';
  const hashtags = getHashtags(article);
  
  let content = description
    .replace(/<[^>]*>/g, '')
    .replace(/This story originally appeared.*$/gi, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (!content || content.length < 30) {
    content = title;
  }
  
  const maxLen = 250 - hashtags.length - 5;
  if (content.length > maxLen) {
    content = content.substring(0, maxLen - 3) + '...';
  }
  
  return `${content}\n\n${hashtags}`;
}

function getHashtags(article) {
  const hashtags = ['#Технологи', '#Инноваци'];
  const text = (article.title + (article.description || '')).toLowerCase();
  if (text.includes('ai') || text.includes('intelligence')) hashtags.push('#AI');
  if (text.includes('robot')) hashtags.push('#Робот');
  if (text.includes('crypto')) hashtags.push('#Крипто');
  return hashtags.slice(0, 4).join(' ');
}
