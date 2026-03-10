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
    const hasNumbers = /\d/.test(article.title + (article.description || ''));
    const prompt = `Та дэлхийн технологийн мэдээ Монгол хэлээр хүргэдэг мэргэжлийн сэтгүүлч.

МЭДЭЭ:
Гарчиг: ${article.title}
Агуулга: ${article.description || '(агуулга байхгүй, гарчгаас дүгнэ)'}

ДААЛГАВАР: Дээрх мэдээг 2-3 өгүүлбэрт МОНГОЛ хэлээр дүгнэ.

ЗААВАЛ БИЕЛҮҮЛЭХ ДҮРМҮҮД:
1. ТООН МЭДЭЭЛЭЛ ЗААВАЛ: хувь (%), дүн ($), тоо хэмжээ, он сар, хугацаа байвал ЗААВАЛ оруул — эдгээргүй мэдээ хүлээн зөвшөөрөгдөхгүй
2. ЮУ БОЛСОН гэдгийг шууд хэл (асуулт, уриалга, сонирхол татах гэсэн хэллэг ХОРИОТОЙ)
3. НЭР ЗААВАЛ: компани, бүтээгдэхүүн, хүн, газар зүйн нэрийг орхихгүй
4. ҮГИЙН НЭМЭГДЭЛт хэллэг хориотой: "харцгаая", "сонирхолтой", "гайхалтай" гэх мэт
5. Эхний өгүүлбэрт ГАРЧГИЙН ГОЛ МЭДЭЭЛЛИЙГ оруул
6. Хоёрдахь өгүүлбэрт ТООН ЭСВЭл НЭМЭЛТ КОНТЕКСТ өг
7. Гуравдахь өгүүлбэрт (байвал) ЯГ ЮУ ӨӨРЧЛӨГДӨХ/ИРЭЭДҮЙн нөлөөг тайлбарла
8. Төгсгөлд 2-3 hashtag: #Технологи болон нэмэлт тохирох tag
9. 230-270 тэмдэгт байх
10. Зөвхөн tweet текстийг буцаа — тайлбар, тэмдэглэгдсэн хэллэг ХОРИОТОЙ
${hasNumbers ? '\n⚡ АНХААРАЛ: Мэдээнд тоон мэдээлэл бий — эдгээрийг ЗААВАЛ оруул!' : ''}

ЖИШЭЭ ЗӨВ ХАРИУ:
"Nvidia-н H100 GPU-н үнэ 2025 онд 40%-иар буурч $20,000 болсон нь AI дата төвүүдийн хөрөнгө оруулалтыг нэмэгдүүлж байна. Дэлхий даяар 500 гаруй компани H100 захиалга өгсөн тоо 3 дахин нэмэгдэв. Энэ нь хиймэл оюун ухааны бүтээн байгуулалтын зардал буурч эхэлж байгааг харуулж байна. #Технологи #AI #Nvidia"

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
