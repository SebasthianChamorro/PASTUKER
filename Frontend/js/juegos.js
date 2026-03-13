/* ════════════════════════════════════════════════════════════════
   PASTUKER — juegos.js
   Animaciones de entrada y efecto ripple en tarjetas de juego
   Archivo: js/juegos.js
════════════════════════════════════════════════════════════════ */

/* ── Animación de entrada ── */
window.addEventListener('load', () => {

    /* Card principal */
    const card = document.getElementById('juegosCard');
    card.style.opacity   = '0';
    card.style.transform = 'translateY(28px)';
    setTimeout(() => {
        card.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        card.style.opacity    = '1';
        card.style.transform  = 'translateY(0)';
    }, 150);

    /* Tarjetas de juego con entrada escalonada */
    const tarjetas = document.querySelectorAll('.juego-card');
    tarjetas.forEach((t, i) => {
        t.style.opacity   = '0';
        t.style.transform = 'translateY(24px) scale(0.96)';
        setTimeout(() => {
            t.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            t.style.opacity    = '1';
            t.style.transform  = 'translateY(0) scale(1)';
        }, 500 + i * 150);
    });

    /* "Cómo funciona" entra último */
    const cf = document.getElementById('comoFunciona');
    cf.style.opacity   = '0';
    cf.style.transform = 'translateY(16px)';
    setTimeout(() => {
        cf.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cf.style.opacity    = '1';
        cf.style.transform  = 'translateY(0)';
    }, 850);
});

/* ── Efecto ripple en las tarjetas ── */
document.querySelectorAll('.juego-card').forEach(card => {
    card.addEventListener('pointerdown', function(e) {
        const rect   = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className  = 'ripple';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top  = (e.clientY - rect.top)  + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});