import { NextResponse } from "next/server";
import CronExecutor from "./cron-executor";
let cronExecutor = new CronExecutor();

export const revalidate = 0;
export const dynamic = "force-dynamic";

export const GET = async function ({}: any) {
  return NextResponse.json({
    data: cronExecutor.getStatus(),
  });
};
