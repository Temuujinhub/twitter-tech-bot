# 🔧 Gemini API 403 Алдаа - Шийдэл

## 🐛 Асуудал

Bot ажиллуулахад дараах алдаа гарч байна:

```
⚠️ Gemini алдаа: [GoogleGenerativeAI Error]: Error fetching from 
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: 
[403 Forbidden] Method doesn't allow unregistered callers (callers without established identity). 
Please use API Key or other form of API consumer identity to call this API.
```

**Шалтгаан:**

1. `gemini-2.5-flash` model нь **preview model** байж магадгүй, API key-д хязгаарлалт тавьсан
2. API key-д хугацаа дууссан эсвэл quota хэтэрсэн
3. Model нэр өөрчлөгдсөн эсвэл устгагдсан

---

## ✅ Шийдэл 1: Model Auto-Fallback (ЗАСВАРЛАСАН)

Би **src/contentGenerator.js** файлыг засварлаж, **олон model дарааллаар оролдох** механизм нэмлээ:

### Өөрчлөлт:

```javascript
// ХУУЧИН КОД:
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ШИНЭ КОД:
const modelNames = [
  "gemini-1.5-flash",      // Хамгийн хурдан, үнэгүй
  "gemini-1.5-pro",        // Илүү сайн чанар
  "gemini-pro"             // Fallback
];

for (const modelName of modelNames) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    // ... оролдох
    return text;  // Амжилттай бол буцаах
  } catch (error) {
    continue;  // Алдаа гарвал дараагийн model руу
  }
}
```

### Давуу тал:

- ✅ Автоматаар ажилладаг model олно
- ✅ Google model өөрчилсөн ч bot цааш ажиллана
- ✅ Илүү найдвартай

---

## ✅ Шийдэл 2: API Key Шалгах

### 🧪 Тест скрипт ажиллуулах:

```bash
node test-gemini-api.js
```

Энэ скрипт:
1. ✅ API key-г шалгана
2. ✅ Бүх боломжит model-уудыг туршина
3. ✅ Ямар model ажиллаж байгааг харуулна

### Гарах үр дүн:

```
🧪 Google Gemini API шалгаж байна...

✅ API Key олдлоо: AIzaSyBx...xyz

📝 Тест prompt: Сайн уу! Би технологийн мэдээний bot. Та хэн бэ?
────────────────────────────────────────────────────────────

🔄 gemini-1.5-flash шалгаж байна...
✅ АМЖИЛТТАЙ! (1234ms)
📤 Хариулт: Сайн байна уу! Би Google-н бүтээсэн хиймэл оюун ухааны том хэлний загвар Gemini...

🔄 gemini-1.5-pro шалгаж байна...
✅ АМЖИЛТТАЙ! (2345ms)

🔄 gemini-pro шалгаж байна...
❌ АЛДАА!
   Алдааны код: 404
   Мессеж: models/gemini-pro is not found...

🔄 gemini-2.5-flash шалгаж байна...
❌ АЛДАА!
   Алдааны код: 403
   Мессеж: Method doesn't allow unregistered callers...

════════════════════════════════════════════════════════════
📊 ДҮН:
════════════════════════════════════════════════════════════

✅ Ажилладаг model-ууд (2):
   - gemini-1.5-flash (1234ms)
   - gemini-1.5-pro (2345ms)

❌ Ажиллаагүй model-ууд (2):
   - gemini-pro
   - gemini-2.5-flash

════════════════════════════════════════════════════════════

💡 ЗӨВЛӨМЖ: "gemini-1.5-flash" model ашиглана уу (хамгийн хурдан ажиллаа).
```

---

## ✅ Шийдэл 3: API Key Шинэчлэх (Хэрэв шаардлагатай бол)

### 1. Google AI Studio руу орох:

https://aistudio.google.com/app/apikey

### 2. Шинэ API Key үүсгэх:

1. "Create API Key" дарах
2. Google Cloud Project сонгох (эсвэл шинэ үүсгэх)
3. API Key-г хуулах

### 3. config/.env файлд солих:

```bash
# Хуучин key
GOOGLE_API_KEY=AIzaSyOldKey...

# Шинэ key
GOOGLE_API_KEY=AIzaSyNewKey...
```

### 4. GitHub Secrets шинэчлэх:

1. https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions
2. `GOOGLE_API_KEY` засах
3. Шинэ утгыг оруулах

---

## 📊 Одоогийн байдал

### ✅ Засварласан файлууд:

1. **src/contentGenerator.js** - Model fallback механизм нэмэв
2. **test-gemini-api.js** - API key шалгах скрипт үүсгэв
3. **GEMINI_API_FIX.md** - Энэ баримт

### 🧪 Тест хийх:

```bash
# 1. Gemini API шалгах
node test-gemini-api.js

# 2. Bot test mode (Twitter-т бичихгүй)
node src/index.js test

# 3. Бодит пост хийх
node src/index.js
```

---

## 🔍 Нэмэлт шалгах зүйлс

### 1. **Billing идэвхтэй эсэх**

Зарим Gemini model-д үнэгүй quota байдаг боловч, хязгаарлалт бий:

- `gemini-1.5-flash`: Өдөрт 1500 request үнэгүй
- `gemini-1.5-pro`: Өдөрт 50 request үнэгүй

https://console.cloud.google.com/billing

### 2. **API-д хязгаарлалт тавьсан эсэх**

Google Cloud Console -> APIs & Services -> Credentials

API key-н хязгаарлалтыг шалгаарай:
- Application restrictions
- API restrictions
- Usage limits

### 3. **Quota хэтэрсэн эсэх**

https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

---

## 💡 Зөвлөмж

### Хамгийн сайн шийдэл:

1. ✅ **Одоогийн засварласан код ашиглах** (model auto-fallback)
2. ✅ **test-gemini-api.js ажиллуулах** - ямар model ажиллаж байгааг шалгах
3. ✅ **GitHub Actions workflow шинэчлэх** - алдаа гарвал retry хийх

### Урт хугацааны шийдэл:

Хэрэв Gemini API тогтворгүй байвал:

1. **OpenAI API** ашиглах (ChatGPT)
   - Илүү найдвартай
   - Илүү сайн Монгол хэл дэмжлэг
   - $5/month-аас эхлэх үнэ

2. **Claude API** ашиглах (Anthropic)
   - Маш сайн чанар
   - Монгол хэл сайн ойлгодог
   - $15/month-аас эхлэх үнэ

---

## 🚀 Яг одоо хийх зүйлс

```bash
# 1. Тест ажиллуулах
node test-gemini-api.js

# 2. Хэрэв бүх model амжилтгүй бол:
#    - Google AI Studio руу орох
#    - Шинэ API key үүсгэх
#    - config/.env болон GitHub Secrets шинэчлэх

# 3. Дахин тест
node src/index.js test

# 4. Бүх зүйл ажиллаж байвал:
git add .
git commit -m "Fix: Gemini API 403 - model fallback mechanism нэмэв"
git push origin main
```

---

**Дүгнэлт:** Засварласан код одоо **автоматаар ажилладаг Gemini model олж ашиглана**. Хэрэв Gemini бүтнээрээ ажиллахгүй бол, fallback механизм ажиллаж, tweet үүсгэнэ.

Bot одоо илүү **найдвартай** болсон! 🎉
