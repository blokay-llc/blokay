const model = (sequelize: any, DataTypes: any) => {
  const View = sequelize.define(
    "View",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      slug: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      viewGroupId: { type: DataTypes.INTEGER, allowNull: true },
      workspaceId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "views",
    }
  );

  View.associate = function (models: any) {
    models.View.belongsTo(models.ViewGroup);
    models.View.belongsTo(models.User);
    models.View.belongsTo(models.Workspace);
  };

  return View;
};

export default model;
