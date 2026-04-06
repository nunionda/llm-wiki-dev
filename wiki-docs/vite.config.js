import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const wikiPlugin = () => ({
  name: 'wiki-api',
  configureServer(server) {
    // 1. Ingest API
    server.middlewares.use('/api/ingest', (req, res, next) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const content = `# ${data.title}\n\n${data.content}\n`;
            const filename = `mobile_vibe_${Date.now()}.md`;
            const filepath = path.resolve(__dirname, '../wiki/raw/', filename);
            fs.writeFileSync(filepath, content);
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, file: filename }));
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });

    // 2. Search API (qmd Integration)
    server.middlewares.use('/api/search', (req, res, next) => {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const query = url.searchParams.get('q');
      
      if (query) {
        try {
          console.log(`\x1b[35m[Search API]\x1b[0m Semantic Query: ${query}`);
          // Execute qmd query
          const output = execSync(`npx qmd query "${query}" --json`, { encoding: 'utf-8' });
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(output);
        } catch (e) {
          console.error(`\x1b[31m[Search Error]\x1b[0m ${e.message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Search engine failed or index not ready." }));
        }
      } else {
        next();
      }
    });

    // 3. Sync API (Full Knowledge Synthesis)
    server.middlewares.use('/api/sync', (req, res, next) => {
      if (req.method === 'POST') {
        try {
          console.log(`\x1b[35m[Sync API]\x1b[0m Starting Full Knowledge Synthesis...`);
          
          // Execute maintenance scripts
          execSync(`node ../scripts/bookkeeper.js`, { stdio: 'inherit' });
          execSync(`node ../scripts/insight-engine.js`, { stdio: 'inherit' });
          execSync(`node ../scripts/link-validator.js`, { stdio: 'inherit' });
          
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, timestamp: new Date().toISOString() }));
        } catch (e) {
          console.error(`\x1b[31m[Sync Error]\x1b[0m ${e.message}`);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: e.message }));
        }
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    wikiPlugin(),
    nodePolyfills(),
  ],
  server: {
    port: 10000,
    host: '127.0.0.1'
  }
})

