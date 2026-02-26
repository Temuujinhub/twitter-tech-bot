/**
 * Google Gemini API шалгах тест скрипт
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

async function testGeminiAPI() {
  console.log('🧪 Google Gemini API шалгаж байна...\n');
  
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GOOGLE_API_KEY олдсонгүй!');
    console.log('💡 config/.env файлд GOOGLE_API_KEY нэмнэ үү.');
    process.exit(1);
  }
  
  console.log(`✅ API Key олдлоо: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`);
  console.log('');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Өөр өөр model-уудыг шалгах
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro",
    "gemini-2.5-flash"  // Таны анхны сонголт
  ];
  
  const testPrompt = "Сайн уу! Би технологийн мэдээний bot. Та хэн бэ?";
  
  console.log('📝 Тест prompt:', testPrompt);
  console.log('─'.repeat(60));
  console.log('');
  
  const results = [];
  
  for (const modelName of modelsToTest) {
    try {
      console.log(`🔄 ${modelName} шалгаж байна...`);
      
      const model = genAI.getGenerativeModel({ model: modelName });
      const startTime = Date.now();
      
      const result = await model.generateContent(testPrompt);
      const response = await result.response;
      const text = response.text();
      
      const duration = Date.now() - startTime;
      
      console.log(`✅ АМЖИЛТТАЙ! (${duration}ms)`);
      console.log(`📤 Хариулт: ${text.substring(0, 100)}...`);
      console.log('');
      
      results.push({
        model: modelName,
        status: 'SUCCESS',
        duration,
        response: text.substring(0, 200)
      });
      
    } catch (error) {
      console.log(`❌ АЛДАА!`);
      console.log(`   Алдааны код: ${error.status || error.code || 'N/A'}`);
      console.log(`   Мессеж: ${error.message.substring(0, 150)}...`);
      console.log('');
      
      results.push({
        model: modelName,
        status: 'FAILED',
        error: error.message.substring(0, 200),
        errorCode: error.status || error.code
      });
    }
  }
  
  console.log('═'.repeat(60));
  console.log('📊 ДҮН:');
  console.log('═'.repeat(60));
  console.log('');
  
  const successfulModels = results.filter(r => r.status === 'SUCCESS');
  const failedModels = results.filter(r => r.status === 'FAILED');
  
  if (successfulModels.length > 0) {
    console.log(`✅ Ажилладаг model-ууд (${successfulModels.length}):`);
    successfulModels.forEach(r => {
      console.log(`   - ${r.model} (${r.duration}ms)`);
    });
    console.log('');
  }
  
  if (failedModels.length > 0) {
    console.log(`❌ Ажиллаагүй model-ууд (${failedModels.length}):`);
    failedModels.forEach(r => {
      console.log(`   - ${r.model}`);
      console.log(`     ${r.error.substring(0, 100)}...`);
    });
    console.log('');
  }
  
  console.log('═'.repeat(60));
  
  if (successfulModels.length > 0) {
    console.log(`\n💡 ЗӨВЛӨМЖ: "${successfulModels[0].model}" model ашиглана уу (хамгийн хурдан ажиллаа).`);
    console.log(`\n   src/contentGenerator.js файлд дараах мөрийг засна уу:`);
    console.log(`   const model = genAI.getGenerativeModel({ model: "${successfulModels[0].model}" });`);
  } else {
    console.log('\n⚠️  АНХААРУУЛГА: Ямар ч Gemini model ажиллаагүй!');
    console.log('');
    console.log('🔧 Шалгах зүйлс:');
    console.log('   1. API key зөв эсэхийг https://aistudio.google.com/app/apikey хаягаас шалгана уу');
    console.log('   2. API key-д хязгаарлалт тавигдсан эсэхийг Google Cloud Console-с шалгана уу');
    console.log('   3. Billing идэвхжүүлсэн эсэхийг шалгана уу (зарим model-д шаардлагатай)');
    console.log('   4. Quota/Rate limit хэтрээгүй эсэхийг шалгана уу');
  }
  
  console.log('');
}

testGeminiAPI().catch(error => {
  console.error('❌ Тест скрипт алдаа:', error.message);
  process.exit(1);
});
