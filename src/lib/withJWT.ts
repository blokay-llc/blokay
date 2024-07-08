import { NextRequest, NextResponse } from "next/server";
import Models from "@/db/index";
import jwt from "jsonwebtoken";
let db = new Models();
const { Business }: any = db;

export function decodeJWT(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

export const withJWT = (cb: any) => {
  return async function (req: NextRequest, res: NextRequest) {
    const body = await req.json();

    let token = body._token;
    if (!token) {
      return NextResponse.json(
        {
          data: {
            message: "JWT is required",
          },
        },
        { status: 401 }
      );
    }
    let {
      businessId,
      data: { ...session },
    } = decodeJWT(token);

    if (!businessId) {
      return NextResponse.json(
        {
          data: {
            message: "You must be loggin",
          },
        },
        { status: 401 }
      );
    }

    let business = await Business.findOne({
      where: {
        id: businessId,
      },
    });
    try {
      console.log(business.coreToken, token);
      jwt.verify(token, business.coreToken);
    } catch (err) {
      return NextResponse.json(
        {
          data: {
            message: "Invalid json web token",
          },
        },
        { status: 401 }
      );
    }

    return await cb({ business, body, session });
  };
};
