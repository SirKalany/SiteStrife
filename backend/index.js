import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);

const app = express();
app.use(cors());

function loadJSON(filename) {
  try {
    const filePath = path.join(rootDir, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`❌ Erreur lecture ${filename}:`, err);
    return [];
  }
}

const ammo = loadJSON('ammo.json');
const air = loadJSON('air.json');
const ground = loadJSON('ground.json');
const heavy = loadJSON('heavy.json');
const infantry = loadJSON('infantry.json');
const naval = loadJSON('naval.json');

app.get('/ammo', (req, res) => res.json(ammo));
app.get('/air', (req, res) => res.json(air));
app.get('/ground', (req, res) => res.json(ground));
app.get('/heavy', (req, res) => res.json(heavy));
app.get('/infantry', (req, res) => res.json(infantry));
app.get('/naval', (req, res) => res.json(naval));
app.use('/images', express.static(path.join(rootDir, 'images')));

function setupContentRoute(domaine) {
  app.get(`/${domaine}/:slug`, async (req, res) => {
    const { slug } = req.params;
    const filePath = path.join(rootDir, 'content', domaine, `${slug}.json`);
    try {
      const data = await readFile(filePath, 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(404).json({
        error: `Fichier ${domaine}/${slug}.json non trouvé`,
        details: err.message,
      });
    }
  });
}

['ammo', 'air', 'ground', 'heavy', 'infantry', 'naval'].forEach(setupContentRoute);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
});
