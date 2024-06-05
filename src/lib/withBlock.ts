import { NextResponse } from "next/server";
import { withUser } from "./withUser";
import Models from "@/db/index";

let db = new Models();
const { Neuron }: any = db;

export const withBlock = (cb: any) => {
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

    return await cb({ req, user, block, body });
  });
};
