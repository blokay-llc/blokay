import { NextResponse } from "next/server";
import { withUser } from "./withUser";
import Models from "@/db/index";

let db = new Models();
const { Neuron }: any = db;

export const withNeuron = (cb: any) => {
  return withUser(async function ({ req, user }: any) {
    const body = await req.json();

    let { neuronId, neuronKey } = body.data;

    let queryBuilder: any = {
      where: {
        businessId: user.businessId,
      },
    };
    if (neuronId) {
      queryBuilder.where.id = neuronId;
    }

    if (neuronKey) {
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

    return await cb({ req, user, neuron, body });
  });
};
