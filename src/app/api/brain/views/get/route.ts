import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();

const { View, User }: any = db;

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
      },
    },
  });
});
