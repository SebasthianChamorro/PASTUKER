/* ═══════════════════════════════════════════════════════════
   PASTUKER — dialogos.js
   Sistema reutilizable de diálogos para todos los personajes
   Uso: DialogoSistema.mostrar('index_bienvenida');
═══════════════════════════════════════════════════════════ */

const DialogoSistema = (() => {

    /* ── Detectar ruta base según ubicación de la página ── */
    const _enPages   = window.location.pathname.includes('/pages/');
    const _imgBase   = _enPages ? '../images'         : 'images';
    const _audioBase = _enPages ? '../audio/dialogos' : 'audio/dialogos';

    /* ── Personajes ── */
    const PERSONAJES = {
        taita: {
            nombre: 'Taita Lorenzo',
            rol:    'Sabedor del Pueblo Pastos',
            emoji:  '🧙',
            clase:  'taita',
            img:    `${_imgBase}/taita/taita_frame1.png`
        },
        mama: {
            nombre: 'Mama Rosa',
            rol:    'Guardiana de Rituales',
            emoji:  '👵',
            clase:  'mama-rosario',
            img:    `${_imgBase}/mama/mama_frame1.png`
        }
    };

    /* ══════════════════════════════════════════════════════
       BANCO DE DIÁLOGOS
       - index      → taita
       - login      → mama
       - register   → mama
       - menús      → taita
       - juego      → taita
       - ranking    → taita
       - perfil     → mama
       - logros     → taita
    ══════════════════════════════════════════════════════ */
    const DIALOGOS = {

        /* ─── INDEX ─── */
        index_bienvenida: {
            personaje: 'taita',
            texto: 'Joven de la tierra, hijo del viento y la montaña... bienvenido a Pastuker. Aquí, entre raíces antiguas y saberes que el tiempo no ha borrado, caminarás por los senderos que nuestros mayores nos dejaron. Este no es un juego. Es una memoria viva.',
        },
        index_regreso: {
            personaje: 'taita',
            texto: 'El bosque te esperaba, joven. Las plantas recuerdan tus pasos. Continúa donde el camino se detuvo.',
        },

        /* ─── LOGIN ─── */
        login_bienvenida: {
            personaje: 'mama',
            texto: 'Ay, joven, bienvenido. Para entrar al territorio sagrado, el bosque necesita reconocerte. Dime tu nombre y tu palabra secreta, y las puertas del conocimiento ancestral se abrirán.',
        },
        login_error: {
            personaje: 'mama',
            texto: 'Hmm... el bosque no te reconoce con esas palabras, hijo. Intenta de nuevo.',
        },
        login_cargando: {
            personaje: 'mama',
            texto: 'El viento lleva tu nombre hacia los espíritus del territorio... un momento, joven.',
        },

        /* ─── REGISTER ─── */
        register_bienvenida: {
            personaje: 'mama',
            texto: 'Ay, qué bueno que llegaste. Antes de caminar por el bosque sagrado, necesito conocerte. Dime tu nombre, joven, y elige cómo quieres que te vea el territorio. Cada ser tiene su lugar en la chagra.',
        },
        register_genero: {
            personaje: 'mama',
            texto: 'Bien, hijo. El bosque te verá tal como eres. No hay camino equivocado, todos llevan al mismo conocimiento.',
        },
        register_completo: {
            personaje: 'mama',
            texto: 'Tu nombre queda tejido en la memoria del territorio. Ya eres parte de esta historia, joven. El bosque te espera.',
        },

        /* ─── MENÚ GENERAL ─── */
        menu_bienvenida: {
            personaje: 'taita',
            texto: 'Este es tu territorio, joven. Desde aquí puedes explorar los mundos que el saber ancestral de los Pastos tiene para ti. Cada mundo guarda una enseñanza diferente. ¿Por cuál comenzarás?',
        },
        menu_sin_mundos: {
            personaje: 'taita',
            texto: 'El Bosque Sagrado te aguarda. Es el primer sendero. Allí aprenderás a reconocer las plantas que nuestras abuelas usaban para sanar el cuerpo y el espíritu.',
        },
        menu_mundo1_completo: {
            personaje: 'taita',
            texto: 'Cruzaste el bosque con valentía, joven. Ahora La Maloca te abre sus puertas. Adentro viven los rituales y ceremonias de nuestro pueblo. Entra con respeto.',
        },

        /* ─── MENÚ DE JUEGOS ─── */
        juegos_bienvenida: {
            personaje: 'taita',
            texto: 'Los mundos son como semillas, joven. Cada uno guarda vida adentro. Toca el que sientas en el corazón.',
        },
        juegos_mundo1: {
            personaje: 'taita',
            texto: 'El Bosque Sagrado... tierra de plantas que curan, purifican y conectan. Recoge con cuidado, observa con atención. El bosque habla a quienes saben escuchar.',
        },
        juegos_mundo2_bloqueado: {
            personaje: 'taita',
            texto: 'Aún no, joven. Ese sendero se abre cuando hayas caminado el primero. Termina tu viaje por el bosque y La Maloca te recibirá.',
        },

        /* ─── DENTRO DEL JUEGO ─── */
        juego_inicio: {
            personaje: 'taita',
            texto: 'Bienvenido al Bosque Sagrado, joven. En este territorio crecen treinta plantas que nuestros mayores han usado por siglos. Hoy encontrarás cinco de ellas. Acércate, recógelas con respeto, y cuando tengas las cinco... búscame. Tengo preguntas para ti.',
        },
        juego_taita_sin_plantas: {
            personaje: 'taita',
            texto: 'Todavía no, joven. El bosque tiene más plantas esperándote. Recoge las cinco y regresa. El conocimiento no se apresura.',
        },
        juego_taita_con_plantas: {
            personaje: 'taita',
            texto: 'Bien, joven explorador. Veo que el bosque te habló. Ahora demostremos que lo escuchaste. Es hora del quiz.',
        },
        juego_antes_quiz: {
            personaje: 'taita',
            texto: 'Las preguntas que haré vienen de las propias plantas que encontraste. Ellas mismas te evaluarán. Responde con calma, con lo que aprendiste. El saber ancestral no se olvida fácilmente.',
        },
        juego_resultado_bueno: {
            personaje: 'taita',
            texto: 'El bosque está orgulloso de ti, joven. Llevas el conocimiento en el corazón, donde realmente debe vivir. Un portal se ha abierto. El siguiente sendero te espera.',
        },
        juego_resultado_regular: {
            personaje: 'taita',
            texto: 'Vas por buen camino, joven. Algunas plantas aún guardan sus secretos para ti. No importa, el conocimiento llega con la práctica. Sigue adelante.',
        },
        juego_resultado_bajo: {
            personaje: 'taita',
            texto: 'El bosque sabe que estás aprendiendo, joven. No te desanimes. Cada error es una semilla que, con el tiempo, da fruto. Inténtalo de nuevo.',
        },
        juego_portal: {
            personaje: 'taita',
            texto: 'Camina hacia la luz, joven. El siguiente mundo te espera. Yo seguiré aquí, cuidando el bosque... hasta que vuelvas.',
        },

        /* ─── RANKING ─── */
        ranking_bienvenida: {
            personaje: 'taita',
            texto: 'El territorio recuerda a quienes más han caminado por él. Aquí están los nombres de los jóvenes que han honrado el saber de los Pastos. ¿Estará el tuyo entre ellos?',
        },
        ranking_top3: {
            personaje: 'taita',
            texto: 'Tu nombre brilla en el territorio, joven. Los mayores estarían orgullosos.',
        },

        /* ─── PERFIL / AVATAR ─── */
        perfil_bienvenida: {
            personaje: 'mama',
            texto: 'Ay, joven, qué bueno verte por aquí. Yo soy Mama Rosa, la guardiana de los rituales del cabildo. Así como tejemos el manto con hilos de colores, tú puedes tejer tu imagen aquí. Elige tu avatar, el que sienta que te representa.',
        },
        perfil_avatar_cambiado: {
            personaje: 'mama',
            texto: '¡Ese te queda bien, mijito! El territorio ya sabe cómo verte.',
        },
        perfil_guardado: {
            personaje: 'mama',
            texto: 'Listo, joven. Ya quedaste registrado en la memoria del cabildo. Ahora sí, ¡a jugar!',
        },

        /* ─── LOGROS ─── */
        logro_primera_planta: {
            personaje: 'taita',
            texto: '¡Tu primera planta! El bosque te acepta, joven.',
        },
        logro_cinco_plantas: {
            personaje: 'taita',
            texto: 'El espíritu del bosque está contigo. Cinco plantas en tus manos.',
        },
        logro_quiz_perfecto: {
            personaje: 'taita',
            texto: '10 de 10, joven. El conocimiento de los mayores vive en ti.',
        },
        logro_mundo_completo: {
            personaje: 'taita',
            texto: 'Completaste el Bosque Sagrado. El territorio te recuerda.',
        },
    };

    /* ══════════════════════════════════════════════════════
       ESTADO INTERNO
    ══════════════════════════════════════════════════════ */
    let _widget        = null;
    let _burbuja       = null;
    let _textoEl       = null;
    let _cursorEl      = null;
    let _typeTimer     = null;
    let _audioActual   = null;
    let _escribiendo   = false;
    let _textoCompleto = '';
    let _onCerrar      = null;

    /* ══════════════════════════════════════════════════════
       CREAR DOM — solo una vez
    ══════════════════════════════════════════════════════ */
    function _crearDOM() {
        const existente = document.getElementById('dialogo-widget');
        if (existente) {
            _widget   = existente;
            _burbuja  = _widget.querySelector('#dialogo-burbuja');
            _textoEl  = _widget.querySelector('#dialogo-texto');
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
                        <div class="dialogo-rol"    id="dialogo-rol"></div>
                    </div>
                </div>
                <div class="dialogo-texto" id="dialogo-texto">
                    <span class="dialogo-cursor" id="dialogo-cursor"></span>
                </div>
                <div class="dialogo-footer">
                    <button class="dialogo-btn-audio" id="dialogo-btn-audio" title="Escuchar" style="display:none">
                        🔊 <span>Escuchar</span>
                    </button>
                    <div class="dialogo-continuar">▼ toca para cerrar</div>
                    <button class="dialogo-btn-cerrar" id="dialogo-btn-cerrar">Entendido ✓</button>
                </div>
            </div>
        `;

        document.body.appendChild(_widget);

        _burbuja  = _widget.querySelector('#dialogo-burbuja');
        _textoEl  = _widget.querySelector('#dialogo-texto');
        _cursorEl = _widget.querySelector('#dialogo-cursor');

        _widget.querySelector('#dialogo-btn-cerrar').addEventListener('click', cerrar);
        _widget.querySelector('#dialogo-btn-audio').addEventListener('click', _reproducirAudio);
        _burbuja.addEventListener('click', _saltarOCerrar);
    }

    /* ══════════════════════════════════════════════════════
       MOSTRAR DIÁLOGO
    ══════════════════════════════════════════════════════ */
    function mostrar(id, opciones = {}) {
        const dialogo = DIALOGOS[id];
        if (!dialogo) { console.warn(`[Diálogos] "${id}" no encontrado.`); return; }

        _crearDOM();

        const personaje    = PERSONAJES[dialogo.personaje];
        _textoCompleto     = opciones.texto || dialogo.texto;
        _onCerrar          = opciones.onCerrar || null;

        _widget.classList.toggle('modo-juego', !!opciones.modoJuego);

        const avatarEl = _widget.querySelector('#dialogo-avatar');
        avatarEl.innerHTML = `<img src="${personaje.img}" alt="${personaje.nombre}"
            onerror="this.parentElement.textContent='${personaje.emoji}'">`;

        _widget.querySelector('#dialogo-nombre').textContent = personaje.nombre;
        _widget.querySelector('#dialogo-rol').textContent    = personaje.rol;

        _burbuja.className = 'dialogo-burbuja ' + personaje.clase;
        _burbuja.classList.remove('saliendo');

        _widget.style.display = 'flex';
        _escribirTexto(_textoCompleto);

        const audioPath = opciones.audio || `${_audioBase}/${dialogo.personaje}/${id}.mp3`;
        _prepararAudio(audioPath);
    }

    /* ══════════════════════════════════════════════════════
       MÁQUINA DE ESCRIBIR
    ══════════════════════════════════════════════════════ */
    function _escribirTexto(texto) {
        clearTimeout(_typeTimer);
        _escribiendo = true;

        _textoEl.innerHTML = '';
        const cursor = document.createElement('span');
        cursor.id        = 'dialogo-cursor';
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
                setTimeout(() => {
                    if (_cursorEl) _cursorEl.style.display = 'none';
                }, 800);
            }
        }
        tick();
    }

    /* ══════════════════════════════════════════════════════
       CLICK — saltar animación o cerrar
    ══════════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════════
       CERRAR
    ══════════════════════════════════════════════════════ */
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

    /* ══════════════════════════════════════════════════════
       AUDIO
    ══════════════════════════════════════════════════════ */
    function _prepararAudio(path) {
        _pararAudio();
        const btnAudio = _widget ? _widget.querySelector('#dialogo-btn-audio') : null;
        if (btnAudio) btnAudio.style.display = 'none';

        _audioActual = new Audio(path);

        // Mostrar botón inmediatamente — ocultarlo solo si falla
        if (btnAudio) btnAudio.style.display = 'flex';

        _audioActual.onerror = () => {
            if (btnAudio) btnAudio.style.display = 'none';
            _audioActual = null;
        };
        _audioActual.onended = () => {
            if (btnAudio) btnAudio.classList.remove('reproduciendo');
        };
    }

    function _reproducirAudio() {
        if (!_audioActual) return;
        const btnAudio = _widget.querySelector('#dialogo-btn-audio');
        if (_audioActual.paused) {
            _audioActual.play().catch(() => {});
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
            _audioActual = null;
        }
    }

    /* ══════════════════════════════════════════════════════
       API PÚBLICA
    ══════════════════════════════════════════════════════ */
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

    return { mostrar, mostrarConDelay, secuencia, cerrar };

})();