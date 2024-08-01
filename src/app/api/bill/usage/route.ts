import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";

let db = new Models();

export const POST = withUser(async function ({ user }: any) {
  const business = await db.Business.findOne({
    where: {
      id: user.businessId,
    },
  });
  const bill = await business.getBill();

  const details = await bill.getDetailsByKeys([
    "BLOCK_EXECUTIONS",
    "BLOCK_TIME",
    "NETWORK_INPUT",
    "NETWORK_OUTPUT",
    "USERS",
  ]);

  return NextResponse.json({
    data: {
      billId: bill.id,
      planName: business.plan,
      blockUsage: details.BLOCK_EXECUTIONS?.value || 0,
      blockUsageLimit: business.blockUsageLimit,
      Details: details,
    },
  });
});
