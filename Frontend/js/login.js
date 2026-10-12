/* ════════════════════════════════════════════════════════════════
   PASTUKER — login.js
   Validación + API Flask + inicio de sesión sin conexión
   Requiere: js/api.js (window.Pastuker) cargado antes.
════════════════════════════════════════════════════════════════ */
'use strict';

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
    const tel = Pastuker.LS.get('recordar_tel');
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
    const esPassword         = inputPass.type === 'password';
    inputPass.type           = esPassword ? 'text' : 'password';
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
    if (!password || password.length < 6) {
        errPass.textContent = 'La contraseña tiene mínimo 6 caracteres';
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

/* ── Entrar: guarda sesión + hash offline y redirige ── */
async function entrar(usuario, token, telefono, password) {
    Pastuker.guardarSesion(usuario, token);
    await Pastuker.guardarHashOffline(telefono, password);

    if (document.getElementById('recordarme')?.checked) {
        Pastuker.LS.set('recordar_tel', telefono);
    } else {
        Pastuker.LS.del('recordar_tel');
    }

    // Sube de inmediato lo que se haya jugado sin conexión o como invitado
    await Promise.race([Pastuker.sincronizar(), new Promise(r => setTimeout(r, 2500))]);

    // Cuentas antiguas sin autorización registrada → pedirla
    if (usuario.consentimiento === false) {
        window.location.replace('privacidad.html?aceptar=1');
    } else {
        window.location.replace('menugeneral.html');
    }
}

/* ── Registro hecho sin conexión: se crea en el servidor con la
      contraseña que el jugador acaba de escribir (nunca se guarda en claro) ── */
async function completarRegistroPendiente(telefono, password) {
    const pendiente = Pastuker.LS.json('registro_pendiente', null);
    if (!pendiente || pendiente.telefono !== telefono) return null;
    if (!(await Pastuker.verificarOffline(telefono, password))) return null;

    const r = await Pastuker.api('/api/register', {
        method: 'POST', auth: false,
        body: { ...pendiente, password },
    });
    if (r.ok) {
        Pastuker.LS.del('registro_pendiente');
        return r.data;
    }
    if (r.status === 409) Pastuker.LS.del('registro_pendiente'); // ya existía
    return null;
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
        let r;
        try {
            r = await Pastuker.api('/api/login', {
                method: 'POST', auth: false, body: { telefono, password }, timeout: 8000,
            });
        } catch (err) {
            r = null; // sin red
        }

        if (r && r.ok) {
            await entrar(r.data.usuario, r.data.token, telefono, password);
            return;
        }

        if (r && r.status === 401) {
            // ¿Es una cuenta creada sin conexión que aún no llegó al servidor?
            const reg = await completarRegistroPendiente(telefono, password);
            if (reg) { await entrar(reg.usuario, reg.token, telefono, password); return; }
        }

        if (r) {
            mostrarErrorGlobal(r.data?.msg || 'Teléfono o contraseña incorrectos');
            return;
        }

        // ── 2. Sin conexión — verificar contra el hash local (PBKDF2 con sal) ──
        if (!Pastuker.cryptoDisponible()) {
            mostrarErrorGlobal('Sin conexión. Este navegador no permite entrar sin internet (se necesita HTTPS).');
            return;
        }
        const telGuardado = Pastuker.LS.get('usuario_pwd_tel') || Pastuker.LS.get('usuario_telefono');
        if (await Pastuker.verificarOffline(telefono, password)) {
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
