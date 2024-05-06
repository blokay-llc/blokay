import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";
let db = new Models();
const { View, ViewGroup, ViewItem, UserPermission }: any = db;

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

  const viewItems = await ViewItem.findAll({
    include: [
      {
        model: View,
        required: true,
        where: {
          businessId: user.businessId,
        },
      },
    ],
    where: {
      neuronId: { [db.Op.not]: null },
    },
  });

  const list = result.reduce((ac: any, v: any) => {
    if (!ac[v.viewGroupId]) {
      ac[v.viewGroupId] = {
        id: v.viewGroupId,
        name: v.ViewGroup?.name || null,
        Views: [],
      };
    }
    ac[v.viewGroupId].Views.push({
      id: v.id,
      name: v.name,
      icon: v.icon,
      slug: v.slug,
      children: viewItems
        .filter((vi: any) => vi.viewId == v.id)
        .map((n: any) => n.neuronId),
    });

    return ac;
  }, {});

  return NextResponse.json({
    data: {
      Views: Object.values(list),
    },
  });
});
