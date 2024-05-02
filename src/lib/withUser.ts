import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import Models from "@/db/index";
let db = new Models();
const { User }: any = db;

export const withUser = (cb: any) => {
  return async function (req: any, res: any) {
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
    await User.update(
      {
        lastActionAt: Date.now(),
      },
      {
        where: {
          id: user.id,
        },
        order: [["lastActionAt", "DESC"]],
        limit: 3,
      }
    );
    return await cb({ req, user: user });
  };
};
