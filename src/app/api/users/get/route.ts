import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { User, UserPermission }: any = db;

export const POST = withUser(async function ({ user, req }: any) {
  const body = await req.json();

  const result = await User.findOne({
    where: {
      id: body.data.userId,
      businessId: user.businessId,
    },
  });

  let permissionsDb = await UserPermission.findAll({
    where: {
      userId: result.id,
    },
  });
  let permissions = permissionsDb.reduce((acc: any, permission: any) => {
    acc[permission.viewId] = true;
    return acc;
  }, {});

  const userMap = {
    id: result.id,
    name: result.name,
    email: result.email,
    rol: result.rol,
    permissions,
  };

  return NextResponse.json({
    data: {
      User: userMap,
    },
  });
});
