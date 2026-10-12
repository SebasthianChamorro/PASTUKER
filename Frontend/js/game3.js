/* ════════════════════════════════════════════════════════════════
   PASTUKER — La Maloca · Mundo 2 · Juego 1
   Visual Novel + Rompecabezas de Rituales
════════════════════════════════════════════════════════════════ */
'use strict';

/* ── Audio ── */
let _musicaMaloca = null;
function _iniciarMusica() {
  if (_musicaMaloca) return;
  _musicaMaloca = new Audio('../audio/music/maloca_loop.mp3');
  _musicaMaloca.loop = true; _musicaMaloca.volume = 0.4;
  _musicaMaloca.play().catch(() => {});
}
function _detenerMusica() {
  if (_musicaMaloca) {
    _musicaMaloca.pause(); _musicaMaloca.currentTime = 0; _musicaMaloca = null;
  }
}
function _sfx3(archivo) {
  const s = new Audio('../audio/sfx/' + archivo);
  s.volume = 0.7; s.play().catch(() => {});
}

/* ── toggleMute ── */
function toggleMute() {
  if (_musicaMaloca) {
    _musicaMaloca.muted = !_musicaMaloca.muted;
    const btn = document.getElementById('btn-mute');
    if (btn) btn.textContent = _musicaMaloca.muted ? '🔇' : '🔊';
  }
}

/* ── Frames spinning ── */
const SPIN_H = [
  '../images/game3/characters-spinning/character_men/character_front.png',
  '../images/game3/characters-spinning/character_men/character_right.png',
  '../images/game3/characters-spinning/character_men/character_back.png',
  '../images/game3/characters-spinning/character_men/character_left.png',
];
const SPIN_M = [
  '../images/game3/characters-spinning/character_woman/character_front2.png',
  '../images/game3/characters-spinning/character_woman/character_right2.png',
  '../images/game3/characters-spinning/character_woman/character_back.png',
  '../images/game3/characters-spinning/character_woman/character_left2.png',
];

const MANDALA_REAL = '../images/game3/real_images/mandala_real.jpg';
const MANDALA_PIX  = '../images/game3/sprites/mandala.png';

/* ════════════════════════════════════════════════════════════════
   CATÁLOGOS VESTIMENTA
════════════════════════════════════════════════════════════════ */
const CAT_H = [
  {
    id:'sombrero_h', nombre:'Sombrero de Paño', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/sombrero.png',
    realImg:'../images/game3/real_images/men_imagen/sombrero_real.png',
    badge:'👒 Identidad',
    desc:'Hecho en paño, el sombrero es el artículo más distintivo del hombre Pasto. Es símbolo de identidad y pertenencia al territorio ancestral.',
    mamaText:'Este es el sombrero de paño, hijo. Es lo más distintivo del hombre de nuestra comunidad. Está hecho en paño y representa nuestra identidad como Pueblo Pasto. Cuando ves a alguien con este sombrero, sabes que es uno de los nuestros.',
  },
  {
    id:'ruana_h', nombre:'Ruana', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/ruana.png',
    realImg:'../images/game3/real_images/men_imagen/ruana_real.jpg',
    badge:'🧶 Memoria ancestral',
    desc:'Tejida en lana de oveja por las abuelas, la ruana lleva consigo la historia y la memoria del Pueblo Pasto. Conserva el calor del territorio andino.',
    mamaText:'La ruana, hijo, es una prenda llena de historia. Nuestras abuelas la tejían en lana de oveja con mucho amor y dedicación. Cada ruana lleva en sus hilos la memoria de nuestra comunidad.',
  },
  {
    id:'pantalon_h', nombre:'Pantalón', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/pantalon.png',
    realImg:'../images/game3/real_images/men_imagen/pantalon_real.jpg',
    badge:'👖 Diario vivir',
    desc:'Prenda del diario vivir dentro de las comunidades indígenas Pasto. Fabricada en tela de terleca, acompaña al comunero en todas sus actividades cotidianas.',
    mamaText:'El pantalón es la prenda del diario vivir, hijo. Nuestros comuneros lo usan todos los días, fabricado en tela de terleca.',
  },
  {
    id:'camisa_h', nombre:'Camisa', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/camisa.png',
    realImg:'../images/game3/real_images/men_imagen/camisa_real.jpg',
    badge:'👕 Intercambio',
    desc:'Nuestros antepasados la usaban bajo la ruana. Llegó a nuestra comunidad a través de intercambios y trueques con comerciantes de otros territorios, incluyendo Ecuador.',
    mamaText:'La camisa, hijo, nos recuerda que nuestro pueblo siempre tuvo intercambios con otras culturas. Se usa debajo de la ruana para abrigarse mejor.',
  },
  {
    id:'alpargatas_h', nombre:'Alpargatas', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/alpargatas_men.png',
    realImg:'../images/game3/real_images/men_imagen/alpargatas_real.jpg',
    badge:'👡 Cabuya',
    desc:'Calzado tradicional tejido en cabuya que llegó a nuestra comunidad a través de intercambios con comerciantes de Ecuador.',
    mamaText:'Las alpargatas son nuestro calzado tradicional, hijo. Están tejidas en cabuya y llegaron por los intercambios con Ecuador.',
  },
  {
    id:'chumbe_h', nombre:'Chumbe', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/chumbe_men.png',
    realImg:'../images/game3/real_images/men_imagen/chumbe_hombre_real.jpg',
    badge:'🎀 Tejido identitario',
    desc:'Tejido en lana de oveja, el chumbe se envuelve en la cintura sustituyendo la correa. Sus diseños representan el territorio.',
    mamaText:'El chumbe es una prenda muy especial, hijo. Está tejido en lana de oveja y se envuelve en la cintura. Sus diseños cuentan la historia de nuestro territorio.',
  },
  {
    id:'puro_h', nombre:'Puro', subtitulo:'Vestimenta · Hombre',
    pixelImg:'../images/game3/clothing/clothing_men/puro.png',
    realImg:'../images/game3/real_images/men_imagen/puro_real.jpg',
    badge:'🪔 Hospitalidad',
    desc:'Artículo tradicional donde se cargaba la chicha, la bebida ancestral. Representa la cultura del compartir y la hospitalidad.',
    mamaText:'El puro, hijo, es donde nuestros hombres cargaban la chicha, nuestra bebida sagrada. Representa el valor del compartir en cada minga y ritual.',
  },
];

const CAT_M = [
  {
    id:'chalina_m', nombre:'Chalina', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/chalina.png',
    realImg:'../images/game3/real_images/woman_imagen/chalina_real.jpg',
    badge:'🧣 Lana de oveja',
    desc:'Prenda fabricada en lana de oveja para cubrirse del frío, cargar los guaguas o productos de la chagra. Símbolo de la mujer Pasto.',
    mamaText:'La chalina, hija, es versátil: nos sirve para el frío, para cargar los guaguas y para llevar los productos de la chagra.',
  },
  {
    id:'alpargatas_m', nombre:'Alpargatas', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/alapargatas_woman.png',
    realImg:'../images/game3/real_images/woman_imagen/alpargatas_real2.jpg',
    badge:'👡 Cabuya',
    desc:'Calzado ancestral tejido en cabuya, adoptado como parte de la identidad femenina a través de intercambios con Ecuador.',
    mamaText:'Las alpargatas de la mujer también están tejidas en cabuya. Caminaron junto a nuestras abuelas por todos los caminos del territorio.',
  },
  {
    id:'camisola_m', nombre:'Camisola', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/camisola.png',
    realImg:'../images/game3/real_images/woman_imagen/camisola_real.jpg',
    badge:'👚 Algodón',
    desc:'Prenda interior fabricada en algodón que va debajo del cunche. Es la base del traje tradicional de la mujer Pasto.',
    mamaText:'La camisola es la base de todo el vestido de la mujer Pasto. Fabricada en algodón suave, va debajo del cunche.',
  },
  {
    id:'chumbe_m', nombre:'Chumbe', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/chumbe_woman.png',
    realImg:'../images/game3/real_images/woman_imagen/chumbe_mujer_real.jpg',
    badge:'🎀 Protección del vientre',
    desc:'Tejido en lana de oveja, se envuelve en la cintura para proteger el vientre. Tiene símbolos ancestrales del Pueblo Pasto.',
    mamaText:'El chumbe femenino protege el vientre, donde se genera la vida. Sus diseños llevan los símbolos sagrados de nuestro pueblo.',
  },
  {
    id:'cunche_m', nombre:'Cunche', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/cunche.png',
    realImg:'../images/game3/real_images/woman_imagen/cunche_real.jpg',
    badge:'🌈 Muchos colores',
    desc:'Prenda tejida en lana de oveja con agujeta que combina muchos colores. Representa la diversidad y alegría del Pueblo Pasto.',
    mamaText:'El cunche te llena de alegría solo con verlo. Sus muchos colores representan la diversidad de nuestro territorio.',
  },
  {
    id:'follon_m', nombre:'Follón', subtitulo:'Vestimenta · Mujer',
    pixelImg:'../images/game3/clothing/clothing_woman/follon.png',
    realImg:'../images/game3/real_images/woman_imagen/follon_real.jpg',
    badge:'👗 Gabardina',
    desc:'La prenda exterior sobre el cunche. Fabricada en gabardina, el follón es la más visible del traje femenino y refleja elegancia.',
    mamaText:'El follón corona todo el vestido de la mujer Pasto. Fabricado en gabardina, es lo primero que todos ven. ¡Con él llevas nuestra historia!',
  },
];

/* ════════════════════════════════════════════════════════════════
   ROMPECABEZAS — 7 puzzles sobre pasos del ritual
   d: 'F'=Fácil(3 vidas) | 'M'=Medio(2 vidas) | 'D'=Difícil(1 vida)
════════════════════════════════════════════════════════════════ */
const PUZ_DIF = {
  F: { label:'⭐ Fácil',     maxVidas: 3 },
  M: { label:'⭐⭐ Medio',    maxVidas: 2 },
  D: { label:'⭐⭐⭐ Difícil',  maxVidas: 1 },
};

const PUZZLES = [
  {
    id:'p1a', d:'F', paso:1, grid:2,
    img:'../images/game3/puzzles/step1.png',
    badge:'🌀 La Mándala', dificultad:'⭐ Fácil (2×2)',
    introTitle:'Paso 1: Se arma la Mándala (parte 1)',
    introDesc:'El primer paso del ritual sagrado es armar la mándala según el tiempo y la fiesta que se celebre. Es el mapa sagrado que activa el espacio ritual.',
    introMama:'Hijo/a, el primer paso es armar nuestra sagrada mándala. Cada elemento natural tiene su lugar: los frutos, las plantas del territorio. ¡Tienes 3 intentos!',
    mamaText:'Arrastra cada pieza a su lugar en el tablero. ¡Tienes 3 intentos!',
    doneMama:'¡Muy bien! Así se arma la primera parte de nuestra mándala. ¡Sigamos!',
  },
  {
    id:'p1b', d:'F', paso:1, grid:2,
    img:'../images/game3/puzzles/step1.1.png',
    badge:'🌀 Mándala completa', dificultad:'⭐ Fácil (2×2)',
    introTitle:'Paso 1: La Mándala terminada',
    introDesc:'La mándala debe quedar perfectamente armada para activar la energía del ritual. Cada elemento en su lugar convoca la presencia de los ancestros.',
    introMama:'¡Excelente! Ahora veamos la mándala completamente terminada. Cada círculo y color tiene un significado profundo. ¡3 intentos!',
    mamaText:'La mándala completa es el corazón del ritual. ¡Coloca cada pieza!',
    doneMama:'¡Hermoso! La mándala está lista. Ahora el segundo paso del ritual.',
  },
  {
    id:'p2', d:'F', paso:2, grid:3,
    img:'../images/game3/puzzles/step2.png',
    badge:'🔥 El Fuego Sagrado', dificultad:'⭐ Fácil (3×3)',
    introTitle:'Paso 2: Los médicos encienden el fuego',
    introDesc:'Los médicos tradicionales encienden el fuego sagrado o la tulpa y armonizan el lugar. El fuego simboliza purificación, protección y unidad.',
    introMama:'Después de la mándala, los médicos encienden el fuego sagrado. La tulpa purifica el espacio y convoca los ancestros. ¡9 piezas, 3 intentos!',
    mamaText:'El fuego sagrado guía nuestro camino. ¡Complétalo!',
    doneMama:'¡Así es! El fuego sagrado está encendido. La comunidad puede acercarse.',
  },
  {
    id:'p3', d:'F', paso:3, grid:3,
    img:'../images/game3/puzzles/step3.png',
    badge:'👥 La Comunidad', dificultad:'⭐ Fácil (3×3)',
    introTitle:'Paso 3: La comunidad se reúne',
    introDesc:'Se convoca a toda la comunidad a acercarse y ubicarse alrededor de la mándala. El ritual es un acto colectivo donde todos son parte de la energía sagrada.',
    introMama:'Se convoca a todos a reunirse alrededor de la mándala. Juntos como una sola familia del Pueblo Pasto. ¡9 piezas, 3 intentos!',
    mamaText:'La fuerza está en la unidad. ¡Reúne las piezas!',
    doneMama:'¡Perfecto! Toda la comunidad está reunida. Ahora el cuarto paso.',
  },
  {
    id:'p4', d:'M', paso:4, grid:4,
    img:'../images/game3/puzzles/step4.png',
    badge:'🙏 El Respeto', dificultad:'⭐⭐ Medio (4×4)',
    introTitle:'Paso 4: Descubrir la cabeza y apagar dispositivos',
    introDesc:'Todas las personas deben descubrirse la cabeza — sin gorros ni sombreros — y apagar los dispositivos electrónicos. Solo se permite grabar si las autoridades lo autorizan.',
    introMama:'Este paso es de mucho respeto. Debes descubrirte la cabeza y apagar tu celular. ¡Ahora 16 piezas y solo 2 intentos!',
    mamaText:'El respeto es la base de nuestra cultura. ¡Concentra tu atención!',
    doneMama:'¡Excelente respeto! Todos están descubiertos y en silencio. Viene el paso más sagrado.',
  },
  {
    id:'p5', d:'M', paso:5, grid:4,
    img:'../images/game3/puzzles/step5.png',
    badge:'🌿 La Armonización', dificultad:'⭐⭐ Medio (4×4)',
    introTitle:'Paso 5: Los médicos realizan la armonización',
    introDesc:'Los médicos realizan la armonización compartiendo esencia, soplo y sahumerio. El sahumerio quema hierbas sagradas para crear armonía entre cuerpo, mente y espíritu.',
    introMama:'Ahora el momento más sagrado. Los médicos comparten la esencia, el soplo y el sahumerio. ¡16 piezas y solo 2 intentos!',
    mamaText:'La armonización nos conecta con los ancestros. ¡Pon toda tu energía!',
    doneMama:'¡Maravilloso! La armonización ha terminado. Solo queda el último paso.',
  },
  {
    id:'p6', d:'D', paso:6, grid:4,
    img:'../images/game3/puzzles/step6.png',
    badge:'🏡 El Retorno', dificultad:'⭐⭐⭐ Difícil (4×4)',
    introTitle:'Paso 6: La comunidad retorna a su lugar',
    introDesc:'Después de recibir la armonización, la comunidad retorna a su lugar con respeto y recogimiento. La energía sagrada permanece en el territorio y en cada participante.',
    introMama:'El último paso, hijo/a. Con el corazón lleno de gratitud la comunidad regresa a su lugar. ¡El más difícil: 16 piezas y solo 1 intento!',
    mamaText:'¡Solo un intento! Lleva la energía del ritual en cada pieza. ¡Con cuidado!',
    doneMama:'¡LO LOGRASTE! Ahora conoces los seis pasos del ritual sagrado del Pueblo Pasto.',
  },
];

/* ════════════════════════════════════════════════════════════════
   ESTADO GLOBAL — VISUAL NOVEL
════════════════════════════════════════════════════════════════ */
let SEC = [];
let secIdx = 0;
let spinInterval = null;
let mamaInterval = null;
let mamaFrame = 1;

/* ════════════════════════════════════════════════════════════════
   ESTADO GLOBAL — PUZZLE
════════════════════════════════════════════════════════════════ */
let puzIdx       = 0;
let puzPhase     = 'intro'; // 'intro' | 'playing' | 'done' | 'fail'
let puzPlaced    = 0;
let puzTotal     = 0;
let puzBoardSize = 0;
let puzVidas     = 0;
let puzMaxVidas  = 0;
let puzScore     = { completed: 0, total: PUZZLES.length, xp: 0 };
const puzDrag    = { active: false, piece: null, ghost: null, size: 0 };

/* ── Helper diálogos ── */
function _dlg(id, opciones) {
  if (typeof DialogoSistema !== 'undefined') {
    DialogoSistema.mostrar(id, opciones || {});
    return true;
  }
  return false;
}

/* ════════════════════════════════════════════════════════════════
   SECUENCIA
════════════════════════════════════════════════════════════════ */
function buildSecuencia() {
  return [
    {
      type:'info', titulo:'¡Bienvenido/a a la Maloca!', subtitulo:'Saberes del Pueblo Pasto',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'🏡 La Maloca', spinGender:'h',
      desc:'La Maloca es el espacio sagrado donde los rituales, la vestimenta y el conocimiento ancestral del Pueblo Pasto se preservan y transmiten de generación en generación.',
      mamaText:'¡Bienvenido/a, joven! Soy Mama Rosa, sabedora ancestral del Pueblo Pasto del Resguardo de Chapal, Funes, Nariño. Hoy te compartiré el conocimiento sagrado de nuestros rituales y nuestra vestimenta ancestral. ¡Presta mucha atención!',
    },
    {
      type:'info', titulo:'Inti Raymi · Fiesta del Sol', subtitulo:'21 de junio',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'☀️ Renovación', spinGender:'h',
      desc:'Ritual de renovación energética y agradecimiento al Padre Sol. Se celebra el 21 de junio en la Casa Mayor del Cabildo con participación de toda la comunidad y médicos ancestrales.',
      mamaText:'El Inti Raymi es la Fiesta del Sol que celebramos cada 21 de junio. Es un momento de renovación energética y de agradecer al Padre Sol por la vida. Los médicos ancestrales guían el ritual con respeto y devoción.',
    },
    {
      type:'info', titulo:'Pasos del Ritual Sagrado', subtitulo:'Mándala · Fuego · Armonización',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'🔥 Pasos rituales', spinGender:'h',
      desc:'1. Se arma la mándala. 2. Los médicos encienden el fuego sagrado. 3. La comunidad se ubica alrededor. 4. Todos descubren la cabeza y apagan los dispositivos. 5. Los médicos comparten esencia, soplo y sahumerio. 6. Se retorna al lugar.',
      mamaText:'Los pasos del ritual son sagrados. Primero se arma la mándala. Luego los médicos encienden el fuego. La comunidad se reúne alrededor. Todos deben descubrir la cabeza y apagar los dispositivos electrónicos como señal de respeto.',
    },
    {
      type:'info', titulo:'Koya Raymi · Fiesta de la Mujer', subtitulo:'21 de septiembre',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'🌸 Fertilidad', spinGender:'m',
      desc:'Celebrado el 21 de septiembre, honra la fertilidad y el rol fundamental de la mujer en la continuidad cultural. Resalta el valor de la mujer en la visión andina de complementariedad.',
      mamaText:'El Koya Raymi, hija, es nuestra fiesta. Se celebra el 21 de septiembre y honra la fertilidad y el papel fundamental de la mujer. En nuestra cosmovisión andina, la mujer y el hombre son complementarios, como el sol y la luna.',
    },
    {
      type:'info', titulo:'Elementos Sagrados', subtitulo:'Fuego · Sahumerio · La Mojiganga',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'🌿 Armonía', spinGender:'h',
      desc:'El fuego sagrado simboliza purificación y unidad. El sahumerio quema hierbas medicinales para crear armonía entre cuerpo, mente y espíritu. La Mojiganga fortalece la integración comunitaria.',
      mamaText:'El fuego sagrado purifica y protege. El sahumerio, quemando nuestras hierbas medicinales sagradas, crea armonía entre el cuerpo, la mente y el espíritu. Y la danza La Mojiganga nos llena de alegría y nos une como comunidad.',
    },
    { type:'puzzle', label:'Los Rituales Sagrados del Pueblo Pasto' },
    {
      type:'transition', titulo:'Vestimenta del Hombre Pasto', subtitulo:'Para participar en los rituales sagrados',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'👒 Identidad masculina', spinGender:'h',
      desc:'Ahora conocerás las siete prendas que conforman la vestimenta tradicional del hombre Pasto. Cada prenda tiene una historia, un material y un significado especial.',
      mamaText:'¡Muy bien! Ahora te mostraré cómo se viste el hombre Pasto para participar en las celebraciones. Son siete prendas llenas de historia e identidad.',
    },
    ...CAT_H.map(item => ({ type:'clothing', gender:'h', item, spinGender:'h' })),
    {
      type:'transition', titulo:'Vestimenta de la Mujer Pasto', subtitulo:'Para participar en los rituales sagrados',
      realImg:MANDALA_REAL, pixelImg:MANDALA_PIX, badge:'🌸 Identidad femenina', spinGender:'m',
      desc:'Ahora conocerás las seis prendas que conforman la vestimenta tradicional de la mujer Pasto. Cada prenda es un símbolo de identidad, sabiduría y fortaleza femenina.',
      mamaText:'¡Excelente! Ahora te mostraré la hermosa vestimenta de la mujer Pasto. Son seis prendas, cada una con su significado y su historia.',
    },
    ...CAT_M.map(item => ({ type:'clothing', gender:'m', item, spinGender:'m' })),
    { type:'result' },
  ];
}

/* Mapa de diálogos por índice de slide (solo slides tipo 'info') */
const DIALOGO_SLIDE = {
  0: 'maloca_bienvenida',
  1: 'maloca_inti_raymi',
  2: 'maloca_rituales_intro',
  3: 'maloca_koya_raymi',
  4: 'maloca_elementos_sagrados',
};

/* ════════════════════════════════════════════════════════════════
   INIT
════════════════════════════════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
  SEC = buildSecuencia();

  mamaInterval = setInterval(() => {
    mamaFrame = mamaFrame === 1 ? 2 : 1;
    const src = '../images/mama/mama_frame' + mamaFrame + '.png';
    const img = document.getElementById('mama-img');
    const av  = document.querySelector('.bubble-avatar');
    const pav = document.getElementById('puz-av');
    if (img) img.src = src;
    if (av)  av.src  = src;
    if (pav) pav.src = src;
  }, 650);

  document.addEventListener('click',    () => _iniciarMusica(), { once:true });
  document.addEventListener('touchend', () => _iniciarMusica(), { once:true });

  document.addEventListener('pointermove', _puzOnMove, { passive:false });
  document.addEventListener('pointerup',   _puzOnEnd,  { passive:false });
  document.addEventListener('touchmove', e => { if (puzDrag.active) e.preventDefault(); }, { passive:false });

  renderSlide(0);
});

/* ════════════════════════════════════════════════════════════════
   VISUAL NOVEL — RENDER SLIDE
════════════════════════════════════════════════════════════════ */
function renderSlide(idx) {
  secIdx = idx;
  const slide = SEC[idx];
  if (!slide) return;

  if (slide.type === 'puzzle') { startPuzzleSequence(); return; }
  if (slide.type === 'result') { mostrarResultado(); return; }

  /* ── Diálogo narrativo en momentos clave ── */
  if (DIALOGO_SLIDE[idx]) _dlg(DIALOGO_SLIDE[idx]);
  if (slide.type === 'transition') {
    _dlg(slide.spinGender === 'm' ? 'maloca_vestimenta_mujer_intro' : 'maloca_vestimenta_hombre_intro');
  }

  const pct  = Math.round((idx / (SEC.length - 2)) * 100);
  const el   = id => document.getElementById(id);
  el('prog-bar-fill').style.width = Math.min(pct, 100) + '%';

  const numContent = SEC.filter(s => s.type !== 'puzzle' && s.type !== 'result').length;
  const idxContent = SEC.slice(0, idx + 1).filter(s => s.type !== 'puzzle' && s.type !== 'result').length;
  el('nav-progress').innerHTML = 'Paso ' + idxContent + '/' + numContent + '<br>' + _labelTipo(slide.type, slide.gender);

  let titulo, subtitulo, realImg, pixelImg, badge, desc, mamaText, spinGender;
  if (slide.type === 'clothing') {
    ({ nombre: titulo, subtitulo, realImg, pixelImg: pixelImg, badge, desc, mamaText } = slide.item);
    spinGender = slide.spinGender;
  } else {
    ({ titulo, subtitulo, realImg, pixelImg, badge, desc, mamaText, spinGender } = slide);
  }

  const ca   = el('content-area');
  const mama = el('mama-bubble');
  ca.style.opacity   = '0';
  mama.style.opacity = '0';

  setTimeout(() => {
    el('real-photo').src             = realImg   || MANDALA_REAL;
    el('pixel-art').src              = pixelImg  || MANDALA_PIX;
    el('item-titulo').textContent    = titulo    || '';
    el('item-subtitulo').textContent = subtitulo || '';
    el('item-desc').textContent      = desc      || '';
    el('card-badge').textContent     = badge     || '';
    el('mama-text').textContent      = mamaText  || '';
    _iniciarSpin(spinGender || 'h');
    ca.style.transition   = 'opacity .35s';
    mama.style.transition = 'opacity .35s';
    ca.style.opacity      = '1';
    mama.style.opacity    = '1';
  }, 250);

  const btnA = el('btn-anterior');
  if (btnA) btnA.disabled = (idx === 0);
}

function _labelTipo(type, gender) {
  if (type === 'info' || type === 'transition') return '📖 Información';
  if (type === 'clothing' && gender === 'h')    return '👒 Vestimenta Hombre';
  if (type === 'clothing' && gender === 'm')    return '👗 Vestimenta Mujer';
  return '';
}

function _iniciarSpin(gender) {
  if (spinInterval) { clearInterval(spinInterval); spinInterval = null; }
  const frames = gender === 'm' ? SPIN_M : SPIN_H;
  let i = 0;
  const img = document.getElementById('spin-img');
  const lbl = document.getElementById('spin-label');
  if (!img) return;
  img.src = frames[0];
  if (lbl) lbl.textContent = gender === 'm' ? 'Mujer Pasto' : 'Hombre Pasto';
  spinInterval = setInterval(() => { i = (i + 1) % frames.length; img.src = frames[i]; }, 1000);
}

function navSiguiente() {
  let next = secIdx + 1;
  while (next < SEC.length && SEC[next].type === 'result') next++;
  if (next < SEC.length) renderSlide(next);
}
function navAnterior() {
  let prev = secIdx - 1;
  while (prev >= 0 && (SEC[prev].type === 'puzzle' || SEC[prev].type === 'result')) prev--;
  if (prev >= 0) renderSlide(prev);
}

/* ════════════════════════════════════════════════════════════════
   PUZZLE — SECUENCIA
════════════════════════════════════════════════════════════════ */
function startPuzzleSequence() {
  puzIdx   = 0;
  puzScore = { completed: 0, total: PUZZLES.length, xp: 0 };
  document.getElementById('puzzle-ov').classList.add('on');

  if (!_dlg('puzzle_inicio', { onCerrar: () => _puzShowIntro(0) })) {
    _puzShowIntro(0);
  }
}

function _puzShowPanel(name) {
  ['puz-intro-panel','puz-game-panel','puz-done-panel','puz-fail-panel'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('on');
  });
  const target = document.getElementById(name);
  if (target) target.classList.add('on');
}

function _puzUpdateHeader() {
  const puz = PUZZLES[puzIdx];
  const cfg = PUZ_DIF[puz.d];
  const pct = Math.round((puzIdx / PUZZLES.length) * 100);
  document.getElementById('puz-step').textContent      = `🧩 Paso ${puzIdx + 1}/${PUZZLES.length}`;
  document.getElementById('puz-prog-fill').style.width = pct + '%';
  document.getElementById('puz-diff').textContent      = cfg.label;
}

function _puzRenderVidas() {
  const wrap = document.getElementById('puz-vidas-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  for (let i = 0; i < puzMaxVidas; i++) {
    const b = document.createElement('div');
    b.className = 'puz-vida' + (i >= puzVidas ? ' perdida' : '');
    wrap.appendChild(b);
  }
}

function _puzShowIntro(idx) {
  puzPhase = 'intro';
  puzIdx   = idx;
  const puz = PUZZLES[idx];
  const cfg = PUZ_DIF[puz.d];

  // Inicializar vidas para este puzzle
  puzMaxVidas = cfg.maxVidas;
  puzVidas    = cfg.maxVidas;

  const idsDif = { F:'puzzle_antes_facil', M:'puzzle_antes_medio', D:'puzzle_antes_dificil' };
  _dlg(idsDif[puz.d]);

  _puzUpdateHeader();
  _puzRenderVidas();
  _puzShowPanel('puz-intro-panel');

  document.getElementById('puz-prev-img').src          = puz.img;
  document.getElementById('puz-ibadge').textContent    = puz.badge;
  document.getElementById('puz-ititle').textContent    = puz.introTitle;
  document.getElementById('puz-idesc').textContent     = puz.introDesc;
  document.getElementById('puz-idiff').textContent     = '🎯 Dificultad: ' + puz.dificultad + ' · ' + cfg.maxVidas + ' intento' + (cfg.maxVidas > 1 ? 's' : '');
  document.getElementById('puz-mama-text').textContent = puz.introMama;

  const btn = document.getElementById('puz-btn-pri');
  btn.textContent = '¡Armar! ▶'; btn.disabled = false;
  document.getElementById('puz-btn-sec').style.display = '';
}

function _puzIniciar() {
  puzPhase = 'playing';
  const puz = PUZZLES[puzIdx];
  const N   = puz.grid;

  const avH = window.innerHeight - 36 - 120 - 28;
  const avW = window.innerWidth  * 0.64 - 16;
  puzBoardSize = Math.floor(Math.min(avH, avW, 420) / N) * N;

  puzTotal  = N * N;
  puzPlaced = 0;

  _puzShowPanel('puz-game-panel');
  _puzUpdateHeader();
  _puzRenderVidas();
  document.getElementById('puz-mama-text').textContent = puz.mamaText;
  document.getElementById('puz-btn-pri').disabled  = true;
  document.getElementById('puz-btn-pri').textContent = 'Jugando...';

  _puzBuildBoard(N);
  _puzBuildPieces(puz, N);
  _puzUpdateCount();
}

function _puzBuildBoard(N) {
  const board = document.getElementById('puz-board');
  board.innerHTML = '';
  board.style.width  = puzBoardSize + 'px';
  board.style.height = puzBoardSize + 'px';
  board.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
  board.style.gridTemplateRows    = `repeat(${N}, 1fr)`;

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const slot = document.createElement('div');
      slot.className = 'puz-slot';
      slot.dataset.row    = r;
      slot.dataset.col    = c;
      slot.dataset.filled = 'false';
      board.appendChild(slot);
    }
  }
}

function _puzBuildPieces(puz, N) {
  const bank     = document.getElementById('puz-bank');
  bank.innerHTML = '';
  const pieceSize = puzBoardSize / N;
  const pieces    = [];

  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const p = document.createElement('div');
      p.className = 'puz-piece';
      p.dataset.row = r; p.dataset.col = c;
      p.style.width  = pieceSize + 'px';
      p.style.height = pieceSize + 'px';
      p.style.backgroundImage    = `url('${puz.img}')`;
      p.style.backgroundSize     = `${puzBoardSize}px ${puzBoardSize}px`;
      p.style.backgroundPosition = `-${c * pieceSize}px -${r * pieceSize}px`;
      p.style.backgroundRepeat   = 'no-repeat';
      p.style.flexShrink         = '0';
      p.addEventListener('pointerdown', e => _puzStartDrag(e, p), { passive:false });
      pieces.push(p);
    }
  }

  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  pieces.forEach(p => bank.appendChild(p));
}

function _puzUpdateCount() {
  document.getElementById('puz-count').textContent = `${puzPlaced}/${puzTotal} piezas`;
}

/* ── DRAG ── */
function _puzStartDrag(e, piece) {
  if (e.button !== undefined && e.button !== 0) return;
  e.preventDefault(); e.stopPropagation();
  if (puzPhase !== 'playing') return;

  const pt   = _puzPt(e);
  const size = parseInt(piece.style.width);
  puzDrag.active = true;
  puzDrag.piece  = piece;
  puzDrag.size   = size;

  const ghost = document.getElementById('puz-ghost');
  ghost.style.display            = 'block';
  ghost.style.width              = size + 'px';
  ghost.style.height             = size + 'px';
  ghost.style.backgroundImage    = piece.style.backgroundImage;
  ghost.style.backgroundSize     = piece.style.backgroundSize;
  ghost.style.backgroundPosition = piece.style.backgroundPosition;
  ghost.style.backgroundRepeat   = 'no-repeat';
  ghost.style.left = (pt.x - size / 2) + 'px';
  ghost.style.top  = (pt.y - size / 2) + 'px';
  puzDrag.ghost = ghost;

  piece.classList.add('dragging');
  if (piece.setPointerCapture) piece.setPointerCapture(e.pointerId);
}

function _puzOnMove(e) {
  if (!puzDrag.active || !puzDrag.ghost) return;
  e.preventDefault();
  const pt = _puzPt(e);
  puzDrag.ghost.style.left = (pt.x - puzDrag.size / 2) + 'px';
  puzDrag.ghost.style.top  = (pt.y - puzDrag.size / 2) + 'px';
  _puzHighlight(pt.x, pt.y);
}

function _puzOnEnd(e) {
  if (!puzDrag.active) return;
  puzDrag.active = false;
  const pt = _puzPt(e);

  if (puzDrag.ghost) { puzDrag.ghost.style.display = 'none'; puzDrag.ghost = null; }
  _puzClearHighlight();

  if (!puzDrag.piece) return;
  puzDrag.piece.classList.remove('dragging');

  const slot = _puzSlotAt(pt.x, pt.y);
  if (slot && slot.dataset.filled === 'false') {
    const pr = +puzDrag.piece.dataset.row, pc = +puzDrag.piece.dataset.col;
    const sr = +slot.dataset.row,          sc = +slot.dataset.col;
    if (pr === sr && pc === sc) {
      // ✅ Correcto
      _puzPlace(puzDrag.piece, slot);
      _sfx3('correct_answer.wav');
    } else {
      // ❌ Incorrecto — pierde una vida
      puzDrag.piece.style.opacity = '1';
      puzDrag.piece.classList.add('wshake');
      setTimeout(() => puzDrag.piece && puzDrag.piece.classList.remove('wshake'), 400);
      _sfx3('wrong_answer.ogg');
      puzVidas--;
      _puzRenderVidas();
      if (puzVidas > 0) _dlg('puzzle_vida_perdida');
      if (puzVidas <= 0) {
        puzDrag.piece = null;
        setTimeout(_puzOnFail, 450);
        return;
      }
    }
  } else {
    puzDrag.piece.style.opacity = '1';
  }
  puzDrag.piece = null;
}

function _puzPlace(piece, slot) {
  slot.style.backgroundImage    = piece.style.backgroundImage;
  slot.style.backgroundSize     = piece.style.backgroundSize;
  slot.style.backgroundPosition = piece.style.backgroundPosition;
  slot.style.backgroundRepeat   = 'no-repeat';
  slot.dataset.filled = 'true';
  slot.classList.add('filled', 'cflash');
  setTimeout(() => slot.classList.remove('cflash'), 450);
  piece.remove();
  puzPlaced++;
  _puzUpdateCount();
  if (puzPlaced >= puzTotal) setTimeout(_puzOnComplete, 600);
}

function _puzOnFail() {
  puzPhase = 'fail';
  _puzShowPanel('puz-fail-panel');
  document.getElementById('puz-fail-tit').textContent  = '¡Sin intentos!';
  document.getElementById('puz-fail-sub').textContent  = '¿Quieres intentarlo de nuevo o pasar al siguiente paso?';
  document.getElementById('puz-mama-text').textContent = 'No te rindas, hijo/a. Cada intento es una oportunidad de aprender nuestros rituales.';
  _dlg('puzzle_sin_vidas');
  const btn = document.getElementById('puz-btn-pri');
  btn.textContent = '🔄 Reintentar';
  btn.disabled    = false;
  document.getElementById('puz-btn-sec').style.display = '';
}

function _puzPt(e) {
  if (e.changedTouches?.length) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  if (e.touches?.length)        return { x: e.touches[0].clientX,        y: e.touches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

function _puzSlotAt(x, y) {
  for (const slot of document.querySelectorAll('.puz-slot')) {
    const r = slot.getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return slot;
  }
  return null;
}

function _puzHighlight(x, y) {
  _puzClearHighlight();
  const slot = _puzSlotAt(x, y);
  if (slot && slot.dataset.filled === 'false') slot.classList.add('hl');
}
function _puzClearHighlight() {
  document.querySelectorAll('.puz-slot.hl').forEach(s => s.classList.remove('hl'));
}

function _puzOnComplete() {
  puzPhase = 'done';
  puzScore.completed++;
  puzScore.xp += 50;

  const puz    = PUZZLES[puzIdx];
  const isLast = puzIdx >= PUZZLES.length - 1;

  _puzShowPanel('puz-done-panel');
  document.getElementById('puz-done-emo').textContent = isLast ? '🏆' : '🎉';
  document.getElementById('puz-done-tit').textContent = isLast ? '¡Rituales completados!' : '¡Paso completado!';
  document.getElementById('puz-done-sub').textContent = isLast
    ? 'Conoces todos los pasos del ritual sagrado del Pueblo Pasto.'
    : `Completaste el paso ${puzIdx + 1} de ${PUZZLES.length}.`;

  document.getElementById('puz-mama-text').textContent = puz.doneMama;
  _dlg(isLast ? 'puzzle_todos_completados' : 'puzzle_completado');

  const btn = document.getElementById('puz-btn-pri');
  btn.disabled    = false;
  btn.textContent = isLast ? '¡Continuar! ▶' : 'Siguiente paso ▶';
  document.getElementById('puz-btn-sec').style.display = 'none';
}

/* ── Botones del puzzle ── */
function puzAccion() {
  if (puzPhase === 'intro') {
    _puzIniciar();
  } else if (puzPhase === 'done') {
    if (puzIdx < PUZZLES.length - 1) {
      _puzShowIntro(puzIdx + 1);
    } else {
      _puzFinalizar();
    }
  } else if (puzPhase === 'fail') {
    // Reintentar: volver al intro del mismo puzzle
    _puzShowIntro(puzIdx);
  }
}

function puzSaltar() {
  if (puzDrag.active) {
    puzDrag.active = false;
    if (puzDrag.ghost) { puzDrag.ghost.style.display = 'none'; puzDrag.ghost = null; }
    if (puzDrag.piece) { puzDrag.piece.classList.remove('dragging'); puzDrag.piece.style.opacity = '1'; puzDrag.piece = null; }
    _puzClearHighlight();
  }
  if (puzIdx < PUZZLES.length - 1) {
    _puzShowIntro(puzIdx + 1);
  } else {
    _puzFinalizar();
  }
}

function _puzFinalizar() {
  document.getElementById('puzzle-ov').classList.remove('on');
  _detenerMusica();
  window.location.href = 'game3.2.html';
}

/* ════════════════════════════════════════════════════════════════
   RESULTADO FINAL
════════════════════════════════════════════════════════════════ */
function mostrarResultado() {
  document.getElementById('res-ov').classList.add('on');

  const pct = puzScore.completed / puzScore.total;
  let emo, tit, desc, idDialogo;
  if (pct >= 1)     { emo='🏆'; tit='¡Guardián de la Maloca!';  desc='Completaste todos los rompecabezas y conoces profundamente los rituales y vestimenta del Pueblo Pasto. ¡Eres un verdadero sabedor!'; idDialogo='puzzle_resultado_perfecto'; }
  else if(pct>=.7)  { emo='🧥'; tit='¡Gran Aprendiz!';           desc='Tienes muy buen conocimiento de los rituales y tradiciones ancestrales del Pueblo Pasto.'; idDialogo='puzzle_resultado_bueno'; }
  else if(pct>=.4)  { emo='🌿'; tit='Explorador Cultural';        desc='Sigue aprendiendo sobre la riqueza de nuestra comunidad. ¡La Maloca siempre te espera!'; idDialogo='puzzle_resultado_bajo'; }
  else              { emo='🪔'; tit='Sigue Intentando';           desc='La Mama Rosa te invita a repasar los rituales sagrados del Pueblo Pasto.'; idDialogo='puzzle_resultado_bajo'; }

  document.getElementById('re').textContent            = emo;
  document.getElementById('rt').textContent            = tit;
  document.getElementById('rd').textContent            = desc;
  document.getElementById('score-puzzles').textContent = puzScore.completed + '/' + puzScore.total;
  document.getElementById('score-xp').textContent      = puzScore.xp + ' XP';
  document.getElementById('score-total').textContent   = puzScore.xp;

  _dlg(idDialogo);

  localStorage.setItem('mundo2_completo', '1');
  const prev = parseInt(localStorage.getItem('puntos_total') || '0');
  localStorage.setItem('puntos_total', prev + puzScore.xp);
}

function finalizarJuego3() {
  _detenerMusica();
  window.location.href = 'juegos.html';
}