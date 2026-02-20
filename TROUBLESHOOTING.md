# 🔧 Алдаа засах - Troubleshooting

---

## ❌ Алдаа: "client-not-enrolled" / "Client Forbidden"

```
detail: 'When authenticating requests to the Twitter API v2 endpoints, 
you must use keys and tokens from a Twitter developer App that is 
attached to a Project.'
```

### 🎯 Шалтгаан:

Таны Twitter App **Project-тэй холбогдоогүй** байна.

### ✅ Шийдэл:

#### Алхам 1: Twitter Developer Portal руу ор

https://developer.twitter.com/en/portal/dashboard

#### Алхам 2: Project үүсгэх (хэрэв байхгүй бол)

1. Зүүн талын **"Projects & Apps"** дээр дарна
2. **"+ Create Project"** товч дарна
3. Project нэр өгнө (жишээ: "Tech Bot Project")
4. Use case сонгох (жишээ: "Making a bot")
5. Project тайлбар бичих

#### Алхам 3: App-ыг Project руу холбох

**Хувилбар А: Шинэ App үүсгэх**

1. Project дотроо **"+ Add App"** дарна
2. **"Create new App"** сонгоно
3. App нэр өгнө (жишээ: "Twitter Tech Bot")
4. Keys & Tokens-ыг ХАДГАЛААРАЙ (дахин харагдахгүй!)

**Хувилбар Б: Одоо байгаа App холбох**

1. Developer Portal → **Settings** tab
2. **App ID** олж хуулах (17225998)
3. **Projects & Apps** руу буцах
4. Project нээгээд **"+ Add App"**
5. **"Add existing App"** сонгоно
6. App ID-аа оруулна

#### Алхам 4: Шинэ Keys үүсгэх

App-ыг Project руу холбосны дараа:

1. **Keys and Tokens** tab нээх
2. **Regenerate** товч дараад БҮГДИЙГ хуулах:
   - API Key
   - API Secret
   - Access Token
   - Access Token Secret

#### Алхам 5: .env файл шинэчлэх

Шинэ keys-ээ `.env` файлд оруулна:

```bash
nano /opt/skycode/data/opencode/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot/config/.env
```

Шинэ keys оруулаад хадгалах.

#### Алхам 6: Дахин тестлэх

```bash
cd /opt/skycode/data/opencode/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
node src/index.js test
```

---

## ❌ Алдаа: "Invalid credentials"

### Шалтгаан:
- API Keys буруу хуулагдсан
- Хоосон зай эсвэл шинэ мөр орсон
- Хуучин keys ашиглаж байна

### Шийдэл:

```bash
# .env файл шалгах
cat config/.env

# Хоосон зай байгаа эсэхийг шалгах
# Keys дээр따옴표, хоосон зай байх ёсгүй

# Зөв формат:
TWITTER_API_KEY=abc123xyz
# Буруу формат:
TWITTER_API_KEY= abc123xyz  (хоосон зай!)
TWITTER_API_KEY="abc123xyz" (따옴표!)
```

---

## ❌ Алдаа: "Read-only application"

### Шалтгаан:
App permissions **Read only** байна.

### Шийдэл:

1. Developer Portal → **Settings** tab
2. **App permissions** хэсэгт очих
3. **Edit** товч дарах
4. **Read and Write** сонгох
5. **Save** дарах
6. **Access Token дахин үүсгэх хэрэгтэй!**
   - Keys and Tokens → Regenerate Access Token

---

## ❌ Алдаа: "Rate limit exceeded"

### Шалтгаан:
Хэт олон request илгээсэн.

### Шийдэл:

Twitter limits:
- **Free tier:** 50 tweets/24 hours
- **Basic tier:** 1,500 tweets/month ($100/month)

15 минут хүлээгээд дахин оролдоно уу.

---

## ❌ Алдаа: "Cannot find module"

### Шалтгаан:
Dependencies суугаагүй.

### Шийдэл:

```bash
cd /opt/skycode/data/opencode/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
rm -rf node_modules
npm install
```

---

## ❌ Алдаа: "Мэдээ олдсонгүй"

### Шалтгаан:
- Internet холболт муу
- RSS feeds ажиллахгүй байна
- Keywords хэт хатуу шүүлт хийж байна

### Шийдэл:

```bash
# Internet шалгах
ping google.com

# Тест хийх
node src/index.js test

# Keywords-ээ тохируулах
nano config/sources.json
```

---

## 🆘 Бусад асуудал

Хэрэв дээрх шийдлүүд тусаагүй бол:

1. **GitHub Issues** үүсгэх: https://github.com/Temuujinhub/MediaPRO
2. **Email илгээх:** info@mediapro.mn
3. **Лог файл хавсаргах:**

```bash
cd /opt/skycode/data/opencode/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
node src/index.js > debug.log 2>&1
cat debug.log
```

---

## 📚 Холбоос

- [Twitter API Documentation](https://developer.twitter.com/en/docs/twitter-api)
- [Projects and Apps Guide](https://developer.twitter.com/en/docs/projects/overview)
- [Authentication Guide](https://developer.twitter.com/en/docs/authentication/oauth-1-0a)

---

**Амжилт хүсье!** 🚀
