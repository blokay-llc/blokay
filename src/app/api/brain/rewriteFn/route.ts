import { withBlock } from "@/lib/withBlock";
import { NextResponse } from "next/server";
import Models from "@/db/index";
import CoreAPI from "@/app/services/core";
import { transpileModule } from "../updateNeuron/ts-js";

let db = new Models();
const { Neuron, Datasource, Business, NeuronLog }: any = db;

export const POST = withBlock(async function ({ user, block, body }: any) {
  const data = body.data;

  let business = await Business.findById(user.businessId);

  let coreApi = new CoreAPI(business.coreToken);

  const datasource = await Datasource.findOne({
    where: {
      businessId: user.businessId,
    },
  });

  let neurons = await Neuron.findAll({
    where: {
      businessId: block.businessId,
    },
  });

  let fields = block.filters?.fields || [];
  // only send needed data Neuron
  let neuronsList = neurons.map((n: any) => ({
    id: n.id,
    key: n.key,
    description: n.description,
  }));
  let result = await coreApi.getFn(
    block.description,
    block.synapse,
    data.prompt || "",
    fields,
    datasource.structure, // We Only share the database metadata (never your credentials or data)
    neuronsList
  );

  let js = transpileModule(result.synapse);

  if (result) {
    let toUpdate: any = {
      synapse: result.synapse,
      executable: js.code,
      history: [
        ...block.history,
        { type: "user", message: data.prompt },
        { type: "system", message: "Ok" },
      ],
    };
    if (!block.description) {
      toUpdate.description = result.description;
    }
    block = await block.update(toUpdate);

    NeuronLog.create({
      userId: user.id,
      neuronId: block.id,
      businessId: user.businessId,
      filters: block.filters,
      synapse: result.synapse,
    });
  }

  return NextResponse.json({
    data: {
      Result: {
        fn: block.id,
      },
    },
  });
});
