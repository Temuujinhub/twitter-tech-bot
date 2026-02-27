import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateTweetContent(article) {
  try {
    const modelNames = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-pro",
      "gemini-2.0-flash-exp"
    ];
    
    let lastError = null;
    
    const prompt = `Та мэдээллийн агентлагийн мэргэжлийн сэтгүүлч. Технологийн мэдээг тодорхой, товч, мэдээллийн хэлбэрээр Монгол хэл дээр хүргэдэг.

МЭДЭЭ:
Гарчиг: ${article.title}
Агуулга: ${article.description || ''}

ЧИГЛЭЛ:
Энэ мэдээг 2-3 өгүүлбэрт БҮРЭН, ТОДОРХОЙ, ДУУССАН мэдээлэл болгон Монгол хэлээр дүгнэ.

ЗААВАЛ ДАГАХ ДҮРЭМ:
1. МЭДЭЭЛЛИЙН хэлбэр (асуулт ХОРИОТОЙ, сонирхоцгооё/харцгаая гэх дуудлага ХОРИОТОЙ)
2. ГОЛ САНАА, БОДИТ ҮР ДҮН, ЮУ БОЛСОН-ыг ТОДОРХОЙ өгүүл
3. Тоо, хэмжээ, хувь, нэр байвал ЗААВАЛ дурдах (95%, Google, 1 сая гэх мэт)
4. БҮРЭН ДУУССАН мэдээлэл - уншигч нэмэлт асуулт асуухгүй байх
5. Контекст өг - энэ нь юунд чухал, ямар өөрчлөлт гарч байгааг тайлбарла
6. Төгсгөлд #Технологи #Инноваци болон холбогдох 1-2 hashtag нэм
7. 240-270 тэмдэгт байх (линк байхгүй тул агуулга дүүрэн бай)
8. Зөвхөн бэлэн текстийг буцаа (тайлбар хэрэггүй)

ЖИШЭЭ:
"OpenAI-н GPT-4 загвар 95% нарийвчлалаар эмнэлгийн оношлогоонд хүний мэргэжилтнээс давсан нь шинжлэх ухааны сэтгүүлд нийтлэгдлээ. Энэ нь AI эрүүл мэндийн салбарт томоохон алхам болж байна. #Технологи #Инноваци #AI"

ОДОО ДАРААХ МЭДЭЭГ ДҮГНЭ:`;
    
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
        continue;
      }
    }
    
    console.log('⚠️ Бүх Gemini model-ууд амжилтгүй боллоо. Fallback ашиглаж байна...');
    return generateFallbackSummary(article);
  } catch (error) {
    console.log(`⚠️ Системийн алдаа: ${error.message}`);
    return generateFallbackSummary(article);
  }
}

function generateFallbackSummary(article) {
  const hashtags = getHashtags(article);
  let content = (article.description || article.title)
    .replace(/<[^>]*>/g, '')
    .trim();
  
  if (content.length > 200) {
    content = content.substring(0, 197) + '...';
  }
  
  return `${content}\n\n${hashtags}`;
}

function getHashtags(article) {
  const hashtags = ['#Технологи', '#Инноваци'];
  const text = (article.title + (article.description || '')).toLowerCase();
  if (text.includes('ai')) hashtags.push('#AI');
  if (text.includes('robot')) hashtags.push('#Робот');
  return hashtags.slice(0, 4).join(' ');
}
