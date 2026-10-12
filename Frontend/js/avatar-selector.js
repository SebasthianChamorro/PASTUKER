/* ════════════════════════════════════════════════════════════════
   PASTUKER — avatar-selector.js
   Selector de estilos DiceBear
   Archivo: js/avatar-selector.js
════════════════════════════════════════════════════════════════ */

/* ── Los 20 estilos de DiceBear ── */
const avatarStyles = [
    { id:'avataaars',   name:'Avataaars',    description:'Personas cartoon clásico' },
    { id:'bottts',      name:'Bottts',       description:'Robots coloridos' },
    { id:'pixel-art',   name:'Pixel Art',    description:'Estilo retro 8-bit' },
    { id:'personas',    name:'Personas',     description:'Siluetas minimalistas' },
    { id:'fun-emoji',   name:'Fun Emoji',    description:'Emojis divertidos' },
    { id:'adventurer',  name:'Adventurer',   description:'Aventureros cartoon' },
    { id:'lorelei',     name:'Lorelei',      description:'Estilo ilustración' },
    { id:'micah',       name:'Micah',        description:'Diseño geométrico' },
    { id:'big-smile',   name:'Big Smile',    description:'Sonrisas grandes' },
    { id:'croodles',    name:'Croodles',     description:'Garabatos divertidos' },
    { id:'thumbs',      name:'Thumbs',       description:'Pulgares arriba' },
    { id:'identicon',   name:'Identicon',    description:'Estilo GitHub' },
    { id:'initials',    name:'Initials',     description:'Solo iniciales' },
    { id:'notionists',  name:'Notionists',   description:'Estilo Notion' },
    { id:'open-peeps',  name:'Open Peeps',   description:'Personas abiertas' },
    { id:'miniavs',     name:'Miniavs',      description:'Avatares mini' },
    { id:'shapes',      name:'Shapes',       description:'Formas geométricas' },
    { id:'rings',       name:'Rings',        description:'Anillos abstractos' },
    { id:'big-ears',    name:'Big Ears',     description:'Orejas grandes' },
    { id:'icons',       name:'Icons',        description:'Iconos simples' }
];

const seed         = localStorage.getItem('usuario_nombre') || 'Explorador';
let   seleccionado = localStorage.getItem('avatar_style')   || 'avataaars';

/* ── Genera URL de DiceBear ── */
function urlAvatar(styleId, sz = 80) {
    return `https://api.dicebear.com/7.x/${styleId}/svg?seed=${encodeURIComponent(seed)}&size=${sz}`;
}

/* ── Actualiza el preview grande ── */
function actualizarPreview(styleId, styleName) {
    document.getElementById('avatarPreview').src = urlAvatar(styleId, 120);
    document.getElementById('previewEstilo').textContent = styleName;
}

/* ── Construye el grid de estilos ── */
const grid = document.getElementById('estilosGrid');

avatarStyles.forEach((estilo, idx) => {
    const card = document.createElement('button');
    card.className = 'estilo-card' + (estilo.id === seleccionado ? ' seleccionado' : '');
    card.dataset.id   = estilo.id;
    card.dataset.name = estilo.name;
    card.style.animationDelay = (idx * 40) + 'ms';
    card.innerHTML = `
        <div class="estilo-img-wrap">
            <img
                src="${urlAvatar(estilo.id)}"
                alt="${estilo.name}"
                class="estilo-img"
                loading="lazy"
            >
            <div class="estilo-check">✓</div>
        </div>
        <p class="estilo-nombre">${estilo.name}</p>
        <p class="estilo-desc">${estilo.description}</p>
    `;

    card.addEventListener('click', () => {
        /* Quitar selección anterior */
        document.querySelectorAll('.estilo-card').forEach(c => c.classList.remove('seleccionado'));
        /* Marcar nuevo */
        card.classList.add('seleccionado');
        seleccionado = estilo.id;
        /* Actualizar preview */
        actualizarPreview(estilo.id, estilo.name);
        /* Scroll suave al preview */
        document.getElementById('avatarPreview').scrollIntoView({ behavior:'smooth', block:'nearest' });
    });

    grid.appendChild(card);
});

/* ── Preview inicial ── */
const estiloActual = avatarStyles.find(e => e.id === seleccionado) || avatarStyles[0];
actualizarPreview(estiloActual.id, estiloActual.name);

/* ── Animación de entrada de la card ── */
window.addEventListener('load', () => {
    const card = document.getElementById('selectorCard');
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    }, 150);
});

/* ── GUARDAR y volver al perfil ── */
document.getElementById('btnGuardar').addEventListener('click', async () => {
    const btn = document.getElementById('btnGuardar');
    btn.classList.add('guardando');

    /* Guardar en el dispositivo (funciona también sin conexión) */
    localStorage.setItem('avatar_style',   seleccionado);
    localStorage.setItem('avatar_seed',    seed);
    localStorage.setItem('usuario_avatar', seleccionado);

    /* Guardar en el servidor: el ranking muestra este avatar */
    localStorage.setItem('avatar_pendiente', seleccionado);
    if (window.Pastuker && Pastuker.estaConectado()) {
        try {
            const r = await Pastuker.api('/api/avatar', { method: 'POST', body: { avatar: seleccionado } });
            if (r.ok) localStorage.removeItem('avatar_pendiente');
        } catch { /* sin conexión: api.js lo envía en la próxima sincronización */ }
    }

    /* Mostrar toast y redirigir */
    document.getElementById('toast').classList.add('visible');
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 900);
});