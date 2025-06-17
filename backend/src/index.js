import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Pour retrouver __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Sert les fichiers markdown statiques dans /data
app.use('/data', express.static(path.join(__dirname, '../data')));

const articlesPath = path.resolve('./content/articles.json');
let articles = [];

try {
  const data = fs.readFileSync(articlesPath, 'utf-8');
  articles = JSON.parse(data);
} catch (err) {
  console.error('Erreur lecture articles.json:', err);
}

app.get('/articles', (req, res) => {
  res.json(articles);
});

app.listen(4000, () => {
  console.log('Backend démarré sur http://localhost:4000');
});
