/* ── Entrada de la card ── */
        window.addEventListener('load', () => {
            const card = document.getElementById('registerCard');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200);
        });

        /* ── Mostrar/ocultar contraseñas ── */
        function togglePassword(btnId, inputId) {
            const btn    = document.getElementById(btnId);
            const input  = document.getElementById(inputId);
            const abierto  = btn.querySelector('.ojo-abierto');
            const cerrado  = btn.querySelector('.ojo-cerrado');
            btn.addEventListener('click', () => {
                const esPass = input.type === 'password';
                input.type   = esPass ? 'text' : 'password';
                abierto.style.display  = esPass ? 'none'  : 'block';
                cerrado.style.display  = esPass ? 'block' : 'none';
            });
        }
        togglePassword('btnOjo1', 'contrasena');
        togglePassword('btnOjo2', 'confirmar');

        /* ── Indicador de fortaleza de contraseña ── */
        const inputPass     = document.getElementById('contrasena');
        const fortalezaWrap = document.getElementById('fortalezaWrap');
        const fortalezaTxt  = document.getElementById('fortalezaTexto');
        const barras        = [
            document.getElementById('b1'),
            document.getElementById('b2'),
            document.getElementById('b3'),
            document.getElementById('b4'),
        ];
        const colores = ['#e74c3c','#e67e22','#f1c40f','#2ecc71'];
        const textos  = ['Muy débil','Débil','Media','Fuerte'];

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
            fortalezaTxt.textContent  = textos[Math.max(nivel - 1, 0)];
            fortalezaTxt.style.color  = colores[Math.max(nivel - 1, 0)];
            // Limpiar error al escribir
            document.getElementById('errorContrasena').textContent = '';
            document.getElementById('contrasena').closest('.campo-grupo').classList.remove('campo-error-activo');
        });

        /* ── Limpiar errores al escribir ── */
        document.getElementById('nombre').addEventListener('input', () => {
            document.getElementById('errorNombre').textContent = '';
            document.getElementById('nombre').closest('.campo-grupo').classList.remove('campo-error-activo');
        });
        document.getElementById('telefono').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            document.getElementById('errorTelefono').textContent = '';
            e.target.closest('.campo-grupo').classList.remove('campo-error-activo');
        });
        document.getElementById('confirmar').addEventListener('input', () => {
            document.getElementById('errorConfirmar').textContent = '';
            document.getElementById('confirmar').closest('.campo-grupo').classList.remove('campo-error-activo');
        });

        /* ── Validación y envío ── */
        const form          = document.getElementById('registerForm');
        const registerError = document.getElementById('registerError');
        const registerErrMsg= document.getElementById('registerErrorMsg');
        const btnRegister   = document.getElementById('btnRegister');
        const spinner       = document.getElementById('registerSpinner');

        form.addEventListener('submit', async (e) => {
    e.preventDefault();
    registerError.style.display = 'none';
    let valido = true;

    const nombre    = document.getElementById('nombre').value.trim();
    const telefono  = document.getElementById('telefono').value.trim();
    const contrasena= document.getElementById('contrasena').value;
    const confirmar = document.getElementById('confirmar').value;
    const genero    = document.querySelector('input[name="genero"]:checked');

    if (!nombre || nombre.length < 2) {
        document.getElementById('errorNombre').textContent = 'Ingresa tu nombre completo';
        document.getElementById('nombre').closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }
    if (!genero) {
        document.getElementById('errorGenero').textContent = 'Selecciona una opción';
        valido = false;
    }
    if (!telefono || telefono.length < 7) {
        document.getElementById('errorTelefono').textContent = 'Ingresa un número válido';
        document.getElementById('telefono').closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }
    if (!contrasena || contrasena.length < 6) {
        document.getElementById('errorContrasena').textContent = 'Mínimo 6 caracteres';
        document.getElementById('contrasena').closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }
    if (contrasena !== confirmar) {
        document.getElementById('errorConfirmar').textContent = 'Las contraseñas no coinciden';
        document.getElementById('confirmar').closest('.campo-grupo').classList.add('campo-error-activo');
        valido = false;
    }

    if (!valido) return;

    btnRegister.disabled = true;
    btnRegister.querySelector('.btn-register-texto').textContent = 'Creando cuenta...';
    spinner.style.display = 'inline-block';

    try {
        /*
            INTEGRACIÓN CON BACKEND FLASK:
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre,
                    telefono,
                    password: contrasena,
                    genero: genero.value
                })
            });
            const data = await res.json();
            if (res.ok) {
                window.location.href = 'login.html';
            } else {
                throw new Error(data.mensaje || 'Error al crear la cuenta');
            }
        */

        /* Guardar género en localStorage */
        localStorage.setItem('usuario_nombre', nombre);
        localStorage.setItem('usuario_genero', genero.value);

        /* Simulación temporal: pausa y redirige al login */
        await new Promise(r => setTimeout(r, 1200));
        window.location.href = 'login.html';

    } catch (err) {
        registerErrMsg.textContent = err.message;
        registerError.style.display = 'flex';
        document.getElementById('registerCard').classList.add('shake');
        setTimeout(() => document.getElementById('registerCard').classList.remove('shake'), 600);
    } finally {
        btnRegister.disabled = false;
        btnRegister.querySelector('.btn-register-texto').textContent = 'Crear Cuenta';
        spinner.style.display = 'none';
    }
});