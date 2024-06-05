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

  let block = await Neuron.findOne(queryBuilder);

  if (!block) {
    return NextResponse.json(
      {
        data: {
          message: "Icorrect block",
        },
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    data: {
      Neuron: {
        id: block.id,
        createdAt: block.createdAt,
        key: block.key,
        description: block.description,
        filters: block.filters,
      },
    },
  });
};
