import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";
import { withJWT } from "@/lib/withJWT";
import { callContext } from "../exec/callContext";

let db = new Models();

const { Datasource, NeuronExecution, Neuron }: any = db;

export const POST = async function (req: NextRequest, res: NextRequest) {
  const body = await req.json();

  let { businessId } = body.data;

  let queryBuilder: any = {
    where: {
      businessId: businessId,
      key: "createSession",
    },
  };

  let neuron = await Neuron.findOne(queryBuilder);

  if (!neuron) {
    return NextResponse.json(
      {
        data: {
          message: "This workspaces does not have a createSession function",
        },
      },
      { status: 400 }
    );
  }

  let { form } = body.data;

  let d1 = Date.now();

  const datasource = await Datasource.findOne({
    where: {
      businessId: businessId,
    },
  });

  let response = await callContext(neuron, null, form, datasource);

  datasource.update({ lastUseAt: Date.now() });
  let timeMs = Date.now() - d1;
  neuron.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  NeuronExecution.create({
    timeMs,
    userId: null,
    dataSourceId: datasource.id,
    neuronId: neuron.id,
    businessId: businessId,
    data: form,
    finishAt: Date.now(),
    error: response?.type == "exception" ? response.content?.name : null,
  });

  return NextResponse.json({
    data: {
      response,
    },
  });
};
