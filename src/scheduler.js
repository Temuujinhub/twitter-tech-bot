/**
 * Автомат хуваарийн scheduler (өдөрт 5 удаа санамсаргүй цагт)
 */

import cron from 'node-cron';
import { runBot } from './index.js';

/**
 * Санамсаргүй цаг үүсгэх
 */
function getRandomTimes(count, minHour, maxHour) {
  const times = [];
  const usedHours = new Set();
  
  while (times.length < count) {
    const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
    
    if (!usedHours.has(hour)) {
      const minute = Math.floor(Math.random() * 60);
      times.push({ hour, minute });
      usedHours.add(hour);
    }
  }
  
  return times.sort((a, b) => a.hour * 60 + a.minute - (b.hour * 60 + b.minute));
}

/**
 * Өдрийн хуваарь тохируулах
 */
export function scheduleDailyPosts(postsPerDay = 5, minHour = 8, maxHour = 23) {
  console.log(`\n⏰ Өдрийн ${postsPerDay} удаагийн хуваарь тохируулж байна...`);
  console.log(`   Цагийн хязгаар: ${minHour}:00 - ${maxHour}:00`);
  
  // Шөнө дунд (00:00) шинэ хуваарь үүсгэх
  cron.schedule('0 0 * * *', () => {
    console.log(`\n🔄 Өдрийн шинэ хуваарь үүсгэж байна...`);
    const times = getRandomTimes(postsPerDay, minHour, maxHour);
    
    console.log(`\n📅 Өнөөдрийн хуваарь:`);
    times.forEach((time, index) => {
      const timeStr = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
      console.log(`   ${index + 1}. ${timeStr}`);
      
      // Тухайн цагт пост хийх cron job үүсгэх
      cron.schedule(`${time.minute} ${time.hour} * * *`, async () => {
        console.log(`\n⏰ Хуваарийн цаг: ${timeStr}`);
        await runBot();
      });
    });
  });
  
  // Анх удаа одоо хуваарь үүсгэх
  const times = getRandomTimes(postsPerDay, minHour, maxHour);
  console.log(`\n📅 Өнөөдрийн хуваарь:`);
  times.forEach((time, index) => {
    const timeStr = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
    console.log(`   ${index + 1}. ${timeStr}`);
    
    cron.schedule(`${time.minute} ${time.hour} * * *`, async () => {
      console.log(`\n⏰ Хуваарийн цаг: ${timeStr}`);
      await runBot();
    });
  });
  
  console.log(`\n✅ Scheduler эхэллээ!\n`);
}

/**
 * Тест - дараагийн 1 минутад пост хийх
 */
export function scheduleTestPost() {
  const now = new Date();
  const nextMinute = new Date(now.getTime() + 60000);
  
  console.log(`\n🧪 Тест пост ${nextMinute.toLocaleTimeString('mn-MN')}-д хийгдэнэ...`);
  
  setTimeout(async () => {
    console.log(`\n⏰ Тест цаг!`);
    await runBot();
  }, 60000);
}

// Хэрэв энэ файл шууд ажиллуулбал
if (import.meta.url === `file://${process.argv[1]}`) {
  const postsPerDay = parseInt(process.env.POSTS_PER_DAY) || 5;
  const minHour = parseInt(process.env.MIN_HOUR) || 8;
  const maxHour = parseInt(process.env.MAX_HOUR) || 23;
  
  scheduleDailyPosts(postsPerDay, minHour, maxHour);
  
  console.log(`\n💡 Scheduler ажиллаж байна. Ctrl+C дарж зогсооно.\n`);
  
  // Keep the process running
  setInterval(() => {}, 1000 * 60 * 60);
}
