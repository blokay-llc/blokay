import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();

const { Block }: any = db;

export const POST = async function (req: NextRequest, res: NextRequest) {
  const body = await req.json();
  let { blockId, blockKey } = body.data;

  let queryBuilder: any = {
    where: {},
  };
  if (blockId) {
    queryBuilder.where.id = blockId;
  } else if (blockKey) {
    queryBuilder.where.key = blockKey;
  }

  let block = await Block.findOne(queryBuilder);

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
      Block: {
        id: block.id,
        createdAt: block.createdAt,
        key: block.key,
        description: block.description,
        filters: block.filters,
      },
    },
  });
};
