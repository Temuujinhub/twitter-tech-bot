# ⚡ Хурдан эхлүүлэх - 5 минут

---

## 📋 Шаардлагатай зүйлс

- ✅ Node.js 16+ суусан байх
- ✅ Twitter Developer Account
- ✅ Internet холболт

---

## 🚀 5 Алхам

### 1️⃣ Dependencies суулгах (1 мин)

```bash
cd /mnt/workspace/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
npm install
```

---

### 2️⃣ Twitter API Keys авах (2 мин)

1. https://developer.x.com/en/portal/apps/17225998/settings нээх
2. **Keys and Tokens** tab
3. **4 түлхүүр** авах:
   - API Key
   - API Secret  
   - Access Token
   - Access Token Secret

**Дэлгэрэнгүй:** `SETUP_GUIDE.md` уншаарай

---

### 3️⃣ .env файл тохируулах (1 мин)

```bash
# .env файл үүсгэх
cp config/.env.example config/.env

# Засварлах
nano config/.env
```

Twitter keys-ээ оруулна:

```env
TWITTER_API_KEY=your_api_key_here
TWITTER_API_SECRET=your_api_secret_here
TWITTER_ACCESS_TOKEN=your_access_token_here
TWITTER_ACCESS_SECRET=your_access_secret_here
```

Хадгалах: `Ctrl+O` → `Enter` → `Ctrl+X`

---

### 4️⃣ Тест хийх (30 сек)

```bash
npm start test
```

**Амжилттай бол:**

```
✅ Twitter API холбогдсон!
👤 Account: @yourname
📰 Мэдээ цуглуулж байна...
📝 Үүссэн tweet:
────────────────────────────────
🚀 OpenAI шинэ GPT-5 танилцуулна...
...
```

---

### 5️⃣ Эхлүүлэх! (10 сек)

**А) Нэг удаа пост хийх:**

```bash
npm start
```

**Б) Автомат горим (өдөрт 5 удаа):**

```bash
npm run schedule
```

Бот ажиллаж эхэлнэ! 🎉

---

## 🎮 Командууд

| Команд | Юу хийх вэ |
|--------|-----------|
| `npm start test` | Twitter руу пост хийхгүй, зөвхөн шалгах |
| `npm start` | Нэг удаа пост хийх |
| `npm run schedule` | Өдөрт 5 удаа автомат |

---

## 🐛 Алдаа гарвал?

### "Cannot find module"

```bash
npm install
```

### "Invalid credentials"

- `.env` файл дахь keys шалгаарай
- Хоосон зай байгаа эсэхийг шалгаарай

### Бусад алдаа

`SETUP_GUIDE.md` болон `README.md` уншаарай.

---

## 📚 Дараагийн алхам

- 📖 [README.md](README.md) - Бүрэн заавар
- 🔑 [SETUP_GUIDE.md](SETUP_GUIDE.md) - Twitter API дэлгэрэнгүй
- 📁 [config/sources.json](config/sources.json) - Эх сурвалж тохируулах

---

**Амжилт хүсье! Асуулт байвал: info@mediapro.mn** 🚀
