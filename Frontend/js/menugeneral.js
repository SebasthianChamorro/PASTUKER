/* ── Mostrar nombre del usuario desde localStorage ── */
        const nombreEl = document.getElementById('nombreUsuario');
        const nombre   = localStorage.getItem('usuario_nombre') || 'Explorador';
        nombreEl.textContent = nombre;

        /* ── Animación de entrada escalonada de los items ── */
        window.addEventListener('load', () => {
            const card = document.getElementById('menuCard');
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                card.style.opacity    = '1';
                card.style.transform  = 'translateY(0)';
            }, 150);

            /* Items del grid entran uno a uno */
            const items = document.querySelectorAll('.menu-item');
            items.forEach((item, i) => {
                item.style.opacity   = '0';
                item.style.transform = 'translateY(20px) scale(0.96)';
                setTimeout(() => {
                    item.style.transition = `opacity 0.5s ease, transform 0.5s ease`;
                    item.style.opacity    = '1';
                    item.style.transform  = 'translateY(0) scale(1)';
                }, 500 + i * 100);
            });
        });

        /* ── Modal de cerrar sesión ── */
        const overlay        = document.getElementById('modalOverlay');
        const modalBox       = document.getElementById('modalBox');
        const btnCerrar      = document.getElementById('btnCerrarSesion');
        const btnCancelar    = document.getElementById('modalCancelar');
        const btnConfirmar   = document.getElementById('modalConfirmar');

        btnCerrar.addEventListener('click', () => {
            overlay.classList.add('visible');
            setTimeout(() => modalBox.classList.add('visible'), 10);
        });

        btnCancelar.addEventListener('click', cerrarModal);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) cerrarModal();
        });

        function cerrarModal() {
            modalBox.classList.remove('visible');
            setTimeout(() => overlay.classList.remove('visible'), 300);
        }

        btnConfirmar.addEventListener('click', async () => {
            btnConfirmar.disabled = true;
            // Sube el progreso pendiente, invalida el token en el servidor
            // y lo borra del dispositivo. Se conserva el hash local para
            // que el jugador pueda volver a entrar sin conexión.
            if (window.Pastuker) await Pastuker.cerrarSesion();
            window.location.href = '../index.html';
        });

        /* ── Aviso: hay progreso o un registro que aún no llegó al servidor ── */
        window.addEventListener('load', () => {
            if (!window.Pastuker || Pastuker.estaConectado() || !navigator.onLine) return;
            const pendiente = Pastuker.hayRegistroPendiente() || Pastuker.LS.get('sync_pendiente');
            if (!pendiente || !Pastuker.LS.get('usuario_telefono')) return;
            const aviso = document.createElement('a');
            aviso.href = 'login.html';
            aviso.textContent = '☁ Ya tienes internet: vuelve a iniciar sesión para guardar tu progreso';
            aviso.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:50;' +
                'max-width:92vw;padding:10px 16px;border-radius:12px;background:rgba(10,30,18,.95);' +
                'border:1.5px solid #d4af37;color:#f0d060;font-size:12px;font-weight:700;text-align:center;';
            document.body.appendChild(aviso);
        });

        /* ── Efecto de ripple en los items al tocar ── */
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('pointerdown', function(e) {
                const rect   = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top  = (e.clientY - rect.top)  + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });