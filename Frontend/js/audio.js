
(function () {
  'use strict';

  /* ── No cargar en páginas de juego ── */
  const ruta = window.location.pathname;
  if (ruta.includes('game.html') ||
      ruta.includes('game-2.html') ||
      ruta.includes('game-3.html')) return;

  /* ── Ruta del archivo ── */
  const enPages = ruta.includes('/pages/');
  const PISTA   = (enPages ? '../' : '') + 'audio/music/menu_loop.mp3';

  /* ── Claves ── */
  const SK_TIME    = 'pastuker_music_time';
  const SK_SAVED   = 'pastuker_music_saved_at'; // timestamp cuando se guardó
  const SK_MUTED   = 'pastuker_music_muted';

  let audio    = null;
  let _saveInt = null;
  let _fadeInt = null;
  let _listo   = false; // true cuando loadedmetadata disparó

  const isMuted  = () => localStorage.getItem(SK_MUTED) === 'off';
  const setMuted = (v) => localStorage.setItem(SK_MUTED, v ? 'off' : 'on');

  /* ── Crear audio ── */
  function crearAudio() {
    audio        = new Audio(PISTA);
    audio.loop   = true;
    audio.volume = 0.45;
    audio.preload = 'auto';

    audio.addEventListener('loadedmetadata', onListo);
    // Por si loadedmetadata ya disparó (caché del navegador)
    if (audio.readyState >= 1) onListo();
  }

  /* ── Cuando el audio está listo para usar ── */
  function onListo() {
    if (_listo) return;
    _listo = true;

    // Calcular posición compensando el tiempo de carga de la página
    const savedTime   = parseFloat(sessionStorage.getItem(SK_TIME) || '0');
    const savedAt     = parseInt(sessionStorage.getItem(SK_SAVED)  || '0');
    const ahora       = Date.now();
    const tiempoCarga = savedAt > 0 ? (ahora - savedAt) / 1000 : 0;

    if (savedTime > 0 && audio.duration) {
      // Avanzar la posición según cuánto tardó en cargar la página
      const nuevaPos = (savedTime + tiempoCarga) % audio.duration;
      audio.currentTime = nuevaPos;
    }

    // Guardar posición cada 300ms
    _saveInt = setInterval(guardarPosicion, 300);

    intentarPlay();
  }

  /* ── Guardar posición actual ── */
  function guardarPosicion() {
    if (!audio) return;
    sessionStorage.setItem(SK_TIME,  audio.currentTime);
    sessionStorage.setItem(SK_SAVED, Date.now());
  }

  /* ── Intentar reproducir ── */
  function intentarPlay() {
    if (isMuted()) { actualizarBoton(false); return; }
    audio.play().then(() => {
      actualizarBoton(true);
    }).catch(() => {
      // Autoplay bloqueado → esperar interacción
      const handler = () => {
        audio.play().then(() => actualizarBoton(true)).catch(() => {});
        document.removeEventListener('click',    handler);
        document.removeEventListener('touchend', handler);
        document.removeEventListener('keydown',  handler);
        document.removeEventListener('touchstart', handler);
      };
      document.addEventListener('click',      handler, { once: true });
      document.addEventListener('touchend',   handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
      document.addEventListener('keydown',    handler, { once: true });
    });
  }

  /* ── Fade out ── */
  function fadeOut(cb) {
    if (_fadeInt) clearInterval(_fadeInt);
    if (!audio || audio.paused) { if (cb) cb(); return; }
    let v = audio.volume;
    _fadeInt = setInterval(() => {
      v = Math.max(0, v - 0.06);
      audio.volume = v;
      if (v <= 0) {
        clearInterval(_fadeInt);
        audio.pause();
        audio.volume = 0.45;
        if (cb) cb();
      }
    }, 25);
  }

  /* ── Toggle silencio ── */
  function toggleMusica() {
    if (!_listo) return;
    if (audio.paused) {
      setMuted(false);
      audio.volume = 0.45;
      intentarPlay();
    } else {
      setMuted(true);
      fadeOut(() => actualizarBoton(false));
    }
  }

  /* ── Botón flotante ── */
  function crearBoton() {
    if (document.getElementById('pastuker-music-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'pastuker-music-btn';
    btn.setAttribute('aria-label', 'Música');
    btn.style.cssText = [
      'position:fixed','bottom:18px','left:18px','z-index:9999',
      'width:40px','height:40px','border-radius:50%',
      'border:2px solid rgba(212,175,55,0.6)',
      'background:rgba(12,35,22,0.88)','color:#d4af37',
      'font-size:16px','cursor:pointer',
      'display:flex','align-items:center','justify-content:center',
      'box-shadow:0 3px 12px rgba(0,0,0,0.5)',
      'transition:transform 0.2s,border-color 0.2s',
      'outline:none','-webkit-tap-highlight-color:transparent',
    ].join(';');
    btn.innerHTML = isMuted() ? '🔇' : '🎵';
    btn.addEventListener('mouseenter', () => {
      btn.style.transform   = 'scale(1.15)';
      btn.style.borderColor = '#d4af37';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform   = 'scale(1)';
      btn.style.borderColor = 'rgba(212,175,55,0.6)';
    });
    btn.addEventListener('click', toggleMusica);
    document.body.appendChild(btn);
  }

  function actualizarBoton(sonando) {
    const btn = document.getElementById('pastuker-music-btn');
    if (btn) btn.innerHTML = sonando ? '🎵' : '🔇';
  }

  /* ── Guardar posición justo antes de salir de la página ── */
  window.addEventListener('beforeunload', () => {
    guardarPosicion();
  });

  /* ── Interceptar navegación hacia juegos ── */
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('//')) return;

    const esJuego = href.includes('game.html') ||
                    href.includes('game-2.html') ||
                    href.includes('game-3.html');

    if (esJuego) {
      e.preventDefault();
      guardarPosicion(); // guardar antes del fade
      fadeOut(() => {
        sessionStorage.setItem(SK_TIME,  '0');
        sessionStorage.setItem(SK_SAVED, '0');
        window.location.href = href;
      });
    }
    // Si NO es juego: beforeunload guarda la posición antes de navegar
  }, true);

  /* ── INIT ── */
  function init() {
    crearAudio();
    crearBoton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PastukerAudio = { toggle: toggleMusica, fadeOut };

})();