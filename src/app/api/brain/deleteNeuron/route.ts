import { NextResponse } from "next/server";
import { withBlock } from "@/lib/withBlock";

export const POST = withBlock(async function ({ block }: any) {
  await block.destroy();
  return NextResponse.json({
    data: {},
  });
});
