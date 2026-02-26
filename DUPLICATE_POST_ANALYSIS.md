# 🐛 Twitter Bot Давтагдсан Post Асуудлын Шинжилгээ

## 📋 Асуудлын тодорхойлолт

**Тохиолдол:** Twitter bot (@Temuujin_TV) өчигдөр **5 удаа ижил пост** оруулсан байна.

**Огноо:** 2026-02-25 (өчигдөр)

---

## 🔍 Шалтгааны шинжилгээ

### 1️⃣ **GitHub Actions Workflow асуудал**

#### Одоогийн тохиргоо (.github/workflows/twitter-bot-new.yml):

```yaml
schedule:
  - cron: '0 1 * * *'   # 09:00 (Монгол)
  - cron: '0 5 * * *'   # 13:00 (Монгол)
  - cron: '0 9 * * *'   # 17:00 (Монгол)
  - cron: '0 13 * * *'  # 21:00 (Монгол)
  - cron: '0 15 * * *'  # 23:00 (Монгол)
```

✅ **Өдөрт 5 удаа** ажилладаг - энэ нь зөв.

❌ **Гол асуудал:**

```yaml
- name: Commit posted links
  run: |
    git config --local user.email "github-actions[bot]@users.noreply.github.com"
    git config --local user.name "github-actions[bot]"
    git add data/posted_links.json || true
    git diff --quiet && git diff --staged --quiet || git commit -m "Update posted links [skip ci]"
    git push || true  # ⚠️ ЭНЭ ХЭСЭГ АЛДААТАЙ
```

**`|| true` тэмдэглэгээ нь:**
- Git push алдаа гарсан ч үргэлжлүүлнэ
- `posted_links.json` файл GitHub-д push хийгдэхгүй байж болно
- Дараагийн удаа bot ажиллахад **давтагдсан мэдээг дахин post хийнэ**

---

### 2️⃣ **Давтагдах шалгалтын механизм**

#### Код (src/index.js, мөр 65-77):

```javascript
// Өмнө нь post хийсэн мэдээнүүдийг шүүх (link-ээр шалгах)
const postedLinks = await loadPostedLinks();
const freshArticles = articles.filter(article => !postedLinks.has(article.link));

if (freshArticles.length === 0) {
  console.log('⚠️ Бүх мэдээ аль хэдийн post хийгдсэн байна.');
  return;
}

const bestArticle = freshArticles[0];
```

✅ **Логик зөв байна** - давтагдсан мэдээг алгасах

❌ **Гэхдээ:**
- Хэрэв `posted_links.json` GitHub-д push хийгдээгүй бол
- Дараагийн workflow run-д энэ файл **хуучин хувилбараар** буцаж ирнэ
- Өмнө post хийсэн link **алга болно**

---

## ✅ Шийдэл

### 🔧 **1. Workflow засварлах (Шинэ файл үүсгэсэн)**

**Файл:** `.github/workflows/twitter-bot-new-fixed.yml`

**Сайжруулалтууд:**

1. **Git push permission нэмэх:**
   ```yaml
   permissions:
     contents: write
   ```

2. **Token тохиргоо:**
   ```yaml
   - name: Checkout repository
     uses: actions/checkout@v4
     with:
       fetch-depth: 0
       token: ${{ secrets.GITHUB_TOKEN }}
   ```

3. **Retry logic нэмэх:**
   ```bash
   max_retries=3
   retry_count=0
   
   while [ $retry_count -lt $max_retries ]; do
     if git push; then
       echo "✅ Git push амжилттай!"
       break
     else
       retry_count=$((retry_count + 1))
       echo "⚠️ Push амжилтгүй, дахин оролдож байна ($retry_count/$max_retries)..."
       sleep 5
       git pull --rebase origin main || true
     fi
   done
   ```

4. **Backup систем:**
   ```bash
   - name: Backup posted links
     run: |
       if [ -f data/posted_links.json ]; then
         cp data/posted_links.json data/posted_links.backup.json
       fi
   ```

---

### 🔧 **2. Код сайжруулалт (index.js)**

**Нэмсэн шинжилгээ:**

```javascript
// Өмнө нь post хийсэн мэдээнүүдийг шүүх (link-ээр шалгах)
const postedLinks = await loadPostedLinks();
console.log(`📊 Одоо байгаа posted links: ${postedLinks.size}`);

const freshArticles = articles.filter(article => {
  const isPosted = postedLinks.has(article.link);
  if (isPosted) {
    console.log(`⏭️  Алгасах (давтагдсан): ${article.title.substring(0, 60)}...`);
  }
  return !isPosted;
});

console.log(`✅ Шинэ мэдээ олдлоо: ${freshArticles.length}`);
```

**Сайжруулсан хадгалах функц:**

```javascript
async function savePostedLink(link) {
  try {
    const postedPath = path.join(process.cwd(), 'data', 'posted_links.json');
    const postedLinks = await loadPostedLinks();
    postedLinks.add(link);
    await fs.writeFile(postedPath, JSON.stringify([...postedLinks], null, 2), 'utf-8');
    console.log(`✅ Posted link хадгалагдлаа: ${link}`);
    console.log(`📊 Нийт posted links: ${postedLinks.size}`);
  } catch (error) {
    console.error('❌ Posted links хадгалахад алдаа:', error.message);
    throw error; // Re-throw to catch in runBot
  }
}
```

---

## 📊 Одоогийн posted_links.json

```json
[
  "https://gizmodo.com/ai-added-basically-zero-to-us-economic-growth-last-year-goldman-sachs-says-2000725380",
  "https://www.techspot.com/news/110196-data-centers-now-hoarding-ssds-hard-drive-supplies.html",
  "https://www.earth.com/news/process-microbes-turn-desert-sand-into-fertile-soil-in-just-10-months/",
  "https://www.techspot.com/news/111431-sam-altman-compares-ai-energy-use-cost-training.html",
  "https://fortune.com/2026/02/24/discord-peter-thiel-backed-persona-identity-verification-breach/",
  ... (11 links total)
]
```

**Нийт:** 11 мэдээ аль хэдийн post хийгдсэн байна.

---

## 🚀 Хэрэгжүүлэх алхамууд

### 1️⃣ **Шинэ workflow идэвхжүүлэх**

```bash
# Хуучин workflow устгах эсвэл нэрийг өөрчлөх
mv .github/workflows/twitter-bot-new.yml .github/workflows/twitter-bot-new.old.yml

# Шинэ workflow-ыг идэвхжүүлэх
mv .github/workflows/twitter-bot-new-fixed.yml .github/workflows/twitter-bot-new.yml
```

### 2️⃣ **Өөрчлөлтүүдийг commit & push**

```bash
git add .
git commit -m "Fix: Давтагдсан пост асуудал засав - git push retry logic нэмэв"
git push origin main
```

### 3️⃣ **GitHub Actions шалгах**

1. GitHub repository -> **Actions** tab руу орох
2. Дараагийн workflow run-г хянах
3. Logs-г шалгаж `posted_links.json` зөв push хийгдэж байгаа эсэхийг баталгаажуулах

### 4️⃣ **Тест хийх**

```bash
# Локал тест
npm install
node src/index.js

# Test mode (Twitter-т бичихгүй)
node src/index.js test
```

---

## 📈 Хүлээгдэж буй үр дүн

✅ **Git push амжилттай** - `posted_links.json` GitHub-д хадгалагдана
✅ **Давтагдсан мэдээ post хийгдэхгүй** - алдаа дахигдахгүй
✅ **Илүү тодорхой logging** - асуудал илрэх хялбар болно
✅ **Retry механизм** - түр зуурын git алдаанаас сэргийлнэ

---

## 🔒 Нэмэлт зөвлөмжүүд

### 1. **Database ашиглах (сонголт)**

`posted_links.json` файлын оронд SQLite эсвэл MongoDB ашиглаж болно:

```javascript
// Example: SQLite
import Database from 'better-sqlite3';

const db = new Database('data/bot.db');
db.exec(`
  CREATE TABLE IF NOT EXISTS posted_links (
    link TEXT PRIMARY KEY,
    posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

function isPosted(link) {
  const row = db.prepare('SELECT link FROM posted_links WHERE link = ?').get(link);
  return !!row;
}

function savePostedLink(link) {
  db.prepare('INSERT OR IGNORE INTO posted_links (link) VALUES (?)').run(link);
}
```

### 2. **Timestamp нэмэх**

```json
[
  {
    "link": "https://example.com/article",
    "posted_at": "2026-02-25T12:30:00Z"
  }
]
```

### 3. **Хуучин мэдээг цэвэрлэх**

```javascript
// 30 хоногоос хуучин мэдээг устгах
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
const freshLinks = postedLinks.filter(link => link.posted_at > thirtyDaysAgo);
```

---

## 📞 Дүгнэлт

**Асуудал:** Git push алдаатай байсан нь `posted_links.json` файл GitHub-д хадгалагдахгүй байсан.

**Шийдэл:** 
1. ✅ Git push retry logic нэмэв
2. ✅ Permission тохируулав
3. ✅ Logging сайжруулав
4. ✅ Backup механизм нэмэв

**Одоо:** Bot давтагдсан мэдээ post хийхгүй болно! 🎉

---

**Засварласан файлууд:**
- ✅ `.github/workflows/twitter-bot-new-fixed.yml` (шинэ)
- ✅ `src/index.js` (сайжруулсан)
- ✅ `DUPLICATE_POST_ANALYSIS.md` (энэ файл)
