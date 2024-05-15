import { CronJob } from "cron";
import Models from "@/db/index";

import { Args, QueryReplacements, ResponseNeuron } from "@/lib/types.d";
import { getConnection } from "@/db/connection";
import vm from "node:vm";

let db = new Models();
const { Neuron, Datasource, NeuronExecution }: any = db;

const buildArgs = ({ datasource }: any): Args => ({
  session: null,
  fetch: async (endpoint: string, opts = {}) => {
    let response = await fetch(endpoint, opts);
    return await response.json();
  },
  query: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "read");
    return await conn.query(sql, { replacements, type: "SELECT" });
  },
  insert: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "INSERT" });
  },
  delete: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "DELETE" });
  },
  update: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "UPDATE" });
  },
  find: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "read");
    let rows = await conn.query(sql, { replacements, type: "SELECT" });
    if (rows && rows.length > 0) {
      return rows[0];
    }
    return rows;
  },
  json: (json: Object): ResponseNeuron => {
    return { type: "json", content: json };
  },
  error: (message: string): ResponseNeuron => {
    return { type: "error", content: { message } };
  },
  message: (message: string): ResponseNeuron => {
    return { type: "message", content: { message } };
  },

  table: (result: any[]): ResponseNeuron => {
    if (!result || !result.length)
      return { type: "table", content: { data: [], header: [] } };
    let header = Object.keys(
      result.reduce((ac, row) => ({ ...ac, ...row }), {})
    );
    result = result.map((r) => header.map((h) => r[h] || ""));
    return { type: "table", content: { data: result, header } };
  },
  value: (result: any): ResponseNeuron => {
    return { type: "value", content: result };
  },
  chartLine: (result: any[]): ResponseNeuron => {
    if (!result || !result.length)
      return { type: "line", content: { datasets: [], labels: [] } };

    let labelKey = Object.keys(result[0])[0];
    let labels = result.map((row) => row[labelKey]);
    let dataSetsLength = Object.values(result[0]).length - 1;
    let datasets: any = [...new Array(dataSetsLength)].map(() => ({
      label: "",
      vals: [],
    }));
    for (let row of result) {
      let vals = Object.values(row);
      let keys = Object.keys(row);

      for (let k in vals) {
        let kIndex = parseInt(k);
        if (kIndex == 0) continue;
        let val = vals[kIndex];
        datasets[kIndex - 1].label = keys[k];
        datasets[kIndex - 1].vals.push(val);
      }
    }
    return { type: "line", content: { datasets: datasets, labels } };
  },
  chartDoughnut: (result: any[]): ResponseNeuron => {
    if (!result || !result.length)
      return { type: "line", content: { datasets: [], labels: [] } };

    let labelKey = Object.keys(result[0])[0];
    let labels = result.map((row) => row[labelKey]);
    let dataSetsLength = Object.values(result[0]).length - 1;
    let datasets: any = [...new Array(dataSetsLength)].map(() => ({
      label: "",
      vals: [],
    }));
    for (let row of result) {
      let vals = Object.values(row);
      let keys = Object.keys(row);

      for (let k in vals) {
        let kIndex = parseInt(k);
        if (kIndex == 0) continue;
        let val = vals[kIndex];
        datasets[kIndex - 1].label = keys[k];
        datasets[kIndex - 1].vals.push(val);
      }
    }
    return { type: "doughnut", content: { datasets: datasets, labels } };
  },
});

export default class CronExecutor {
  private crons: any = [];
  private lastCall = null;
  private times = 0;

  constructor() {
    this.getCrons();
    this.loop();
  }
  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  getStatus() {
    return {
      lastCall: this.lastCall,
      times: this.times,
      q: this.crons.length,
    };
  }

  async setCrons(newState: any) {
    for (let index in this.crons) {
      let cron = this.crons[index];
      let newItem = newState.find((item: any) => item.id === cron.id);
      // remove item
      if (!newItem || newItem.cron != cron.cron) {
        this.crons[index].job.stop();
        this.crons.splice(index, 1);
      }
    }

    for (let index in newState) {
      let cron = newState[index];
      let prev = this.crons.find((item: any) => item.id === cron.id);

      if (prev) {
        if (cron.executable != prev.executable) {
          prev.executable = cron.executable;
        }
        continue;
      }

      cron.args = buildArgs({ datasource: cron.datasource });
      cron.job = CronJob.from({
        cronTime: cron.cron,
        onTick: () => CronExecutor.execute(cron),
      });
      cron.job.start();
      this.crons.push(cron);
    }

    this.crons = newState;
  }

  static async execute(cron: any) {
    let content = `
  // declaration of the function
  ${cron.executable}
  fn(args);
  `;
    let d1 = Date.now();
    let response: ResponseNeuron;
    try {
      response = await vm.runInNewContext(
        content,
        {
          console: console,
          args: cron.args,
        },
        {
          displayErrors: false,
          timeout: 200 * 1000,
          breakOnSigint: true,
          contextName: `cron execution ${cron.id} - ${cron.key}`,
          contextCodeGeneration: {
            strings: false,
            wasm: false,
          },
        }
      );
    } catch (err: any) {
      response = {
        type: "exception",
        content: {
          name: "Function Error",
          message: "Unexpected Error",
          sql: err.sql || "",
        },
      };

      if (err instanceof Error) {
        response.content.name = err.name;
        response.content.message = err.message;
      }
      if (response.content.sql) {
        response.content.name = "SQL_ERROR";
      }
    }

    cron.datasource.update({ lastUseAt: Date.now() });
    let timeMs = Date.now() - d1;
    cron.update({
      executions: db.sequelize.literal(`executions + 1`),
      timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
    });

    NeuronExecution.create({
      timeMs,
      dataSourceId: cron.datasource.id,
      neuronId: cron.id,
      businessId: cron.businessId,
      data: null,
      finishAt: Date.now(),
      error: response?.type == "exception" ? response.content?.name : null,
    });
  }

  async getCrons() {
    let queryBuilder = {
      where: {
        cron: { [db.Op.not]: null },
      },
    };
    let cronsDb: any = await Neuron.findAll(queryBuilder);
    for (let index in cronsDb) {
      const datasource = await Datasource.findOne({
        where: {
          businessId: cronsDb[index].businessId,
        },
      });
      cronsDb[index].datasource = datasource;
    }
    this.setCrons(cronsDb);
  }

  async loop() {
    while (true) {
      this.getCrons();
      this.times++;
      await CronExecutor.sleep(60 * 1000);
    }
  }
}
