import { NextResponse } from "next/server";
import Models from "@/db/index";
import { withJWT } from "@/lib/withJWT";
import { callContext } from "./callContext";
import * as XLSX from "xlsx";

let db = new Models();

const { Datasource, BlockExecution, Block }: any = db;

export const POST = withJWT(async function ({ business, session, body }: any) {
  let { format } = body;
  let { blockId, blockKey } = body.data;

  let queryBuilder: any = {
    where: {
      businessId: business.id,
    },
  };
  if (blockId) {
    queryBuilder.where.id = blockId;
  } else if (blockKey) {
    queryBuilder.where.key = blockKey;
  }

  let block = await Block.findOne(queryBuilder);

  if (!block) {
    return NextResponse.json(
      {
        data: {
          message: "Icorrect block",
        },
      },
      { status: 400 }
    );
  }

  let { form } = body.data;

  let d1 = Date.now();

  const datasources = await Datasource.findAll({
    where: {
      businessId: business.id,
      workspaceId: block.workspaceId,
    },
  });

  let response = await callContext(block, session, form, datasources);

  // if (datasource) {
  //   datasource.update({ lastUseAt: Date.now() });
  // }
  let timeMs = Date.now() - d1;
  block.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  BlockExecution.create({
    timeMs,
    userId: session.id || session.userId || null,
    // dataSourceId: datasource?.id,
    blockId: block.id,
    businessId: business.id,
    data: form,
    finishAt: Date.now(),
    error: response?.type == "exception" ? response.content?.name : null,
    inputSize: Buffer.byteLength(JSON.stringify(form)),
    outputSize: Buffer.byteLength(JSON.stringify(response)),
  });

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
            val = col.text || "";
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
      `attachment;filename=${encodeURIComponent(block.description)}.xlsx`
    );
    return nextResponse;
  }

  return NextResponse.json({
    data: {
      response,
    },
  });
});
