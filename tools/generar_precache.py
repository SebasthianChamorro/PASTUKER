#!/usr/bin/env python3
"""
Pastuker — generar_precache.py

Reescribe la lista de pre-caché del service worker (Frontend/service-worker.js)
con TODOS los archivos que la PWA necesita para funcionar sin internet, y
calcula una versión a partir del contenido: si cambia cualquier archivo, cambia
la versión y los celulares descargan la caché nueva.

Uso (desde la carpeta PASTUKER):
    python tools/generar_precache.py
"""
import hashlib
import os
import re
import sys

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'Frontend'))
SW = os.path.join(RAIZ, 'service-worker.js')

# Pantallas de la app (Mundo 1, Mundo 2 y menús). game3/game4 no están en el menú.
EXCLUIR_PAGINAS = {'game3.html', 'game3.2.html', 'game4.html'}
EXCLUIR_JS = {'game3.js', 'game3.2.js', 'game4.js'}
EXCLUIR_CSS = {'game3.css', 'game3.2.css', 'game4.css'}
# Carpetas de imágenes que usan las pantallas incluidas
CARPETAS_IMG = ['landscale', 'taita', 'mama', 'logos', 'icons', 'game', 'game2']
EXT_IMG = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'}
EXT_AUDIO = {'.mp3', '.ogg', '.wav'}
# Diálogos de los juegos que no están en el menú (Maloca, rompecabezas, ahorcado)
PREFIJOS_DIALOGO_EXCLUIDOS = ('ahorcado_', 'maloca_', 'puzzle_')


def rel(ruta):
    return './' + os.path.relpath(ruta, RAIZ).replace(os.sep, '/')


def archivos(carpeta, extensiones=None, excluir=()):
    base = os.path.join(RAIZ, carpeta)
    out = []
    if not os.path.isdir(base):
        return out
    for dirpath, _dirs, files in os.walk(base):
        for f in sorted(files):
            if f in excluir or f.startswith('.'):
                continue
            if extensiones and os.path.splitext(f)[1].lower() not in extensiones:
                continue
            out.append(os.path.join(dirpath, f))
    return sorted(out)


def main():
    lista = [os.path.join(RAIZ, 'index.html'), os.path.join(RAIZ, 'manifest.json')]
    lista += archivos('pages', {'.html'}, EXCLUIR_PAGINAS)
    lista += archivos('css', {'.css'}, EXCLUIR_CSS)
    lista += archivos('js', {'.js'}, EXCLUIR_JS)

    for c in CARPETAS_IMG:
        lista += archivos(os.path.join('images', c), EXT_IMG)
    lista += [os.path.join(RAIZ, 'images', f) for f in ('icon-192.png', 'icon-512.png')
              if os.path.exists(os.path.join(RAIZ, 'images', f))]

    # Audio: toda la música y efectos que cargan los juegos
    codigo = ''
    for js in ('audio.js', 'game.js', 'game-2.js', 'dialogos.js'):
        p = os.path.join(RAIZ, 'js', js)
        if os.path.exists(p):
            codigo += open(p, encoding='utf-8').read()
    for f in archivos('audio', EXT_AUDIO):
        nombre = os.path.basename(f)
        sin_ext = os.path.splitext(nombre)[0]
        if '/dialogos/' in f.replace(os.sep, '/'):
            # Solo los diálogos que existen en dialogos.js (id del diálogo = nombre del mp3)
            if sin_ext.startswith(PREFIJOS_DIALOGO_EXCLUIDOS):
                continue
            if re.search(r"['\"]?%s['\"]?\s*:" % re.escape(sin_ext), codigo):
                lista.append(f)
        elif nombre in codigo:
            lista.append(f)

    # Sin duplicados, en orden
    vistos, final = set(), []
    for f in lista:
        if f not in vistos and os.path.exists(f):
            vistos.add(f)
            final.append(f)

    h = hashlib.sha256()
    total = 0
    for f in final:
        if os.path.abspath(f) == SW:
            continue
        with open(f, 'rb') as fh:
            datos = fh.read()
        total += len(datos)
        h.update(rel(f).encode())
        h.update(datos)
    version = h.hexdigest()[:10]

    lineas = ["    './',"] + [f"    '{rel(f)}'," for f in final]
    bloque = (
        "/* <PRECACHE> — sección generada automáticamente, no editar a mano */\n"
        f"const CACHE_VERSION = '{version}';\n"
        "const ARCHIVOS_CACHE = [\n" + "\n".join(lineas) + "\n];\n"
        "/* </PRECACHE> */"
    )

    sw = open(SW, encoding='utf-8').read()
    nuevo, n = re.subn(r"/\* <PRECACHE>.*?/\* </PRECACHE> \*/", lambda _m: bloque, sw, flags=re.S)
    if n != 1:
        sys.exit('No se encontró la sección <PRECACHE> en service-worker.js')
    with open(SW, 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(nuevo)
    print(f'service-worker.js actualizado: {len(final)} archivos, {total / 1e6:.1f} MB, versión {version}')


if __name__ == '__main__':
    main()
