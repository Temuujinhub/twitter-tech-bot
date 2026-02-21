/**
 * AI ашиглан монгол хэлээр контент үүсгэх модуль
 */

/**
 * Мэдээнээс Twitter пост үүсгэх (AI ашиглан)
 */
export async function generateTweetContent(article) {
  const prompt = `Дараах технологийн мэдээг монгол хэлээр товч, сонирхолтой Twitter пост болгон бичээрэй. Мэдээлэл болон дүн шинжилгээ багтаасан байх. 250 тэмдэгтээс хэтрэхгүй.

Гарчиг: ${article.title}
Тайлбар: ${article.description?.substring(0, 500)}
Эх сурвалж: ${article.source}

Та дараах зарчмуудыг дагаарай:
1. Монгол хэлээр бичих
2. Сонирхолтой, анхаарал татах
3. Мэдээллийн үнэ цэнэтэй
4. Emoji багтаасан (1-2 ширхэг)
5. Hashtag нэмэх (#AI #Tech #Startup гэх мэт)

Зөвхөн пост-ын текстийг буцаа, өөр юм бичих хэрэггүй:`;

  try {
    // Энд та Skycode LLM API эсвэл өөр AI API ашиглаж болно
    // Одоогоор жишээ template ашиглая
    
    const tweet = await generateWithTemplate(article);
    return tweet;
  } catch (error) {
    console.error('AI контент үүсгэхэд алдаа:', error);
    // Fallback - template ашиглах
    return generateWithTemplate(article);
  }
}

/**
 * Template ашиглан пост үүсгэх (fallback)
 */
function generateWithTemplate(article) {
  const templates = [
    {
      format: (a) => `🚀 ${shortenTitle(a.title)}\n\n${getSummary(a)}\n\n${getScientistMention(a)}\n\n🔗 Дэлгэрэнгүй: ${a.link}\n\n${getHashtags(a)}`,
      weight: 3
    },
    {
      format: (a) => `💡 Шинэ технологи: ${shortenTitle(a.title)}\n\n${getScientistMention(a)} ${getInsight(a)}\n\n📖 Унших: ${a.link}\n\n${getHashtags(a)}`,
      weight: 2
    },
    {
      format: (a) => `⚡ ${shortenTitle(a.title)}\n\n${getQuestion(a)}\n\n${getSummary(a)}\n\n${getScientistMention(a)}\n\n${a.link}\n\n${getHashtags(a)}`,
      weight: 2
    },
    {
      format: (a) => `🔥 Технологийн мэдээ:\n\n${shortenTitle(a.title)}\n\n${getScientistMention(a)} ${getKeyPoint(a)}\n\n${getHashtags(a)}\n\n${a.link}`,
      weight: 1
    }
  ];
  
  // Weighted random selection
  const template = weightedRandom(templates);
  let tweet = template.format(article);
  
  // 280 тэмдэгтээс илүү бол товчлох
  if (tweet.length > 280) {
    tweet = tweet.substring(0, 277) + '...';
  }
  
  return tweet;
}

/**
 * Мэдээний агуулгаас хамааран эрдэмтэн/инженерүүдийг дурдах
 */
function getScientistMention(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  
  const scientists = [
    { keywords: ['openai', 'chatgpt', 'altman'], name: 'Сэм Алтман' },
    { keywords: ['tesla', 'spacex', 'xai', 'musk'], name: 'Илон Маск' },
    { keywords: ['nvidia', 'gpu', 'jensen'], name: 'Женсен Хуанг' },
    { keywords: ['meta', 'facebook', 'zuckerberg'], name: 'Марк Цукерберг' },
    { keywords: ['microsoft', 'gates', 'nadella'], name: 'Сатя Наделла' },
    { keywords: ['google', 'pichai', 'deepmind'], name: 'Сундар Пичай' },
    { keywords: ['apple', 'iphone', 'cook'], name: 'Тим Кук' },
    { keywords: ['amazon', 'bezos'], name: 'Жефф Безос' }
  ];

  for (const s of scientists) {
    if (s.keywords.some(k => text.includes(k))) {
      return `\n👨‍💻 ${s.name}-ийн оролцоотой энэхүү төсөл анхаарал татаж байна.`;
    }
  }

  return '';
}

/**
 * Hashtags үүсгэх
 */
function getHashtags(article) {
  const hashtags = [];
  const text = `${article.title} ${article.description}`.toLowerCase();
  
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('chatgpt')) {
    hashtags.push('#AI', '#ArtificialIntelligence', '#ХиймэлОюун');
  }
  if (text.includes('startup') || text.includes('funding') || text.includes('venture')) {
    hashtags.push('#Startup', '#Innovation', '#Стартап');
  }
  if (text.includes('solar') || text.includes('renewable') || text.includes('energy') || text.includes('climate')) {
    hashtags.push('#CleanEnergy', '#GreenTech', '#ЭрчимХүч');
  }
  if (text.includes('robot') || text.includes('automation') || text.includes('tesla bot')) {
    hashtags.push('#Robotics', '#Automation', '#Робот');
  }
  if (text.includes('crypto') || text.includes('bitcoin') || text.includes('blockchain')) {
    hashtags.push('#Crypto', '#Blockchain', '#Блокчэйн');
  }
  if (text.includes('nvidia') || text.includes('gpu') || text.includes('chip')) {
    hashtags.push('#Nvidia', '#GPU', '#Semiconductor');
  }
  
  // Default hashtags
  if (hashtags.length === 0) {
    hashtags.push('#Tech', '#Innovation', '#Технологи');
  }
  
  // Unique hashtags, slice top 3
  return [...new Set(hashtags)].slice(0, 3).join(' ');
}

  ];
  
  // Weighted random selection
  const template = weightedRandom(templates);
  const tweet = template.format(article);
  
  // 280 тэмдэгтээс илүү бол товчлох
  if (tweet.length > 280) {
    return tweet.substring(0, 277) + '...';
  }
  
  return tweet;
}

/**
 * Гарчгийг товчлох
 */
function shortenTitle(title) {
  if (title.length <= 80) return title;
  return title.substring(0, 77) + '...';
}

/**
 * Товч дүгнэлт гаргах
 */
function getSummary(article) {
  const desc = article.description || '';
  
  // AI keywords-оор дүгнэлт үүсгэх
  if (desc.toLowerCase().includes('chatgpt') || desc.toLowerCase().includes('ai')) {
    return 'Хиймэл оюун ухааны салбарт дахин нэг чухал алхам.';
  }
  if (desc.toLowerCase().includes('startup') || desc.toLowerCase().includes('funding')) {
    return 'Технологийн startup-ууд үргэлжлүүлэн хөгжиж байна.';
  }
  if (desc.toLowerCase().includes('solar') || desc.toLowerCase().includes('renewable')) {
    return 'Цэвэр эрчим хүчний салбарт сонирхолтой хөгжил.';
  }
  
  return desc.substring(0, 100) + '...';
}

/**
 * Асуулт үүсгэх
 */
function getQuestion(article) {
  const questions = [
    'Энэ нь ирээдүйг өөрчлөх үү?',
    'Та юу бодож байна?',
    'Сонирхолтой биш гэж үү?',
    'Та энийг мэдэх үү?'
  ];
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Гол санаа гаргах
 */
function getKeyPoint(article) {
  return `${article.source} эх сурвалжийн мэдээлснээр...`;
}

/**
 * Insights гаргах
 */
function getInsight(article) {
  const insights = [
    'Технологи хурдтай хөгжиж байна.',
    'Энэ бол чухал мэдээ юм.',
    'Анхаарал татахуйц хөгжил.',
    'Ирээдүйд үнэ цэнэтэй байж магадгүй.'
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

/**
 * Hashtags үүсгэх
 */
function getHashtags(article) {
  const hashtags = [];
  const text = `${article.title} ${article.description}`.toLowerCase();
  
  if (text.includes('ai') || text.includes('artificial intelligence') || text.includes('chatgpt')) {
    hashtags.push('#AI', '#MachineLearning');
  }
  if (text.includes('startup') || text.includes('funding')) {
    hashtags.push('#Startup', '#Innovation');
  }
  if (text.includes('solar') || text.includes('renewable') || text.includes('energy')) {
    hashtags.push('#CleanEnergy', '#GreenTech');
  }
  if (text.includes('robot') || text.includes('automation')) {
    hashtags.push('#Robotics', '#Automation');
  }
  
  // Default hashtags
  if (hashtags.length === 0) {
    hashtags.push('#Tech', '#Innovation');
  }
  
  return hashtags.slice(0, 3).join(' ');
}

/**
 * Weighted random selection
 */
function weightedRandom(items) {
  const weights = items.map(item => item.weight);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  return items[items.length - 1];
}
