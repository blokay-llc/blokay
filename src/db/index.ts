import Sequelize from "sequelize";
// Models
import _QueryExecution from "./models/_query_executions";
import Neuron from "./models/brain/neuron";
import NeuronExecution from "./models/brain/neuron-execution";
import View from "./models/brain/view";
import ViewItem from "./models/brain/view-item";
import ViewGroup from "./models/brain/view-group";
import Datasource from "./models/brain/datasource";
import Business from "./models/user/business";
import User from "./models/user/user";
import UserPermission from "./models/user/user-permission";

class DB {
  [index: string]: any; //index signature

  private models: any = {
    _QueryExecution,
    Datasource,
    Neuron,
    NeuronExecution,
    View,
    ViewGroup,
    ViewItem,
    Business,
    User,
    UserPermission,
  };

  public sequelize: any = null;
  public Sequelize: any = Sequelize;
  public Op: any = Sequelize.Op;

  constructor() {
    this.connect();
    this.createModels();
    this.associate();
  }

  createModels() {
    for (let key in this.models) {
      this[key] = this.models[key](this.sequelize, this.Sequelize.DataTypes);
    }
  }

  associate() {
    for (let key in this.models) {
      if (this[key].associate) {
        this[key].associate(this);
      }
    }
  }

  connect() {
    let SequelizeObj: any = Sequelize;
    this.sequelize = new SequelizeObj(
      process.env.MYSQL_DATABASE,
      process.env.MYSQL_USER,
      process.env.MYSQL_PASSWORD,
      {
        host: process.env.MYSQL_HOST,
        pool: {
          max: 20,
          min: 0,
          idle: 20000,
          acquire: 200000,
        },
        dialect: "mysql",
        define: {
          charset: "utf8",
          collate: "utf8_general_ci",
        },
        timezone: "-05:00",
        dialectModule: require("mysql2"),
        operatorsAliases: this.Op,
        benchmark: true,
        logging: (str: string, time: number) => {
          if (time > 2000) {
            this._QueryExecution.create({
              sql: str,
              ms: time,
              type: "alert_register",
            });
          }
        },
      }
    );
  }
}

export default DB;
