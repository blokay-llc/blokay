const model = (sequelize: any, DataTypes: any) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "workspaces",
    }
  );

  Workspace.associate = function (models: any) {
    models.View.belongsTo(models.Business);
  };

  Workspace.findById = async function (id: string) {
    let queryBuilder: any = {
      where: {
        id,
      },
    };
    return await Workspace.findOne(queryBuilder);
  };

  return Workspace;
};

export default model;
