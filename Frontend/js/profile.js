/* ════════════════════════════════════════════════════════════════
   PASTUKER — profile.js
   Perfil: nombre, contraseña, estadísticas y eliminación de cuenta.
   Usa las rutas reales del backend: /api/perfil, /api/perfil/password,
   /api/cuenta. Requiere js/api.js cargado antes.
════════════════════════════════════════════════════════════════ */
'use strict';

const LSp = Pastuker.LS;

/* ── Cargar datos del usuario ── */
const nombre   = LSp.get('usuario_nombre')   || 'Explorador';
const telefono = LSp.get('usuario_telefono') || '---';

document.getElementById('displayNombre').textContent   = nombre;
document.getElementById('displayTelefono').textContent = telefono !== '---' ? '📞 ' + telefono : '---';
document.getElementById('nuevoNombre').value = nombre;

/* Avatar DiceBear */
function cargarAvatar() {
    const style = LSp.get('avatar_style') || LSp.get('usuario_avatar') || 'avataaars';
    const seed  = LSp.get('avatar_seed')  || LSp.get('usuario_nombre') || 'Explorador';
    document.getElementById('avatarImg').src =
        `https://api.dicebear.com/7.x/${encodeURIComponent(style)}/svg?seed=${encodeURIComponent(seed)}&size=120`;
}
cargarAvatar();

/* ── Estadísticas (local primero, luego se refresca con el servidor) ── */
function pintarStats() {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('statPuntos',   LSp.int('usuario_xp'));
    set('statPartidas', LSp.int('partidas'));
    set('statPlantas',  LSp.json('plantas_encontradas', []).length);
    const preg = LSp.int('quiz_preguntas');
    set('statAciertos', preg ? Math.round(LSp.int('quiz_aciertos') * 100 / preg) + '%' : '—');
    set('statRanking',  LSp.get('ranking_pos') ? '#' + LSp.get('ranking_pos') : '—');
}
pintarStats();

async function refrescarDesdeServidor() {
    if (!Pastuker.estaConectado()) return;
    try {
        await Pastuker.sincronizar();
        const r = await Pastuker.api('/api/perfil');
        if (r.ok) {
            Pastuker.guardarSesion(r.data.usuario, null);
            document.getElementById('displayNombre').textContent = r.data.usuario.nombre;
            pintarStats();
            cargarAvatar();
        }
    } catch { /* sin conexión: se quedan los datos locales */ }
}
refrescarDesdeServidor();

/* ── Animación de entrada ── */
window.addEventListener('load', () => {
    const card = document.getElementById('profileCard');
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    }, 150);

    document.querySelectorAll('.seccion-item').forEach((s, i) => {
        s.style.opacity   = '0';
        s.style.transform = 'translateY(16px)';
        setTimeout(() => {
            s.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            s.style.opacity    = '1';
            s.style.transform  = 'translateY(0)';
        }, 500 + i * 80);
    });
});

/* ── Acordeones ── */
function togglePanel(btnId, panelId, flechaId) {
    const btn    = document.getElementById(btnId);
    const panel  = document.getElementById(panelId);
    const flecha = document.getElementById(flechaId);
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
        const abierto = panel.classList.toggle('abierto');
        if (flecha) flecha.style.transform = abierto ? 'rotate(90deg)' : 'rotate(0deg)';
    });
}
togglePanel('btnCambiarNombre', 'panelNombre',  'flechaNombre');
togglePanel('btnCambiarPass',   'panelPass',    'flechaPass');
togglePanel('btnStats',         'panelStats',   'flechaStats');

/* ── Botones ojo ── */
document.querySelectorAll('.btn-ojo').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        input.type  = input.type === 'password' ? 'text' : 'password';
    });
});

/* ── Toast ── */
function mostrarToast(msg, error = false) {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.classList.toggle('toast-error', error);
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2800);
}

const SIN_CONEXION = 'Necesitas internet y haber iniciado sesión para este cambio';

/* ── Guardar nombre ── */
document.getElementById('btnGuardarNombre').addEventListener('click', async () => {
    const val = document.getElementById('nuevoNombre').value.trim();
    const err = document.getElementById('errorNombre');
    if (!val || val.length < 2 || val.length > 50) { err.textContent = 'Entre 2 y 50 caracteres'; return; }
    err.textContent = '';

    if (!Pastuker.estaConectado()) { err.textContent = SIN_CONEXION; return; }
    try {
        const r = await Pastuker.api('/api/perfil', { method: 'PUT', body: { nombre: val } });
        if (!r.ok) { err.textContent = r.data?.msg || 'No se pudo guardar'; return; }
        LSp.set('usuario_nombre', r.data.nombre);
        document.getElementById('displayNombre').textContent = r.data.nombre;
        mostrarToast('Nombre actualizado ✓');
    } catch {
        err.textContent = SIN_CONEXION;
    }
});

/* ── Guardar contraseña ── */
document.getElementById('btnGuardarPass').addEventListener('click', async () => {
    const actual    = document.getElementById('passActual').value.trim();
    const nueva     = document.getElementById('passNueva').value.trim();
    const confirmar = document.getElementById('passConfirmar').value.trim();
    const err       = document.getElementById('errorPass');
    err.textContent = '';

    if (!actual)              { err.textContent = 'Ingresa tu contraseña actual'; return; }
    if (nueva.length < 6)     { err.textContent = 'Mínimo 6 caracteres'; return; }
    if (nueva !== confirmar)  { err.textContent = 'Las contraseñas no coinciden'; return; }
    if (!Pastuker.estaConectado()) { err.textContent = SIN_CONEXION; return; }

    try {
        const r = await Pastuker.api('/api/perfil/password', { method: 'PUT', body: { actual, nueva } });
        if (!r.ok) { err.textContent = r.data?.msg || 'Contraseña actual incorrecta'; return; }
        // Actualiza también el hash para entrar sin conexión
        await Pastuker.guardarHashOffline(LSp.get('usuario_telefono'), nueva);
        mostrarToast('Contraseña actualizada ✓');
        ['passActual', 'passNueva', 'passConfirmar'].forEach(id => document.getElementById(id).value = '');
    } catch {
        err.textContent = SIN_CONEXION;
    }
});

/* ── Modal Eliminar cuenta ── */
const modalEl   = document.getElementById('modalEliminar');
const modalBox  = document.getElementById('modalBox');
const inputConf = document.getElementById('confirmEliminar');
const inputPwd  = document.getElementById('passEliminar');
const errElim   = document.getElementById('errorEliminar');
const btnConf   = document.getElementById('modalConfirmar');

function revisarModal() {
    btnConf.disabled = inputConf.value.trim() !== 'ELIMINAR' || (inputPwd && inputPwd.value.trim().length < 6);
}

document.getElementById('btnEliminar').addEventListener('click', () => {
    modalEl.classList.add('visible');
    setTimeout(() => modalBox.classList.add('visible'), 10);
    inputConf.value = '';
    if (inputPwd) inputPwd.value = '';
    if (errElim) errElim.textContent = '';
    btnConf.disabled = true;
});

inputConf.addEventListener('input', revisarModal);
inputPwd?.addEventListener('input', revisarModal);

document.getElementById('modalCancelar').addEventListener('click', cerrarModal);
modalEl.addEventListener('click', e => { if (e.target === modalEl) cerrarModal(); });

function cerrarModal() {
    modalBox.classList.remove('visible');
    setTimeout(() => modalEl.classList.remove('visible'), 300);
}

document.getElementById('modalConfirmar').addEventListener('click', async () => {
    const mostrarErr = (m) => { if (errElim) errElim.textContent = m; };

    if (Pastuker.estaConectado()) {
        try {
            const r = await Pastuker.api('/api/cuenta', {
                method: 'DELETE', body: { password: inputPwd ? inputPwd.value.trim() : '' },
            });
            if (!r.ok) { mostrarErr(r.data?.msg || 'No se pudo eliminar la cuenta'); return; }
        } catch {
            mostrarErr('Necesitas internet para eliminar tu cuenta del servidor');
            return;
        }
    } else if (!Pastuker.hayRegistroPendiente() && LSp.get('usuario_id')) {
        // Cuenta que existe en el servidor pero sin sesión activa
        mostrarErr('Inicia sesión con internet para eliminar tu cuenta del servidor');
        return;
    }
    // Borra todo lo guardado en este dispositivo
    try { localStorage.clear(); } catch { /* nada */ }
    window.location.href = '../index.html';
});
