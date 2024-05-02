import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Datasource }: any = db;

export const POST = withAdmin(async function ({ req, user }: any) {
  const body = await req.json();

  await Datasource.create({
    type: body.data.type,
    name: body.data.name,
    businessId: user.businessId,
    config: {
      database: body.data.config,
    },
  });

  return NextResponse.json({
    data: {},
  });
});
