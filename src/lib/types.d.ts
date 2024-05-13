export enum CellClick {
  openNeuron = "openNeuron",
  closeCurrentNeuron = "closeCurrentNeuron",
}

export type Cell = {
  html: string;
  value: string;
  click: CellClick;
  args: {
    neuronKey: string;
    form: Form;
  };
};

export type Row = {
  [x: string | number | symbol]: Cell | string | number | unknown;
};

export type FieldForm = {
  fileName: string;
  content: any;
  ext: string;
  buffer: Buffer | Uint8Array | Blob | string | null;
};

export type Form = {
  getFile: (name: string, parser?: string) => Promise<FieldForm>;
  [x: string | number | symbol]: unknown;
};

type Rows = Row[];

export type QueryReplacements = {
  [x: string | number | symbol]: unknown;
};

export type FetchParams = {
  [x: string | number | symbol]: unknown;
};

export type Session = {
  id: string;
  email: string;
  name: string;
} | null;

// only uses if you need
export type Args = Request & Response;

export type Request = {
  session?: Session;
  // input vars
  form: Form; // values filled by the user

  // database methods
  find: (sql: string, replacements?: QueryReplacements) => Promise<Row>;
  query: (sql: string, replacements?: QueryReplacements) => Promise<Rows>;
  insert: (sql: string, replacements?: QueryReplacements) => Promise<void>;
  delete: (sql: string, replacements?: QueryReplacements) => Promise<void>;
  update: (sql: string, replacements?: QueryReplacements) => Promise<void>;
  // utils methods
  fetch: (url: string, params: FetchParams) => Promise<any>;
};

export type ResponseNeuron = {
  type: string;
  message?: string;
  content: any;
} | null;

export type Response = {
  json: (json: Object) => ResponseNeuron;
  table: (rows: Rows) => ResponseNeuron;
  value: (val: Row) => ResponseNeuron;
  chartLine: (rows: Rows) => ResponseNeuron;
  chartDoughnut: (rows: Rows) => ResponseNeuron;
  message: (message: string) => ResponseNeuron;
  error: (message: string) => ResponseNeuron;
};
