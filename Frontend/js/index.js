/* ════════════════════════════════════════════════════════════════
   PASTUKER — index.js
   Animaciones de entrada, parallax y registro del Service Worker
   Archivo: js/index.js
════════════════════════════════════════════════════════════════ */

/* ── Animaciones de entrada + parallax ── */
window.addEventListener('load', () => {

    // Entrada suave de la tarjeta central
    const tarjeta = document.querySelector('.tarjeta-inicio');
    tarjeta.style.opacity = '0';
    tarjeta.style.transform = 'translateY(30px)';
    setTimeout(() => {
        tarjeta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        tarjeta.style.opacity = '1';
        tarjeta.style.transform = 'translateY(0)';
    }, 300);

    // Entrada de laterales (solo PC)
    if (window.innerWidth >= 1024) {
        const izq = document.querySelector('.lateral-izq');
        const der = document.querySelector('.lateral-der');
        [izq, der].forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = i === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        });
        setTimeout(() => {
            const t = 'opacity 1s ease 0.6s, transform 1s ease 0.6s';
            izq.style.transition = t;
            der.style.transition = t;
            izq.style.opacity = '1'; izq.style.transform = 'translateX(0)';
            der.style.opacity = '1'; der.style.transform = 'translateX(0)';
        }, 400);
    }
});

// Parallax con el mouse (solo PC)
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const cf = document.querySelector('.capa-fondo');
        const cm = document.querySelector('.capa-media');
        const cp = document.querySelector('.capa-frente');
        if (cf) cf.style.transform = `translateX(${x * 0.3}px)`;
        if (cm) cm.style.transform = `translateX(${x * 0.7}px)`;
        if (cp) cp.style.transform = `translateX(${x * 1.2}px)`;
    });
}

/* ── Registrar Service Worker (PWA offline) ── */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(reg => {
                console.log('[PWA] Service Worker registrado ✓', reg.scope);

                // Detecta actualizaciones disponibles
                reg.addEventListener('updatefound', () => {
                    const nuevoSW = reg.installing;
                    nuevoSW.addEventListener('statechange', () => {
                        if (nuevoSW.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] Nueva versión disponible');
                        }
                    });
                });
            })
            .catch(err => console.warn('[PWA] Error al registrar SW:', err));
    });
}