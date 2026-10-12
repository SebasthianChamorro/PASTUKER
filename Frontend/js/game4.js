/* ════════════════════════════════════════════════════════════════
   PASTUKER — Ahorcado Ancestral · Mundo 2 · Juego 2
   18 niveles · 3 dificultades · Rituales y Vestimenta Pasto
════════════════════════════════════════════════════════════════ */
'use strict';

/* ── Audio ── */
let _musica = null;
function _iniciarMusica() {
  if (_musica) return;
  _musica = new Audio('../audio/music/maloca_loop.mp3');
  _musica.loop = true; _musica.volume = 0.35;
  _musica.play().catch(() => {});
}
function _detenerMusica() {
  if (_musica) { _musica.pause(); _musica.currentTime = 0; _musica = null; }
}
function _sfx(f) {
  const s = new Audio('../audio/sfx/' + f);
  s.volume = 0.7; s.play().catch(() => {});
}

/* ── Helper diálogos ── */
function _dlg(id, opciones) {
  if (typeof DialogoSistema !== 'undefined') {
    DialogoSistema.mostrar(id, opciones || {});
    return true;
  }
  return false;
}

/* ════════════════════════════════════════════════════════════════
   PERSONAJES  (frames 0-11 = guillotine1..12)
════════════════════════════════════════════════════════════════ */
const CHARS = {
  hombre: {
    base: '../images/game4/guillotine_men/',
    frames: ['guillotine1.png','guillotine2.png','guillotine3.png',
             'guillotine4.png','guillotine5.png','guillotine6.png',
             'guillotine7.png','guillotine8.png','guillotine9.png',
             'guillotine10.png','guillotine11.png','guillotine12.png']
  },
  mujer: {
    base: '../images/game4/guillotine_woman/',
    frames: ['guillotine2.1.png','guillotine2.2.png','guillotine2.3.png',
             'guillotine2.4.png','guillotine2.5.png','guillotine2.6.png',
             'guillotine2.7.png','guillotine2.8.png','guillotine2.9.png',
             'guillotine2.10.png','guillotine2.11.png','guillotine2.12.png']
  },
  oso: {
    base: '../images/game4/guillotine_bear/',
    frames: ['guillotina_3.1.png','guillotina_3.2.png','guillotina_3.3.png',
             'guillotina_3.4.png','guillotina_3.5.png','guillotina_3.6.png',
             'guillotina_3.7.png','guillotina_3.8.png','guillotina_3.9.png',
             'guillotina_3.10.png','guillotina_3.11.png','guillotina_3.12.png']
  }
};

/* ════════════════════════════════════════════════════════════════
   CONFIGURACIÓN DE DIFICULTAD
════════════════════════════════════════════════════════════════ */
const DIF = {
  F: { label:'⭐ Fácil',    maxIntentos:6, deathStart:7 },
  M: { label:'⭐⭐ Medio',   maxIntentos:4, deathStart:5 },
  D: { label:'⭐⭐⭐ Difícil', maxIntentos:2, deathStart:3 },
};

/* ════════════════════════════════════════════════════════════════
   18 NIVELES — 6 fácil · 6 medio · 6 difícil
════════════════════════════════════════════════════════════════ */
const NIVELES = [
  /* ── FÁCIL ─────────────────────────────── */
  { d:'F', frase:'INTI RAYMI',
    pista:'Fiesta del Sol del Pueblo Pasto celebrada el 21 de junio con renovación energética y agradecimiento al Padre Sol.',
    intro:'¡Bienvenido/a al Ahorcado Ancestral! Adivina la frase oculta usando las letras del teclado. Tienes 6 intentos.',
    mamaOk:  '¡Así es! El Inti Raymi es la Fiesta del Sol, uno de los rituales más sagrados del Pueblo Pasto.',
    mamaFail:'El Inti Raymi celebra el agradecimiento al Padre Sol cada 21 de junio. ¡Sigue aprendiendo!', xp:50 },

  { d:'F', frase:'KOLLA RAYMI',
    pista:'Fiesta que honra la fertilidad y el rol fundamental de la mujer en la continuidad cultural, celebrada el 21 de septiembre.',
    intro:'¡Segundo nivel! Piensa en la fiesta sagrada que honra a la mujer del Pueblo Pasto.',
    mamaOk:  '¡Excelente! El Koya Raymi honra a la mujer y la fertilidad. ¡La mujer es la fuerza de nuestra comunidad!',
    mamaFail:'El Koya Raymi, el 21 de septiembre, honra el rol fundamental de la mujer en el Pueblo Pasto.', xp:50 },

  { d:'F', frase:'FUEGO SAGRADO',
    pista:'Elemento central de los rituales del Pueblo Pasto que simboliza purificación, protección y unidad comunitaria.',
    intro:'¡Tercer nivel! Piensa en el elemento que los médicos tradicionales encienden en el ritual.',
    mamaOk:  '¡Correcto! El fuego sagrado purifica y une a la comunidad en cada ritual ancestral del Pueblo Pasto.',
    mamaFail:'El fuego sagrado simboliza purificación, protección y unidad en los rituales del Pueblo Pasto.', xp:50 },

  { d:'F', frase:'MANDALA',
    pista:'Figura sagrada armada con frutos, plantas y semillas del territorio que activa el espacio del ritual como primer paso.',
    intro:'¡Cuarto nivel! ¿Cuál es el primer elemento que se arma al inicio de cada ritual sagrado?',
    mamaOk:  '¡Perfecto! La mándala es el primer paso del ritual. Su armado convoca la energía ancestral.',
    mamaFail:'La mándala ritual se arma con elementos naturales del territorio como primer paso del ritual sagrado.', xp:50 },

  { d:'F', frase:'RUANA DE LANA',
    pista:'Prenda masculina tejida por las abuelas en lana de oveja que conserva el calor del territorio andino.',
    intro:'¡Quinto nivel! Piensa en la prenda más representativa que tejían las abuelas del Pueblo Pasto.',
    mamaOk:  '¡Muy bien! La ruana tejida por las abuelas lleva en sus hilos la memoria del Pueblo Pasto.',
    mamaFail:'La ruana de lana de oveja tejida por las abuelas representa la memoria ancestral del Pueblo Pasto.', xp:50 },

  { d:'F', frase:'CUNCHE DE COLORES',
    pista:'Prenda femenina tejida en lana de oveja con agujeta que combina muchos colores y aporta calor en el territorio andino.',
    intro:'¡Sexto nivel! ¿Cuál es la prenda femenina más colorida del traje tradicional del Pueblo Pasto?',
    mamaOk:  '¡Excelente! El cunche con sus muchos colores representa la diversidad y alegría del Pueblo Pasto.',
    mamaFail:'El cunche de colores es la prenda femenina tejida en lana de oveja con agujeta que aporta calor.', xp:50 },

  /* ── MEDIO ─────────────────────────────── */
  { d:'M', frase:'SAHUMERIO ANCESTRAL',
    pista:'Práctica ritual del Pueblo Pasto que consiste en quemar hierbas medicinales sagradas para armonizar el espacio sagrado.',
    intro:'¡Nivel Medio! Solo 4 intentos. El sahumerio usa el humo de plantas sagradas para crear armonía espiritual.',
    mamaOk:  '¡Así es! El sahumerio crea armonía entre cuerpo, mente y espíritu usando plantas sagradas como eucalipto y ruda.',
    mamaFail:'El sahumerio ancestral quema hierbas sagradas como eucalipto y ruda para armonizar el espacio ritual.', xp:70 },

  { d:'M', frase:'DANZA LA MOJIGANGA',
    pista:'Expresión cultural tradicional del Pueblo Pasto que fortalece la integración y alegría comunitaria en los rituales sagrados.',
    intro:'¡Octavo nivel! ¿Cómo se llama la danza tradicional del Pueblo Pasto que se realiza en los rituales?',
    mamaOk:  '¡Maravilloso! La Mojiganga une a la comunidad y expresa la alegría del Pueblo Pasto en cada celebración.',
    mamaFail:'La danza La Mojiganga es la expresión cultural de integración y alegría comunitaria del Pueblo Pasto.', xp:70 },

  { d:'M', frase:'SOMBRERO DE PAÑO',
    pista:'Artículo más distintivo del hombre Pasto, símbolo de identidad cultural y pertenencia al territorio ancestral nariñense.',
    intro:'¡Noveno nivel! ¿Cuál es la prenda más distintiva del hombre Pasto, símbolo de su identidad?',
    mamaOk:  '¡Correcto! El sombrero de paño es lo más distintivo del hombre Pasto, símbolo de identidad y pertenencia.',
    mamaFail:'El sombrero de paño es el artículo más distintivo del hombre Pasto y símbolo de identidad cultural.', xp:70 },

  { d:'M', frase:'CHALINA DE OVEJA',
    pista:'Prenda femenina en lana de oveja que sirve para cubrirse del frío, cargar los guaguas y productos de la chagra.',
    intro:'¡Décimo nivel! ¿Cuál es la prenda más versátil de la mujer Pasto en su vida cotidiana?',
    mamaOk:  '¡Perfecto! La chalina es la compañera fiel de la mujer Pasto: para el frío, los guaguas y la chagra.',
    mamaFail:'La chalina de oveja sirve para el frío, cargar guaguas y productos de la chagra de la mujer Pasto.', xp:70 },

  { d:'M', frase:'FOLLON DE GABARDINA',
    pista:'Prenda exterior más visible del traje tradicional de la mujer Pasto, fabricada en gabardina, que va sobre el cunche.',
    intro:'¡Nivel once! ¿Cuál es la prenda exterior más elegante y visible del traje femenino Pasto?',
    mamaOk:  '¡Muy bien! El follón de gabardina es la prenda más visible y elegante del traje femenino Pasto.',
    mamaFail:'El follón de gabardina es la prenda exterior más visible del traje tradicional de la mujer Pasto.', xp:70 },

  { d:'M', frase:'ALPARGATAS DE CABUYA',
    pista:'Calzado tradicional tejido en cabuya que llegó al Pueblo Pasto mediante intercambios con comerciantes de Ecuador.',
    intro:'¡Doceavo nivel! ¿Cómo se llama el calzado tradicional obtenido mediante intercambios con Ecuador?',
    mamaOk:  '¡Excelente! Las alpargatas de cabuya representan las redes históricas de intercambio del Pueblo Pasto.',
    mamaFail:'Las alpargatas de cabuya llegaron mediante intercambios con comerciantes de Ecuador al Pueblo Pasto.', xp:70 },

  /* ── DIFÍCIL ────────────────────────────── */
  { d:'D', frase:'ESENCIA SOPLO SAHUMERIO',
    pista:'Los tres elementos sagrados que comparten los médicos tradicionales durante la armonización en el ritual del Pueblo Pasto.',
    intro:'¡MODO DIFÍCIL! Solo 2 intentos. ¿Cuáles son los tres elementos de la armonización ritual?',
    mamaOk:  '¡INCREÍBLE! Conoces los tres elementos sagrados de la armonización: esencia, soplo y sahumerio.',
    mamaFail:'La esencia, el soplo y el sahumerio son los tres elementos que comparten los médicos en la armonización.', xp:100 },

  { d:'D', frase:'RESGUARDO DE FUNES',
    pista:'Territorio ancestral del Pueblo Pasto en Nariño, Colombia, donde se ubica la parcialidad de Chapal que inspiró a Pastuker.',
    intro:'¡Nivel 14! ¿Cómo se llama el territorio ancestral donde vive el Pueblo Pasto que inspiró este juego?',
    mamaOk:  '¡Extraordinario! El Resguardo de Funes es el hogar sagrado del Pueblo Pasto y la parcialidad de Chapal.',
    mamaFail:'El Resguardo de Funes, en Nariño, es el territorio ancestral donde vive la parcialidad de Chapal.', xp:100 },

  { d:'D', frase:'MEDICINA TRADICIONAL',
    pista:'Sistema de saberes ancestrales sobre plantas medicinales transmitido de generación en generación por los Taitas del Resguardo.',
    intro:'¡Nivel 15! ¿Cómo se llama el sistema de conocimiento sobre plantas medicinales del Pueblo Pasto?',
    mamaOk:  '¡Eres un guardián del saber! La medicina tradicional Pasto es un legado de siglos de los Taitas.',
    mamaFail:'La medicina tradicional es el sistema de saberes sobre plantas medicinales transmitido por los Taitas Pasto.', xp:100 },

  { d:'D', frase:'PARCIALIDAD DE CHAPAL',
    pista:'Comunidad indígena del Pueblo Pasto ubicada dentro del Resguardo Indígena de Funes, en Nariño, Colombia.',
    intro:'¡Nivel 16! ¿Cómo se llama la comunidad del Pueblo Pasto que inspiró directamente la creación de Pastuker?',
    mamaOk:  '¡Maravilloso! La parcialidad de Chapal es el hogar de nuestra comunidad en el Resguardo de Funes, Nariño.',
    mamaFail:'La parcialidad de Chapal es la comunidad del Pueblo Pasto dentro del Resguardo Indígena de Funes.', xp:100 },

  { d:'D', frase:'PAGAMENTO MADRE TIERRA',
    pista:'Acto de gratitud y reciprocidad al finalizar el Inti Raymi donde se ofrendan elementos naturales a la Pacha Mama.',
    intro:'¡Nivel 17! ¿Cómo se llama el acto de gratitud al finalizar el ritual del Inti Raymi con la naturaleza?',
    mamaOk:  '¡GUARDIÁN ANCESTRAL! El pagamento a la Madre Tierra es el acto de gratitud y equilibrio con la naturaleza.',
    mamaFail:'El pagamento a la Madre Tierra es el acto de gratitud y reciprocidad al finalizar el ritual del Inti Raymi.', xp:100 },

  { d:'D', frase:'CHUMBE ANCESTRAL',
    pista:'Tejido en lana de oveja que envuelve la cintura femenina para proteger el vientre y lleva símbolos sagrados del Pueblo Pasto.',
    intro:'¡ÚLTIMO NIVEL! El más difícil. ¿Cómo se llama la prenda que protege el vientre de la mujer Pasto?',
    mamaOk:  '¡ERES UN VERDADERO GUARDIÁN! El chumbe ancestral protege el vientre con los símbolos sagrados del Pueblo Pasto.',
    mamaFail:'El chumbe ancestral tejido en lana de oveja protege el vientre femenino con símbolos sagrados del Pueblo Pasto.', xp:100 },
];

/* ════════════════════════════════════════════════════════════════
   ESTADO GLOBAL
════════════════════════════════════════════════════════════════ */
let nivelIdx         = 0;
let letrasAdivinadas = new Set();
let letrasErradas    = new Set();
let intentosLeft     = 0;
let maxIntentos      = 0;
let deathStart       = 0;
let charSet          = null;
let mamaInterval     = null;
let mamaFrame        = 1;
let score            = { correctos:0, xp:0 };
let nivelActivo      = false;

/* ════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click',    () => _iniciarMusica(), { once:true });
  document.addEventListener('touchend', () => _iniciarMusica(), { once:true });

  const genero = (localStorage.getItem('usuario_genero') || '').toLowerCase();
  charSet = genero === 'hombre' ? CHARS.hombre
          : genero === 'mujer'  ? CHARS.mujer
          : CHARS.oso;

  mamaInterval = setInterval(() => {
    mamaFrame = mamaFrame === 1 ? 2 : 1;
    const src = '../images/mama/mama_frame' + mamaFrame + '.png';
    const av  = document.getElementById('bubble-av');
    if (av) av.src = src;
  }, 650);

  document.addEventListener('keydown', e => {
    if (!nivelActivo) return;
    const l = e.key.toUpperCase();
    if (LETRAS_ES.includes(l)) procesarLetra(l);
  });

  iniciarNivel(0);
});

/* ════════════════════════════════════════════════════════════════
   NIVEL
════════════════════════════════════════════════════════════════ */
function iniciarNivel(idx) {
  nivelIdx         = idx;
  nivelActivo      = false;
  letrasAdivinadas = new Set();
  letrasErradas    = new Set();

  const nivel = NIVELES[idx];
  const cfg   = DIF[nivel.d];
  maxIntentos  = cfg.maxIntentos;
  deathStart   = cfg.deathStart;
  intentosLeft = maxIntentos;

  // Topbar
  const pct = Math.round((idx / NIVELES.length) * 100);
  document.getElementById('prog-bar-fill').style.width = pct + '%';
  document.getElementById('nav-info').innerHTML = `Nivel ${idx+1}/${NIVELES.length}<br>🎯 Ahorcado`;
  document.getElementById('nivel-num').textContent = 'Nivel ' + (idx + 1);
  document.getElementById('nivel-dif').textContent = cfg.label;
  document.getElementById('pista-txt').textContent = nivel.pista;
  document.getElementById('mama-text').textContent = nivel.intro;

  actualizarPersonaje(0); // frame 0 = guillotine1 (estado inicial)
  renderVidas();
  renderPalabra();
  renderWrongLetters();
  construirTeclado();

  // Intro overlay
  document.getElementById('intro-nivel-lbl').textContent = `Nivel ${idx+1} de ${NIVELES.length}`;
  document.getElementById('intro-titulo').textContent    =
    idx === 0 ? '¡Ahorcado Ancestral!' : (idx < 6 ? '⭐ Nivel Fácil' : idx < 12 ? '⭐⭐ Nivel Medio' : '⭐⭐⭐ Nivel Difícil');
  document.getElementById('intro-desc').textContent = nivel.pista;
  document.getElementById('intro-dif').textContent  = '🎯 Dificultad: ' + cfg.label + ' · ' + maxIntentos + ' intentos';
  document.getElementById('intro-ov').classList.add('on');

  /* ── Diálogo de bienvenida / dificultad ── */
  const idIntro = idx === 0 ? 'ahorcado_bienvenida'
    : nivel.d === 'F' ? 'ahorcado_nivel_facil'
    : nivel.d === 'M' ? 'ahorcado_nivel_medio'
    : 'ahorcado_nivel_dificil';
  _dlg(idIntro);
}

function cerrarIntro() {
  document.getElementById('intro-ov').classList.remove('on');
  nivelActivo = true;
}

/* ════════════════════════════════════════════════════════════════
   FRAMES
════════════════════════════════════════════════════════════════ */
function actualizarPersonaje(frameIdx) {
  const img = document.getElementById('char-img');
  img.src = charSet.base + charSet.frames[Math.min(frameIdx, 11)];
}

/* Animación de muerte: desde deathStart hasta frame 11, en orden */
function animarMuerte(callback) {
  let f = deathStart;
  actualizarPersonaje(f);
  const iv = setInterval(() => {
    f++;
    if (f > 11) { clearInterval(iv); if (callback) callback(); return; }
    actualizarPersonaje(f);
  }, 110);
}

/* ════════════════════════════════════════════════════════════════
   RENDER
════════════════════════════════════════════════════════════════ */
function renderVidas() {
  const wrap = document.getElementById('vidas-bubbles');
  wrap.innerHTML = '';
  for (let i = 0; i < maxIntentos; i++) {
    const b = document.createElement('div');
    b.className = 'vida-burbuja' + (i >= intentosLeft ? ' perdida' : '');
    wrap.appendChild(b);
  }
}

function renderPalabra() {
  const frase = NIVELES[nivelIdx].frase;
  const wrap  = document.getElementById('word-display');
  wrap.innerHTML = '';
  frase.split(' ').forEach((palabra, wi) => {
    if (wi > 0) {
      const g = document.createElement('div');
      g.className = 'espacio-gap'; wrap.appendChild(g);
    }
    [...palabra].forEach(letra => {
      const slot = document.createElement('div');
      slot.className = 'letra-slot';
      const ch = document.createElement('span');
      ch.className = 'letra-char';
      ch.textContent = letrasAdivinadas.has(normLet(letra)) ? letra : '';
      const ln = document.createElement('div');
      ln.className = 'letra-linea';
      slot.appendChild(ch); slot.appendChild(ln);
      wrap.appendChild(slot);
    });
  });
}

function renderWrongLetters() {
  const wrap = document.getElementById('wrong-letters');
  wrap.innerHTML = '';
  letrasErradas.forEach(l => {
    const sp = document.createElement('span');
    sp.className = 'wrong-letra'; sp.textContent = l;
    wrap.appendChild(sp);
  });
}

/* ════════════════════════════════════════════════════════════════
   TECLADO
════════════════════════════════════════════════════════════════ */
const LETRAS_ES = [
  'Q','W','E','R','T','Y','U','I','O','P',
  'A','S','D','F','G','H','J','K','L','Ñ',
  'Z','X','C','V','B','N','M'
];

function construirTeclado() {
  const teclado = document.getElementById('teclado');
  teclado.innerHTML = '';
  const filas = [LETRAS_ES.slice(0,10), LETRAS_ES.slice(10,20), LETRAS_ES.slice(20)];
  filas.forEach(fila => {
    const row = document.createElement('div');
    row.className = 'teclado-fila';
    fila.forEach(letra => {
      const btn = document.createElement('button');
      btn.className = 'tecla';
      btn.textContent = letra;
      btn.id = 'tecla-' + letra;
      btn.addEventListener('click', () => procesarLetra(letra));
      row.appendChild(btn);
    });
    teclado.appendChild(row);
  });
}

/* ════════════════════════════════════════════════════════════════
   LÓGICA DE JUEGO
════════════════════════════════════════════════════════════════ */
function normLet(l) {
  return l.toUpperCase()
    .replace('Á','A').replace('É','E').replace('Í','I')
    .replace('Ó','O').replace('Ú','U');
}

function procesarLetra(letra) {
  if (!nivelActivo) return;
  const letraN = normLet(letra);
  if (letrasAdivinadas.has(letraN) || letrasErradas.has(letraN)) return;

  const btn = document.getElementById('tecla-' + letra);
  const fraseN = normLet(NIVELES[nivelIdx].frase).replace(/ /g,'');

  if (fraseN.includes(letraN)) {
    letrasAdivinadas.add(letraN);
    if (btn) { btn.classList.add('acertada'); btn.disabled = true; }
    _sfx('correct_answer.wav');
    renderPalabra();
    verificarVictoria();
  } else {
    letrasErradas.add(letraN);
    intentosLeft--;
    if (btn) { btn.classList.add('fallada'); btn.disabled = true; }
    _sfx('wrong_answer.ogg');

    // Frame = fallos acumulados (0=inicial, 1=1fallo, etc.)
    const fallos = maxIntentos - intentosLeft;
    actualizarPersonaje(fallos);
    renderVidas();
    renderWrongLetters();

    // Shake
    const ci = document.getElementById('char-img');
    ci.classList.add('shake');
    setTimeout(() => ci.classList.remove('shake'), 400);

    if (intentosLeft === 1) {
      _dlg('ahorcado_ultimo_intento');
    }

    if (intentosLeft <= 0) {
      nivelActivo = false;
      setTimeout(() => animarMuerte(mostrarDerrota), 300);
    }
  }
}

function verificarVictoria() {
  const frase  = NIVELES[nivelIdx].frase;
  const fraseN = normLet(frase).replace(/ /g,'');
  const todas  = [...new Set([...fraseN])];
  if (todas.every(l => letrasAdivinadas.has(l))) {
    nivelActivo = false;
    score.correctos++;
    score.xp += NIVELES[nivelIdx].xp;
    setTimeout(mostrarVictoria, 500);
  }
}

/* ════════════════════════════════════════════════════════════════
   OVERLAYS
════════════════════════════════════════════════════════════════ */
function mostrarVictoria() {
  const nivel  = NIVELES[nivelIdx];
  const isLast = nivelIdx >= NIVELES.length - 1;
  document.getElementById('win-emo').textContent   = isLast ? '🏆' : '🎉';
  document.getElementById('win-title').textContent = isLast ? '¡Guardián Ancestral!' : '¡Correcto!';
  document.getElementById('win-palabra').textContent = nivel.frase;
  document.getElementById('win-xp').textContent    = '+' + nivel.xp + ' XP';
  document.getElementById('mama-text').textContent = nivel.mamaOk;
  document.getElementById('win-btn').textContent   = isLast ? '¡Ver resultados! 🏆' : 'Siguiente ▶';
  _dlg('ahorcado_victoria', { texto: nivel.mamaOk });
  document.getElementById('win-ov').classList.add('on');
}

function mostrarDerrota() {
  const nivel  = NIVELES[nivelIdx];
  const isLast = nivelIdx >= NIVELES.length - 1;
  document.getElementById('lose-char').src          = charSet.base + charSet.frames[11];
  document.getElementById('lose-title').textContent = '¡Lo sentimos!';
  document.getElementById('lose-desc').textContent  = 'La respuesta era:';
  document.getElementById('lose-resp').textContent  = nivel.frase;
  document.getElementById('mama-text').textContent  = nivel.mamaFail;
  document.getElementById('lose-skip').style.display = isLast ? 'none' : '';
  _dlg('ahorcado_derrota', { texto: nivel.mamaFail });
  document.getElementById('lose-ov').classList.add('on');
}

function siguienteNivel() {
  document.getElementById('win-ov').classList.remove('on');
  document.getElementById('lose-ov').classList.remove('on');
  if (nivelIdx >= NIVELES.length - 1) mostrarResultado();
  else iniciarNivel(nivelIdx + 1);
}

function reintentar() {
  document.getElementById('lose-ov').classList.remove('on');
  iniciarNivel(nivelIdx);
}

/* ════════════════════════════════════════════════════════════════
   RESULTADO FINAL
════════════════════════════════════════════════════════════════ */
function mostrarResultado() {
  const resOv = document.getElementById('result-ov');
  resOv.classList.add('on');
  const pct = score.correctos / NIVELES.length;
  let emo, tit, desc, idDialogo;
  if (pct >= 1)    { emo='🏆'; tit='¡Guardián Ancestral!'; desc='Dominaste los 18 niveles y conoces profundamente los rituales y la vestimenta del Pueblo Pasto. ¡Eres un sabedor!'; idDialogo='ahorcado_resultado_perfecto'; }
  else if(pct>=.8) { emo='🌿'; tit='¡Gran Sabedor!'; desc='Conoces muy bien los rituales y vestimenta del Pueblo Pasto. ¡Solo un poco más para dominarlos todos!'; idDialogo='ahorcado_resultado_bueno'; }
  else if(pct>=.5) { emo='🔥'; tit='Aprendiz Cultural'; desc='Vas por buen camino. La Mama Rosa te invita a seguir aprendiendo los saberes ancestrales del Pueblo Pasto.'; idDialogo='ahorcado_resultado_regular'; }
  else             { emo='🪔'; tit='¡Sigue Practicando!'; desc='El conocimiento ancestral requiere dedicación. ¡Regresa a la Maloca y sigue fortaleciendo tu identidad cultural!'; idDialogo='ahorcado_resultado_bajo'; }
  document.getElementById('res-emo').textContent     = emo;
  document.getElementById('res-tit').textContent     = tit;
  document.getElementById('res-desc').textContent    = desc;
  document.getElementById('res-niveles').textContent = score.correctos + '/' + NIVELES.length;
  document.getElementById('res-xp').textContent      = score.xp + ' XP';
  _dlg(idDialogo);
  localStorage.setItem('mundo2_juego2_completo', '1');
  const prev = parseInt(localStorage.getItem('puntos_total') || '0');
  localStorage.setItem('puntos_total', prev + score.xp);
}

function volverJuegos() {
  _detenerMusica();
  window.location.href = 'juegos.html';
}

/* ── toggleMute ── */
function toggleMute() {
  if (_musica) {
    _musica.muted = !_musica.muted;
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = _musica.muted ? '🔇' : '🔊';
  }
}