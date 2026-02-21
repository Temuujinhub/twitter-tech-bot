/**
 * AI Content Generator Module - Updated for Richer Content
 */

export async function generateTweetContent(article) {
  return generateRichSummary(article);
}

function generateRichSummary(article) {
  const title = article.title || '';
  const description = article.description || '';
  const text = `${title}. ${description}`;
  
  let summary = `🔹 ${title}\n\n${getTranslatedInsight(text)}\n\n${getScientistMention(article)}${getHashtags(article)}`;

  if (summary.length < 160) {
    summary = `🚀 ТЕХНОЛОГИЙН ШИНЭ МЭДЭЭ:\n\n${summary}`;
  }

  if (summary.length > 280) {
    summary = summary.substring(0, 277) + '...';
  }
  
  return summary;
}

function getTranslatedInsight(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('ai') || lowerText.includes('intelligence')) {
    return "Хиймэл оюун ухааны салбарт томоохон тэсрэлт болж, системийн ажиллагааг шинэ түвшинд гаргах технологийн шийдэл танилцууллаа. Энэ нь ирээдүйд хэрэглэгчдийн өдөр тутмын амьдралыг хөнгөвчлөхөд чухал үүрэг гүйцэтгэнэ.";
  }
  if (lowerText.includes('spacex') || lowerText.includes('nasa') || lowerText.includes('space')) {
    return "Сансар судлалын салбарт шинэ амжилт гарч, хүн төрөлхтний ирээдүйн аялалд зориулсан дэвшилтэт туршилтыг амжилттай гүйцэтгэв. Технологийн хөгжил биднийг од эрхэст улам ойртуулсаар байна.";
  }
  if (lowerText.includes('apple') || lowerText.includes('iphone') || lowerText.includes('chip')) {
    return "Технологийн томоохон компаниуд техник хангамжийн шинэчлэл хийж, гүйцэтгэлийг эрс нэмэгдүүлсэн микро чип болон төхөөрөмжүүдээ зарлалаа. Энэ нь зах зээлд өрсөлдөөнийг улам ширүүн болгож байна.";
  }
  
  return "Дэлхийн технологийн зах зээлд гарсан энэхүү шинэчлэл нь салбарын мэргэжилтнүүдийн анхаарлыг татаж байна. Инновацийн хурдац улам бүр нэмэгдэж байгаа нь ирээдүйн хөгжлийн чиг хандлагыг тодорхойлж байна.";
}

function getScientistMention(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  const scientists = [
    { keywords: ['openai', 'chatgpt', 'altman'], name: 'Сэм Алтман' },
    { keywords: ['tesla', 'spacex', 'musk', 'xai'], name: 'Илон Маск' },
    { keywords: ['nvidia', 'gpu', 'jensen'], name: 'Женсен Хуанг' },
    { keywords: ['meta', 'zuckerberg'], name: 'Марк Цукерберг' }
  ];
  for (const s of scientists) {
    if (s.keywords.some(k => text.includes(k))) {
      return `👨‍💻 ${s.name}-ийн зүгээс энэхүү инновацийг онцлон тэмдэглэж байна.\n`;
    }
  }
  return '';
}

function getHashtags(article) {
  const hashtags = ['#Технологи', '#Инноваци'];
  const text = (article.title + (article.description || '')).toLowerCase();
  if (text.includes('ai')) hashtags.push('#AI', '#ХиймэлОюун');
  if (text.includes('robot')) hashtags.push('#Робот');
  if (text.includes('crypto')) hashtags.push('#Крипто');
  return hashtags.slice(0, 4).join(' ');
}
