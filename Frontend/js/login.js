/* ════════════════════════════════════════════════════════════════
   PASTUKER — login.js
   Validación + integración API Flask + fallback offline
════════════════════════════════════════════════════════════════ */
'use strict';

// ── URL de la API ──
// Desarrollo local : 'http://localhost:5000'
// Producción       : 'https://TU-APP.up.railway.app'
const API_URL = 'http://localhost:5000';

/* ── Animación de entrada de la card ── */
window.addEventListener('load', () => {
    const card = document.getElementById('loginCard');
    card.style.opacity   = '0';
    card.style.transform = 'translateY(30px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    }, 200);

    // Autocompletar teléfono si eligió "Recordarme" antes
    const tel = localStorage.getItem('recordar_tel');
    if (tel) {
        const input = document.getElementById('telefono');
        if (input) input.value = tel;
    }
});

/* ── Mostrar / ocultar contraseña ── */
const btnOjo     = document.getElementById('btnOjo');
const inputPass  = document.getElementById('contrasena');
const ojAbierto  = btnOjo.querySelector('.ojo-abierto');
const ojoCerrado = btnOjo.querySelector('.ojo-cerrado');

btnOjo.addEventListener('click', () => {
    const esPassword        = inputPass.type === 'password';
    inputPass.type          = esPassword ? 'text' : 'password';
    ojAbierto.style.display  = esPassword ? 'none'  : 'block';
    ojoCerrado.style.display = esPassword ? 'block' : 'none';
    btnOjo.setAttribute('aria-label', esPassword ? 'Ocultar contraseña' : 'Mostrar contraseña');
});

/* ── Referencias del formulario ── */
const form        = document.getElementById('loginForm');
const inputTel    = document.getElementById('telefono');
const errTel      = document.getElementById('errorTelefono');
const errPass     = document.getElementById('errorContrasena');
const loginError  = document.getElementById('loginError');
const loginErrMsg = document.getElementById('loginErrorMsg');
const btnLogin    = document.getElementById('btnLogin');
const spinner     = document.getElementById('loginSpinner');

/* ── Limpia errores al escribir ── */
inputTel.addEventListener('input', () => {
    inputTel.value = inputTel.value.replace(/\D/g, ''); // solo números
    errTel.textContent = '';
    inputTel.closest('.campo-grupo').classList.remove('campo-error-activo');
});

inputPass.addEventListener('input', () => {
    errPass.textContent = '';
    inputPass.closest('.campo-grupo').classList.remove('campo-error-activo');
});

/* ── SHA-256 en el navegador para fallback offline ── */
async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ── Guardar sesión completa en localStorage ── */
function guardarSesion(usuario, token) {
    localStorage.setItem('usuario_id',       usuario.id);
    localStorage.setItem('usuario_nombre',   usuario.nombre);
    localStorage.setItem('usuario_telefono', usuario.telefono);
    localStorage.setItem('usuario_genero', usuario.genero);
    localStorage.setItem('usuario_avatar',   usuario.avatar  || '');
    localStorage.setItem('usuario_xp',       usuario.xp      || 0);
    localStorage.setItem('usuario_token',    token);
    if (usuario.plantas_encontradas?.length) {
        localStorage.setItem('plantas_encontradas', JSON.stringify(usuario.plantas_encontradas));
    }
    if (usuario.mundo2_completo) {
        localStorage.setItem('mundo2_completo', '1');
    }
}

/* ── Shake de error ── */
function shakeCard() {
    const card = document.getElementById('loginCard');
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 600);
}

/* ── Mostrar error global ── */
function mostrarErrorGlobal(msg) {
    loginErrMsg.textContent  = msg;
    loginError.style.display = 'flex';
    shakeCard();
}

/* ── Validación ── */
function validar(telefono, password) {
    let ok = true;
    errTel.textContent  = '';
    errPass.textContent = '';
    inputTel.closest('.campo-grupo').classList.remove('campo-error-activo');
    inputPass.closest('.campo-grupo').classList.remove('campo-error-activo');

    if (!telefono || telefono.length < 7) {
        errTel.textContent = 'Ingresa un número válido';
        inputTel.closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (!password || password.length < 4) {
        errPass.textContent = 'Ingresa tu contraseña';
        inputPass.closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    return ok;
}

/* ── Estado del botón ── */
function setLoading(on) {
    btnLogin.disabled = on;
    btnLogin.querySelector('.btn-login-texto').textContent = on ? 'Verificando...' : 'Iniciar Sesión';
    spinner.style.display = on ? 'inline-block' : 'none';
}

/* ══════════════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════════════ */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';

    const telefono = inputTel.value.trim();
    const password = inputPass.value.trim();

    if (!validar(telefono, password)) return;

    setLoading(true);

    try {
        // ── 1. Intentar login ONLINE ──
        const res  = await fetch(`${API_URL}/api/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ telefono, password }),
            signal:  AbortSignal.timeout(6000),
        });
        const data = await res.json();

        if (data.ok) {
            // Guardar hash para fallback offline
            const pwdHash = await sha256(password);
            localStorage.setItem('usuario_pwd_hash', pwdHash);

            guardarSesion(data.usuario, data.token);

            if (document.getElementById('recordarme')?.checked) {
                localStorage.setItem('recordar_tel', telefono);
            } else {
                localStorage.removeItem('recordar_tel');
            }

            window.location.replace('menugeneral.html');

        } else {
            mostrarErrorGlobal(data.msg || 'Teléfono o contraseña incorrectos');
        }

    } catch (err) {
        // ── 2. Sin conexión — intentar OFFLINE ──
        console.warn('Sin conexión, intentando offline...', err.message);

        const pwdHash     = await sha256(password);
        const pwdGuardado = localStorage.getItem('usuario_pwd_hash');
        const telGuardado = localStorage.getItem('usuario_telefono');

        if (telGuardado === telefono && pwdGuardado === pwdHash) {
            window.location.replace('menugeneral.html');
        } else {
            mostrarErrorGlobal(
                telGuardado !== telefono
                    ? 'Sin conexión. Teléfono no reconocido en este dispositivo.'
                    : 'Sin conexión. Contraseña incorrecta.'
            );
        }

    } finally {
        setLoading(false);
    }
});