import { NextResponse } from "next/server";
import { withView } from "@/lib/withView";

export const POST = withView(async function ({ body, view }: any) {
  const data = body.data;

  const toUpdate: any = {};

  if (data.name) {
    toUpdate.name = data.name;
  }

  view.update(toUpdate);
  return NextResponse.json({});
});
