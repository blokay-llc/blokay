import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { User }: any = db;

export const POST = withAdmin(async function ({ user }: any) {
  const result = await User.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  const list = result.map((n: any) => ({
    id: n.id,
    name: n.name,
    image: n.image,
    email: n.email,
    rol: n.rol,
  }));

  return NextResponse.json({
    data: {
      Users: list,
    },
  });
});
