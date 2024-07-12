import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";
let db = new Models();
const { View, ViewGroup, ViewItem, UserPermission, Block, User }: any = db;

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();

  let queryBuilder = {
    include: [
      {
        model: User,
        required: false,
      },
      {
        model: ViewGroup,
        required: false,
      },
    ],
    where: {
      businessId: user.businessId,
      workspaceId: body.data.workspaceId,
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

  const blockList = await Block.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  let blocksKeyMap = blockList.reduce((ac: any, item: any) => {
    ac[item.key] = item.id;
    return ac;
  }, {});

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
  });

  const list = result.reduce((ac: any, v: any) => {
    if (!ac[v.viewGroupId]) {
      ac[v.viewGroupId] = {
        id: v.viewGroupId,
        name: v.ViewGroup?.name || null,
        Views: [],
      };
    }

    let children = viewItems
      .filter((vi: any) => vi.viewId == v.id)
      .map((vi: any) => {
        let blockId = vi.blockId || vi?.options?.blockId;
        if (vi?.options?.blockKey) {
          blockId = blocksKeyMap[vi?.options?.blockKey];
        }
        return blockId;
      })
      .filter((blockId: any) => blockId);

    ac[v.viewGroupId].Views.push({
      id: v.id,
      name: v.name,
      icon: v.icon,
      slug: v.slug,
      children,
      User: v.User
        ? {
            id: v.User.id,
            name: v.User.name,
          }
        : null,
    });

    return ac;
  }, {});

  return NextResponse.json({
    data: {
      Views: Object.values(list),
    },
  });
});
