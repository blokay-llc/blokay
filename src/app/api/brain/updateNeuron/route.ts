import { NextResponse } from "next/server";
import { transpileModule } from "./ts-js";
import { withNeuron } from "@/lib/withNeuron";

export const POST = withNeuron(async function ({ req, neuron }: any) {
  const body = await req.json();
  const data = body.data;

  let js = transpileModule(data.synapse);

  let toUpdate: any = {};
  if (js.diagnostics.length == 0) {
    toUpdate.synapse = data.synapse;
    toUpdate.executable = js.code;
  }

  if (data.filters) {
    toUpdate.filters = data.filters;
  }
  if (data.description) {
    toUpdate.description = data.description;
  }
  if (Object.keys(toUpdate).length > 0) {
    neuron = await neuron.update(toUpdate);
  }
  return NextResponse.json({
    data: {
      Result: {
        diagnostics: js.diagnostics,
      },
    },
  });
});
