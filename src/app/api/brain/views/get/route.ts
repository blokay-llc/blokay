import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();

const { View, User, UserPermission }: any = db;

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();

  let { slug } = body.data;

  const view = await View.findOne({
    where: {
      businessId: user.businessId,
      slug,
    },
  });

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

    sharedUsers = results.map((u: any) => ({
      id: u.id,
      name: u.name,
    }));
  }

  return NextResponse.json({
    data: {
      View: {
        id: view.id,
        slug: view.slug,
        name: view.name,
        icon: view.icon,
        layout: view.layout,
        Users: users.map((user: any) => ({
          id: user.id,
          name: user.name,
        })),
        SharedUsers: sharedUsers,
      },
    },
  });
});
