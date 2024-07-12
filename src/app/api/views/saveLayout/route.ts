import { NextResponse } from "next/server";
import { withView } from "@/lib/withView";
import Models from "@/db/index";

let db = new Models();
const { ViewItem }: any = db;

export const POST = withView(async function ({ body, view }: any) {
  const data = body.data;

  for (let itemLayout of data.layout) {
    let id = itemLayout.id || itemLayout.i;
    if (!id) {
      continue;
    }
    let item = await ViewItem.findOne({
      where: {
        viewId: view.id,
        id,
      },
    });

    // to create
    if (!item) {
      item = await ViewItem.create({
        viewId: view.id,
        id,
        blockId: itemLayout.blockId || null,
        type: itemLayout.type,
      });
    }

    let toUpdate: any = {};
    if (item.x != itemLayout.x) {
      toUpdate.x = itemLayout.x;
    }
    if (item.y != itemLayout.y) {
      toUpdate.y = itemLayout.y;
    }
    if (item.w != itemLayout.w) {
      toUpdate.w = itemLayout.w;
    }
    if (item.h != itemLayout.h) {
      toUpdate.h = itemLayout.h;
    }

    if (Object.values(toUpdate).length > 0) {
      await item.update(toUpdate);
    }
  }

  return NextResponse.json({});
});
