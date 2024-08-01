const model = (sequelize: any, DataTypes: any) => {
  const BillDetail = sequelize.define(
    "BillDetail",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      concept: { type: DataTypes.STRING, allowNull: true },
      value: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.DECIMAL, allowNull: true },
      lastUpdateAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: "core_bill_details",
    }
  );

  BillDetail.associate = function (models: any) {
    models.BillDetail.belongsTo(models.Bill);
  };

  return BillDetail;
};

export default model;
