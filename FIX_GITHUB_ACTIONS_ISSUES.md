# 🔧 GitHub Actions Асуудлууд - Шийдэл

## 🔴 Одоогийн асуудлууд

### 1️⃣ Reddit 403 Forbidden
```
❌ Reddit татахад алдаа: Request failed with status code 403
```

**Шалтгаан:** GitHub Actions IP хаяг Reddit-д блок хийгдсэн байна

---

### 2️⃣ Gemini API 403/404 алдаа (өдөр бүр)
```
⚠️ gemini-2.5-flash алдаа: [403 Forbidden]
⚠️ gemini-1.5-flash алдаа: [404 Not Found]
```

**Шалтгаан:** GitHub Secrets-д `GOOGLE_API_KEY` байхгүй эсвэл хуучин

---

### 3️⃣ Fallback tweet англи хэл дээр
```
📝 Текст: A lot of "capture-the-flag" style ML puzzles give you...
```

**Шалтгаан:** Gemini ажиллахгүй тул fallback ашиглаж байна

---

## ✅ Шийдэл 1: Reddit идэвхгүй болгох

Reddit хандалт ямар ч тохиолдолд ажиллахгүй GitHub Actions дээр. Би үүнийг идэвхгүй болгоё:

### Алхам 1: Reddit sources устгах

**Файл:** `config/sources.json`

Энэ файлаас Reddit-тай холбоотой хэсгийг устгах эсвэл идэвхгүй болгох.

---

## ✅ Шийдэл 2: Google API Key тохируулах (ГҮЙЦЭТГЭХ ШААРДЛАГАТАЙ)

Энэ нь **сүүлчийн шийдэх асуудал**!

### Яагаад өдөр бүр алдаа гарч байна?

GitHub Actions-д таны **локал** `config/.env` файл **харагдахгүй**.

GitHub Actions зөвхөн **GitHub Secrets**-с утга уншдаг:
- ✅ Локал: `config/.env` → Таны компьютер дээр ажиллана
- ❌ GitHub Actions: `config/.env` → Харагдахгүй
- ✅ GitHub Actions: `secrets.GOOGLE_API_KEY` → Энийг ашиглах хэрэгтэй

---

## 🔧 ЯАРАЛТАЙ ХИЙХ: GitHub Secrets шинэчлэх

### Алхам 1: GitHub Settings руу орох

🔗 **https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions**

### Алхам 2: GOOGLE_API_KEY нэмэх/шинэчлэх

**Хэрэв байвал:**
1. `GOOGLE_API_KEY` олох
2. **"Update"** дарах
3. Доорх утгыг оруулах:
   ```
   AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI
   ```
4. **"Update secret"** дарах

**Хэрэв байхгүй бол:**
1. **"New repository secret"** дарах
2. **Name:** `GOOGLE_API_KEY`
3. **Value:** `AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI`
4. **"Add secret"** дарах

---

## 🔧 Шийдэл 3: Reddit эх сурвалж устгах

Reddit GitHub Actions дээр ажиллахгүй, тиймээс би үүнийг кодоос хасъя.

---

## 📊 Хүлээгдэж буй үр дүн

### Өмнө:
```
❌ Reddit татахад алдаа: Request failed with status code 403
⚠️ gemini-2.5-flash алдаа: [403 Forbidden]
📝 Fallback ашиглаж байна...
📝 Текст: A lot of "capture-the-flag" style ML puzzles... (англи)
```

### Дараа:
```
✅ Reddit алгасав (GitHub Actions дээр ажиллахгүй)
✅ Gemini API ажиллаж байна
📝 Текст: [Монгол хэл дээр бүрэн мэдээлэл]
```

---

## ⚡ 1 МИНУТЫН ШИЙДЭЛ

1. **Энэ линк дарах:** https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions
2. **GOOGLE_API_KEY нэмэх/шинэчлэх:**
   - Name: `GOOGLE_API_KEY`
   - Value: `AIzaSyBLlPt8ddohJ_YnUsKUKzfTThKPnXHFFDI`
3. **Хадгалах**

**Дараагийн bot run:** Gemini ажиллана, Монгол хэл дээр tweet үүсгэнэ! 🎉

---

## 🔍 Шалгах

Дараагийн GitHub Actions run (09:00, 13:00, 17:00, 21:00, 23:00):

**Logs-д харагдах ёстой:**
```
✅ Gemini товчлол амжилттай (model: gemini-2.5-flash)
📝 Текст: [Монгол хэл дээр мэдээлэл]
```

**БИЕС харагдах:**
```
⚠️ Бүх Gemini model-ууд амжилтгүй боллоо
📝 Fallback ашиглаж байна...
```
