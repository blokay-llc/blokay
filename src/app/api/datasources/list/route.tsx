import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Datasource }: any = db;

export const POST = withAdmin(async function ({ req, user }: any) {
  const body = await req.json();
  const data = body.data;

  const result = await Datasource.findAll({
    where: {
      businessId: user.businessId,
      workspaceId: data.workspaceId,
    },
  });

  const list = result.map((n: any) => ({
    id: n.id,
    type: n.type,
    name: n.name,
    config: n.config,
    lastUseAt: n.lastUseAt,
  }));

  return NextResponse.json({
    data: {
      Datasource: list,
    },
  });
});
