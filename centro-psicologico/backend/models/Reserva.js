const db = require('../config/database');

class Reserva {
  
  // Obtener todas las reservas
  static async findAll() {
    const query = `
      SELECT r.id, r.profesional_id, r.servicio_id, r.cliente_nombre, r.cliente_email,
             r.cliente_telefono, r.fecha, r.hora, r.estado, r.notas,
             r.created_at, r.updated_at,
             p.nombre as profesional_nombre, p.apellido as profesional_apellido
      FROM reservas r
      LEFT JOIN profesionales p ON r.profesional_id = p.id
      ORDER BY r.fecha DESC, r.hora DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  // Obtener una reserva por ID
  static async findById(id) {
    const query = `
      SELECT r.*, p.nombre as profesional_nombre, p.apellido as profesional_apellido
      FROM reservas r
      LEFT JOIN profesionales p ON r.profesional_id = p.id
      WHERE r.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  // Obtener reservas por profesional
  static async findByProfesional(profesionalId) {
    const query = `
      SELECT * FROM reservas
      WHERE profesional_id = $1
      ORDER BY fecha DESC, hora DESC
    `;
    const { rows } = await db.query(query, [profesionalId]);
    return rows;
  }

  // Obtener reservas por cliente (email)
  static async findByCliente(clienteEmail) {
    const query = `
      SELECT r.*, p.nombre as profesional_nombre, p.apellido as profesional_apellido
      FROM reservas r
      LEFT JOIN profesionales p ON r.profesional_id = p.id
      WHERE r.cliente_email = $1
      ORDER BY r.fecha DESC, r.hora DESC
    `;
    const { rows } = await db.query(query, [clienteEmail]);
    return rows;
  }

  // Crear una nueva reserva
  static async create(data) {
    const {
      profesional_id,
      servicio_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      fecha,
      hora,
      estado = 'pendiente',
      notas
    } = data;
    
    const query = `
      INSERT INTO reservas (
        profesional_id, servicio_id, cliente_nombre, cliente_email,
        cliente_telefono, fecha, hora, estado, notas
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      profesional_id,
      servicio_id,
      cliente_nombre,
      cliente_email,
      cliente_telefono,
      fecha,
      hora,
      estado,
      notas
    ];
    
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  // Actualizar estado de una reserva
  static async updateEstado(id, nuevoEstado) {
    const query = `
      UPDATE reservas
      SET estado = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [nuevoEstado, id]);
    return rows[0];
  }

  // Cancelar una reserva
  static async cancelar(id) {
    return await this.updateEstado(id, 'cancelada');
  }

  // Confirmar una reserva
  static async confirmar(id) {
    return await this.updateEstado(id, 'confirmada');
  }
}

module.exports = Reserva;
