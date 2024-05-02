import { NextResponse } from "next/server";
import Models from "@/db/index";
import CoreAPI from "@/app/services/core";

let db = new Models();
const { User, Business }: any = db;

export async function POST(req: any) {
  const body = await req.json();
  let coreApi = new CoreAPI("");
  let { email, password, companyName, companySize, name } = body.data;

  const currentUser = await User.findByEmail(email);
  if (currentUser) {
    return NextResponse.json(
      {
        error: {
          message: "Exists user",
        },
      },
      { status: 400 }
    );
  }

  let result = await coreApi.newBusiness(name, companyName, companySize, email);

  const business = await Business.create({
    name: companyName,
    coreToken: result.coreToken,
  });

  const user = await User.create({
    name,
    password,
    email,
    businessId: business.id,
    rol: "admin",
  });

  await business.update({
    ownerId: user.id,
  });

  return NextResponse.json({
    data: {},
  });
}
