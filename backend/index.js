import express from "express";
import cors from "cors";
import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname);

const app = express();
app.use(cors());

// Cache simple pour améliorer les performances
const cache = new Map();
const getCachedData = async (key, filePath) => {
  if (cache.has(key)) return cache.get(key);

  const data = await readFile(filePath, "utf-8");
  const parsed = JSON.parse(data);
  cache.set(key, parsed);
  return parsed;
};

// ----------------------
//  ENDPOINTS PRINCIPAUX
// ----------------------

// Liste des pays
app.get("/countries", (req, res) => {
  try {
    const countries = fs
      .readdirSync(path.join(rootDir, "content"))
      .filter((f) =>
        fs.lstatSync(path.join(rootDir, "content", f)).isDirectory()
      )
      .map((c) => c.toLowerCase());
    res.json(countries);
  } catch (err) {
    res.status(500).json({ error: "Impossible de lire les pays", details: err.message });
  }
});

// Liste des domaines pour un pays
app.get("/countries/:country/domains", (req, res) => {
  const { country } = req.params;
  try {
    const familyPath = path.join(rootDir, "data", country, "family");
    if (!fs.existsSync(familyPath)) return res.json([]);

    const domains = fs
      .readdirSync(familyPath)
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""));
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: `Impossible de lire les domaines pour ${country}`, details: err.message });
  }
});

// Liste des familles pour un domaine
app.get("/countries/:country/:domain/families", async (req, res) => {
  const { country, domain } = req.params;
  const filePath = path.join(rootDir, "data", country, "family", `${domain}.json`);

  try {
    const families = await getCachedData(`families_${country}_${domain}`, filePath);
    res.json(families);
  } catch (err) {
    res.status(404).json({ error: `Aucune famille trouvée pour ${country}/${domain}`, details: err.message });
  }
});

// Détails d’une famille
app.get("/countries/:country/:domain/:family", async (req, res) => {
  const { country, domain, family } = req.params;

  const familyPath = path.join(rootDir, "content", country, "family", domain, `${family}.json`);
  try {
    const familyData = await getCachedData(`family_${country}_${domain}_${family}`, familyPath);

    // Charger les modèles liés
    const modelsDir = path.join(rootDir, "data", country, "models", domain, family);
    let models = [];
    if (fs.existsSync(modelsDir)) {
      models = fs.readdirSync(modelsDir)
        .filter(f => f.endsWith(".json"))
        .map(f => f.replace(".json", ""));
    }
    familyData.models = models;

    res.json(familyData);
  } catch (err) {
    res.status(404).json({ error: `Famille ${country}/${domain}/${family} introuvable`, details: err.message });
  }
});

// Détails d’un modèle
app.get("/countries/:country/:domain/:family/:model", async (req, res) => {
  const { country, domain, family, model } = req.params;

  const modelPath = path.join(rootDir, "content", country, "models", domain, family, `${model}.json`);
  try {
    const modelData = await getCachedData(`model_${country}_${domain}_${family}_${model}`, modelPath);

    // Ajouter la famille parente
    const parentFamilyPath = path.join(rootDir, "content", country, "family", domain, `${family}.json`);
    try {
      const familyData = await getCachedData(`family_${country}_${domain}_${family}`, parentFamilyPath);
      modelData.familyData = familyData;
    } catch {
      // Pas grave si la famille n'existe pas
    }

    res.json(modelData);
  } catch (err) {
    res.status(404).json({ error: `Modèle ${country}/${domain}/${family}/${model} introuvable`, details: err.message });
  }
});

// ----------------------
//  ENDPOINTS UTILITAIRES
// ----------------------

// Stats globales
app.get("/stats", (req, res) => {
  try {
    const stats = {
      countries: 0,
      domains: [],
      totalFamilies: 0,
      totalModels: 0,
      cacheSize: cache.size,
    };

    const countries = fs.readdirSync(path.join(rootDir, "data"));
    stats.countries = countries.length;

    const domainCounts = {};

    countries.forEach(country => {
      const familyDir = path.join(rootDir, "data", country, "family");
      if (!fs.existsSync(familyDir)) return;

      const domains = fs.readdirSync(familyDir).map(f => f.replace(".json", ""));
      domains.forEach(domain => {
        if (!domainCounts[domain]) {
          domainCounts[domain] = { families: 0, models: 0 };
        }

        // Familles
        const familyFile = path.join(familyDir, `${domain}.json`);
        if (fs.existsSync(familyFile)) {
          const families = JSON.parse(fs.readFileSync(familyFile, "utf-8"));
          domainCounts[domain].families += families.length;
          stats.totalFamilies += families.length;
        }

        // Modèles
        const modelsDir = path.join(rootDir, "data", country, "models", domain);
        if (fs.existsSync(modelsDir)) {
          const familiesDirs = fs.readdirSync(modelsDir).filter(f => fs.lstatSync(path.join(modelsDir, f)).isDirectory());
          familiesDirs.forEach(family => {
            const familyModels = fs.readdirSync(path.join(modelsDir, family)).filter(f => f.endsWith(".json"));
            domainCounts[domain].models += familyModels.length;
            stats.totalModels += familyModels.length;
          });
        }
      });
    });

    stats.domains = Object.keys(domainCounts).map(domain => ({
      name: domain,
      families: domainCounts[domain].families,
      models: domainCounts[domain].models,
    }));

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors du calcul des stats", details: err.message });
  }
});

// Reset cache
app.post("/clear-cache", (req, res) => {
  cache.clear();
  res.json({ message: "Cache vidé" });
});

// Recherche globale
app.get("/search", async (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json([]);

  const results = [];

  try {
    const countries = fs.readdirSync(path.join(rootDir, "content"));

    for (const country of countries) {
      const countryPath = path.join(rootDir, "content", country);
      if (!fs.lstatSync(countryPath).isDirectory()) continue;

      // --- FAMILLES ---
      const familyDomains = fs.readdirSync(path.join(countryPath, "family"));
      for (const domain of familyDomains) {
        const domainPath = path.join(countryPath, "family", domain);

        const familyFiles = fs.readdirSync(domainPath).filter(f => f.endsWith(".json"));
        for (const file of familyFiles) {
          const slug = file.replace(".json", "");
          const filePath = path.join(domainPath, file);

          try {
            const data = JSON.parse(await readFile(filePath, "utf-8"));
            const text = JSON.stringify(data).toLowerCase();

            if (text.includes(q)) {
              results.push({
                type: "family",
                country,
                domain,
                slug,
                title: data.title || slug,
              });
            }
          } catch {
            // ignorer erreurs de parsing
          }
        }
      }

      // --- MODÈLES ---
      const modelsDomainsPath = path.join(countryPath, "models");
      if (!fs.existsSync(modelsDomainsPath)) continue;

      const modelDomains = fs.readdirSync(modelsDomainsPath);
      for (const domain of modelDomains) {
        const domainPath = path.join(modelsDomainsPath, domain);

        const families = fs.readdirSync(domainPath).filter(f =>
          fs.lstatSync(path.join(domainPath, f)).isDirectory()
        );

        for (const family of families) {
          const familyPath = path.join(domainPath, family);
          const modelFiles = fs.readdirSync(familyPath).filter(f => f.endsWith(".json"));

          for (const file of modelFiles) {
            const slug = file.replace(".json", "");
            const filePath = path.join(familyPath, file);

            try {
              const data = JSON.parse(await readFile(filePath, "utf-8"));
              const text = JSON.stringify(data).toLowerCase();

              if (text.includes(q)) {
                results.push({
                  type: "model",
                  country,
                  domain,
                  family,
                  slug,
                  title: data.title || slug,
                });
              }
            } catch {
              // ignorer erreurs de parsing
            }
          }
        }
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la recherche", details: err.message });
  }
});


// ----------------------
//  SERVER START
// ----------------------

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend démarré sur http://localhost:${PORT}`);
  console.log(`Stats disponibles sur http://localhost:${PORT}/stats`);
  console.log(`Recherche disponible sur http://localhost:${PORT}/search?q=amx`);
});
