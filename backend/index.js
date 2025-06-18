import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup chemins absolus
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Utilitaire pour charger un JSON depuis /data
function loadJSON(filename) {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, `./data/${filename}`), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Erreur lecture ${filename}:`, err);
    return [];
  }
}

// Chargement des fichiers de données
const ammo = loadJSON('ammo.json');
const air = loadJSON('air.json');
const ground = loadJSON('ground.json');
const heavy = loadJSON('heavy.json');
const infantry = loadJSON('infantry.json');
const naval = loadJSON('naval.json');

// Routes pour chaque domaine
app.get('/ammo', (req, res) => res.json(ammo));
app.get('/air', (req, res) => res.json(air));
app.get('/ground', (req, res) => res.json(ground));
app.get('/heavy', (req, res) => res.json(heavy));
app.get('/infantry', (req, res) => res.json(infantry));
app.get('/naval', (req, res) => res.json(naval));

// Route dynamique pour charger un contenu HTML spécifique
app.get('/content/:domain/:slug', async (req, res) => {
  const { domain, slug } = req.params;
  const filePath = path.resolve(__dirname, `./content/${domain}/${slug}.html`);

  try {
    const html = await fs.promises.readFile(filePath, 'utf-8');
    res.send(html);
  } catch (err) {
    console.error(`Erreur chargement fichier HTML ${filePath}`, err);
    res.status(404).send("Contenu introuvable");
  }
});

// Lancement du serveur
app.listen(4000, () => {
  console.log('✅ Backend démarré sur http://localhost:4000');
});
