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
    const systemPrompt = `Та технологийн мэдээг Монгол уншигчдад хүргэдэг мэргэжлийн сэтгүүлч. Чиний зорилго бол англи эх сурвалжийг ШУУД ОРЧУУЛАХГҮЙГЭЭР, Монгол хэлний хэм хэмжээнд нийцсэн, ойлгоход хялбар, тодорхой мэдээлэл бичих явдал юм. Орчуулгын алдаа, хиймэл хэллэг, шаардлагагүй зүйлгүй байх.`;

    const userPrompt = `МЭДЭЭ:
Гарчиг: ${article.title}
Агуулга: ${article.description || '(агуулга байхгүй, гарчгаас дүгнэж бич)'}

ДААЛГАВАР: Дээрх мэдээг 2-3 өгүүлбэрт МОНГОЛ хэлээр дүгнэн tweet бич.

ЗААВАЛ БИЕЛҮҮЛЭХ ДҮРМҮҮД:
1. ТООН МЭДЭЭЛЭЛ ЗААВАЛ: хувь (%), мөнгөн дүн ($), тоо хэмжээ, огноо, хугацаа байвал заавал оруул
2. ЮУ БОЛСОН гэдгийг шууд, тодорхой бич — асуулт, уриалга, "харцгаая" гэх хэллэг хориотой
3. НЭР ОРХИХГҮЙ: компани, бүтээгдэхүүн, хүн, газар нутгийн нэр заавал оруул
4. ИЛҮҮДЭЛ ҮГНҮҮД хориотой: "сонирхолтой", "гайхалтай", "хачирхалтай", "маш чухал" гэх мэт
5. ШУУД ОРЧУУЛГА хориотой: Монгол хэлний байгалийн хэм хэмжээнд нийцүүлэн бич
6. Эхний өгүүлбэрт ГАРЧГИЙН ГОЛ МЭДЭЭЛЛИЙГ тодорхой оруул
7. Хоёрдахь өгүүлбэрт ТОО БАРИМТ эсвэл НЭМЭЛТ НӨХЦӨЛ өг
8. Гуравдахь өгүүлбэрт (байвал) ЯГ ЮУ ӨӨРЧЛӨГДӨХ буюу ЦААШДЫН нөлөөг тайлбарла
9. Төгсгөлд 2-3 hashtag: #Технологи болон холбогдох tag
10. 230-270 тэмдэгт байх
11. Зөвхөн tweet текстийг буцаа — ямар ч тайлбар, нэмэлт тодруулга ХОРИОТОЙ
${hasNumbers ? '\n⚡ АНХААРАЛ: Мэдээнд тоон мэдээлэл бий — эдгээрийг ЗААВАЛ оруул!' : ''}

ЖИШЭЭ ЗӨВ ХАРИУ:
"Nvidia-н H100 GPU-н үнэ 2025 онд 40%-иар буурч $20,000 болсон нь AI дата төвүүдийн хөрөнгө оруулалтыг нэмэгдүүлж байна. Дэлхий даяар 500 гаруй компани H100 захиалга өгсөн тоо 3 дахин нэмэгдэв. Энэ нь хиймэл оюун ухааны бүтээн байгуулалтын зардал буурч эхэлж байгааг харуулж байна. #Технологи #AI #Nvidia"

ОДОО ДАРААХ МЭДЭЭГ ДҮГНЭ:`;

    console.log('🔄 Claude AI-д хандаж байна...');

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt }
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
