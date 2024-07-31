import { Sequelize } from "sequelize";
import crypto from "crypto";

const model = (sequelize: any, DataTypes: any) => {
  const Datasource = sequelize.define(
    "Datasource",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      type: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      lastUseAt: { type: DataTypes.DATE, allowNull: true },
      workspaceId: { type: DataTypes.INTEGER, allowNull: true },
      config: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;

          let encodedText = objThis.getDataValue("config");
          try {
            const key: string = process.env.ENCRYPTION_KEY || "";

            const algorithm = "aes256";

            const decipher = crypto.createDecipher(algorithm, key);
            const decrypted =
              decipher.update(encodedText, "hex", "utf8") +
              decipher.final("utf8");

            let json: any = decrypted || "{}";
            return JSON.parse(json);
          } catch (err) {
            console.log(err);
            let json: any = objThis.getDataValue("config") || "{}";
            return JSON.parse(json);
          }
        },
        set(value: any) {
          let objThis: any = this;

          const key: string = process.env.ENCRYPTION_KEY || "";

          const algorithm = "aes256";

          const cipher = crypto.createCipher(algorithm, key);
          const encrypted =
            cipher.update(JSON.stringify(value), "utf8", "hex") +
            cipher.final("hex");

          objThis.setDataValue("config", encrypted);
        },
      },

      structure: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          let objThis: any = this;
          let json = objThis.getDataValue("structure");
          json = json || "{}";
          try {
            return JSON.parse(json);
          } catch (err) {
            console.error(
              "datasource structure error parse: " + objThis.getDataValue("id"),
              err
            );
            return {};
          }
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("structure", JSON.stringify(value));
        },
      },
    },
    {
      paranoid: true,
      tableName: "datasources",
    }
  );

  Datasource.prototype.getDb = async function (conn: any) {
    let SequelizeObj: any = Sequelize;
    let tables: any = {};
    let sql = `select \`TABLE_NAME\` as "table",
    \`COLUMN_NAME\` as "column", 
    DATA_TYPE as \`type\`, 
    COLUMN_DEFAULT as dflt_value,
    IF(COLUMN_NAME = "id", 1, 0) as pk,
    \`TABLE_SCHEMA\` AS db
    from information_schema.COLUMNS
    where TABLE_SCHEMA NOT IN ("information_schema", "MYSQL", "performance_schema")
    and \`TABLE_SCHEMA\` = '${this.config.database.database}'
    group by COLUMN_NAME, TABLE_NAME
    order by COLUMNS.ORDINAL_POSITION ASC`;
    let result = await conn.query(sql, {
      type: SequelizeObj.QueryTypes.SELECT,
      raw: true,
    });

    result.map((r: any) => {
      if (!tables[r.table]) {
        tables[r.table] = { columns: [], name: r.table };
      }

      tables[r.table].columns.push({
        type: r.type,
        name: r.column,
        pk: r.pk,
        default: r.dflt_value,
        unsaved: false,
        exist: true,
      });
    });

    return { tables: Object.values(tables) };
  };

  return Datasource;
};

export default model;
