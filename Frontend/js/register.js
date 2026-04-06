/* ════════════════════════════════════════════════════════════════
   PASTUKER — register.js
   Validación + integración API Flask + fallback offline
════════════════════════════════════════════════════════════════ */
'use strict';

// ── URL de la API ──
// Desarrollo local : 'http://localhost:5000'
// Producción       : 'https://TU-APP.up.railway.app'
const API_URL = 'http://localhost:5000';

/* ── Animación de entrada de la card ── */
window.addEventListener('load', () => {
    const card = document.getElementById('registerCard');
    card.style.opacity   = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    }, 200);

    // Si hay un registro pendiente de sincronizar, intentarlo ahora
    const pendiente = localStorage.getItem('registro_pendiente');
    if (pendiente && navigator.onLine) {
        _sincronizarRegistro();
    }
});

/* ── Mostrar/ocultar contraseñas ── */
function togglePassword(btnId, inputId) {
    const btn      = document.getElementById(btnId);
    const input    = document.getElementById(inputId);
    const abierto  = btn.querySelector('.ojo-abierto');
    const cerrado  = btn.querySelector('.ojo-cerrado');
    btn.addEventListener('click', () => {
        const esPass = input.type === 'password';
        input.type   = esPass ? 'text' : 'password';
        abierto.style.display = esPass ? 'none'  : 'block';
        cerrado.style.display = esPass ? 'block' : 'none';
    });
}
togglePassword('btnOjo1', 'contrasena');
togglePassword('btnOjo2', 'confirmar');

/* ── Indicador de fortaleza de contraseña ── */
const inputPass     = document.getElementById('contrasena');
const fortalezaWrap = document.getElementById('fortalezaWrap');
const fortalezaTxt  = document.getElementById('fortalezaTexto');
const barras        = ['b1','b2','b3','b4'].map(id => document.getElementById(id));
const colores       = ['#e74c3c','#e67e22','#f1c40f','#2ecc71'];
const textos        = ['Muy débil','Débil','Media','Fuerte'];

inputPass.addEventListener('input', () => {
    const val = inputPass.value;
    fortalezaWrap.style.display = val.length ? 'flex' : 'none';
    let nivel = 0;
    if (val.length >= 6)  nivel++;
    if (val.length >= 10) nivel++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) nivel++;
    if (/[^A-Za-z0-9]/.test(val)) nivel++;
    nivel = Math.min(nivel, 4);
    barras.forEach((b, i) => {
        b.style.background = i < nivel ? colores[nivel - 1] : 'rgba(255,255,255,0.1)';
    });
    fortalezaTxt.textContent = textos[Math.max(nivel - 1, 0)];
    fortalezaTxt.style.color = colores[Math.max(nivel - 1, 0)];
    document.getElementById('errorContrasena').textContent = '';
    document.getElementById('contrasena').closest('.campo-grupo').classList.remove('campo-error-activo');
});

/* ── Limpiar errores al escribir ── */
document.getElementById('nombre').addEventListener('input', () => {
    document.getElementById('errorNombre').textContent = '';
    document.getElementById('nombre').closest('.campo-grupo').classList.remove('campo-error-activo');
});
document.getElementById('telefono').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, ''); // solo números
    document.getElementById('errorTelefono').textContent = '';
    e.target.closest('.campo-grupo').classList.remove('campo-error-activo');
});
document.getElementById('confirmar').addEventListener('input', () => {
    document.getElementById('errorConfirmar').textContent = '';
    document.getElementById('confirmar').closest('.campo-grupo').classList.remove('campo-error-activo');
});

/* ── SHA-256 en el navegador para fallback offline ── */
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Guardar sesión en localStorage ── */
function guardarSesion(usuario, token) {
    localStorage.setItem('usuario_id',       usuario.id || 'offline_' + Date.now());
    localStorage.setItem('usuario_nombre',   usuario.nombre);
    localStorage.setItem('usuario_telefono', usuario.telefono);
    localStorage.setItem('usuario_genero', usuario.genero);
    localStorage.setItem('usuario_avatar',   usuario.avatar || '');
    localStorage.setItem('usuario_xp',       '0');
    if (token) localStorage.setItem('usuario_token', token);
}

/* ── Referencias del formulario ── */
const form           = document.getElementById('registerForm');
const registerError  = document.getElementById('registerError');
const registerErrMsg = document.getElementById('registerErrorMsg');
const btnRegister    = document.getElementById('btnRegister');
const spinner        = document.getElementById('registerSpinner');

/* ── Mostrar error global ── */
function mostrarErrorGlobal(msg) {
    registerErrMsg.textContent  = msg;
    registerError.style.display = 'flex';
    const card = document.getElementById('registerCard');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 600);
}

/* ── Estado del botón ── */
function setLoading(on) {
    btnRegister.disabled = on;
    btnRegister.querySelector('.btn-register-texto').textContent = on ? 'Creando cuenta...' : 'Crear Cuenta';
    spinner.style.display = on ? 'inline-block' : 'none';
}

/* ── Validación ── */
function validar(nombre, telefono, contrasena, confirmar, genero) {
    let ok = true;

    if (!nombre || nombre.length < 2) {
        document.getElementById('errorNombre').textContent = 'Ingresa tu nombre completo';
        document.getElementById('nombre').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (!genero) {
        document.getElementById('errorGenero').textContent = 'Selecciona una opción';
        ok = false;
    }
    if (!telefono || telefono.length < 7) {
        document.getElementById('errorTelefono').textContent = 'Ingresa un número válido';
        document.getElementById('telefono').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (!contrasena || contrasena.length < 6) {
        document.getElementById('errorContrasena').textContent = 'Mínimo 6 caracteres';
        document.getElementById('contrasena').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (contrasena !== confirmar) {
        document.getElementById('errorConfirmar').textContent = 'Las contraseñas no coinciden';
        document.getElementById('confirmar').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    return ok;
}

/* ══════════════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════════════ */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.style.display = 'none';

    const nombre    = document.getElementById('nombre').value.trim();
    const telefono  = document.getElementById('telefono').value.trim();
    const contrasena= document.getElementById('contrasena').value;
    const confirmar = document.getElementById('confirmar').value;
    const generoEl  = document.querySelector('input[name="genero"]:checked');
    const genero    = generoEl?.value || '';

    if (!validar(nombre, telefono, contrasena, confirmar, genero)) return;

    setLoading(true);

    try {
        // ── 1. Intentar registro ONLINE ──
        const res  = await fetch(`${API_URL}/api/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ nombre, telefono, password: contrasena, genero }),
            signal:  AbortSignal.timeout(6000),
        });
        const data = await res.json();

        if (data.ok) {
            const pwdHash = await sha256(contrasena);
            localStorage.setItem('usuario_pwd_hash', pwdHash);
            guardarSesion(data.usuario, data.token);
            window.location.replace('login.html');

        } else {
            mostrarErrorGlobal(data.msg || 'No se pudo crear la cuenta.');
        }

    } catch (err) {
        // ── 2. Sin conexión — guardar localmente ──
        console.warn('Sin conexión, guardando localmente...', err.message);

        const pwdHash = await sha256(contrasena);
        localStorage.setItem('usuario_pwd_hash', pwdHash);
        localStorage.setItem('registro_pendiente', JSON.stringify({ nombre, telefono, password: contrasena, genero }));

        guardarSesion({ nombre, telefono, genero, avatar: '' }, null);

        // Escuchar cuando vuelva el internet para sincronizar
        window.addEventListener('online', _sincronizarRegistro, { once: true });

        window.location.replace('login.html');

    } finally {
        setLoading(false);
    }
});

/* ── Sincronizar registro offline cuando haya internet ── */
async function _sincronizarRegistro() {
    const pendiente = localStorage.getItem('registro_pendiente');
    if (!pendiente) return;
    try {
        const datos = JSON.parse(pendiente);
        const res   = await fetch(`${API_URL}/api/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(datos),
        });
        const data = await res.json();
        if (data.ok) {
            localStorage.removeItem('registro_pendiente');
            localStorage.setItem('usuario_id',    data.usuario.id);
            localStorage.setItem('usuario_token', data.token);
            console.log('✅ Registro sincronizado con el servidor.');
        }
    } catch (e) {
        console.warn('Sincronización fallida, se intentará después.', e);
    }
}