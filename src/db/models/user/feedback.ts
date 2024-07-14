export default (sequelize: any, DataTypes: any) => {
  const Feedback = sequelize.define(
    "Feedback",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      feedback: { type: DataTypes.STRING, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "feedback",
    }
  );

  Feedback.associate = function (models: any) {
    models.Feedback.belongsTo(models.User);
    models.Feedback.belongsTo(models.Business);
  };

  return Feedback;
};
