/**
 * AI Content Generator Module
 */

export async function generateTweetContent(article) {
  return generateWithTemplate(article);
}

function generateWithTemplate(article) {
  const templates = [
    { format: (a) => `🚀 ${shortenTitle(a.title)}\n\n${getSummary(a)}\n\n${getScientistMention(a)}\n\n🔗 Link: ${a.link}\n\n${getHashtags(a)}` },
    { format: (a) => `💡 New Tech: ${shortenTitle(a.title)}\n\n${getScientistMention(a)} ${getInsight(a)}\n\n📖 Read: ${a.link}\n\n${getHashtags(a)}` }
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  let tweet = template.format(article);
  
  if (tweet.length > 280) {
    tweet = tweet.substring(0, 277) + '...';
  }
  return tweet;
}

function shortenTitle(title) {
  return title.length <= 80 ? title : title.substring(0, 77) + '...';
}

function getSummary(article) {
  const desc = article.description || '';
  if (desc.toLowerCase().includes('ai')) return 'Хиймэл оюун ухааны салбарын сонирхолтой мэдээ.';
  return 'Технологийн салбарт гарсан шинэ өөрчлөлт.';
}

function getInsight(article) {
  return 'Энэ бол маш чухал мэдээ юм.';
}

function getScientistMention(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  const scientists = [
    { keywords: ['openai', 'chatgpt', 'altman'], name: 'Сэм Алтман' },
    { keywords: ['tesla', 'spacex', 'musk'], name: 'Илон Маск' },
    { keywords: ['nvidia', 'jensen'], name: 'Женсен Хуанг' }
  ];
  for (const s of scientists) {
    if (s.keywords.some(k => text.includes(k))) {
      return `\n👨‍💻 ${s.name}-ийн оролцоотой энэхүү төсөл анхаарал татаж байна.`;
    }
  }
  return '';
}

function getHashtags(article) {
  const hashtags = [];
  const text = `${article.title} ${article.description}`.toLowerCase();
  if (text.includes('ai')) hashtags.push('#AI', '#ХиймэлОюун');
  if (text.includes('startup')) hashtags.push('#Startup', '#Стартап');
  if (hashtags.length === 0) hashtags.push('#Tech', '#Innovation');
  return hashtags.slice(0, 3).join(' ');
}
