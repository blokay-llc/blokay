const model = (sequelize: any, DataTypes: any) => {
  const View = sequelize.define(
    "View",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      // icon: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      slug: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      viewGroupId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "views",
    }
  );

  View.associate = function (models: any) {
    models.View.belongsTo(models.ViewGroup);
    // models.Neuron.hasMany(models.Neuron);
    // models.Neuron.belongsTo(models.RolPrivilege);
  };

  return View;
};

export default model;
