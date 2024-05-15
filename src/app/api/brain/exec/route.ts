import { NextResponse } from "next/server";
import Models from "@/db/index";
import { Args, ResponseNeuron } from "@/lib/types.d";
import { withNeuron } from "@/lib/withNeuron";
import vm from "node:vm";
import { buildRequest, buildResponse } from "./buildParams";

let db = new Models();

const { Datasource, NeuronExecution }: any = db;

export const POST = withNeuron(async function ({ user, neuron, body }: any) {
  let { form } = body.data;

  let d1 = Date.now();
  const datasource = await Datasource.findOne({
    where: {
      businessId: user.businessId,
    },
  });

  let content = `
  // declaration of the function
  ${neuron.executable}

  if (fn.length == 1) {
    fn(args);
  } else if (fn.length == 2) {
    fn(req, res);
  }
  `;

  let response: ResponseNeuron;
  try {
    let req = buildRequest({ user, form, datasource });
    let res = buildResponse({ user, form, datasource });
    response = await vm.runInNewContext(
      content,
      {
        console: console,
        req,
        res,
        args: {
          ...req,
          ...res,
        } as Args,
      },
      {
        displayErrors: false,
        timeout: 200 * 1000,
        breakOnSigint: true,
        contextName: `neuron execution ${neuron.id} - ${neuron.key}`,
        contextCodeGeneration: {
          strings: false,
          wasm: false,
        },
      }
    );
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

  /*
  if (format == "excel" && responseNeuron.content.type == "table") {
    let content = responseNeuron.content.content;
    let dataExcel = [
      content.header,
      ...content.data.map((row) =>
        row.map((col) => {
          let val = null;
          if (typeof col == "string" || typeof col == "number") {
            val = col;
          } else if (col?.text || col?.type) {
            val = col.text;
          } else {
            console.log("TYPE not defined EXCEL GENERATION", col);
          }
          return val;
        })
      ),
    ];

    let worksheet = XLSX.utils.aoa_to_sheet(dataExcel);
    let workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

    const buf = XLSX.write(workbook, { type: "buffer" });
    res.writeHead(200, {
      "Content-Type": "application/vnd.ms-excel",
      "Content-disposition": `attachment;filename=${encodeURIComponent(
        neuron.description
      )}.xlsx`,
      "Content-Length": buf.length,
    });
    return res.end(Buffer.from(buf, "binary"));
  }
*/
  datasource.update({ lastUseAt: Date.now() });
  let timeMs = Date.now() - d1;
  neuron.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  NeuronExecution.create({
    timeMs,
    userId: user.id,
    dataSourceId: datasource.id,
    neuronId: neuron.id,
    businessId: user.businessId,
    data: form,
    finishAt: Date.now(),
    error: response?.type == "exception" ? response.content?.name : null,
  });

  return NextResponse.json({
    data: {
      response,
    },
  });
});
