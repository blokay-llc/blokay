import { NextResponse } from "next/server";
import { withView } from "@/lib/withView";
import Models from "@/db/index";

let db = new Models();
const { ViewItem }: any = db;

export const POST = withView(async function ({ body, view }: any) {
  const data = body.data;

  for (let itemLayout of data.layout) {
    let item = await ViewItem.findOne({
      where: {
        viewId: view.id,
        id: itemLayout.i || itemLayout.id,
      },
    });

    // to create
    if (!item) {
      item = await ViewItem.create({
        viewId: view.id,
        id: itemLayout.id,
        neuronId: itemLayout.neuronId || null,
        type: itemLayout.type,
      });
    }
    await item.update({
      x: itemLayout.x,
      y: itemLayout.y,
      w: itemLayout.w,
      h: itemLayout.h,
    });
  }

  return NextResponse.json({});
});
