import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";
let db = new Models();
const { View, ViewGroup, UserPermission }: any = db;

export const POST = withUser(async function ({ req, user }: any) {
  let queryBuilder = {
    include: [
      {
        model: ViewGroup,
        required: false,
      },
    ],
    where: {
      businessId: user.businessId,
    },
  };
  let result = await View.findAll(queryBuilder);

  if (user.rol !== "admin") {
    let queryBuilderPermissions = {
      where: {
        userId: user.id,
      },
    };
    const permissions = await UserPermission.findAll(queryBuilderPermissions);
    const permissionsMap = permissions.reduce((acc: any, permission: any) => {
      acc[permission.viewId] = permission;
      return acc;
    }, {});

    result = result.filter((view: any) => permissionsMap[view.id]);
  }

  const list = result.reduce((ac: any, n: any) => {
    if (!ac[n.viewGroupId]) {
      ac[n.viewGroupId] = {
        id: n.viewGroupId,
        name: n.ViewGroup?.name || null,
        Views: [],
      };
    }
    ac[n.viewGroupId].Views.push({
      id: n.id,
      name: n.name,
      icon: n.icon,
      slug: n.slug,
      children: n.layout.map((n: any) => n.i),
    });

    return ac;
  }, {});

  return NextResponse.json({
    data: {
      Views: Object.values(list),
    },
  });
});
