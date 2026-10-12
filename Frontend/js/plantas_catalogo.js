// Catálogo completo de 30 plantas — se eligen 10 al azar cada partida

window.PLANTAS_CATALOGO = [
    {
        id:'ajenjo', nombre:'Ajenjo',
        img:'../images/game/plants/AJENJO.jpg',
        desc:'Hierba amarga del territorio Pasto, valorada por los sabedores por su capacidad de purificar el organismo. Se reconoce fácilmente por su aroma intenso y sus hojas plateadas.',
        usos:'Colesterol e hígado graso.',
        prep:'3 hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Ajenjo?',     o:['Colesterol e hígado graso','Dolor de oído','Para los nervios','Para la tos'], c:0},
            {p:'¿Cómo se prepara\nel Ajenjo?',    o:['Se cocina y se baña','Se aplica directamente','3 hojas en infusión','Se macera con aguardiente'], c:2},
        ]
    },
    {
        id:'altamisa', nombre:'Altamisa',
        img:'../images/game/plants/ALTAMISA.jpg',
        desc:'Planta sagrada del territorio usada en limpias y rituales. Los mayores la calientan en la tulpa para extraer sus propiedades curativas antes de aplicarla.',
        usos:'Mal aire, sacar el frío, barrer el horno de leña.',
        prep:'Se calienta en la tulpa y se aplica en la zona afectada.',
        preguntas:[
            {p:'¿Para qué sirve\nla Altamisa?',   o:['Para los riñones','Mal aire y sacar el frío','Controlar el azúcar','Quemaduras'], c:1},
            {p:'¿Cómo se prepara\nla Altamisa?',  o:['En infusión','Se calienta en la tulpa y aplica en zona afectada','Se consume cruda','Se machaca y toma el zumo'], c:1},
        ]
    },
    {
        id:'arnica', nombre:'Árnica',
        img:'../images/game/plants/ARNICA.jpg',
        desc:'Conocida en la comunidad como la hierba de los golpes. Sus flores amarillas son símbolo de sanación y los médicos tradicionales la usan para tratar dolencias físicas.',
        usos:'Antiinflamatorio.',
        prep:'Se cocina y se hace baños.',
        preguntas:[
            {p:'¿Para qué se usa\nel Árnica?',     o:['Desparasitante','Dolor de garganta','Antiinflamatorio','Sedante'], c:2},
            {p:'¿Cómo se prepara\nel Árnica?',     o:['En infusión de flores','Se aplica el cristal','Se cocina y se hacen baños','Se pone a enserenar'], c:2},
        ]
    },
    {
        id:'breva', nombre:'Breva',
        img:'../images/game/plants/BREVA.jpg',
        desc:'Fruto y hoja con propiedades ancestrales reconocidas por las parteras del territorio. Su uso en infusión con miel es parte del conocimiento de las abuelas Pasto.',
        usos:'Quitar el frío e inducir los dolores del parto.',
        prep:'Una hoja en infusión con un pedazo de panela o miel de abeja.',
        preguntas:[
            {p:'¿Qué propiedad\ntiene la Breva?',  o:['Antibiótico','Quitar frío e inducir dolores del parto','Controlar colesterol','Tratar la diabetes'], c:1},
            {p:'¿Cómo se prepara\nla Breva?',      o:['Tres ramas con miel','Una hoja en infusión con panela o miel','Se cocina la raíz','Se consume la fruta directamente'], c:1},
        ]
    },
    {
        id:'calendula', nombre:'Caléndula',
        img:'../images/game/plants/CALENDULA.jpg',
        desc:'Sus flores naranja y amarillo adornan la chagra familiar. Más que decorativa, la Caléndula es una de las plantas medicinales más usadas en la comunidad de Chapal.',
        usos:'Antiinflamatorio, previene la gastritis.',
        prep:'Tres flores en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nla Caléndula?',   o:['Antiinflamatorio y previene la gastritis','Para la tos y catarro','Dolores musculares','Dolor de estómago'], c:0},
            {p:'¿Cómo se prepara\nla Caléndula?',  o:['Una hoja en infusión','Se aplica directamente','Tres flores en infusión','Se machaca y exprime'], c:2},
        ]
    },
    {
        id:'cidron', nombre:'Cidrón',
        img:'../images/game/plants/CIDRON.jpg',
        desc:'Hierba de hojas rugosas con aroma cítrico que acompaña las mingas y reuniones del cabildo. Los sabedores la recomiendan tanto para el cuerpo como para el espíritu.',
        usos:'Sacar el frío, baños vaginales, regular la presión.',
        prep:'Tres hojas en infusión; vaporizaciones para baños.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Cidrón?',  o:['Desintoxicante','Sacar el frío, baños vaginales y regular la presión','Para los nervios','Para la circulación'], c:1},
            {p:'¿Cómo se prepara\nel Cidrón?',      o:['Se consume crudo','Tres hojas en infusión y vaporizaciones','Se machaca con aguardiente','Una ramita en infusión'], c:1},
        ]
    },
    {
        id:'clavel', nombre:'Clavel',
        img:'../images/game/plants/CLAVEL.jpg',
        desc:'Flor de color intenso que los mayores usan para calmar el sistema nervioso. Su preparación nocturna en agua fría es una técnica ancestral transmitida de generación en generación.',
        usos:'Sirve para los nervios.',
        prep:'Se pone a enserenar durante una noche en un vaso con agua y a la mañana siguiente se toma.',
        preguntas:[
            {p:'¿Para qué sirve\nel Clavel?',      o:['Para el dolor de oído','Para la gastritis','Para los nervios','Para la tos'], c:2},
            {p:'¿Cómo se prepara\nel Clavel?',     o:['En infusión caliente','Se aplica directamente','Se enserea en agua una noche y se toma','Se cocina y se baña'], c:2},
        ]
    },
    {
        id:'cofrey', nombre:'Cofrey',
        img:'../images/game/plants/COFREY.jpg',
        desc:'Planta de grandes hojas reconocida por su poder regenerador. En la comunidad Pasto se valora especialmente por su capacidad de incrementar los glóbulos rojos y cicatrizar heridas.',
        usos:'Nivela el colesterol, incrementa glóbulos rojos, cicatrizante.',
        prep:'Una hoja en infusión; para uso externo se cocina.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Cofrey?', o:['Sedante y relajante','Nivela colesterol, glóbulos rojos y cicatriza','Para el mal aire','Para la diabetes'], c:1},
            {p:'¿Cómo se prepara\nel Cofrey?',      o:['Tres flores en infusión','Una hoja en infusión; cocido para uso externo','Se consume la fruta','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'diente-de-leon', nombre:'Diente de León',
        img:'../images/game/plants/DIENTE-DE-LEON.jpg',
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
        img:'../images/game/plants/EUCALIPTO.jpg',
        desc:'Árbol de presencia imponente en el paisaje de Funes. Sus hojas aromáticas son utilizadas tanto en vaporizaciones para limpiar las vías respiratorias como en rituales de sahumerio.',
        usos:'Para la tos, catarro y sahumerio.',
        prep:'Se cocina y se hacen vaporizaciones; las hojas se queman para sahumerio.',
        preguntas:[
            {p:'¿Para qué sirve\nel Eucalipto?',   o:['Para los nervios','Para la tos, catarro y sahumerio','Para el colesterol','Para la circulación'], c:1},
            {p:'¿Cómo se prepara\nel Eucalipto?',  o:['Una hoja en infusión','Se cocina para vaporizaciones y quema para sahumerio','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'hierba-buena', nombre:'Hierba Buena',
        img:'../images/game/plants/HIERBA-BUENA.jpg',
        desc:'Planta de aroma fresco y mentolado que crece junto a las fuentes de agua del resguardo. Su uso como desparasitante es conocido especialmente por las madres y abuelas de la comunidad.',
        usos:'Actúa como desparasitante y relajante.',
        prep:'Tres hojas en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Hierba Buena?', o:['Antiinflamatorio','Para quemaduras','Desparasitante y relajante','Para la presión'], c:2},
            {p:'¿Cómo se prepara\nla Hierba Buena?',      o:['Se machaca y exprime','Se aplica directamente','Tres hojas en infusión','Se calienta en la tulpa'], c:2},
        ]
    },
    {
        id:'insulina', nombre:'Insulina',
        img:'../images/game/plants/INSULINA.jpg',
        desc:'Planta de sabor amargo cuyo nombre popular refleja su uso más conocido en la medicina tradicional del territorio. Los mayores la preparan con paciencia dejándola reposar toda la noche.',
        usos:'Controla el azúcar en la sangre.',
        prep:'Se cocina un día y se consume al día siguiente.',
        preguntas:[
            {p:'¿Para qué sirve la\nplanta Insulina?',  o:['Para el dolor de garganta','Para los nervios','Controla el azúcar en la sangre','Para la tos'], c:2},
            {p:'¿Cómo se prepara la\nplanta Insulina?', o:['Tres flores en infusión','Se cocina un día y se consume al siguiente','Se aplica el cristal','Se pone a enserenar'], c:1},
        ]
    },
    {
        id:'llanten', nombre:'Llantén',
        img:'../images/game/plants/LLANTEN.jpg',
        desc:'Llamada "medicina de la tierra" por los mayores del cabildo de Chapal. Sus hojas verdes y resistentes crecen en los caminos y son señal de suelo fértil en el resguardo.',
        usos:'Limpiar el hígado, herpes, dolores musculares y golpes.',
        prep:'En infusión y se machaca para consumir directamente.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Llantén?',  o:['Limpiar hígado, herpes, dolores y golpes','Para la gastritis','Para la presión alta','Sedante'], c:0},
            {p:'¿Cómo se prepara\nel Llantén?',       o:['Se cocina y se baña','En infusión y machacado directo','Se consume la fruta','Tres cogollos en infusión'], c:1},
        ]
    },
    {
        id:'manzanilla', nombre:'Manzanilla',
        img:'../images/game/plants/MANZANILLA.jpg',
        desc:'Una de las plantas más queridas y utilizadas en la medicina ancestral de Chapal. Sus pequeñas flores blancas y amarillas son símbolo de cuidado y bienestar en el hogar Pasto.',
        usos:'Para la digestión, los cólicos, antiinflamatorio y sacar el frío.',
        prep:'En infusión de tres flores o la planta completa.',
        preguntas:[
            {p:'¿Para qué sirve\nla Manzanilla?',  o:['Para la circulación','Digestión, cólicos, antiinflamatorio y sacar el frío','Para el mal aire','Antibiótico'], c:1},
            {p:'¿Cómo se prepara\nla Manzanilla?', o:['Se aplica el cristal','Se santigua con la planta','Tres flores o planta completa en infusión','Se machaca con aguardiente'], c:2},
        ]
    },
    {
        id:'menta', nombre:'Menta',
        img:'../images/game/plants/MENTA.jpg',
        desc:'Sus cogollos frescos y aromáticos son reconocidos en todo el territorio. La menta es una de las plantas de uso cotidiano en los hogares del resguardo de Funes.',
        usos:'Para la presión alta y el dolor de garganta.',
        prep:'Tres cogollos en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Menta?',  o:['Para la presión alta y dolor de garganta','Para los riñones','Para el colesterol','Para el parto'], c:0},
            {p:'¿Cómo se prepara\nla Menta?',       o:['Una hoja en infusión','Se consume la fruta','Tres cogollos en infusión','Se calienta y aplica'], c:2},
        ]
    },
    {
        id:'mispero', nombre:'Míspero',
        img:'../images/game/plants/MISPERO.jpg',
        desc:'Planta frutal del bosque andino cuyas hojas son valoradas por sus propiedades antibióticas naturales. Los sabedores de Chapal la usan para tratar infecciones urinarias.',
        usos:'Para la cistitis y como antibiótico.',
        prep:'Una hoja en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Míspero?',  o:['Para el pasmo','Para la cistitis y como antibiótico','Para los nervios','Para el estrés'], c:1},
            {p:'¿Cómo se prepara\nel Míspero?', o:['Tres ramas con miel','Se cocina la raíz','Una hoja en infusión','Se macera con aguardiente'], c:2},
        ]
    },
    {
        id:'nabo', nombre:'Nabo',
        img:'../images/game/plants/NABO.jpg',
        desc:'Raíz comestible del altiplano nariñense que también es planta medicinal. Las abuelas del cabildo lo usan especialmente para apoyar a las madres lactantes.',
        usos:'Desintoxicante, sirve para el colon y en mujeres para producir más leche en lactancia.',
        prep:'Se cocina y se consume; las flores se cocinan en agua de panela para las mujeres.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Nabo?',  o:['Para la tos','Desintoxicante, colon y leche materna','Para el mal aire','Para quemaduras'], c:1},
            {p:'¿Cómo se prepara\nel Nabo?',       o:['Se aplica el cristal','Se cocina y consume; flores en agua de panela','Una hoja en infusión','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'oregano', nombre:'Orégano',
        img:'../images/game/plants/OREGANO.jpg',
        desc:'Hierba aromática de cocina y medicina a la vez. En la comunidad de Chapal su uso va más allá de los alimentos: los cogollos en infusión alivian dolencias que la medicina convencional no siempre atiende.',
        usos:'Para el dolor de oído y el estreñimiento.',
        prep:'Tres cogollos en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nel Orégano?',  o:['Para la ansiedad','Dolor de oído y estreñimiento','Para la diabetes','Para los riñones'], c:1},
            {p:'¿Cómo se prepara\nel Orégano?', o:['Se cocina y baña','Tres cogollos en infusión','Se aplica directamente','Se macera con aguardiente'], c:1},
        ]
    },
    {
        id:'ortiga', nombre:'Ortiga',
        img:'../images/game/plants/ORTIGA.jpg',
        desc:'El "ortigo" es símbolo de fortaleza en la cosmología Pasto. A pesar de su picadura, esta planta guarda propiedades medicinales que los sabedores del cabildo han preservado por siglos.',
        usos:'Para la circulación y alergias.',
        prep:'Tres hojas en infusión; también se cocina y se baña.',
        preguntas:[
            {p:'¿Cuál es la función\nde la Ortiga?',  o:['Para la circulación y alergias','Para la gastritis','Para el dolor de parto','Sedante'], c:0},
            {p:'¿Cómo se prepara\nla Ortiga?',       o:['Se pone a enserenar','Una ramita en infusión','Tres hojas en infusión y baños cocidos','Se consume la fruta'], c:2},
        ]
    },
    {
        id:'pepino-dulce', nombre:'Pepino Dulce',
        img:'../images/game/plants/PEPINO-DULCE.jpg',
        desc:'Fruto andino de pulpa suave y dulce, cultivado en la chagra familiar. Su consumo directo es valorado como remedio natural para mantener sanos los riñones.',
        usos:'Para los riñones.',
        prep:'Se consume la fruta.',
        preguntas:[
            {p:'¿Para qué sirve\nel Pepino Dulce?', o:['Para los nervios','Para la tos','Para los riñones','Para el colesterol'], c:2},
            {p:'¿Cómo se usa\nel Pepino Dulce?',   o:['En infusión','Se aplica directamente','Se consume la fruta','Se cocina y baña'], c:2},
        ]
    },
    {
        id:'poleo', nombre:'Poleo',
        img:'../images/game/plants/POLEO.jpg',
        desc:'Hierba del páramo nariñense con propiedades caloríficas. Los médicos tradicionales de Chapal la usan para tratar el pasmo, una afección propia del saber ancestral del territorio.',
        usos:'Para el pasmo y la tos.',
        prep:'Se cocina tres ramas con agua y miel.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Poleo?',  o:['Para quemaduras','Para el pasmo y la tos','Para la presión','Desparasitante'], c:1},
            {p:'¿Cómo se prepara\nel Poleo?',     o:['Se aplica el cristal','Se cocina tres ramas con agua y miel','Una hoja en infusión','Se santigua con la planta'], c:1},
        ]
    },
    {
        id:'romerillo', nombre:'Romerillo',
        img:'../images/game/plants/ROMERILLO.jpg',
        desc:'Planta silvestre del bosque andino diferente del romero de cocina. Su zumo machacado es un remedio tradicional para el mal viento, concepto propio de la medicina ancestral Pasto.',
        usos:'Sirve para el mal viento y los nervios.',
        prep:'Se machaca, se exprime y se toma el zumo.',
        preguntas:[
            {p:'¿Para qué sirve\nel Romerillo?',  o:['Para la circulación','Para el colesterol','Mal viento y nervios','Para la diabetes'], c:2},
            {p:'¿Cómo se prepara\nel Romerillo?', o:['Tres flores en infusión','Se calienta en la tulpa','Se machaca, exprime y toma el zumo','Se consume cocido'], c:2},
        ]
    },
    {
        id:'romero', nombre:'Romero',
        img:'../images/game/plants/ROMERO.jpg',
        desc:'Planta aromática de múltiples usos en el territorio Pasto. Los sabedores destacan su valor para la memoria, lo que la hace especial en una comunidad que transmite su cultura de forma oral.',
        usos:'Dolor de estómago, para la memoria y antiinflamatorio.',
        prep:'Una ramita en infusión.',
        preguntas:[
            {p:'¿Cuáles son funciones\ndel Romero?',  o:['Para la tos y catarro','Dolor de estómago, memoria y antiinflamatorio','Para la cistitis','Para los riñones'], c:1},
            {p:'¿Cómo se prepara\nel Romero?',       o:['Se cocina para vaporizaciones','Una ramita en infusión','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'ruda', nombre:'Ruda',
        img:'../images/game/plants/RUDA.jpg',
        desc:'Planta sagrada de protección en el resguardo de Funes. La Ruda es protagonista de rituales de limpieza espiritual y los médicos tradicionales la santiguan sobre el cuerpo para curar el mal aire.',
        usos:'Para curar el mal aire y dolores menstruales.',
        prep:'Se santigua con la planta; infusión de tres flores para dolores menstruales.',
        preguntas:[
            {p:'¿Para qué sirve\nla Ruda?',  o:['Para la tos','Para el colesterol','Curar el mal aire y dolores menstruales','Para los riñones'], c:2},
            {p:'¿Cómo se prepara\nla Ruda?', o:['Se consume cruda','Se santigua con la planta; infusión para dolores','Tres cogollos en infusión','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'savila', nombre:'Sábila',
        img:'../images/game/plants/SAVILA.jpg',
        desc:'Planta de cristal suculento que crece en los huertos y jardines del resguardo. Su gel transparente es uno de los remedios más usados por las familias de Chapal para aliviar quemaduras y problemas digestivos.',
        usos:'Para quemaduras y gastritis.',
        prep:'Se aplica el cristal directamente en la zona y se consume el cristal.',
        preguntas:[
            {p:'¿Para qué sirve\nla Sábila?',  o:['Para la presión','Para los nervios','Para quemaduras y gastritis','Para el mal aire'], c:2},
            {p:'¿Cómo se prepara\nla Sábila?', o:['En infusión de hojas','Se cocina y se hacen baños','Se aplica el cristal y se consume','Se pone a enserenar'], c:2},
        ]
    },
    {
        id:'seguidora', nombre:'Seguidora',
        img:'../images/game/plants/SEGUIDORA.jpg',
        desc:'Planta de uso espiritual en la comunidad Pasto. A diferencia de otras plantas medicinales, no se ingiere: basta con tenerla en el hogar para que cumpla su función protectora.',
        usos:'Ahuyentar las malas energías.',
        prep:'Se tiene una planta en la casa.',
        preguntas:[
            {p:'¿Para qué sirve\nla Seguidora?', o:['Para el dolor de garganta','Ahuyentar las malas energías','Para la tos','Para la diabetes'], c:1},
            {p:'¿Cómo se usa\nla Seguidora?',   o:['En infusión de tres hojas','Se cocina la raíz','Se tiene una planta en la casa','Se macera con chapil'], c:2},
        ]
    },
    {
        id:'tomillo', nombre:'Tomillo',
        img:'../images/game/plants/TOMILLO.jpg',
        desc:'Hierba de hojas pequeñas y aroma intenso que crece en los jardines del resguardo. Los sabedores la recomiendan para las molestias digestivas y del sistema respiratorio superior.',
        usos:'Para el dolor de estómago y dolor de garganta.',
        prep:'Una rama en infusión.',
        preguntas:[
            {p:'¿Cuál es la función\ndel Tomillo?',  o:['Para la circulación','Para los nervios','Dolor de estómago y garganta','Para la diabetes'], c:2},
            {p:'¿Cómo se prepara\nel Tomillo?',     o:['Se cocina para vaporizaciones','Una rama en infusión','Se consume la fruta','Se aplica el cristal'], c:1},
        ]
    },
    {
        id:'toronjil-grande', nombre:'Toronjil Grande',
        img:'../images/game/plants/TORONJIL-GRANDE.jpg',
        desc:'Hierba del corazón según los mayores de Chapal. Su aroma calmante y sus propiedades sedantes la convierten en aliada de quienes sufren los efectos del estrés y la ansiedad en la vida moderna.',
        usos:'Controla el estrés, la ansiedad y el insomnio.',
        prep:'Dos hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve el\nToronjil Grande?',  o:['Para la tos','Controla estrés, ansiedad e insomnio','Para el colesterol','Para quemaduras'], c:1},
            {p:'¿Cómo se prepara el\nToronjil Grande?', o:['Tres ramas con miel','Se cocina la raíz','Se pone a enserenar','Dos hojas en infusión'], c:3},
        ]
    },
    {
        id:'toronjil-pequeno', nombre:'Toronjil Pequeño',
        img:'../images/game/plants/TORONJIL-PEQUENO.jpg',
        desc:'Primo del toronjil grande pero con propiedades distintas. Los médicos tradicionales distinguen claramente entre ambas variedades y las recetan para condiciones diferentes del cuerpo.',
        usos:'Náuseas, gases; irritabilidad y nerviosismo.',
        prep:'Un cogollo en infusión.',
        preguntas:[
            {p:'¿Cuál es la función del\nToronjil Pequeño?', o:['Para la circulación','Para la diabetes','Náuseas, gases, irritabilidad y nerviosismo','Para la tos'], c:2},
            {p:'¿Cómo se prepara el\nToronjil Pequeño?',    o:['Un cogollo en infusión','Se cocina y hace baños','Se machaca y exprime','Tres flores en infusión'], c:0},
        ]
    },
    {
        id:'valeriana', nombre:'Valeriana',
        img:'../images/game/plants/VALERIANA.jpg',
        desc:'Planta de raíces con aroma particular, usada desde tiempos ancestrales como calmante natural. Los sabedores de Chapal la prescriben para los estados de agitación nerviosa y el insomnio.',
        usos:'Para los nervios y como sedante.',
        prep:'Tres hojas en infusión.',
        preguntas:[
            {p:'¿Para qué sirve\nla Valeriana?',  o:['Para la presión','Para los nervios y como sedante','Para quemaduras','Para el colesterol'], c:1},
            {p:'¿Cómo se prepara\nla Valeriana?', o:['Se aplica directamente','Se consume la fruta','Se pone a enserenar una noche','Tres hojas en infusión'], c:3},
        ]
    },
];