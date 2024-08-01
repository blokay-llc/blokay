import Sequelize from "sequelize";
const model = (sequelize: any, DataTypes: any) => {
  const Bill = sequelize.define(
    "Bill",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      startBillingCycle: { type: DataTypes.DATE, allowNull: true },
      endBillingCycle: { type: DataTypes.DATE, allowNull: true },

      number: { type: DataTypes.INTEGER, allowNull: true },
      amount: { type: DataTypes.DECIMAL, allowNull: true },
      paid: { type: DataTypes.TINYINT, allowNull: true },
    },
    {
      tableName: "core_bills",
    }
  );

  Bill.associate = function (models: any) {
    models.Bill.belongsTo(models.Business);
  };

  Bill.prototype.getDetailsByKeys = async function (keys: any) {
    const details = await sequelize.models.BillDetail.findAll({
      where: {
        billId: this.id,
        concept: { [Sequelize.Op.in]: keys },
      },
    });

    return details.reduce((acc: any, detail: any) => {
      acc[detail.concept] = {
        value: detail.value,
        amount: detail.amount,
      };
      return acc;
    }, {});
  };

  return Bill;
};

export default model;
