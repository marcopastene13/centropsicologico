const db = require('../config/database');

class Profesional {
  
  // Obtener todos los profesionales
  static async findAll() {
    const query = `
      SELECT id, nombre, apellido, especialidad, telefono, email, 
             descripcion, titulo, foto_url, cv_url, activo, created_at, updated_at
      FROM profesionales
      WHERE activo = true
      ORDER BY nombre ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Obtener un profesional por ID
  static async findById(id) {
    const query = `
      SELECT id, nombre, apellido, especialidad, telefono, email,
             descripcion, titulo, foto_url, cv_url, activo, created_at, updated_at
      FROM profesionales
      WHERE id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Crear un nuevo profesional
  static async create(data) {
    const { nombre, apellido, especialidad, telefono, email, descripcion, titulo, foto_url, cv_url } = data;
    
    const query = `
      INSERT INTO profesionales (
        nombre, apellido, especialidad, telefono, email, descripcion, titulo, foto_url, cv_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [nombre, apellido, especialidad, telefono, email, descripcion, titulo, foto_url, cv_url];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // Actualizar un profesional
  static async update(id, data) {
    const { nombre, apellido, especialidad, telefono, email, descripcion, titulo, foto_url, cv_url } = data;
    
    const query = `
      UPDATE profesionales
      SET nombre = $1, apellido = $2, especialidad = $3, telefono = $4,
          email = $5, descripcion = $6, titulo = $7, foto_url = $8, cv_url = $9,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *
    `;
    
    const values = [nombre, apellido, especialidad, telefono, email, descripcion, titulo, foto_url, cv_url, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // Eliminar (soft delete) un profesional
  static async delete(id) {
    const query = `
      UPDATE profesionales
      SET activo = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = Profesional;
