(function () {
  'use strict';

  const ruta = window.location.pathname;
  if (ruta.includes('game.html') ||
      ruta.includes('game-2.html') ||
      ruta.includes('game-3.html')) return;

  const enPages = ruta.includes('/pages/');
  const PISTA   = (enPages ? '../' : '') + 'audio/music/menu_loop.mp3';

  const SK_TIME  = 'pastuker_music_time';
  const SK_SAVED = 'pastuker_music_saved_at';
  const SK_MUTED = 'pastuker_music_muted';
  const SK_OK    = 'pastuker_audio_ok';

  let audio     = null;
  let blobURL   = null;
  let _saveInt  = null;
  let _fadeInt  = null;

  window._pastukerAudioDesbloqueado = !!sessionStorage.getItem(SK_OK);

  const isMuted  = () => localStorage.getItem(SK_MUTED) === 'off';
  const setMuted = (v) => localStorage.setItem(SK_MUTED, v ? 'off' : 'on');

  function _iniciarGuardado() {
    clearInterval(_saveInt);
    _saveInt = setInterval(() => {
      if (audio) {
        sessionStorage.setItem(SK_TIME,  audio.currentTime);
        sessionStorage.setItem(SK_SAVED, Date.now());
      }
    }, 300);
  }

  function desbloquearContexto() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { const ctx = new AC(); ctx.resume().then(() => ctx.close()).catch(() => {}); }
    } catch(_) {}
  }

  function marcarDesbloqueado() {
    window._pastukerAudioDesbloqueado = true;
    sessionStorage.setItem(SK_OK, '1');
  }

  /* ── Crear Audio desde blobURL o ruta normal ── */
  function crearAudioDesde(src) {
    if (audio) { try { audio.pause(); } catch(_) {} }
    audio        = new Audio(src);
    audio.loop   = true;
    audio.volume = 0.45;

    const savedTime = parseFloat(sessionStorage.getItem(SK_TIME) || '0');
    const savedAt   = parseInt(sessionStorage.getItem(SK_SAVED)  || '0');
    if (savedTime > 0 && savedAt > 0) {
      audio.addEventListener('loadedmetadata', () => {
        if (audio && audio.duration) {
          const lag = (Date.now() - savedAt) / 1000;
          audio.currentTime = (savedTime + lag) % audio.duration;
        }
      }, { once: true });
    }
    _iniciarGuardado();
    return audio;
  }

  /* ── Precargar audio como blob (evita problemas de range requests) ── */
  function precargarBlob(cb) {
    if (blobURL) { cb(blobURL); return; }
    fetch(PISTA)
      .then(r => r.blob())
      .then(blob => {
        blobURL = URL.createObjectURL(blob);
        cb(blobURL);
      })
      .catch(() => {
        // Si fetch falla usar ruta normal
        cb(PISTA);
      });
  }

  /* ══════════════════════════════════════════════════════
     SPLASH
  ══════════════════════════════════════════════════════ */
  function mostrarSplash() {
    if (document.getElementById('pastuker-splash')) return;

    // Iniciar precarga del blob mientras aparece el splash
    precargarBlob(() => {});

    const splash = document.createElement('div');
    splash.id = 'pastuker-splash';
    splash.style.cssText = [
      'position:fixed','inset:0','z-index:99999',
      'background:rgba(10,26,16,0.95)',
      'display:flex','flex-direction:column',
      'align-items:center','justify-content:center','gap:24px',
      'cursor:pointer','-webkit-tap-highlight-color:transparent',
      'touch-action:manipulation',
    ].join(';');

    splash.innerHTML = `
      <style>@keyframes _spl{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}</style>
      <div style="width:90px;height:90px;border-radius:50%;
        background:rgba(45,107,74,0.9);border:3px solid #d4af37;
        display:flex;align-items:center;justify-content:center;font-size:40px;
        animation:_spl 1.3s ease-in-out infinite;">🎵</div>
      <p style="font-family:'Press Start 2P',monospace;font-size:clamp(10px,3vw,14px);
        color:#d4af37;text-align:center;line-height:2;margin:0;padding:0 28px;">
        Toca para comenzar</p>
      <p style="font-family:'Press Start 2P',monospace;font-size:clamp(7px,1.8vw,9px);
        color:rgba(212,175,55,0.4);text-align:center;margin:0;padding:0 36px;line-height:2;">
        Pastuker · Saberes Ancestrales Pastos</p>
    `;

    document.body.appendChild(splash);

    function arrancar(e) {
      e.preventDefault();
      e.stopPropagation();

      desbloquearContexto();
      marcarDesbloqueado();

      splash.style.transition = 'opacity 0.35s';
      splash.style.opacity    = '0';
      setTimeout(() => { if (splash.parentNode) splash.remove(); }, 350);

      if (isMuted()) return;

      // Usar blobURL si está listo, sino ruta normal
      const src = blobURL || PISTA;
      crearAudioDesde(src);
      const p = audio.play();
      if (p) p.then(() => actualizarBoton(true)).catch(err => {
        console.warn('[Audio] play() falló:', err.message);
      });
    }

    splash.addEventListener('touchend', arrancar, { passive: false, once: true });
    splash.addEventListener('click',    arrancar, { once: true });
  }

  /* ══════════════════════════════════════════════════════
     INIT
  ══════════════════════════════════════════════════════ */
  function init() {
    crearBoton();
    if (isMuted()) { actualizarBoton(false); return; }

    // Precargar el blob en background
    precargarBlob((src) => {
      crearAudioDesde(src);
      const p = audio.play();
      if (p && p.then) {
        p.then(() => {
          marcarDesbloqueado();
          actualizarBoton(true);
        }).catch(() => {
          if (!enPages) mostrarSplash();
        });
      }
    });
  }

  /* ── Toggle silencio ── */
  function toggleMusica() {
    if (!audio) return;
    if (audio.paused) {
      setMuted(false);
      audio.volume = 0.45;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
      actualizarBoton(true);
    } else {
      setMuted(true);
      fadeOut(() => actualizarBoton(false));
    }
  }

  function fadeOut(cb) {
    if (_fadeInt) clearInterval(_fadeInt);
    if (!audio || audio.paused) { if (cb) cb(); return; }
    let v = audio.volume;
    _fadeInt = setInterval(() => {
      v = Math.max(0, v - 0.06);
      if (audio) audio.volume = v;
      if (v <= 0) {
        clearInterval(_fadeInt);
        if (audio) { audio.pause(); audio.volume = 0.45; }
        if (cb) cb();
      }
    }, 25);
  }

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
    btn.addEventListener('mouseenter', () => { btn.style.transform='scale(1.15)'; btn.style.borderColor='#d4af37'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform='scale(1)'; btn.style.borderColor='rgba(212,175,55,0.6)'; });
    btn.addEventListener('click', toggleMusica);
    document.body.appendChild(btn);
  }

  function actualizarBoton(sonando) {
    const btn = document.getElementById('pastuker-music-btn');
    if (btn) btn.innerHTML = sonando ? '🎵' : '🔇';
  }

  window.addEventListener('beforeunload', () => {
    if (audio) {
      sessionStorage.setItem(SK_TIME,  audio.currentTime);
      sessionStorage.setItem(SK_SAVED, Date.now());
    }
  });

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
      if (audio) {
        sessionStorage.setItem(SK_TIME,  audio.currentTime);
        sessionStorage.setItem(SK_SAVED, Date.now());
      }
      fadeOut(() => {
        sessionStorage.setItem(SK_TIME,  '0');
        sessionStorage.setItem(SK_SAVED, '0');
        window.location.href = href;
      });
    }
  }, true);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PastukerAudio = { toggle: toggleMusica, fadeOut };

})();