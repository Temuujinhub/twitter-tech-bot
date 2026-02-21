# 🤖 Twitter Tech Bot

**Дэлхийн технологийн мэдээг автоматаар монгол хэлээр Twitter-т пост хийдэг бот**

Энэ бот AI, Startups, шинэ технологи, нарны зай, ургамал гэх мэт сонирхолтой сэдвүүдийн мэдээг TechCrunch, Hacker News, Reddit зэрэг эх сурвалжаас цуглуулж, монгол хэлээр оригинал контент үүсгэж, зурагтай хамт өдөрт 5 удаа Twitter-т автоматаар пост хийнэ.

--- хаалт засав

## ✨ Онцлог

- ✅ **Автомат мэдээ цуглуулалт** - RSS, Reddit, Hacker News-аас tech мэдээ
- ✅ **Монгол хэлээр контент** - Мэдээлэл + дүн шинжилгээ стильтэй
- ✅ **Зургаар баяжуулсан** - Эх сурвалжийн зураг автоматаар татаж оруулна
- ✅ **Өдөрт 5 удаа** - Санамсаргүй цагт автомат пост
- ✅ **Сонирхолтой сэдвүүд** - AI, Startups, Solar Panel, шинэ материал гэх мэт

---

## 📁 Бүтэц

```
twitter-tech-bot/
├── src/
│   ├── index.js              # Үндсэн файл
│   ├── newsCollector.js      # Мэдээ цуглуулах
│   ├── contentGenerator.js   # Монгол контент үүсгэх
│   ├── imageHandler.js       # Зураг татах, боловсруулах
│   ├── twitterClient.js      # Twitter API
│   └── scheduler.js          # Автомат хуваарь
├── config/
│   ├── .env.example          # Тохиргоо жишээ
│   └── sources.json          # Эх сурвалжийн тохиргоо
├── data/                     # Мэдээ болон зураг хадгалах
├── logs/                     # Лог файлууд
└── package.json
```

---

## 🚀 Суулгах заавар

### 1. Repository татаж авах

```bash
cd /mnt/workspace/6rRR86eTfCKjp6g1ZR6eBs
cd twitter-tech-bot
```

### 2. Dependencies суулгах

```bash
npm install
```

### 3. Twitter API эрх авах

1. [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) руу нэвтрэх
2. **Project** болон **App** үүсгэх
3. **Keys and Tokens** хэсэгт очиж дараах мэдээллийг авах:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret

### 4. Тохиргоо файл үүсгэх

```bash
cp config/.env.example config/.env
```

`.env` файлыг нээгээд Twitter API keys-ээ оруулна:

```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here

POSTS_PER_DAY=5
MIN_HOUR=8
MAX_HOUR=23
```

---

## 🎮 Ашиглах заавар

### Тест горим (Twitter руу пост хийлгүйгээр шалгах)

```bash
npm start test
```

Энэ нь:
- Мэдээ цуглуулна
- Монгол контент үүсгэнэ
- Twitter руу пост хийхгүй, зөвхөн харуулна

### Нэг удаа пост хийх

```bash
npm start
```

### Автомат горим (өдөрт 5 удаа)

```bash
npm run schedule
```

Энэ нь:
- Өдөрт 5 удаа санамсаргүй цагт пост хийнэ
- 8:00-23:00 цагийн хооронд ажиллана
- Өөрөө тасалгүй ажиллана (Ctrl+C дарж зогсооно)

---

## ⚙️ Тохиргоо

### `config/.env`

```env
# Өдөрт хэдэн удаа пост хийх
POSTS_PER_DAY=5

# Цагийн хязгаар
MIN_HOUR=8    # Өглөөний 8 цагаас
MAX_HOUR=23   # Оройны 11 цаг хүртэл

# OpenAI API (optional - AI контент үүсгэхэд)
OPENAI_API_KEY=your_key_here
```

### `config/sources.json`

Энд эх сурвалжуудаа нэмж, keyword-үүдээ өөрчлөх боломжтой:

```json
{
  "rssFeeds": [
    {
      "name": "TechCrunch",
      "url": "https://techcrunch.com/feed/",
      "topics": ["AI", "Startups"]
    }
  ],
  "keywords": [
    "artificial intelligence",
    "solar panel",
    "new materials"
  ]
}
```

---

## 📊 Жишээ пост

```
🚀 OpenAI шинэ GPT-5 танилцуулахаар төлөвлөж байна

Хиймэл оюун ухааны салбарт дахин нэг чухал алхам. 
Илүү хүчирхэг, илүү найдвартай AI ирж байна.

Та юу бодож байна?

🔗 Дэлгэрэнгүй: techcrunch.com/...

#AI #MachineLearning #Tech
```

---

## 🛠️ Командууд

| Команд | Тайлбар |
|--------|---------|
| `npm install` | Dependencies суулгах |
| `npm start` | Нэг удаа пост хийх |
| `npm start test` | Тест горим (пост хийхгүй) |
| `npm run schedule` | Автомат горим эхлүүлэх |

---

## 📝 Лог

Бүх үйл ажиллагаа console-д харагдана. Хэрэв файл руу хадгалахыг хүсвэл:

```bash
npm run schedule >> logs/bot.log 2>&1
```

---

## 🐛 Алдаа засах

### "Twitter API keys буруу" гэсэн алдаа

```bash
# .env файлаа шалгах
cat config/.env

# Twitter Developer Portal дээр keys дахин үүсгэх
```

### "Мэдээ олдсонгүй"

```bash
# Internet холболтоо шалгах
ping techcrunch.com

# config/sources.json файл байгаа эсэхийг шалгах
cat config/sources.json
```

### "Rate limit хэтэрсэн"

Twitter-т цагт 50 tweet хязгаар байдаг. Хэрэв хэтэрвэл 15 минут хүлээнэ үү.

---

## 🚀 Deployment

### PM2 ашиглах (Recommended)

```bash
# PM2 суулгах
npm install -g pm2

# Bot-оо ажиллуулах
pm2 start src/scheduler.js --name twitter-bot

# Статус шалгах
pm2 status

# Лог үзэх
pm2 logs twitter-bot

# Зогсооно
pm2 stop twitter-bot

# Restart
pm2 restart twitter-bot
```

### Systemd service (Linux)

```bash
# Service файл үүсгэх
sudo nano /etc/systemd/system/twitter-bot.service
```

```ini
[Unit]
Description=Twitter Tech Bot
After=network.target

[Service]
Type=simple
User=youruser
WorkingDirectory=/path/to/twitter-tech-bot
ExecStart=/usr/bin/node src/scheduler.js
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Service идэвхжүүлэх
sudo systemctl enable twitter-bot
sudo systemctl start twitter-bot
sudo systemctl status twitter-bot
```

---

## 🔒 Аюулгүй байдал

- ⚠️ `.env` файлыг Git-д оруулж болохгүй
- ⚠️ Twitter API keys-ээ хэнд ч өгч болохгүй
- ✅ `.gitignore` файлд `.env` нэмсэн эсэхийг шалгаарай

---

## 📚 Технологиуд

- **Node.js** - Runtime
- **twitter-api-v2** - Twitter API клиент
- **axios** - HTTP клиент
- **cheerio** - HTML parser
- **rss-parser** - RSS feed parser
- **node-cron** - Хуваарийн систем
- **sharp** - Зураг боловсруулалт

---

## 🤝 Хувь нэмэр оруулах

Санал, засвар оруулахыг хүсвэл:

1. Fork хийх
2. Feature branch үүсгэх (`git checkout -b feature/amazing-feature`)
3. Commit хийх (`git commit -m 'Add amazing feature'`)
4. Push хийх (`git push origin feature/amazing-feature`)
5. Pull Request үүсгэх

---

## 📄 License

MIT License - [LICENSE](LICENSE)

---

## 👨‍💻 Холбоо барих

- **Email:** info@mediapro.mn
- **GitHub:** [@Temuujinhub](https://github.com/Temuujinhub)

---

## 🎉 Амжилт хүсье!

Бот таны Twitter account-ыг илүү идэвхтэй, мэдээлэл сайтай болгоно. Асуулт байвал info@mediapro.mn хаягаар холбогдоорой.

**Happy Tweeting! 🚀**
