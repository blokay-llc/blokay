import { withView } from "@/lib/withView";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();

const { User, UserPermission, ViewItem }: any = db;

export const POST = withView(async function ({ user, view }: any) {
  // set currentId
  await User.update(
    {
      currentViewId: view.id,
    },
    {
      where: {
        id: user.id,
      },
    }
  );

  let users = await User.findAll({
    where: {
      currentViewId: view.id,
      lastActionAt: { [db.Op.gte]: Date.now() - 5 * 60 * 1000 },
    },
  });

  let sharedUsers: any = [];
  if (user.rol == "admin") {
    let results = await UserPermission.findAll({
      include: [
        {
          model: User,
          required: true,
        },
      ],
      where: {
        viewId: view.id,
      },
    });
    results = results.map((r: any) => r.User);
    results = results.concat(
      await User.findAll({
        where: {
          rol: "admin",
          businessId: user.businessId,
        },
      })
    );

    let mapUsers = results.reduce((ac: any, u: any) => {
      ac[u.id] = {
        id: u.id,
        name: u.name,
      };
      return ac;
    }, {});

    sharedUsers = Object.values(mapUsers);
  }

  let viewItems = await ViewItem.findAll({
    where: {
      viewId: view.id,
    },
  });

  // let children = new Set(
  //   viewItems.filter((vi: any) => vi.neuronId).map((item: any) => item.neuronId)
  // );

  return NextResponse.json({
    data: {
      View: {
        id: view.id,
        slug: view.slug,
        name: view.name,
        icon: view.icon,
        ViewItems: viewItems.map((vItem: any) => ({
          id: vItem.id,
          neuronId: vItem.neuronId,
          options: vItem.options,
          type: vItem.type,
          x: vItem.x,
          y: vItem.y,
          w: vItem.w,
          h: vItem.h,
        })),
        Users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
        })),
        SharedUsers: sharedUsers,
      },
    },
  });
});
