# 🪟 Windows дээр байнга ажиллуулах заавар

---

## 📋 Шаардлага

- ✅ Windows 10/11
- ✅ Node.js суусан байх (https://nodejs.org/)
- ✅ Компьютер асаалттай байх

---

## 🚀 Алхам 1: Bot файлуудыг хуулах

Bot одоо энд байна:
```
D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot\
```

Хэрэв байхгүй бол Skywork-аас хуулж татаарай.

---

## 🚀 Алхам 2: Node.js суулгах

Хэрэв суугаагүй бол:

1. https://nodejs.org/ нээх
2. **LTS** хувилбар татах
3. Суулгаад **компьютер restart хийх**

Шалгах:
```powershell
node --version
npm --version
```

---

## 🚀 Алхам 3: Dependencies суулгах

PowerShell нээгээд:

```powershell
cd D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot
npm install
```

---

## 🚀 Алхам 4: Тест хийх

```powershell
node src/index.js test
```

✅ Амжилттай бол Twitter account мэдээлэл харагдана.

---

## 🚀 Алхам 5: Автомат эхлүүлэх

### А) Task Scheduler ашиглах (Windows автомат эхлүүлэлт)

#### 1. PowerShell скрипт үүсгэх

`D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot\start-bot.ps1` файл үүсгэх:

```powershell
# Twitter Bot автомат эхлүүлэх скрипт
cd D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot
node src/scheduler.js
```

#### 2. Task Scheduler тохируулах

1. **Win + R** дарж `taskschd.msc` бичих
2. **Create Task** дарах
3. **General** tab:
   - Нэр: `Twitter Tech Bot`
   - ☑ Run whether user is logged on or not
   - ☑ Run with highest privileges
4. **Triggers** tab:
   - **New** дарах
   - Begin: **At startup**
   - ☑ Enabled
5. **Actions** tab:
   - **New** дарах
   - Action: **Start a program**
   - Program: `powershell.exe`
   - Arguments: `-File "D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot\start-bot.ps1"`
6. **Conditions** tab:
   - ☐ Start only if on AC power (ЦЭВЭРЛэх)
7. **Settings** tab:
   - ☑ If task fails, restart every: **5 minutes**
8. **OK** дарах

Одоо компьютер асахад бот автоматаар эхэлнэ!

---

### Б) PM2 ашиглах (Илүү найдвартай)

```powershell
# PM2 суулгах
npm install -g pm2
npm install -g pm2-windows-startup

# Windows startup тохируулах
pm2-startup install

# Bot эхлүүлэх
cd D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot
pm2 start src/scheduler.js --name twitter-bot

# Автомат эхлүүлэлт хадгалах
pm2 save

# Статус шалгах
pm2 status

# Лог үзэх
pm2 logs twitter-bot

# Зогсооно
pm2 stop twitter-bot

# Дахин эхлүүлэх
pm2 restart twitter-bot
```

---

## 🎮 Удирдах командууд

### Нэг удаа пост хийх
```powershell
cd D:\SKYworkfolder\6rRR86eTfCKjp6g1ZR6eBs\twitter-tech-bot
node src/index.js
```

### Өдөрт 5 удаа автомат
```powershell
node src/scheduler.js
```

### PM2-ээр
```powershell
pm2 status           # Статус
pm2 logs twitter-bot # Лог
pm2 stop twitter-bot # Зогсооно
pm2 restart twitter-bot # Дахин эхлүүлэх
pm2 delete twitter-bot  # Устгах
```

---

## ⚠️ Анхааруулга

### Компьютер унтраавал бот зогсоно!

Хэрэг хэрэгцээний үед:
- Компьютер унтраахын өмнө `pm2 stop twitter-bot` хийх
- Асаасны дараа `pm2 start twitter-bot` хийх

Эсвэл Task Scheduler-ээр автомат ажиллуулах.

---

## 💡 Зөвлөмж

Хэрэв **24/7 ажиллуулахыг** хүсвэл:
- Хуучин компьютер ашиглах
- Эсвэл Cloud server түрээслэх ($5-10/сар)

---

## 🆘 Алдаа засах

### "node: command not found"

Node.js суугаагүй. https://nodejs.org/ татаж суулгаарай.

### "Cannot find module"

```powershell
npm install
```

### PowerShell script ажиллахгүй

Execution policy өөрчлөх:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

**Амжилт хүсье!** 🚀
