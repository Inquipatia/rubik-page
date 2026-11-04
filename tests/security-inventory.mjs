// Build a reviewable inventory from the captured npm responses, without network.
import fs from 'node:fs';
const dir = 'docs/security-audit';
const before = JSON.parse(fs.readFileSync(`${dir}/audit-before.json`, 'utf8'));
const after = JSON.parse(fs.readFileSync(`${dir}/audit-after.json`, 'utf8'));
const tree = JSON.parse(fs.readFileSync(`${dir}/tree-before.json`, 'utf8'));
const lock = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
function initialVersions(name, node = tree, found = new Set()) {
  for (const [key, child] of Object.entries(node.dependencies || {})) {
    if (key === name && child.version) found.add(child.version);
    initialVersions(name, child, found);
  }
  return [...found].sort().join(', ');
}
function finalVersions(name) {
  return [...new Set(Object.entries(lock.packages).filter(([path]) => path.endsWith(`node_modules/${name}`)).map(([, p]) => p.version))].sort().join(', ');
}
const rows = ['# Inventario de dependencias y avisos', '',
  'Generado desde audit-before.json, audit-after.json, tree-before.json y package-lock.json. Los rangos de la columna afectada son los del advisory, no versiones inferidas. Los paquetes propagados se separan de los avisos únicos.', '',
  '| Paquete | Instalado antes | Lock final | Severidad inicial por paquete | Aviso final |',
  '| --- | --- | --- | --- | --- |'];
for (const [name, item] of Object.entries(before.vulnerabilities)) {
  rows.push(`| ${name} | ${initialVersions(name)} | ${finalVersions(name)} | ${item.severity} | ${after.vulnerabilities[name] ? after.vulnerabilities[name].severity : 'No aparece'} |`);
}
rows.push('', '## Avisos únicos', '', '| Paquete | Identificador oficial | Severidad | Rango afectado | Estado según auditoría final |', '| --- | --- | --- | --- | --- |');
const seen = new Set();
for (const [name, item] of Object.entries(before.vulnerabilities)) {
  for (const advisory of item.via) {
    if (typeof advisory !== 'object') continue;
    const key = `${name}:${advisory.url}:${advisory.range}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const remains = after.vulnerabilities[name]?.via.some(v => typeof v === 'object' && v.url === advisory.url);
    rows.push(`| ${name} | [${advisory.url.split('/').at(-1)}](${advisory.url}) | ${advisory.severity} | ${advisory.range} | ${remains ? 'Pendiente, ver informe' : 'Fuera del árbol afectado'} |`);
  }
}
rows.push('', '## Resultado npm', '', '```json', JSON.stringify({ before: before.metadata.vulnerabilities, after: after.metadata.vulnerabilities }, null, 2), '```', '');
fs.writeFileSync(`${dir}/inventory.md`, rows.join('\n'));
console.log('Inventory written from captured audit and dependency evidence.');
