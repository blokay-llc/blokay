import { getConnection } from "@/db/connection";
import {
  Args,
  FieldForm,
  QueryReplacements,
  ResponseNeuron,
  Request,
  Response,
} from "@/lib/types.d";
import Models from "@/db/index";

let db = new Models();

export const buildRequest = ({
  user = null,
  form,
  datasource,
}: any): Request => ({
  utils: {
    createButton(label: string, neuronKey: string, form: any): any {
      return {
        html: `<button>${label}</button>`,
        value: label,
        click: "openNeuron",
        args: {
          neuronKey,
          form,
        },
      };
    },
  },
  session: user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        extra1: user.extra1,
        extra2: user.extra2,
        extra3: user.extra3,
      }
    : null,
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
        content = text.split(/\r\n|\n|\r/).map((row) => row.split(";"));
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
});

export const buildResponse = ({}: any): Response => ({
  json: (json: Object): ResponseNeuron => {
    return { type: "json", content: json };
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

export const buildArgs = ({
  datasource,
  user = null,
  form = null,
}: any): Args => ({
  ...buildRequest({
    user,
    form,
    datasource,
  }),
  ...buildResponse({}),
});
