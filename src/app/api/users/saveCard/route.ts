import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import CoreAPI from "@/app/services/core";
import Models from "@/db/index";

let db = new Models();
const { Business }: any = db;

export const POST = withUser(async function ({ user, req }: any) {
  const body = await req.json();

  /*
    We don't save your credit cards in our database. Instead, we tokenize your cards using an external service, and we only send the token.
  */
  let { token, lastFour } = body.data;

  let business = await Business.findOne({ where: { id: user.businessId } });

  let coreApi = new CoreAPI(business.coreToken);

  await coreApi.saveCard(token, lastFour, user.email);

  await business.update({
    paymentProviderToken: token,
  });

  return NextResponse.json({
    data: {},
  });
});
