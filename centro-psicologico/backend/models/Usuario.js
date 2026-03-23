const db = require('../config/database');
const bcrypt = require('bcrypt'); // Necesitaremos instalarlo

class Usuario {
  
  // Obtener todos los usuarios
  static async findAll() {
    const query = `
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE activo = true
      ORDER BY nombre ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Obtener un usuario por ID
  static async findById(id) {
    const query = `
      SELECT id, nombre, email, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Obtener un usuario por email (para login)
  static async findByEmail(email) {
    const query = `
      SELECT id, nombre, email, password_hash, rol, activo, created_at, updated_at
      FROM usuarios
      WHERE email = $1 AND activo = true
    `;
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  // Crear un nuevo usuario
  static async create(data) {
    const { nombre, email, password, rol = 'admin' } = data;
    
    // Hash del password
    const password_hash = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO usuarios (nombre, email, password_hash, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, email, rol, created_at
    `;
    
    const values = [nombre, email, password_hash, rol];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // Verificar password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Actualizar password
  static async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    
    const query = `
      UPDATE usuarios
      SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, nombre, email
    `;
    
    const { rows } = await db.query(query, [password_hash, id]);
    return rows[0];
  }

  // Eliminar (soft delete) un usuario
  static async delete(id) {
    const query = `
      UPDATE usuarios
      SET activo = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, nombre, email
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Usuario;
