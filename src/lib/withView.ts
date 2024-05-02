import { NextResponse } from "next/server";
import { withUser } from "./withUser";
import Models from "@/db/index";

let db = new Models();
const { View, UserPermission }: any = db;

export const withView = (cb: any) => {
  return withUser(async function ({ req, user }: any) {
    const body = await req.json();

    let { slug } = body.data;

    const view = await View.findOne({
      where: {
        businessId: user.businessId,
        slug,
      },
    });

    if (!view) {
      return NextResponse.json(
        {
          data: {
            message: "Icorrect view",
          },
        },
        { status: 400 }
      );
    }

    // check if the user has the permission
    if (user.rol != "admin") {
      let queryBuilderPermissions = {
        where: {
          userId: user.id,
          viewId: view.id,
        },
      };
      const permission = await UserPermission.findOne(queryBuilderPermissions);
      if (!permission) {
        return NextResponse.json(
          {
            data: {
              message: "You don't have the permission",
            },
          },
          { status: 400 }
        );
      }
    }
    return await cb({ req, user, view });
  });
};
