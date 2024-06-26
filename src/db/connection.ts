const connections: any = {};
const dialects = {
  mysql2: require("mysql2"),
};
export const getConnection = (db: any, datasource: any, profile: string) => {
  let dataSourceId = datasource.id;
  return new Promise((resolve, reject) => {
    if (connections[dataSourceId]) {
      if (connections[dataSourceId].conn) {
        return resolve(connections[dataSourceId].sendConnection());
      }
    } else {
      connections[dataSourceId] = {
        lastExec: Date.now(),
        conn: null,
        status: "created",
        tailConnections: [],
        sendConnection: () => {
          connections[dataSourceId].lastExec = Date.now();
          return connections[dataSourceId].conn;
        },
        onReady: async (cb: any) => {
          try {
            // if its first time
            if (connections[dataSourceId].status == "connected") {
              cb(connections[dataSourceId].config);
            } else if (connections[dataSourceId].status == "created") {
              connections[dataSourceId].status = "connecting";

              console.log("connecting", datasource.id);

              const conn = new db.Sequelize({
                ...datasource.config.database,
                dialect: "mysql",
                dialectModule: dialects.mysql2,
                operatorsAliases: db.Op,
                benchmark: true,
                logging: (str: string, time: number) => {
                  if (time > 2000) {
                    db._QueryExecution.create({
                      dataSourceId: datasource.id,
                      sql: str,
                      ms: time,
                      type: "alert_register",
                    });
                  }
                },
              });
              await conn.authenticate();
              connections[dataSourceId].conn = conn;
              connections[dataSourceId].status = "connected";

              let tailConnections =
                connections[dataSourceId].tailConnections.slice(0);
              tailConnections.map((callback: any) => {
                callback(conn);
              });

              let structure = await datasource.getDb(conn);
              await datasource.update({ structure });
              cb(conn);
            }
            //if it's connecting
            else if (connections[dataSourceId].status == "connecting") {
              connections[dataSourceId].tailConnections.push((conn: any) => {
                cb(conn);
              });
            }
          } catch (err) {
            reject(err);
          }
        },
      };
    }

    connections[dataSourceId].onReady(() => {
      resolve(connections[dataSourceId].sendConnection());
    });
  });
};
