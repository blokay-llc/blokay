import { Args, ResponseNeuron } from "@/lib/types.d";
import vm from "node:vm";
import { buildRequest, buildResponse } from "./buildParams";

export async function callContext(
  block: any,
  session: any,
  form: any,
  datasource: any
): Promise<ResponseNeuron> {
  let content = `
    // declaration of the function
    ${block.executable}
  
    if (fn.length == 1) {
      fn(args);
    } else if (fn.length == 2) {
      fn(req, res);
    }
    `;

  let response: ResponseNeuron;
  try {
    let req = buildRequest({ session, form, datasource });
    let res = buildResponse({ session, form, datasource });

    const contextifiedObject = vm.createContext({
      console: console,
      req,
      res,
      args: {
        ...req,
        ...res,
      } as Args,
    });

    response = await vm.runInNewContext(content, contextifiedObject, {
      displayErrors: false,
      timeout: 200 * 1000,
      breakOnSigint: true,
      contextName: `block execution ${block?.id} - ${block?.key}`,
      contextCodeGeneration: {
        strings: false,
        wasm: false,
      },
    });
  } catch (err: any) {
    response = {
      type: "exception",
      content: {
        name: "Function Error",
        message: "Unexpected Error",
        sql: err.sql || "",
      },
    };

    if (err instanceof Error) {
      response.content.name = err.name;
      response.content.message = err.message;
    }
    if (response.content.sql) {
      response.content.name = "SQL_ERROR";
    }
  }

  return response;
}
