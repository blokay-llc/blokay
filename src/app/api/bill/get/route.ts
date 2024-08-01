import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";

let db = new Models();

export const POST = withUser(async function ({ user, req }: any) {
  let body = await req.body();

  const bill = await db.Bill.findOne({
    where: {
      id: body.billId,
      businessId: user.businessId,
    },
  });

  const details = await bill.getDetailsByKeys([
    "BLOCK_EXECUTIONS",
    "BLOCK_TIME",
    "NETWORK_INPUT",
    "NETWORK_OUTPUT",
    "USERS",
  ]);

  return NextResponse.json({
    data: {
      Bill: {
        billId: bill.id,
        blockUsage: details.BLOCK_EXECUTIONS?.value || 0,
        Details: details,
      },
    },
  });
});
