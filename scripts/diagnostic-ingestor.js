import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using Gemini - the Free-tier King as the Benchmark's Winner
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listAndRun() {
  console.log(`\x1b[34m[Diagnostic]\x1b[0m Checking Gemini Model Availability...`);
  // Note: ListModels is not easily available in the simple SDK without a fetch.
  // We will try the most common production ID 'gemini-1.5-flash' but with a direct call.
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const files = fs.readdirSync(path.resolve(__dirname, '../wiki/raw'))
                 .filter(f => fs.lstatSync(path.resolve(__dirname, '../wiki/raw', f)).isFile() && !f.startsWith('.'));

  for (const file of files) {
    const filePath = path.resolve(__dirname, '../wiki/raw', file);
    console.log(`\x1b[35m[Ingestor]\x1b[0m Processing: ${file}`);
    const content = fs.readFileSync(filePath, 'utf-8');

    const prompt = `Deconstruct this into 10-15 atomic fragments. Return ONLY a JSON array.
    [{ "id": "slug", "title": "...", "category": "...", "content": "..." }]
    
    CONTENT:
    ${content}`;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
      const fragments = JSON.parse(text);
      console.log(`\x1b[32m[Success]\x1b[0m Generated ${fragments.length} fragments.`);
      
      // ... write logic same as before ...
    } catch (e) {
      console.error(`\x1b[31m[Error]\x1b[0m ${e.message}`);
    }
  }
}

listAndRun();
