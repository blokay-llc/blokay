import { NextResponse } from "next/server";
import fetch from "node-fetch";
import Models from "@/db/index";
import { getConnection } from "@/db/connection";
import {
  Args,
  FieldForm,
  QueryReplacements,
  ResponseNeuron,
} from "@/lib/types.d";
import { withNeuron } from "@/lib/withNeuron";
import vm from "node:vm";

let db = new Models();

const { Datasource, NeuronExecution }: any = db;

const buildNeuronArgs = ({ form, datasource }: any): Args => ({
  form: {
    async getFile(file: string, parser: string): Promise<FieldForm> {
      parser = parser.toLocaleLowerCase();
      let url = form[file];
      if (!url && file.includes("http")) {
        url = file;
      }

      let res = await fetch(url);
      let buffer = await res.blob();
      let content = null;

      let ext = url.split(/[#?]/)[0].split(".").pop().trim();

      if (parser === "csv") {
        let text = await buffer.text();
        content = text.split("\n").map((row) => row.split(";"));
      }

      return {
        fileName: "",
        ext,
        buffer,
        content,
      };
    },
    ...form,
  },
  fetch: async (endpoint: string, opts = {}) => {
    let response = await fetch(endpoint, opts);
    return await response.json();
  },
  query: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "read");
    return await conn.query(sql, { replacements, type: "SELECT" });
  },
  insert: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "INSERT" });
  },
  delete: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "DELETE" });
  },
  update: async (sql: string, replacements: QueryReplacements = {}) => {
    const conn: any = await getConnection(db, datasource, "write");
    return await conn.query(sql, { replacements, type: "UPDATE" });
  },
  find: async (sql: string, replacements: QueryReplacements = {}) => {
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
  chartDoughnut: (result: any[]): ResponseNeuron => {
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
    return { type: "doughnut", content: { datasets: datasets, labels } };
  },
});

export const POST = withNeuron(async function ({
  req,
  user,
  neuron,
  body,
}: any) {
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
  fn(args);`;

  let response: ResponseNeuron;
  try {
    response = await vm.runInNewContext(
      content,
      {
        console: console,
        args: buildNeuronArgs({ form, datasource }),
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
    data: JSON.stringify(form),
    finishAt: Date.now(),
    error: response?.type == "exception" ? response.content?.name : null,
  });

  return NextResponse.json({
    data: {
      response,
    },
  });
});
