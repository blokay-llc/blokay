import { NextResponse } from "next/server";
import { withView } from "@/lib/withView";
import Models from "@/db/index";

let db = new Models();
const { ViewItem }: any = db;

export const POST = withView(async function ({ body, view }: any) {
  const data = body.data;

  let item = await ViewItem.findOne({
    where: {
      viewId: view.id,
      id: data.viewItemId,
    },
  });

  item.destroy();

  return NextResponse.json({});
});
