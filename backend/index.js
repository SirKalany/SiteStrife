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

// 🚀 Cache simple pour améliorer les performances
const cache = new Map();
const getCachedData = async (key, filePath) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  try {
    const data = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);
    cache.set(key, parsed);
    return parsed;
  } catch (err) {
    throw err;
  }
};

// ⚡ Charger la liste des pays disponibles
app.get("/countries", (req, res) => {
  try {
    const countries = fs
      .readdirSync(path.join(rootDir, "content"))
      .filter((f) =>
        fs.lstatSync(path.join(rootDir, "content", f)).isDirectory()
      )
      .map((c) => c.toLowerCase()); // garde en minuscules pour la cohérence
    res.json(countries);
  } catch (err) {
    res.status(500).json({
      error: "Impossible de lire les pays",
      details: err.message,
    });
  }
});

// ⚡ Liste des domaines disponibles pour un pays
app.get("/countries/:country/domains", (req, res) => {
  const { country } = req.params;
  
  try {
    const domains = [];
    const familyPath = path.join(rootDir, "data", country, "family");
    
    if (fs.existsSync(familyPath)) {
      const domainFiles = fs
        .readdirSync(familyPath)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
      domains.push(...domainFiles);
    }
    
    res.json(domains);
  } catch (err) {
    res.status(500).json({
      error: `Impossible de lire les domaines pour ${country}`,
      details: err.message,
    });
  }
});

// ⚡ Liste des familles pour un domaine d'un pays
app.get("/:domain/:country", async (req, res) => {
  const { country, domain } = req.params;
  const filePath = path.join(rootDir, "data", country, "family", `${domain}.json`);

  try {
    const families = await getCachedData(`families_${country}_${domain}`, filePath);
    res.json(families);
  } catch (err) {
    res.status(404).json({ 
      error: `Aucune famille trouvée pour ${country}/${domain}`,
      details: err.message 
    });
  }
});

// ⚡ Détails d'une famille (ex: /ground/france/amx-13)
app.get("/:domain/:country/:slug", async (req, res) => {
  const { country, domain, slug } = req.params;
  
  // D'abord, essayer de charger comme famille
  const familyPath = path.join(rootDir, "content", country, "family", domain, `${slug}.json`);
  
  try {
    const familyData = await getCachedData(`family_${country}_${domain}_${slug}`, familyPath);
    
    // Enrichir avec les modèles de cette famille
    const modelsPath = path.join(rootDir, "data", country, "models", `${domain}.json`);
    try {
      const allModels = await getCachedData(`models_${country}_${domain}`, modelsPath);
      const familyModels = allModels.filter(model => model.family === slug);
      familyData.models = familyModels;
    } catch (modelsErr) {
      // Pas grave si pas de modèles
      familyData.models = [];
    }
    
    res.json(familyData);
  } catch (familyErr) {
    // Si ce n'est pas une famille, essayer comme modèle
    const modelPath = path.join(rootDir, "content", country, "models", domain, `${slug}.json`);
    
    try {
      const modelData = await getCachedData(`model_${country}_${domain}_${slug}`, modelPath);
      
      // Enrichir avec les données de la famille parente
      if (modelData.family) {
        const parentFamilyPath = path.join(rootDir, "content", country, "family", domain, `${modelData.family}.json`);
        try {
          const familyData = await getCachedData(`family_${country}_${domain}_${modelData.family}`, parentFamilyPath);
          modelData.familyData = familyData;
        } catch (parentErr) {
          // Pas grave si pas de famille parente
        }
      }
      
      res.json(modelData);
    } catch (modelErr) {
      res.status(404).json({
        error: `Article ${country}/${domain}/${slug} introuvable`,
        details: `Ni famille ni modèle trouvé pour ce slug`
      });
    }
  }
});

// ⚡ Liste des modèles pour une famille spécifique
app.get("/:domain/:country/:family/models", async (req, res) => {
  const { country, domain, family } = req.params;
  const filePath = path.join(rootDir, "data", country, "models", `${domain}.json`);

  try {
    const allModels = await getCachedData(`models_${country}_${domain}`, filePath);
    const familyModels = allModels.filter(model => model.family === family);
    res.json(familyModels);
  } catch (err) {
    res.status(404).json({
      error: `Impossible de charger les modèles pour ${family}`,
      details: err.message,
    });
  }
});

// 🔍 Recherche globale (optionnel)
app.get("/search", async (req, res) => {
  const { q, country, domain } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: "Query trop courte (min 2 caractères)" });
  }
  
  try {
    const results = [];
    const searchTerm = q.toLowerCase();
    
    // Définir les pays et domaines à chercher
    const countriesToSearch = country ? [country] : fs.readdirSync(path.join(rootDir, "data"));
    const domainsToSearch = domain ? [domain] : ['ground', 'air', 'naval', 'infantry', 'heavy'];
    
    for (const countryDir of countriesToSearch) {
      for (const domainName of domainsToSearch) {
        // Chercher dans les familles
        const familyPath = path.join(rootDir, "data", countryDir, "family", `${domainName}.json`);
        if (fs.existsSync(familyPath)) {
          const families = JSON.parse(await readFile(familyPath, "utf-8"));
          families.forEach(family => {
            if (family.name.toLowerCase().includes(searchTerm) || 
                family.type.toLowerCase().includes(searchTerm)) {
              results.push({
                type: 'family',
                country: countryDir,
                domain: domainName,
                ...family
              });
            }
          });
        }
        
        // Chercher dans les modèles
        const modelsPath = path.join(rootDir, "data", countryDir, "models", `${domainName}.json`);
        if (fs.existsSync(modelsPath)) {
          const models = JSON.parse(await readFile(modelsPath, "utf-8"));
          models.forEach(model => {
            if (model.name.toLowerCase().includes(searchTerm) || 
                model.type.toLowerCase().includes(searchTerm)) {
              results.push({
                type: 'model',
                country: countryDir,
                domain: domainName,
                ...model
              });
            }
          });
        }
      }
    }
    
    res.json(results.slice(0, 20)); // Limiter à 20 résultats
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors de la recherche",
      details: err.message,
    });
  }
});

// ⚡ Images statiques
app.use("/images", express.static(path.join(rootDir, "images")));

// 🧹 Clear cache endpoint (utile en dev)
app.post("/clear-cache", (req, res) => {
  cache.clear();
  res.json({ message: "Cache vidé" });
});

// 📊 Stats endpoint (optionnel)
app.get("/stats", (req, res) => {
  try {
    const stats = {
      countries: 0,
      domains: [],
      totalFamilies: 0,
      totalModels: 0,
      cacheSize: cache.size
    };
    
    const countries = fs.readdirSync(path.join(rootDir, "data"));
    stats.countries = countries.length;
    
    // Compter familles et modèles par domaine
    const domainCounts = {};
    
    countries.forEach(country => {
      const familyDir = path.join(rootDir, "data", country, "family");
      if (fs.existsSync(familyDir)) {
        const domains = fs.readdirSync(familyDir).map(f => f.replace('.json', ''));
        domains.forEach(domain => {
          if (!domainCounts[domain]) {
            domainCounts[domain] = { families: 0, models: 0 };
          }
          
          // Compter familles
          const familyFile = path.join(familyDir, `${domain}.json`);
          if (fs.existsSync(familyFile)) {
            const families = JSON.parse(fs.readFileSync(familyFile, 'utf-8'));
            domainCounts[domain].families += families.length;
            stats.totalFamilies += families.length;
          }
          
          // Compter modèles
          const modelsFile = path.join(rootDir, "data", country, "models", `${domain}.json`);
          if (fs.existsSync(modelsFile)) {
            const models = JSON.parse(fs.readFileSync(modelsFile, 'utf-8'));
            domainCounts[domain].models += models.length;
            stats.totalModels += models.length;
          }
        });
      }
    });
    
    stats.domains = Object.keys(domainCounts).map(domain => ({
      name: domain,
      families: domainCounts[domain].families,
      models: domainCounts[domain].models
    }));
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({
      error: "Erreur lors du calcul des stats",
      details: err.message
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Backend démarré sur http://localhost:${PORT}`);
  console.log(`📊 Stats disponibles sur http://localhost:${PORT}/stats`);
  console.log(`🔍 Recherche disponible sur http://localhost:${PORT}/search?q=amx`);
});