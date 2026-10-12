# ══════════════════════════════════════════════════════
#  Pastuker — Backend  (Python + Flask + SQLite)
#  Estructura: PASTUKER/Backend/app.py
#
#  Desarrollo : python app.py
#  Producción : gunicorn app:app --bind 0.0.0.0:$PORT   (con PASTUKER_ENV=production)
#
#  Variables de entorno (todas opcionales):
#    PASTUKER_ENV       development (por defecto) | production
#    PASTUKER_DEBUG     1 para activar el modo debug de Flask (solo en tu PC)
#    PASTUKER_ORIGINS   orígenes permitidos para CORS, separados por coma
#                       (solo hace falta si el Frontend se sirve desde OTRO dominio)
#    PASTUKER_DB        ruta del archivo SQLite (por defecto Backend/pastuker.db)
#    PORT               puerto (por defecto 5000)
# ══════════════════════════════════════════════════════
from flask import Flask, request, jsonify, send_from_directory, abort
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3, hashlib, hmac, secrets, os, json, re, logging
from datetime import datetime, timedelta, timezone

# ── Configuración por entorno ─────────────────────────
ENV        = os.environ.get('PASTUKER_ENV', 'development').lower()
ES_DEV     = ENV != 'production'
DEBUG      = ES_DEV and os.environ.get('PASTUKER_DEBUG') == '1'
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DB_PATH    = os.environ.get('PASTUKER_DB', os.path.join(BASE_DIR, 'pastuker.db'))
FRONT_DIR  = os.path.abspath(os.path.join(BASE_DIR, '..', 'Frontend'))

SESION_DIAS          = 30          # vigencia del token
MAX_FALLOS_LOGIN     = 5           # intentos fallidos antes de bloquear
BLOQUEO_MINUTOS      = 10
HASH_METODO          = 'pbkdf2:sha256:600000'   # PBKDF2 con sal aleatoria (werkzeug)
VERSION_POLITICA     = '2026-10'   # versión de la política de tratamiento de datos

# Reglas del juego (deben coincidir con game.js / game-2.js)
NIVELES_MUNDO2       = 10
GEMAS_POR_NIVEL      = 3
PLANTAS_MUNDO1       = 5
XP_BASE_POR_SYNC     = 500         # margen fijo por sincronización
XP_POR_MINUTO        = 300         # XP máxima creíble por minuto de juego

ESTILOS_AVATAR = {
    'avataaars', 'bottts', 'pixel-art', 'personas', 'fun-emoji', 'adventurer',
    'lorelei', 'micah', 'big-smile', 'croodles', 'thumbs', 'identicon', 'initials',
    'notionists', 'open-peeps', 'miniavs', 'shapes', 'rings', 'big-ears', 'icons',
}
GENEROS = {'hombre', 'mujer', 'otro', 'no_decir'}

# IDs válidos del banco de 30 plantas (Frontend/js/plantas_catalogo.js)
PLANTAS_VALIDAS = {
    'ajenjo', 'altamisa', 'arnica', 'breva', 'calendula', 'cidron', 'clavel', 'cofrey',
    'diente-de-leon', 'eucalipto', 'hierba-buena', 'insulina', 'llanten', 'manzanilla',
    'menta', 'mispero', 'nabo', 'oregano', 'ortiga', 'pepino-dulce', 'poleo', 'romerillo',
    'romero', 'ruda', 'savila', 'seguidora', 'tomillo', 'toronjil-grande',
    'toronjil-pequeno', 'valeriana',
}

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger('pastuker')

app = Flask(__name__, static_folder=None)
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024   # 64 KB por petición es más que suficiente

# ── CORS ──────────────────────────────────────────────
# Lo recomendado es servir el Frontend desde este mismo Flask (mismo origen → sin CORS).
# En desarrollo se acepta Live Server (p. ej. puerto 5501) desde localhost o la red local.
_origenes = [o.strip() for o in os.environ.get('PASTUKER_ORIGINS', '').split(',') if o.strip()]
if ES_DEV:
    _origenes += [
        r'http://localhost:\d+', r'http://127\.0\.0\.1:\d+',
        r'http://192\.168\.\d+\.\d+:\d+', r'http://10\.\d+\.\d+\.\d+:\d+',
    ]
if _origenes:
    CORS(app, resources={r'/api/*': {'origins': _origenes}})


# ══════════════════════════════════════════════════════
#  Base de datos
# ══════════════════════════════════════════════════════
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def _columnas(conn, tabla):
    return {r['name'] for r in conn.execute(f'PRAGMA table_info({tabla})')}

def init_db():
    conn = get_db()
    conn.executescript('''
        CREATE TABLE IF NOT EXISTS usuarios (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre      TEXT    NOT NULL,
            telefono    TEXT    UNIQUE NOT NULL,
            password    TEXT    NOT NULL,
            genero      TEXT    DEFAULT 'no_decir',
            avatar      TEXT    DEFAULT '',
            creado_en   TEXT    DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS sesiones (
            token       TEXT    PRIMARY KEY,
            usuario_id  INTEGER NOT NULL,
            creado_en   TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
        CREATE TABLE IF NOT EXISTS progreso (
            usuario_id          INTEGER PRIMARY KEY,
            xp                  INTEGER DEFAULT 0,
            plantas_encontradas TEXT    DEFAULT '[]',
            mundo2_completo     INTEGER DEFAULT 0,
            actualizado_en      TEXT    DEFAULT (datetime('now')),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
        CREATE TABLE IF NOT EXISTS gemas (
            usuario_id  INTEGER,
            nivel       INTEGER,
            gemas       TEXT    DEFAULT '[]',
            PRIMARY KEY (usuario_id, nivel),
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
        CREATE TABLE IF NOT EXISTS intentos_login (
            telefono        TEXT PRIMARY KEY,
            fallos          INTEGER DEFAULT 0,
            bloqueado_hasta TEXT
        );
    ''')

    # ── Migraciones suaves: columnas nuevas sobre una BD existente ──
    nuevas = {
        'usuarios': {
            'consentimiento_en':      'TEXT',
            'consentimiento_version': 'TEXT',
            'autoriza_acudiente':     'INTEGER DEFAULT 0',
        },
        'sesiones': {
            'expira_en': 'TEXT',
        },
        'progreso': {
            'mundo1_completo': 'INTEGER DEFAULT 0',
            'partidas':        'INTEGER DEFAULT 0',
            'aciertos':        'INTEGER DEFAULT 0',
            'preguntas':       'INTEGER DEFAULT 0',
            'xp_ajustado':     'INTEGER DEFAULT 0',
        },
    }
    for tabla, cols in nuevas.items():
        existentes = _columnas(conn, tabla)
        for col, tipo in cols.items():
            if col not in existentes:
                conn.execute(f'ALTER TABLE {tabla} ADD COLUMN {col} {tipo}')
    conn.commit()
    conn.close()
    log.info('Base de datos lista en: %s (entorno: %s)', DB_PATH, ENV)

# Se ejecuta al importar el módulo: así también funciona con gunicorn.
init_db()


# ══════════════════════════════════════════════════════
#  Utilidades
# ══════════════════════════════════════════════════════
def ahora():
    return datetime.now(timezone.utc).replace(tzinfo=None)

def fmt(dt):
    return dt.strftime('%Y-%m-%d %H:%M:%S')

def parse_dt(s):
    try:
        return datetime.strptime(s, '%Y-%m-%d %H:%M:%S')
    except (TypeError, ValueError):
        return None

def hash_password(pwd):
    """PBKDF2-SHA256 con sal aleatoria de 16 bytes y 600.000 iteraciones."""
    return generate_password_hash(pwd, method=HASH_METODO)

def _es_hash_legado(h):
    return bool(re.fullmatch(r'[0-9a-f]{64}', h or ''))

def verificar_password(conn, usuario, pwd):
    """Verifica la contraseña. Si el usuario tenía el hash SHA-256 antiguo (sin sal)
    y la contraseña es correcta, lo migra en ese momento a PBKDF2."""
    guardado = usuario['password']
    if _es_hash_legado(guardado):
        ok = hmac.compare_digest(guardado, hashlib.sha256(pwd.encode()).hexdigest())
        if ok:
            conn.execute('UPDATE usuarios SET password = ? WHERE id = ?',
                         (hash_password(pwd), usuario['id']))
            conn.commit()
        return ok
    try:
        return check_password_hash(guardado, pwd)
    except ValueError:
        return False

def gen_token():
    return secrets.token_hex(32)   # 64 caracteres hexadecimales

def crear_sesion(conn, usuario_id):
    token = gen_token()
    conn.execute('INSERT INTO sesiones (token, usuario_id, creado_en, expira_en) VALUES (?,?,?,?)',
                 (token, usuario_id, fmt(ahora()), fmt(ahora() + timedelta(days=SESION_DIAS))))
    # Limpieza de sesiones vencidas
    conn.execute('DELETE FROM sesiones WHERE expira_en IS NOT NULL AND expira_en < ?', (fmt(ahora()),))
    return token

def get_user_from_token(token):
    if not token:
        return None
    conn = get_db()
    row = conn.execute(
        '''SELECT u.*, s.expira_en, s.creado_en AS sesion_creada
           FROM usuarios u JOIN sesiones s ON s.usuario_id = u.id WHERE s.token = ?''',
        (token,)
    ).fetchone()
    if row:
        expira = parse_dt(row['expira_en']) or \
                 ((parse_dt(row['sesion_creada']) or ahora()) + timedelta(days=SESION_DIAS))
        if expira < ahora():
            conn.execute('DELETE FROM sesiones WHERE token = ?', (token,))
            conn.commit()
            row = None
    conn.close()
    return row

def bearer(req):
    auth = req.headers.get('Authorization', '')
    if auth.startswith('Bearer '):
        return auth[7:].strip() or None
    return None

def datos_json():
    data = request.get_json(force=True, silent=True)
    return data if isinstance(data, dict) else {}

def error(msg, code):
    return jsonify({'ok': False, 'msg': msg}), code

def a_entero(v, minimo=0, maximo=10**9):
    try:
        v = int(v)
    except (TypeError, ValueError):
        return minimo
    return max(minimo, min(maximo, v))

def nombre_publico(nombre):
    """Para el ranking: solo primer nombre + inicial (protección de menores)."""
    partes = (nombre or '').split()
    if not partes:
        return 'Explorador'
    if len(partes) == 1:
        return partes[0]
    return f'{partes[0]} {partes[1][0].upper()}.'

def leer_gemas(conn, usuario_id):
    out = {}
    for r in conn.execute('SELECT nivel, gemas FROM gemas WHERE usuario_id = ?', (usuario_id,)):
        try:
            out[str(r['nivel'])] = sorted(set(json.loads(r['gemas'])))
        except (TypeError, ValueError):
            out[str(r['nivel'])] = []
    return out

def limpiar_gemas(lista):
    if not isinstance(lista, list):
        return set()
    return {int(i) for i in lista
            if isinstance(i, (int, float)) and not isinstance(i, bool) and 0 <= int(i) < GEMAS_POR_NIVEL}

def guardar_gemas_nivel(conn, usuario_id, nivel, nuevas):
    fila = conn.execute('SELECT gemas FROM gemas WHERE usuario_id = ? AND nivel = ?',
                        (usuario_id, nivel)).fetchone()
    actuales = set(json.loads(fila['gemas'])) if fila else set()
    union = sorted(actuales | nuevas)
    conn.execute('''
        INSERT INTO gemas (usuario_id, nivel, gemas) VALUES (?,?,?)
        ON CONFLICT(usuario_id, nivel) DO UPDATE SET gemas = excluded.gemas
    ''', (usuario_id, nivel, json.dumps(union)))
    return union

def progreso_dict(conn, usuario_id):
    p = conn.execute('SELECT * FROM progreso WHERE usuario_id = ?', (usuario_id,)).fetchone()
    if not p:
        conn.execute('INSERT OR IGNORE INTO progreso (usuario_id) VALUES (?)', (usuario_id,))
        conn.commit()
        p = conn.execute('SELECT * FROM progreso WHERE usuario_id = ?', (usuario_id,)).fetchone()
    return {
        'xp': p['xp'] or 0,
        'plantas_encontradas': json.loads(p['plantas_encontradas'] or '[]'),
        'mundo1_completo': bool(p['mundo1_completo']),
        'mundo2_completo': bool(p['mundo2_completo']),
        'partidas':  p['partidas'] or 0,
        'aciertos':  p['aciertos'] or 0,
        'preguntas': p['preguntas'] or 0,
        'gemas': leer_gemas(conn, usuario_id),
    }

def posicion_ranking(conn, usuario_id):
    fila = conn.execute('SELECT xp FROM progreso WHERE usuario_id = ?', (usuario_id,)).fetchone()
    if not fila:
        return None
    mejores = conn.execute('SELECT COUNT(*) AS n FROM progreso WHERE xp > ?', (fila['xp'],)).fetchone()
    return mejores['n'] + 1

def usuario_dict(conn, u):
    return {
        'id': u['id'], 'nombre': u['nombre'],
        'telefono': u['telefono'], 'genero': u['genero'],
        'avatar': u['avatar'] or '',
        'consentimiento': bool(u['consentimiento_en']),
        **progreso_dict(conn, u['id']),
        'posicion': posicion_ranking(conn, u['id']),
    }


@app.after_request
def cabeceras_seguridad(resp):
    resp.headers.setdefault('X-Content-Type-Options', 'nosniff')
    resp.headers.setdefault('Referrer-Policy', 'same-origin')
    if request.path.startswith('/api/'):
        resp.headers['Cache-Control'] = 'no-store'
    return resp


# ══════════════════════════════════════════════════════
#  API
# ══════════════════════════════════════════════════════

# ── Health check ──────────────────────────────────────
@app.route('/api/ping')
def ping():
    return jsonify({'ok': True, 'msg': 'Pastuker API online'})


# ── REGISTER ─────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data      = datos_json()
    nombre    = ' '.join(str(data.get('nombre') or '').split())
    telefono  = str(data.get('telefono') or '').strip()
    password  = str(data.get('password') or '').strip()
    genero    = str(data.get('genero') or 'no_decir').strip()
    acepta    = data.get('acepta_datos') is True
    acudiente = data.get('autoriza_acudiente') is True

    if not nombre or not telefono or not password:
        return error('Faltan campos obligatorios', 400)
    if not (2 <= len(nombre) <= 50):
        return error('El nombre debe tener entre 2 y 50 caracteres', 400)
    if not re.fullmatch(r'\d{7,15}', telefono):
        return error('Teléfono inválido', 400)
    if len(password) < 6:
        return error('La contraseña debe tener mínimo 6 caracteres', 400)
    if genero not in GENEROS:
        genero = 'no_decir'
    if not acepta or not acudiente:
        return error('Debes aceptar la política de datos y contar con la autorización '
                     'de tu madre, padre o acudiente', 400)

    conn = get_db()
    try:
        if conn.execute('SELECT id FROM usuarios WHERE telefono = ?', (telefono,)).fetchone():
            return error('Este teléfono ya está registrado', 409)

        cur = conn.execute(
            '''INSERT INTO usuarios (nombre, telefono, password, genero,
                   consentimiento_en, consentimiento_version, autoriza_acudiente)
               VALUES (?,?,?,?,?,?,1)''',
            (nombre, telefono, hash_password(password), genero, fmt(ahora()), VERSION_POLITICA)
        )
        uid = cur.lastrowid
        conn.execute('INSERT OR IGNORE INTO progreso (usuario_id) VALUES (?)', (uid,))
        token = crear_sesion(conn, uid)
        conn.commit()

        usuario = conn.execute('SELECT * FROM usuarios WHERE id = ?', (uid,)).fetchone()
        return jsonify({'ok': True, 'token': token, 'usuario': usuario_dict(conn, usuario)}), 201

    except Exception:
        conn.rollback()
        log.exception('Error en /api/register')
        return error('Error interno del servidor', 500)
    finally:
        conn.close()


# ── LOGIN ─────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data     = datos_json()
    telefono = str(data.get('telefono') or '').strip()
    password = str(data.get('password') or '').strip()

    if not telefono or not password:
        return error('Faltan campos obligatorios', 400)

    conn = get_db()
    try:
        intento = conn.execute('SELECT * FROM intentos_login WHERE telefono = ?', (telefono,)).fetchone()
        bloqueo = parse_dt(intento['bloqueado_hasta']) if intento else None
        if bloqueo and bloqueo > ahora():
            minutos = max(1, int((bloqueo - ahora()).total_seconds() // 60) + 1)
            return error(f'Demasiados intentos. Intenta de nuevo en {minutos} min.', 429)

        usuario = conn.execute('SELECT * FROM usuarios WHERE telefono = ?', (telefono,)).fetchone()

        if not usuario or not verificar_password(conn, usuario, password):
            fallos = (intento['fallos'] if intento else 0) + 1
            hasta = fmt(ahora() + timedelta(minutes=BLOQUEO_MINUTOS)) if fallos >= MAX_FALLOS_LOGIN else None
            conn.execute('''
                INSERT INTO intentos_login (telefono, fallos, bloqueado_hasta) VALUES (?,?,?)
                ON CONFLICT(telefono) DO UPDATE SET fallos = excluded.fallos,
                                                    bloqueado_hasta = excluded.bloqueado_hasta
            ''', (telefono, 0 if hasta else fallos, hasta))
            conn.commit()
            return error('Teléfono o contraseña incorrectos', 401)

        conn.execute('DELETE FROM intentos_login WHERE telefono = ?', (telefono,))
        token = crear_sesion(conn, usuario['id'])
        conn.commit()
        usuario = conn.execute('SELECT * FROM usuarios WHERE id = ?', (usuario['id'],)).fetchone()
        return jsonify({'ok': True, 'token': token, 'usuario': usuario_dict(conn, usuario)})

    except Exception:
        log.exception('Error en /api/login')
        return error('Error interno del servidor', 500)
    finally:
        conn.close()


# ── LOGOUT ────────────────────────────────────────────
@app.route('/api/logout', methods=['POST'])
def logout():
    token = bearer(request)
    if token:
        conn = get_db()
        conn.execute('DELETE FROM sesiones WHERE token = ?', (token,))
        conn.commit()
        conn.close()
    return jsonify({'ok': True})


# ── PERFIL ────────────────────────────────────────────
@app.route('/api/perfil', methods=['GET'])
def perfil():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    conn = get_db()
    try:
        return jsonify({'ok': True, 'usuario': usuario_dict(conn, usuario)})
    finally:
        conn.close()


@app.route('/api/perfil', methods=['PUT'])
def actualizar_perfil():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    nombre = ' '.join(str(datos_json().get('nombre') or '').split())
    if not (2 <= len(nombre) <= 50):
        return error('El nombre debe tener entre 2 y 50 caracteres', 400)
    conn = get_db()
    conn.execute('UPDATE usuarios SET nombre = ? WHERE id = ?', (nombre, usuario['id']))
    conn.commit()
    conn.close()
    return jsonify({'ok': True, 'nombre': nombre})


@app.route('/api/perfil/password', methods=['PUT'])
def cambiar_password():
    token   = bearer(request)
    usuario = get_user_from_token(token)
    if not usuario:
        return error('No autorizado', 401)
    data   = datos_json()
    actual = str(data.get('actual') or '').strip()
    nueva  = str(data.get('nueva') or '').strip()
    if len(nueva) < 6:
        return error('La contraseña debe tener mínimo 6 caracteres', 400)
    conn = get_db()
    try:
        if not verificar_password(conn, usuario, actual):
            return error('La contraseña actual es incorrecta', 401)
        conn.execute('UPDATE usuarios SET password = ? WHERE id = ?', (hash_password(nueva), usuario['id']))
        # Cierra las sesiones abiertas en otros dispositivos
        conn.execute('DELETE FROM sesiones WHERE usuario_id = ? AND token != ?', (usuario['id'], token))
        conn.commit()
        return jsonify({'ok': True})
    finally:
        conn.close()


# ── DERECHOS DEL TITULAR (Ley 1581 de 2012) ───────────
@app.route('/api/mis-datos', methods=['GET'])
def mis_datos():
    """Derecho de acceso: devuelve todo lo que el sistema guarda del usuario."""
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    conn = get_db()
    try:
        return jsonify({'ok': True, 'datos': {
            'nombre': usuario['nombre'], 'telefono': usuario['telefono'],
            'genero': usuario['genero'], 'avatar': usuario['avatar'],
            'creado_en': usuario['creado_en'],
            'consentimiento_en': usuario['consentimiento_en'],
            'consentimiento_version': usuario['consentimiento_version'],
            'progreso': progreso_dict(conn, usuario['id']),
        }})
    finally:
        conn.close()


@app.route('/api/consentimiento', methods=['POST'])
def registrar_consentimiento():
    """Para cuentas creadas antes de pedir la autorización: la registra ahora."""
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    data = datos_json()
    if data.get('acepta_datos') is not True or data.get('autoriza_acudiente') is not True:
        return error('Debes aceptar la política y contar con la autorización de tu acudiente', 400)
    conn = get_db()
    conn.execute('''UPDATE usuarios SET consentimiento_en = ?, consentimiento_version = ?,
                    autoriza_acudiente = 1 WHERE id = ?''', (fmt(ahora()), VERSION_POLITICA, usuario['id']))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


@app.route('/api/cuenta', methods=['DELETE'])
def eliminar_cuenta():
    """Derecho de supresión: borra al usuario y todo su progreso."""
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    password = str(datos_json().get('password') or '').strip()
    conn = get_db()
    try:
        if not verificar_password(conn, usuario, password):
            return error('Contraseña incorrecta', 401)
        uid = usuario['id']
        for tabla in ('sesiones', 'gemas', 'progreso'):
            conn.execute(f'DELETE FROM {tabla} WHERE usuario_id = ?', (uid,))
        conn.execute('DELETE FROM intentos_login WHERE telefono = ?', (usuario['telefono'],))
        conn.execute('DELETE FROM usuarios WHERE id = ?', (uid,))
        conn.commit()
        return jsonify({'ok': True})
    finally:
        conn.close()


# ── PROGRESO ──────────────────────────────────────────
@app.route('/api/progreso', methods=['GET'])
def leer_progreso():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    conn = get_db()
    try:
        return jsonify({'ok': True, 'progreso': progreso_dict(conn, usuario['id'])})
    finally:
        conn.close()


@app.route('/api/progreso', methods=['POST'])
def guardar_progreso():
    """Recibe el progreso local y lo FUSIONA con el del servidor, validándolo:
       - La XP nunca baja y no puede subir más de lo creíble según el tiempo transcurrido.
       - Plantas: solo IDs del catálogo; se unen con las ya guardadas.
       - Mundos completos: solo se aceptan si son coherentes con lo demás.
       - Gemas: niveles 0-9 e índices 0-2; se unen con las ya guardadas.
    """
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    data = datos_json()
    uid  = usuario['id']
    conn = get_db()
    try:
        actual  = progreso_dict(conn, uid)
        fila    = conn.execute('SELECT actualizado_en FROM progreso WHERE usuario_id = ?', (uid,)).fetchone()
        ultima  = parse_dt(fila['actualizado_en']) or ahora()
        minutos = max(0.0, (ahora() - ultima).total_seconds() / 60)

        # ── XP ──
        xp_cliente = a_entero(data.get('xp', actual['xp']))
        xp_maximo  = actual['xp'] + XP_BASE_POR_SYNC + int(minutos * XP_POR_MINUTO)
        xp_nuevo   = max(actual['xp'], min(xp_cliente, xp_maximo))
        ajustado   = xp_cliente > xp_maximo
        if ajustado:
            log.warning('XP ajustada para usuario %s: recibió %s, máximo creíble %s',
                        uid, xp_cliente, xp_maximo)

        # ── Plantas ──
        recibidas = data.get('plantas_encontradas', [])
        recibidas = {p for p in recibidas if isinstance(p, str) and p in PLANTAS_VALIDAS} \
                    if isinstance(recibidas, list) else set()
        plantas = sorted(set(actual['plantas_encontradas']) | recibidas)

        # ── Gemas ──
        gemas_rec = data.get('gemas', {})
        if isinstance(gemas_rec, dict):
            for nivel, lista in gemas_rec.items():
                n = a_entero(nivel, -1, 999)
                if 0 <= n < NIVELES_MUNDO2:
                    nuevas = limpiar_gemas(lista)
                    if nuevas:
                        guardar_gemas_nivel(conn, uid, n, nuevas)

        # ── Mundos ──
        mundo1 = actual['mundo1_completo'] or \
                 (bool(data.get('mundo1_completo')) and len(plantas) >= PLANTAS_MUNDO1)
        mundo2 = actual['mundo2_completo'] or (bool(data.get('mundo2_completo')) and mundo1)

        # ── Estadísticas (solo crecen y deben ser coherentes) ──
        partidas  = max(actual['partidas'],  a_entero(data.get('partidas', 0), 0, 100000))
        preguntas = max(actual['preguntas'], min(a_entero(data.get('preguntas', 0), 0, 10**6), partidas * 10))
        aciertos  = max(actual['aciertos'],  min(a_entero(data.get('aciertos', 0), 0, 10**6), preguntas))

        conn.execute('''
            UPDATE progreso SET xp = ?, plantas_encontradas = ?, mundo1_completo = ?,
                   mundo2_completo = ?, partidas = ?, aciertos = ?, preguntas = ?,
                   xp_ajustado = COALESCE(xp_ajustado, 0) + ?, actualizado_en = ?
            WHERE usuario_id = ?
        ''', (xp_nuevo, json.dumps(plantas), int(mundo1), int(mundo2),
              partidas, aciertos, preguntas, int(ajustado), fmt(ahora()), uid))
        conn.commit()
        return jsonify({'ok': True, 'ajustado': ajustado, 'progreso': progreso_dict(conn, uid),
                        'posicion': posicion_ranking(conn, uid)})
    except Exception:
        conn.rollback()
        log.exception('Error en /api/progreso')
        return error('Error interno del servidor', 500)
    finally:
        conn.close()


# ── GEMAS ─────────────────────────────────────────────
@app.route('/api/gemas', methods=['POST'])
def guardar_gemas():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    data  = datos_json()
    nivel = a_entero(data.get('nivel'), -1, 999)
    if not (0 <= nivel < NIVELES_MUNDO2):
        return error('Nivel inválido', 400)
    conn = get_db()
    try:
        union = guardar_gemas_nivel(conn, usuario['id'], nivel, limpiar_gemas(data.get('gemas', [])))
        conn.commit()
        return jsonify({'ok': True, 'nivel': nivel, 'gemas': union})
    finally:
        conn.close()


# ── RANKING ───────────────────────────────────────────
@app.route('/api/ranking')
def ranking():
    """modo=general (XP) | plantas (plantas encontradas) | selva (gemas del Mundo 2)."""
    modo = request.args.get('modo', 'general')
    if modo not in ('general', 'plantas', 'selva'):
        modo = 'general'
    yo   = get_user_from_token(bearer(request))
    conn = get_db()
    try:
        filas = conn.execute('''
            SELECT u.id, u.nombre, u.avatar, p.xp, p.plantas_encontradas, p.mundo2_completo
            FROM progreso p JOIN usuarios u ON u.id = p.usuario_id
        ''').fetchall()
        gemas_por_usuario = {}
        for g in conn.execute('SELECT usuario_id, gemas FROM gemas'):
            try:
                gemas_por_usuario[g['usuario_id']] = gemas_por_usuario.get(g['usuario_id'], 0) + \
                                                     len(json.loads(g['gemas']))
            except (TypeError, ValueError):
                pass

        lista = []
        for r in filas:
            n_plantas = len(json.loads(r['plantas_encontradas'] or '[]'))
            n_gemas   = gemas_por_usuario.get(r['id'], 0)
            if modo == 'plantas':
                valor = n_plantas
            elif modo == 'selva':
                valor = n_gemas
            else:
                valor = r['xp'] or 0
            lista.append({
                'id': r['id'], 'nombre': nombre_publico(r['nombre']), 'avatar': r['avatar'] or '',
                'xp': r['xp'] or 0, 'plantas': n_plantas, 'gemas': n_gemas,
                'mundo2_completo': bool(r['mundo2_completo']), 'valor': valor,
            })
        lista.sort(key=lambda x: (-x['valor'], -x['xp'], x['id']))

        mi_posicion = None
        for i, item in enumerate(lista):
            item['posicion'] = i + 1
            item['es_tu'] = bool(yo and item['id'] == yo['id'])
            if item['es_tu']:
                mi_posicion = i + 1
        top = lista[:50]
        for item in top:
            del item['id']
        return jsonify({'ok': True, 'modo': modo, 'ranking': top, 'mi_posicion': mi_posicion})
    finally:
        conn.close()


# ── ACTUALIZAR AVATAR ─────────────────────────────────
@app.route('/api/avatar', methods=['POST'])
def actualizar_avatar():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return error('No autorizado', 401)
    avatar = str(datos_json().get('avatar') or '').strip()
    if avatar not in ESTILOS_AVATAR:
        return error('Estilo de avatar inválido', 400)
    conn = get_db()
    conn.execute('UPDATE usuarios SET avatar = ? WHERE id = ?', (avatar, usuario['id']))
    conn.commit()
    conn.close()
    return jsonify({'ok': True, 'avatar': avatar})


@app.errorhandler(404)
def no_encontrado(_e):
    if request.path.startswith('/api/'):
        return error('Ruta no encontrada', 404)
    return 'No encontrado', 404

@app.errorhandler(405)
def metodo_no_permitido(_e):
    return error('Método no permitido', 405)

@app.errorhandler(413)
def demasiado_grande(_e):
    return error('Petición demasiado grande', 413)


# ══════════════════════════════════════════════════════
#  Frontend (PWA) servido desde el mismo servidor
#  → mismo origen: no hace falta CORS ni configurar API_URL.
# ══════════════════════════════════════════════════════
@app.route('/')
def front_index():
    return send_from_directory(FRONT_DIR, 'index.html')

@app.route('/<path:ruta>')
def front_archivos(ruta):
    if ruta.startswith('api/') or ruta.startswith('.') or '/.' in ruta:
        abort(404)
    resp = send_from_directory(FRONT_DIR, ruta)
    if ruta == 'service-worker.js':
        # El navegador debe revisar siempre si hay una versión nueva del SW
        resp.headers['Cache-Control'] = 'no-cache'
    return resp


# ══════════════════════════════════════════════════════
if __name__ == '__main__':
    app.run(debug=DEBUG, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
