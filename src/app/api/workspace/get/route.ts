import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";
let db = new Models();
const { Workspace }: any = db;

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();

  let queryBuilder = {
    where: {
      businessId: user.businessId,
    },
  };
  let result = await Workspace.findAll(queryBuilder);

  let list = result.map((w: any) => ({ id: w.id, name: w.name, slug: w.slug }));
  let current = result.find((w: any) => w.id == body.data.workspaceId);

  return NextResponse.json({
    data: {
      CurrentWorkspace: current
        ? {
            id: current.id,
            name: current.name,
            slug: current.slug,
          }
        : null,
      Workspaces: list,
    },
  });
});
