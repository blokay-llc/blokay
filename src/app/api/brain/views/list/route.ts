import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withUser } from "@/lib/withUser";
let db = new Models();
const { View, ViewGroup, ViewItem, UserPermission, Neuron }: any = db;

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

  const neuronList = await Neuron.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  let neuronsKeyMap = neuronList.reduce((ac: any, item: any) => {
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
        let neuronId = vi.neuronId || vi?.options?.neuronId;
        if (vi?.options?.neuronKey) {
          neuronId = neuronsKeyMap[vi?.options?.neuronKey];
        }
        return neuronId;
      })
      .filter((neuronId: any) => neuronId);

    ac[v.viewGroupId].Views.push({
      id: v.id,
      name: v.name,
      icon: v.icon,
      slug: v.slug,
      children,
    });

    return ac;
  }, {});

  return NextResponse.json({
    data: {
      Views: Object.values(list),
    },
  });
});
