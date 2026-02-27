# 🔧 GitHub Secrets шинэчлэх - ШААРДЛАГАТАЙ АЛХАМ

## 🔴 Одоогийн асуудал

GitHub Actions амжилттай ажиллаж байна, гэхдээ Gemini API алдаа гарч байна:

```
⚠️ gemini-2.5-flash алдаа: [403 Forbidden]
⚠️ gemini-1.5-flash алдаа: [403 Forbidden]
⚠️ gemini-1.5-pro алдаа: [403 Forbidden]
⚠️ gemini-pro алдаа: [403 Forbidden]
📝 Fallback ашиглаж байна...
```

**Шалтгаан:** GitHub Actions environment-д `GOOGLE_API_KEY` secret байхгүй эсвэл хуучин утгатай.

**Үр дүн:** 
- ✅ Bot ажиллаж, tweet post хийж байна
- ❌ Гэхдээ Монгол орчуулга байхгүй (Gemini ажиллахгүй)
- ⚠️ Fallback tweet (англи хэл дээр) ашиглаж байна

---

## ✅ Шийдэл: GitHub Secrets шинэчлэх

### Алхам 1: GitHub Repository Settings руу орох

🔗 **https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions**

### Алхам 2: GOOGLE_API_KEY secret нэмэх/шинэчлэх

#### Хэрэв `GOOGLE_API_KEY` аль хэдийн байгаа бол:

1. Secret-ийн жагсаалтаас **GOOGLE_API_KEY** олох
2. Баруун талд **"Update"** дарах
3. **Шинэ утга** оруулах:
   ```
   AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI
   ```
4. **"Update secret"** дарах

#### Хэрэв `GOOGLE_API_KEY` байхгүй бол:

1. **"New repository secret"** товчийг дарах
2. **Name** оруулах:
   ```
   GOOGLE_API_KEY
   ```
3. **Secret** оруулах:
   ```
   AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI
   ```
4. **"Add secret"** дарах

### Алхам 3: Шалгах

Secret зөв нэмэгдсэн эсэхийг шалгаарай:

![GitHub Secrets](https://docs.github.com/assets/cb-28937/images/help/settings/actions-secrets-list.png)

Жагсаалтад харагдах ёстой:
```
GOOGLE_API_KEY          Updated now by [таны нэр]
TWITTER_API_KEY         Updated X days ago
TWITTER_API_SECRET      Updated X days ago
...
```

---

## 🧪 Тест хийх

### Дараагийн workflow run хүлээх

Bot автоматаар дараах цагт ажиллана (Монголын цагаар):
- 09:00
- 13:00
- 17:00
- 21:00
- 23:00

### Эсвэл гараар ажиллуулах

1. https://github.com/Temuujinhub/twitter-tech-bot/actions
2. Зүүн талд **"Twitter Bot Automation"** сонгох
3. Баруун талд **"Run workflow"** дарах
4. **"Run workflow"** баталгаажуулах

### Хүлээгдэж буй үр дүн

Logs-д харагдах ёстой:

```
🔄 gemini-2.5-flash оролдож байна...
✅ Gemini товчлол амжилттай (model: gemini-2.5-flash)
📝 Generated Tweet: [Монгол хэл дээр tweet]
```

**БИЕС** энэ мөр харагдах:
```
⚠️ Бүх Gemini model-ууд амжилтгүй боллоо
📝 Fallback ашиглаж байна...
```

---

## 📊 Одоогийн болон хүлээгдэж буй үр дүн

| Статус | Одоо | Шинэчлэсний дараа |
|--------|------|-------------------|
| **Bot ажиллагаа** | ✅ Ажиллаж байна | ✅ Ажиллаж байна |
| **Tweet post** | ✅ Post хийж байна | ✅ Post хийж байна |
| **Gemini API** | ❌ 403 Forbidden | ✅ Ажиллана |
| **Монгол орчуулга** | ❌ Байхгүй | ✅ Байна |
| **Tweet агуулга** | ⚠️ Англи хэл (fallback) | ✅ Монгол хэл |

---

## 🔍 Secret зөв эсэхийг шалгах

### Workflow logs-с шалгах

Дараагийн run-д logs-оос харна уу:

```yaml
env:
  GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY }}
```

Хэрэв secret байхгүй бол, bot logs-д харагдана:

```
⚠️ GOOGLE_API_KEY олдсонгүй эсвэл хоосон байна
```

---

## ⚠️ Түгээмэл алдаа

### Алдаа 1: Secret нэр буруу

❌ **Буруу:**
```
GOOGLE_GEMINI_API_KEY
GEMINI_API_KEY
```

✅ **Зөв:**
```
GOOGLE_API_KEY
```

### Алдаа 2: Secret утга дутуу

API key бүрэн хуулагдаагүй байж болно. Утга дараах форматтай байх ёстой:

```
AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI
```

**Шалгах:**
- Урт: 39 тэмдэгт
- Эхлэл: `AIzaSy`
- Зөвхөн үсэг, тоо, `-`, `_` (slash `/` БАЙХГҮЙ)

### Алдаа 3: Secret хандалтын эрх

Repository-д дараах тохиргоо идэвхтэй байх ёстой:

1. Settings → Actions → General
2. **"Workflow permissions"** хэсэгт:
   - ✅ "Read and write permissions" сонгогдсон байх
   - ✅ "Allow GitHub Actions to create and approve pull requests" идэвхтэй

---

## 🎯 Дүгнэлт

**Яг одоо хийх:**

1. ✅ https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions руу орох
2. ✅ `GOOGLE_API_KEY` secret нэмэх/шинэчлэх
3. ✅ Утга: `AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI`
4. ✅ Дараагийн workflow run хүлээх эсвэл гараар ажиллуулах

**Шинэчлэсний дараа:**

- ✅ Gemini API ажиллана
- ✅ Монгол хэл дээр tweet үүсгэгдэнэ
- ✅ Илүү сайн чанартай контент

---

**Энэ нь сүүлчийн шаардлагатай алхам! Шинэчлэсний дараа бүх зүйл төгс ажиллана!** 🚀✨
