# ⚠️ API Key Асуудал - Шинэ Key Авах Хэрэгтэй

## 🔴 Одоогийн асуудал

```
❌ API key not valid. Please pass a valid API key.
Reason: API_KEY_INVALID
```

Таны өгсөн API key хүчингүй байна.

**Таны key:** `AIzaSy4/1AfrIepBW-xRJQLACYZqtEN0wUnY9YiMRRGBak5XBCwVAIpTUk-xmjeiRjcc`

**Асуудал:**
- ❌ Key-д `/` тэмдэгт байна (Google API key-д ихэвчлэн байхгүй)
- ❌ Google systems key-г хүлээн авахгүй байна
- ❌ Key буруу хуулагдсан эсвэл устгагдсан байж магадгүй

---

## ✅ Шинэ API Key Авах (Алхам алхмаар)

### Алхам 1: Google AI Studio руу орох

🔗 **https://aistudio.google.com/app/apikey**

1. Google Account-оороо нэвтрэх
2. AI Studio хуудас нээгдэнэ

### Алхам 2: API Key үүсгэх

#### Хэрэв анхны удаа бол:

1. **"Create API Key"** товчийг дарах
2. **Google Cloud Project** сонгох:
   - Хэрэв project байгаа бол: "Create API key in existing project" сонгох
   - Байхгүй бол: "Create API key in new project" дарах
3. API key үүснэ (хэдэн секунд)

#### Хэрэв өмнө үүсгэсэн бол:

1. **"Get API key"** эсвэл **"Manage API keys"** дарах
2. Хуучин key-г устгаж, шинийг үүсгэх (эсвэл одоо байгаа key-г хуулах)

### Алхам 3: API Key хуулах

API key дараах форматтай байх ёстой:

```
AIzaSyAbc123DefGhi456JklMno789PqrStuVwx
```

**Шинж чанарууд:**
- ✅ `AIzaSy` эхэлнэ
- ✅ 39 тэмдэгт урттай
- ✅ Зөвхөн үсэг, тоо, `-`, `_` (slash `/` БАЙХГҮЙ!)
- ✅ Жишээ: `AIzaSyB1234567890abcdefghijk_lmnopqr`

### Алхам 4: API-г идэвхжүүлэх

Зарим тохиолдолд **Generative Language API**-г идэвхжүүлэх шаардлагатай:

1. Google Cloud Console руу орох: https://console.cloud.google.com
2. Зүүн дээд буланд project сонгох
3. **"APIs & Services"** → **"Library"**
4. **"Generative Language API"** хайх
5. **"Enable"** дарах

---

## 🧪 Шинэ Key-г Шалгах

API key хуулсны дараа:

### 1. config/.env файл засах:

```bash
cd /mnt/workspace/F5Xy3Z8owBBkJFWxHrTZ5GpjtVAvakEUWirCu4KqFznnf
nano config/.env
```

**Өөрчлөх мөр:**
```bash
# Хуучин (буруу)
GOOGLE_API_KEY=AIzaSy4/1AfrIepBW-xRJQLACYZqtEN0wUnY9YiMRRGBak5XBCwVAIpTUk-xmjeiRjcc

# Шинэ (зөв форматтай)
GOOGLE_API_KEY=AIzaSyAbc123DefGhi456JklMno789PqrStuVwx
```

### 2. Тест ажиллуулах:

```bash
node test-gemini-api.js
```

**Хүлээгдэж буй үр дүн:**

```
🧪 Google Gemini API шалгаж байна...

✅ API Key олдлоо: AIzaSyAbc...Vwx

🔄 gemini-1.5-flash шалгаж байна...
✅ АМЖИЛТТАЙ! (1234ms)
📤 Хариулт: Сайн байна уу! Би Google-н бүтээсэн...
```

---

## 🔒 Аюулгүй байдал

### ⚠️ API Key-г хамгаалах:

1. **Битгий хуваалцаарай** - Хувийн мэдээлэл
2. **Git-д нэмэхгүй** - `.env` файл `.gitignore`-т байгаа эсэхийг шалгах
3. **GitHub Secrets ашиглах** - Public repository-д key харагдахгүй байх

### GitHub Secrets-д нэмэх:

1. https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions
2. **"New repository secret"** дарах
3. **Name:** `GOOGLE_API_KEY`
4. **Secret:** Шинэ API key
5. **"Add secret"** дарах

---

## 💡 Нэмэлт зөвлөмж

### Quota шалгах:

Google Gemini API үнэгүй quota:
- `gemini-1.5-flash`: **15 RPM** (requests per minute)
- `gemini-1.5-pro`: **2 RPM**

Таны bot өдөрт зөвхөн **5 удаа** ажилладаг, тиймээс quota хангалттай!

### Billing (Хэрэв хэрэгтэй бол):

Үнэгүй quota хэтэрвэл:
1. https://console.cloud.google.com/billing
2. Billing account үүсгэх
3. Credit card нэмэх (эхний $300 үнэгүй!)

---

## 🚨 Түгээмэл алдаанууд

| Алдаа | Шалтгаан | Шийдэл |
|-------|---------|--------|
| `API_KEY_INVALID` | Key буруу эсвэл устгагдсан | Шинэ key үүсгэх |
| `API_KEY_EXPIRED` | Key хугацаа дууссан | Шинэ key үүсгэх |
| `PERMISSION_DENIED` (403) | API идэвхгүй | Generative Language API идэвхжүүлэх |
| `RESOURCE_EXHAUSTED` (429) | Quota дууссан | Billing идэвхжүүлэх эсвэл хүлээх |

---

## 📞 Дараагийн алхам

1. ✅ https://aistudio.google.com/app/apikey руу орж **шинэ API key** авах
2. ✅ `config/.env` файлд **GOOGLE_API_KEY** солих
3. ✅ `node test-gemini-api.js` ажиллуулах
4. ✅ GitHub Secrets шинэчлэх
5. ✅ `node src/index.js test` ажиллуулж bot тест хийх

**Шинэ API key авсны дараа надад мэдэгдээрэй, би туслахад бэлэн байна!** 🔑✨
