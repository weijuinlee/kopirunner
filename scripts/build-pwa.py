"""Generate content-versioned browser assets. Run before committing a release."""
import hashlib
import re
from pathlib import Path

root = Path(__file__).resolve().parent.parent
assets = root / 'assets'
assets.mkdir(exist_ok=True)
html = (root / 'index.html').read_text()
files = []
for name in ('style.css', 'app.js', 'pwa.js', 'navigation.js'):
    source = root / name
    digest = hashlib.sha256(source.read_bytes()).hexdigest()[:12]
    destination = f'{source.stem}.{digest}{source.suffix}'
    (assets / destination).write_bytes(source.read_bytes())
    files.append(f'./assets/{destination}')
    pattern = rf'\./(?:{re.escape(name)}|assets/{source.stem}\.[a-f0-9]+{re.escape(source.suffix)})'
    html, count = re.subn(pattern, files[-1], html)
    assert count == 1, f'Expected one HTML reference for {name}, got {count}'
(root / 'index.html').write_text(html)
# Remove only generated bundles from previous builds.
for old in assets.iterdir():
    if re.fullmatch(r'(style|app|pwa|navigation)\.[a-f0-9]{12}\.(css|js)', old.name) and f'./assets/{old.name}' not in files:
        old.unlink()
shell = ['./', './index.html', *files, './manifest.json', './icon-192.png', './icon-512.png']
version = hashlib.sha256(html.encode() + b''.join((root / path).read_bytes() for path in shell[2:])).hexdigest()[:12]
worker = (root / 'sw.js').read_text()
worker = re.sub(r'const CACHE_NAME = .*?;', f'const CACHE_NAME = `${{CACHE_PREFIX}}{version}`;', worker)
worker = re.sub(r'const SHELL = \[.*?\];', f'const SHELL = {shell!r};', worker, flags=re.S)
(root / 'sw.js').write_text(worker)
print(f'Built release {version} with {len(files)} versioned assets.')
