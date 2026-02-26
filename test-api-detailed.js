import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'config', '.env') });

async function testDetailed() {
  const apiKey = process.env.GOOGLE_API_KEY;
  console.log('🔍 API Key шалгах:');
  console.log(`   Урт: ${apiKey?.length || 0} тэмдэгт`);
  console.log(`   Эхлэл: ${apiKey?.substring(0, 10)}`);
  console.log(`   Төгсгөл: ${apiKey?.substring(apiKey.length - 10)}`);
  console.log(`   Бүрэн: ${apiKey}`);
  console.log('');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent("Hi");
    console.log('✅ Success:', result.response.text());
  } catch (error) {
    console.log('❌ Алдаа:', error);
    console.log('');
    console.log('Status:', error.status);
    console.log('Message:', error.message);
  }
}

testDetailed();
