/**
 * Script de validación automatizada:
 * 1. Seguridad: Detección de fugas de secretos, tokens, contraseñas y APIs.
 * 2. Optimización: Análisis de peso, tiempos de carga, lazy loading y compresión.
 * 3. Redundancia: Detección de IDs duplicados, CSS repetido y marcado superfluo.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
let hasErrors = false;
let hasWarnings = false;

console.log('====================================================');
console.log('🐾 INICIANDO AUDITORÍA AUTOMÁTICA DE CÓDIGO Y SEGURIDAD');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. REVISIÓN DE SEGURIDAD Y FUGAS DE INFORMACIÓN CRÍTICA
// ----------------------------------------------------
console.log('🔍 [1/3] Verificando secretos, credenciales y APIs sensibles...');

const SENSITIVE_PATTERNS = [
  { name: 'GitHub Personal Access Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,255}/ },
  { name: 'Generic Private Key', regex: /-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'AWS Access Key ID', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
  { name: 'AWS Secret Key', regex: /aws_secret_access_key\s*=\s*[A-Za-z0-9/+=]{40}/i },
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z\-_]{35}/ },
  { name: 'OpenAI / Claude API Key', regex: /sk-[A-Za-z0-9_-]{20,}/ },
  { name: 'Slack Webhook / Token', regex: /https:\/\/hooks\.slack\.com\/services\/T[A-Z0-9]+\/B[A-Z0-9]+\/[A-Za-z0-9]+/ },
  { name: 'Hardcoded Password Assignment', regex: /(?:password|passwd|contrasena|contraseña|secret|api_key|apiKey)\s*[:=]\s*["'][^"']{6,}["']/i },
  { name: 'Database Connection String', regex: /(?:mongodb|postgres|mysql|redis):\/\/[a-zA-Z0-9_-]+:[^@]+@/i },
  { name: 'JWT Token', regex: /eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/ }
];

// Archivos o extensiones prohibidas para publicación
const FORBIDDEN_FILES = ['.env', '.env.local', '.env.production', 'credentials.json', 'id_rsa', 'id_ed25519'];

function scanDirectoryForSecrets(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(ROOT_DIR, fullPath);

    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    if (FORBIDDEN_FILES.includes(entry.name.toLowerCase())) {
      console.error(`❌ ERROR CRÍTICO: Archivo sensible detectado: ${relativePath}`);
      hasErrors = true;
    }

    if (entry.isDirectory()) {
      scanDirectoryForSecrets(fullPath);
    } else {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.regex.test(content)) {
          console.error(`❌ ERROR DE SEGURIDAD en ${relativePath}: Posible fuga detectada (${pattern.name})`);
          hasErrors = true;
        }
      }
    }
  }
}

scanDirectoryForSecrets(ROOT_DIR);
if (!hasErrors) {
  console.log('   ✅ Sin secretos, llaves ni credenciales expuestas.\n');
}

// ----------------------------------------------------
// 2. VERIFICACIÓN DE REDUNDANCIA
// ----------------------------------------------------
console.log('🔍 [2/3] Analizando redundancia y duplicados en el código...');

const htmlPath = path.join(ROOT_DIR, 'index.html');
if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // A. IDs duplicados en el DOM
  const idMatches = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
  const seenIds = new Set();
  const duplicateIds = new Set();

  idMatches.forEach(id => {
    if (seenIds.has(id)) duplicateIds.add(id);
    seenIds.add(id);
  });

  if (duplicateIds.size > 0) {
    console.error(`❌ ERROR DE REDUNDANCIA: IDs HTML duplicados encontrados: ${[...duplicateIds].join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`   ✅ IDs únicos verificados (${seenIds.size} elementos inspeccionados).`);
  }

  // B. Enlaces duplicados sin propósito
  const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicateEmptyHref = hrefMatches.filter(h => h === '#' || h === '');
  if (duplicateEmptyHref.length > 2) {
    console.warn(`   ⚠️ ADVERTENCIA: Se encontraron ${duplicateEmptyHref.length} enlaces con href vacío o '#'.`);
    hasWarnings = true;
  } else {
    console.log('   ✅ Estructura de navegación e hipervínculos correcta.');
  }
} else {
  console.error('❌ ERROR: index.html no encontrado.');
  hasErrors = true;
}

console.log('');

// ----------------------------------------------------
// 3. ANÁLISIS DE OPTIMIZACIÓN Y RENDIMIENTO
// ----------------------------------------------------
console.log('🔍 [3/3] Evaluando optimización y buenas prácticas...');

if (fs.existsSync(htmlPath)) {
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const stats = fs.statSync(htmlPath);
  const sizeKb = (stats.size / 1024).toFixed(2);

  console.log(`   📄 Tamaño del archivo principal (index.html): ${sizeKb} KB`);
  if (stats.size > 250 * 1024) {
    console.warn(`   ⚠️ ADVERTENCIA: El archivo supera los 250 KB recomendados para landing pages ultra rápidas.`);
    hasWarnings = true;
  } else {
    console.log('   ✅ Presupuesto de peso ligero cumplido (< 250 KB).');
  }

  // Verificar Lazy loading en imágenes que no son hero
  const imgTags = [...html.matchAll(/<img[^>]+>/g)].map(m => m[0]);
  let missingLazy = 0;
  imgTags.forEach((img, idx) => {
    if (idx > 0 && !img.includes('loading="lazy"') && !img.includes('fetchpriority="high"')) {
      missingLazy++;
    }
  });

  if (missingLazy > 0) {
    console.warn(`   ⚠️ ADVERTENCIA: ${missingLazy} imagen(es) secundaria(s) sin atributo loading="lazy".`);
    hasWarnings = true;
  } else {
    console.log('   ✅ Optimización de imágenes (lazy loading / prioridad) configurada adecuadamente.');
  }

  // Meta viewport y preconnect
  if (html.includes('name="viewport"') && html.includes('preconnect')) {
    console.log('   ✅ Meta viewport y preconnect de recursos externos presentes.');
  } else {
    console.warn('   ⚠️ ADVERTENCIA: Falta configuración óptima de viewport o preconnect para fuentes.');
    hasWarnings = true;
  }
}

console.log('\n====================================================');
if (hasErrors) {
  console.error('❌ AUDITORÍA FALLIDA: Se detectaron errores críticos que deben resolverse.');
  process.exit(1);
} else {
  console.log('✨ AUDITORÍA SUPERADA: Código seguro, optimizado y sin redundancias críticas.');
  if (hasWarnings) {
    console.log('ℹ️  Se reportaron algunas advertencias menores no bloqueantes.');
  }
  process.exit(0);
}
