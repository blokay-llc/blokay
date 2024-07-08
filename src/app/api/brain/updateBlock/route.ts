import { NextResponse } from "next/server";
import { transpileModule } from "./ts-js";
import { withBlock } from "@/lib/withBlock";
import Models from "@/db/index";

let db = new Models();
const { BlockLog }: any = db;

export const POST = withBlock(async function ({ body, block, user }: any) {
  const data = body.data;

  let js = transpileModule(data.synapse);

  let toUpdate: any = {};
  if (js.diagnostics.length == 0) {
    toUpdate.synapse = data.synapse;
    toUpdate.executable = js.code;
  }

  if (data.type) {
    toUpdate.type = data.type;
  }
  if (data.cron) {
    toUpdate.cron = data.cron;
  }
  if (data.filters) {
    toUpdate.filters = data.filters;
  }
  if (data.description) {
    toUpdate.description = data.description;
  }
  if (Object.keys(toUpdate).length > 0) {
    block = await block.update(toUpdate);

    BlockLog.create({
      userId: user.id,
      blockId: block.id,
      businessId: user.businessId,
      filters: block.filters,
      synapse: block.synapse,
    });
  }
  return NextResponse.json({
    data: {
      Result: {
        diagnostics: js.diagnostics,
      },
    },
  });
});
