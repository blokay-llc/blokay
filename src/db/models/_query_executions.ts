export default (sequelize: any, DataTypes: any) => {
  const _QueryExecution = sequelize.define(
    "_QueryExecution",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      dataSourceId: { type: DataTypes.INTEGER, allowNull: true },
      ms: { type: DataTypes.INTEGER, allowNull: false },
      sql: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "_query_executions",
    }
  );

  return _QueryExecution;
};
