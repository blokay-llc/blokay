import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import CoreAPI from "@/app/services/core";

export const POST = withUser(async function ({ user, body }: any) {
  /*
    We don't save your credit cards in our database. Instead, we tokenize your cards using an external service, and we only send the token.
  */
  let { token, lastFour } = body.data;

  let business = await user.getBusiness();

  let coreApi = new CoreAPI(business.coreToken);

  await coreApi.saveCard(token, lastFour);

  return NextResponse.json({
    data: {},
  });
});
