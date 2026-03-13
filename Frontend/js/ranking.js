/* ── Animación de entrada ── */
        window.addEventListener('load', () => {
            const card = document.getElementById('rankingCard');
            card.style.opacity   = '0';
            card.style.transform = 'translateY(28px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
                card.style.opacity    = '1';
                card.style.transform  = 'translateY(0)';
            }, 150);

            /* Tarjetas entran escalonadas */
            document.querySelectorAll('.ranking-item').forEach((t, i) => {
                t.style.opacity   = '0';
                t.style.transform = 'translateY(24px) scale(0.96)';
                setTimeout(() => {
                    t.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    t.style.opacity    = '1';
                    t.style.transform  = 'translateY(0) scale(1)';
                }, 450 + i * 130);
            });

            /* "Cómo funciona" entra al final */
            const cf = document.getElementById('comoFunciona');
            cf.style.opacity   = '0';
            cf.style.transform = 'translateY(16px)';
            setTimeout(() => {
                cf.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                cf.style.opacity    = '1';
                cf.style.transform  = 'translateY(0)';
            }, 900);
        });

        /* ── Ripple ── */
        document.querySelectorAll('.ranking-item').forEach(item => {
            item.addEventListener('pointerdown', function(e) {
                const rect   = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top  = (e.clientY - rect.top)  + 'px';
                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });