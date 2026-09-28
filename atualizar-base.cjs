// Incorpora o CSV ao index.html, sem servidor nem dependências externas.
// Execute pelo Atualizar base.cmd ou: node atualizar-base.cjs [caminho-do-csv]
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function csvReaderFromHTML(html) {
  const blocks = [...html.matchAll(/\/\/ INICIO_LEITOR_CSV_COMPARTILHADO\r?\n([\s\S]*?)\/\/ FIM_LEITOR_CSV_COMPARTILHADO/g)];
  if (blocks.length !== 1) throw new Error('O leitor de CSV não foi encontrado no index.html.');
  // Usa o mesmo leitor do painel, isolado e sem acesso ao sistema de arquivos.
  return vm.runInNewContext(blocks[0][1] + '\n({ parseCSV, decodeCSV })', { TextDecoder, Uint8Array }, { timeout: 1000 });
}

function incorporateCSV(html, csvBytes, fileName, updatedAt = new Date().toISOString()) {
  const bytes = Buffer.from(csvBytes);
  const reader = csvReaderFromHTML(html);
  const parsed = reader.parseCSV(reader.decodeCSV(bytes));
  if (!parsed.rows.length) throw new Error('O CSV não tem registros válidos com CPF e funcional.');
  const target = /(<script id="embedded-base" type="application\/json">)[\s\S]*?(<\/script>)/g;
  if ([...html.matchAll(target)].length !== 1) throw new Error('O bloco da base não foi encontrado no index.html.');
  const payload = JSON.stringify({ version: 1, fileName, updatedAt, data: bytes.toString('base64') })
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  // Base64 impede que textos do CSV sejam interpretados como código HTML/JavaScript.
  const updatedHTML = html.replace(target, (_, start, end) => start + payload + end);
  return { html: updatedHTML, records: parsed.rows.length, unassigned: parsed.unassigned };
}

function chooseCSV(directory, explicitFile) {
  if (explicitFile) {
    const candidate = path.resolve(explicitFile);
    if (!fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) throw new Error('Arquivo CSV não encontrado: ' + candidate);
    if (path.extname(candidate).toLowerCase() !== '.csv') throw new Error('Selecione um arquivo com extensão .csv.');
    return candidate;
  }
  const candidates = fs.readdirSync(directory, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.csv'))
    .map(entry => entry.name);
  const preferred = candidates.find(name => name.toLowerCase() === 'clientes.csv');
  if (preferred) return path.join(directory, preferred);
  if (candidates.length === 1) return path.join(directory, candidates[0]);
  if (!candidates.length) throw new Error('Coloque seu CSV nesta pasta e execute o atualizador novamente.');
  throw new Error('Há mais de um CSV na pasta. Renomeie o desejado para clientes.csv ou arraste-o sobre Atualizar base.cmd.');
}

function updateHTML(directory, explicitFile) {
  const csvPath = chooseCSV(directory, explicitFile);
  const htmlPath = path.join(directory, 'index.html');
  const originalHTML = fs.readFileSync(htmlPath, 'utf8');
  const updated = incorporateCSV(originalHTML, fs.readFileSync(csvPath), path.basename(csvPath));
  const temporaryPath = path.join(directory, '.index-' + process.pid + '-' + Date.now() + '.tmp');
  let temporaryCreated = false;
  try {
    const descriptor = fs.openSync(temporaryPath, 'wx');
    temporaryCreated = true;
    try {
      fs.writeFileSync(descriptor, updated.html, 'utf8');
      fs.fsyncSync(descriptor);
    } finally { fs.closeSync(descriptor); }
    // Só substitui o HTML depois de validar e gravar a nova versão inteira.
    fs.renameSync(temporaryPath, htmlPath);
    temporaryCreated = false;
  } finally {
    if (temporaryCreated) fs.unlinkSync(temporaryPath);
  }
  return { ...updated, csvPath, htmlPath };
}

if (require.main === module) {
  try {
    const result = updateHTML(__dirname, process.argv[2]);
    console.log('HTML atualizado: ' + result.records.toLocaleString('pt-BR') + ' registros incorporados.');
    if (result.unassigned) console.log('Atenção: ' + result.unassigned + ' registro(s) sem funcional foram ignorados.');
    console.log('Envie somente o index.html aos gerentes. Basta abrir com duplo clique.');
    console.log('O CSV original não foi alterado.');
  } catch (error) {
    console.error('Não foi possível atualizar: ' + error.message);
    console.error('O HTML anterior foi mantido.');
    process.exitCode = 1;
  }
}

module.exports = { incorporateCSV, chooseCSV, updateHTML };
