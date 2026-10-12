/* ════════════════════════════════════════════════════════════════
   PASTUKER — register.js
   Validación + API Flask + registro sin conexión
   Requiere: js/api.js (window.Pastuker) cargado antes.
════════════════════════════════════════════════════════════════ */
'use strict';

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
['aceptaDatos', 'autorizaAcudiente'].forEach(id => {
    document.getElementById(id)?.addEventListener('change', () => {
        document.getElementById('errorConsentimiento').textContent = '';
    });
});

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
function validar(nombre, telefono, contrasena, confirmar, genero, acepta, acudiente) {
    let ok = true;

    if (!nombre || nombre.length < 2 || nombre.length > 50) {
        document.getElementById('errorNombre').textContent = 'Ingresa tu nombre (2 a 50 letras)';
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
    if (!contrasena || contrasena.trim().length < 6) {
        document.getElementById('errorContrasena').textContent = 'Mínimo 6 caracteres';
        document.getElementById('contrasena').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (contrasena !== confirmar) {
        document.getElementById('errorConfirmar').textContent = 'Las contraseñas no coinciden';
        document.getElementById('confirmar').closest('.campo-grupo').classList.add('campo-error-activo');
        ok = false;
    }
    if (!acepta || !acudiente) {
        document.getElementById('errorConsentimiento').textContent =
            'Necesitas aceptar la política y la autorización de tu acudiente';
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

    const nombre     = document.getElementById('nombre').value.trim();
    const telefono   = document.getElementById('telefono').value.trim();
    const contrasena = document.getElementById('contrasena').value.trim();
    const confirmar  = document.getElementById('confirmar').value.trim();
    const genero     = document.querySelector('input[name="genero"]:checked')?.value || '';
    const acepta     = !!document.getElementById('aceptaDatos')?.checked;
    const acudiente  = !!document.getElementById('autorizaAcudiente')?.checked;

    if (!validar(nombre, telefono, contrasena, confirmar, genero, acepta, acudiente)) return;

    const datos = { nombre, telefono, genero, acepta_datos: acepta, autoriza_acudiente: acudiente };

    setLoading(true);

    try {
        // ── 1. Intentar registro ONLINE ──
        let r = null;
        try {
            r = await Pastuker.api('/api/register', {
                method: 'POST', auth: false, body: { ...datos, password: contrasena },
            });
        } catch { r = null; }

        if (r && r.ok) {
            Pastuker.guardarSesion(r.data.usuario, r.data.token);
            await Pastuker.guardarHashOffline(telefono, contrasena);
            window.location.replace('login.html');
            return;
        }
        if (r) {
            mostrarErrorGlobal(r.data?.msg || 'No se pudo crear la cuenta.');
            return;
        }

        // ── 2. Sin conexión — guardar localmente (SIN la contraseña en claro) ──
        if (!Pastuker.cryptoDisponible()) {
            mostrarErrorGlobal('Sin conexión. Conéctate a internet para crear tu cuenta.');
            return;
        }
        Pastuker.guardarSesion({ nombre, telefono, genero, avatar: '' }, null);
        await Pastuker.guardarHashOffline(telefono, contrasena);
        Pastuker.LS.set('registro_pendiente', JSON.stringify({ ...datos, creado: Date.now() }));
        // La cuenta se crea en el servidor la próxima vez que inicie sesión con internet
        window.location.replace('login.html');

    } finally {
        setLoading(false);
    }
});
