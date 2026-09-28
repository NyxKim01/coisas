// Servidor opcional para leitura automática de clientes.csv. Requer Node.js.
// Nenhuma dependência externa. Só atende na interface local deste computador.
'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const server = http.createServer((request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' });
    response.end();
    return;
  }
  let name;
  try {
    const url = new URL(request.url, 'http://localhost');
    name = decodeURIComponent(url.pathname).slice(1) || 'index.html';
  } catch {
    response.writeHead(400);
    response.end();
    return;
  }
  // Sem listagem de diretórios ou acesso fora desta pasta.
  if (name !== 'index.html' && (!name.toLowerCase().endsWith('.csv') || /[\\/:\0]/.test(name))) {
    response.writeHead(404);
    response.end();
    return;
  }
  const file = path.join(__dirname, name);
  fs.lstat(file, (error, stat) => {
    if (error || !stat.isFile() || stat.isSymbolicLink()) {
      response.writeHead(404);
      response.end();
      return;
    }
    response.writeHead(200, {
      'Content-Type': name === 'index.html' ? 'text/html; charset=utf-8' : 'text/csv',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'"
    });
    if (request.method === 'HEAD') { response.end(); return; }
    const stream = fs.createReadStream(file);
    stream.on('error', () => response.destroy());
    stream.pipe(response);
  });
});
server.requestTimeout = 10000;
server.headersTimeout = 10000;
server.on('error', error => { console.error('Não foi possível iniciar o painel: ' + error.message); process.exitCode = 1; });
server.listen(0, '127.0.0.1', () => {
  console.log('Painel disponível em http://127.0.0.1:' + server.address().port);
  console.log('Deixe esta janela aberta. Para encerrar, pressione Ctrl+C.');
});
