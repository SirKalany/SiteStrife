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

// Charger la liste des pays disponibles
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
    res.status(500).json({
      error: "Impossible de lire les pays",
      details: err.message,
    });
  }
});

// Liste des domaines disponibles pour un pays
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

// Liste des familles pour un domaine d'un pays
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

// Détails d'une famille (ex: /ground/france/amx-13)
app.get("/:domain/:country/:slug", async (req, res) => {
  const { country, domain, slug } = req.params;
  
  // D'abord, essayer de charger comme famille
  const familyPath = path.join(rootDir, "content", country, "family", domain, `${slug}.json`);
  
  try {
    const familyData = await getCachedData(`family_${country}_${domain}_${slug}`, familyPath);
    
    // Enrichir avec les modèles de cette famille - NOUVELLE STRUCTURE
    const modelsDir = path.join(rootDir, "data", country, "models", domain, slug);
    try {
      if (fs.existsSync(modelsDir)) {
        const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.json'));
        const models = [];
        
        for (const file of modelFiles) {
          const modelData = JSON.parse(await readFile(path.join(modelsDir, file), 'utf-8'));
          models.push(modelData);
        }
        
        familyData.models = models;
      } else {
        familyData.models = [];
      }
    } catch (modelsErr) {
      familyData.models = [];
    }
    
    res.json(familyData);
  } catch (familyErr) {
    // Si ce n'est pas une famille, essayer comme modèle
    // Il faut deviner la famille du modèle pour la nouvelle structure
    res.status(404).json({
      error: `Article ${country}/${domain}/${slug} introuvable`,
      details: `Famille non trouvée. Pour un modèle, utilisez /domain/country/family/model`
    });
  }
});

// Détails d'un modèle spécifique (ex: /ground/france/amx-13/amx-13-dca-40)
app.get("/:domain/:country/:family/:model", async (req, res) => {
  const { country, domain, family, model } = req.params;
  
  const modelPath = path.join(rootDir, "content", country, "models", domain, family, `${model}.json`);
  
  try {
    const modelData = await getCachedData(`model_${country}_${domain}_${family}_${model}`, modelPath);
    
    // Enrichir avec les données de la famille parente
    const parentFamilyPath = path.join(rootDir, "content", country, "family", domain, `${family}.json`);
    try {
      const familyData = await getCachedData(`family_${country}_${domain}_${family}`, parentFamilyPath);
      modelData.familyData = familyData;
    } catch (parentErr) {
      // Pas grave si pas de famille parente
    }
    
    res.json(modelData);
  } catch (err) {
    res.status(404).json({
      error: `Modèle ${country}/${domain}/${family}/${model} introuvable`,
      details: err.message
    });
  }
});

// Liste des modèles pour une famille spécifique - NOUVELLE STRUCTURE
app.get("/:domain/:country/:family/models", async (req, res) => {
  const { country, domain, family } = req.params;
  
  try {
    const modelsDir = path.join(rootDir, "data", country, "models", domain, family);
    
    if (!fs.existsSync(modelsDir)) {
      return res.json([]);
    }
    
    const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.json'));
    const models = [];
    
    for (const file of modelFiles) {
      try {
        const modelData = JSON.parse(await readFile(path.join(modelsDir, file), 'utf-8'));
        models.push(modelData);
      } catch (fileErr) {
        console.warn(`Erreur lecture ${file}:`, fileErr.message);
      }
    }
    
    res.json(models);
  } catch (err) {
    res.status(404).json({
      error: `Impossible de charger les modèles pour ${family}`,
      details: err.message,
    });
  }
});

// Recherche globale - ADAPTÉE POUR LA NOUVELLE STRUCTURE
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
        
        // Chercher dans les modèles - NOUVELLE STRUCTURE
        const modelsBasePath = path.join(rootDir, "data", countryDir, "models", domainName);
        if (fs.existsSync(modelsBasePath)) {
          const familyDirs = fs.readdirSync(modelsBasePath).filter(f => 
            fs.lstatSync(path.join(modelsBasePath, f)).isDirectory()
          );
          
          for (const familyDir of familyDirs) {
            const familyModelsPath = path.join(modelsBasePath, familyDir);
            const modelFiles = fs.readdirSync(familyModelsPath).filter(f => f.endsWith('.json'));
            
            for (const modelFile of modelFiles) {
              try {
                const model = JSON.parse(await readFile(path.join(familyModelsPath, modelFile), 'utf-8'));
                if (model.name.toLowerCase().includes(searchTerm) || 
                    model.type.toLowerCase().includes(searchTerm)) {
                  results.push({
                    type: 'model',
                    country: countryDir,
                    domain: domainName,
                    family: familyDir,
                    ...model
                  });
                }
              } catch (fileErr) {
                // Ignorer les fichiers corrompus
              }
            }
          }
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

// Images statiques
app.use("/images", express.static(path.join(rootDir, "images")));

// Clear cache endpoint
app.post("/clear-cache", (req, res) => {
  cache.clear();
  res.json({ message: "Cache vidé" });
});

// Stats endpoint - ADAPTÉ POUR LA NOUVELLE STRUCTURE
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
          
          // Compter modèles - NOUVELLE STRUCTURE
          const modelsBasePath = path.join(rootDir, "data", country, "models", domain);
          if (fs.existsSync(modelsBasePath)) {
            const familyDirs = fs.readdirSync(modelsBasePath).filter(f => 
              fs.lstatSync(path.join(modelsBasePath, f)).isDirectory()
            );
            
            familyDirs.forEach(familyDir => {
              const familyModelsPath = path.join(modelsBasePath, familyDir);
              const modelFiles = fs.readdirSync(familyModelsPath).filter(f => f.endsWith('.json'));
              domainCounts[domain].models += modelFiles.length;
              stats.totalModels += modelFiles.length;
            });
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
  console.log(`Backend démarré sur http://localhost:${PORT}`);
  console.log(`Stats disponibles sur http://localhost:${PORT}/stats`);
  console.log(`Recherche disponible sur http://localhost:${PORT}/search?q=amx`);
});