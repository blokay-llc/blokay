import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const GET = async function (req: NextRequest, res: NextResponse) {
  let types = fs.readFileSync(
    path.join(serverRuntimeConfig.PROJECT_ROOT, "/src/lib/types.d.ts"),
    {
      encoding: "utf8",
    }
  );
  const response = new NextResponse(types);
  return response;
};
