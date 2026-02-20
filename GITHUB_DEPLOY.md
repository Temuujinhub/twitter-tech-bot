# 🚀 GitHub руу Deploy хийх заавар

---

## ✅ Бүх файл бэлэн!

Таны bot одоо энд байна:
```
D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot\
```

---

## 📤 GitHub руу push хийх - 3 арга

### 🎯 Арга 1: GitHub Desktop (Хамгийн хялбар!)

#### 1. GitHub Desktop татаж суулгах
https://desktop.github.com/

#### 2. Repository нэмэх
1. **File** → **Add local repository**
2. Choose: `D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot`
3. **Add repository**

#### 3. Publish to GitHub
1. **Publish repository** товч дарах
2. Name: `twitter-tech-bot`
3. ☐ Keep this code private (эсвэл ✅ хийж private болго)
4. **Publish repository**

✅ Бүх зүйл автоматаар push хийгдэнэ!

---

### 🎯 Арга 2: Visual Studio Code

#### 1. VS Code-оор хавтсаа нээх
1. VS Code нээх
2. **File** → **Open Folder**
3. `D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot` сонгох

#### 2. Git тохируулах
1. **Source Control** (Ctrl+Shift+G) дарах
2. **Initialize Repository** дарах
3. Бүх файл **Stage** хийх (+)
4. Commit message бичих: `Initial commit`
5. **Commit** дарах

#### 3. GitHub руу push хийх
1. **Publish to GitHub** дарах
2. Repository name: `twitter-tech-bot`
3. Private эсвэл Public сонгох
4. **Publish** дарах

✅ Бүх зүйл автоматаар push хийгдэнэ!

---

### 🎯 Арга 3: Git Bash / PowerShell

#### 1. Git суулгах
https://git-scm.com/download/win

#### 2. PowerShell нээгээд командууд ажиллуулах

```powershell
# Хавтас руу шилжих
cd D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot

# Git тохируулах (анх удаа л хийнэ)
git config user.name "Temuujinhub"
git config user.email "your-email@example.com"

# Git repository эхлүүлэх
git init
git branch -m main

# Бүх файл нэмэх
git add .
git status

# Commit хийх
git commit -m "Initial commit: Twitter Tech Bot"

# Remote нэмэх
git remote add origin https://github.com/Temuujinhub/twitter-tech-bot.git

# Push хийх
git push -u origin main
```

**Хэрэв username/password асуувал:**
- Username: `Temuujinhub`
- Password: `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` (Personal Access Token)

---

## 🔐 GitHub Secrets тохируулах

Push хийсний дараа:

### 1. Repository Settings руу ор

https://github.com/Temuujinhub/twitter-tech-bot/settings/secrets/actions

### 2. Secrets нэмэх

**New repository secret** дараад дараах 4-ийг нэмнэ:

#### Secret 1:
- Name: `TWITTER_API_KEY`
- Value: `XX9YtO5XVpTpu6hztVCM1kK6U`

#### Secret 2:
- Name: `TWITTER_API_SECRET`
- Value: `Q4sxw0awDPvBiKMlkaHFAo1xwHLK9s5DP4WHJa63zbznWbV8g9`

#### Secret 3:
- Name: `TWITTER_ACCESS_TOKEN`
- Value: `1407440882-eoHCbNXMjJ9ennvP7weX6gJhwOzlKEZhIiOYhPU`

#### Secret 4:
- Name: `TWITTER_ACCESS_SECRET`
- Value: `uyHgqjZkWym0KEQykmvzRB3hS4DhHrdfHqYL6h6VLiojj`

---

## ✅ GitHub Actions идэвхжүүлэх

### 1. Actions tab руу ор

https://github.com/Temuujinhub/twitter-tech-bot/actions

### 2. "I understand my workflows, go ahead and enable them" дарах

### 3. Гараар ажиллуулж туршах

1. **Twitter Tech Bot** workflow дээр дарах
2. **Run workflow** → **Run workflow** дарах
3. Хэдэн секунд хүлээх
4. Ногоон ✅ харагдвал амжилттай!

---

## 📅 Хуваарь

GitHub Actions автоматаар өдөрт 5 удаа ажиллана:

**Монголын цагаар:**
- 09:00
- 13:00
- 17:00
- 21:00
- 01:00 (маргааш)

Өөрчлөх бол `.github/workflows/twitter-bot.yml` засах.

---

## 🎮 Удирдах

### Лог үзэх
1. https://github.com/Temuujinhub/twitter-tech-bot/actions
2. Сүүлийн run дээр дарах
3. **post-tweet** дарж лог үзэх

### Гараар ажиллуулах
1. **Actions** tab
2. **Twitter Tech Bot** workflow
3. **Run workflow** дарах

### Зогсооно
1. `.github/workflows/twitter-bot.yml` файл устгах
2. Эсвэл Actions Settings-аас disable хийх

---

## 💰 Үнэгүй лимит

GitHub Actions үнэгүй:
- ✅ **2,000 минут/сар** (Public repo)
- ✅ **500 минут/сар** (Private repo)

Таны bot:
- 1 удаа = ~1 минут
- 5 удаа/өдөр × 30 өдөр = **150 минут/сар**
- **ИЛҮҮ ИХ ХҮРНЭ!** ✅

---

## 🆘 Алдаа засах

### "Secrets not found"

GitHub Secrets зөв нэмсэн эсэхээ шалгаарай.

### "Workflow disabled"

Actions tab дээр "Enable" товч дарах.

### "Build failed"

Actions tab дээр лог шалгаад алдааг харах.

---

## 📚 Холбоосууд

- Repository: https://github.com/Temuujinhub/twitter-tech-bot
- Actions: https://github.com/Temuujinhub/twitter-tech-bot/actions
- Settings: https://github.com/Temuujinhub/twitter-tech-bot/settings

---

**Амжилт хүсье!** 🚀

Push хийсний дараа надад хэлээрэй, би Secrets тохируулах дэлгэрэнгүй заавар өгье!
