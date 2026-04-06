# ══════════════════════════════════════════════════════
#  Pastuker — Backend  (Python + Flask + SQLite)
#  Estructura: PASTUKER/backend/app.py
# ══════════════════════════════════════════════════════
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3, hashlib, secrets, os, json
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=['http://127.0.0.1:5501', 'http://localhost:5501'])   # permite peticiones desde el frontend en cualquier puerto

# ── Ruta de la base de datos ──────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH  = os.path.join(BASE_DIR, 'pastuker.db')

# ══════════════════════════════════════════════════════
#  INICIALIZAR BASE DE DATOS
# ══════════════════════════════════════════════════════
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row   # devuelve filas como dict
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()

    c.executescript('''
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
    ''')

    conn.commit()
    conn.close()
    print('✅  Base de datos lista en:', DB_PATH)

# ── Helpers ───────────────────────────────────────────
def hash_password(pwd):
    return hashlib.sha256(pwd.encode()).hexdigest()

def gen_token():
    return secrets.token_hex(32)

def get_user_from_token(token):
    if not token:
        return None
    conn = get_db()
    row  = conn.execute(
        'SELECT u.* FROM usuarios u '
        'JOIN sesiones s ON s.usuario_id = u.id '
        'WHERE s.token = ?', (token,)
    ).fetchone()
    conn.close()
    return row

def bearer(request):
    auth = request.headers.get('Authorization', '')
    return auth.replace('Bearer ', '').strip() or None

# ══════════════════════════════════════════════════════
#  RUTAS
# ══════════════════════════════════════════════════════

# ── Health check ─────────────────────────────────────
@app.route('/api/ping')
def ping():
    return jsonify({'ok': True, 'msg': 'Pastuker API online'})


# ── REGISTER ─────────────────────────────────────────
@app.route('/api/register', methods=['POST'])
def register():
    data      = request.get_json(force=True)
    nombre    = (data.get('nombre')   or '').strip()
    telefono  = (data.get('telefono') or '').strip()
    password  = (data.get('password') or '').strip()
    genero    = (data.get('genero')   or 'no_decir').strip()

    # Validaciones básicas
    if not nombre or not telefono or not password:
        return jsonify({'ok': False, 'msg': 'Faltan campos obligatorios'}), 400
    if len(telefono) < 7:
        return jsonify({'ok': False, 'msg': 'Teléfono inválido'}), 400
    if len(password) < 6:
        return jsonify({'ok': False, 'msg': 'La contraseña debe tener mínimo 6 caracteres'}), 400

    conn = get_db()
    try:
        # Verificar si el teléfono ya existe
        existe = conn.execute(
            'SELECT id FROM usuarios WHERE telefono = ?', (telefono,)
        ).fetchone()
        if existe:
            return jsonify({'ok': False, 'msg': 'Este teléfono ya está registrado'}), 409

        # Insertar usuario
        pwd_hash = hash_password(password)
        conn.execute(
            'INSERT INTO usuarios (nombre, telefono, password, genero) VALUES (?,?,?,?)',
            (nombre, telefono, pwd_hash, genero)
        )
        conn.commit()

        # Obtener el usuario recién creado
        usuario = conn.execute(
            'SELECT * FROM usuarios WHERE telefono = ?', (telefono,)
        ).fetchone()

        # Crear progreso vacío
        conn.execute(
            'INSERT OR IGNORE INTO progreso (usuario_id) VALUES (?)',
            (usuario['id'],)
        )
        conn.commit()

        # Generar token de sesión
        token = gen_token()
        conn.execute(
            'INSERT INTO sesiones (token, usuario_id) VALUES (?,?)',
            (token, usuario['id'])
        )
        conn.commit()

        return jsonify({
            'ok':     True,
            'token':  token,
            'usuario': {
                'id':      usuario['id'],
                'nombre':  usuario['nombre'],
                'telefono':usuario['telefono'],
                'genero':  usuario['genero'],
                'avatar':  usuario['avatar'],
                'xp':      0,
            }
        }), 201

    except Exception as e:
        return jsonify({'ok': False, 'msg': str(e)}), 500
    finally:
        conn.close()


# ── LOGIN ─────────────────────────────────────────────
@app.route('/api/login', methods=['POST'])
def login():
    data     = request.get_json(force=True)
    telefono = (data.get('telefono') or '').strip()
    password = (data.get('password') or '').strip()

    if not telefono or not password:
        return jsonify({'ok': False, 'msg': 'Faltan campos obligatorios'}), 400

    conn = get_db()
    try:
        usuario = conn.execute(
            'SELECT * FROM usuarios WHERE telefono = ?', (telefono,)
        ).fetchone()

        if not usuario or usuario['password'] != hash_password(password):
            return jsonify({'ok': False, 'msg': 'Teléfono o contraseña incorrectos'}), 401

        # Obtener progreso
        prog = conn.execute(
            'SELECT * FROM progreso WHERE usuario_id = ?', (usuario['id'],)
        ).fetchone()

        # Generar nuevo token
        token = gen_token()
        conn.execute(
            'INSERT INTO sesiones (token, usuario_id) VALUES (?,?)',
            (token, usuario['id'])
        )
        conn.commit()

        return jsonify({
            'ok':    True,
            'token': token,
            'usuario': {
                'id':      usuario['id'],
                'nombre':  usuario['nombre'],
                'telefono':usuario['telefono'],
                'genero':  usuario['genero'],
                'avatar':  usuario['avatar'],
                'xp':      prog['xp'] if prog else 0,
                'plantas_encontradas': json.loads(prog['plantas_encontradas']) if prog else [],
                'mundo2_completo':     bool(prog['mundo2_completo']) if prog else False,
            }
        })

    except Exception as e:
        return jsonify({'ok': False, 'msg': str(e)}), 500
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
@app.route('/api/perfil')
def perfil():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return jsonify({'ok': False, 'msg': 'No autorizado'}), 401

    conn = get_db()
    prog = conn.execute(
        'SELECT * FROM progreso WHERE usuario_id = ?', (usuario['id'],)
    ).fetchone()
    conn.close()

    return jsonify({
        'ok': True,
        'usuario': {
            'id':      usuario['id'],
            'nombre':  usuario['nombre'],
            'telefono':usuario['telefono'],
            'genero':  usuario['genero'],
            'avatar':  usuario['avatar'],
            'xp':      prog['xp'] if prog else 0,
            'plantas_encontradas': json.loads(prog['plantas_encontradas']) if prog else [],
            'mundo2_completo':     bool(prog['mundo2_completo']) if prog else False,
        }
    })


# ── GUARDAR PROGRESO ──────────────────────────────────
@app.route('/api/progreso', methods=['POST'])
def guardar_progreso():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return jsonify({'ok': False, 'msg': 'No autorizado'}), 401

    data = request.get_json(force=True)
    xp                  = data.get('xp', 0)
    plantas_encontradas = json.dumps(data.get('plantas_encontradas', []))
    mundo2_completo     = 1 if data.get('mundo2_completo') else 0

    conn = get_db()
    conn.execute('''
        INSERT INTO progreso (usuario_id, xp, plantas_encontradas, mundo2_completo, actualizado_en)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(usuario_id) DO UPDATE SET
            xp                  = excluded.xp,
            plantas_encontradas = excluded.plantas_encontradas,
            mundo2_completo     = excluded.mundo2_completo,
            actualizado_en      = excluded.actualizado_en
    ''', (usuario['id'], xp, plantas_encontradas, mundo2_completo))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


# ── GUARDAR GEMAS ─────────────────────────────────────
@app.route('/api/gemas', methods=['POST'])
def guardar_gemas():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return jsonify({'ok': False, 'msg': 'No autorizado'}), 401

    data  = request.get_json(force=True)
    nivel = data.get('nivel')
    gemas = json.dumps(data.get('gemas', []))

    conn = get_db()
    conn.execute('''
        INSERT INTO gemas (usuario_id, nivel, gemas) VALUES (?,?,?)
        ON CONFLICT(usuario_id, nivel) DO UPDATE SET gemas = excluded.gemas
    ''', (usuario['id'], nivel, gemas))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


# ── RANKING ───────────────────────────────────────────
@app.route('/api/ranking')
def ranking():
    conn = get_db()
    rows = conn.execute('''
        SELECT u.nombre, u.avatar, p.xp,
               length(p.plantas_encontradas) - 2 as plantas
        FROM progreso p
        JOIN usuarios u ON u.id = p.usuario_id
        ORDER BY p.xp DESC
        LIMIT 50
    ''').fetchall()
    conn.close()

    resultado = []
    for r in rows:
        resultado.append({
            'nombre':  r['nombre'],
            'avatar':  r['avatar'],
            'xp':      r['xp'],
        })
    return jsonify({'ok': True, 'ranking': resultado})


# ── ACTUALIZAR AVATAR ─────────────────────────────────
@app.route('/api/avatar', methods=['POST'])
def actualizar_avatar():
    usuario = get_user_from_token(bearer(request))
    if not usuario:
        return jsonify({'ok': False, 'msg': 'No autorizado'}), 401

    data   = request.get_json(force=True)
    avatar = data.get('avatar', '')

    conn = get_db()
    conn.execute('UPDATE usuarios SET avatar = ? WHERE id = ?', (avatar, usuario['id']))
    conn.commit()
    conn.close()
    return jsonify({'ok': True})


# ══════════════════════════════════════════════════════
#  ARRANCAR
# ══════════════════════════════════════════════════════
if __name__ == '__main__':
    init_db()
    # debug=True solo para desarrollo local
    # En producción (Railway/Render) esto lo maneja gunicorn
    app.run(debug=True, host='0.0.0.0', port=5000)