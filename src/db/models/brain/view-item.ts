const model = (sequelize: any, DataTypes: any) => {
  const ViewItem = sequelize.define(
    "ViewItem",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: DataTypes.STRING, allowNull: true },
      viewId: { type: DataTypes.INTEGER, allowNull: true },
      neuronId: { type: DataTypes.INTEGER, allowNull: true },
      x: { type: DataTypes.INTEGER, allowNull: true },
      y: { type: DataTypes.INTEGER, allowNull: true },
      w: { type: DataTypes.INTEGER, allowNull: true },
      h: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "view_items",
    }
  );

  return ViewItem;
};

export default model;
