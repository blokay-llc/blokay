import { NextResponse } from "next/server";
import { transpileModule } from "./ts-js";
import { withNeuron } from "@/lib/withNeuron";
import Models from "@/db/index";

let db = new Models();
const { NeuronLog }: any = db;

export const POST = withNeuron(async function ({ body, neuron, user }: any) {
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
    neuron = await neuron.update(toUpdate);

    NeuronLog.create({
      userId: user.id,
      neuronId: neuron.id,
      businessId: user.businessId,
      filters: neuron.filters,
      synapse: neuron.synapse,
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
