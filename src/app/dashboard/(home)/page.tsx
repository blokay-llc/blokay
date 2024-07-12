import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/auth";
import { redirect } from "next/navigation";
import Models from "@/db/index";

let db = new Models();
const { Workspace }: any = db;
async function getDefaultWorkspaceId() {
  const session: any = await getServerSession(authOptions);

  let workspace = await Workspace.findOne({
    where: {
      businessId: session?.business?.id,
    },
  });
  return workspace.id;
}

export default async function Home() {
  const workspace = await getDefaultWorkspaceId();
  if (workspace) {
    redirect("/dashboard/" + workspace);
  }
}
