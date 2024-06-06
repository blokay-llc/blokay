const model = (sequelize: any, DataTypes: any) => {
  const NeuronLog = sequelize.define(
    "NeuronLog",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      neuronId: { type: DataTypes.INTEGER, allowNull: true },
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
              "neuron-log filters error parse: " + objThis.getDataValue("id"),
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
      tableName: "neuron_logs",
    }
  );

  NeuronLog.associate = function (models: any) {
    models.NeuronLog.belongsTo(models.Neuron);
    models.NeuronLog.belongsTo(models.User);
    models.NeuronLog.belongsTo(models.Business);
  };

  return NeuronLog;
};

export default model;
