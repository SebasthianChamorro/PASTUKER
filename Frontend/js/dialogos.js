/* ═══════════════════════════════════════════════════════════
   PASTUKER — dialogos.js
   Sistema reutilizable de diálogos para todos los personajes
   Uso: DialogoSistema.mostrar('index_bienvenida');
═══════════════════════════════════════════════════════════ */

const DialogoSistema = (() => {

    /* ── Detectar ruta base según ubicación de la página ── */
    const _enPages = window.location.pathname.includes('/pages/');
    const _imgBase = _enPages ? '../images' : 'images';
    const _audioBase = _enPages ? '../audio/dialogos' : 'audio/dialogos';

    /* ── Personajes ── */
    const PERSONAJES = {
        taita: {
            nombre: 'Taita Lorenzo',
            rol: 'Sabedor del Pueblo Pastos',
            emoji: '🧙',
            clase: 'taita',
            img: `${_imgBase}/taita/taita_frame1.png`
        },
        mama: {
            nombre: 'Mama Rosa',
            rol: 'Guardiana de Rituales',
            emoji: '👵',
            clase: 'mama-rosario',
            img: `${_imgBase}/mama/mama_frame1.png`
        }
    };

    const DIALOGOS = {
        index_bienvenida: { personaje: 'taita', texto: 'Guagua de la tierra, hijo del viento y la montaña... bienvenido a Pastuker. Aquí, entre raíces antiguas y saberes que el tiempo no ha borrado, caminarás por los senderos que nuestros mayores nos dejaron. Este no es un juego. Es una memoria viva.' },
        index_regreso: { personaje: 'taita', texto: 'El bosque te espera, guagua. Las plantas recuerdan tus pasos. Continúa donde el camino se detuvo.' },
        login_bienvenida: { personaje: 'mama', texto: 'Ay, guagua, bienvenido. Para entrar al territorio sagrado, el bosque necesita reconocerte. Dime tu nombre y tu palabra secreta, y las puertas del conocimiento ancestral se abrirán.' },
        login_error: { personaje: 'mama', texto: 'Hmm... el bosque no te reconoce con esas palabras, mijo. Intenta de nuevo.' },
        login_cargando: { personaje: 'mama', texto: 'El viento lleva tu nombre hacia los espíritus del territorio... un momento, guagua.' },
        register_bienvenida: { personaje: 'mama', texto: 'Ay, qué bueno que llegaste. Antes de caminar por el bosque sagrado, necesito conocerte. Dime tu nombre, guagua, y elige cómo quieres que te vea el territorio. Cada ser tiene su lugar en la chagra.' },
        register_genero: { personaje: 'mama', texto: 'Bien, mijo. El bosque te verá tal como eres. No hay camino equivocado, todos llevan al mismo conocimiento.' },
        register_completo: { personaje: 'mama', texto: 'Tu nombre queda tejido en la memoria del territorio. Ya eres parte de esta historia, guagua. El bosque te espera.' },
        menu_bienvenida: { personaje: 'taita', texto: 'Este es tu territorio, guagua. Desde aquí puedes explorar los mundos que el saber ancestral de los Pastos tiene para ti. Cada mundo guarda una enseñanza diferente. ¿Por cuál comenzarás?' },
        menu_sin_mundos: { personaje: 'taita', texto: 'El Bosque Sagrado te aguarda. Es el primer sendero. Allí aprenderás a reconocer las plantas que nuestras abuelas usaban para sanar el cuerpo y el espíritu.' },
        menu_mundo1_completo: { personaje: 'taita', texto: 'Cruzaste el bosque con valentía, guagua. Ahora La Maloca te abre sus puertas. Adentro viven los rituales y ceremonias de nuestro pueblo. Entra con respeto.' },
        juegos_bienvenida: { personaje: 'taita', texto: 'Los mundos son como semillas, guagua. Cada uno guarda vida adentro. Toca el que sientas en el corazón.' },
        juegos_mundo1: { personaje: 'taita', texto: 'El Bosque Sagrado... tierra de plantas que curan, purifican y conectan. Recoge con cuidado, observa con atención. El bosque habla a quienes saben escuchar.' },
        juegos_mundo2_bloqueado: { personaje: 'taita', texto: 'Aún no, guagua. Ese sendero se abre cuando hayas caminado el primero. Termina tu viaje por el bosque y La Maloca te recibirá.' },
        juego_inicio: { personaje: 'taita', texto: 'Bienvenido al Bosque Sagrado, guagua. En este territorio crecen treinta plantas que nuestros mayores han usado por siglos. Hoy encontrarás cinco de ellas. Acércate, recógelas con respeto, y cuando tengas las cinco... búscame. Tengo preguntas para ti.' },
        juego_taita_sin_plantas: { personaje: 'taita', texto: 'Todavía no, guagua. El bosque tiene más plantas esperándote. Recoge las cinco y regresa. El conocimiento no se apresura.' },
        juego_taita_con_plantas: { personaje: 'taita', texto: 'Bien, guagua explorador. Veo que el bosque te habló. Ahora demostremos que lo escuchaste. Es hora del quiz.' },
        juego_antes_quiz: { personaje: 'taita', texto: 'Las preguntas que haré vienen de las propias plantas que encontraste. Ellas mismas te evaluarán. Responde con calma, con lo que aprendiste. El saber ancestral no se olvida fácilmente.' },
        juego_resultado_bueno: { personaje: 'taita', texto: 'El bosque está orgulloso de ti, guagua. Llevas el conocimiento en el corazón, donde realmente debe vivir. Un portal se ha abierto. El siguiente sendero te espera.' },
        juego_resultado_regular: { personaje: 'taita', texto: 'Vas por buen camino, guagua. Algunas plantas aún guardan sus secretos para ti. No importa, el conocimiento llega con la práctica. Sigue adelante.' },
        juego_resultado_bajo: { personaje: 'taita', texto: 'El bosque sabe que estás aprendiendo, guagua. No te desanimes. Cada error es una semilla que, con el tiempo, da fruto. Inténtalo de nuevo.' },
        juego_portal: { personaje: 'taita', texto: 'Camina hacia la luz, guagua. El siguiente mundo te espera. Yo seguiré aquí, cuidando el bosque... hasta que vuelvas.' },
        ranking_bienvenida: { personaje: 'taita', texto: 'El territorio recuerda a quienes más han caminado por él. Aquí están los nombres de los guaguas que han honrado el saber de los Pastos. ¿Estará el tuyo entre ellos?' },
        ranking_top3: { personaje: 'taita', texto: 'Tu nombre brilla en el territorio, guagua. Los mayores estarían orgullosos.' },
        perfil_bienvenida: { personaje: 'mama', texto: 'Ay, guagua, qué bueno verte por aquí. Yo soy Mama Rosa, la guardiana de los rituales del cabildo. Así como tejemos el manto con hilos de colores, tú puedes tejer tu imagen aquí. Elige tu avatar, el que sienta que te representa.' },
        perfil_avatar_cambiado: { personaje: 'mama', texto: '¡Ese te queda bien, mijito! El territorio ya sabe cómo verte.' },
        perfil_guardado: { personaje: 'mama', texto: 'Listo, guagua. Ya quedaste registrado en la memoria del cabildo. Ahora sí, ¡a jugar!' },
        logro_primera_planta: { personaje: 'taita', texto: '¡Tu primera planta! El bosque te acepta, guagua.' },
        logro_cinco_plantas: { personaje: 'taita', texto: 'El espíritu del bosque está contigo. Cinco plantas en tus manos.' },
        logro_quiz_perfecto: { personaje: 'taita', texto: '10 de 10, guagua. El conocimiento de los mayores vive en ti.' },
        logro_mundo_completo: { personaje: 'taita', texto: 'Completaste el Bosque Sagrado. El territorio te recuerda.' },
        maloca_bienvenida: { personaje: 'mama', texto: 'Bienvenido/a a la Maloca, guagua. Aquí viven los rituales sagrados y la vestimenta de nuestro Pueblo Pasto. Yo, Mama Rosa, te guiaré por este camino. Escucha con el corazón.' },
        maloca_rituales_intro: { personaje: 'mama', texto: 'Los rituales no son solo fiestas, hijo/a. Son la forma en que nuestro pueblo habla con el territorio, con el sol, con la tierra. Cada paso tiene un significado. Apréndetelos bien.' },
        maloca_inti_raymi: { personaje: 'mama', texto: 'El Inti Raymi, la Fiesta del Sol. Cada 21 de junio el fuego sagrado se enciende y toda la comunidad se reúne. Es el momento de renovar nuestra energía y agradecer al Padre Sol por la vida.' },
        maloca_koya_raymi: { personaje: 'mama', texto: 'El Koya Raymi honra a la mujer, a la fertilidad, a la vida que nace. Sin la mujer no hay comunidad, no hay continuidad. El 21 de septiembre es nuestro día, guagua.' },
        maloca_elementos_sagrados: { personaje: 'mama', texto: 'El fuego purifica. El sahumerio armoniza. La Mojiganga une. Estos tres elementos son el corazón de nuestros rituales. Sin ellos, el espacio sagrado no despierta.' },
        maloca_vestimenta_hombre_intro: { personaje: 'mama', texto: 'Ahora te mostraré cómo viste el hombre Pasto. Cada prenda tiene historia, tiene memoria. No son solo telas, guagua. Son la identidad de nuestro pueblo puesta en el cuerpo.' },
        maloca_vestimenta_mujer_intro: { personaje: 'mama', texto: 'Y ahora la vestimenta de la mujer Pasto. Cada prenda que cargo representa fuerza, trabajo y belleza ancestral. Las manos de nuestras abuelas tejieron cada hilo con amor.' },
        puzzle_inicio: { personaje: 'mama', texto: 'Ahora pon a prueba lo que aprendiste, guagua. Los pasos del ritual están desordenados. Arma cada rompecabezas y demuestra que el conocimiento quedó en tu corazón.' },
        puzzle_antes_facil: { personaje: 'mama', texto: 'Empecemos con calma. Este rompecabezas es sencillo, como los primeros pasos del ritual. Observa bien la imagen y coloca cada pieza en su lugar.' },
        puzzle_antes_medio: { personaje: 'mama', texto: 'Ahora el camino se pone más interesante, guagua. Dos intentos tienes. Piensa antes de mover. El ritual sagrado exige atención y respeto.' },
        puzzle_antes_dificil: { personaje: 'mama', texto: 'Este es el paso más sagrado. Solo tienes un intento, guagua. Así como en el ritual no se puede repetir la armonización, aquí tampoco. Concéntrate.' },
        puzzle_pieza_correcta: { personaje: 'mama', texto: '¡Eso es! Cada pieza en su lugar, como cada paso del ritual en su momento exacto.' },
        puzzle_pieza_incorrecta: { personaje: 'mama', texto: 'Cuidado, guagua. Observa bien antes de mover. El ritual requiere precisión.' },
        puzzle_vida_perdida: { personaje: 'mama', texto: 'Perdiste un intento, hijo/a. Respira, mira con cuidado. El territorio te da otra oportunidad.' },
        puzzle_sin_vidas: { personaje: 'mama', texto: 'El camino no siempre se recorre a la primera, guagua. Así pasa con el conocimiento ancestral. ¿Intentamos de nuevo?' },
        puzzle_completado: { personaje: 'mama', texto: '¡Así se hace, guagua! Armaste el paso del ritual sagrado. El territorio siente que estás aprendiendo de verdad.' },
        puzzle_todos_completados: { personaje: 'mama', texto: '¡Lo lograste! Conoces los seis pasos del ritual sagrado del Pueblo Pasto. Llevas ese conocimiento en las manos y en el corazón. Nuestros mayores estarían orgullosos.' },
        puzzle_resultado_perfecto: { personaje: 'mama', texto: 'Guardián/a de la Maloca. Así te llama el territorio desde hoy. Completaste todos los pasos con dedicación y respeto. Bienvenido/a al saber ancestral de los Pastos.' },
        puzzle_resultado_bueno: { personaje: 'mama', texto: 'Buen camino recorriste, guagua. La mayoría de los pasos quedaron en tu memoria. Sigue practicando y el ritual completo vivirá en ti.' },
        puzzle_resultado_bajo: { personaje: 'mama', texto: 'El conocimiento llega despacio, como la lluvia que empapa la tierra poco a poco. Vuelve cuando quieras, la Maloca siempre estará aquí.' },
        ahorcado_bienvenida: { personaje: 'mama', texto: 'Bienvenido/a al Ahorcado Ancestral, guagua. Adivina las frases sobre nuestros rituales y nuestra vestimenta. Cada letra que elijas bien acerca el conocimiento a tu corazón.' },
        ahorcado_nivel_facil: { personaje: 'mama', texto: 'Los primeros niveles son como el primer paso del ritual: pausados y seguros. Tienes seis intentos, guagua. Lee la pista con atención.' },
        ahorcado_nivel_medio: { personaje: 'mama', texto: 'El camino se estrecha, hijo/a. Solo cuatro intentos. El saber ancestral exige más concentración. Piensa cada letra antes de elegir.' },
        ahorcado_nivel_dificil: { personaje: 'mama', texto: 'Solo dos intentos, guagua. Así como en la armonización sagrada no hay espacio para el error, aquí tampoco. El conocimiento profundo requiere precisión.' },
        ahorcado_letra_correcta: { personaje: 'mama', texto: '¡Esa letra vive en nuestra cultura! Sigue así, guagua.' },
        ahorcado_letra_incorrecta: { personaje: 'mama', texto: 'Esa no es, guagua. Piensa en los saberes que aprendiste. La respuesta está en lo que el territorio te enseñó.' },
        ahorcado_ultimo_intento: { personaje: 'mama', texto: 'Un intento te queda, hijo/a. Respira hondo, como en el sahumerio. El conocimiento está en ti, confía.' },
        ahorcado_victoria: { personaje: 'mama', texto: '¡Lo encontraste! Esa frase vive ahora en tu memoria. El Pueblo Pasto se siente honrado cuando sus guaguas conocen su historia.' },
        ahorcado_derrota: { personaje: 'mama', texto: 'No te rindas, guagua. La respuesta queda en tu memoria para la próxima vez. El conocimiento ancestral se aprende caminando, cayendo y volviendo a caminar.' },
        ahorcado_nivel_completado: { personaje: 'mama', texto: 'Superaste este nivel, guagua. Cada frase que adivinas es un hilo más en el tejido de tu identidad cultural.' },
        ahorcado_mitad: { personaje: 'mama', texto: 'Ya vas por la mitad del camino, hijo/a. Los niveles que vienen guardan los saberes más profundos de nuestro pueblo. ¿Estás listo/a?' },
        ahorcado_modo_dificil_inicio: { personaje: 'mama', texto: 'Llegaste al nivel difícil, guagua. Solo los que conocen de verdad nuestros saberes llegan hasta aquí. El territorio te pone a prueba. Demuestra lo que aprendiste.' },
        ahorcado_resultado_perfecto: { personaje: 'mama', texto: '¡Guardián/a Ancestral! Los 18 niveles superados. Conoces los rituales, la vestimenta y el territorio del Pueblo Pasto como si hubiera nacido con ese saber. El cabildo te reconoce.' },
        ahorcado_resultado_bueno: { personaje: 'mama', texto: 'Gran sabedor/a, guagua. Recorriste este camino con valentía. Sigue aprendiendo y pronto dominarás todos los saberes de los Pastos.' },
        ahorcado_resultado_regular: { personaje: 'mama', texto: 'Vas aprendiendo, hijo/a. El conocimiento ancestral es como una chagra: necesita tiempo, cuidado y dedicación. Vuelve cuando quieras.' },
        ahorcado_resultado_bajo: { personaje: 'mama', texto: 'No importa, guagua. Lo importante es que intentaste. La Maloca y el Bosque Sagrado tienen más enseñanzas para ti. Cada vez que regreses aprenderás algo nuevo.' },
        sopa_bienvenida: { personaje: 'mama', texto: 'Ahora busca los saberes rituales escondidos en esta sopa de letras, guagua. Cada palabra que encuentres renueva tu tiempo. Observa con calma, como quien lee el territorio.' },
        sopa_acierto: { personaje: 'mama', texto: '¡Así es! Ese saber ya vive en tu memoria. Sigue buscando los que faltan.' },
        sopa_fallo_seleccion: { personaje: 'mama', texto: 'Esa no es la palabra correcta, guagua. Mira de nuevo la lista de saberes pendientes.' },
        sopa_fallo_tiempo: { personaje: 'mama', texto: 'El tiempo se agotó, hijo/a. El territorio no espera, pero te da otra oportunidad.' },
        sopa_sin_intentos: { personaje: 'mama', texto: 'Se acabaron tus intentos, guagua. No te preocupes, comenzaremos de nuevo con más calma.' },
        sopa_completado: { personaje: 'mama', texto: 'Encontraste todos los saberes rituales, guagua. Ahora estás listo/a para el Ahorcado Ancestral.' }
    };

    let _widget = null, _burbuja = null, _textoEl = null, _cursorEl = null;
    let _typeTimer = null, _audioActual = null, _escribiendo = false, _textoCompleto = '', _onCerrar = null;

    function _crearDOM() {
        const existente = document.getElementById('dialogo-widget');
        if (existente) {
            _widget = existente;
            _burbuja = _widget.querySelector('#dialogo-burbuja');
            _textoEl = _widget.querySelector('#dialogo-texto');
            _cursorEl = _widget.querySelector('#dialogo-cursor');
            return;
        }

        _widget = document.createElement('div');
        _widget.id = 'dialogo-widget';
        _widget.style.display = 'none';
        _widget.innerHTML = `
            <div class="dialogo-burbuja" id="dialogo-burbuja">
                <div class="dialogo-header">
                    <div class="dialogo-avatar" id="dialogo-avatar"></div>
                    <div>
                        <div class="dialogo-nombre" id="dialogo-nombre"></div>
                        <div class="dialogo-rol" id="dialogo-rol"></div>
                    </div>
                </div>
                <div class="dialogo-texto" id="dialogo-texto">
                    <span class="dialogo-cursor" id="dialogo-cursor"></span>
                </div>
                <div class="dialogo-footer">
                    <button class="dialogo-btn-audio" id="dialogo-btn-audio" title="Escuchar" type="button" style="display:inline-flex !important;">
                        🔊 <span>Escuchar</span>
                    </button>
                    <div class="dialogo-continuar">▼ toca para cerrar</div>
                    <button class="dialogo-btn-cerrar" id="dialogo-btn-cerrar" type="button">Entendido ✓</button>
                </div>
            </div>
        `;

        document.body.appendChild(_widget);

        _burbuja = _widget.querySelector('#dialogo-burbuja');
        _textoEl = _widget.querySelector('#dialogo-texto');
        _cursorEl = _widget.querySelector('#dialogo-cursor');

        _widget.querySelector('#dialogo-btn-cerrar').addEventListener('click', cerrar);
        _widget.querySelector('#dialogo-btn-audio').addEventListener('click', _reproducirAudio);
        _burbuja.addEventListener('click', _saltarOCerrar);
    }

    function mostrar(id, opciones = {}) {
        const dialogo = DIALOGOS[id];
        if (!dialogo) return;

        _crearDOM();

        const personaje = PERSONAJES[dialogo.personaje];
        _textoCompleto = opciones.texto || dialogo.texto;
        _onCerrar = opciones.onCerrar || null;

        _widget.classList.toggle('modo-juego', !!opciones.modoJuego);

        const avatarEl = _widget.querySelector('#dialogo-avatar');
        avatarEl.innerHTML = `<img src="${personaje.img}" alt="${personaje.nombre}" onerror="this.parentElement.textContent='${personaje.emoji}'">`;
        _widget.querySelector('#dialogo-nombre').textContent = personaje.nombre;
        _widget.querySelector('#dialogo-rol').textContent = personaje.rol;

        _burbuja.className = 'dialogo-burbuja ' + personaje.clase;
        _burbuja.classList.remove('saliendo');

        _widget.style.display = 'flex';
        _escribirTexto(_textoCompleto);

        const audioPath = opciones.audio || `${_audioBase}/${dialogo.personaje}/${id}.mp3`;
        _prepararAudio(audioPath);
    }

    function _escribirTexto(texto) {
        clearTimeout(_typeTimer);
        _escribiendo = true;
        _textoEl.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.id = 'dialogo-cursor';
        cursor.className = 'dialogo-cursor';
        _textoEl.appendChild(cursor);
        _cursorEl = cursor;

        let i = 0;
        const VELOCIDAD = 28;
        function tick() {
            if (i < texto.length) {
                _textoEl.insertBefore(document.createTextNode(texto[i]), _cursorEl);
                i++;
                _typeTimer = setTimeout(tick, VELOCIDAD);
            } else {
                _escribiendo = false;
                setTimeout(() => { if (_cursorEl) _cursorEl.style.display = 'none'; }, 800);
            }
        }
        tick();
    }

    function _saltarOCerrar(e) {
        if (e.target.closest('button')) return;
        if (_escribiendo) {
            clearTimeout(_typeTimer);
            _escribiendo = false;
            _textoEl.innerHTML = _textoCompleto;
        } else {
            cerrar();
        }
    }

    function cerrar() {
        if (!_widget) return;
        clearTimeout(_typeTimer);
        _pararAudio();
        _burbuja.classList.add('saliendo');
        setTimeout(() => {
            if (_widget) _widget.style.display = 'none';
            if (_onCerrar) _onCerrar();
        }, 300);
    }

    function _prepararAudio(path) {
        _pararAudio();
        const btnAudio = _widget ? _widget.querySelector('#dialogo-btn-audio') : null;

        if (btnAudio) {
            btnAudio.style.display = 'inline-flex';
            btnAudio.disabled = false;
            btnAudio.classList.remove('reproduciendo');
            btnAudio.title = 'Escuchar';
            btnAudio.style.opacity = '1';
            btnAudio.style.pointerEvents = 'auto';
        }

        _audioActual = new Audio(path);

        _audioActual.onerror = () => {
            console.warn('[Diálogos] No se pudo cargar el audio:', path);
            if (btnAudio) {
                btnAudio.style.display = 'inline-flex';
                btnAudio.disabled = true;
                btnAudio.classList.remove('reproduciendo');
                btnAudio.title = 'Audio no disponible';
                btnAudio.style.opacity = '0.55';
                btnAudio.style.pointerEvents = 'none';
            }
            _audioActual = null;
        };

        _audioActual.onended = () => {
            if (btnAudio) btnAudio.classList.remove('reproduciendo');
        };

        if (window._pastukerAudioDesbloqueado) {
            _audioActual.addEventListener('canplay', () => {
                if (_audioActual) {
                    const p = _audioActual.play();
                    if (p && p.catch) p.catch(() => {});
                    if (btnAudio) btnAudio.classList.add('reproduciendo');
                }
            }, { once: true });
        }
    }

    function _reproducirAudio() {
        if (!_audioActual) return;
        const btnAudio = _widget ? _widget.querySelector('#dialogo-btn-audio') : null;
        if (_audioActual.paused) {
            const p = _audioActual.play();
            if (p && p.catch) p.catch(() => {});
            if (btnAudio) btnAudio.classList.add('reproduciendo');
        } else {
            _audioActual.pause();
            _audioActual.currentTime = 0;
            if (btnAudio) btnAudio.classList.remove('reproduciendo');
        }
    }

    function _pararAudio() {
        if (_audioActual) {
            _audioActual.pause();
            _audioActual.currentTime = 0;
            _audioActual = null;
        }
    }

    function mostrarConDelay(id, ms = 800, opciones = {}) {
        setTimeout(() => mostrar(id, opciones), ms);
    }

    function secuencia(ids, opciones = {}) {
        if (!ids.length) return;
        const [primero, ...resto] = ids;
        mostrar(primero, {
            ...opciones,
            onCerrar: () => {
                if (resto.length) secuencia(resto, opciones);
                else if (opciones.onFin) opciones.onFin();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _crearDOM, { once: true });
    } else {
        _crearDOM();
    }

    return { mostrar, mostrarConDelay, secuencia, cerrar };
})();