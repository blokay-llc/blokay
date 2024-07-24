import { CronJob } from "cron";
import Models from "@/db/index";

import { BlockResponse } from "@/lib/types.d";
import { buildArgs } from "../brain/exec/buildParams";
import vm from "node:vm";

let db = new Models();
const { Block, Datasource, BlockExecution }: any = db;

export default class CronExecutor {
  private crons: any = [];
  private lastCall: number | null = null;
  private times = 0;

  constructor() {
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
      let newItem = newState.find(
        (item: any) => item.id === this.crons[index].id
      );
      // remove item
      if (
        this.crons[index] &&
        (!newItem || newItem.cron != this.crons[index].cron)
      ) {
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
        onTick: () => {
          this.lastCall = Date.now();
          CronExecutor.execute(cron);
        },
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
    let response: BlockResponse;
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

    BlockExecution.create({
      timeMs,
      dataSourceId: cron.datasource.id,
      blockId: cron.id,
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
    let cronsDb: any = await Block.findAll(queryBuilder);
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
