/* ════════════════════════════════════════════════════════════════
   PASTUKER — ranking-tabla.js
   Lee el ranking real del servidor (GET /api/ranking?modo=...).
   Sin conexión muestra la última tabla descargada.
════════════════════════════════════════════════════════════════ */
'use strict';

const MODOS = {
    general: { titulo: 'Ranking General',     sub: 'Top 50 por XP (los dos mundos)', unidad: 'XP' },
    plantas: { titulo: 'Plantas Medicinales', sub: 'Top 50 por plantas descubiertas', unidad: '🌿' },
    selva:   { titulo: 'Selva Profunda',      sub: 'Top 50 por gemas del Mundo 2',    unidad: '💎' },
};

const params   = new URLSearchParams(location.search);
let modoActual = MODOS[params.get('modo')] ? params.get('modo') : 'general';

const $ = (id) => document.getElementById(id);

function avatarUrl(estilo, nombre) {
    const s = estilo || 'initials';
    return `https://api.dicebear.com/7.x/${encodeURIComponent(s)}/svg?seed=${encodeURIComponent(nombre)}&size=40`;
}

function pintar(datos, desdeCache, fecha) {
    const m = MODOS[modoActual];
    $('titulo').textContent    = m.titulo;
    $('subtitulo').textContent = m.sub;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('activa', t.dataset.modo === modoActual));

    const estado = $('estado');
    if (desdeCache) {
        estado.textContent = `Sin conexión · datos del ${new Date(fecha).toLocaleString('es-CO')}`;
        estado.classList.add('aviso');
    } else {
        estado.textContent = '';
        estado.classList.remove('aviso');
    }

    $('miPos').textContent = datos.mi_posicion ? `Tu puesto: #${datos.mi_posicion}` : '';
    if (datos.mi_posicion && modoActual === 'general') Pastuker.LS.set('ranking_pos', datos.mi_posicion);

    const lista = $('lista');
    lista.innerHTML = '';
    if (!datos.ranking || !datos.ranking.length) {
        lista.innerHTML = '<li class="vacio">Todavía no hay jugadores en esta tabla. ¡Sé el primero!</li>';
        return;
    }
    datos.ranking.forEach(j => {
        const li  = document.createElement('li');
        li.className = 'fila' + (j.es_tu ? ' tu' : '');
        const medalla = j.posicion === 1 ? 'oro' : j.posicion === 2 ? 'plata' : j.posicion === 3 ? 'bronce' : '';

        const pos = document.createElement('span');
        pos.className = 'pos ' + medalla;
        pos.textContent = j.posicion;

        const img = document.createElement('img');
        img.className = 'ava'; img.alt = ''; img.loading = 'lazy';
        img.src = avatarUrl(j.avatar, j.nombre);

        const nom = document.createElement('span');
        nom.className = 'nom';
        nom.textContent = j.nombre + (j.es_tu ? ' (tú)' : '');      // textContent: evita inyección de HTML
        const det = document.createElement('small');
        det.textContent = `${j.xp} XP · ${j.plantas} plantas · ${j.gemas} gemas`;
        nom.appendChild(det);

        const val = document.createElement('span');
        val.className = 'val';
        val.textContent = `${j.valor} ${MODOS[modoActual].unidad}`;

        li.append(pos, img, nom, val);
        lista.appendChild(li);
    });
}

async function cargar() {
    $('estado').textContent = 'Cargando…';
    const claveCache = `ranking_cache_${modoActual}`;
    try {
        const r = await Pastuker.api(`/api/ranking?modo=${modoActual}`);
        if (!r.ok) throw new Error(r.data?.msg || 'error');
        Pastuker.LS.set(claveCache, JSON.stringify({ fecha: Date.now(), datos: r.data }));
        pintar(r.data, false);
    } catch {
        const cache = Pastuker.LS.json(claveCache, null);
        if (cache) {
            pintar(cache.datos, true, cache.fecha);
        } else {
            pintar({ ranking: [] }, false);
            $('lista').innerHTML = '';
            $('estado').textContent = 'Sin conexión. Abre el ranking con internet al menos una vez.';
            $('estado').classList.add('aviso');
        }
    }
}

document.querySelectorAll('.tab').forEach(t => {
    t.addEventListener('click', () => {
        modoActual = t.dataset.modo;
        history.replaceState(null, '', `?modo=${modoActual}`);
        cargar();
    });
});

// Antes de leer el ranking, sube el progreso pendiente para verse actualizado
(async () => {
    try { await Promise.race([Pastuker.sincronizar(), new Promise(r => setTimeout(r, 2500))]); } catch { /* nada */ }
    cargar();
})();
