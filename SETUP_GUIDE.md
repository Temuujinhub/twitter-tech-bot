# 🔑 Twitter API Setup - Алхам алхмаар заавар

Та одоо https://developer.x.com/en/portal/apps/17225998/settings дээр байна.

---

## 📋 Шаардлагатай 4 түлхүүр

Танд дараах 4 түлхүүр хэрэгтэй:

1. **API Key** (Consumer Key)
2. **API Secret** (Consumer Secret)
3. **Access Token**
4. **Access Token Secret**

---

## 🚀 Алхам алхмаар заавар

### Алхам 1: Keys and Tokens хэсэгт очих

Developer Portal дээр:

1. **Keys and Tokens** tab дээр дарна
2. Хэрэв **Regenerate** товч харагдвал дараарай (анх удаа бол **Generate** гэсэн байх)

---

### Алхам 2: API Key ба API Secret авах

```
Consumer Keys
├── API Key            → Энэ нь таны API Key
└── API Secret         → Энэ нь таны API Secret (нууц!)
```

⚠️ **Анхааруулга:** API Secret нь зөвхөн 1 удаа харагдана! Шууд хуулаад хадгалаарай.

---

### Алхам 3: Access Token ба Access Token Secret үүсгэх

Хэрэв **Access Token and Secret** хараахан үүсгээгүй бол:

1. **"Generate"** товч дээр дарна
2. **Access Token** болон **Access Token Secret** гарч ирнэ
3. **Хоёуланг нь шууд хуулаад хадгалаарай**

⚠️ **Чухал:** Энэ хуудсыг хаавал дахин харах боломжгүй!

---

### Алхам 4: App Permissions шалгах

**Settings** tab дээр:

1. **App permissions** хэсэгт очих
2. **Read and Write** эсвэл **Read, Write and Direct Messages** сонгогдсон эсэхийг шалгах
3. Хэрэв **Read only** байвал **Edit** дараад **Read and Write** болгох

---

### Алхам 5: .env файлд оруулах

Одоо авсан 4 түлхүүрээ `.env` файлд оруулна:

```bash
cd /mnt/workspace/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
nano config/.env
```

Дараах форматаар бичнэ:

```env
# Twitter API Credentials
TWITTER_API_KEY=jRqVhZt8xK3pL9mN2wQ5yT7uS
TWITTER_API_SECRET=aB3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV3wX4yZ5
TWITTER_ACCESS_TOKEN=1234567890-AbCdEfGhIjKlMnOpQrStUvWxYz
TWITTER_ACCESS_SECRET=zY9xW8vU7tS6rQ5pO4nM3lK2jI1hG0fE

# Bot Settings
POSTS_PER_DAY=5
MIN_HOUR=8
MAX_HOUR=23
```

**Хадгалах:** `Ctrl + O`, дараа нь `Enter`, дараа нь `Ctrl + X`

---

## ✅ Шалгах

Keys зөв эсэхийг шалгах:

```bash
cd /mnt/workspace/6rRR86eTfCKjp6g1ZR6eBs/twitter-tech-bot
npm install
npm start test
```

Хэрэв зөв бол:

```
✅ Twitter API холбогдсон!
👤 Account: @yourname
```

---

## 🆘 Түгээмэл асуудал

### "Invalid credentials" алдаа

- API Keys буруу хуулагдсан байж магадгүй
- Developer Portal дээр дахин шалгаарай
- Хоосон зай эсвэл шинэ мөр орсон эсэхийг шалгаарай

### "Read-only application" алдаа

- App permissions **Read and Write** болгоогүй байна
- Settings → App permissions → Edit → Read and Write

### "403 Forbidden" алдаа

- Access Token болон Secret дахин үүсгэх хэрэгтэй
- Keys and Tokens → Regenerate Access Token

---

## 📸 Харах ёстой зүйлс

Developer Portal дээр ингэж харагдах ёстой:

```
Keys and Tokens
├── Consumer Keys
│   ├── API Key: abc123... [SHOW/HIDE]
│   └── API Secret: xyz789... [SHOW/HIDE]
│
└── Authentication Tokens
    ├── Access Token: 123456-abc... [REGENERATE]
    └── Access Token Secret: zyxwvu... [REGENERATE]
```

---

## 🔐 Аюулгүй байдал

✅ Хийх:
- Keys-ээ аюулгүй газар хадгалах
- `.env` файлыг Git-д оруулахгүй байх
- Түлхүүр алдагдвал шууд Regenerate хийх

❌ Битгий хий:
- Keys-ээ GitHub-д оруулах
- Screenshot-ээ нийтлэх
- Хэнд ч өгөх

---

## ➡️ Дараагийн алхам

Keys авсны дараа:

```bash
# 1. Test горимоор туршаарай
npm start test

# 2. Нэг удаа пост хийж үзээрэй
npm start

# 3. Автомат горим эхлүүлээрэй
npm run schedule
```

---

**Амжилт хүсье! 🚀**

Асуулт байвал info@mediapro.mn хаягаар холбогдоорой.
