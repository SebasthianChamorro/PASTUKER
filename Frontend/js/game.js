/* ════════════ PSTUKER — Bosque Sagrado · Top-down v3 ════════════ */

// ── Configuración del mapa ──
const MAP_W       = 5600;
const MAP_H       = 4200;
const SPD         = 200;
const PROX_PLANTA = 80;
const PROX_TAITA  = 120;
const PLANTAS_META= 5;

// ── Centro del mapa (Taita) ──
const TAITA_X = MAP_W / 2;
const TAITA_Y = MAP_H / 2;

// ── Minimapa ──
const MM_W = 160, MM_H = 120;
const mmCanvas = document.getElementById('minimap');
const mmCtx    = mmCanvas.getContext('2d');

// Catálogo completo de 30 plantas — se eligen 10 al azar cada partida
const PLANTAS_CATALOGO = [
    {
        id:'ajenjo', nombre:'Ajenjo',
        img:'../images/game/plants/AJENJO.png',
        desc:'Hierba amarga del territorio Pasto, valorada por los sabedores por su capacidad de purificar el organismo. Se reconoce fácilmente por su aroma intenso y sus hojas plateadas.',
        usos:'Colesterol e hígado graso.',
        prep:'3 hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Ajenjo?', o:['Colesterol e hígado graso','Dolor de oído','Para los nervios','Para la tos'], c:0},
            {p:'¿Cómo se prepara\nel Ajenjo?', o:['Se cocina y se baña','Se aplica directamente','3 hojas en infusión','Se macera con aguardiente'], c:2},
        ]
    },
    {
        id:'altamisa', nombre:'Altamisa',
        img:'../images/game/plants/ALTAMISA.png',
        desc:'Planta sagrada del territorio usada en limpias y rituales. Los mayores la calientan en la tulpa para extraer sus propiedades curativas antes de aplicarla.',
        usos:'Mal aire, sacar el frío, barrer el horno de leña.',
        prep:'Se calienta en la tulpa y se aplica en la zona afectada.',
        preguntas:[
            {p:'¿Para qué sirve\nla Altamisa?', o:['Para los riñones','Mal aire y sacar el frío','Controlar el azúcar','Quemaduras'], c:1},
            {p:'¿Cómo se prepara\nla Altamisa?', o:['En infusión','Se calienta en la tulpa y aplica en zona afectada','Se consume cruda','Se machaca y toma el zumo'], c:1},
        ]
    },
    {
        id:'arnica', nombre:'Árnica',
        img:'../images/game/plants/ARNICA.png',
        desc:'Conocida en la comunidad como la hierba de los golpes. Sus flores amarillas son símbolo de sanación y los médicos tradicionales la usan para tratar dolencias físicas.',
        usos:'Antiinflamatorio.',
        prep:'Se cocina y se hace baños.',
        preguntas:[
            {p:'¿Para qué se usa\nel Árnica?', o:['Desparasitante','Dolor de garganta','Antiinflamatorio','Sedante'], c:2},
            {p:'¿Cómo se prepara\nel Árnica?', o:['En infusión de flores','Se aplica el cristal','Se cocina y se hacen baños','Se pone a enserenar'], c:2},
        ]
    },
    {
        id:'breva', nombre:'Breva',
        img:'../images/game/plants/BREVA.png',
        desc:'Fruto y hoja con propiedades ancestrales reconocidas por las parteras del territorio. Su uso en infusión con miel es parte del conocimiento de las abuelas Pasto.',
        usos:'Quitar el frío e inducir los dolores del parto.',
        prep:'Una hoja en infusión con un pedazo de panela o miel de abeja.',
        preguntas:[
            {p:'¿Qué propiedad\ntiene la Breva?', o:['Antibiótico','Quitar frío e inducir dolores del parto','Controlar colesterol','Tratar la diabetes'], c:1},
            {p:'¿Cómo se prepara\nla Breva?', o:['Tres ramas con miel','Una hoja en infusión con panela o miel','Se cocina la raíz','Se consume la fruta directamente'], c:1},
        ]
    },
    {
        id:'calendula', nombre:'Caléndula',
        img:'../images/game/plants/CALENDULA.png',
        desc:'Sus flores naranja y amarillo adornan la chagra familiar. Más que decorativa, la Caléndula es una de las plantas medicinales más usadas en la comunidad de Chapal.',
        usos:'Antiinflamatorio, previene la gastritis.',
        prep:'Tres flores en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nla Caléndula?', o:['Antiinflamatorio y previene la gastritis','Para la tos y catarro','Dolores musculares','Dolor de estómago'], c:0},
            {p:'¿Cómo se prepara\nla Caléndula?', o:['Una hoja en infusión','Se aplica directamente','Tres flores en infusión','Se machaca y exprime'], c:2},
        ]
    },
    {
        id:'cidron', nombre:'Cidrón',
        img:'../images/game/plants/CIDRON.png',
        desc:'Hierba de hojas rugosas con aroma cítrico que acompaña las mingas y reuniones del cabildo. Los sabedores la recomiendan tanto para el cuerpo como para el espíritu.',
        usos:'Sacar el frío, baños vaginales, regular la presión.',
        prep:'Tres hojas en infusión; vaporizaciones para baños.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Cidrón?', o:['Desintoxicante','Sacar el frío, baños vaginales y regular la presión','Para los nervios','Para la circulación'], c:1},
            {p:'¿Cómo se prepara\nel Cidrón?', o:['Se consume crudo','Tres hojas en infusión y vaporizaciones','Se machaca con aguardiente','Una ramita en infusión'], c:1},
        ]
    },
    {
        id:'clavel', nombre:'Clavel',
        img:'../images/game/plants/CLAVEL.png',
        desc:'Flor de color intenso que los mayores usan para calmar el sistema nervioso. Su preparación nocturna en agua fría es una técnica ancestral transmitida de generación en generación.',
        usos:'Sirve para los nervios.',
        prep:'Se pone a enserenar durante una noche en un vaso con agua y a la mañana siguiente se toma.',
        preguntas:[
            {p:'¿Para qué sirve\nel Clavel?', o:['Para el dolor de oído','Para la gastritis','Para los nervios','Para la tos'], c:2},
            {p:'¿Cómo se prepara\nel Clavel?', o:['En infusión caliente','Se aplica directamente','Se enserea en agua una noche y se toma','Se cocina y se baña'], c:2},
        ]
    },
    {
        id:'cofrey', nombre:'Cofrey',
        img:'../images/game/plants/COFREY.png',
        desc:'Planta de grandes hojas reconocida por su poder regenerador. En la comunidad Pasto se valora especialmente por su capacidad de incrementar los glóbulos rojos y cicatrizar heridas.',
        usos:'Nivela el colesterol, incrementa glóbulos rojos, cicatrizante.',
        prep:'Una hoja en infusión; para uso externo se cocina.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Cofrey?', o:['Sedante y relajante','Nivela colesterol, glóbulos rojos y cicatriza','Para el mal aire','Para la diabetes'], c:1},
            {p:'¿Cómo se prepara\nel Cofrey?', o:['Tres flores en infusión','Una hoja en infusión; cocido para uso externo','Se consume la fruta','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'diente-de-leon', nombre:'Diente de León',
        img:'../images/game/plants/DIENTE-DE-LEON.png',
        desc:'Pequeña flor amarilla que crece silvestre en los campos del resguardo. Los sabedores conocen el poder de su raíz para tratar enfermedades relacionadas con el azúcar en la sangre.',
        usos:'Para la diabetes y deficiencia de calcio.',
        prep:'Se cocina la raíz; las hojas se consumen en ensalada.',
        preguntas:[
            {p:'¿Para qué se usa el\nDiente de León?', o:['Para la tos','Para el pasmo','Diabetes y deficiencia de calcio','Para quemaduras'], c:2},
            {p:'¿Cómo se prepara el\nDiente de León?', o:['Se calienta y aplica','Tres hojas en infusión','Se cocina la raíz; hojas en ensalada','Se pone a enserenar'], c:2},
        ]
    },
    {
        id:'eucalipto', nombre:'Eucalipto',
        img:'../images/game/plants/EUCALIPTO.png',
        desc:'Árbol de presencia imponente en el paisaje de Funes. Sus hojas aromáticas son utilizadas tanto en vaporizaciones para limpiar las vías respiratorias como en rituales de sahumerio.',
        usos:'Para la tos, catarro y sahumerio.',
        prep:'Se cocina y se hacen vaporizaciones; las hojas se queman para sahumerio.',
        preguntas:[
            {p:'¿Para qué sirve\nel Eucalipto?', o:['Para los nervios','Para la tos, catarro y sahumerio','Para el colesterol','Para la circulación'], c:1},
            {p:'¿Cómo se prepara\nel Eucalipto?', o:['Una hoja en infusión','Se cocina para vaporizaciones y quema para sahumerio','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'hierba-buena', nombre:'Hierba Buena',
        img:'../images/game/plants/HIERBA-BUENA.png',
        desc:'Planta de aroma fresco y mentolado que crece junto a las fuentes de agua del resguardo. Su uso como desparasitante es conocido especialmente por las madres y abuelas de la comunidad.',
        usos:'Actúa como desparasitante y relajante.',
        prep:'Tres hojas en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Hierba Buena?', o:['Antiinflamatorio','Para quemaduras','Desparasitante y relajante','Para la presión'], c:2},
            {p:'¿Cómo se prepara\nla Hierba Buena?', o:['Se machaca y exprime','Se aplica directamente','Tres hojas en infusión','Se calienta en la tulpa'], c:2},
        ]
    },
    {
        id:'insulina', nombre:'Insulina',
        img:'../images/game/plants/INSULINA.png',
        desc:'Planta de sabor amargo cuyo nombre popular refleja su uso más conocido en la medicina tradicional del territorio. Los mayores la preparan con paciencia dejándola reposar toda la noche.',
        usos:'Controla el azúcar en la sangre.',
        prep:'Se cocina un día y se consume al día siguiente.',
        preguntas:[
            {p:'¿Para qué sirve la\nplanta Insulina?', o:['Para el dolor de garganta','Para los nervios','Controla el azúcar en la sangre','Para la tos'], c:2},
            {p:'¿Cómo se prepara la\nplanta Insulina?', o:['Tres flores en infusión','Se cocina un día y se consume al siguiente','Se aplica el cristal','Se pone a enserenar'], c:1},
        ]
    },
    {
        id:'llanten', nombre:'Llantén',
        img:'../images/game/plants/LLANTEN.png',
        desc:'Llamada "medicina de la tierra" por los mayores del cabildo de Chapal. Sus hojas verdes y resistentes crecen en los caminos y son señal de suelo fértil en el resguardo.',
        usos:'Limpiar el hígado, herpes, dolores musculares y golpes.',
        prep:'En infusión y se machaca para consumir directamente.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Llantén?', o:['Limpiar hígado, herpes, dolores y golpes','Para la gastritis','Para la presión alta','Sedante'], c:0},
            {p:'¿Cómo se prepara\nel Llantén?', o:['Se cocina y se baña','En infusión y machacado directo','Se consume la fruta','Tres cogollos en infusión'], c:1},
        ]
    },
    {
        id:'manzanilla', nombre:'Manzanilla',
        img:'../images/game/plants/MANZANILLA.png',
        desc:'Una de las plantas más queridas y utilizadas en la medicina ancestral de Chapal. Sus pequeñas flores blancas y amarillas son símbolo de cuidado y bienestar en el hogar Pasto.',
        usos:'Para la digestión, los cólicos, antiinflamatorio y sacar el frío.',
        prep:'En infusión de tres flores o la planta completa.',
        preguntas:[
            {p:'¿Para qué sirve\nla Manzanilla?', o:['Para la circulación','Digestión, cólicos, antiinflamatorio y sacar el frío','Para el mal aire','Antibiótico'], c:1},
            {p:'¿Cómo se prepara\nla Manzanilla?', o:['Se aplica el cristal','Se santigua con la planta','Tres flores o planta completa en infusión','Se machaca con aguardiente'], c:2},
        ]
    },
    {
        id:'menta', nombre:'Menta',
        img:'../images/game/plants/MENTA.png',
        desc:'Sus cogollos frescos y aromáticos son reconocidos en todo el territorio. La menta es una de las plantas de uso cotidiano en los hogares del resguardo de Funes.',
        usos:'Para la presión alta y el dolor de garganta.',
        prep:'Tres cogollos en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Menta?', o:['Para la presión alta y dolor de garganta','Para los riñones','Para el colesterol','Para el parto'], c:0},
            {p:'¿Cómo se prepara\nla Menta?', o:['Una hoja en infusión','Se consume la fruta','Tres cogollos en infusión','Se calienta y aplica'], c:2},
        ]
    },
    {
        id:'mispero', nombre:'Míspero',
        img:'../images/game/plants/MISPERO.png',
        desc:'Planta frutal del bosque andino cuyas hojas son valoradas por sus propiedades antibióticas naturales. Los sabedores de Chapal la usan para tratar infecciones urinarias.',
        usos:'Para la cistitis y como antibiótico.',
        prep:'Una hoja en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Míspero?', o:['Para el pasmo','Para la cistitis y como antibiótico','Para los nervios','Para el estrés'], c:1},
            {p:'¿Cómo se prepara\nel Míspero?', o:['Tres ramas con miel','Se cocina la raíz','Una hoja en infusión','Se macera con aguardiente'], c:2},
        ]
    },
    {
        id:'nabo', nombre:'Nabo',
        img:'../images/game/plants/NABO.png',
        desc:'Raíz comestible del altiplano nariñense que también es planta medicinal. Las abuelas del cabildo lo usan especialmente para apoyar a las madres lactantes.',
        usos:'Desintoxicante, sirve para el colon y en mujeres para producir más leche en lactancia.',
        prep:'Se cocina y se consume; las flores se cocinan en agua de panela para las mujeres.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Nabo?', o:['Para la tos','Desintoxicante, colon y leche materna','Para el mal aire','Para quemaduras'], c:1},
            {p:'¿Cómo se prepara\nel Nabo?', o:['Se aplica el cristal','Se cocina y consume; flores en agua de panela','Una hoja en infusión','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'oregano', nombre:'Orégano',
        img:'../images/game/plants/OREGANO.png',
        desc:'Hierba aromática de cocina y medicina a la vez. En la comunidad de Chapal su uso va más allá de los alimentos: los cogollos en infusión alivian dolencias que la medicina convencional no siempre atiende.',
        usos:'Para el dolor de oído y el estreñimiento.',
        prep:'Tres cogollos en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Orégano?', o:['Para la ansiedad','Dolor de oído y estreñimiento','Para la diabetes','Para los riñones'], c:1},
            {p:'¿Cómo se prepara\nel Orégano?', o:['Se cocina y baña','Tres cogollos en infusión','Se aplica directamente','Se macera con aguardiente'], c:1},
        ]
    },
    {
        id:'ortiga', nombre:'Ortiga',
        img:'../images/game/plants/ORTIGA.png',
        desc:'El "ortigo" es símbolo de fortaleza en la cosmología Pasto. A pesar de su picadura, esta planta guarda propiedades medicinales que los sabedores del cabildo han preservado por siglos.',
        usos:'Para la circulación y alergias.',
        prep:'Tres hojas en infusión; también se cocina y se baña.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Ortiga?', o:['Para la circulación y alergias','Para la gastritis','Para el dolor de parto','Sedante'], c:0},
            {p:'¿Cómo se prepara\nla Ortiga?', o:['Se pone a enserenar','Una ramita en infusión','Tres hojas en infusión y baños cocidos','Se consume la fruta'], c:2},
        ]
    },
    {
        id:'pepino-dulce', nombre:'Pepino Dulce',
        img:'../images/game/plants/PEPINO-DULCE.png',
        desc:'Fruto andino de pulpa suave y dulce, cultivado en la chagra familiar. Su consumo directo es valorado como remedio natural para mantener sanos los riñones.',
        usos:'Para los riñones.',
        prep:'Se consume la fruta.',
        preguntas:[
            {p:'¿Para qué sirve\nel Pepino Dulce?', o:['Para los nervios','Para la tos','Para los riñones','Para el colesterol'], c:2},
            {p:'¿Cómo se usa\nel Pepino Dulce?', o:['En infusión','Se aplica directamente','Se consume la fruta','Se cocina y baña'], c:2},
        ]
    },
    {
        id:'poleo', nombre:'Poleo',
        img:'../images/game/plants/POLEO.png',
        desc:'Hierba del páramo nariñense con propiedades caloríficas. Los médicos tradicionales de Chapal la usan para tratar el pasmo, una afección propia del saber ancestral del territorio.',
        usos:'Para el pasmo y la tos.',
        prep:'Se cocina tres ramas con agua y miel.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Poleo?', o:['Para quemaduras','Para el pasmo y la tos','Para la presión','Desparasitante'], c:1},
            {p:'¿Cómo se prepara\nel Poleo?', o:['Se aplica el cristal','Se cocina tres ramas con agua y miel','Una hoja en infusión','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'romerillo', nombre:'Romerillo',
        img:'../images/game/plants/ROMERILLO.png',
        desc:'Planta silvestre del bosque andino diferente del romero de cocina. Su zumo machacado es un remedio tradicional para el mal viento, concepto propio de la medicina ancestral Pasto.',
        usos:'Sirve para el mal viento y los nervios.',
        prep:'Se machaca, se exprime y se toma el zumo.',
        preguntas:[
            {p:'¿Para qué sirve\nel Romerillo?', o:['Para la circulación','Para el colesterol','Mal viento y nervios','Para la diabetes'], c:2},
            {p:'¿Cómo se prepara\nel Romerillo?', o:['Tres flores en infusión','Se calienta en la tulpa','Se machaca, exprime y toma el zumo','Se consume cocido'], c:2},
        ]
    },
    {
        id:'romero', nombre:'Romero',
        img:'../images/game/plants/ROMERO.png',
        desc:'Planta aromática de múltiples usos en el territorio Pasto. Los sabedores destacan su valor para la memoria, lo que la hace especial en una comunidad que transmite su cultura de forma oral.',
        usos:'Dolor de estómago, para la memoria y antiinflamatorio.',
        prep:'Una ramita en infusión.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Romero?', o:['Para la tos y catarro','Dolor de estómago, memoria y antiinflamatorio','Para la cistitis','Para los riñones'], c:1},
            {p:'¿Cómo se prepara\nel Romero?', o:['Se cocina para vaporizaciones','Una ramita en infusión','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'ruda', nombre:'Ruda',
        img:'../images/game/plants/RUDA.png',
        desc:'Planta sagrada de protección en el resguardo de Funes. La Ruda es protagonista de rituales de limpieza espiritual y los médicos tradicionales la santiguan sobre el cuerpo para curar el mal aire.',
        usos:'Para curar el mal aire y dolores menstruales.',
        prep:'Se santigua con la planta; infusión de tres flores para dolores menstruales.',
        preguntas:[
            {p:'¿Para qué sirve\nla Ruda?', o:['Para la tos','Para el colesterol','Curar el mal aire y dolores menstruales','Para los riñones'], c:2},
            {p:'¿Cómo se prepara\nla Ruda?', o:['Se consume cruda','Se santigua con la planta; infusión para dolores','Tres cogollos en infusión','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'savila', nombre:'Sábila',
        img:'../images/game/plants/SAVILA.png',
        desc:'Planta de cristal suculento que crece en los huertos y jardines del resguardo. Su gel transparente es uno de los remedios más usados por las familias de Chapal para aliviar quemaduras y problemas digestivos.',
        usos:'Para quemaduras y gastritis.',
        prep:'Se aplica el cristal directamente en la zona y se consume el cristal.',
        preguntas:[
            {p:'¿Para qué sirve\nla Sábila?', o:['Para la presión','Para los nervios','Para quemaduras y gastritis','Para el mal aire'], c:2},
            {p:'¿Cómo se prepara\nla Sábila?', o:['En infusión de hojas','Se cocina y se hacen baños','Se aplica el cristal y se consume','Se pone a enserenar'], c:2},
        ]
    },
    {
        id:'seguidora', nombre:'Seguidora',
        img:'../images/game/plants/SEGUIDORA.png',
        desc:'Planta de uso espiritual en la comunidad Pasto. A diferencia de otras plantas medicinales, no se ingiere: basta con tenerla en el hogar para que cumpla su función protectora.',
        usos:'Ahuyentar las malas energías.',
        prep:'Se tiene una planta en la casa.',
        preguntas:[
            {p:'¿Para qué sirve\nla Seguidora?', o:['Para el dolor de garganta','Ahuyentar las malas energías','Para la tos','Para la diabetes'], c:1},
            {p:'¿Cómo se usa\nla Seguidora?', o:['En infusión de tres hojas','Se cocina la raíz','Se tiene una planta en la casa','Se macera con chapil'], c:2},
        ]
    },
    {
        id:'tomillo', nombre:'Tomillo',
        img:'../images/game/plants/TOMILLO.png',
        desc:'Hierba de hojas pequeñas y aroma intenso que crece en los jardines del resguardo. Los sabedores la recomiendan para las molestias digestivas y del sistema respiratorio superior.',
        usos:'Para el dolor de estómago y dolor de garganta.',
        prep:'Una rama en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Tomillo?', o:['Para la circulación','Para los nervios','Dolor de estómago y garganta','Para la diabetes'], c:2},
            {p:'¿Cómo se prepara\nel Tomillo?', o:['Se cocina para vaporizaciones','Una rama en infusión','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'toronjil-grande', nombre:'Toronjil Grande',
        img:'../images/game/plants/TORONJIL-GRANDE.png',
        desc:'Hierba del corazón según los mayores de Chapal. Su aroma calmante y sus propiedades sedantes la convierten en aliada de quienes sufren los efectos del estrés y la ansiedad en la vida moderna.',
        usos:'Controla el estrés, la ansiedad y el insomnio.',
        prep:'Dos hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve el\nToronjil Grande?', o:['Para la tos','Controla estrés, ansiedad e insomnio','Para el colesterol','Para quemaduras'], c:1},
            {p:'¿Cómo se prepara el\nToronjil Grande?', o:['Tres ramas con miel','Se cocina la raíz','Se pone a enserenar','Dos hojas en infusión'], c:3},
        ]
    },
    {
        id:'toronjil-pequeno', nombre:'Toronjil Pequeño',
        img:'../images/game/plants/TORONJIL-PEQUEÑO.png',
        desc:'Primo del toronjil grande pero con propiedades distintas. Los médicos tradicionales distinguen claramente entre ambas variedades y las recetan para condiciones diferentes del cuerpo.',
        usos:'Náuseas, gases; irritabilidad y nerviosismo.',
        prep:'Un cogollo en infusión.',
        preguntas:[
            {p:'¿Cuál es la función del\nToronjil Pequeño?', o:['Para la circulación','Para la diabetes','Náuseas, gases, irritabilidad y nerviosismo','Para la tos'], c:2},
            {p:'¿Cómo se prepara el\nToronjil Pequeño?', o:['Un cogollo en infusión','Se cocina y hace baños','Se machaca y exprime','Tres flores en infusión'], c:0},
        ]
    },
    {
        id:'valeriana', nombre:'Valeriana',
        img:'../images/game/plants/VALERIANA.png',
        desc:'Planta de raíces con aroma particular, usada desde tiempos ancestrales como calmante natural. Los sabedores de Chapal la prescriben para los estados de agitación nerviosa y el insomnio.',
        usos:'Para los nervios y como sedante.',
        prep:'Tres hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nla Valeriana?', o:['Para la presión','Para los nervios y como sedante','Para quemaduras','Para el colesterol'], c:1},
            {p:'¿Cómo se prepara\nla Valeriana?', o:['Se aplica directamente','Se consume la fruta','Se pone a enserenar una noche','Tres hojas en infusión'], c:3},
        ]
    },
];

// Se llena al inicio de cada partida con las 10 plantas elegidas al azar
let PLANTAS_DATA = [];

/* ════════ ESTADO ════════ */
let recolectadas = [], cercana = null, taitaCerca = false;
let panelOpen = false, quizOn = false;
let qIdx = 0, qPts = 0, qPregs = [], qSeg = 15, qInt = null;
let playerWorldX = 300, playerWorldY = MAP_H - 300;
let taitaParpadeo = false;  // ← activa parpadeo del minimapa cuando hay 5 plantas

/* ════════════════════════════════════════════════════════════════
   MINIMAPA — se dibuja cada frame desde Phaser update
════════════════════════════════════════════════════════════════ */
let _mmTick = 0; // contador para parpadeo

function dibujarMinimap(px, py, plantaObjs) {
    const scaleX = MM_W / MAP_W;
    const scaleY = MM_H / MAP_H;
    _mmTick++;

    mmCtx.clearRect(0, 0, MM_W, MM_H);

    // Fondo
    mmCtx.fillStyle = '#1a4a2e';
    mmCtx.fillRect(0, 0, MM_W, MM_H);

    // Borde
    mmCtx.strokeStyle = 'rgba(212,175,55,.3)';
    mmCtx.lineWidth = 1;
    mmCtx.strokeRect(0, 0, MM_W, MM_H);

    // Plantas
    plantaObjs.forEach(o => {
        const mx = o.data.mx * scaleX;
        const my = o.data.my * scaleY;
        const rec = o.spr.getData('rec');
        mmCtx.beginPath();
        mmCtx.arc(mx, my, rec ? 3 : 4, 0, Math.PI * 2);
        mmCtx.fillStyle = rec ? '#ef9a9a' : '#81c784';
        mmCtx.fill();
        if (!rec) {
            mmCtx.beginPath();
            mmCtx.arc(mx, my, 6, 0, Math.PI * 2);
            mmCtx.strokeStyle = 'rgba(129,199,132,.4)';
            mmCtx.lineWidth = 1;
            mmCtx.stroke();
        }
    });

    // Taita — parpadea en dorado/blanco cuando hay 5 plantas recogidas
    const tx = TAITA_X * scaleX, ty = TAITA_Y * scaleY;
    const parpadeaAhora = taitaParpadeo && (_mmTick % 30 < 15);
    mmCtx.beginPath();
    mmCtx.arc(tx, ty, 6, 0, Math.PI * 2);
    mmCtx.fillStyle = parpadeaAhora ? '#ffffff' : '#d4af37';
    mmCtx.fill();
    mmCtx.beginPath();
    mmCtx.arc(tx, ty, parpadeaAhora ? 11 : 8, 0, Math.PI * 2);
    mmCtx.strokeStyle = parpadeaAhora ? 'rgba(255,255,255,.8)' : 'rgba(212,175,55,.5)';
    mmCtx.lineWidth = parpadeaAhora ? 2 : 1.5;
    mmCtx.stroke();

    // Jugador
    const jx = px * scaleX, jy = py * scaleY;
    mmCtx.beginPath();
    mmCtx.arc(jx, jy, 4, 0, Math.PI * 2);
    mmCtx.fillStyle = '#4fc3f7';
    mmCtx.fill();
    mmCtx.beginPath();
    mmCtx.arc(jx, jy, 7, 0, Math.PI * 2);
    mmCtx.strokeStyle = 'rgba(79,195,247,.45)';
    mmCtx.lineWidth = 1.5;
    mmCtx.stroke();
}

/* ════════════════════════════════════════════════════════════════
   PHASER — PreloadScene
════════════════════════════════════════════════════════════════ */
class PreloadScene extends Phaser.Scene {
    constructor(){super('Pre')}
    preload(){
        const W=this.scale.width,H=this.scale.height;
        this.add.rectangle(W/2,H/2,W,H,0x0d2a18);
        this._bar=this.add.rectangle(W/2-120,H/2+40,0,10,0xd4af37).setOrigin(0,.5);
        this.add.rectangle(W/2,H/2+40,240,10,0x1a4a2e).setStrokeStyle(1,0xd4af37,.3);
        this.add.text(W/2,H/2+15,'Preparando el Bosque Sagrado...',
            {fontFamily:"'Press Start 2P'",fontSize:'9px',color:'#f0d060'}).setOrigin(.5);
        this.load.on('progress',v=>{this._bar.width=240*v});

        // Assets del entorno
        this.load.image('tree',   '../images/landscale/tree.png');
        this.load.image('tree2',  '../images/landscale/tree_2.png');
        this.load.image('tree3',  '../images/landscale/tree_3.png');
        this.load.image('bush',   '../images/landscale/bush.png');
        this.load.image('bush2',  '../images/landscale/bush_2.png');
        this.load.image('okwute', '../images/landscale/okwute.png');

        // Sprites de planta genérica (5 frames)
        this.load.image('plant_1', '../images/game/icons_game/plant_1.png');
        this.load.image('plant_2', '../images/game/icons_game/plant_2.png');
        this.load.image('plant_3', '../images/game/icons_game/plant_3.png');
        this.load.image('plant_4', '../images/game/icons_game/plant_4.png');
        this.load.image('plant_5', '../images/game/icons_game/plant_5.png');

        // Taita
        this.load.image('taita_f1', '../images/taita/taita_frame1.png');
        this.load.image('taita_f2', '../images/taita/taita_frame2.png');

        // Aves
        this.load.image('bird', '../images/landscale/birds.png');

        // Personaje masculino
        this.load.image('walk_default',  '../images/game/walk-men/walk-default.png');
        this.load.image('walk_left1',    '../images/game/walk-men/walk-left1.png');
        this.load.image('walk_left2',    '../images/game/walk-men/walk-left2.png');
        this.load.image('walk_left3',    '../images/game/walk-men/walk-left3.png');
        this.load.image('walk_right1',   '../images/game/walk-men/walk-right1.png');
        this.load.image('walk_right2',   '../images/game/walk-men/walk-right2.png');
        this.load.image('walk_right3',   '../images/game/walk-men/walk-right3.png');
        this.load.image('walk_down1',    '../images/game/walk-men/walk-down1.png');
        this.load.image('walk_down2',    '../images/game/walk-men/walk-down2.png');
        this.load.image('walk_down3',    '../images/game/walk-men/walk-down3.png');
        this.load.image('walk_arrive1',  '../images/game/walk-men/walk-arrive1.png');
        this.load.image('walk_arrive2',  '../images/game/walk-men/walk-arrive2.png');
        this.load.image('walk_arrive3',  '../images/game/walk-men/walk-arrive3.png');

        // Personaje femenino
        this.load.image('walk2_default',  '../images/game/walk-woman/walk2-default.png');
        this.load.image('walk2_left1',    '../images/game/walk-woman/walk2-left1.png');
        this.load.image('walk2_left2',    '../images/game/walk-woman/walk2-left2.png');
        this.load.image('walk2_left3',    '../images/game/walk-woman/walk2-left3.png');
        this.load.image('walk2_right1',   '../images/game/walk-woman/walk2-right1.png');
        this.load.image('walk2_right2',   '../images/game/walk-woman/walk2-right2.png');
        this.load.image('walk2_down1',    '../images/game/walk-woman/walk2-down1.png');
        this.load.image('walk2_down2',    '../images/game/walk-woman/walk2-down2.png');
        this.load.image('walk2_down3',    '../images/game/walk-woman/walk2-down3.png');
        this.load.image('walk2_arrive1',  '../images/game/walk-woman/walk2-arrive1.png');
        this.load.image('walk2_arrive2',  '../images/game/walk-woman/walk2-arrive2.png');
        this.load.image('walk2_arrive3',  '../images/game/walk-woman/walk2-arrive3.png');

        // Portal (15 frames) ← ahora SÍ dentro de preload()
        for(let i = 1; i <= 15; i++){
            const key = 'portal' + String(i).padStart(2,'0');
            this.load.image(key, `../images/game/portal/${key}.png`);
        }

        // 30 plantas medicinales
        PLANTAS_CATALOGO.forEach(p => {
            this.load.image('planta_' + p.id, p.img);
        });
    }

    create(){ this.scene.start('World') }
}

/* ── Decide qué personaje usar según género y mundo ── */
function getPersonaje() {
    const genero = localStorage.getItem('usuario_genero') || 'hombre';
    const mundo  = localStorage.getItem('mundo_actual')  || '1';
    if (genero === 'mujer') return 'f';
    if (genero === 'otro' || genero === 'no_decir') {
        return mundo === '2' ? 'f' : 'm';
    }
    return 'm';
}

/* ════════════════════════════════════════════════════════════════
   PHASER — WorldScene  (top-down, mapa grande)
════════════════════════════════════════════════════════════════ */
class WorldScene extends Phaser.Scene {
    constructor(){super('World')}

    create(){
        this.physics.world.setBounds(0,0,MAP_W,MAP_H);
        this.cameras.main.setBounds(0,0,MAP_W,MAP_H);

        this._suelo();
        this._borde();
        this._arboles();       // colisión
        this._piedras();       // colisión
        this._arbustos();      // decorativo
        this._cielo();         // sol, nubes
        this._plantas();
        this._taita();
        this._aves();
        this._player();

        // Colisiones
        this.physics.add.collider(this.pl, this.treeGrp);
        this.physics.add.collider(this.pl, this.rockGrp);
        this.physics.add.collider(this.pl, this.bordeGrp);

        this.cameras.main.startFollow(this.pl, true, .09, .09);
        this._input();
    }

    /* ── Suelo verde denso ── */
    _suelo(){
        const g=this.add.graphics().setDepth(0);
        g.fillStyle(0x276132,1);
        g.fillRect(0,0,MAP_W,MAP_H);

        // Variación de textura orgánica
        const rng=new Phaser.Math.RandomDataGenerator(['suelo7']);
        const paleta=[0x226030,0x2e7038,0x1e5228,0x387a42,0x1a4820,0x3d8040,0x244e2a];
        for(let i=0;i<600;i++){
            const x=rng.between(0,MAP_W),y=rng.between(0,MAP_H);
            const rx=rng.between(18,70),ry=rng.between(12,45);
            g.fillStyle(rng.pick(paleta),.45);
            g.fillEllipse(x,y,rx*2,ry*2);
        }
        // Manchas de hierba alta
        for(let i=0;i<400;i++){
            const x=rng.between(0,MAP_W),y=rng.between(0,MAP_H);
            g.fillStyle(0x4a9050,.28);
            g.fillEllipse(x,y,rng.between(8,28),rng.between(6,18));
        }
    }

    /* ── Borde del mapa (muros invisibles + visual) ── */
    _borde(){
        this.bordeGrp=this.physics.add.staticGroup();
        const T=60;
        [[MAP_W/2,T/2,MAP_W,T],[MAP_W/2,MAP_H-T/2,MAP_W,T],
         [T/2,MAP_H/2,T,MAP_H],[MAP_W-T/2,MAP_H/2,T,MAP_H]].forEach(([x,y,w,h])=>{
            const r=this.bordeGrp.create(x,y,null);
            r.setVisible(false).setSize(w,h).refreshBody();
        });
        // Franja oscura visual
        const g=this.add.graphics().setDepth(0);
        g.fillStyle(0x0a1a0c,1);
        g.fillRect(0,0,MAP_W,T);g.fillRect(0,MAP_H-T,MAP_W,T);
        g.fillRect(0,0,T,MAP_H);g.fillRect(MAP_W-T,0,T,MAP_H);
        // Hilera de árboles grandes en el borde
        const rng=new Phaser.Math.RandomDataGenerator(['borde3']);
        const keys=['tree','tree2','tree3'];
        const paso=120;
        for(let x=T;x<MAP_W-T;x+=paso+rng.between(-20,20)){
            [T/2,MAP_H-T/2].forEach(y=>{
                const t=this.add.image(x,y,rng.pick(keys));
                const sz=rng.between(90,140);
                t.setDisplaySize(sz,sz*1.4).setDepth(2).setAlpha(.9);
            });
        }
        for(let y=T+paso;y<MAP_H-T-paso;y+=paso+rng.between(-20,20)){
            [T/2,MAP_W-T/2].forEach(x=>{
                const t=this.add.image(x,y,rng.pick(keys));
                const sz=rng.between(90,140);
                t.setDisplaySize(sz,sz*1.4).setDepth(2).setAlpha(.9);
            });
        }
    }

    /* ── Árboles con física ── */
    _arboles(){
        this.treeGrp=this.physics.add.staticGroup();
        const rng=new Phaser.Math.RandomDataGenerator(['arb4']);
        const keys=['tree','tree2','tree3'];
        const SAFE=200; // radio libre alrededor del Taita

        // Lista de posiciones a evitar (plantas)
        const avoid=[...PLANTAS_DATA.map(p=>({x:p.mx,y:p.my,r:110})),
                     {x:TAITA_X,y:TAITA_Y,r:SAFE}];

        const esSafePos=(x,y)=>{
            for(const a of avoid){
                if(Phaser.Math.Distance.Between(x,y,a.x,a.y)<a.r) return false;
            }
            // Evitar spawn zona inicial del jugador
            if(Phaser.Math.Distance.Between(x,y,300,MAP_H-300)<160) return false;
            return true;
        };

        // Árboles populosos — mucho más densos que antes
        for(let i=0;i<420;i++){
            const x=rng.between(80,MAP_W-80);
            const y=rng.between(80,MAP_H-80);
            if(!esSafePos(x,y)) continue;

            const k=rng.pick(keys);
            const sz=rng.between(60,135);
            const t=this.treeGrp.create(x,y,k);
            t.setDisplaySize(sz,sz*1.38).setDepth(3);
            // Colisión circular en la base del tronco
            const r=sz*.25, ox=sz*.25, oy=sz*.65;
            t.body.setCircle(r,ox,oy);
            t.refreshBody();
        }

        // Grupos densos adicionales (clusters) repartidos por el mapa
        const clusterCentros=[
            {x:1200,y:800},{x:4200,y:900},{x:800,y:2800},
            {x:4600,y:2900},{x:2400,y:1400},{x:3200,y:3200},
            {x:1600,y:3500},{x:4000,y:1800},{x:2800,y:700},
            {x:1000,y:1500},{x:4400,y:3500},{x:2200,y:3800},
        ];
        clusterCentros.forEach(c=>{
            for(let i=0;i<18;i++){
                const x=c.x+rng.between(-180,180);
                const y=c.y+rng.between(-180,180);
                if(!esSafePos(x,y)) continue;
                const k=rng.pick(keys);
                const sz=rng.between(55,120);
                const t=this.treeGrp.create(x,y,k);
                t.setDisplaySize(sz,sz*1.38).setDepth(3);
                const r=sz*.25,ox=sz*.25,oy=sz*.65;
                t.body.setCircle(r,ox,oy); t.refreshBody();
            }
        });
    }

    /* ── Piedras okwute ── */
    _piedras(){
        this.rockGrp=this.physics.add.staticGroup();
        const rng=new Phaser.Math.RandomDataGenerator(['rock5']);
        const SAFE=160;

        const avoid=[...PLANTAS_DATA.map(p=>({x:p.mx,y:p.my,r:90})),
                     {x:TAITA_X,y:TAITA_Y,r:SAFE},
                     {x:300,y:MAP_H-300,r:150}];

        const esSafe=(x,y)=>{
            for(const a of avoid){
                if(Phaser.Math.Distance.Between(x,y,a.x,a.y)<a.r) return false;
            }
            return true;
        };

        for(let i=0;i<180;i++){
            const x=rng.between(100,MAP_W-100);
            const y=rng.between(100,MAP_H-100);
            if(!esSafe(x,y)) continue;

            const sz=rng.between(32,72);
            const r=this.rockGrp.create(x,y,'okwute');
            r.setDisplaySize(sz,sz*.7).setDepth(2);
            r.body.setSize(sz*.55,sz*.38);
            r.body.setOffset(sz*.22,sz*.28);
            r.refreshBody();
        }

        // Grupos de piedras (formaciones)
        const formaciones=[
            {x:1800,y:1200},{x:3600,y:1600},{x:900,y:3200},
            {x:4500,y:2200},{x:2600,y:2800},{x:1400,y:700},
            {x:3900,y:3600},{x:2200,y:2000}
        ];
        formaciones.forEach(f=>{
            for(let i=0;i<8;i++){
                const x=f.x+rng.between(-140,140);
                const y=f.y+rng.between(-100,100);
                if(!esSafe(x,y)) continue;
                const sz=rng.between(28,60);
                const r=this.rockGrp.create(x,y,'okwute');
                r.setDisplaySize(sz,sz*.7).setDepth(2);
                r.body.setSize(sz*.55,sz*.38);
                r.body.setOffset(sz*.22,sz*.28);
                r.refreshBody();
            }
        });
    }

    /* ── Arbustos (sin colisión, decorativos) ── */
    _arbustos(){
        const rng=new Phaser.Math.RandomDataGenerator(['arb2']);
        for(let i=0;i<350;i++){
            const x=rng.between(60,MAP_W-60);
            const y=rng.between(60,MAP_H-60);
            const b=this.add.image(x,y,rng.pick(['bush','bush2']));
            b.setDisplaySize(rng.between(35,70),rng.between(24,46))
             .setDepth(1).setAlpha(.85);
        }
    }

    /* ── Sol y nubes (en el fondo del mundo) ── */
    _cielo(){
        // Sol
        const sg=this.add.graphics().setDepth(-1);
        sg.fillStyle(0xfff7a0,1); sg.fillCircle(MAP_W-260,200,60);
        sg.fillStyle(0xf5dc55,.18); sg.fillCircle(MAP_W-260,200,100);

        // Nubes dispersas
        const cg=this.add.graphics().setDepth(-1);
        cg.fillStyle(0xffffff,.1);
        [
            [400,220,140],[1200,100,110],[2200,260,130],[3100,130,105],
            [4200,210,125],[5000,150,100],[700,1400,115],[1900,1000,95],
            [3500,1600,120],[4800,900,108],[1500,2600,118],[3200,2200,102],
            [4600,2800,115],[900,3500,130],[2700,3100,95],[4100,3800,110]
        ].forEach(([x,y,r])=>{
            cg.fillEllipse(x,y,r*2.4,r*.8);
            cg.fillEllipse(x-r*.4,y,r*.9,r*.65);
            cg.fillEllipse(x+r*.5,y,r*.8,r*.6);
        });
    }

    /* ── Plantas ── */
    _plantas() {
        this._pobjs = [];
        this._pgrp  = this.physics.add.staticGroup();

        // ── Elegir 10 plantas al azar del catálogo de 30 ──
            const catalogo = [...PLANTAS_CATALOGO].sort(() => Math.random() - .5);
            PLANTAS_DATA   = catalogo.slice(0, 10);

        // ── Generar 10 posiciones distribuidas en cuadrícula 5x2 ──
        const celdaW = MAP_W / 5;
        const celdaH = MAP_H / 2;
        const margen = 350;

        const posiciones = [];
        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 2; row++) {
                let intentos = 0, px, py, valida;
                do {
                    px = col * celdaW + margen + Math.random() * (celdaW - margen * 2);
                    py = row * celdaH + margen + Math.random() * (celdaH - margen * 2);
                    const dTaita = Phaser.Math.Distance.Between(px, py, TAITA_X, TAITA_Y);
                    const dJug   = Phaser.Math.Distance.Between(px, py, 300, MAP_H - 300);
                    valida = dTaita > 350 && dJug > 300;
                    intentos++;
                } while (!valida && intentos < 30);
                posiciones.push({ mx: Math.round(px), my: Math.round(py) });
            }
        }

        const FRAMES_PLANTA = ['plant_1', 'plant_2', 'plant_3', 'plant_4', 'plant_5'];

        // ── Crear cada planta en el mapa ──
        PLANTAS_DATA.forEach((p, i) => {
            const { mx: px, my: py } = posiciones[i];
            p.mx = px; p.my = py;

            // Halo de luz
            const h = this.add.graphics().setDepth(4);
            h.fillStyle(0x81c784, .18);
            h.fillCircle(0, 0, 44);
            h.setPosition(px, py);
            this.tweens.add({
                targets: h, alpha: .38,
                duration: 1100 + Math.random() * 400,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });

            // Sprite con el primer frame del sprite genérico de planta
            const spr = this.physics.add.sprite(px, py, 'plant_1')
                .setDepth(6)
                .setScale(2);
            spr.setData('info', p).setData('rec', false);
            spr.body.setImmovable(true);
            spr.body.setCircle(18, spr.width / 2 - 18, spr.height / 2 - 18);
            this._pgrp.add(spr);

            // Animación de los 5 frames (movimiento suave de la planta)
            let fIdx = 0;
            this.time.addEvent({
                delay: 140,
                callback: () => {
                    if (!spr.active) return;
                    fIdx = (fIdx + 1) % FRAMES_PLANTA.length;
                    spr.setTexture(FRAMES_PLANTA[fIdx]);
                },
                loop: true
            });

            // Flotación vertical suave
            this.tweens.add({
                targets: spr, y: py - 10,
                duration: 900 + Math.random() * 400,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });

            this._pobjs.push({ spr, h, lbl: null, data: p });
        });
    }

    /* ── Taita Lorenzo (centro del mapa) ── */
    _taita(){
        const tx = TAITA_X, ty = TAITA_Y;

        // Zona sagrada
        const glow = this.add.graphics().setDepth(2);
        glow.fillStyle(0xd4af37, .08); glow.fillCircle(0, 0, 160); glow.setPosition(tx, ty);
        this.tweens.add({ targets:glow, alpha:.22, duration:2000,
            yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

        // Círculo de piedras sagradas
        for(let i = 0; i < 10; i++){
            const a = (i/10)*Math.PI*2, r = 130;
            const rk = this.add.image(tx+Math.cos(a)*r, ty+Math.sin(a)*r, 'okwute');
            rk.setDisplaySize(28, 20).setDepth(2).setAlpha(.8);
        }

        // Partículas orbitando
        for(let i = 0; i < 10; i++){
            const a = (i/10)*Math.PI*2, r = 100;
            const pt = this.add.circle(
                tx+Math.cos(a)*r, ty+Math.sin(a)*r, 4, 0xd4af37, .75).setDepth(3);
            this.tweens.add({ targets:pt, alpha:.1,
                duration:600+i*130, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });
        }

        // Sprite real del Taita (2 frames de Piskel)
        this._ts = this.physics.add.sprite(tx, ty, 'taita_f1')
            .setDepth(9).setScale(2);             // ajusta scale al tamaño de tu PNG
        this._ts.body.setImmovable(true);

        // Alterna entre frame1 y frame2 cada 800ms
        let taitaFrame = false;
        this.time.addEvent({
            delay: 800,
            callback: () => {
                taitaFrame = !taitaFrame;
                this._ts.setTexture(taitaFrame ? 'taita_f2' : 'taita_f1');
            },
            loop: true
        });

        // Flotación suave
        this.tweens.add({ targets:this._ts, y:ty - 7,
            duration:1700, yoyo:true, repeat:-1, ease:'Sine.easeInOut' });

        // Etiqueta
        this.add.text(tx, ty - 78, 'Taita Lorenzo', {
            fontFamily:"'Press Start 2P'", fontSize:'7px', color:'#d4af37',
            stroke:'#0d2a18', strokeThickness:3,
            backgroundColor:'rgba(13,42,24,.88)', padding:{x:5,y:2}
        }).setOrigin(.5).setDepth(10);

        this._tx = tx; this._ty = ty;
    }

    _secuenciaPortal(){
    const PORTAL_X = TAITA_X + 320;
    const PORTAL_Y = TAITA_Y;
    const FRAMES_PORTAL = Array.from({length:15}, (_,i) =>
        'portal' + String(i+1).padStart(2,'0')
    );

    // ── 1. Crear sprite del portal (invisible) ──
    const portal = this.add.sprite(PORTAL_X, PORTAL_Y, 'portal01')
        .setDepth(12).setScale(2).setAlpha(0)
        .setDisplaySize(120, 180);

    // Animar frames del portal en loop
    let pIdx = 0;
    const portalTimer = this.time.addEvent({
        delay: 60,
        callback: () => {
            pIdx = (pIdx + 1) % FRAMES_PORTAL.length;
            portal.setTexture(FRAMES_PORTAL[pIdx]);
        },
        loop: true
    });

    // ── 2. Taita camina hacia el portal ──
    this.tweens.add({
        targets: this._ts,
        x: PORTAL_X - 80,
        duration: 2000,
        ease: 'Linear',
        onStart: () => {
            // Aparecer portal mientras el Taita camina
            this.tweens.add({
                targets: portal,
                alpha: 1,
                duration: 800,
                ease: 'Power2'
            });
        },
        onComplete: () => {
            // ── 3. Jugador camina hacia el portal ──
            this.tweens.add({
                targets: this.pl,
                x: PORTAL_X - 40,
                y: PORTAL_Y,
                duration: 2500,
                ease: 'Linear',
                onComplete: () => {
                    // ── 4. Transición en círculo (iris close) ──
                    this._irisTransicion(() => {
                        window.location.href = 'game-2.html';
                    });
                }
            });
        }
    });
}

    _irisTransicion(onFin){
        // Crea un canvas overlay para el efecto iris
        const W = this.scale.width;
        const H = this.scale.height;

        const overlay = document.createElement('canvas');
        overlay.width  = W;
        overlay.height = H;
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 9999; pointer-events: none;
        `;
        document.body.appendChild(overlay);

        const ctx   = overlay.getContext('2d');
        const cx    = W / 2;
        const cy    = H / 2;
        const rMax  = Math.sqrt(cx * cx + cy * cy) * 1.1;
        let   radio = rMax;
        let   fase  = 'cerrar'; // cerrar → esperar → abrir

        const tick = () => {
            ctx.clearRect(0, 0, W, H);

            // Rectángulo negro completo
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, W, H);

            // Recorte circular (hueco que se cierra o abre)
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(cx, cy, Math.max(radio, 0), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = 'source-over';

            if(fase === 'cerrar'){
                radio -= rMax / 45; // velocidad de cierre
                if(radio <= 0){
                    fase = 'esperar';
                    setTimeout(() => {
                        fase  = 'abrir';
                        radio = 0;
                        onFin(); // navega a game-2.html
                        requestAnimationFrame(tick);
                    }, 400);
                    return;
                }
            } else if(fase === 'abrir'){
                radio += rMax / 40;
                if(radio >= rMax){
                    overlay.remove();
                    return;
                }
            }
            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }

    _aves(){
        // 3 bandadas distribuidas por el mapa
        const bandadas = [
            { x: 800,        y: 600,        angulo: 25  },
            { x: MAP_W/2,    y: 900,        angulo: 200 },
            { x: MAP_W-900,  y: 500,        angulo: 145 },
        ];

        bandadas.forEach((b, bi) => {
            // Cada bandada tiene 3 aves en formación
            const grupo = [];
            for(let i = 0; i < 3; i++){
                const ave = this.add.image(
                    b.x + i*40,
                    b.y + i*20,
                    'bird'
                ).setDepth(20)          // encima de todo el bosque
                .setScale(.5 + i*.08)  // ligeramente distintos tamaños
                .setAlpha(.85 - i*.1);
                grupo.push(ave);
            }

            // Estado de la bandada
            let angulo  = b.angulo;
            let vel     = 90 + bi * 20;        // velocidad px/s
            let vx      = Math.cos(Phaser.Math.DegToRad(angulo)) * vel;
            let vy      = Math.sin(Phaser.Math.DegToRad(angulo)) * vel;
            let liderX  = b.x;
            let liderY  = b.y;

            // Cambia dirección cada 3-5 segundos
            const cambiarDir = () => {
                angulo += Phaser.Math.Between(-60, 60);
                vel     = Phaser.Math.Between(70, 130);
                vx = Math.cos(Phaser.Math.DegToRad(angulo)) * vel;
                vy = Math.sin(Phaser.Math.DegToRad(angulo)) * vel;
            };

            this.time.addEvent({
                delay: Phaser.Math.Between(3000, 5000),
                callback: cambiarDir,
                loop: true
            });

            // Mueve la bandada cada frame
            this.time.addEvent({
                delay: 16,
                callback: () => {
                    liderX += vx * .016;
                    liderY += vy * .016;

                    // Rebota en los límites del mapa (con margen)
                    const M = 200;
                    if(liderX < M || liderX > MAP_W-M) { vx *= -1; angulo = 180-angulo; }
                    if(liderY < M || liderY > MAP_H-M) { vy *= -1; angulo = -angulo; }

                    // Actualiza posición de cada ave en formación
                    grupo.forEach((ave, i) => {
                        const offset = i * 35;
                        ave.x = liderX - Math.cos(Phaser.Math.DegToRad(angulo)) * offset;
                        ave.y = liderY - Math.sin(Phaser.Math.DegToRad(angulo)) * offset;
                        // Voltea imagen según dirección
                        ave.setFlipX(vx < 0);
                    });
                },
                loop: true
            });
        });
    }

    _player(){
        const esFemenino = getPersonaje() === 'f';

        // ── Sets de animación según género ──
        const ANIMS_M = {
            left:   ['walk_left1',   'walk_left2',   'walk_left3'],
            right:  ['walk_right1',  'walk_right2',  'walk_right3'],
            down:   ['walk_down1',   'walk_down2',   'walk_down3'],
            arrive: ['walk_arrive1', 'walk_arrive2', 'walk_arrive3'],
        };

        const ANIMS_F = {
            left:   ['walk2_left1',   'walk2_left2',   'walk2_left3'],
            right:  ['walk2_right1',  'walk2_right2'],              // solo 2 frames
            down:   ['walk2_down1',   'walk2_down2',   'walk2_down3'],
            arrive: ['walk2_arrive1', 'walk2_arrive2', 'walk2_arrive3'],
        };

        const defaultKey = esFemenino ? 'walk2_default' : 'walk_default';
        const ANIMS      = esFemenino ? ANIMS_F : ANIMS_M;

        // ── Sprite del jugador ──
        this.pl = this.physics.add.sprite(300, MAP_H - 300, defaultKey)
            .setDepth(10)
            .setCollideWorldBounds(true)
            .setScale(2);

        this.pl.body.setSize(
            this.pl.width  * .5,
            this.pl.height * .35
        ).setOffset(
            this.pl.width  * .25,
            this.pl.height * .60
        );

        // ── Sistema de animación ──
        this._animDir    = 'idle';
        this._animFrame  = 0;
        this._animFrames = [];

        this.time.addEvent({
            delay: 130,
            callback: () => {
                if (this._animDir === 'idle' || !this.pl.active) return;
                this._animFrame = (this._animFrame + 1) % this._animFrames.length;
                this.pl.setTexture(this._animFrames[this._animFrame]);
            },
            loop: true
        });

        this._setAnim = (dir) => {
            if (dir === this._animDir) return;
            this._animDir = dir;
            if (dir === 'idle') {
                this.pl.setTexture(defaultKey);
                this._animFrame = 0;
                return;
            }
            this._animFrames = ANIMS[dir];
            this._animFrame  = 0;
            this.pl.setTexture(this._animFrames[0]);
        };

        // ── Etiqueta con nombre ──
        const nom = localStorage.getItem('usuario_nombre') || 'Explorador';
        this._plbl = this.add.text(0, 0, nom, {
            fontFamily:"'Press Start 2P'", fontSize:'6px', color:'#f0d060',
            stroke:'#0d2a18', strokeThickness:3
        }).setOrigin(.5).setDepth(11);

        // ── Indicador de inicio ──
        this._arr = this.add.text(0, 0, '▲', {
            fontFamily:"'Press Start 2P'", fontSize:'9px', color:'#f0d060'
        }).setOrigin(.5).setDepth(11);
        this.tweens.add({ targets:this._arr, y:'-=7', yoyo:true, repeat:-1, duration:450 });
        this.time.delayedCall(5000, () => { if(this._arr) this._arr.setVisible(false) });
    }

    /* ── Input ── */
    _input(){
        this.keys=this.input.keyboard.addKeys({
            u:Phaser.Input.Keyboard.KeyCodes.W,   d:Phaser.Input.Keyboard.KeyCodes.S,
            l:Phaser.Input.Keyboard.KeyCodes.A,   r:Phaser.Input.Keyboard.KeyCodes.D,
            u2:Phaser.Input.Keyboard.KeyCodes.UP, d2:Phaser.Input.Keyboard.KeyCodes.DOWN,
            l2:Phaser.Input.Keyboard.KeyCodes.LEFT,r2:Phaser.Input.Keyboard.KeyCodes.RIGHT,
            e:Phaser.Input.Keyboard.KeyCodes.E
        });
        this.dp={u:false,d:false,l:false,r:false};
        const dirs={up:'u',down:'d',left:'l',right:'r'};
        Object.keys(dirs).forEach(dir=>{
            const el=document.getElementById(`dp-${dir}`);
            const k=dirs[dir];
            const on=()=>{this.dp[k]=true; el.classList.add('act')};
            const off=()=>{this.dp[k]=false; el.classList.remove('act')};
            el.addEventListener('touchstart',e=>{e.preventDefault();on()},{passive:false});
            el.addEventListener('touchend',  e=>{e.preventDefault();off()},{passive:false});
            el.addEventListener('mousedown',on);
            el.addEventListener('mouseup',off);
            el.addEventListener('mouseleave',off);
        });
    }

    /* ══ UPDATE ══ */
    update(){
        if(panelOpen || quizOn){ this.pl.setVelocity(0,0); return; }

        const k = this.keys, dp = this.dp;
        let vx = 0, vy = 0;

        if(k.l.isDown  || k.l2.isDown || dp.l) vx = -SPD;
        if(k.r.isDown  || k.r2.isDown || dp.r) vx =  SPD;
        if(k.u.isDown  || k.u2.isDown || dp.u) vy = -SPD;
        if(k.d.isDown  || k.d2.isDown || dp.d) vy =  SPD;
        if(vx !== 0 && vy !== 0){ vx *= .707; vy *= .707; }

        this.pl.setVelocity(vx, vy);

        // ── Selecciona animación según dirección ──
        if(vx === 0 && vy === 0){
            this._setAnim('idle');
        } else if(Math.abs(vx) >= Math.abs(vy)){
            // Movimiento horizontal domina
            this._setAnim(vx < 0 ? 'left' : 'right');
        } else {
            // Movimiento vertical domina
            this._setAnim(vy < 0 ? 'arrive' : 'down');
        }

        const px = this.pl.x, py = this.pl.y;
        if(this._plbl) this._plbl.setPosition(px, py - 46);
        if(this._arr)  this._arr.setPosition(px, py - 60);

        playerWorldX = px; playerWorldY = py;

        this._chkPlantas(px, py);
        this._chkTaita(px, py);
        dibujarMinimap(px, py, this._pobjs);

        if(Phaser.Input.Keyboard.JustDown(k.e)) interactuar();
    }

    _chkPlantas(px,py){
        let near=null,min=PROX_PLANTA;
        this._pobjs.forEach(o=>{
            if(o.spr.getData('rec')) return;
            const d=Phaser.Math.Distance.Between(px,py,o.spr.x,o.spr.y);
            if(d<min){near=o;min=d}
        });
        if(near!==cercana){
            cercana=near;
            const b=document.getElementById('btn-act');
            near?b.classList.add('on'):b.classList.remove('on');
        }
    }

    _chkTaita(px,py){
        const d=Phaser.Math.Distance.Between(px,py,this._tx,this._ty);
        const nc=d<PROX_TAITA;
        if(nc!==taitaCerca){taitaCerca=nc;_actualizarBurbuja()}
        if(nc){
            const cam=this.cameras.main;
            const sx=(this._tx-cam.scrollX)*cam.zoom;
            const sy=(this._ty-cam.scrollY)*cam.zoom-90;
            const b=document.getElementById('burbuja');
            b.style.left=sx+'px'; b.style.top=sy+'px';
            b.style.transform='translateX(-50%)';
        }
    }

    /* Animación de recolección */
    animRec(id){
        const o = this._pobjs.find(x => x.data.id === id);
        if(!o) return;
        o.spr.setData('rec', true);

        // Detener animación de frames
        if(o.timer){ o.timer.remove(); o.timer = null; }

        this.tweens.killTweensOf(o.spr);
        if(o.h) this.tweens.killTweensOf(o.h);

        this.tweens.add({
            targets: [o.spr, o.h].filter(Boolean), // filtra nulls
            y: '-=60', alpha: 0, duration: 600, ease: 'Power2',
            onComplete: () => {
                if(o.spr && o.spr.active) o.spr.setVisible(false);
                if(o.h   && o.h.active)   o.h.setVisible(false);
            }
        });

        // Partículas de recolección
        for(let i = 0; i < 12; i++){
            const a = (i/12) * Math.PI * 2;
            const c = this.add.circle(o.spr.x, o.spr.y, 5, 0x81c784).setDepth(15);
            this.tweens.add({
                targets: c,
                x: o.spr.x + Math.cos(a) * 60,
                y: o.spr.y + Math.sin(a) * 60,
                alpha: 0, scaleX: 0, scaleY: 0,
                duration: 580, ease: 'Power2',
                onComplete: () => c.destroy()
            });
        }
    }
}

/* ════════════════════════════════════════════════════════════════
   FUNCIONES GLOBALES
════════════════════════════════════════════════════════════════ */

function interactuar() {
    if (!cercana || panelOpen || quizOn) return;
    const d = cercana.data;
    if (recolectadas.find(r => r.id === d.id)) return;

    // Límite de 5 plantas
    if (recolectadas.length >= PLANTAS_META) return;

    recolectadas.push(d);
    cercana = null;
    document.getElementById('btn-act').classList.remove('on');

    const ws = game.scene.getScene('World');
    if (ws) ws.animRec(d.id);

    const n = recolectadas.length;
    document.getElementById('hud-txt').textContent = `🌿 ${n} / ${PLANTAS_META} plantas`;
    document.getElementById('hud-fill').style.width = Math.min(n / PLANTAS_META * 100, 100) + '%';

    // Al llegar a 5: mostrar botón quiz y activar parpadeo del Taita en minimapa
    if (n >= PLANTAS_META) {
        document.getElementById('btn-quiz').classList.add('on');
        taitaParpadeo = true;
    }

    if (taitaCerca) _actualizarBurbuja();
    _abrirPanel(d, n);
}

function _abrirPanel(p, n) {
    panelOpen = true;

    // Imagen grande de la planta
    const imgEl = document.getElementById('pp-ico');
    imgEl.innerHTML = `
        <div class="pp-img-wrap">
            <img src="${p.img}" alt="${p.nombre}">
        </div>
    `;

    document.getElementById('pp-nom').textContent  = p.nombre;
    document.getElementById('pp-ci').textContent   = '';
    document.getElementById('pp-desc').textContent = p.desc;
    document.getElementById('pp-usos').textContent = p.usos;
    document.getElementById('pp-prep').textContent = p.prep;

    const pct = Math.min(n / PLANTAS_META * 100, 100);
    document.getElementById('pp-pfill').style.width = pct + '%';
    document.getElementById('pp-ptxt').textContent  =
        n >= PLANTAS_META
            ? `✓ ¡${n} plantas! Habla con el Taita`
            : `${n} / ${PLANTAS_META} para desbloquear el Quiz`;

    document.getElementById('panel').classList.add('on');
}

function cerrarPanel(){
    panelOpen=false;
    document.getElementById('panel').classList.remove('on');
    setTimeout(()=>game.scale.refresh(),420);
}

function _actualizarBurbuja(){
    const b=document.getElementById('burbuja');
    const n=recolectadas.length;
    if(!taitaCerca){b.classList.remove('on');return}
    if(n===0)            b.textContent='¡Bienvenido, joven! Recoge 5 plantas sagradas del bosque 🌿';
    else if(n<PLANTAS_META) b.textContent=`Llevas ${n}... aún te faltan ${PLANTAS_META-n} plantas 🌱`;
    else                 b.textContent='¡Bien hecho, guardián! Ya puedes hacer el Quiz ⚡';
    b.classList.add('on');
}

/* ════════ QUIZ ════════ */
function iniciarQuiz() {
    if (recolectadas.length < PLANTAS_META) return;
    quizOn = true; qIdx = 0; qPts = 0;
    taitaParpadeo = false; // detiene el parpadeo del minimapa

    // Recopilar preguntas SOLO de las 5 plantas recolectadas
    let banco = [];
    recolectadas.forEach(p => {
        banco = banco.concat(p.preguntas || []);
    });

    // Mezclar y tomar hasta 10
    qPregs = banco.sort(() => Math.random() - .5).slice(0, 10);

    document.getElementById('quiz-ov').classList.add('on');
    _mostrarQ();
}

function _mostrarQ(){
    if(qIdx >= qPregs.length){ _finQuiz(); return; }
    const q = qPregs[qIdx];

    // Imagen de la planta que generó esta pregunta
    const plantaDePregunta = recolectadas.find(p =>
        p.preguntas && p.preguntas.some(pr => pr.p === q.p)
    );
    const imgEl = document.getElementById('q-planta-img');
    imgEl.innerHTML = '';
    if(plantaDePregunta){
        const img = document.createElement('img');
        img.src = plantaDePregunta.img;
        img.alt = plantaDePregunta.nombre;
        imgEl.appendChild(img);
    }

    document.getElementById('qprog').textContent = `${qIdx+1}/${qPregs.length}`;
    document.getElementById('qpreg').textContent = q.p;

    const opts = document.getElementById('qopts');
    opts.innerHTML = '';
    q.o.forEach((txt, i) => {
        const b = document.createElement('button');
        b.className = 'qopt';
        b.textContent = txt;
        b.disabled = false;                 // ← reactiva
        b.style.pointerEvents = 'auto';     // ← reactiva clicks
        b.style.background    = '';         // ← limpia color anterior
        b.style.borderColor   = '';
        b.style.color         = '';
        b.onclick = () => _resp(i, q.c, b); // ← nombre correcto
        opts.appendChild(b);
    });

    // Timer
    clearInterval(qInt);
    qSeg = 15;
    document.getElementById('qtim').textContent = qSeg;
    document.getElementById('qbf').style.transition = 'none';
    document.getElementById('qbf').style.width = '100%';
    setTimeout(() => {
        document.getElementById('qbf').style.transition = `width ${qSeg}s linear`;
        document.getElementById('qbf').style.width = '0%';
    }, 50);
    qInt = setInterval(() => {
        qSeg--;
        document.getElementById('qtim').textContent = qSeg;
        if(qSeg <= 0){ clearInterval(qInt); _resp(-1, q.c, null); } // ← nombre correcto
    }, 1000);
}

function _tick(){
    document.getElementById('qtim').textContent=qSeg;
    document.getElementById('qbf').style.width=(qSeg/15*100)+'%';
    document.getElementById('qtim').classList.toggle('r',qSeg<=5);
}

function _resp(idx, correcto, btn){
    clearInterval(qInt);

    // Bloquear todos los botones
    document.querySelectorAll('.qopt').forEach(b => {
        b.disabled = true;
        b.style.pointerEvents = 'none';
    });

    const opts = document.getElementById('qopts');
    const botones = opts.querySelectorAll('.qopt');

    // Marcar correcta en verde siempre
    if(botones[correcto]){
        botones[correcto].style.background   = 'rgba(46,160,67,.85)';
        botones[correcto].style.borderColor  = '#2ea043';
        botones[correcto].style.color        = '#ffffff';
    }

    if(idx === correcto){
        // Respuesta correcta
        qPts++;
        if(btn){
            btn.style.background  = 'rgba(46,160,67,.85)';
            btn.style.borderColor = '#2ea043';
        }
    } else if(idx >= 0 && btn){
        // Respuesta incorrecta — marcar en rojo
        btn.style.background  = 'rgba(200,50,50,.85)';
        btn.style.borderColor = '#c83232';
        btn.style.color       = '#ffffff';
    }
    // idx === -1 significa tiempo agotado — solo se muestra la correcta

    // Esperar 1.5s para que el jugador vea la respuesta correcta
    setTimeout(() => {
        qIdx++;
        _mostrarQ();
    }, 1500);
}

function _finQuiz(){
    clearInterval(qInt);
    document.getElementById('quiz-ov').classList.remove('on');
    quizOn=false;
    const pct=qPts/10;
    let emo,tit,desc;
    if(pct>=.9){emo='🏆';tit='¡Guardián del Bosque!';desc='Conoces profundamente las plantas sagradas del territorio Pastos'}
    else if(pct>=.7){emo='🌿';tit='¡Buen Explorador!';desc='Tienes buen conocimiento del bosque sagrado'}
    else if(pct>=.5){emo='🌱';tit='Aprendiz del Bosque';desc='Sigue explorando y aprendiendo del territorio'}
    else{emo='🍂';tit='Sigue Intentando';desc='El bosque tiene mucho más por enseñarte'}
    document.getElementById('re').textContent=emo;
    document.getElementById('rt').textContent=tit;
    document.getElementById('rp').textContent=`${qPts}/10`;
    document.getElementById('rd').textContent=desc;
    document.getElementById('res-ov').classList.add('on');
    localStorage.setItem('puntos_total',(parseInt(localStorage.getItem('puntos_total')||'0')+qPts*10));
    localStorage.setItem('partidas',(parseInt(localStorage.getItem('partidas')||'0')+1));
}

function continuar(){
    document.getElementById('res-ov').classList.remove('on');
    const ws = game.scene.getScene('World');
    if(ws) ws._secuenciaPortal();
}

function repetirQuiz(){document.getElementById('res-ov').classList.remove('on');iniciarQuiz()}
function irMenu(){window.location.href='menugeneral.html'}

/* ════════ PHASER INIT ════════ */
const game=new Phaser.Game({
    type:Phaser.AUTO,
    parent:'game-container',
    width:window.innerWidth,
    height:window.innerHeight,
    backgroundColor:'#276132',
    physics:{default:'arcade',arcade:{gravity:{y:0},debug:false}},
    scene:[PreloadScene,WorldScene],
    scale:{mode:Phaser.Scale.RESIZE,autoCenter:Phaser.Scale.CENTER_BOTH}
});