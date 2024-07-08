const model = (sequelize: any, DataTypes: any) => {
  const ViewItem = sequelize.define(
    "ViewItem",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: DataTypes.STRING, allowNull: true },
      viewId: { type: DataTypes.INTEGER, allowNull: true },
      blockId: { type: DataTypes.INTEGER, allowNull: true },
      x: { type: DataTypes.INTEGER, allowNull: true },
      y: { type: DataTypes.INTEGER, allowNull: true },
      w: { type: DataTypes.INTEGER, allowNull: true },
      h: { type: DataTypes.INTEGER, allowNull: true },
      options: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;
          let json = objThis.getDataValue("options");
          json = json || "{}";
          try {
            return JSON.parse(json);
          } catch (err) {
            console.error(
              "viewItem options error parse: " + objThis.getDataValue("id"),
              err
            );
            return {};
          }
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("options", JSON.stringify(value));
        },
      },
    },
    {
      paranoid: true,
      tableName: "view_items",
    }
  );

  ViewItem.associate = function (models: any) {
    models.ViewItem.belongsTo(models.View);
    models.ViewItem.belongsTo(models.Block);
  };

  return ViewItem;
};

export default model;
