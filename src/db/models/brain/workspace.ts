function string_to_slug(str: string) {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();

  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  return str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const model = (sequelize: any, DataTypes: any) => {
  const Workspace = sequelize.define(
    "Workspace",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
        set(slug: string) {
          let objThis: any = this;
          objThis.setDataValue("slug", string_to_slug(slug));
        },
      },
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
