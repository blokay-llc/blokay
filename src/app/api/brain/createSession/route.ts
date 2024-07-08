import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";
import { callContext } from "../exec/callContext";
import jwt from "jsonwebtoken";

let db = new Models();

const { Datasource, BlockExecution, Block, Business }: any = db;

export const POST = async function (req: NextRequest, res: NextRequest) {
  const body = await req.json();

  let { businessId, form } = body.data;

  let block = await Block.getSessionBlock(businessId);

  if (!block) {
    return NextResponse.json(
      {
        data: {
          message: "This workspaces does not have a createSession function",
        },
      },
      { status: 400 }
    );
  }

  let business = await Business.findById(businessId);
  let d1 = Date.now();

  const datasource = await Datasource.findOne({
    where: {
      businessId: business.id,
    },
  });

  let response = await callContext(block, null, form, datasource);
  if (!response?.content) {
    return NextResponse.json(
      {
        data: {
          message: "This block has not been implemented yet",
        },
      },
      { status: 400 }
    );
  }

  datasource.update({ lastUseAt: Date.now() });
  let timeMs = Date.now() - d1;
  block.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  BlockExecution.create({
    timeMs,
    userId: null,
    dataSourceId: datasource.id,
    BlockId: block.id,
    businessId: businessId,
    data: form,
    finishAt: Date.now(),
    error: response?.type == "exception" ? response.content?.name : null,
  });

  let jwtToken = jwt.sign(
    {
      data: response?.content,
      businessId,
    },
    business.coreToken,
    {}
  );

  return NextResponse.json({
    data: {
      content: response?.content,
      jwtToken,
    },
  });
};
