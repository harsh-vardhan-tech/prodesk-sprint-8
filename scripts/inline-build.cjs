const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexPath)) {
  const assetsDir = path.join(distDir, 'assets');
  let jsCode = '';
  let cssCode = '';

  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const jsFile = files.find(f => f.endsWith('.js'));
    const cssFile = files.find(f => f.endsWith('.css'));

    if (jsFile) {
      jsCode = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8');
    }
    if (cssFile) {
      cssCode = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8');
    }
  }

  const standalone = `<!doctype html>
<html lang="en" style="background-color: #141414; color: #ffffff;">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="./favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Cine-Stream - Next-generation media discovery with infinite scroll, debounced search, favorites persistence, and AI mood matching." />
    <title>Cine-Stream | Media Discovery Explorer</title>
    ${cssCode ? `<style>${cssCode}</style>` : ''}
  </head>
  <body style="background-color: #141414; margin: 0; color: #ffffff; min-height: 100vh;" class="bg-[#141414] text-white antialiased selection:bg-[#e50914] selection:text-white">
    <div id="root"></div>
    ${jsCode ? `<script type="module">${jsCode}</script>` : ''}
  </body>
</html>`;

  fs.writeFileSync(indexPath, standalone, 'utf8');
  console.log('Successfully bundled standalone dist/index.html (zero CORS dependencies)');
}
