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
    }
  }, {
    tableName: 'profesionales',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Profesional;
};
