import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";

let db = new Models();

export const POST = withUser(async function ({ user }: any) {
  const bills = await db.Bill.findAll({
    where: {
      businessId: user.businessId,
    },
    order: [["startBillingCycle", "DESC"]],
  });

  let rows = bills.map((bill: any) => ({
    id: bill.id,
    startBillingCycle: bill.startBillingCycle,
    endBillingCycle: bill.endBillingCycle,
    amount: bill.amount,
    paid: bill.paid,
    number: bill.number,
  }));

  return NextResponse.json({
    data: {
      Bills: rows,
    },
  });
});
