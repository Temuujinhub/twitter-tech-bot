import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateTweetContent(article) {
  try {
    // Gemini models оролдох дараалал: 2.5-flash (ажиллаж байгаа) -> бусад
    const modelNames = [
      "gemini-2.5-flash",      // ✅ Одоо ажиллаж байгаа model
      "gemini-1.5-flash",      // Fallback 1
      "gemini-1.5-pro",        // Fallback 2
      "gemini-pro"             // Fallback 3
    ];
    
    let lastError = null;
    
    const prompt = `Та технологийн мэдээг Монгол хэл дээр товч, сонирхолтой хүргэдэг мэргэжилтэн.

МЭДЭЭ:
${article.title}
${article.description || ''}

ДААЛГАВАР: Энэ мэдээг Монгол хэл дээр 250 тэмдэгтэд багтаан бич.

Шаардлага:
- Мэдээний гол санааг Монгол хэлээр 2-3 өгүүлбэрт тодорхой бич
- Төгсгөлд #Технологи #Инноваци болон холбогдох hashtag нэм
- 250 тэмдэгтээс хэтрэхгүй байх
- Зөвхөн бэлэн текстийг буцаа (тайлбар, хашилт хэрэггүй)`;
    
    // Дарааллаар model-уудыг оролдох
    for (const modelName of modelNames) {
      try {
        console.log(`🔄 ${modelName} оролдож байна...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        console.log(`✅ Gemini товчлол амжилттай (model: ${modelName})`);
        return text;
      } catch (error) {
        lastError = error;
        console.log(`⚠️ ${modelName} алдаа: ${error.message.substring(0, 100)}...`);
        // Дараагийн model руу үргэлжлүүлэх
        continue;
      }
    }
    
    // Бүх model амжилтгүй бол fallback ашиглах
    console.log('⚠️ Бүх Gemini model-ууд амжилтгүй боллоо');
    console.log(`📝 Сүүлийн алдаа: ${lastError?.message.substring(0, 150)}...`);
    console.log('📝 Fallback ашиглаж байна...');
    return generateFallbackSummary(article);
  } catch (error) {
    console.log(`⚠️ Gemini системийн алдаа: ${error.message}`);
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
