#!/usr/bin/env python3
"""
Pastuker — herramientas de administración (se ejecutan en el servidor).

    python admin.py listar
    python admin.py restablecer <telefono> <nueva_contraseña>
    python admin.py eliminar <telefono>

"restablecer" sirve para el botón "¿Olvidaste tu contraseña?": el docente o
administrador asigna una contraseña temporal y el estudiante la cambia en Perfil.
"""
import sys
import app as pastuker


def listar():
    conn = pastuker.get_db()
    filas = conn.execute('''
        SELECT u.id, u.nombre, u.telefono, u.creado_en, u.consentimiento_en, COALESCE(p.xp, 0) AS xp
        FROM usuarios u LEFT JOIN progreso p ON p.usuario_id = u.id ORDER BY u.id
    ''').fetchall()
    conn.close()
    for f in filas:
        consentimiento = 'sí' if f['consentimiento_en'] else 'NO'
        print(f"{f['id']:>4}  {f['telefono']:<12} {f['nombre']:<30} XP {f['xp']:<6} autorización: {consentimiento}")


def restablecer(telefono, nueva):
    if len(nueva) < 6:
        sys.exit('La contraseña debe tener mínimo 6 caracteres')
    conn = pastuker.get_db()
    u = conn.execute('SELECT id FROM usuarios WHERE telefono = ?', (telefono,)).fetchone()
    if not u:
        sys.exit('No existe un usuario con ese teléfono')
    conn.execute('UPDATE usuarios SET password = ? WHERE id = ?', (pastuker.hash_password(nueva), u['id']))
    conn.execute('DELETE FROM sesiones WHERE usuario_id = ?', (u['id'],))
    conn.execute('DELETE FROM intentos_login WHERE telefono = ?', (telefono,))
    conn.commit()
    conn.close()
    print('Contraseña restablecida. Pide al estudiante que la cambie desde su Perfil.')


def eliminar(telefono):
    conn = pastuker.get_db()
    u = conn.execute('SELECT id FROM usuarios WHERE telefono = ?', (telefono,)).fetchone()
    if not u:
        sys.exit('No existe un usuario con ese teléfono')
    for tabla in ('sesiones', 'gemas', 'progreso'):
        conn.execute(f'DELETE FROM {tabla} WHERE usuario_id = ?', (u['id'],))
    conn.execute('DELETE FROM usuarios WHERE id = ?', (u['id'],))
    conn.commit()
    conn.close()
    print('Usuario y progreso eliminados.')


if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['listar']:
        listar()
    elif args[:1] == ['restablecer'] and len(args) == 3:
        restablecer(args[1], args[2])
    elif args[:1] == ['eliminar'] and len(args) == 2:
        eliminar(args[1])
    else:
        print(__doc__)
