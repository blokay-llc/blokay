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
      data: { type: DataTypes.STRING, allowNull: true },
      error: { type: DataTypes.STRING, allowNull: true },
      finishAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "neuron_executions",
    }
  );

  return NeuronExecution;
};

export default model;
