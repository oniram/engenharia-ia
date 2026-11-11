const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;
const version = process.env.APP_VERSION || '(APP_VERSION nao definida)';

let plugin = '(deps/plugin.txt ausente — falhou incluir dependencia local no build)';
try {
  plugin = fs.readFileSync('./deps/plugin.txt', 'utf8').trim();
} catch (e) {
  plugin = `(erro lendo deps: ${e.message})`;
}

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(`APP_VERSION: ${version}\nPLUGIN: ${plugin}\n`);
});

server.listen(port, () => {
  console.log(`artifact-server porta ${port} APP_VERSION=${version} PLUGIN=${plugin}`);
});
