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

    const systemPrompt = `Та Монголын тэргүүлэх технологийн мэдээллийн сайтын тусгай сурвалжлагч. Англи хэлний технологийн мэдээг Монгол уншигчдад БАЙГАЛИЙН МОНГОЛ ХЭЛЛЭГЭЭР хүргэх нь чиний үүрэг.

МОНГОЛ ХЭЛНИЙ ДҮРМҮҮД:
— Мэдээний өнгөрсөн цаг хэрэглэ: "нэвтрүүллээ", "зарлав", "мэдэгдэв", "худалдаж авлаа", "хориглов"
— Идэвхтэй байдал: "X компани Y хийлаа" (идэвхтэй) ✓ | "X-н зүгээс Y хийгдэв" (идэвхгүй) ✗
— "нь" нөхцөлийг зөвхөн зайлшгүй шаардлагатай үед хэрэглэ, давтан хэрэглэхгүй
— Нэг өгүүлбэрт нэг санаа, тодорхой дүгнэлт
— Техникийн нэр томьёо: AI, GPU, chip, server, startup, app — эдгээрийг монголчлохгүй, тэр чигт нь хэрэглэ

ХОРИОТОЙ ХЭЛЛЭГҮҮД (ОГТХОН Ч БИЧИХГҮЙ):
✗ "...байгааг харуулж байна" → "...болж байна" / "...болов"
✗ "...гэж байна" / "...гэж мэдэгдэж байна" → "...гэж мэдэгдэв"
✗ "энэ нь маш чухал" / "энэ нь анхаарал татаж байна"
✗ "сонирхолтой", "гайхалтай", "хачирхалтай", "онцгой"
✗ "харцгаая", "анхааруулж байна", "санал болгож байна"
✗ Мөр бүр "...байна" гэж төгсгөх`;

    const userPrompt = `МЭДЭЭ:
Гарчиг: ${article.title}
Агуулга: ${article.description || '(агуулга байхгүй — гарчгийн үндсэн мэдээллийг дүгнэж бич)'}

ДААЛГАВАР: Дээрх мэдээг 2-3 өгүүлбэрт Монгол хэлээр tweet болгон бич.

ДҮРМҮҮД:
1. ТОО БАРИМТ ЗААВАЛ: %, $, он, тоо хэмжээ, хугацаа байвал заавал оруул${hasNumbers ? ' ⚡' : ''}
2. Компани, бүтээгдэхүүн, хүний нэр орхихгүй
3. Эхний өгүүлбэр — гол мэдээлэл (хэн, юу хийв)
4. Хоёрдахь өгүүлбэр — тоо баримт эсвэл нөхцөл байдал
5. Гуравдахь өгүүлбэр (байвал) — цаашдын нөлөө эсвэл ач холбогдол
6. Төгсгөлд 2-3 hashtag: #Технологи + холбогдох tag
7. 230-270 тэмдэгт
8. Зөвхөн tweet текст — тайлбар, тэмдэглэгдсэн үг ХОРИОТОЙ

МУУГИЙН ЖИШЭЭ (ингэж бичихгүй):
"OpenAI нь GPT-5 гаргасан нь технологийн салбарт маш чухал үйл явдал болж байна гэж мэдэгдэж байна. Энэ нь дэлхийн хиймэл оюун ухааны хөгжилд нөлөөлж байгааг харуулж байна."

САЙН ЖИШЭЭ (ингэж бич):
"OpenAI GPT-5 загварыг нэвтрүүллээ — өмнөх хувилбараас 3 дахин хурдан бөгөөд 50%-иар бага зардалтай. Анхны туршилтаар 1 сая хэрэглэгч нэг өдрийн дотор бүртгүүлэв. Компани 2025 оны эцэс гэхэд API-г бүх боломжит хэрэглэгчдэд нээхээр төлөвлөж байна. #Технологи #AI #OpenAI"

ОДОО БИЧНЭ ҮҮ:`;

    console.log('🔄 Claude AI-д хандаж байна...');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
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
