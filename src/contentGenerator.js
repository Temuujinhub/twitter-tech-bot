import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateTweetContent(article) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('⚠️ ANTHROPIC_API_KEY тохируулагдаагүй. Fallback ашиглаж байна...');
    return generateFallbackSummary(article);
  }

  try {
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

    console.log('🔄 Claude AI-д хандаж байна...');

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const text = message.content[0].text.trim();
    console.log('✅ Claude AI товчлол амжилттай');
    return text;
  } catch (error) {
    console.log(`⚠️ Claude AI алдаа: ${error.message}`);
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
