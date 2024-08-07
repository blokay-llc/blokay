const model = (sequelize: any, DataTypes: any) => {
  const Blockxecution = sequelize.define(
    "BlockExecution",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      dataSourceId: { type: DataTypes.INTEGER, allowNull: true },
      blockId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      timeMs: { type: DataTypes.INTEGER, allowNull: true },
      error: { type: DataTypes.STRING, allowNull: true },
      finishAt: { type: DataTypes.DATE, allowNull: true },

      inputSize: { type: DataTypes.INTEGER, allowNull: true },
      outputSize: { type: DataTypes.INTEGER, allowNull: true },

      data: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;

          let json = objThis.getDataValue("data");
          json = json || "{}";
          try {
            return JSON.parse(json);
          } catch (err) {
            console.error(
              "block data error parse: " + objThis.getDataValue("id"),
              err
            );
            return {};
          }
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("data", JSON.stringify(value));
        },
      },
    },
    {
      tableName: "block_executions",
    }
  );

  Blockxecution.associate = function (models: any) {
    models.BlockExecution.belongsTo(models.Block);
    models.BlockExecution.belongsTo(models.User);
  };

  return Blockxecution;
};

export default model;
