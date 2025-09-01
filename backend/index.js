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

// ⚡ Charger la liste des pays dispo
app.get('/countries', (req, res) => {
  try {
    const countries = fs.readdirSync(path.join(rootDir, 'data'))
      .filter((f) => fs.lstatSync(path.join(rootDir, 'data', f)).isDirectory());
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: 'Impossible de lire les pays', details: err.message });
  }
});

// ⚡ Route: /:country/:domain → liste des véhicules
app.get('/:country/:domain', async (req, res) => {
  const { country, domain } = req.params;
  const filePath = path.join(rootDir, 'data', country, `${domain}.json`);

  try {
    const data = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(404).json({
      error: `Fichier data/${country}/${domain}.json introuvable`,
      details: err.message,
    });
  }
});

// ⚡ Nouvelle route /vehicles pour filtrer facilement depuis le front
app.get('/vehicles', async (req, res) => {
  const { country, domain } = req.query;
  if (!country || !domain) return res.status(400).json({ error: 'Missing country or domain' });

  const filePath = path.join(rootDir, 'data', country, `${domain}.json`);
  try {
    const data = await readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    res.json(parsed);
  } catch (err) {
    res.json([]); // si fichier introuvable, on renvoie un tableau vide
  }
});

// ⚡ Route: /:country/:domain/:slug → contenu détaillé
app.get('/:country/:domain/:slug', async (req, res) => {
  const { country, domain, slug } = req.params;
  const filePath = path.join(rootDir, 'content', country, domain, `${slug}.json`);

  try {
    const data = await readFile(filePath, 'utf-8');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(404).json({
      error: `Fichier content/${country}/${domain}/${slug}.json introuvable`,
      details: err.message,
    });
  }
});

// ⚡ Images
app.use('/images', express.static(path.join(rootDir, 'images')));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
});
