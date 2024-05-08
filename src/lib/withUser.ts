import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/auth";
import { getServerSession } from "next-auth/next";
import Models from "@/db/index";
let db = new Models();
const { User }: any = db;

export const withUser = (cb: any) => {
  return async function (req: NextRequest, res: NextRequest) {
    const { user }: any = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json(
        {
          data: {
            message: "You must be loggin",
          },
        },
        { status: 401 }
      );
    }

    // set lastActionAt
    User.update(
      {
        lastActionAt: Date.now(),
      },
      {
        where: {
          id: user.id,
        },
        order: [["lastActionAt", "DESC"]],
        limit: 1,
      }
    );
    return await cb({ req, user: user });
  };
};

export const withAdmin = (cb: any) => {
  return withUser(async function ({ req, user }: any) {
    if (user.rol != "admin") {
      return NextResponse.json(
        {
          data: {
            message: "Icorrect rol",
          },
        },
        { status: 401 }
      );
    }

    return await cb({ req, user });
  });
};
