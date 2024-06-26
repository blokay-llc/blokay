import { CronJob } from "cron";
import Models from "@/db/index";

import { ResponseNeuron } from "@/lib/types.d";
import { buildArgs } from "../brain/exec/buildParams";
import vm from "node:vm";

let db = new Models();
const { Neuron, Datasource, NeuronExecution }: any = db;

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
