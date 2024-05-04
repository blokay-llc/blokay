import { NextResponse } from "next/server";
import fetch from "node-fetch";
import Models from "@/db/index";
import { getConnection } from "@/db/connection";
import { withNeuron } from "@/lib/withNeuron";
let db = new Models();

const { Datasource, NeuronExecution }: any = db;

type ResponseNeuron = {
  type: string;
  content: any;
};

export const POST = withNeuron(async function ({
  req,
  user,
  neuron,
  body,
}: any) {
  let { form } = body.data;

  let d1 = Date.now();
  // find by type
  const datasource = await Datasource.findOne({
    where: {
      businessId: user.businessId,
    },
  });
  datasource.update({ lastUseAt: Date.now() });

  const dataLog = {
    userId: user.id,
    dataSourceId: datasource.id,
    neuronId: neuron.id,
    businessId: user.businessId,
    data: JSON.stringify(form),
    finishAt: null,
  };
  let neuronLog = await NeuronExecution.create(dataLog);

  const args = {
    response: {},
    files: req.files,
    form: form,
    query: async (sql: string, replacements = {}) => {
      const conn: any = await getConnection(db, datasource, "read");
      return await conn.query(sql, { replacements, type: "SELECT" });
    },

    fetch: async (endpoint: string, opts = {}) => {
      let response = await fetch(endpoint, opts);
      return await response.json();
    },
    insert: async (sql: string, replacements = {}) => {
      const conn: any = await getConnection(db, datasource, "write");
      return await conn.query(sql, { replacements, type: "INSERT" });
    },
    update: async (sql: string, replacements = {}) => {
      const conn: any = await getConnection(db, datasource, "write");
      return await conn.query(sql, { replacements, type: "UPDATE" });
    },
    find: async (sql: string, replacements = {}) => {
      const conn: any = await getConnection(db, datasource, "read");
      let rows = await conn.query(sql, { replacements, type: "SELECT" });
      if (rows && rows.length > 0) {
        return rows[0];
      }
      return rows;
    },
    error: (message: string): ResponseNeuron => {
      return { type: "error", content: { message } };
    },
    message: (message: string): ResponseNeuron => {
      return { type: "message", content: { message } };
    },

    table: (result: any[]): ResponseNeuron => {
      if (!result || !result.length)
        return { type: "table", content: { data: [], header: [] } };
      let header = Object.keys(
        result.reduce((ac, row) => ({ ...ac, ...row }), {})
      );
      result = result.map((r) => header.map((h) => r[h] || ""));
      return { type: "table", content: { data: result, header } };
    },
    value: (result: any): ResponseNeuron => {
      return { type: "value", content: result };
    },
    chartLine: (result: any[]): ResponseNeuron => {
      if (!result || !result.length)
        return { type: "line", content: { datasets: [], labels: [] } };

      let labelKey = Object.keys(result[0])[0];
      let labels = result.map((row) => row[labelKey]);
      let dataSetsLength = Object.values(result[0]).length - 1;
      let datasets: any = [...new Array(dataSetsLength)].map(() => ({
        label: "",
        vals: [],
      }));
      for (let row of result) {
        let vals = Object.values(row);
        let keys = Object.keys(row);

        for (let k in vals) {
          let kIndex = parseInt(k);
          if (kIndex == 0) continue;
          let val = vals[kIndex];
          datasets[kIndex - 1].label = keys[k];
          datasets[kIndex - 1].vals.push(val);
        }
      }
      return { type: "line", content: { datasets: datasets, labels } };
    },
  };

  let content = `
  // declaration of the function
  ${neuron.executable}
  return fn;`;
  let responsePromise = new Function("args", content)();

  let response: ResponseNeuron;
  try {
    response = await responsePromise(args);
  } catch (err) {
    response = { type: "exception", content: err };
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

  let timeMs = Date.now() - d1;
  await neuron.update({
    executions: db.sequelize.literal(`executions + 1`),
    timeMs: db.sequelize.literal(`timeMs + ${timeMs}`),
  });

  await neuronLog.update({
    timeMs,
    finishAt: Date.now(),
  });

  return NextResponse.json({
    data: {
      response: response,
    },
  });
});
