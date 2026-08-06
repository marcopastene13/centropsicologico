module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define('Reserva', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    profesionalId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'profesionales',
        key: 'id'
      }
    },
    pacienteId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hora: {
      type: DataTypes.STRING(5),
      allowNull: false
    },
    pacienteNombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pacienteEmail: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    pacienteTelefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    servicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'reservas',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en'
  });

  return Reserva;
};
