import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withJWT } from "@/lib/withJWT";
import { callContext } from "./callContext";
import XLSX from "xlsx";

let db = new Models();

const { Datasource, NeuronExecution, Neuron }: any = db;

export const POST = withJWT(async function ({ business, session, body }: any) {
  let { format } = body;
  let { neuronId, neuronKey } = body.data;

  let queryBuilder: any = {
    where: {
      businessId: business.id,
    },
  };
  if (neuronId) {
    queryBuilder.where.id = neuronId;
  } else if (neuronKey) {
    queryBuilder.where.key = neuronKey;
  }

  let neuron = await Neuron.findOne(queryBuilder);

  if (!neuron) {
    return NextResponse.json(
      {
        data: {
          message: "Icorrect neuron",
        },
      },
      { status: 400 }
    );
  }

  let { form } = body.data;

  let d1 = Date.now();

  const datasource = await Datasource.findOne({
    where: {
      businessId: business.id,
    },
  });

  let response = await callContext(neuron, session, form, datasource);

  if (format == "excel" && response?.type == "table") {
    let content = response.content;
    let dataExcel = [
      content.header,
      ...content.data.map((row: any) =>
        row.map((col: any) => {
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

    const nextResponse: any = new NextResponse(buf);
    nextResponse.headers.set("content-type", "application/vnd.ms-excel");
    nextResponse.headers.set("content-Length", buf.length);
    nextResponse.headers.set(
      "Content-disposition",
      `attachment;filename=${encodeURIComponent(neuron.description)}.xlsx`
    );
    return nextResponse;
  }

  datasource.update({ lastUseAt: Date.now() });
  let timeMs = Date.now() - d1;
  neuron.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  NeuronExecution.create({
    timeMs,
    userId: session.id || session.userId || null,
    dataSourceId: datasource.id,
    neuronId: neuron.id,
    businessId: business.id,
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
