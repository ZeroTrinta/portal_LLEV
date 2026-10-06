"""Atualiza o HTML publicável preservando os recursos já empacotados (sem rede)."""
import base64
import gzip
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
index = ROOT / 'index.html'
shell = index.read_text()

def embedded(kind):
    return json.loads(re.search(r'<script type="__bundler/' + kind + r'">(.*?)</script>', shell, re.S).group(1))

manifest = embedded('manifest')
old = embedded('template')
font_css = next(css for css in re.findall(r'<style[^>]*>(.*?)</style>', old, re.S) if '@font-face' in css)
source = (ROOT / 'Portal LLEV.dc.html').read_text()
source = re.sub(r'<template id="__bundler_thumbnail">.*?</template>', '', source, flags=re.S)
source = re.sub(r'<link href="https://fonts.googleapis.com/css2[^>]*>', lambda _: '<style>' + font_css + '</style>', source)
source = source.replace('<script src="creative-art.js"></script>', '<script>' + (ROOT / 'creative-art.js').read_text() + '</script>')

# Match bytes instead of assigning guessed resource IDs.
for resource_id, entry in manifest.items():
    data = base64.b64decode(entry['data'])
    if entry['compressed']:
        data = gzip.decompress(data)
    for path in (ROOT / 'assets').glob('*.png'):
        if path.read_bytes() == data:
            source = source.replace('assets/' + path.name, resource_id)
    if data == (ROOT / 'support.js').read_bytes():
        source = source.replace('./support.js', resource_id)
    if entry['mime'].startswith(('text/', 'application/')) and b'toPng' in data and b'toSvg' in data:
        source = source.replace('https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js', resource_id)

assert './support.js' not in source, 'Runtime não encontrado no bundle'
assert 'cdn.jsdelivr.net/npm/html-to-image' not in source, 'Exportador não encontrado no bundle'
assert 'assets/logo-' not in source, 'Logo não empacotado'
encoded = json.dumps(source, ensure_ascii=False).replace('</', '<\\u002F')
shell = re.sub(r'(<script type="__bundler/template">).*?(</script>)', lambda m: m[1]+'\n'+encoded+'\n  '+m[2], shell, flags=re.S)
shell = shell.replace('<title>Bundled Page</title>', '<title>Portal LLEV · Criação de conteúdo</title>').replace('<html>', '<html lang="pt-BR">', 1)
index.write_text(shell)
print('index.html atualizado com fonte, layouts, logos e fontes incorporados.')
