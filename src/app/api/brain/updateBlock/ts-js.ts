import * as ts from "typescript";
import fs from "fs";
import path from "path";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

export const transpileModule = (code: string): any => {
  let types = fs.readFileSync(
    path.join(serverRuntimeConfig.PROJECT_ROOT, "/src/lib/types.d.ts"),
    {
      encoding: "utf8",
    }
  );

  code = ` ${types.replaceAll("export ", "")} ${code}`;

  let d: any = [];
  let result = ts.transpile(
    code,
    {
      module: ts.ModuleKind.CommonJS,
      noErrorTruncation: false,
      // noEmitHelpers: true,
    },
    undefined,
    d
  );

  let diagnostics = d.map((diagnostic: any) => ({
    messageText: diagnostic.messageText,
  }));

  return { code: result, diagnostics };
};
