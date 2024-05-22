import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";
import { callContext } from "../exec/callContext";
import jwt from "jsonwebtoken";

let db = new Models();

const { Datasource, NeuronExecution, Neuron, Business }: any = db;

export const POST = async function (req: NextRequest, res: NextRequest) {
  const body = await req.json();

  let { businessId, form } = body.data;

  let neuron = await Neuron.getSessionNeuron(businessId);

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

  let business = await Business.findById(businessId);
  let d1 = Date.now();

  const datasource = await Datasource.findOne({
    where: {
      businessId: business.id,
    },
  });

  let response = await callContext(neuron, null, form, datasource);
  if (response?.content) {
    return NextResponse.json(
      {
        data: {
          message: "This block has not been implemented yet",
        },
      },
      { status: 400 }
    );
  }

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

  let jwtToken = jwt.sign(
    {
      data: response?.content,
    },
    business.coreToken,
    { expiresIn: "1h" }
  );

  return NextResponse.json({
    data: {
      content: response?.content,
      jwtToken,
    },
  });
};
