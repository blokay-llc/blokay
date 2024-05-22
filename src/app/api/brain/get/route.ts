import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();

const { Neuron }: any = db;

export const POST = async function (req: NextRequest, res: NextRequest) {
  const body = await req.json();
  let { neuronId, neuronKey } = body.data;

  let queryBuilder: any = {
    where: {},
  };
  if (neuronId) {
    queryBuilder.where.id = neuronId;
  } else if (neuronKey) {
    queryBuilder.where.key = neuronKey;
  }

  let neuron = await Neuron.findOne(queryBuilder);

  if (!neuron) {
    return NextResponse.json(
      {
        data: {
          message: "Icorrect neuron",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: {
      Neuron: {
        id: neuron.id,
        createdAt: neuron.createdAt,
        key: neuron.key,
        description: neuron.description,
        filters: neuron.filters,
      },
    },
  });
};
