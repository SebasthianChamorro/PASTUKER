/* ══════════════════════════════════════════════════════════════
   Pastuker — game-2.js
   Mundo 2: Selva Profunda  •  Plataformero × 10 Niveles
   Requiere: Phaser 3, PLANTAS_CATALOGO en window (de game.js
   o un archivo plantas.js compartido)
══════════════════════════════════════════════════════════════ */
'use strict';

/* ══ CONSTANTES ══ */
const G2 = {
  TILE:   110,   // px tamaño visual de cada tile de terreno
  PLATHR: 0.65,  // fracción de TILE para altura de plataformas
  SPEED:  210,   // px/s velocidad horizontal
  JUMP:  -580,   // px/s velocidad de salto (negativa = arriba)
  GRAV:   900,   // px/s² gravedad extra (sobre la base Arcade)
  LIVES:    3,
  LEVELS:  10,
};

/* ══════════════════════════════════════════════════════════════
   DATOS DE NIVELES
   ground  : [[x0,x1],…]  segmentos de suelo sólido
   plats   : [{x,yo,t,k}] plataformas flotantes
               x  = borde izquierdo (px)
               yo = px por encima del suelo (positivo = arriba)
               t  = número de tiles de ancho
               k  = sufijo del tile, p.ej. '09' → 'jp09'
   water   : [[x0,x1],…]  zonas de agua (muerte al caer)
   trees   : [{x,k},…]    árboles decorativos (sin física)
   decos   : [{x,k},…]    arbustos/plantas decorativas
   plantX  : x del coleccionable
   plantYO : yo del coleccionable (0 = sobre el suelo)
══════════════════════════════════════════════════════════════ */
const NIVELES = [

  /* ─── NIVEL 1: Introducción ─── */
  {
    worldWidth: 11000,
    ground: [[0,2000],[2500,4600],[5100,7100],[7600,9200],[9700,11000]],
    plats:[
      // cruces de huecos (yo=150, salto simple)
      {x:2050,yo:150,t:2,k:'09'},{x:2320,yo:150,t:2,k:'09'},
      {x:4650,yo:150,t:2,k:'09'},{x:4900,yo:150,t:2,k:'09'},
      {x:7150,yo:150,t:2,k:'09'},{x:7410,yo:150,t:2,k:'09'},
      {x:9250,yo:150,t:2,k:'09'},{x:9500,yo:150,t:2,k:'09'},
      // plataformas de exploración
      {x:600,yo:170,t:2,k:'11'},{x:1300,yo:210,t:2,k:'09'},
      {x:3000,yo:180,t:3,k:'03'},{x:3800,yo:220,t:2,k:'11'},
      {x:5500,yo:175,t:2,k:'09'},{x:6200,yo:205,t:2,k:'11'},
      {x:8000,yo:180,t:3,k:'03'},{x:8700,yo:220,t:2,k:'09'},
      {x:10200,yo:175,t:2,k:'11'},{x:10700,yo:195,t:2,k:'09'},
    ],
    water:[[2000,2500],[4600,5100],[7100,7600],[9200,9700]],
    trees:[{x:300,k:'57'},{x:1000,k:'59'},{x:2800,k:'57'},{x:5400,k:'59'},{x:7900,k:'57'},{x:10100,k:'59'}],
    decos:[{x:500,k:'64'},{x:1600,k:'65'},{x:3400,k:'67'},{x:6000,k:'63'},{x:8800,k:'68'},{x:10500,k:'64'}],
    plantX:10700, plantYO:0,
  },

  /* ─── NIVEL 2: Huecos más amplios ─── */
  {
    worldWidth: 11500,
    ground: [[0,1800],[2600,4300],[5200,6900],[7800,9400],[10300,11500]],
    plats:[
      // cruces 800 px — 3 plataformas cada uno
      {x:1850,yo:160,t:2,k:'09'},{x:2130,yo:160,t:2,k:'09'},{x:2400,yo:160,t:2,k:'09'},
      {x:4350,yo:160,t:2,k:'09'},{x:4630,yo:165,t:2,k:'11'},{x:4910,yo:160,t:2,k:'09'},
      {x:6950,yo:160,t:2,k:'09'},{x:7230,yo:165,t:2,k:'09'},{x:7510,yo:160,t:2,k:'11'},
      {x:9450,yo:160,t:2,k:'09'},{x:9730,yo:165,t:2,k:'09'},{x:10010,yo:160,t:2,k:'11'},
      // exploración
      {x:500,yo:195,t:2,k:'11'},{x:1100,yo:245,t:2,k:'09'},
      {x:2900,yo:205,t:2,k:'09'},{x:3600,yo:245,t:2,k:'11'},
      {x:5500,yo:205,t:3,k:'03'},{x:6400,yo:245,t:2,k:'09'},
      {x:8200,yo:200,t:2,k:'11'},{x:9000,yo:245,t:2,k:'09'},
      {x:10600,yo:200,t:2,k:'11'},
    ],
    water:[[1800,2600],[4300,5200],[6900,7800],[9400,10300]],
    trees:[{x:200,k:'57'},{x:900,k:'59'},{x:2900,k:'57'},{x:5600,k:'59'},{x:8300,k:'57'},{x:10600,k:'59'}],
    decos:[{x:400,k:'65'},{x:1500,k:'66'},{x:3200,k:'67'},{x:5900,k:'64'},{x:8700,k:'68'},{x:10800,k:'63'}],
    plantX:11100, plantYO:200,
  },

  /* ─── NIVEL 3: Cadenas de plataformas ─── */
  {
    worldWidth: 12000,
    ground: [[0,1500],[2700,4000],[5200,6400],[7600,8800],[10000,12000]],
    plats:[
      // gap1 (1500-2700, 1200 px) — 4 plataformas
      {x:1560,yo:175,t:2,k:'09'},{x:1870,yo:195,t:2,k:'11'},
      {x:2180,yo:180,t:2,k:'09'},{x:2480,yo:195,t:2,k:'09'},
      // gap2 (4000-5200)
      {x:4060,yo:180,t:2,k:'09'},{x:4370,yo:200,t:2,k:'11'},
      {x:4680,yo:180,t:2,k:'09'},{x:4970,yo:195,t:2,k:'09'},
      // gap3 (6400-7600)
      {x:6460,yo:180,t:2,k:'11'},{x:6770,yo:200,t:2,k:'09'},
      {x:7080,yo:180,t:2,k:'09'},{x:7380,yo:195,t:2,k:'11'},
      // gap4 (8800-10000)
      {x:8860,yo:190,t:2,k:'09'},{x:9170,yo:215,t:2,k:'11'},
      {x:9480,yo:190,t:2,k:'09'},{x:9780,yo:205,t:2,k:'09'},
      // exploración más alta
      {x:600,yo:215,t:2,k:'11'},{x:1000,yo:295,t:2,k:'13'},
      {x:2900,yo:235,t:2,k:'09'},{x:3500,yo:305,t:2,k:'11'},
      {x:5500,yo:215,t:3,k:'03'},{x:6100,yo:305,t:2,k:'13'},
      {x:8100,yo:225,t:2,k:'09'},{x:8500,yo:315,t:2,k:'11'},
      {x:10500,yo:215,t:2,k:'09'},{x:11200,yo:245,t:3,k:'03'},
    ],
    water:[[1500,2700],[4000,5200],[6400,7600],[8800,10000]],
    trees:[{x:200,k:'59'},{x:800,k:'57'},{x:2900,k:'59'},{x:5600,k:'57'},{x:8300,k:'59'},{x:10600,k:'57'}],
    decos:[{x:500,k:'68'},{x:1200,k:'64'},{x:3400,k:'65'},{x:5900,k:'67'},{x:8600,k:'63'},{x:11000,k:'66'}],
    plantX:11200, plantYO:245,
  },

  /* ─── NIVEL 4: Isla flotante (sin suelo central) ─── */
  {
    worldWidth: 12000,
    ground: [[0,1000],[11000,12000]],
    plats:[
      // 11 grupos de 3-4 plataformas cada 900 px
      {x:1060,yo:165,t:2,k:'09'},{x:1360,yo:200,t:2,k:'11'},{x:1660,yo:165,t:2,k:'09'},
      {x:1960,yo:175,t:2,k:'09'},{x:2260,yo:210,t:2,k:'11'},{x:2560,yo:175,t:2,k:'09'},
      {x:2860,yo:165,t:2,k:'09'},{x:3160,yo:200,t:2,k:'11'},{x:3455,yo:165,t:2,k:'09'},
      {x:3760,yo:180,t:2,k:'09'},{x:4060,yo:215,t:2,k:'11'},{x:4360,yo:180,t:2,k:'09'},
      {x:4660,yo:165,t:2,k:'09'},{x:4960,yo:200,t:2,k:'09'},{x:5260,yo:170,t:2,k:'11'},
      {x:5560,yo:175,t:2,k:'09'},{x:5860,yo:210,t:2,k:'11'},{x:6160,yo:180,t:2,k:'09'},
      {x:6460,yo:165,t:2,k:'09'},{x:6760,yo:195,t:2,k:'11'},{x:7060,yo:170,t:2,k:'09'},
      {x:7360,yo:180,t:2,k:'09'},{x:7660,yo:215,t:2,k:'11'},{x:7960,yo:180,t:2,k:'09'},
      {x:8260,yo:165,t:2,k:'09'},{x:8560,yo:200,t:2,k:'11'},{x:8860,yo:170,t:2,k:'09'},
      {x:9160,yo:180,t:2,k:'09'},{x:9460,yo:210,t:2,k:'11'},{x:9760,yo:180,t:2,k:'09'},
      {x:10060,yo:165,t:2,k:'09'},{x:10360,yo:195,t:2,k:'11'},
      {x:10660,yo:165,t:2,k:'09'},{x:10900,yo:175,t:2,k:'09'},
    ],
    water:[[1000,11000]],
    trees:[{x:200,k:'57'},{x:600,k:'59'},{x:11200,k:'57'},{x:11600,k:'59'}],
    decos:[{x:400,k:'64'},{x:800,k:'65'},{x:11400,k:'67'}],
    plantX:10900, plantYO:175,
  },

  /* ─── NIVEL 5: Escaleras ─── */
  {
    worldWidth: 12000,
    ground: [[0,1200],[2400,3600],[4800,6000],[7200,8400],[9600,10800],[11500,12000]],
    plats:[
      // gap1 escalera ascendente (1200-2400)
      {x:1260,yo:140,t:2,k:'09'},{x:1580,yo:205,t:2,k:'11'},
      {x:1900,yo:265,t:2,k:'09'},{x:2180,yo:205,t:2,k:'11'},
      // gap2 escalera descendente (3600-4800)
      {x:3660,yo:265,t:2,k:'09'},{x:3960,yo:205,t:2,k:'11'},
      {x:4260,yo:145,t:2,k:'09'},{x:4560,yo:80,t:2,k:'11'},
      // gap3 escalera ascendente (6000-7200)
      {x:6060,yo:145,t:2,k:'09'},{x:6360,yo:215,t:2,k:'11'},
      {x:6660,yo:285,t:2,k:'09'},{x:6960,yo:215,t:2,k:'11'},
      // gap4 escalera descendente (8400-9600)
      {x:8460,yo:285,t:2,k:'09'},{x:8760,yo:215,t:2,k:'11'},
      {x:9060,yo:145,t:2,k:'09'},{x:9360,yo:80,t:2,k:'11'},
      // gap5 escalera ascendente (10800-11500)
      {x:10860,yo:155,t:2,k:'09'},{x:11110,yo:225,t:2,k:'11'},{x:11310,yo:305,t:2,k:'09'},
      // extras en secciones de suelo
      {x:400,yo:205,t:2,k:'11'},{x:800,yo:305,t:2,k:'09'},
      {x:2600,yo:225,t:2,k:'09'},{x:3200,yo:325,t:2,k:'11'},
      {x:5000,yo:205,t:2,k:'11'},{x:5500,yo:315,t:2,k:'09'},
      {x:7400,yo:205,t:2,k:'09'},{x:8000,yo:315,t:2,k:'11'},
      {x:9800,yo:225,t:2,k:'09'},{x:10400,yo:325,t:2,k:'11'},
    ],
    water:[[1200,2400],[3600,4800],[6000,7200],[8400,9600],[10800,11500]],
    trees:[{x:100,k:'57'},{x:700,k:'59'},{x:2600,k:'57'},{x:5200,k:'59'},{x:7500,k:'57'},{x:10000,k:'59'}],
    decos:[{x:500,k:'66'},{x:1000,k:'64'},{x:3000,k:'67'},{x:5600,k:'63'},{x:8700,k:'68'},{x:10600,k:'65'}],
    plantX:11310, plantYO:305,
  },

  /* ─── NIVEL 6: Agua por todas partes ─── */
  {
    worldWidth: 12000,
    ground: [
      [0,700],[1500,2100],[2800,3400],[4100,4700],
      [5400,6000],[6700,7300],[8000,8600],[9300,9900],
      [10600,11200],[11700,12000]
    ],
    plats:[
      // 3 plataformas sobre cada franja de agua
      {x:760,yo:165,t:2,k:'09'},{x:1010,yo:175,t:2,k:'11'},{x:1265,yo:165,t:2,k:'09'},
      {x:2160,yo:170,t:2,k:'09'},{x:2385,yo:180,t:2,k:'11'},{x:2600,yo:170,t:2,k:'09'},
      {x:3460,yo:165,t:2,k:'09'},{x:3675,yo:180,t:2,k:'11'},{x:3890,yo:165,t:2,k:'09'},
      {x:4760,yo:165,t:2,k:'09'},{x:4985,yo:178,t:2,k:'11'},{x:5200,yo:165,t:2,k:'09'},
      {x:6060,yo:170,t:2,k:'09'},{x:6275,yo:182,t:2,k:'11'},{x:6500,yo:170,t:2,k:'09'},
      {x:7360,yo:165,t:2,k:'09'},{x:7575,yo:178,t:2,k:'11'},{x:7800,yo:165,t:2,k:'09'},
      {x:8660,yo:170,t:2,k:'09'},{x:8875,yo:182,t:2,k:'11'},{x:9100,yo:170,t:2,k:'09'},
      {x:9960,yo:165,t:2,k:'09'},{x:10175,yo:178,t:2,k:'11'},{x:10390,yo:165,t:2,k:'09'},
      {x:11260,yo:165,t:2,k:'09'},{x:11470,yo:175,t:2,k:'11'},
    ],
    water:[[700,1500],[2100,2800],[3400,4100],[4700,5400],[6000,6700],[7300,8000],[8600,9300],[9900,10600],[11200,11700]],
    trees:[{x:200,k:'57'},{x:1600,k:'59'},{x:3000,k:'57'},{x:5500,k:'59'},{x:8100,k:'57'},{x:10700,k:'59'}],
    decos:[{x:400,k:'66'},{x:2200,k:'64'},{x:4200,k:'67'},{x:6800,k:'63'},{x:9400,k:'68'},{x:11800,k:'65'}],
    plantX:11700, plantYO:0,
  },

  /* ─── NIVEL 7: Alturas mixtas ─── */
  {
    worldWidth: 12500,
    ground: [[0,1500],[2600,4000],[5200,6600],[7800,9000],[10200,11500],[12000,12500]],
    plats:[
      // gaps con alturas alternadas
      {x:1560,yo:155,t:2,k:'09'},{x:1825,yo:240,t:2,k:'11'},{x:2105,yo:160,t:2,k:'09'},{x:2390,yo:245,t:2,k:'11'},
      {x:4060,yo:245,t:2,k:'11'},{x:4345,yo:165,t:2,k:'09'},{x:4625,yo:255,t:2,k:'11'},{x:4905,yo:165,t:2,k:'09'},
      {x:6660,yo:160,t:2,k:'09'},{x:6945,yo:245,t:2,k:'11'},{x:7225,yo:165,t:2,k:'09'},{x:7510,yo:255,t:2,k:'11'},
      {x:9060,yo:250,t:2,k:'11'},{x:9345,yo:165,t:2,k:'09'},{x:9625,yo:255,t:2,k:'11'},{x:9905,yo:165,t:2,k:'09'},
      {x:11560,yo:165,t:2,k:'09'},{x:11790,yo:245,t:2,k:'11'},
      // extras
      {x:400,yo:205,t:2,k:'11'},{x:900,yo:315,t:2,k:'09'},{x:1200,yo:235,t:2,k:'11'},
      {x:2800,yo:215,t:2,k:'09'},{x:3400,yo:325,t:2,k:'11'},{x:3800,yo:215,t:2,k:'09'},
      {x:5400,yo:205,t:3,k:'03'},{x:6100,yo:325,t:2,k:'11'},
      {x:8100,yo:205,t:2,k:'09'},{x:8600,yo:325,t:2,k:'11'},
      {x:10400,yo:215,t:2,k:'09'},{x:11200,yo:325,t:2,k:'11'},
    ],
    water:[[1500,2600],[4000,5200],[6600,7800],[9000,10200],[11500,12000]],
    trees:[{x:200,k:'59'},{x:800,k:'57'},{x:2900,k:'59'},{x:5600,k:'57'},{x:8400,k:'59'},{x:10500,k:'57'}],
    decos:[{x:500,k:'67'},{x:1200,k:'64'},{x:3200,k:'65'},{x:6000,k:'66'},{x:9200,k:'68'},{x:11100,k:'63'}],
    plantX:11790, plantYO:245,
  },

  /* ─── NIVEL 8: Espiral ascendente y descendente ─── */
  {
    worldWidth: 12500,
    ground: [[0,900],[11500,12500]],
    plats:[
      // ascenso progresivo (yo: 130 → 300)
      {x:960,yo:130,t:2,k:'09'},{x:1205,yo:150,t:2,k:'11'},
      {x:1450,yo:175,t:2,k:'09'},{x:1710,yo:195,t:2,k:'11'},
      {x:1970,yo:215,t:2,k:'09'},{x:2235,yo:205,t:2,k:'09'},
      {x:2495,yo:195,t:2,k:'11'},{x:2760,yo:210,t:2,k:'09'},
      {x:3025,yo:225,t:2,k:'11'},{x:3290,yo:245,t:2,k:'09'},
      {x:3555,yo:265,t:2,k:'11'},{x:3825,yo:250,t:2,k:'09'},
      {x:4090,yo:270,t:2,k:'11'},{x:4355,yo:255,t:2,k:'09'},
      {x:4620,yo:275,t:2,k:'11'},{x:4890,yo:285,t:2,k:'09'},
      {x:5155,yo:265,t:2,k:'11'},{x:5425,yo:280,t:2,k:'09'},
      // cima (yo≈295-305)
      {x:5690,yo:285,t:3,k:'03'},{x:5995,yo:300,t:2,k:'11'},
      {x:6260,yo:285,t:2,k:'09'},{x:6530,yo:300,t:2,k:'11'},
      {x:6800,yo:290,t:2,k:'09'},{x:7075,yo:305,t:2,k:'11'},
      {x:7345,yo:290,t:2,k:'09'},{x:7620,yo:300,t:2,k:'09'},
      {x:7890,yo:285,t:2,k:'11'},
      // descenso (yo: 300 → 140)
      {x:8155,yo:300,t:2,k:'09'},{x:8425,yo:280,t:2,k:'11'},
      {x:8695,yo:260,t:2,k:'09'},{x:8965,yo:245,t:2,k:'11'},
      {x:9235,yo:230,t:2,k:'09'},{x:9510,yo:215,t:2,k:'11'},
      {x:9780,yo:200,t:2,k:'09'},{x:10055,yo:185,t:2,k:'11'},
      {x:10325,yo:170,t:2,k:'09'},{x:10600,yo:155,t:2,k:'11'},
      // aterrizaje final
      {x:10870,yo:145,t:3,k:'03'},{x:11180,yo:135,t:2,k:'09'},
      {x:11390,yo:145,t:2,k:'11'},
    ],
    water:[[900,11500]],
    trees:[{x:200,k:'57'},{x:600,k:'59'},{x:11700,k:'57'},{x:12100,k:'59'}],
    decos:[{x:400,k:'64'},{x:700,k:'66'},{x:11900,k:'67'}],
    plantX:11180, plantYO:135,
  },

  /* ─── NIVEL 9: Plataformas estrechas (precisión) ─── */
  {
    worldWidth: 13000,
    ground: [[0,800],[12200,13000]],
    plats:[
      // zona 1 (800-2900): t=1 (un tile = 110 px) — muy estrecho
      {x:860,yo:135,t:1,k:'13'},{x:1030,yo:160,t:1,k:'15'},{x:1210,yo:145,t:1,k:'17'},
      {x:1390,yo:170,t:1,k:'13'},{x:1570,yo:155,t:1,k:'15'},{x:1750,yo:180,t:1,k:'17'},
      {x:1930,yo:165,t:1,k:'13'},{x:2110,yo:190,t:1,k:'15'},{x:2290,yo:175,t:2,k:'09'},
      {x:2555,yo:195,t:1,k:'13'},{x:2735,yo:180,t:1,k:'17'},{x:2915,yo:165,t:2,k:'11'},
      // zona 2 (3000-6000): yo 165-250
      {x:3175,yo:170,t:1,k:'13'},{x:3355,yo:205,t:1,k:'15'},{x:3535,yo:180,t:2,k:'09'},
      {x:3800,yo:215,t:1,k:'13'},{x:3980,yo:190,t:1,k:'17'},{x:4160,yo:225,t:1,k:'15'},
      {x:4340,yo:200,t:2,k:'11'},{x:4605,yo:235,t:1,k:'13'},{x:4785,yo:210,t:1,k:'17'},
      {x:4965,yo:225,t:2,k:'09'},{x:5230,yo:240,t:1,k:'13'},{x:5410,yo:215,t:1,k:'15'},
      {x:5590,yo:230,t:2,k:'11'},{x:5855,yo:245,t:1,k:'13'},{x:6035,yo:220,t:1,k:'17'},
      // zona 3 (6000-9000): yo 225-270
      {x:6215,yo:225,t:1,k:'13'},{x:6395,yo:250,t:1,k:'15'},{x:6575,yo:235,t:1,k:'17'},
      {x:6755,yo:255,t:1,k:'13'},{x:6935,yo:240,t:2,k:'09'},{x:7200,yo:260,t:1,k:'13'},
      {x:7380,yo:245,t:1,k:'15'},{x:7560,yo:265,t:1,k:'17'},{x:7740,yo:250,t:2,k:'11'},
      {x:8005,yo:270,t:1,k:'13'},{x:8185,yo:255,t:1,k:'15'},{x:8365,yo:265,t:2,k:'09'},
      {x:8630,yo:260,t:1,k:'13'},{x:8810,yo:245,t:1,k:'17'},{x:8990,yo:260,t:1,k:'15'},
      // zona 4 (9000-12200): descenso a tierra
      {x:9150,yo:255,t:2,k:'09'},{x:9415,yo:240,t:2,k:'11'},{x:9680,yo:225,t:2,k:'09'},
      {x:9945,yo:210,t:2,k:'11'},{x:10210,yo:195,t:2,k:'09'},{x:10475,yo:180,t:2,k:'11'},
      {x:10740,yo:165,t:2,k:'09'},{x:11005,yo:150,t:2,k:'11'},{x:11270,yo:165,t:2,k:'09'},
      {x:11535,yo:150,t:3,k:'03'},{x:11845,yo:155,t:2,k:'11'},{x:12060,yo:150,t:2,k:'09'},
    ],
    water:[[800,12200]],
    trees:[{x:200,k:'57'},{x:500,k:'59'},{x:12400,k:'57'},{x:12700,k:'59'}],
    decos:[{x:350,k:'64'},{x:650,k:'65'},{x:12500,k:'67'}],
    plantX:11535, plantYO:150,
  },

  /* ─── NIVEL 10: Desafío Final ─── */
  {
    worldWidth: 13000,
    ground: [[0,600],[12400,13000]],
    plats:[
      // zona 1: archipiélago de entrada (600-2500)
      {x:660,yo:160,t:2,k:'09'},{x:935,yo:190,t:1,k:'13'},{x:1110,yo:215,t:2,k:'11'},
      {x:1375,yo:170,t:1,k:'15'},{x:1545,yo:240,t:2,k:'09'},{x:1810,yo:180,t:1,k:'17'},
      {x:1985,yo:255,t:2,k:'11'},{x:2250,yo:190,t:1,k:'13'},{x:2425,yo:220,t:2,k:'09'},
      // zona 2: espiral ascendente (2500-5000)
      {x:2690,yo:165,t:2,k:'09'},{x:2955,yo:205,t:2,k:'11'},
      {x:3220,yo:245,t:2,k:'09'},{x:3485,yo:285,t:2,k:'11'},
      {x:3750,yo:270,t:1,k:'13'},{x:3925,yo:250,t:2,k:'09'},
      {x:4190,yo:270,t:1,k:'17'},{x:4365,yo:285,t:2,k:'11'},
      {x:4630,yo:265,t:1,k:'15'},{x:4805,yo:285,t:2,k:'09'},
      // zona 3: plataformas muy altas (5000-7500)
      {x:5075,yo:305,t:2,k:'11'},{x:5350,yo:290,t:1,k:'13'},
      {x:5530,yo:310,t:2,k:'09'},{x:5805,yo:295,t:1,k:'15'},
      {x:5985,yo:315,t:2,k:'11'},{x:6260,yo:300,t:1,k:'17'},
      {x:6440,yo:320,t:2,k:'09'},{x:6715,yo:305,t:1,k:'13'},
      {x:6895,yo:315,t:2,k:'11'},{x:7170,yo:300,t:1,k:'15'},
      {x:7350,yo:310,t:2,k:'09'},
      // zona 4: descenso con obstáculos (7500-10000)
      {x:7720,yo:315,t:1,k:'13'},{x:7895,yo:295,t:2,k:'11'},
      {x:8160,yo:275,t:1,k:'17'},{x:8335,yo:255,t:2,k:'09'},
      {x:8600,yo:235,t:1,k:'13'},{x:8775,yo:215,t:2,k:'11'},
      {x:9040,yo:195,t:1,k:'15'},{x:9215,yo:215,t:2,k:'09'},
      {x:9480,yo:200,t:1,k:'13'},{x:9655,yo:220,t:2,k:'11'},
      {x:9920,yo:205,t:2,k:'09'},
      // zona 5: tramo final (10000-12400)
      {x:10185,yo:185,t:2,k:'09'},{x:10450,yo:205,t:1,k:'17'},
      {x:10625,yo:190,t:2,k:'11'},{x:10890,yo:210,t:1,k:'13'},
      {x:11065,yo:195,t:2,k:'09'},{x:11330,yo:215,t:2,k:'11'},
      {x:11595,yo:200,t:1,k:'15'},{x:11770,yo:220,t:2,k:'09'},
      {x:12035,yo:205,t:2,k:'11'},{x:12200,yo:225,t:3,k:'03'},
    ],
    water:[[600,12400]],
    trees:[{x:200,k:'57'},{x:400,k:'59'},{x:12500,k:'57'},{x:12700,k:'59'}],
    decos:[{x:100,k:'64'},{x:500,k:'66'},{x:12600,k:'67'}],
    plantX:12200, plantYO:225,
  },
];

/* ══════════════════════════════════════════════════════════════
   PRELOAD SCENE
══════════════════════════════════════════════════════════════ */
class PreloadScene2 extends Phaser.Scene {
  constructor() { super('Preload2'); }

  preload() {
    const W = this.scale.width, H = this.scale.height;

    // Barra de carga
    const bgBar = this.add.rectangle(W/2, H/2, 404, 24, 0x1a4a2e).setStrokeStyle(2, 0xd4af37);
    const fill  = this.add.rectangle(W/2 - 200, H/2, 0, 18, 0xd4af37).setOrigin(0, 0.5);
    const txt   = this.add.text(W/2, H/2 + 30, 'Cargando...', {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#f0d060',
    }).setOrigin(0.5);
    this.load.on('progress', v => { fill.width = v * 400; });

    // Fondo
    this.load.image('bg_jungle', '../images/game2/landscale/bg_jungle.png');

    // Tiles de terreno
    ['03','05','07','09','11','13','15','17','19','21',
     '33','34','35','36','37','38','39','40','41',
     '52','54','57','59','63','64','65','66','67','68']
    .forEach(n => this.load.image(`jp${n}`, `../images/game2/landscale/jungle_pack_${n}.png`));

    // Plantas coleccionables
    for (let i = 1; i <= 5; i++)
      this.load.image(`plant_g${i}`, `../images/game/icons_game/plant_${i}.png`);

    // Jugador según género
    const gen    = localStorage.getItem('usuario_genero') || 'masculino';
    const folder = gen === 'femenino' ? 'mama' : 'taita';
    if (gen === 'femenino') {
      // ── Mujer: caminar ──
      this.load.image('pw_r1',   '../images/game/walk-woman/walk2-right1.png');
      this.load.image('pw_r2',   '../images/game/walk-woman/walk2-right2.png');
      this.load.image('pw_l1',   '../images/game/walk-woman/walk2-left1.png');
      this.load.image('pw_l2',   '../images/game/walk-woman/walk2-left2.png');
      this.load.image('pw_l3',   '../images/game/walk-woman/walk2-left3.png');
      this.load.image('pw_idle', '../images/game/walk-woman/walk2-default.png');
      // ── Mujer: salto (9 frames) ──
      for (let i = 1; i <= 9; i++)
        this.load.image('pj'+i, '../images/game2/jump-woman/jump-woman'+i+'.png');
      // ── Mujer: agacharse (4 frames) ──
      for (let i = 1; i <= 4; i++)
        this.load.image('pc'+i, '../images/game2/crounch-woman/crounch-woman'+i+'.png');
    } else {
      // ── Hombre: caminar ──
      this.load.image('pw_r1',   '../images/game/walk-men/walk-right1.png');
      this.load.image('pw_r2',   '../images/game/walk-men/walk-right2.png');
      this.load.image('pw_r3',   '../images/game/walk-men/walk-right3.png');
      this.load.image('pw_l1',   '../images/game/walk-men/walk-left1.png');
      this.load.image('pw_l2',   '../images/game/walk-men/walk-left2.png');
      this.load.image('pw_l3',   '../images/game/walk-men/walk-left3.png');
      this.load.image('pw_idle', '../images/game/walk-men/walk-default.png');
      // ── Hombre: salto (9 frames) ──
      for (let i = 1; i <= 9; i++)
        this.load.image('pj'+i, '../images/game2/jump-men/jump-men'+i+'.png');
      // ── Hombre: agacharse (3 frames) ──
      for (let i = 1; i <= 3; i++)
        this.load.image('pc'+i, '../images/game2/crounch-men/crunch-men'+i+'.png');
    }
  }

  create() { this.scene.start('Game2', { nivel: 0 }); }
}

/* ══════════════════════════════════════════════════════════════
   MAIN GAME SCENE
══════════════════════════════════════════════════════════════ */
class GameScene2 extends Phaser.Scene {
  constructor() { super('Game2'); }

  /* init recibe {nivel} desde scene.start o scene.restart */
  init(data) {
    this.nivel      = (data && data.nivel != null) ? data.nivel : 0;
    this.vidas      = G2.LIVES;
    this.panelOpen  = false;
    this.lastCheckX = 100;
    this.plantaData = null;
    this.plantaObj  = null;
    this.animTimer    = 0;   // acumulador delta para walk
    this.walkFrame    = 0;   // índice walk
    this.jumpFrame    = 0;   // índice salto
    this.jumpTimer    = 0;   // acumulador delta para salto
    this.crouchFrame  = 0;   // índice agacharse
    this.crouchTimer  = 0;   // acumulador delta agacharse
    this.wasOnGround  = true;
    this.touch      = { left:false, right:false, up:false, down:false };
    if (this._qTimer) clearInterval(this._qTimer);
  }

  create() {
    const H   = this.scale.height;
    const lvl = NIVELES[this.nivel];
    this.GY   = H - G2.TILE;

    // Límites del mundo = ancho del nivel × alto de la pantalla
    this.physics.world.setBounds(0, 0, lvl.worldWidth, H);

    // Seleccionar planta aleatoria del catálogo
    const cat = window.PLANTAS_CATALOGO || [];
    if (cat.length) {
      this.plantaData = cat[Math.floor(Math.random() * cat.length)];
    }

    this._buildLevel();
    this._createPlayer();
    this._createHUD();
    this._setupCamera();
    this._setupInput();
  }

  /* ─ Construir nivel ─ */
  _buildLevel() {
    const lvl = NIVELES[this.nivel];
    const H   = this.scale.height;
    const WW  = lvl.worldWidth;
    const TH  = Math.round(G2.TILE * G2.PLATHR); // altura visual de plataformas

    // Fondo — se repite si el mundo es más ancho que una imagen
    this.add.tileSprite(WW/2, H/2, WW, H, 'bg_jungle').setDepth(0);

    // Grupo de física estático
    this.plataformas = this.physics.add.staticGroup();

    // ── Agua ──
    (lvl.water||[]).forEach(([x0,x1]) => {
      const w  = x1 - x0;
      const cy = H - 28;
      this.add.tileSprite(x0 + w/2, cy, w, 55, 'jp52').setDepth(2);
    });

    // ── Suelo ──
    (lvl.ground||[]).forEach(([x0,x1]) => {
      const w  = x1 - x0;
      const cx = x0 + w/2;
      const cy = this.GY + G2.TILE/2;
      // Visual
      this.add.tileSprite(cx, cy, w, G2.TILE, 'jp03').setDepth(5);
      // Física invisible
      const b = this.plataformas.create(cx, cy, 'jp03');
      b.setDisplaySize(w, G2.TILE).refreshBody().setVisible(false);
    });

    // ── Plataformas flotantes ──
    (lvl.plats||[]).forEach(p => {
      const platW = p.t * G2.TILE;
      const cx    = p.x + platW/2;
      const cy    = this.GY - p.yo + TH/2; // superficie en GY - yo
      // Visual
      this.add.tileSprite(cx, cy, platW, TH, `jp${p.k}`).setDepth(5);
      // Física
      const b = this.plataformas.create(cx, cy, `jp${p.k}`);
      b.setDisplaySize(platW, TH).refreshBody().setVisible(false);
    });

    // ── Árboles decorativos ──
    (lvl.trees||[]).forEach(t => {
      this.add.image(t.x + 45, this.GY, `jp${t.k}`)
        .setOrigin(0.5, 1).setScale(1.2).setDepth(4);
    });

    // ── Decoraciones ──
    (lvl.decos||[]).forEach(d => {
      this.add.image(d.x + 30, this.GY, `jp${d.k}`)
        .setOrigin(0.5, 1).setScale(1.0).setDepth(4);
    });

    // ── Planta coleccionable ──
    const plantKey = `plant_g${(this.nivel % 5) + 1}`;
    const platYO   = lvl.plantYO || 0;
    const plantY   = this.GY - platYO - 35;
    this.plantaObj = this.physics.add.staticImage(lvl.plantX, plantY, plantKey)
      .setScale(1.5).setDepth(10);
    // Animación de flotación
    this.tweens.add({
      targets: this.plantaObj,
      y: plantY - 14,
      duration: 900, yoyo:true, repeat:-1, ease:'Sine.easeInOut',
    });
    // Brillo parpadeante
    this.tweens.add({
      targets: this.plantaObj,
      alpha: 0.6,
      duration: 600, yoyo:true, repeat:-1, ease:'Sine.easeInOut',
    });
  }

  /* ─ Crear jugador ─ */
  _createPlayer() {
    this.pl = this.physics.add.sprite(200, this.GY, 'pw_idle')
      .setScale(1.6).setDepth(15).setCollideWorldBounds(false)
      .setOrigin(0.5, 1); // origen en el PIE del sprite — bottom center

    this.pl.body.setGravityY(G2.GRAV);
    // Con origin (0.5,1) el cuerpo ya queda alineado con los pies
    // Solo reducimos el ancho para que no choque con las paredes laterales
    this.pl.body.setSize(28, this.pl.height, false);
    this.pl.body.setOffset((this.pl.width - 28) / 2, 0);

    this.physics.add.collider(this.pl, this.plataformas);

    this._spawnSafe = true;
    this.time.delayedCall(800, () => { this._spawnSafe = false; });

    const gen = localStorage.getItem('usuario_genero') || 'masculino';
    this._isFem       = (gen === 'femenino');
    this._walkRFrames = this._isFem ? ['pw_r1','pw_r2']         : ['pw_r1','pw_r2','pw_r3'];
    this._walkLFrames = ['pw_l1','pw_l2','pw_l3'];
    this._jumpFrames  = Array.from({length:9}, (_,i) => 'pj'+(i+1));
    this._crouchFrames= this._isFem ? ['pc1','pc2','pc3','pc4'] : ['pc1','pc2','pc3'];
  }

  /* ─ Cambiar frame Y reaplicar hitbox ─
     Con origin (0.5,1) el fondo del sprite = posición Y del cuerpo.
     Solo mantenemos el ancho reducido para colisiones limpias. */
  _setFrame(key) {
    this.pl.setTexture(key);
    this.pl.body.setSize(28, this.pl.height, false);
    this.pl.body.setOffset((this.pl.width - 28) / 2, 0);
  }

  /* ─ HUD ─ */
  _createHUD() {
    const W = this.scale.width;

    // Botón salir
    const salir = this.add.text(16, 12, '← Salir', {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#d4af37',
      backgroundColor:'rgba(12,35,22,0.92)', padding:{x:9,y:6},
    }).setDepth(100).setScrollFactor(0).setInteractive({cursor:'pointer'});
    salir.on('pointerup', () => { window.location.href = 'juegos.html'; });

    // Indicador de nivel
    this.add.text(W/2, 12, `NIVEL ${this.nivel + 1} / ${G2.LEVELS}`, {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#f0d060',
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

    // Vidas
    this.hudVidas = this.add.text(W - 16, 12, `♥ ${this.vidas}`, {
      fontFamily:"'Press Start 2P'", fontSize:'12px', color:'#ff7070',
    }).setOrigin(1, 0).setDepth(100).setScrollFactor(0);

    // Progreso
    this.hudProg = this.add.text(W/2, 32, '', {
      fontFamily:"'Press Start 2P'", fontSize:'7px', color:'rgba(212,175,55,0.55)',
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);
  }

  /* ─ Cámara ─ */
  _setupCamera() {
    const lvl = NIVELES[this.nivel];
    this.cameras.main.setBounds(0, 0, lvl.worldWidth, this.scale.height);
    this.cameras.main.startFollow(this.pl, true, 0.12, 0.12);
  }

  /* ─ Input ─ */
  _setupInput() {
    this.keys = this.input.keyboard.addKeys({
      left:  Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up:    Phaser.Input.Keyboard.KeyCodes.UP,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      down:  Phaser.Input.Keyboard.KeyCodes.DOWN,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      s: Phaser.Input.Keyboard.KeyCodes.S,
    });

    // Controles táctiles — nuevo layout
    const bind = (id, dir) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.touch[dir]=true;  }, {passive:false});
      el.addEventListener('touchend',   e => { e.preventDefault(); this.touch[dir]=false; }, {passive:false});
      el.addEventListener('mousedown',  () => { this.touch[dir]=true;  });
      el.addEventListener('mouseup',    () => { this.touch[dir]=false; });
      el.addEventListener('mouseleave', () => { this.touch[dir]=false; });
    };
    bind('dp-left',  'left');
    bind('dp-right', 'right');
    bind('dp-up',    'up');
    bind('dp-down',  'down');
  }

  /* ─ Loop principal ─ */
  update(time, delta) {
    if (this.panelOpen) return;

    const pl   = this.pl;
    const k    = this.keys;
    const ts   = this.touch;
    const lvl  = NIVELES[this.nivel];

    const goLeft  = k.left.isDown  || k.a.isDown  || ts.left;
    const goRight = k.right.isDown || k.d.isDown  || ts.right;
    const goJump  = Phaser.Input.Keyboard.JustDown(k.up) ||
                    Phaser.Input.Keyboard.JustDown(k.w)  ||
                    Phaser.Input.Keyboard.JustDown(k.space) ||
                    ts.up;
    const goDown  = k.down.isDown || k.s.isDown || ts.down;

    const onGround = pl.body.blocked.down;

    // Movimiento horizontal (funciona también agachado a velocidad reducida)
    if (goLeft) {
      pl.body.setVelocityX(goDown ? -G2.SPEED * 0.45 : -G2.SPEED);
    } else if (goRight) {
      pl.body.setVelocityX(goDown ? G2.SPEED * 0.45 : G2.SPEED);
    } else {
      pl.body.setVelocityX(0);
    }

    // Salto
    if (goJump && onGround) {
      pl.body.setVelocityY(G2.JUMP);
    }

    // Agacharse — quitar el bloqueo de velocidad
    // (la velocidad ya se gestiona arriba con 0.45×)

    // ══ Sistema de animación ══
    // _setFrame() reaplica el hitbox fijo después de cada cambio de textura
    // para que Phaser no lo resetee al tamaño del nuevo frame
    if (!onGround) {
      if (this.wasOnGround) { this.jumpFrame = 0; this.jumpTimer = 0; }
      this.jumpTimer += delta;
      if (this.jumpTimer >= 60) {
        this.jumpFrame = Math.min(this.jumpFrame + 1, this._jumpFrames.length - 1);
        this.jumpTimer = 0;
      }
      this._setFrame(this._jumpFrames[this.jumpFrame]);
      this.wasOnGround = false;

    } else if (goDown) {
      const spd = (goLeft || goRight) ? 90 : 130;
      this.crouchTimer += delta;
      if (this.crouchTimer >= spd) {
        this.crouchFrame = (this.crouchFrame + 1) % this._crouchFrames.length;
        this._setFrame(this._crouchFrames[this.crouchFrame]);
        this.crouchTimer = 0;
      } else if (this.crouchFrame === 0) {
        this._setFrame(this._crouchFrames[0]);
      }
      if      (goLeft)  pl.setFlipX(true);
      else if (goRight) pl.setFlipX(false);
      this.wasOnGround = true; this.jumpFrame = 0;

    } else if (goRight) {
      pl.setFlipX(false);
      this.animTimer += delta;
      if (this.animTimer >= 120) {
        this.walkFrame = (this.walkFrame + 1) % this._walkRFrames.length;
        this._setFrame(this._walkRFrames[this.walkFrame]);
        this.animTimer = 0;
      }
      this.wasOnGround = true; this.jumpFrame = 0; this.crouchFrame = 0;

    } else if (goLeft) {
      pl.setFlipX(false);
      this.animTimer += delta;
      if (this.animTimer >= 120) {
        this.walkFrame = (this.walkFrame + 1) % this._walkLFrames.length;
        this._setFrame(this._walkLFrames[this.walkFrame]);
        this.animTimer = 0;
      }
      this.wasOnGround = true; this.jumpFrame = 0; this.crouchFrame = 0;

    } else {
      this._setFrame('pw_idle');
      pl.setFlipX(false);
      this.animTimer = 0; this.walkFrame = 0;
      this.crouchFrame = 0; this.wasOnGround = true; this.jumpFrame = 0;
    }

    // Actualizar checkpoint cada 2000 px
    if (pl.x > this.lastCheckX + 2000) {
      this.lastCheckX = Math.floor(pl.x / 2000) * 2000;
    }

    // Muerte por caída (ignorada durante spawn seguro)
    if (!this._spawnSafe && pl.y > this.scale.height + 60) {
      this._loseLife();
      return;
    }

    // Recoger planta
    if (this.plantaObj && this.plantaObj.active) {
      const dx = pl.x - this.plantaObj.x;
      const dy = pl.y - this.plantaObj.y;
      if (Math.sqrt(dx*dx + dy*dy) < 75) {
        this._collectPlant();
        return;
      }
    }

    // HUD progreso
    const pct = Math.min(Math.round((pl.x / lvl.worldWidth) * 100), 100);
    this.hudProg.setText(`${pct}% del nivel recorrido`);
  }

  /* ─ Perder una vida ─ */
  _loseLife() {
    this.vidas--;
    this.hudVidas.setText(`♥ ${this.vidas}`);
    if (this.vidas <= 0) {
      this.scene.start('GameOver2', { nivel: this.nivel });
    } else {
      // Respawn en último checkpoint
      const safeY = this.GY - 80;
      this.pl.setPosition(Math.max(this.lastCheckX + 100, 200), safeY);
      this.pl.body.setVelocity(0, 0);
      this.cameras.main.shake(300, 0.018);
      this.cameras.main.flash(500, 220, 0, 0, 0.4);
    }
  }

  /* ─ Recoger planta ─ */
  _collectPlant() {
    if (this.panelOpen) return;
    this.panelOpen = true;
    this.pl.body.setVelocity(0, 0);

    // Animar desaparición del coleccionable
    this.tweens.killTweensOf(this.plantaObj);
    this.tweens.add({
      targets: this.plantaObj,
      y: this.plantaObj.y - 40, alpha: 0, scale: 2.5,
      duration: 500, ease: 'Power2',
      onComplete: () => { this.plantaObj.destroy(); },
    });

    // Guardar XP base por recoger la planta
    const xp = parseInt(localStorage.getItem('usuario_xp') || '0');
    localStorage.setItem('usuario_xp', xp + 50);
    // ── Guardar planta en inventario (offline) ──
    if (this.plantaData?.id) {
      const _ids = new Set(JSON.parse(localStorage.getItem('plantas_encontradas') || '[]'));
      _ids.add(this.plantaData.id);
      localStorage.setItem('plantas_encontradas', JSON.stringify([..._ids]));
    }
    if (this.nivel >= G2.LEVELS - 1) {
      localStorage.setItem('mundo2_completo', '1');
    }

    // ── Llenar panel con datos de la planta ──
    const panel = document.getElementById('panel');
    if (!panel) { this._irSiguienteConTransicion(); return; }

    if (this.plantaData) {
      const imgEl = document.getElementById('pp-ico');
      if (imgEl) imgEl.innerHTML = `<div class="pp-img-wrap"><img src="${this.plantaData.img}" alt="${this.plantaData.nombre}"></div>`;
      const s = id => document.getElementById(id);
      if (s('pp-nom'))   s('pp-nom').textContent  = this.plantaData.nombre;
      if (s('pp-ci'))    s('pp-ci').textContent   = '';
      if (s('pp-desc'))  s('pp-desc').textContent = this.plantaData.desc;
      if (s('pp-usos'))  s('pp-usos').textContent = this.plantaData.usos;
      if (s('pp-prep'))  s('pp-prep').textContent = this.plantaData.prep;
      if (s('pp-ptxt'))  s('pp-ptxt').textContent = '¡Planta encontrada!';
      if (s('pp-pfill')) s('pp-pfill').style.width = '100%';
    }

    panel.classList.add('on');

    // ── Botón "Continuar" → siguiente nivel con transición ──
    const btnC = panel.querySelector('.btn-cont');
    if (btnC) {
      btnC.textContent = this.nivel < G2.LEVELS - 1
        ? 'Continuar al siguiente nivel →'
        : '¡Finalizar mundo! →';
      btnC.onclick = () => {
        panel.classList.remove('on');
        this._irSiguienteConTransicion();
      };
    }
  }

  /* ─ Transición iris → siguiente nivel ─ */
  _irSiguienteConTransicion() {
    const W = this.scale.width, H = this.scale.height;

    // Canvas overlay para efecto iris
    const overlay = document.createElement('canvas');
    overlay.width  = W; overlay.height = H;
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(overlay);

    const ctx  = overlay.getContext('2d');
    const cx   = W / 2, cy = H / 2;
    const rMax = Math.sqrt(cx * cx + cy * cy) * 1.1;
    let radio  = rMax;

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(radio, 0), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';

      radio -= rMax / 40;
      if (radio <= 0) {
        // Iris cerrado → cambiar de nivel
        setTimeout(() => {
          overlay.remove();
          this._irSiguiente();
        }, 200);
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _irSiguiente() {
    if (this.nivel < G2.LEVELS - 1) {
      this.scene.start('Game2', { nivel: this.nivel + 1 });
    } else {
      window.location.href = 'juegos.html';
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   GAME OVER SCENE
══════════════════════════════════════════════════════════════ */
class GameOverScene2 extends Phaser.Scene {
  constructor() { super('GameOver2'); }

  init(data) { this.nivelGuardado = data?.nivel || 0; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.92);

    this.add.text(W/2, H/2 - 70, '💀', {fontSize:'52px'}).setOrigin(0.5);
    this.add.text(W/2, H/2 - 10, 'GAME OVER', {
      fontFamily:"'Press Start 2P'", fontSize:'18px', color:'#ff7070',
    }).setOrigin(0.5);
    this.add.text(W/2, H/2 + 28, 'Se acabaron tus vidas', {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'rgba(255,255,255,0.65)',
    }).setOrigin(0.5);

    const mkBtn = (x, label, cb) => {
      const b = this.add.text(x, H/2 + 80, label, {
        fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#d4af37',
        backgroundColor:'rgba(45,107,74,0.9)', padding:{x:14,y:9},
      }).setOrigin(0.5).setInteractive({cursor:'pointer'});
      b.on('pointerover', () => b.setStyle({color:'#ffffff'}));
      b.on('pointerout',  () => b.setStyle({color:'#d4af37'}));
      b.on('pointerup', cb);
    };

    mkBtn(W/2 - 110, 'Reintentar', () => this.scene.start('Game2', {nivel: this.nivelGuardado}));
    mkBtn(W/2 + 110, '← Menú',    () => { window.location.href = 'juegos.html'; });
  }
}

/* ══════════════════════════════════════════════════════════════
   PHASER CONFIG
══════════════════════════════════════════════════════════════ */
const game2PhaserConfig = {
  type:   Phaser.AUTO,
  width:  window.innerWidth,
  height: window.innerHeight,
  parent: 'game-wrap',
  backgroundColor: '#1a6a3e',
  physics: {
    default: 'arcade',
    arcade:  { gravity:{ y:0 }, debug:false },
  },
  scene: [PreloadScene2, GameScene2, GameOverScene2],
  scale: {
    mode:       Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

window.addEventListener('load', () => {
  new Phaser.Game(game2PhaserConfig);
});