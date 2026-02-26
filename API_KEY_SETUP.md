# 🔑 Google Gemini API Key тохируулах заавар

## ⚠️ Одоогийн асуудал

```
❌ GOOGLE_API_KEY олдсонгүй!
```

Bot ажиллахын тулд Google Gemini API key хэрэгтэй.

---

## 📋 Алхам 1: Google API Key авах

### 1. Google AI Studio руу орох:

🔗 https://aistudio.google.com/app/apikey

### 2. "Create API Key" дарах

![Create API Key](https://i.imgur.com/example.png)

### 3. Project сонгох

- Хэрэв project байгаа бол сонгох
- Эсвэл "Create new project" дарж шинэ үүсгэх

### 4. API Key хуулах

```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Анхааруулга:** API key-г хадгалж аваарай! Дахин харагдахгүй.

---

## 📋 Алхам 2: Локал тохиргоо

### 1. config/.env файл үүсгэх/засах:

```bash
cd /mnt/workspace/F5Xy3Z8owBBkJFWxHrTZ5GpjtVAvakEUWirCu4KqFznnf

# Хэрэв файл байхгүй бол
cp config/.env.example config/.env

# Файл засах
nano config/.env  # эсвэл код editor ашиглах
```

### 2. API Key нэмэх:

```bash
# Twitter API Keys (аль хэдийн байгаа)
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
TWITTER_BEARER_TOKEN=your_bearer_token

# Google Gemini API Key (энийг нэм!)
GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Хадгалах ба тест:

```bash
# Файл хадгалах (nano: Ctrl+X, Y, Enter)

# Тест ажиллуулах
node test-gemini-api.js
```

---

## 📋 Алхам 3: GitHub Secrets тохируулах (Automation-д)

Bot GitHub Actions-р автоматаар ажиллахын тулд:

### 1. GitHub Repository Settings руу орох:

🔗 https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions

### 2. "New repository secret" дарах

### 3. Secret нэмэх:

**Name:**
```
GOOGLE_API_KEY
```

**Secret:**
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. "Add secret" дарах

---

## 🧪 Тест хийх

### 1. Gemini API шалгах:

```bash
node test-gemini-api.js
```

**Хүлээгдэж буй үр дүн:**

```
🧪 Google Gemini API шалгаж байна...

✅ API Key олдлоо: AIzaSyBx...xyz

📝 Тест prompt: Сайн уу! Би технологийн мэдээний bot. Та хэн бэ?
────────────────────────────────────────────────────────────

🔄 gemini-1.5-flash шалгаж байна...
✅ АМЖИЛТТАЙ! (1234ms)
📤 Хариулт: Сайн байна уу! Би Google-н бүтээсэн...

════════════════════════════════════════════════════════════
📊 ДҮН:
════════════════════════════════════════════════════════════

✅ Ажилладаг model-ууд (2):
   - gemini-1.5-flash (1234ms)
   - gemini-1.5-pro (2345ms)

💡 ЗӨВЛӨМЖ: "gemini-1.5-flash" model ашиглана уу
```

### 2. Bot test mode:

```bash
node src/index.js test
```

**Хүлээгдэж буй үр дүн:**

```
🧪 Running Test Mode...
📰 TechCrunch-аас мэдээ татаж байна...
✅ TechCrunch: 20 мэдээ олдлоо
...
🔄 gemini-1.5-flash оролдож байна...
✅ Gemini товчлол амжилттай (model: gemini-1.5-flash)
📝 Generated Tweet: Google-н шинэ AI технологи...
```

### 3. Бодит tweet (Twitter-т бичнэ):

```bash
node src/index.js
```

---

## ❌ Асуудал гарвал

### Асуудал 1: "GOOGLE_API_KEY олдсонгүй"

**Шалтгаан:** config/.env файл байхгүй эсвэл хоосон

**Шийдэл:**
```bash
# Файл байгаа эсэхийг шалгах
ls -la config/.env

# Агуулгыг харах (API key харагдана, битгий хуваалц!)
cat config/.env | grep GOOGLE_API_KEY
```

### Асуудал 2: "403 Forbidden - unregistered callers"

**Шалтгаан:** API key буруу эсвэл хязгаарлалт тавигдсан

**Шийдэл:**

1. API key зөв эсэхийг шалгах:
   ```bash
   # Урт нь 39 тэмдэгт байх ёстой, "AIzaSy" эхэлнэ
   echo $GOOGLE_API_KEY | wc -c
   ```

2. Google AI Studio руу орж шинэ key үүсгэх

3. API restrictions шалгах:
   - https://console.cloud.google.com/apis/credentials
   - API key дээр дарах
   - "API restrictions" хэсэгт "Generative Language API" идэвхтэй эсэхийг шалгах

### Асуудал 3: "Бүх model амжилтгүй"

**Шалтгаан:** API quota дууссан эсвэл billing идэвхгүй

**Шийдэл:**

1. Quota шалгах:
   - https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

2. Billing идэвхжүүлэх:
   - https://console.cloud.google.com/billing

3. Үнэгүй quota:
   - `gemini-1.5-flash`: 15 RPM (requests per minute)
   - `gemini-1.5-pro`: 2 RPM

---

## 💡 Нэмэлт зөвлөмж

### 1. API Key хамгаалалт

```bash
# .env файлыг git-д нэмэхгүй байх (.gitignore-т байгаа эсэхийг шалгах)
cat .gitignore | grep .env

# Гарах ёстой:
# .env
# config/.env
```

### 2. Rate Limiting

Bot өдөрт 5 удаа tweet хийдэг, тиймээс өдөрт зөвхөн **5 API call** л хэрэгтэй.

Үнэгүй quota:
- ✅ `gemini-1.5-flash`: Өдөрт 1500 request (хангалттай!)
- ✅ `gemini-1.5-pro`: Өдөрт 50 request (хангалттай!)

### 3. Backup механизм

Засварласан `src/contentGenerator.js` файл одоо:

1. `gemini-1.5-flash` оролдоно
2. Амжилтгүй бол `gemini-1.5-pro` оролдоно
3. Амжилтгүй бол `gemini-pro` оролдоно
4. Бүгд амжилтгүй бол **fallback** (Gemini-гүй tweet үүсгэнэ)

Тиймээс bot үргэлж ажиллана! 🎉

---

## 🚀 Дүгнэлт

**Хийх зүйлс:**

1. ✅ Google AI Studio руу орж API key авах
2. ✅ `config/.env` файлд API key нэмэх
3. ✅ `node test-gemini-api.js` ажиллуулж шалгах
4. ✅ GitHub Secrets-т API key нэмэх
5. ✅ `node src/index.js test` ажиллуулж бүх зүйл ажиллаж байгааг баталгаажуулах

**Бэлэн!** Bot одоо Монгол хэл дээр товч мэдээ үүсгэж, Twitter-т автоматаар post хийнэ! 🤖📱
