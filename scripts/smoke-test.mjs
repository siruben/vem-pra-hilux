import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const fail = message => {
  console.error('FAIL:', message);
  process.exitCode = 1;
};
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

for (const file of ['index.html', 'sw.js', 'manifest.webmanifest']) {
  if (!fs.existsSync(path.join(root, file))) fail('Ficheiro essencial em falta: ' + file);
}

if (fs.existsSync(path.join(root, 'manifest.webmanifest'))) {
  try {
    const manifest = JSON.parse(read('manifest.webmanifest'));
    if (!manifest.name || !manifest.start_url || !manifest.display) {
      fail('manifest.webmanifest não contém name, start_url e display.');
    }
  } catch (error) {
    fail('manifest.webmanifest não é JSON válido: ' + error.message);
  }
}

if (fs.existsSync(path.join(root, 'sw.js'))) {
  try {
    new vm.Script(read('sw.js'), { filename: 'sw.js' });
  } catch (error) {
    fail('Erro de sintaxe em sw.js: ' + error.message);
  }
}

if (fs.existsSync(path.join(root, 'index.html'))) {
  const html = read('index.html');
  const scripts = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  let match;
  let inlineCount = 0;
  while ((match = scripts.exec(html)) !== null) {
    if (/\bsrc\s*=/.test(match[1])) continue;
    if (/\btype\s*=\s*["'](?:application\/json|application\/ld\+json)["']/i.test(match[1])) continue;
    inlineCount++;
    try {
      new vm.Script(match[2], { filename: 'index.html:inline-script-' + inlineCount });
    } catch (error) {
      fail('Erro de sintaxe no script inline ' + inlineCount + ': ' + error.message);
    }
  }
  if (!inlineCount) fail('Não foi encontrado JavaScript inline para verificar.');

  // Confirma que os recursos locais referidos pelo HTML e pelo Service Worker existem.
  const assetRefs = new Set();
  const assetPattern = /assets\/[A-Za-z0-9_./-]+\.(?:png|jpe?g|webp|gif|svg|mp3|ogg|wav|woff2?)/gi;
  for (const match of html.matchAll(assetPattern)) assetRefs.add(match[0]);
  if (fs.existsSync(path.join(root, 'sw.js'))) {
    const worker = read('sw.js');
    for (const match of worker.matchAll(assetPattern)) assetRefs.add(match[0]);
  }
  for (const asset of assetRefs) {
    if (!fs.existsSync(path.join(root, asset))) fail('Recurso local referenciado mas inexistente: ' + asset);
  }
  if (!assetRefs.size) fail('Não foram encontrados recursos locais para validar.');
}

if (!process.exitCode) console.log('OK: ficheiros essenciais, manifest JSON e sintaxe JavaScript verificados.');
