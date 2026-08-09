module.exports = (sequelize, DataTypes) => {
  const Profesional = sequelize.define('Profesional', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    foto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    experiencia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    horarioSemanal: {
      // { lunes: {activo, inicio, fin, pausaInicio, pausaFin}, martes: {...}, ... }
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    },
    duracionSesionMin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 60
    },
    fechasBloqueadas: {
      // [{ fecha: "2026-08-20", motivo: "Vacaciones" }, ...]
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    }
  }, {
    tableName: 'profesionales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Profesional;
};
