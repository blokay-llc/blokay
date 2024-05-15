import { NextResponse } from "next/server";
import Models from "@/db/index";
import CronExecutor from "./cron-executor";
let db = new Models();
let cronExecutor = new CronExecutor();
const { User, UserPermission, View }: any = db;

export const GET = async function ({ user }: any) {
  return NextResponse.json({
    data: cronExecutor.getStatus(),
  });
};
