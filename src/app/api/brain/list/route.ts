import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Neuron }: any = db;

export const POST = withUser(async function ({ req, user }: any) {
  const result = await Neuron.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  const list = result.map((n: any) => ({
    id: n.id,
    key: n.key,
    description: n.description,
    icon: n.icon,
    parentId: n.parentId,
  }));

  return NextResponse.json({
    data: {
      Neurons: list,
    },
  });
});
