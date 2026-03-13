/* ════════════════════════════════════════════════════════════════
   PASTUKER — login.js
   Validación, mostrar/ocultar contraseña y envío del formulario
   Archivo: js/login.js
════════════════════════════════════════════════════════════════ */

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
});

/* ── Mostrar / ocultar contraseña ── */
const btnOjo     = document.getElementById('btnOjo');
const inputPass  = document.getElementById('contrasena');
const ojAbierto  = btnOjo.querySelector('.ojo-abierto');
const ojoCerrado = btnOjo.querySelector('.ojo-cerrado');

btnOjo.addEventListener('click', () => {
    const esPasword       = inputPass.type === 'password';
    inputPass.type        = esPasword ? 'text' : 'password';
    ojAbierto.style.display  = esPasword ? 'none'  : 'block';
    ojoCerrado.style.display = esPasword ? 'block' : 'none';
    btnOjo.setAttribute('aria-label', esPasword ? 'Ocultar contraseña' : 'Mostrar contraseña');
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
    // Solo permite números
    inputTel.value = inputTel.value.replace(/\D/g, '');
    errTel.textContent = '';
    inputTel.closest('.campo-grupo').classList.remove('campo-error-activo');
});

inputPass.addEventListener('input', () => {
    errPass.textContent = '';
    inputPass.closest('.campo-grupo').classList.remove('campo-error-activo');
});

/* ── Validación y envío ── */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    let valido = true;

    /* Validar teléfono */
    if (!inputTel.value || inputTel.value.length < 7) {
        errTel.textContent = 'Ingresa un número válido';
        inputTel.closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }

    /* Validar contraseña */
    if (!inputPass.value || inputPass.value.length < 4) {
        errPass.textContent = 'Ingresa tu contraseña';
        inputPass.closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }

    if (!valido) return;

    /* Mostrar spinner mientras carga */
    btnLogin.disabled = true;
    btnLogin.querySelector('.btn-login-texto').textContent = 'Verificando...';
    spinner.style.display = 'inline-block';

    try {
        /*
            INTEGRACIÓN CON BACKEND FLASK:

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    telefono: inputTel.value,
                    password: inputPass.value,
                    recordar: document.getElementById('recordarme').checked
                })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('auth_token', data.token);
                window.location.href = 'menugeneral.html';
            } else {
                throw new Error(data.mensaje || 'Credenciales incorrectas');
            }
        */

        /* Por ahora: simula una pausa y redirige al menú */
        await new Promise(r => setTimeout(r, 1200));
        window.location.href = 'menugeneral.html';

    } catch (err) {
        loginErrMsg.textContent  = err.message;
        loginError.style.display = 'flex';
        /* Sacude la card para indicar error */
        document.getElementById('loginCard').classList.add('shake');
        setTimeout(() => document.getElementById('loginCard').classList.remove('shake'), 600);
    } finally {
        btnLogin.disabled = false;
        btnLogin.querySelector('.btn-login-texto').textContent = 'Iniciar Sesión';
        spinner.style.display = 'none';
    }
});