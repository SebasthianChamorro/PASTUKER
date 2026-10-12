'use strict';

let _musica = null;

function _iniciarMusica() {
  if (_musica) return;
  _musica = new Audio('../audio/music/maloca_loop.mp3');
  _musica.loop = true;
  _musica.volume = 0.4;
  _musica.play().catch(() => {});
}

function _detenerMusica() {
  if (_musica) {
    _musica.pause();
    _musica.currentTime = 0;
    _musica = null;
  }
}

function _sfx(f) {
  const s = new Audio('../audio/sfx/' + f);
  s.volume = 0.7;
  s.play().catch(() => {});
}

function toggleMute() {
  if (_musica) {
    _musica.muted = !_musica.muted;
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = _musica.muted ? '🔇' : '🔊';
  }
}

/* ── Helper diálogos ── */
function _dlg(id, opciones) {
  if (typeof DialogoSistema !== 'undefined') {
    DialogoSistema.mostrar(id, opciones || {});
    return true;
  }
  return false;
}

const OBJETIVOS = [
  { raw: 'MANDALA', label: 'MÁNDALA' },
  { raw: 'FUEGOSAGRADO', label: 'FUEGO SAGRADO' },
  { raw: 'COMUNIDAD', label: 'COMUNIDAD' },
  { raw: 'RESPETO', label: 'RESPETO' },
  { raw: 'ARMONIZACION', label: 'ARMONIZACIÓN' },
  { raw: 'RETORNO', label: 'RETORNO' },
  { raw: 'TULPA', label: 'TULPA' },
  { raw: 'SAHUMERIO', label: 'SAHUMERIO' }
];

const GRID = 12;
const LIMITE = 30;
const MAX_FALLOS = 3;
const LETRAS = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
const DIRS = [
  [1, 0], [-1, 0], [0, 1], [0, -1],
  [1, 1], [-1, -1], [1, -1], [-1, 1]
];

let mamaInterval = null;
let mamaFrame = 1;
let estado = null;
let timerIv = null;

let drag = {
  active: false,
  start: null,
  end: null,
  mode: null
};

window.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', () => _iniciarMusica(), { once: true });
  document.addEventListener('touchend', () => _iniciarMusica(), { once: true });

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('touchmove', onTouchMove, { passive: false });
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchcancel', onTouchCancel);
  document.addEventListener('dragstart', e => e.preventDefault());

  mamaInterval = setInterval(() => {
    mamaFrame = mamaFrame === 1 ? 2 : 1;
    const src = '../images/mama/mama_frame' + mamaFrame + '.png';
    const av = document.getElementById('bubble-av');
    if (av) av.src = src;
  }, 650);

  iniciarJuego();
});

function normalizarTexto(str) {
  return (str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '')
    .toUpperCase()
    .trim();
}

function iniciarJuego() {
  limpiarTimer();

  estado = {
    objetivos: OBJETIVOS.map(o => ({
      ...o,
      key: normalizarTexto(o.raw),
      found: false
    })),
    fallos: 0,
    xp: 0,
    tiempo: LIMITE,
    grid: null,
    foundSet: new Set(),
    playing: false
  };

  estado.grid = crearSopa();

  renderGrid();
  renderGoals();
  renderVidas();
  updateXP();
  updateProgress();
  updateTimer();
  setMama('Encuentra los saberes rituales en la sopa de letras. Cada palabra correcta renueva tus 30 segundos.');
  setCurrentGoal();
  setSelectionLabel('—');

  document.getElementById('intro-ov').classList.add('on');
  document.getElementById('hit-ov').classList.remove('on');
  document.getElementById('fail-ov').classList.remove('on');
  document.getElementById('done-ov').classList.remove('on');
}

function crearSopa() {
  const grid = Array.from({ length: GRID }, () => Array(GRID).fill(''));

  for (const obj of OBJETIVOS) {
    const palabra = normalizarTexto(obj.raw);
    let placed = false;

    for (let tries = 0; tries < 600 && !placed; tries++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const row = Math.floor(Math.random() * GRID);
      const col = Math.floor(Math.random() * GRID);

      const endR = row + dr * (palabra.length - 1);
      const endC = col + dc * (palabra.length - 1);

      if (endR < 0 || endR >= GRID || endC < 0 || endC >= GRID) continue;

      let ok = true;

      for (let i = 0; i < palabra.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        const current = grid[r][c];
        const nextChar = palabra[i];

        if (current && current !== nextChar) {
          ok = false;
          break;
        }
      }

      if (!ok) continue;

      for (let i = 0; i < palabra.length; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        grid[r][c] = palabra[i];
      }

      placed = true;
    }

    if (!placed) return crearSopa();
  }

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (!grid[r][c]) {
        grid[r][c] = LETRAS[Math.floor(Math.random() * LETRAS.length)];
      }
    }
  }

  return grid;
}

function renderGrid() {
  const wrap = document.getElementById('sopa-grid');
  wrap.innerHTML = '';
  wrap.style.gridTemplateColumns = `repeat(${GRID}, 1fr)`;

  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const cell = document.createElement('div');
      cell.className = 'sopa-cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.textContent = estado.grid[r][c];

      cell.addEventListener('mousedown', e => startMouseDrag(e, r, c));
      cell.addEventListener('touchstart', e => startTouchDrag(e, r, c), { passive: false });
      cell.addEventListener('dragstart', e => e.preventDefault());

      wrap.appendChild(cell);
    }
  }
}

function renderGoals() {
  const list = document.getElementById('goal-list');
  list.innerHTML = '';

  estado.objetivos.forEach(obj => {
    const item = document.createElement('div');
    item.className = 'goal-item' + (obj.found ? ' done' : '');
    if (!obj.found) item.classList.add('active');
    item.id = 'goal-' + obj.key;
    item.textContent = obj.label;
    list.appendChild(item);
  });
}

function renderVidas() {
  const wrap = document.getElementById('sopa-vidas-wrap');
  wrap.innerHTML = '';

  for (let i = 0; i < MAX_FALLOS; i++) {
    const vida = document.createElement('div');
    vida.className = 'sopa-vida' + (i < estado.fallos ? ' perdida' : '');
    wrap.appendChild(vida);
  }
}

function updateXP() {
  document.getElementById('xp-now').textContent = estado.xp + ' XP';
}

function updateProgress() {
  const done = estado.objetivos.filter(o => o.found).length;
  document.getElementById('prog-bar-fill').style.width = Math.round((done / estado.objetivos.length) * 100) + '%';
  document.getElementById('nav-progress').innerHTML = `${done}/${estado.objetivos.length}<br>🔎 Sopa`;
}

function setCurrentGoal() {
  const faltan = estado.objetivos.filter(o => !o.found).map(o => o.label);
  document.getElementById('sopa-current').textContent = faltan.length
    ? 'Busca: ' + faltan.join(' · ')
    : '¡Todo encontrado!';
}

function setSelectionLabel(texto) {
  document.getElementById('sel-word').textContent = texto;
}

function setMama(texto) {
  document.getElementById('mama-text').textContent = texto;
}

function cerrarIntro() {
  document.getElementById('intro-ov').classList.remove('on');
  if (!_dlg('sopa_bienvenida', { onCerrar: () => { estado.playing = true; reiniciarTimer(); } })) {
    estado.playing = true;
    reiniciarTimer();
  }
}

function cerrarHit() {
  document.getElementById('hit-ov').classList.remove('on');

  if (estado.objetivos.every(o => o.found)) {
    mostrarFinal();
    return;
  }

  estado.playing = true;
  reiniciarTimer();
  setMama('Muy bien. Sigue buscando los saberes que faltan.');
}

function startMouseDrag(e, r, c) {
  if (!estado.playing) return;
  e.preventDefault();
  drag.active = true;
  drag.mode = 'mouse';
  drag.start = { r, c };
  drag.end = { r, c };
  paintSelection();
}

function startTouchDrag(e, r, c) {
  if (!estado.playing) return;
  e.preventDefault();
  drag.active = true;
  drag.mode = 'touch';
  drag.start = { r, c };
  drag.end = { r, c };
  paintSelection();
}

function onMouseMove(e) {
  if (!drag.active || drag.mode !== 'mouse' || !estado.playing) return;
  const cell = getCellFromPoint(e.clientX, e.clientY);
  if (!cell) return;
  moveDrag(+cell.dataset.row, +cell.dataset.col);
}

function onMouseUp() {
  if (!drag.active || drag.mode !== 'mouse' || !estado.playing) return;
  endDrag();
}

function onTouchMove(e) {
  if (!drag.active || drag.mode !== 'touch' || !estado.playing) return;
  e.preventDefault();
  const touch = e.touches[0];
  if (!touch) return;
  const cell = getCellFromPoint(touch.clientX, touch.clientY);
  if (!cell) return;
  moveDrag(+cell.dataset.row, +cell.dataset.col);
}

function onTouchEnd() {
  if (!drag.active || drag.mode !== 'touch' || !estado.playing) return;
  endDrag();
}

function onTouchCancel() {
  if (!drag.active) return;
  cancelDrag();
}

function getCellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  return el.classList && el.classList.contains('sopa-cell') ? el : null;
}

function moveDrag(r, c) {
  if (!drag.active || !estado.playing) return;
  drag.end = ajustarLinea(drag.start, { r, c });
  paintSelection();
}

function endDrag() {
  if (!drag.active || !estado.playing || !drag.start || !drag.end) return;

  const cells = getLineCells(drag.start, drag.end);
  const text = cells.map(k => {
    const [r, c] = k.split('-').map(Number);
    return estado.grid[r][c];
  }).join('');

  const normal = normalizarTexto(text);
  const reverse = [...normal].reverse().join('');

  setSelectionLabel(normal || '—');

  const hit = estado.objetivos.find(obj =>
    !obj.found && (obj.key === normal || obj.key === reverse)
  );

  if (hit) {
    marcarCells(cells, 'ok');
    hit.found = true;
    estado.foundSet.add(hit.key);

    estado.xp += 10;
    updateXP();
    updateProgress();
    renderGoals();
    setCurrentGoal();

    _sfx('correct_answer.wav');
    estado.playing = false;
    limpiarTimer();

    document.getElementById('hit-title').textContent = '¡Correcto!';
    document.getElementById('hit-desc').textContent = `Encontraste: ${hit.label} · +10 XP`;

    setMama(`Has encontrado ${hit.label}. El tiempo se renovará para la siguiente búsqueda.`);
    _dlg('sopa_acierto');
    document.getElementById('hit-ov').classList.add('on');
  } else {
    marcarCells(cells, 'bad');
    _sfx('wrong_answer.ogg');
    registrarFallo('Esa selección no corresponde a un saber pendiente.', 'sopa_fallo_seleccion');
  }

  cancelDrag();
}

function cancelDrag() {
  drag.active = false;
  drag.start = null;
  drag.end = null;
  drag.mode = null;
  clearTempSelection();
}

function ajustarLinea(a, b) {
  const dr = b.r - a.r;
  const dc = b.c - a.c;

  if (dr === 0) return { r: a.r, c: b.c };
  if (dc === 0) return { r: b.r, c: a.c };

  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  const len = Math.min(Math.abs(dr), Math.abs(dc));

  return {
    r: a.r + sr * len,
    c: a.c + sc * len
  };
}

function getLineCells(a, b) {
  const out = [];
  if (!a || !b) return out;

  const dr = Math.sign(b.r - a.r);
  const dc = Math.sign(b.c - a.c);
  const len = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c));

  for (let i = 0; i <= len; i++) {
    out.push(`${a.r + dr * i}-${a.c + dc * i}`);
  }

  return out;
}

function paintSelection() {
  clearTempSelection();

  const cells = getLineCells(drag.start, drag.end);
  const txt = cells.map(k => {
    const [r, c] = k.split('-').map(Number);
    return estado.grid[r][c];
  }).join('');

  setSelectionLabel(normalizarTexto(txt) || '—');

  cells.forEach(k => {
    const el = cellEl(k);
    if (el && !el.classList.contains('ok')) {
      el.classList.add('sel');
    }
  });
}

function clearTempSelection() {
  document.querySelectorAll('.sopa-cell.sel, .sopa-cell.bad').forEach(el => {
    el.classList.remove('sel', 'bad');
  });
}

function marcarCells(cells, cls) {
  cells.forEach(k => {
    const el = cellEl(k);
    if (el) {
      el.classList.remove('sel', 'bad');
      el.classList.add(cls);
    }
  });

  if (cls === 'bad') {
    setTimeout(() => {
      cells.forEach(k => {
        const el = cellEl(k);
        if (el) el.classList.remove('bad');
      });
    }, 340);
  }
}

function cellEl(k) {
  const [r, c] = k.split('-');
  return document.querySelector(`.sopa-cell[data-row="${r}"][data-col="${c}"]`);
}

function reiniciarTimer() {
  limpiarTimer();
  estado.tiempo = LIMITE;
  updateTimer();

  timerIv = setInterval(() => {
    estado.tiempo--;
    updateTimer();

    if (estado.tiempo <= 0) {
      limpiarTimer();
      registrarFallo('Se agotó el tiempo para encontrar un saber ritual.', 'sopa_fallo_tiempo');
    }
  }, 1000);
}

function limpiarTimer() {
  if (timerIv) {
    clearInterval(timerIv);
    timerIv = null;
  }
}

function updateTimer() {
  document.getElementById('sopa-timer').textContent = `⏳ ${estado.tiempo}s`;
}

function registrarFallo(msg, dialogoId) {
  estado.playing = false;
  estado.fallos++;
  renderVidas();

  setMama(msg + ' Te quedan ' + Math.max(0, MAX_FALLOS - estado.fallos) + ' intento(s).');

  if (estado.fallos >= MAX_FALLOS) {
    if (!_dlg('sopa_sin_intentos', { onCerrar: () => document.getElementById('fail-ov').classList.add('on') })) {
      document.getElementById('fail-ov').classList.add('on');
    }
  } else {
    _dlg(dialogoId || 'sopa_fallo_seleccion');
    setTimeout(() => {
      estado.playing = true;
      setSelectionLabel('—');
      reiniciarTimer();
    }, 420);
  }
}

function reiniciarTrasDerrota() {
  document.getElementById('fail-ov').classList.remove('on');
  iniciarJuego();
}

function reiniciarJuegoManual() {
  iniciarJuego();
}

function mostrarFinal() {
  limpiarTimer();
  setMama('Has encontrado todos los saberes del ritual. Estás listo/a para el siguiente desafío.');
  _dlg('sopa_completado');
  document.getElementById('done-ov').classList.add('on');

  try {
    localStorage.setItem('mundo2_game32_completo', '1');
    const prev = parseInt(localStorage.getItem('puntos_total') || '0', 10);
    localStorage.setItem('puntos_total', String(prev + estado.xp));
  } catch (_) {}
}

function irAGame4() {
  _detenerMusica();
  window.location.href = 'game4.html';
}