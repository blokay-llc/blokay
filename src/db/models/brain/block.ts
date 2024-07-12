const model = (sequelize: any, DataTypes: any) => {
  const Block = sequelize.define(
    "Block",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      executions: { type: DataTypes.INTEGER, allowNull: true },
      timeMs: { type: DataTypes.INTEGER, allowNull: true },
      cron: { type: DataTypes.STRING, allowNull: true },
      key: { type: DataTypes.STRING, allowNull: true },
      type: { type: DataTypes.STRING, allowNull: true },
      description: { type: DataTypes.STRING, allowNull: true },
      rolPrivilegeId: { type: DataTypes.INTEGER, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      workspaceId: { type: DataTypes.INTEGER, allowNull: true },
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
              "block filters error parse: " + objThis.getDataValue("id"),
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

      history: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;

          let json = objThis.getDataValue("history");
          json = json || "[]";
          try {
            return JSON.parse(json);
          } catch (err) {
            console.error(
              "block history error parse: " + objThis.getDataValue("id"),
              err
            );
            return {};
          }
        },
        set(value: any) {
          let objThis: any = this;

          objThis.setDataValue("history", JSON.stringify(value));
        },
      },

      synapse: { type: DataTypes.STRING, allowNull: true },
      executable: { type: DataTypes.STRING, allowNull: true },
    },
    {
      paranoid: true,
      tableName: "blocks",
    }
  );

  Block.getSessionBlock = async function (businessId: string) {
    let queryBuilder: any = {
      where: {
        key: "login",
        businessId,
      },
    };
    return await Block.findOne(queryBuilder);
  };

  Block.findByKey = async function (key: string) {
    let queryBuilder: any = {
      where: {
        key,
      },
    };
    return await Block.findOne(queryBuilder);
  };
  Block.findByKeyWorkspace = async function (key: string, workspaceId: string) {
    let queryBuilder: any = {
      where: {
        key,
        workspaceId,
      },
    };
    return await Block.findOne(queryBuilder);
  };

  return Block;
};

export default model;
