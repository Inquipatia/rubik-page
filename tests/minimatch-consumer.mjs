import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const estreeRequire = createRequire(require.resolve('@typescript-eslint/typescript-estree'));
const { parseAndGenerateServices, clearCaches } = require('@typescript-eslint/typescript-estree');
assert.equal(estreeRequire('minimatch/package.json').version, '11.0.1');
const root = mkdtempSync(path.join(tmpdir(), 'rubik-minimatch-'));
try {
  writeFileSync(path.join(root, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true }, files: [] }));
  const code = 'export const value: number = 1;';
  for (const name of ['allowed.ts', '.hidden.config.ts', 'blocked.ts']) {
    writeFileSync(path.join(root, name), code);
  }
  const options = name => ({
    filePath: path.join(root, name), tsconfigRootDir: root,
    projectService: { allowDefaultProject: ['allowed*.ts', '*.config.ts'] },
  });
  for (const name of ['allowed.ts', '.hidden.config.ts']) {
    const result = parseAndGenerateServices(code, options(name));
    assert.ok(result.services.program, `typed program for ${name}`);
    assert.equal(result.ast.body[0].type, 'ExportNamedDeclaration');
  }
  assert.throws(() => parseAndGenerateServices(code, options('blocked.ts')), /allowDefaultProject/);
  console.log('PASS: typescript-estree projectService accepts matching files and rejects nonmatching files with minimatch 11.0.1.');
} finally {
  clearCaches();
  rmSync(root, { recursive: true, force: true });
}
