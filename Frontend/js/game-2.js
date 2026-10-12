/* ══════════════════════════════════════════════════════════════
   Pastuker — game-2.js  v2
   Mundo 2: Selva Profunda  •  Plataformero × 10 Niveles
   Obstáculos: fire_up, fire_down, stakes, rot1, rot2
══════════════════════════════════════════════════════════════ */
// Forzar modo horizontal
screen.orientation.lock('landscape-primary').catch(() => {});

'use strict';

/* ── Volumen global (0.0 - 1.0) controlado desde el pause ── */
let _g2vol = 0.5;

const G2 = {
  TILE:   110,
  PLATHR: 0.65,
  SPEED:  210,
  JUMP:  -680,
  GRAV:   900,
  LIVES:    3,
  LEVELS:  10,
};

/* ══════════════════════════════════════════════════════════════
   DATOS DE NIVELES
   obs: [{type, x, yo, fromTop}]
     type    : 'fu'=fire_up | 'fd'=fire_down | 'st'=stakes | 'r1'=rot1 | 'r2'=rot2
     x       : posición world X
     yo      : px sobre el suelo (0 = suelo)
     fromTop : solo para 'fd' — px desde el borde superior de pantalla
══════════════════════════════════════════════════════════════ */
const NIVELES = [

  /* ─── NIVEL 1: Introducción ─── */
  {
    worldWidth: 11000,
    ground: [[0,2000],[2500,4600],[5100,7100],[7600,9200],[9700,11000]],
    plats:[
      {x:2050,yo:150,t:2,k:'09'},{x:2320,yo:150,t:2,k:'09'},
      {x:4650,yo:150,t:2,k:'09'},{x:4900,yo:150,t:2,k:'09'},
      {x:7150,yo:150,t:2,k:'09'},{x:7410,yo:150,t:2,k:'09'},
      {x:9250,yo:150,t:2,k:'09'},{x:9500,yo:150,t:2,k:'09'},
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
    gems:[
      {x:660,   yo:200,  key:'gem_diamond'},
      {x:3110,  yo:210,  key:'gem_gem'},
      {x:10260, yo:205,  key:'gem_ruby'},
    ],
    obs:[
      {type:'st', x:700,  yo:170},
      {type:'st', x:1400, yo:210},
      {type:'fu', x:1800, yo:0},
      {type:'st', x:2290, yo:150},
      {type:'fu', x:3050, yo:180},
      {type:'fu', x:4200, yo:0},
      {type:'st', x:4875, yo:150},
      {type:'st', x:5600, yo:175},
      {type:'fd', x:6100, fromTop:55},
      {type:'fu', x:6700, yo:0},
      {type:'st', x:7385, yo:150},
      {type:'fu', x:8750, yo:0},
      {type:'st', x:8150, yo:180},
      {type:'st', x:9480, yo:150},
      {type:'fu', x:10400,yo:0},
      {type:'st', x:10800,yo:195},
    ],
  },

  /* ─── NIVEL 2: Huecos amplios ─── */
  {
    worldWidth: 11500,
    ground: [[0,1800],[2600,4300],[5200,6900],[7800,9400],[10300,11500]],
    plats:[
      {x:1850,yo:160,t:2,k:'09'},{x:2130,yo:160,t:2,k:'09'},{x:2400,yo:160,t:2,k:'09'},
      {x:4350,yo:160,t:2,k:'09'},{x:4630,yo:165,t:2,k:'11'},{x:4910,yo:160,t:2,k:'09'},
      {x:6950,yo:160,t:2,k:'09'},{x:7230,yo:165,t:2,k:'09'},{x:7510,yo:160,t:2,k:'11'},
      {x:9450,yo:160,t:2,k:'09'},{x:9730,yo:165,t:2,k:'09'},{x:10010,yo:160,t:2,k:'11'},
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
    gems:[
      {x:560,  yo:225,  key:'gem_diamond'},
      {x:5610, yo:235,  key:'gem_gem'},
      {x:9060, yo:275,  key:'gem_ruby'},
    ],
    obs:[
      {type:'st', x:600,  yo:195},
      {type:'fu', x:1200, yo:0},
      {type:'fu', x:1150, yo:245},
      {type:'st', x:2098, yo:160},
      {type:'st', x:2348, yo:160},
      {type:'st', x:2950, yo:205},
      {type:'fd', x:3400, fromTop:55},
      {type:'fu', x:3700, yo:0},
      {type:'st', x:4598, yo:160},
      {type:'st', x:4878, yo:165},
      {type:'fu', x:5600, yo:205},
      {type:'st', x:5550, yo:205},
      {type:'fd', x:6200, fromTop:60},
      {type:'st', x:7178, yo:160},
      {type:'st', x:7458, yo:165},
      {type:'fu', x:8300, yo:200},
      {type:'fd', x:9200, fromTop:55},
      {type:'fu', x:9800, yo:0},
      {type:'st', x:9698, yo:160},
      {type:'fu', x:11000,yo:0},
      {type:'st', x:10700,yo:200},
    ],
  },

  /* ─── NIVEL 3: Cadenas de plataformas ─── */
  {
    worldWidth: 12000,
    ground: [[0,1500],[2700,4000],[5200,6400],[7600,8800],[10000,12000]],
    plats:[
      {x:1560,yo:175,t:2,k:'09'},{x:1870,yo:195,t:2,k:'11'},
      {x:2180,yo:180,t:2,k:'09'},{x:2480,yo:195,t:2,k:'09'},
      {x:4060,yo:180,t:2,k:'09'},{x:4370,yo:200,t:2,k:'11'},
      {x:4680,yo:180,t:2,k:'09'},{x:4970,yo:195,t:2,k:'09'},
      {x:6460,yo:180,t:2,k:'11'},{x:6770,yo:200,t:2,k:'09'},
      {x:7080,yo:180,t:2,k:'09'},{x:7380,yo:195,t:2,k:'11'},
      {x:8860,yo:190,t:2,k:'09'},{x:9170,yo:215,t:2,k:'11'},
      {x:9480,yo:190,t:2,k:'09'},{x:9780,yo:205,t:2,k:'09'},
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
    gems:[
      {x:660,  yo:245,  key:'gem_diamond'},
      {x:3560, yo:245,  key:'gem_gem'},
      {x:8560, yo:345,  key:'gem_ruby'},
    ],
    obs:[
      {type:'st', x:700,  yo:215},
      {type:'fu', x:1600, yo:175},
      {type:'st', x:1825, yo:175},
      {type:'r1', x:2100, yo:195},
      {type:'fd', x:2500, fromTop:60},
      {type:'st', x:3000, yo:235},
      {type:'fu', x:3600, yo:305},
      {type:'r2', x:4500, yo:200},
      {type:'st', x:4323, yo:180},
      {type:'fd', x:5000, fromTop:55},
      {type:'fu', x:5600, yo:215},
      {type:'st', x:6200, yo:305},
      {type:'r1', x:7000, yo:180},
      {type:'fd', x:7500, fromTop:65},
      {type:'fu', x:8200, yo:225},
      {type:'r2', x:9000, yo:210},
      {type:'st', x:9738, yo:190},
      {type:'st', x:9880, yo:205},
      {type:'fu', x:10600,yo:215},
      {type:'fd', x:11000,fromTop:60},
    ],
  },

  /* ─── NIVEL 4: Isla flotante ─── */
  {
    worldWidth: 12000,
    ground: [[0,1000],[11000,12000]],
    plats:[
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
    gems:[
      {x:1420, yo:230,  key:'gem_diamond'},
      {x:4120, yo:245,  key:'gem_gem'},
      {x:9520, yo:240,  key:'gem_ruby'},
    ],
    obs:[
      {type:'fu', x:1410,yo:200},
      {type:'st', x:1318,yo:165},
      {type:'st', x:1618,yo:165},
      {type:'r1', x:2010,yo:200},
      {type:'fd', x:2600,fromTop:55},
      {type:'st', x:2518,yo:175},
      {type:'fu', x:3210,yo:200},
      {type:'r2', x:3810,yo:210},
      {type:'st', x:3408,yo:165},
      {type:'st', x:4110,yo:215},
      {type:'fd', x:4700,fromTop:60},
      {type:'r1', x:5310,yo:175},
      {type:'fu', x:5910,yo:210},
      {type:'r2', x:6510,yo:175},
      {type:'fd', x:7100,fromTop:55},
      {type:'fu', x:7710,yo:215},
      {type:'st', x:7618,yo:180},
      {type:'r1', x:8310,yo:175},
      {type:'fd', x:8900,fromTop:60},
      {type:'r2', x:9510,yo:210},
      {type:'st', x:9718,yo:180},
      {type:'fu', x:10110,yo:175},
      {type:'st', x:10750,yo:165},
      {type:'st', x:10960,yo:175},
    ],
  },

  /* ─── NIVEL 5: Escaleras ─── */
  {
    worldWidth: 12000,
    ground: [[0,1200],[2400,3600],[4800,6000],[7200,8400],[9600,10800],[11500,12000]],
    plats:[
      {x:1260,yo:140,t:2,k:'09'},{x:1580,yo:205,t:2,k:'11'},
      {x:1900,yo:265,t:2,k:'09'},{x:2180,yo:205,t:2,k:'11'},
      {x:3660,yo:265,t:2,k:'09'},{x:3960,yo:205,t:2,k:'11'},
      {x:4260,yo:145,t:2,k:'09'},{x:4560,yo:80,t:2,k:'11'},
      {x:6060,yo:145,t:2,k:'09'},{x:6360,yo:215,t:2,k:'11'},
      {x:6660,yo:285,t:2,k:'09'},{x:6960,yo:215,t:2,k:'11'},
      {x:8460,yo:285,t:2,k:'09'},{x:8760,yo:215,t:2,k:'11'},
      {x:9060,yo:145,t:2,k:'09'},{x:9360,yo:80,t:2,k:'11'},
      {x:10860,yo:155,t:2,k:'09'},{x:11110,yo:225,t:2,k:'11'},{x:11310,yo:305,t:2,k:'09'},
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
    gems:[
      {x:860,  yo:335,  key:'gem_diamond'},
      {x:3260, yo:355,  key:'gem_gem'},
      {x:10460,yo:355,  key:'gem_ruby'},
    ],
    obs:[
      {type:'fu', x:450,  yo:205},
      {type:'st', x:850,  yo:305},
      {type:'r1', x:1310, yo:140},
      {type:'st', x:1518, yo:140},
      {type:'fd', x:1700, fromTop:55},
      {type:'fu', x:1950, yo:265},
      {type:'st', x:2138, yo:205},
      {type:'r2', x:2650, yo:225},
      {type:'st', x:3250, yo:325},
      {type:'fu', x:3710, yo:265},
      {type:'st', x:3918, yo:205},
      {type:'fd', x:4100, fromTop:50},
      {type:'r1', x:4620, yo:80},
      {type:'st', x:4518, yo:80},
      {type:'fu', x:5050, yo:205},
      {type:'r2', x:5550, yo:315},
      {type:'fd', x:6200, fromTop:60},
      {type:'st', x:6318, yo:145},
      {type:'st', x:6710, yo:285},
      {type:'r1', x:7450, yo:205},
      {type:'fu', x:8050, yo:315},
      {type:'fd', x:8650, fromTop:55},
      {type:'st', x:8718, yo:215},
      {type:'r2', x:9120, yo:145},
      {type:'st', x:9318, yo:80},
      {type:'st', x:9850, yo:225},
      {type:'fu', x:10450,yo:325},
      {type:'r1', x:10920,yo:155},
      {type:'st', x:11118,yo:155},
      {type:'fd', x:11200,fromTop:55},
    ],
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
    gems:[
      {x:1070, yo:205,  key:'gem_diamond'},
      {x:6335, yo:212,  key:'gem_gem'},
      {x:9960, yo:208,  key:'gem_ruby'},
    ],
    obs:[
      {type:'fu', x:300,  yo:0},
      {type:'r1', x:820,  yo:175},
      {type:'st', x:993,  yo:165},
      {type:'fd', x:1000, fromTop:55},
      {type:'fu', x:1070, yo:165},
      {type:'r2', x:1620, yo:0},
      {type:'st', x:2220, yo:170},
      {type:'st', x:2603, yo:170},
      {type:'fd', x:2500, fromTop:60},
      {type:'r1', x:2660, yo:170},
      {type:'fu', x:3100, yo:0},
      {type:'st', x:3530, yo:165},
      {type:'st', x:3893, yo:165},
      {type:'r2', x:3740, yo:0},
      {type:'fd', x:4200, fromTop:55},
      {type:'fu', x:4830, yo:165},
      {type:'r1', x:5000, yo:178},
      {type:'st', x:5300, yo:165},
      {type:'fd', x:6150, fromTop:60},
      {type:'r2', x:6330, yo:182},
      {type:'fu', x:6800, yo:0},
      {type:'r1', x:7430, yo:165},
      {type:'st', x:7798, yo:165},
      {type:'fd', x:7650, fromTop:55},
      {type:'r2', x:8730, yo:170},
      {type:'fu', x:8950, yo:182},
      {type:'st', x:8750, yo:170},
      {type:'fd', x:9500, fromTop:60},
      {type:'r1', x:10030,yo:165},
      {type:'st', x:10393,yo:165},
      {type:'fu', x:10700,yo:0},
      {type:'r2', x:11330,yo:165},
      {type:'fd', x:11600,fromTop:55},
    ],
  },

  /* ─── NIVEL 7: Alturas mixtas ─── */
  {
    worldWidth: 12500,
    ground: [[0,1500],[2600,4000],[5200,6600],[7800,9000],[10200,11500],[12000,12500]],
    plats:[
      {x:1560,yo:155,t:2,k:'09'},{x:1825,yo:240,t:2,k:'11'},{x:2105,yo:160,t:2,k:'09'},{x:2390,yo:245,t:2,k:'11'},
      {x:4060,yo:245,t:2,k:'11'},{x:4345,yo:165,t:2,k:'09'},{x:4625,yo:255,t:2,k:'11'},{x:4905,yo:165,t:2,k:'09'},
      {x:6660,yo:160,t:2,k:'09'},{x:6945,yo:245,t:2,k:'11'},{x:7225,yo:165,t:2,k:'09'},{x:7510,yo:255,t:2,k:'11'},
      {x:9060,yo:250,t:2,k:'11'},{x:9345,yo:165,t:2,k:'09'},{x:9625,yo:255,t:2,k:'11'},{x:9905,yo:165,t:2,k:'09'},
      {x:11560,yo:165,t:2,k:'09'},{x:11790,yo:245,t:2,k:'11'},
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
    gems:[
      {x:960,  yo:345,  key:'gem_diamond'},
      {x:6160, yo:355,  key:'gem_gem'},
      {x:11260,yo:355,  key:'gem_ruby'},
    ],
    obs:[
      {type:'fu', x:450,  yo:205},
      {type:'r1', x:950,  yo:315},
      {type:'st', x:1250, yo:235},
      {type:'st', x:1783, yo:155},
      {type:'fd', x:1600, fromTop:50},
      {type:'r2', x:1880, yo:240},
      {type:'fu', x:2160, yo:160},
      {type:'fd', x:2500, fromTop:58},
      {type:'r1', x:2850, yo:215},
      {type:'st', x:3450, yo:325},
      {type:'r2', x:3850, yo:215},
      {type:'fd', x:4200, fromTop:55},
      {type:'fu', x:4400, yo:245},
      {type:'st', x:4623, yo:165},
      {type:'r1', x:4680, yo:255},
      {type:'fu', x:5450, yo:205},
      {type:'fd', x:5800, fromTop:50},
      {type:'r2', x:6200, yo:325},
      {type:'st', x:6720, yo:160},
      {type:'st', x:7223, yo:165},
      {type:'r1', x:7000, yo:245},
      {type:'fd', x:7400, fromTop:55},
      {type:'fu', x:8150, yo:205},
      {type:'r2', x:8650, yo:325},
      {type:'fd', x:9200, fromTop:50},
      {type:'r1', x:9380, yo:165},
      {type:'st', x:9623, yo:165},
      {type:'st', x:9680, yo:255},
      {type:'fu', x:10450,yo:215},
      {type:'r2', x:11250,yo:325},
      {type:'fd', x:11700,fromTop:55},
    ],
  },

  /* ─── NIVEL 8: Espiral ascendente y descendente ─── */
  {
    worldWidth: 12500,
    ground: [[0,900],[11500,12500]],
    plats:[
      {x:960,yo:130,t:2,k:'09'},{x:1205,yo:150,t:2,k:'11'},
      {x:1450,yo:175,t:2,k:'09'},{x:1710,yo:195,t:2,k:'11'},
      {x:1970,yo:215,t:2,k:'09'},{x:2235,yo:205,t:2,k:'09'},
      {x:2495,yo:195,t:2,k:'11'},{x:2760,yo:210,t:2,k:'09'},
      {x:3025,yo:225,t:2,k:'11'},{x:3290,yo:245,t:2,k:'09'},
      {x:3555,yo:265,t:2,k:'11'},{x:3825,yo:250,t:2,k:'09'},
      {x:4090,yo:270,t:2,k:'11'},{x:4355,yo:255,t:2,k:'09'},
      {x:4620,yo:275,t:2,k:'11'},{x:4890,yo:285,t:2,k:'09'},
      {x:5155,yo:265,t:2,k:'11'},{x:5425,yo:280,t:2,k:'09'},
      {x:5690,yo:285,t:3,k:'03'},{x:5995,yo:300,t:2,k:'11'},
      {x:6260,yo:285,t:2,k:'09'},{x:6530,yo:300,t:2,k:'11'},
      {x:6800,yo:290,t:2,k:'09'},{x:7075,yo:305,t:2,k:'11'},
      {x:7345,yo:290,t:2,k:'09'},{x:7620,yo:300,t:2,k:'09'},
      {x:7890,yo:285,t:2,k:'11'},
      {x:8155,yo:300,t:2,k:'09'},{x:8425,yo:280,t:2,k:'11'},
      {x:8695,yo:260,t:2,k:'09'},{x:8965,yo:245,t:2,k:'11'},
      {x:9235,yo:230,t:2,k:'09'},{x:9510,yo:215,t:2,k:'11'},
      {x:9780,yo:200,t:2,k:'09'},{x:10055,yo:185,t:2,k:'11'},
      {x:10325,yo:170,t:2,k:'09'},{x:10600,yo:155,t:2,k:'11'},
      {x:10870,yo:145,t:3,k:'03'},{x:11180,yo:135,t:2,k:'09'},
      {x:11390,yo:145,t:2,k:'11'},
    ],
    water:[[900,11500]],
    trees:[{x:200,k:'57'},{x:600,k:'59'},{x:11700,k:'57'},{x:12100,k:'59'}],
    decos:[{x:400,k:'64'},{x:700,k:'66'},{x:11900,k:'67'}],
    plantX:11180, plantYO:135,
    gems:[
      {x:3350, yo:275,  key:'gem_diamond'},
      {x:7135, yo:335,  key:'gem_gem'},
      {x:10660,yo:185,  key:'gem_ruby'},
    ],
    obs:[
      {type:'r1', x:1010,yo:150},
      {type:'fu', x:1260,yo:150},
      {type:'r2', x:1510,yo:175},
      {type:'fd', x:1800,fromTop:52},
      {type:'st', x:2030,yo:215},
      {type:'st', x:2233,yo:205},
      {type:'r1', x:2300,yo:195},
      {type:'fu', x:2560,yo:210},
      {type:'r2', x:2820,yo:225},
      {type:'fd', x:3100,fromTop:50},
      {type:'st', x:3310,yo:245},
      {type:'st', x:3553,yo:245},
      {type:'r1', x:3615,yo:265},
      {type:'fu', x:3880,yo:250},
      {type:'r2', x:4150,yo:270},
      {type:'fd', x:4430,fromTop:52},
      {type:'st', x:4618,yo:255},
      {type:'st', x:4680,yo:275},
      {type:'r1', x:4950,yo:285},
      {type:'fu', x:5215,yo:265},
      {type:'r2', x:5480,yo:280},
      {type:'fd', x:5800,fromTop:48},
      {type:'r1', x:6050,yo:300},
      {type:'r2', x:6320,yo:285},
      {type:'fd', x:6620,fromTop:48},
      {type:'r1', x:6860,yo:290},
      {type:'r2', x:7135,yo:305},
      {type:'fd', x:7420,fromTop:50},
      {type:'fu', x:7680,yo:300},
      {type:'r1', x:7950,yo:285},
      {type:'r2', x:8215,yo:300},
      {type:'fd', x:8500,fromTop:52},
      {type:'st', x:8755,yo:260},
      {type:'st', x:8963,yo:245},
      {type:'r1', x:9025,yo:245},
      {type:'fu', x:9295,yo:230},
      {type:'r2', x:9570,yo:215},
      {type:'fd', x:9850,fromTop:55},
      {type:'st', x:10053,yo:185},
      {type:'st', x:10115,yo:185},
      {type:'r1', x:10385,yo:170},
      {type:'fu', x:10660,yo:155},
      {type:'r2', x:10940,yo:145},
      {type:'fd', x:11250,fromTop:58},
    ],
  },

  /* ─── NIVEL 9: Plataformas estrechas ─── */
  {
    worldWidth: 13000,
    ground: [[0,800],[12200,13000]],
    plats:[
      {x:860,yo:135,t:1,k:'13'},{x:1030,yo:160,t:1,k:'15'},{x:1210,yo:145,t:1,k:'17'},
      {x:1390,yo:170,t:1,k:'13'},{x:1570,yo:155,t:1,k:'15'},{x:1750,yo:180,t:1,k:'17'},
      {x:1930,yo:165,t:1,k:'13'},{x:2110,yo:190,t:1,k:'15'},{x:2290,yo:175,t:2,k:'09'},
      {x:2555,yo:195,t:1,k:'13'},{x:2735,yo:180,t:1,k:'17'},{x:2915,yo:165,t:2,k:'11'},
      {x:3175,yo:170,t:1,k:'13'},{x:3355,yo:205,t:1,k:'15'},{x:3535,yo:180,t:2,k:'09'},
      {x:3800,yo:215,t:1,k:'13'},{x:3980,yo:190,t:1,k:'17'},{x:4160,yo:225,t:1,k:'15'},
      {x:4340,yo:200,t:2,k:'11'},{x:4605,yo:235,t:1,k:'13'},{x:4785,yo:210,t:1,k:'17'},
      {x:4965,yo:225,t:2,k:'09'},{x:5230,yo:240,t:1,k:'13'},{x:5410,yo:215,t:1,k:'15'},
      {x:5590,yo:230,t:2,k:'11'},{x:5855,yo:245,t:1,k:'13'},{x:6035,yo:220,t:1,k:'17'},
      {x:6215,yo:225,t:1,k:'13'},{x:6395,yo:250,t:1,k:'15'},{x:6575,yo:235,t:1,k:'17'},
      {x:6755,yo:255,t:1,k:'13'},{x:6935,yo:240,t:2,k:'09'},{x:7200,yo:260,t:1,k:'13'},
      {x:7380,yo:245,t:1,k:'15'},{x:7560,yo:265,t:1,k:'17'},{x:7740,yo:250,t:2,k:'11'},
      {x:8005,yo:270,t:1,k:'13'},{x:8185,yo:255,t:1,k:'15'},{x:8365,yo:265,t:2,k:'09'},
      {x:8630,yo:260,t:1,k:'13'},{x:8810,yo:245,t:1,k:'17'},{x:8990,yo:260,t:1,k:'15'},
      {x:9150,yo:255,t:2,k:'09'},{x:9415,yo:240,t:2,k:'11'},{x:9680,yo:225,t:2,k:'09'},
      {x:9945,yo:210,t:2,k:'11'},{x:10210,yo:195,t:2,k:'09'},{x:10475,yo:180,t:2,k:'11'},
      {x:10740,yo:165,t:2,k:'09'},{x:11005,yo:150,t:2,k:'11'},{x:11270,yo:165,t:2,k:'09'},
      {x:11535,yo:150,t:3,k:'03'},{x:11845,yo:155,t:2,k:'11'},{x:12060,yo:150,t:2,k:'09'},
    ],
    water:[[800,12200]],
    trees:[{x:200,k:'57'},{x:500,k:'59'},{x:12400,k:'57'},{x:12700,k:'59'}],
    decos:[{x:350,k:'64'},{x:650,k:'65'},{x:12500,k:'67'}],
    plantX:11535, plantYO:150,
    gems:[
      {x:2350, yo:205,  key:'gem_diamond'},
      {x:6995, yo:270,  key:'gem_gem'},
      {x:11600,yo:185,  key:'gem_ruby'},
    ],
    obs:[
      {type:'r1', x:960,  yo:170},
      {type:'fd', x:1100, fromTop:48},
      {type:'r2', x:1300, yo:165},
      {type:'fd', x:1470, fromTop:50},
      {type:'r1', x:1640, yo:185},
      {type:'fu', x:1810, yo:180},
      {type:'fd', x:2000, fromTop:48},
      {type:'r2', x:2200, yo:195},
      {type:'r1', x:2420, yo:175},
      {type:'fd', x:2630, fromTop:50},
      {type:'fu', x:2810, yo:180},
      {type:'r2', x:3060, yo:165},
      {type:'fd', x:3250, fromTop:48},
      {type:'r1', x:3430, yo:205},
      {type:'fu', x:3700, yo:215},
      {type:'r2', x:3870, yo:190},
      {type:'fd', x:4060, fromTop:50},
      {type:'r1', x:4230, yo:225},
      {type:'st', x:4430, yo:200},
      {type:'st', x:4603, yo:200},
      {type:'r2', x:4700, yo:235},
      {type:'fd', x:4880, fromTop:48},
      {type:'r1', x:5060, yo:225},
      {type:'fu', x:5320, yo:240},
      {type:'r2', x:5500, yo:215},
      {type:'fd', x:5690, fromTop:50},
      {type:'r1', x:5960, yo:245},
      {type:'r2', x:6130, yo:220},
      {type:'fd', x:6310, fromTop:48},
      {type:'r1', x:6490, yo:250},
      {type:'fu', x:6660, yo:235},
      {type:'r2', x:6840, yo:255},
      {type:'fd', x:7100, fromTop:50},
      {type:'r1', x:7280, yo:245},
      {type:'r2', x:7460, yo:265},
      {type:'fd', x:7650, fromTop:48},
      {type:'fu', x:7840, yo:250},
      {type:'r1', x:8110, yo:270},
      {type:'r2', x:8290, yo:255},
      {type:'fd', x:8480, fromTop:50},
      {type:'r1', x:8730, yo:260},
      {type:'r2', x:8910, yo:245},
      {type:'fd', x:9100, fromTop:48},
    ],
  },

  /* ─── NIVEL 10: Desafío Final ─── */
  {
    worldWidth: 13000,
    ground: [[0,600],[12400,13000]],
    plats:[
      {x:660,yo:160,t:2,k:'09'},{x:935,yo:190,t:1,k:'13'},{x:1110,yo:215,t:2,k:'11'},
      {x:1375,yo:170,t:1,k:'15'},{x:1545,yo:240,t:2,k:'09'},{x:1810,yo:180,t:1,k:'17'},
      {x:1985,yo:255,t:2,k:'11'},{x:2250,yo:190,t:1,k:'13'},{x:2425,yo:220,t:2,k:'09'},
      {x:2690,yo:165,t:2,k:'09'},{x:2955,yo:205,t:2,k:'11'},
      {x:3220,yo:245,t:2,k:'09'},{x:3485,yo:285,t:2,k:'11'},
      {x:3750,yo:270,t:1,k:'13'},{x:3925,yo:250,t:2,k:'09'},
      {x:4190,yo:270,t:1,k:'17'},{x:4365,yo:285,t:2,k:'11'},
      {x:4630,yo:265,t:1,k:'15'},{x:4805,yo:285,t:2,k:'09'},
      {x:5075,yo:305,t:2,k:'11'},{x:5350,yo:290,t:1,k:'13'},
      {x:5530,yo:310,t:2,k:'09'},{x:5805,yo:295,t:1,k:'15'},
      {x:5985,yo:315,t:2,k:'11'},{x:6260,yo:300,t:1,k:'17'},
      {x:6440,yo:320,t:2,k:'09'},{x:6715,yo:305,t:1,k:'13'},
      {x:6895,yo:315,t:2,k:'11'},{x:7170,yo:300,t:1,k:'15'},
      {x:7350,yo:310,t:2,k:'09'},
      {x:7720,yo:315,t:1,k:'13'},{x:7895,yo:295,t:2,k:'11'},
      {x:8160,yo:275,t:1,k:'17'},{x:8335,yo:255,t:2,k:'09'},
      {x:8600,yo:235,t:1,k:'13'},{x:8775,yo:215,t:2,k:'11'},
      {x:9040,yo:195,t:1,k:'15'},{x:9215,yo:215,t:2,k:'09'},
      {x:9480,yo:200,t:1,k:'13'},{x:9655,yo:220,t:2,k:'11'},
      {x:9920,yo:205,t:2,k:'09'},
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
    gems:[
      {x:1170, yo:245,  key:'gem_diamond'},
      {x:6060, yo:345,  key:'gem_gem'},
      {x:9280, yo:230,  key:'gem_ruby'},
    ],
    obs:[
      {type:'r1', x:720,  yo:175},
      {type:'st', x:770,  yo:160},
      {type:'fd', x:990,  fromTop:46},
      {type:'r2', x:1170, yo:215},
      {type:'st', x:1248, yo:160},
      {type:'r1', x:1430, yo:185},
      {type:'fd', x:1610, fromTop:44},
      {type:'r2', x:1870, yo:195},
      {type:'r1', x:2050, yo:255},
      {type:'fd', x:2310, fromTop:46},
      {type:'r2', x:2485, yo:220},
      {type:'fu', x:2750, yo:165},
      {type:'st', x:2808, yo:165},
      {type:'r1', x:3010, yo:205},
      {type:'fd', x:3280, fromTop:44},
      {type:'r2', x:3545, yo:285},
      {type:'st', x:3353, yo:245},
      {type:'r1', x:3810, yo:270},
      {type:'fd', x:3985, fromTop:46},
      {type:'r2', x:4250, yo:270},
      {type:'r1', x:4425, yo:285},
      {type:'st', x:4673, yo:265},
      {type:'fd', x:4695, fromTop:44},
      {type:'r2', x:4870, yo:285},
      {type:'r1', x:5135, yo:305},
      {type:'st', x:5243, yo:290},
      {type:'fd', x:5410, fromTop:42},
      {type:'r2', x:5595, yo:310},
      {type:'st', x:5803, yo:295},
      {type:'r1', x:5870, yo:295},
      {type:'fd', x:6050, fromTop:42},
      {type:'r2', x:6325, yo:315},
      {type:'st', x:6348, yo:300},
      {type:'r1', x:6505, yo:300},
      {type:'fd', x:6780, fromTop:42},
      {type:'r2', x:6960, yo:315},
      {type:'st', x:6893, yo:305},
      {type:'r1', x:7235, yo:300},
      {type:'fd', x:7415, fromTop:44},
      {type:'r2', x:7595, yo:310},
      {type:'st', x:7618, yo:295},
      {type:'r1', x:7785, yo:315},
      {type:'fu', x:7960, yo:295},
      {type:'r2', x:8225, yo:275},
      {type:'fd', x:8400, fromTop:46},
      {type:'r1', x:8665, yo:235},
      {type:'st', x:8773, yo:215},
      {type:'r2', x:8840, yo:215},
      {type:'fd', x:9105, fromTop:48},
      {type:'r1', x:9280, yo:215},
      {type:'r2', x:9545, yo:200},
      {type:'fd', x:9720, fromTop:46},
      {type:'r1', x:9985, yo:205},
      {type:'st', x:10003,yo:185},
      {type:'r2', x:10250,yo:185},
      {type:'fd', x:10515,fromTop:44},
      {type:'r1', x:10690,yo:190},
      {type:'st', x:10623,yo:185},
      {type:'r2', x:10955,yo:210},
      {type:'fd', x:11130,fromTop:44},
      {type:'r1', x:11395,yo:195},
      {type:'st', x:11183,yo:195},
      {type:'st', x:11448,yo:195},
      {type:'r2', x:11660,yo:215},
      {type:'fd', x:11835,fromTop:46},
      {type:'r1', x:12100,yo:205},
      {type:'st', x:11903,yo:205},
      {type:'r2', x:12265,yo:225},
      {type:'st', x:12268,yo:205},
      {type:'fd', x:12380,fromTop:44},
    ],
  },
];

/* ══════════════════════════════════════════════════════════════
   PRELOAD SCENE
══════════════════════════════════════════════════════════════ */
class PreloadScene2 extends Phaser.Scene {
  constructor() { super('Preload2'); }

  preload() {
    const W = this.scale.width, H = this.scale.height;
    const bgBar = this.add.rectangle(W/2, H/2, 404, 24, 0x1a4a2e).setStrokeStyle(2, 0xd4af37);
    const fill  = this.add.rectangle(W/2 - 200, H/2, 0, 18, 0xd4af37).setOrigin(0, 0.5);
    this.add.text(W/2, H/2 + 30, 'Cargando Selva...', {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#f0d060',
    }).setOrigin(0.5);
    this.load.on('progress', v => { fill.width = v * 400; });

    this.load.image('bg_jungle', '../images/game2/landscale/bg_jungle.png');
    ['03','05','07','09','11','13','15','17','19','21',
     '33','34','35','36','37','38','39','40','41',
     '52','54','57','59','63','64','65','66','67','68']
    .forEach(n => this.load.image(`jp${n}`, `../images/game2/landscale/jungle_pack_${n}.png`));

    for (let i = 1; i <= 5; i++)
      this.load.image(`plant_g${i}`, `../images/game/icons_game/plant_${i}.png`);

    this.load.image('gem_diamond', '../images/game2/game_set/Diamond_Pixel.png');
    this.load.image('gem_gem',     '../images/game2/game_set/GEM_Pixel .png');
    this.load.image('gem_ruby',    '../images/game2/game_set/Ruby_Pixel .png');
    for (let i = 1; i <= 50; i++) this.load.image('fu'+i, '../images/game2/fire_up/fire_up'+i+'.png');
    for (let i = 1; i <= 50; i++) this.load.image('fd'+i, '../images/game2/fire_down/fire_down'+i+'.png');
    this.load.image('stakes', '../images/game2/stakes/stakes.png');
    for (let i = 1; i <= 8; i++) this.load.image('ro1_'+i, '../images/game2/rotating-obstacle/rotating_obstacle'+i+'.png');
    for (let i = 1; i <= 8; i++) this.load.image('ro2_'+i, '../images/game2/rotating-obstacle2/rotating_obstacle2.'+i+'.png');

    const gen = localStorage.getItem('usuario_genero') || 'masculino';
    if (gen === 'femenino' || gen === 'mujer') {
      this.load.image('pw_r1',   '../images/game/walk-woman/walk2-right1.png');
      this.load.image('pw_r2',   '../images/game/walk-woman/walk2-right2.png');
      this.load.image('pw_l1',   '../images/game/walk-woman/walk2-left1.png');
      this.load.image('pw_l2',   '../images/game/walk-woman/walk2-left2.png');
      this.load.image('pw_l3',   '../images/game/walk-woman/walk2-left3.png');
      this.load.image('pw_idle', '../images/game/walk-woman/walk2-default.png');
      for (let i = 1; i <= 9; i++) this.load.image('pj'+i, '../images/game2/jump-woman/jump-woman'+i+'.png');
      for (let i = 1; i <= 4; i++) this.load.image('pc'+i, '../images/game2/crounch-woman/crounch-woman'+i+'.png');
    } else {
      this.load.image('pw_r1',   '../images/game/walk-men/walk-right1.png');
      this.load.image('pw_r2',   '../images/game/walk-men/walk-right2.png');
      this.load.image('pw_r3',   '../images/game/walk-men/walk-right3.png');
      this.load.image('pw_l1',   '../images/game/walk-men/walk-left1.png');
      this.load.image('pw_l2',   '../images/game/walk-men/walk-left2.png');
      this.load.image('pw_l3',   '../images/game/walk-men/walk-left3.png');
      this.load.image('pw_idle', '../images/game/walk-men/walk-default.png');
      for (let i = 1; i <= 9; i++) this.load.image('pj'+i, '../images/game2/jump-men/jump-men'+i+'.png');
      for (let i = 1; i <= 3; i++) this.load.image('pc'+i, '../images/game2/crounch-men/crunch-men'+i+'.png');
    }

    // ── Audio ──
    this.load.audio('jungle_loop',    '../audio/music/jungle_loop.ogg');
    this.load.audio('game_over_mus',  '../audio/music/game_over.wav');
    this.load.audio('sfx2_saltar',    '../audio/sfx/jump.ogg');
    this.load.audio('sfx2_daño',      '../audio/sfx/hurt.ogg');
    this.load.audio('sfx2_gema',      '../audio/sfx/recoger_gema.wav');
    this.load.audio('sfx2_planta',    '../audio/sfx/recoger_planta.wav');
    this.load.audio('sfx2_correcto',  '../audio/sfx/correct_answer.wav');
    this.load.audio('sfx2_incorrecto','../audio/sfx/wrong_answer.ogg');
    this.load.audio('sfx2_nivel',     '../audio/sfx/level_complete.wav');
  }

  create() { this.scene.start('Game2', { nivel: 0 }); }
}

/* ══════════════════════════════════════════════════════════════
   MAIN GAME SCENE
══════════════════════════════════════════════════════════════ */
class GameScene2 extends Phaser.Scene {
  constructor() { super('Game2'); }

  init(data) {
    this.nivel        = (data && data.nivel != null) ? data.nivel : 0;
    this.vidas        = (data && data.vidas != null) ? data.vidas : G2.LIVES;
    this.panelOpen    = false;
    this.lastCheckX   = 100;
    this.plantaData   = null;
    this.plantaObj    = null;
    this.animTimer    = 0;
    this.walkFrame    = 0;
    this.jumpFrame    = 0;
    this.jumpTimer    = 0;
    this.crouchFrame  = 0;
    this.crouchTimer  = 0;
    this.wasOnGround  = true;
    this._invincible  = false;
    this.touch        = { left:false, right:false, up:false, down:false };
    if (this._qTimer) clearInterval(this._qTimer);
  }

  create() {
    const H   = this.scale.height;
    const lvl = NIVELES[this.nivel];
    this.GY   = H - G2.TILE;
    this.physics.world.setBounds(0, 0, lvl.worldWidth, H);

    const cat = window.PLANTAS_CATALOGO || [];
    if (cat.length) this.plantaData = cat[Math.floor(Math.random() * cat.length)];

    this._buildLevel();
    this._buildObstacles();
    this._buildGems();
    this._createPlayer();
    this._createHUD();
    this._setupCamera();
    this._setupInput();

    // ── Música de fondo en loop — continúa si ya está sonando ──
    const yaExiste = this.sound.getAll('jungle_loop');
    if (yaExiste.length > 0 && yaExiste[0].isPlaying) {
      this._musica = yaExiste[0];
      this._musica.setVolume(_g2vol * 0.55); // restaurar volumen por si se bajó
    } else {
      this._musica = this.sound.add('jungle_loop', { loop: true, volume: _g2vol * 0.55 });
      this._musica.play();
    }
  }

  // ── Helper: reproducir SFX con volumen global ──
  _sfx(key, vol = 1.0) {
    try {
      this.sound.play(key, { volume: _g2vol * vol });
    } catch(e) {
      // silenciar errores si el sonido no está cargado
    }
  }

  /* ─ Construir nivel ─ */
  _buildLevel() {
    const lvl = NIVELES[this.nivel];
    const H   = this.scale.height;
    const WW  = lvl.worldWidth;
    const TH  = Math.round(G2.TILE * G2.PLATHR);

    this.add.tileSprite(WW/2, H/2, WW, H, 'bg_jungle').setDepth(0);
    this.plataformas = this.physics.add.staticGroup();

    (lvl.water||[]).forEach(([x0,x1]) => {
      const w = x1 - x0;
      this.add.tileSprite(x0 + w/2, H - 28, w, 55, 'jp52').setDepth(2);
    });

    (lvl.ground||[]).forEach(([x0,x1]) => {
      const w = x1 - x0, cx = x0 + w/2, cy = this.GY + G2.TILE/2;
      this.add.tileSprite(cx, cy, w, G2.TILE, 'jp03').setDepth(5);
      const b = this.plataformas.create(cx, cy, 'jp03');
      b.setDisplaySize(w, G2.TILE).refreshBody().setVisible(false);
    });

    (lvl.plats||[]).forEach(p => {
      const platW = p.t * G2.TILE;
      const cx    = p.x + platW/2;
      const cy    = this.GY - p.yo + TH/2;
      this.add.tileSprite(cx, cy, platW, TH, `jp${p.k}`).setDepth(5);
      const b = this.plataformas.create(cx, cy, `jp${p.k}`);
      b.setDisplaySize(platW, TH).refreshBody().setVisible(false);
    });

    (lvl.trees||[]).forEach(t => {
      this.add.image(t.x + 45, this.GY, `jp${t.k}`).setOrigin(0.5, 1).setScale(1.2).setDepth(4);
    });
    (lvl.decos||[]).forEach(d => {
      this.add.image(d.x + 30, this.GY, `jp${d.k}`).setOrigin(0.5, 1).setScale(1.0).setDepth(4);
    });

    const plantKey = `plant_g${(this.nivel % 5) + 1}`;
    const plantY   = this.GY - (lvl.plantYO || 0) - 35;
    this.plantaObj = this.physics.add.staticImage(lvl.plantX, plantY, plantKey).setScale(1.5).setDepth(10);
    this.tweens.add({ targets: this.plantaObj, y: plantY - 14, duration: 900, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
    this.tweens.add({ targets: this.plantaObj, alpha: 0.6, duration: 600, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
  }

  /* ─ Construir obstáculos ─ */
  _buildObstacles() {
    const lvl = NIVELES[this.nivel];
    this.obsGroup = this.physics.add.group();

    (lvl.obs || []).forEach(o => {
      const x = o.x;
      let y, spr;

      if (o.fromTop !== undefined) {
        y   = o.fromTop;
        spr = this.physics.add.sprite(x, y, 'fd1').setDepth(8).setScale(2.4).setOrigin(0.5, 0);
        this._animObs(spr, 'fd', 50, 35);
        spr.body.setSize(26, 55, false);
        spr.body.setOffset((spr.width - 26) / 2, 0);
        this._ciclFuego(spr);
      } else {
        y = this.GY - (o.yo || 0);

        switch (o.type) {
          case 'fu':
            spr = this.physics.add.sprite(x, y, 'fu1').setDepth(8).setScale(2.4).setOrigin(0.5, 1);
            this._animObs(spr, 'fu', 50, 35);
            spr.body.setSize(26, 55, false);
            spr.body.setOffset((spr.width - 26) / 2, spr.height - 55);
            this._ciclFuego(spr);
            break;

          case 'st':
            spr = this.physics.add.sprite(x, y, 'stakes').setDepth(8).setScale(2.8).setOrigin(0.5, 1);
            spr.body.setSize(Math.floor(spr.width * 0.55), Math.floor(spr.height * 0.65), false);
            spr.body.setOffset(Math.floor(spr.width * 0.22), Math.floor(spr.height * 0.30));
            break;

          case 'r1':
            spr = this.physics.add.sprite(x, y, 'ro1_1').setDepth(9).setScale(3.2).setOrigin(0.5, 0.5);
            this._animObs(spr, 'ro1_', 8, 75);
            spr.body.setCircle(22, spr.width/2 - 22, spr.height/2 - 22);
            this.tweens.add({ targets:spr, y: y - 60, duration:1100, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
            break;

          case 'r2':
            spr = this.physics.add.sprite(x, y, 'ro2_1').setDepth(9).setScale(3.2).setOrigin(0.5, 0.5);
            this._animObs(spr, 'ro2_', 8, 75);
            spr.body.setCircle(22, spr.width/2 - 22, spr.height/2 - 22);
            this.tweens.add({ targets:spr, x: x + 100, duration:1300, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
            break;
        }
      }

      if (spr) {
        spr.body.allowGravity = false;
        spr.body.immovable    = true;
        this.obsGroup.add(spr);
      }
    });
  }

  _animObs(spr, prefix, total, delay) {
    let idx = 1;
    this.time.addEvent({
      delay, loop: true,
      callback: () => {
        if (!spr.active) return;
        idx = (idx % total) + 1;
        spr.setTexture(prefix + idx);
      },
    });
  }

  _ciclFuego(spr) {
    const encender = () => {
      if (!spr.active) return;
      spr.setAlpha(1);
      spr.body.enable = true;
      this.time.delayedCall(2000, apagar);
    };
    const apagar = () => {
      if (!spr.active) return;
      spr.setAlpha(0.15);
      spr.body.enable = false;
      this.time.delayedCall(3000, encender);
    };
    const offset = Phaser.Math.Between(0, 1500);
    this.time.delayedCall(offset, encender);
  }

  _pausar() {
    this.panelOpen = true;
    this.pl.body.setVelocity(0, 0);
    const ov = document.getElementById('pause-ov');
    if (ov) ov.classList.add('on');
  }

  _buildGems() {
    const lvl = NIVELES[this.nivel];
    this._gems = [];
    if (!lvl.gems || !lvl.gems.length) return;

    const gemsKey   = `g2_gems_n${this.nivel}`;
    const recogidas = new Set(JSON.parse(localStorage.getItem(gemsKey) || '[]'));

    lvl.gems.forEach((g, i) => {
      const worldY = this.GY - g.yo;
      const keys   = ['gem_diamond', 'gem_gem', 'gem_ruby'];
      const key    = g.key || keys[i % 3];
      const scale  = key === 'gem_ruby' ? 2.2 : key === 'gem_gem' ? 2.0 : 1.8;

      if (recogidas.has(i)) {
        this._gems.push({ spr: null, key });
        return;
      }

      const spr = this.add.image(g.x, worldY, key)
        .setDepth(11).setScale(scale).setOrigin(0.5, 0.5);

      const dur = key === 'gem_ruby' ? 500 : key === 'gem_gem' ? 600 : 700;
      this.tweens.add({
        targets: spr, y: worldY - 14,
        duration: dur + Math.random() * 200,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        delay: Math.random() * 400,
      });

      this._gems.push({ spr, wx: g.x, wy: worldY, key });
    });
  }

  _collectGem(spr, idx) {
    if (!spr || !spr.active) return;
    const gx = spr.x, gy = spr.y;
    this.tweens.killTweensOf(spr);
    spr.destroy();
    if (this._gems && idx !== undefined) this._gems[idx] = { spr: null };
    this._updateGemHUD(idx);

    const gemsKey   = `g2_gems_n${this.nivel}`;
    const recogidas = new Set(JSON.parse(localStorage.getItem(gemsKey) || '[]'));
    recogidas.add(idx);
    localStorage.setItem(gemsKey, JSON.stringify([...recogidas]));
    const xpMap  = { gem_diamond:10, gem_gem:20, gem_ruby:35 };
    const xpGain = xpMap[this._gems[idx]?.key] || 10;
    const xp     = parseInt(localStorage.getItem('usuario_xp') || '0');
    localStorage.setItem('usuario_xp', xp + xpGain);
    if (window.Pastuker) Pastuker.marcarCambio();

    const colMap = { gem_diamond:'#00e5ff', gem_gem:'#00ff88', gem_ruby:'#ff4444' };
    const col    = colMap[this._gems[idx]?.key] || '#00e5ff';
    const txt    = this.add.text(gx, gy - 8, `+${xpGain} XP`, {
      fontFamily:"'Press Start 2P'", fontSize:'8px', color: col,
      stroke:'#003344', strokeThickness:3,
    }).setDepth(200);
    this.tweens.add({
      targets: txt, y: gy - 55, alpha: 0, duration: 1000,
      onComplete: () => txt.destroy(),
    });

    const colInt = { gem_diamond:0x00e5ff, gem_gem:0x00ff88, gem_ruby:0xff4444 };
    const pCol   = colInt[this._gems[idx]?.key] || 0x00e5ff;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const p = this.add.circle(gx, gy, 5, pCol, 1).setDepth(200);
      this.tweens.add({
        targets: p,
        x: gx + Math.cos(a) * 45,
        y: gy + Math.sin(a) * 45,
        alpha: 0, scaleX: 0, scaleY: 0, duration: 550,
        onComplete: () => p.destroy(),
      });
    }
    this.cameras.main.shake(120, 0.005);
    this._sfx('sfx2_gema', 0.8);  // ── SFX gema ──
  }

  _createPlayer() {
    this.pl = this.physics.add.sprite(200, this.GY, 'pw_idle')
      .setScale(1.6).setDepth(15).setCollideWorldBounds(false)
      .setOrigin(0.5, 1);

    this.pl.body.setGravityY(G2.GRAV);
    this.pl.body.setSize(28, this.pl.height, false);
    this.pl.body.setOffset((this.pl.width - 28) / 2, 0);

    this.physics.add.collider(this.pl, this.plataformas, null, (player, platform) => {
      return player.body.velocity.y >= 0 && player.body.bottom <= platform.body.top + 12;
    });

    this.physics.add.overlap(this.pl, this.obsGroup, () => {
      if (!this._invincible && !this.panelOpen) this._loseLife();
    });

    this._spawnSafe = true;
    this.time.delayedCall(800, () => { this._spawnSafe = false; });

    const gen = localStorage.getItem('usuario_genero') || 'masculino';
    this._isFem       = (gen === 'femenino' || gen === 'mujer');
    this._walkRFrames = this._isFem ? ['pw_r1','pw_r2']         : ['pw_r1','pw_r2','pw_r3'];
    this._walkLFrames = ['pw_l1','pw_l2','pw_l3'];
    this._jumpFrames  = Array.from({length:9}, (_,i) => 'pj'+(i+1));
    this._crouchFrames= this._isFem ? ['pc1','pc2','pc3','pc4'] : ['pc1','pc2','pc3'];
  }

  _setFrame(key) {
    this.pl.setTexture(key);
    this.pl.body.setSize(28, this.pl.height, false);
    this.pl.body.setOffset((this.pl.width - 28) / 2, 0);
  }

  _createHUD() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.add.rectangle(W/2, 22, W, 44, 0x000000, 0.55)
      .setDepth(99).setScrollFactor(0);

    const pausaBtn = this.add.text(14, 11, '⏸', {
      fontFamily:"'Press Start 2P'", fontSize:'13px', color:'#d4af37',
      backgroundColor:'rgba(12,35,22,0.85)',
      padding:{x:8,y:5},
      stroke:'#000000', strokeThickness:3,
    }).setDepth(100).setScrollFactor(0).setInteractive({cursor:'pointer'});
    pausaBtn.on('pointerover', () => pausaBtn.setStyle({color:'#ffffff'}));
    pausaBtn.on('pointerout',  () => pausaBtn.setStyle({color:'#d4af37'}));
    pausaBtn.on('pointerup',   () => { this._pausar(); });

    this.add.text(W/2, 13, `NIVEL  ${this.nivel + 1} / ${G2.LEVELS}`, {
      fontFamily:"'Press Start 2P'", fontSize:'10px', color:'#f0d060',
      stroke:'#000000', strokeThickness:4,
    }).setOrigin(0.5, 0).setDepth(100).setScrollFactor(0);

    const barW = Math.round(W * 0.35);
    this._progBarBg = this.add.rectangle(W/2, 34, barW, 6, 0x1a4a2e, 0.9)
      .setDepth(100).setScrollFactor(0).setOrigin(0.5, 0.5);
    this._progBarFill = this.add.rectangle(W/2 - barW/2, 34, 0, 6, 0xd4af37, 1)
      .setDepth(101).setScrollFactor(0).setOrigin(0, 0.5);

    this.hudVidas = this.add.text(W - 14, 13, `♥ ${this.vidas}`, {
      fontFamily:"'Press Start 2P'", fontSize:'13px', color:'#ff5555',
      stroke:'#000000', strokeThickness:4,
    }).setOrigin(1, 0).setDepth(100).setScrollFactor(0);

    this._gemHudSprites = [];
    const lvl       = NIVELES[this.nivel];
    const gemsKey   = `g2_gems_n${this.nivel}`;
    const recogidas = new Set(JSON.parse(localStorage.getItem(gemsKey) || '[]'));
    const gemDefs   = lvl.gems || [];
    const gemStartX = 100;
    const gemY      = 22;

    gemDefs.forEach((g, i) => {
      const keys  = ['gem_diamond', 'gem_gem', 'gem_ruby'];
      const key   = g.key || keys[i % 3];
      const cx    = gemStartX + i * 44;
      const isRec = recogidas.has(i);

      this.add.circle(cx, gemY, 15, 0x000000, 0.5)
        .setDepth(99).setScrollFactor(0);

      const img = this.add.image(cx, gemY, key)
        .setDepth(100).setScrollFactor(0)
        .setDisplaySize(28, 28)
        .setAlpha(isRec ? 1.0 : 0.22);

      if (isRec) {
        this.tweens.add({
          targets: img, alpha: 0.65, duration: 500,
          yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      }

      this._gemHudSprites.push({ img, key });
    });
  }

  _updateGemHUD(idx) {
    if (!this._gemHudSprites || !this._gemHudSprites[idx]) return;
    const img = this._gemHudSprites[idx].img;
    this.tweens.killTweensOf(img);
    this.tweens.add({
      targets: img, displayWidth: 36, displayHeight: 36, duration: 120,
      yoyo: true,
      onComplete: () => {
        img.setDisplaySize(28, 28).setAlpha(1.0);
        this.tweens.add({
          targets: img, alpha: 0.65, duration: 500,
          yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
        });
      },
    });
  }

  _setupCamera() {
    const lvl = NIVELES[this.nivel];
    this.cameras.main.setBounds(0, 0, lvl.worldWidth, this.scale.height);
    this.cameras.main.startFollow(this.pl, true, 0.12, 0.12);
  }

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
    const bind = (id, dir) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', e => { e.preventDefault(); this.touch[dir]=true;  }, {passive:false});
      el.addEventListener('touchend',   e => { e.preventDefault(); this.touch[dir]=false; }, {passive:false});
      el.addEventListener('mousedown',  () => { this.touch[dir]=true;  });
      el.addEventListener('mouseup',    () => { this.touch[dir]=false; });
      el.addEventListener('mouseleave', () => { this.touch[dir]=false; });
    };
    bind('dp-left','left'); bind('dp-right','right');
    bind('dp-up','up');     bind('dp-down','down');
  }

  update(time, delta) {
    if (this.panelOpen) return;

    const pl  = this.pl;
    const k   = this.keys;
    const ts  = this.touch;
    const lvl = NIVELES[this.nivel];

    const goLeft  = k.left.isDown  || k.a.isDown  || ts.left;
    const goRight = k.right.isDown || k.d.isDown  || ts.right;
    const goJump  = Phaser.Input.Keyboard.JustDown(k.up)    ||
                    Phaser.Input.Keyboard.JustDown(k.w)     ||
                    Phaser.Input.Keyboard.JustDown(k.space) ||
                    ts.up;
    const goDown  = k.down.isDown || k.s.isDown || ts.down;
    const onGround = pl.body.blocked.down;

    if (goLeft)       pl.body.setVelocityX(goDown ? -G2.SPEED * 0.45 : -G2.SPEED);
    else if (goRight) pl.body.setVelocityX(goDown ?  G2.SPEED * 0.45 :  G2.SPEED);
    else              pl.body.setVelocityX(0);

    if (goJump && onGround) {
      pl.body.setVelocityY(G2.JUMP);
      this._sfx('sfx2_saltar', 0.7);
    }

    if (!onGround) {
      if (this.wasOnGround) { this.jumpFrame = 0; this.jumpTimer = 0; }
      this.jumpTimer += delta;
      if (this.jumpTimer >= 60) { this.jumpFrame = Math.min(this.jumpFrame + 1, this._jumpFrames.length - 1); this.jumpTimer = 0; }
      this._setFrame(this._jumpFrames[this.jumpFrame]);
      this.wasOnGround = false;
    } else if (goDown) {
      const spd = (goLeft || goRight) ? 90 : 130;
      this.crouchTimer += delta;
      if (this.crouchTimer >= spd) { this.crouchFrame = (this.crouchFrame+1) % this._crouchFrames.length; this._setFrame(this._crouchFrames[this.crouchFrame]); this.crouchTimer = 0; }
      else if (this.crouchFrame === 0) this._setFrame(this._crouchFrames[0]);
      if      (goLeft)  pl.setFlipX(true);
      else if (goRight) pl.setFlipX(false);
      this.wasOnGround = true; this.jumpFrame = 0;
    } else if (goRight) {
      pl.setFlipX(false);
      this.animTimer += delta;
      if (this.animTimer >= 120) { this.walkFrame = (this.walkFrame+1) % this._walkRFrames.length; this._setFrame(this._walkRFrames[this.walkFrame]); this.animTimer = 0; }
      this.wasOnGround = true; this.jumpFrame = 0; this.crouchFrame = 0;
    } else if (goLeft) {
      pl.setFlipX(false);
      this.animTimer += delta;
      if (this.animTimer >= 120) { this.walkFrame = (this.walkFrame+1) % this._walkLFrames.length; this._setFrame(this._walkLFrames[this.walkFrame]); this.animTimer = 0; }
      this.wasOnGround = true; this.jumpFrame = 0; this.crouchFrame = 0;
    } else {
      this._setFrame('pw_idle'); pl.setFlipX(false);
      this.animTimer = 0; this.walkFrame = 0; this.crouchFrame = 0; this.wasOnGround = true; this.jumpFrame = 0;
    }

    if (pl.x > this.lastCheckX + 2000) {
      const sobresuelo = (lvl.ground || []).some(([x0,x1]) => pl.x >= x0 && pl.x <= x1);
      if (sobresuelo) this.lastCheckX = Math.floor(pl.x / 2000) * 2000;
    }

    if (!this._spawnSafe && !this._invincible && pl.y > this.scale.height + 60) {
      this._loseLife(); return;
    }

    if (this._gems) {
      this._gems.forEach((g, i) => {
        if (!g.spr || !g.spr.active) return;
        const dx = pl.x - g.spr.x, dy = pl.y - g.spr.y;
        if (Math.sqrt(dx*dx + dy*dy) < 55) this._collectGem(g.spr, i);
      });
    }

    if (this.plantaObj && this.plantaObj.active) {
      const dx = pl.x - this.plantaObj.x, dy = pl.y - this.plantaObj.y;
      if (Math.sqrt(dx*dx + dy*dy) < 75) { this._collectPlant(); return; }
    }

    const pct = Math.min(pl.x / lvl.worldWidth, 1);
    if (this._progBarFill && this._progBarBg) {
      const barW = Math.round(this.scale.width * 0.35);
      this._progBarFill.width = Math.round(barW * pct);
    }
  }

  _getSafeSpawn(checkX) {
    const lvl    = NIVELES[this.nivel];
    const startX = Math.max(checkX, 100);

    let mejorX = -1, mejorDist = Infinity;
    (lvl.ground || []).forEach(([x0, x1]) => {
      if (x1 <= startX + 50) {
        const cx   = Math.min(x1 - 60, Math.max(x0 + 60, startX - 50));
        const dist = startX - cx;
        if (dist >= 0 && dist < mejorDist) { mejorDist = dist; mejorX = cx; }
      } else if (x0 <= startX) {
        const cx = Math.min(startX, x1 - 60);
        if (startX - x0 < mejorDist) { mejorDist = startX - x0; mejorX = cx; }
      }
    });

    if (mejorX > 0) return { x: mejorX, y: this.GY - 80 };
    const primerSuelo = (lvl.ground || [[0, 400]])[0];
    return { x: primerSuelo[0] + 120, y: this.GY - 80 };
  }

  _loseLife() {
    this.vidas--;
    this.hudVidas.setText(`♥ ${this.vidas}`);
    this._sfx('sfx2_daño', 0.9);

    if (this.vidas <= 0) {
      for (let n = 0; n < G2.LEVELS; n++) {
        localStorage.removeItem(`g2_gems_n${n}`);
      }
      // Detener música de fondo completamente antes del game over
      if (this._musica) {
        this._musica.stop();
        this._musica = null;
      }
      this.sound.stopAll(); // asegurarse de que no quede nada sonando
      this.cameras.main.flash(600, 220, 0, 0, 0.8);
      this.time.delayedCall(700, () => {
        this.scene.start('GameOver2', { nivel: this.nivel });
      });
      return;
    }

    // Aún hay vidas → reiniciar nivel SIN tocar la música
    this._invincible = true;
    this.cameras.main.shake(280, 0.025);
    this.cameras.main.flash(450, 220, 0, 0, 0.5);
    this.time.delayedCall(600, () => {
      this.scene.start('Game2', { nivel: this.nivel, vidas: this.vidas });
    });
  }

  _collectPlant() {
    if (this.panelOpen) return;
    this.panelOpen = true;
    this.pl.body.setVelocity(0, 0);

    this.tweens.killTweensOf(this.plantaObj);
    this.tweens.add({
      targets: this.plantaObj, y: this.plantaObj.y - 40, alpha: 0, scale: 2.5,
      duration: 500, ease: 'Power2', onComplete: () => { this.plantaObj.destroy(); },
    });
    this._sfx('sfx2_planta', 0.85);  // ── SFX planta ──

    const xp = parseInt(localStorage.getItem('usuario_xp') || '0');
    localStorage.setItem('usuario_xp', xp + 50);
    if (this.plantaData?.id) {
      const _ids = new Set(JSON.parse(localStorage.getItem('plantas_encontradas') || '[]'));
      _ids.add(this.plantaData.id);
      localStorage.setItem('plantas_encontradas', JSON.stringify([..._ids]));
    }
    if (this.nivel >= G2.LEVELS - 1) localStorage.setItem('mundo2_completo', '1');
    if (window.Pastuker) Pastuker.marcarCambio();

    const panel = document.getElementById('panel');
    if (!panel) { this._iniciarQuizPlanta(); return; }

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

    const btnC = panel.querySelector('.btn-cont');
    if (btnC) {
      btnC.textContent = 'Responder pregunta →';
      btnC.onclick = () => {
        panel.classList.remove('on');
        this._iniciarQuizPlanta();
      };
    }
  }

  _iniciarQuizPlanta() {
    const pregs = this.plantaData?.preguntas;
    if (!pregs || !pregs.length) { this._irSiguienteConTransicion(); return; }

    const q   = pregs[Math.floor(Math.random() * pregs.length)];
    const qOv = document.getElementById('quiz-ov');
    if (!qOv) { this._irSiguienteConTransicion(); return; }

    const qpEl = document.querySelector('.qpreg');
    const qnEl = document.querySelector('.qp');
    const timEl = document.querySelector('.qtim');
    const barEl = document.querySelector('.qbf');
    if (qpEl) qpEl.textContent = q.p;
    if (qnEl) qnEl.textContent = '1 / 1';

    const opts = document.querySelectorAll('.qopt');
    opts.forEach((b, i) => {
      b.textContent         = q.o[i] || '';
      b.className           = 'qopt';
      b.disabled            = false;
      b.style.pointerEvents = 'auto';
      b.style.background    = '';
      b.style.borderColor   = '';
      b.style.color         = '';
      b.onclick = () => {
        clearInterval(this._qTimer);
        opts.forEach(o => { o.disabled = true; o.style.pointerEvents = 'none'; });
        const correcto = i === q.c;
        if (correcto) {
          b.classList.add('ok');
          const xp = parseInt(localStorage.getItem('usuario_xp') || '0');
          localStorage.setItem('usuario_xp', xp + 25);
          if (window.Pastuker) Pastuker.marcarCambio();
          this._sfx('sfx2_correcto', 0.8);  // ── SFX correcto ──
        } else {
          b.classList.add('mal');
          if (opts[q.c]) opts[q.c].classList.add('ok');
          this._sfx('sfx2_incorrecto', 0.8); // ── SFX incorrecto ──
        }
        setTimeout(() => {
          qOv.classList.remove('on');
          this._irSiguienteConTransicion();
        }, 1400);
      };
    });

    let t = 20;
    if (timEl) { timEl.textContent = t; timEl.classList.remove('r'); }
    if (barEl)  { barEl.style.transition = 'none'; barEl.style.width = '100%'; }
    setTimeout(() => {
      if (barEl) { barEl.style.transition = `width 20s linear`; barEl.style.width = '0%'; }
    }, 50);

    clearInterval(this._qTimer);
    this._qTimer = setInterval(() => {
      t--;
      if (timEl) { timEl.textContent = t; if (t <= 5) timEl.classList.add('r'); }
      if (barEl)  barEl.style.width = (t / 20 * 100) + '%';
      if (t <= 0) {
        clearInterval(this._qTimer);
        opts.forEach(o => { o.disabled = true; o.style.pointerEvents = 'none'; });
        if (opts[q.c]) opts[q.c].classList.add('ok');
        setTimeout(() => { qOv.classList.remove('on'); this._irSiguienteConTransicion(); }, 1400);
      }
    }, 1000);

    qOv.classList.add('on');
  }

  _irSiguienteConTransicion() {
    const W = this.scale.width, H = this.scale.height;
    const overlay = document.createElement('canvas');
    overlay.width = W; overlay.height = H;
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;';
    document.body.appendChild(overlay);
    const ctx = overlay.getContext('2d');
    const cx = W/2, cy = H/2;
    const rMax = Math.sqrt(cx*cx + cy*cy) * 1.1;
    let radio = rMax;
    const tick = () => {
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle = '#000000'; ctx.fillRect(0,0,W,H);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, Math.max(radio,0), 0, Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      radio -= rMax / 40;
      if (radio <= 0) { setTimeout(() => { overlay.remove(); this._irSiguiente(); }, 200); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  _irSiguiente() {
    const tempKey = `g2_gems_n${this.nivel}`;
    const invKey  = `g2_inv_n${this.nivel}`;

    const temp = new Set(JSON.parse(localStorage.getItem(tempKey) || '[]'));
    const inv  = new Set(JSON.parse(localStorage.getItem(invKey)  || '[]'));
    [...temp].forEach(i => inv.add(i));
    localStorage.setItem(invKey, JSON.stringify([...inv]));
    localStorage.removeItem(tempKey);
    if (window.Pastuker) Pastuker.marcarCambio();  // gemas del nivel → servidor

    // ── SFX nivel completo + detener música limpiamente ──
    this._sfx('sfx2_nivel', 0.9);
    if (this._musica) {
      this._musica.stop();
      this._musica = null;
    }

    if (this.nivel < G2.LEVELS - 1) this.scene.start('Game2', { nivel: this.nivel + 1 });
    else window.location.href = 'juegos.html';
  }
}

/* ══════════════════════════════════════════════════════════════
   GAME OVER SCENE — con quiz de segunda oportunidad
══════════════════════════════════════════════════════════════ */
class GameOverScene2 extends Phaser.Scene {
  constructor() { super('GameOver2'); }

  init(data) {
    this.nivelGuardado     = data?.nivel || 0;
    this._vidasRecuperadas = 0;
    this._pregIdx          = 0;
    this._preguntas        = [];
    this._qContainer       = null;
    this._goTimer          = null;
    this._taitaAnim        = null;
  }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // HTML: Taita con burbuja de diálogo
    this._showTaitaOverlay();

    // ── Música Game Over ──
    this.sound.add('game_over_mus', { loop: false, volume: _g2vol * 0.7 }).play();

    // Fondo oscuro
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.93);

    // Ícono y título
    this.add.text(W/2, H * 0.11, '💀', { fontSize:'52px' }).setOrigin(0.5);
    this.add.text(W/2, H * 0.21, 'GAME OVER', {
      fontFamily:"'Press Start 2P'", fontSize:'18px', color:'#ff7070',
      stroke:'#000', strokeThickness:4,
    }).setOrigin(0.5);
    this.add.text(W/2, H * 0.30, '¿Quieres una segunda oportunidad?', {
      fontFamily:"'Press Start 2P'", fontSize:'7px', color:'rgba(255,255,255,0.7)',
    }).setOrigin(0.5);
    this.add.text(W/2, H * 0.35, 'Responde 3 preguntas · cada acierto = 1 vida', {
      fontFamily:"'Press Start 2P'", fontSize:'7px', color:'#7dbf8a',
    }).setOrigin(0.5);

    // Indicador de vidas recuperadas
    this.vidaTexto = this.add.text(W/2, H * 0.41, '♡ ♡ ♡  →  0 recuperadas', {
      fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#ff5555',
      stroke:'#000', strokeThickness:3,
    }).setOrigin(0.5);

    // Botones
    const mkBtn = (x, y, label, col, cb) => {
      const b = this.add.text(x, y, label, {
        fontFamily:"'Press Start 2P'", fontSize:'9px', color: col,
        backgroundColor:'rgba(45,107,74,0.9)', padding:{x:14,y:9},
        stroke:'#000', strokeThickness:2,
      }).setOrigin(0.5).setInteractive({cursor:'pointer'});
      b.on('pointerover', () => b.setStyle({color:'#ffffff'}));
      b.on('pointerout',  () => b.setStyle({color: col}));
      b.on('pointerup', cb);
      return b;
    };

    this.btnQuiz = mkBtn(W/2, H * 0.51, '⚡ Responder preguntas', '#d4af37', () => {
      this.btnQuiz.setVisible(false);
      this.btnSaltar.setVisible(false);
      this._prepararQuizSegundaOp();
    });
    this.btnSaltar = mkBtn(W/2, H * 0.61, '← Salir al menú', '#aaaaaa', () => {
      this._finGameOver(false);
    });
  }

  /* ── HTML: Taita centrado con burbuja a su derecha ── */
  _showTaitaOverlay() {
    const existing = document.getElementById('go-taita-ov');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'go-taita-ov';
    div.style.cssText = [
      'position:fixed', 'bottom:0', 'left:50%', 'transform:translateX(-50%)',
      'z-index:500', 'display:flex', 'flex-direction:row', 'align-items:flex-end',
      'gap:12px', 'pointer-events:none',
    ].join(';');

    div.innerHTML = `
      <img id="go-taita-img" src="../images/taita/taita_frame1.png"
        style="width:130px;height:auto;image-rendering:pixelated;
               filter:drop-shadow(0 4px 18px rgba(0,0,0,0.95));
               flex-shrink:0;">
      <div style="
        background:rgba(12,35,22,0.97);
        border:2px solid #d4af37;
        border-radius:12px 12px 12px 0;
        padding:14px 18px;
        max-width:240px;
        margin-bottom:20px;
        position:relative;
        text-align:left;
      ">
        <p style="
          font-family:'Press Start 2P',monospace;
          font-size:7px;color:#f0d060;
          line-height:2;margin:0;
        ">¡Ánimo, joven!<br>Tienes la oportunidad<br>de responder preguntas<br>para ganar vidas extra.</p>
        <div style="
          position:absolute;bottom:14px;left:-10px;
          width:0;height:0;
          border-top:10px solid transparent;
          border-bottom:10px solid transparent;
          border-right:10px solid #d4af37;
        "></div>
      </div>`;
    document.body.appendChild(div);

    let frame = 1;
    this._taitaAnim = setInterval(() => {
      const img = document.getElementById('go-taita-img');
      if (!img) { clearInterval(this._taitaAnim); return; }
      frame = frame === 1 ? 2 : 1;
      img.src = `../images/taita/taita_frame${frame}.png`;
    }, 480);
  }

  _hideTaitaOverlay() {
    if (this._taitaAnim) { clearInterval(this._taitaAnim); this._taitaAnim = null; }
    const el = document.getElementById('go-taita-ov');
    if (el) el.remove();
  }

  /* ── HTML: imagen grande de la planta ── */
  _showPlantImg(src, nombre) {
    const existing = document.getElementById('go-plant-ov');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.id = 'go-plant-ov';
    div.style.cssText = [
      'position:fixed','top:0','left:0','width:100vw',
      'height:55vh',
      'z-index:600','pointer-events:none',
      'display:flex','flex-direction:column','align-items:center',
      'justify-content:center','gap:8px',
    ].join(';');
    div.innerHTML = `
      <img src="${src}" alt="${nombre}" style="
        height:calc(55vh - 48px);
        width:auto;
        max-width:90vw;
        object-fit:contain;
        image-rendering:pixelated;
        border:3px solid #d4af37;
        border-radius:12px;
        filter:drop-shadow(0 4px 18px rgba(0,0,0,0.9))
               drop-shadow(0 0 28px rgba(212,175,55,0.35));
        display:block;">
      <span style="
        font-family:'Press Start 2P',monospace;font-size:10px;
        color:#f0d060;letter-spacing:1px;
        text-shadow:0 2px 8px rgba(0,0,0,0.9);
      ">${nombre}</span>`;
    document.body.appendChild(div);
  }

  _hidePlantImg() {
    const el = document.getElementById('go-plant-ov');
    if (el) el.remove();
  }

  /* ─ Preparar preguntas aleatorias de todo el catálogo ─ */
  _prepararQuizSegundaOp() {
    this._hideTaitaOverlay();

    // Ocultar controles táctiles
    ['dp-left','dp-right','dp-up','dp-down'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Overlay negro sólido que tapa el fondo de Game Over
    const existing = document.getElementById('go-quiz-bg');
    if (existing) existing.remove();
    const bg = document.createElement('div');
    bg.id = 'go-quiz-bg';
    bg.style.cssText = [
      'position:fixed','top:0','left:0','width:100vw','height:100vh',
      'background:#0c1a10','z-index:490','pointer-events:none',
    ].join(';');
    document.body.appendChild(bg);

    // Subir el canvas de Phaser por encima del fondo pero debajo de la imagen de planta
    const canvas = document.querySelector('#game-wrap canvas') || document.querySelector('canvas');
    if (canvas) {
      canvas.style.position = 'relative';
      canvas.style.zIndex   = '550';
    }

    const cat = window.PLANTAS_CATALOGO || [];
    let banco = [];
    cat.forEach(p => banco = banco.concat(
      (p.preguntas || []).map(q => ({ ...q, plantaImg: p.img, plantaNom: p.nombre }))
    ));
    banco = banco.sort(() => Math.random() - 0.5).slice(0, 3);
    this._preguntas = banco;
    this._pregIdx   = 0;
    this._mostrarPreguntaGO();
  }

  _mostrarPreguntaGO() {
    if (this._pregIdx >= this._preguntas.length) {
      this._finGameOver(true); return;
    }

    const q = this._preguntas[this._pregIdx];

    // Imagen de la planta
    this._showPlantImg(q.plantaImg, q.plantaNom);

    // Limpiar panel HTML anterior
    const oldPanel = document.getElementById('go-quiz-panel');
    if (oldPanel) oldPanel.remove();
    if (this._qContainer) { this._qContainer.destroy(); this._qContainer = null; }

    // Actualizar corazones en el texto Phaser de vidas
    const corazones = '♥'.repeat(this._vidasRecuperadas) + '♡'.repeat(3 - this._vidasRecuperadas);
    if (this.vidaTexto) this.vidaTexto.setText(`${corazones}  →  ${this._vidasRecuperadas} recuperadas`);

    // ── Panel completamente en HTML ──
    const panel = document.createElement('div');
    panel.id = 'go-quiz-panel';
    panel.style.cssText = [
      'position:fixed', 'bottom:0', 'left:0', 'width:100vw',
      'height:45vh',
      'z-index:620',
      'display:flex', 'flex-direction:column', 'align-items:center',
      'justify-content:center', 'gap:14px',
      'padding:0 20px', 'box-sizing:border-box',
      'background:rgba(12,26,16,0.98)',
      'border-top:2px solid #2d6b4a',
    ].join(';');

    // Número de pregunta + timer en la misma fila
    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;width:100%;max-width:520px;';
    topRow.innerHTML = `
      <span id="go-q-num" style="font-family:'Press Start 2P',monospace;font-size:9px;color:#7dbf8a;">
        Pregunta ${this._pregIdx + 1} / 3
      </span>
      <span id="go-q-timer" style="font-family:'Press Start 2P',monospace;font-size:22px;color:#d4af37;">20</span>`;
    panel.appendChild(topRow);

    // Texto de la pregunta
    const pregDiv = document.createElement('div');
    pregDiv.style.cssText = [
      'font-family:\'Press Start 2P\',monospace', 'font-size:9px', 'color:#ffffff',
      'text-align:center', 'line-height:2', 'max-width:480px',
      'text-shadow:0 2px 6px rgba(0,0,0,0.9)',
    ].join(';');
    pregDiv.textContent = q.p;
    panel.appendChild(pregDiv);

    // Grid 2×2 de opciones
    const grid = document.createElement('div');
    grid.style.cssText = [
      'display:grid', 'grid-template-columns:1fr 1fr',
      'gap:10px', 'width:100%', 'max-width:520px',
    ].join(';');

    q.o.forEach((txt, i) => {
      const btn = document.createElement('button');
      btn.id = `go-opt-${i}`;
      btn.style.cssText = [
        'font-family:Nunito,sans-serif', 'font-weight:700', 'font-size:13px',
        'color:#e8f5e9', 'background:#1a4a2e',
        'border:2px solid #2d6b4a', 'border-radius:8px',
        'padding:14px 10px', 'cursor:pointer',
        'text-align:center', 'line-height:1.4',
        'transition:background 0.15s',
      ].join(';');
      btn.textContent = txt;
      btn.onmouseover = () => { if (!btn.disabled) btn.style.background = '#2d6b4a'; };
      btn.onmouseout  = () => { if (!btn.disabled) btn.style.background = '#1a4a2e'; };
      btn.onclick = () => this._responderGO(i, q.c);
      grid.appendChild(btn);
    });
    panel.appendChild(grid);

    document.body.appendChild(panel);

    // Timer en HTML
    this._timerVal = 20;
    clearInterval(this._goTimer);
    this._goTimer = setInterval(() => {
      this._timerVal--;
      const timerEl = document.getElementById('go-q-timer');
      if (timerEl) {
        timerEl.textContent = this._timerVal;
        timerEl.style.color = this._timerVal <= 5 ? '#ff5555' : '#d4af37';
      }
      if (this._timerVal <= 0) {
        clearInterval(this._goTimer);
        this._responderGO(-1, q.c);
      }
    }, 1000);
  }

  _responderGO(idx, correcto) {
    clearInterval(this._goTimer);

    const esCorr = idx === correcto;
    if (esCorr) {
      this._vidasRecuperadas++;
      this.sound.play('sfx2_correcto',  { volume: _g2vol * 0.8 });
    } else {
      this.sound.play('sfx2_incorrecto', { volume: _g2vol * 0.8 });
    }

    // Colorear botones: verde el correcto, rojo el elegido si fue incorrecto
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`go-opt-${i}`);
      if (!btn) continue;
      btn.disabled = true;
      btn.style.cursor = 'default';
      if (i === correcto) {
        btn.style.background   = '#2ea043';
        btn.style.borderColor  = '#2ea043';
        btn.style.color        = '#ffffff';
      } else if (i === idx) {
        btn.style.background   = '#c83232';
        btn.style.borderColor  = '#c83232';
      }
    }

    // Actualizar corazones
    const corazones = '♥'.repeat(this._vidasRecuperadas) + '♡'.repeat(3 - this._vidasRecuperadas);
    if (this.vidaTexto) this.vidaTexto.setText(`${corazones}  →  ${this._vidasRecuperadas} recuperadas`);

    this._pregIdx++;
    this.time.delayedCall(1300, () => {
      this._hidePlantImg();
      const oldPanel = document.getElementById('go-quiz-panel');
      if (oldPanel) oldPanel.remove();
      this._mostrarPreguntaGO();
    });
  }

  _finGameOver(respondio) {
    clearInterval(this._goTimer);
    this._hideTaitaOverlay();
    this._hidePlantImg();
    if (this._qContainer) { this._qContainer.destroy(); this._qContainer = null; }

    ['dp-left','dp-right','dp-up','dp-down'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });

    const canvas = document.querySelector('#game-wrap canvas') || document.querySelector('canvas');
    if (canvas) { canvas.style.position = ''; canvas.style.zIndex = ''; }

    const qPanel = document.getElementById('go-quiz-panel');
    if (qPanel) qPanel.remove();

    const bg = document.getElementById('go-quiz-bg');
    if (bg) bg.remove();

    for (let n = 0; n < G2.LEVELS; n++) {
      localStorage.removeItem(`g2_gems_n${n}`);
    }

    // Detener todos los sonidos antes de navegar o reiniciar
    this.sound.stopAll();

    if (respondio && this._vidasRecuperadas > 0) {
      this.scene.start('Game2', { nivel: this.nivelGuardado, vidas: this._vidasRecuperadas });
    } else {
      // Sin vidas o salió → volver a juegos.html
      window.location.href = 'juegos.html';
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   PHASER CONFIG
══════════════════════════════════════════════════════════════ */
const game2PhaserConfig = {
  type:   Phaser.AUTO,
  parent: 'game-wrap',
  backgroundColor: '#1a6a3e',
  physics: {
    default: 'arcade',
    arcade:  { gravity:{ y:0 }, debug:false },
  },
  scene: [PreloadScene2, GameScene2, GameOverScene2],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

let _g2;

window.addEventListener('load', () => {
  // Solicitar pantalla completa al tocar la pantalla
  document.addEventListener('touchstart', () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    }
  }, { once: true });
  
  _g2 = new Phaser.Game(game2PhaserConfig);
});

/* ── Funciones globales del pause overlay ── */
function reanudarJuego() {
  const ov = document.getElementById('pause-ov');
  if (ov) ov.classList.remove('on');
  if (_g2) {
    const sc = _g2.scene.getScene('Game2');
    if (sc) sc.panelOpen = false;
  }
}
function salirAlMenu() {
  window.location.href = 'juegos.html';
}
function cambiarVolumen(val) {
  _g2vol = val / 100;
  if (_g2) {
    const sc = _g2.scene.getScene('Game2');
    if (sc && sc._musica) sc._musica.setVolume(_g2vol * 0.55);
  }
  const el = document.getElementById('volValor');
  if (el) el.textContent = val + '%';
}