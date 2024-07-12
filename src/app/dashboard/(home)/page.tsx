import { redirect } from "next/navigation";

async function getDefaultWorkspace() {
  return 2;
}

export default async function Home() {
  const workspace = await getDefaultWorkspace();
  if (workspace) {
    redirect("/dashboard/" + workspace);
  }
}
