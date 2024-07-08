const model = (sequelize: any, DataTypes: any) => {
  const BlockLog = sequelize.define(
    "BlockLog",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      blockId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      filters: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;
          let json = objThis.getDataValue("filters");
          json = json || "{}";
          try {
            return JSON.parse(json);
          } catch (err) {
            console.error(
              "block-log filters error parse: " + objThis.getDataValue("id"),
              err
            );
            return {};
          }
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("filters", JSON.stringify(value));
        },
      },
      synapse: { type: DataTypes.STRING, allowNull: true },
    },
    {
      tableName: "block_logs",
    }
  );

  BlockLog.associate = function (models: any) {
    models.BlockLog.belongsTo(models.Block);
    models.BlockLog.belongsTo(models.User);
    models.BlockLog.belongsTo(models.Business);
  };

  return BlockLog;
};

export default model;
