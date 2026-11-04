// Real Nodemailer + SMTP over loopback; database and credentials are synthetic.
import net from 'node:net';
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
function load(file, overrides = {}) {
  const loaded = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  vm.runInNewContext(code, { module: loaded, exports: loaded.exports, require: id => id in overrides ? overrides[id] : require(id),
    process, Buffer, AbortSignal, TextDecoder, URL, console });
  return loaded.exports;
}
let mime = '', authenticated = false, inserted = false, recipient = false;
const sockets = new Set();
const server = net.createServer(socket => {
  sockets.add(socket); socket.on('close', () => sockets.delete(socket));
  socket.setEncoding('utf8'); socket.setTimeout(10000, () => socket.destroy());
  socket.write('220 localhost test SMTP\r\n');
  let pending = '', data = false;
  socket.on('data', chunk => {
    pending += chunk;
    while (pending.includes('\r\n')) {
      const end = pending.indexOf('\r\n'); const line = pending.slice(0, end); pending = pending.slice(end + 2);
      if (data && line !== '.') { mime += line + '\r\n'; continue; }
      if (data) { data = false; socket.write('250 queued locally\r\n'); }
      else if (/^EHLO/.test(line)) socket.write('250-localhost\r\n250 AUTH PLAIN\r\n');
      else if (/^AUTH PLAIN/.test(line)) { authenticated = true; socket.write('235 authenticated\r\n'); }
      else if (/^RCPT TO:<recipient@example.com>$/i.test(line)) { recipient = true; socket.write('250 OK\r\n'); }
      else if (line === 'DATA') { assert.equal(inserted, true); data = true; socket.write('354 continue\r\n'); }
      else if (line === 'QUIT') socket.end('221 bye\r\n');
      else socket.write('250 OK\r\n');
    }
  });
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  Object.assign(process.env, { SMTP_HOST: '127.0.0.1', SMTP_PORT: String(server.address().port),
    SMTP_USER: 'sender@example.com', SMTP_PASS: 'synthetic-local-only', MAIL_TO: 'recipient@example.com' });
  const route = load('app/api/send-quote/route.ts', {
    nodemailer: { createTransport: options => {
      const transport = require('nodemailer').createTransport(options);
      return { sendMail: async mail => {
        try { return await transport.sendMail(mail); }
        catch (error) { console.error('Local synthetic SMTP failure', error.code, error.message); throw error; }
      } };
    } },
    '../../lib/quote-request': load('app/lib/quote-request.ts'),
    '../../lib/quote-validation': load('app/lib/quote-validation.ts'),
    '../../lib/supabase': { getSupabase: () => ({ from: () => ({ insert: () => ({ abortSignal: async () => {
      inserted = true; return { error: null };
    } }) }) }) },
  });
  const result = await route.POST(new Request('http://localhost/api/send-quote', { method: 'POST', body: JSON.stringify({
    name: 'Local SMTP', phone: '912345678', email: 'reply@example.com', company: '<b>test</b>', service: 'Otros', message: '<script>test</script>',
  }) }));
  assert.equal(result.status, 200); assert.equal((await result.json()).notificationSent, true);
  assert.ok(authenticated && recipient && inserted);
  assert.match(mime, /Reply-To: reply@example.com/i); assert.match(mime, /multipart\/alternative/i);
  assert.match(mime.replace(/=\r\n/g, ''), /&lt;script&gt;test&lt;\/script&gt;/);
  console.log(`PASS: Nodemailer ${require('nodemailer/package.json').version}, real loopback SMTP AUTH/envelope/MIME, escaped HTML, notification after simulated DB insert. No external delivery; hosting TLS not tested.`);
} finally {
  for (const socket of sockets) socket.destroy();
  await new Promise(resolve => server.close(resolve));
}
