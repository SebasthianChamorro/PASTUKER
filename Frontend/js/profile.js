/* ── Cargar datos del usuario ── */
        const nombre    = localStorage.getItem('usuario_nombre')  || 'Explorador';
        const telefono  = localStorage.getItem('usuario_telefono')|| '---';
        const avatarStyle= localStorage.getItem('avatar_style')  || 'avataaars';
        const avatarSeed = localStorage.getItem('avatar_seed')   || nombre;

        document.getElementById('displayNombre').textContent   = nombre;
        document.getElementById('displayTelefono').textContent = telefono !== '---' ? '📞 ' + telefono : '---';
        document.getElementById('nuevoNombre').value = nombre;

        /* Avatar DiceBear */
        function cargarAvatar() {
            const style = localStorage.getItem('avatar_style') || 'avataaars';
            const seed  = localStorage.getItem('avatar_seed')  || nombre;
            const url   = `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&size=120`;
            document.getElementById('avatarImg').src = url;
        }
        cargarAvatar();

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

        /* ── Guardar nombre ── */
        document.getElementById('btnGuardarNombre').addEventListener('click', async () => {
            const val = document.getElementById('nuevoNombre').value.trim();
            const err = document.getElementById('errorNombre');
            if (!val || val.length < 2) { err.textContent = 'Mínimo 2 caracteres'; return; }
            err.textContent = '';

            /* INTEGRACIÓN BACKEND:
            await fetch('/api/usuarios/nombre', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: val })
            }); */

            localStorage.setItem('usuario_nombre', val);
            document.getElementById('displayNombre').textContent = val;
            mostrarToast('Nombre actualizado ✓');
        });

        /* ── Guardar contraseña ── */
        document.getElementById('btnGuardarPass').addEventListener('click', async () => {
            const actual    = document.getElementById('passActual').value;
            const nueva     = document.getElementById('passNueva').value;
            const confirmar = document.getElementById('passConfirmar').value;
            const err       = document.getElementById('errorPass');
            err.textContent = '';

            if (!actual)              { err.textContent = 'Ingresa tu contraseña actual'; return; }
            if (nueva.length < 6)     { err.textContent = 'Mínimo 6 caracteres'; return; }
            if (nueva !== confirmar)  { err.textContent = 'Las contraseñas no coinciden'; return; }

            /* INTEGRACIÓN BACKEND:
            const res = await fetch('/api/usuarios/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ actual, nueva })
            });
            if (!res.ok) { err.textContent = 'Contraseña actual incorrecta'; return; } */

            mostrarToast('Contraseña actualizada ✓');
            ['passActual','passNueva','passConfirmar'].forEach(id => document.getElementById(id).value = '');
        });

        /* ── Estadísticas ── */
        document.getElementById('btnStats').addEventListener('click', () => {
            /* INTEGRACIÓN BACKEND:
            const res  = await fetch('/api/usuarios/stats');
            const data = await res.json();
            document.getElementById('statPuntos').textContent   = data.puntos;
            document.getElementById('statPartidas').textContent = data.partidas;
            document.getElementById('statAciertos').textContent = data.aciertos + '%';
            document.getElementById('statRanking').textContent  = '#' + data.posicion; */

            /* Mmuestra datos del localStorage */
            document.getElementById('statPuntos').textContent   = localStorage.getItem('puntos_total') || '0';
            document.getElementById('statPartidas').textContent = localStorage.getItem('partidas')     || '0';
            document.getElementById('statAciertos').textContent = (localStorage.getItem('aciertos')    || '0') + '%';
            document.getElementById('statRanking').textContent  = '#' + (localStorage.getItem('ranking_pos') || '—');
        });

        /* ── Modal Eliminar cuenta ── */
        const modalEl   = document.getElementById('modalEliminar');
        const modalBox  = document.getElementById('modalBox');
        const inputConf = document.getElementById('confirmEliminar');
        const btnConf   = document.getElementById('modalConfirmar');

        document.getElementById('btnEliminar').addEventListener('click', () => {
            modalEl.classList.add('visible');
            setTimeout(() => modalBox.classList.add('visible'), 10);
            inputConf.value = '';
            btnConf.disabled = true;
        });

        inputConf.addEventListener('input', () => {
            btnConf.disabled = inputConf.value.trim() !== 'ELIMINAR';
        });

        document.getElementById('modalCancelar').addEventListener('click', cerrarModal);
        modalEl.addEventListener('click', e => { if (e.target === modalEl) cerrarModal(); });

        function cerrarModal() {
            modalBox.classList.remove('visible');
            setTimeout(() => modalEl.classList.remove('visible'), 300);
        }

        document.getElementById('modalConfirmar').addEventListener('click', async () => {
            /* INTEGRACIÓN BACKEND:
            await fetch('/api/usuarios/cuenta', { method: 'DELETE' }); */
            localStorage.clear();
            window.location.href = '../index.html';
        });