import { NextResponse } from "next/server";
import CronExecutor from "./cron-executor";
let cronExecutor = new CronExecutor();

export const GET = async function ({}: any) {
  return NextResponse.json({
    data: cronExecutor.getStatus(),
  });
};
