// Read-only public DNS, validated TLS and HTTP HEAD diagnostics. No TLS bypass.
import tls from 'node:tls';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
const domains = ['rubikcreaciones.cl', 'www.rubikcreaciones.cl'];
const records = ['A', 'AAAA', 'CNAME', 'NS', 'CAA'];
const result = { checkedAt: new Date().toISOString(), dnsSource: 'Google Public DNS over validated HTTPS (local UDP resolver unavailable)', dns: {}, tls: [], http: [] };
function resolveRecord(domain, type) {
  return new Promise((resolve, reject) => {
    const req = https.get(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`, { timeout: 15000 }, response => {
      let body = '';
      response.setEncoding('utf8'); response.on('data', chunk => { body += chunk; });
      response.on('end', () => {
        try {
          const data = JSON.parse(body);
          const types = { A: 1, AAAA: 28, CNAME: 5, NS: 2, CAA: 257 };
          resolve({ status: data.Status, answers: data.Answer || [], values: (data.Answer || []).filter(record => record.type === types[type]).map(record => record.data) });
        } catch (error) { reject(error); }
      });
    });
    req.once('timeout', () => req.destroy(new Error('DoH timeout'))); req.once('error', reject);
  });
}
function certificate(socket) {
  const cert = socket.getPeerCertificate();
  return cert && Object.keys(cert).length ? { subject: cert.subject, issuer: cert.issuer,
    validFrom: cert.valid_from, validTo: cert.valid_to, subjectAltName: cert.subjectaltname,
    fingerprint256: cert.fingerprint256 } : undefined;
}
await Promise.all(domains.map(async domain => {
  result.dns[domain] = {};
  await Promise.all(records.map(async type => {
    try { result.dns[domain][type] = await resolveRecord(domain, type); }
    catch (error) { result.dns[domain][type] = { error: error.code }; }
  }));
  const ips = [...(result.dns[domain].A.values || []), ...(result.dns[domain].AAAA.values || [])];
  await Promise.all(ips.map(ip => new Promise(resolve => {
    const socket = tls.connect({ host: ip, port: 443, servername: domain, rejectUnauthorized: true });
    socket.setTimeout(10000, () => socket.destroy(new Error('TLS timeout')));
    socket.once('secureConnect', () => {
      result.tls.push({ domain, ip, authorized: socket.authorized, protocol: socket.getProtocol(), certificate: certificate(socket) });
      socket.end(); resolve();
    });
    socket.once('error', error => {
      result.tls.push({ domain, ip, authorized: false, code: error.code, error: error.message, certificate: certificate(socket) }); resolve();
    });
  })));
}));
await Promise.all(domains.flatMap(domain => ['http:', 'https:'].map(protocol => new Promise(resolve => {
  const url = `${protocol}//${domain}/`;
  const req = (protocol === 'https:' ? https : http).request(url, { method: 'HEAD', timeout: 15000 }, response => {
    result.http.push({ url, status: response.statusCode, location: response.headers.location,
      server: response.headers.server, date: response.headers.date,
      certificate: protocol === 'https:' ? certificate(response.socket) : undefined });
    response.resume(); resolve();
  });
  req.once('timeout', () => req.destroy(new Error('HTTP timeout')));
  req.once('error', error => { result.http.push({ url, code: error.code, error: error.message }); resolve(); });
  req.end();
}))));
fs.writeFileSync('docs/security-2026-11-06/domains-verified.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
