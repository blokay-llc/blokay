const model = (sequelize: any, DataTypes: any) => {
  const NeuronExecution = sequelize.define(
    "NeuronExecution",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      dataSourceId: { type: DataTypes.INTEGER, allowNull: true },
      neuronId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      timeMs: { type: DataTypes.INTEGER, allowNull: true },
      error: { type: DataTypes.STRING, allowNull: true },
      finishAt: { type: DataTypes.DATE, allowNull: true },

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
              "neuron data error parse: " + objThis.getDataValue("id"),
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
      tableName: "neuron_executions",
    }
  );

  NeuronExecution.associate = function (models: any) {
    models.NeuronExecution.belongsTo(models.Neuron);
    models.NeuronExecution.belongsTo(models.User);
  };

  return NeuronExecution;
};

export default model;
