import { NextResponse } from "next/server";
import { withUser } from "./withUser";
import Models from "@/db/index";

let db = new Models();
const { Block }: any = db;

export const withBlock = (cb: any) => {
  return withUser(async function ({ req, user }: any) {
    const body = await req.json();

    let { blockId, blockKey, block: blockName } = body.data;

    let queryBuilder: any = {
      where: {
        businessId: user.businessId,
      },
    };
    if (blockId) {
      queryBuilder.where.id = blockId;
    } else if (blockKey) {
      queryBuilder.where.key = blockKey;
    } else if (blockName) {
      queryBuilder.where.key = blockName;
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

    return await cb({ req, user, block, body });
  });
};
