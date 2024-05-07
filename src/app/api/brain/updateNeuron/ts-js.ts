import * as ts from "typescript";

export const transpileModule = (code: string): any => {
  code = `
  enum CellClick {
    openNeuron = "openNeuron",
    closeCurrentNeuron = "closeCurrentNeuron",
  }
  
  type Cell =  string | number | {
    html: string;
    value: string;
    click: CellClick;
    args: {
      neuronKey: string;
      form: Form;
    };
  };
  
  type Row = {
    [x: string | number]: Cell;
  };
  
  type Form = {
    [x: string | number | symbol]: unknown;
  };
  
  type Rows = Row[];
  
  type QueryReplacements = {
    [x: string | number | symbol]: unknown;
  };
  
  type FetchParams = {
    [x: string | number | symbol]: unknown;
  };
  
  type ResponseNeuron = {
    type: string;
    message: string;
    content: any;
  };
  
  // only uses if you need
  type Args = {
    // input vars
    _businessId: number;
    form: Form; // values filled by the user
    files: Array<File>; // files uploaded by the user
  
    // database methods
    find: (sql: string, replacements?: QueryReplacements) => Promise<Row>;
    query: (sql: string, replacements?: QueryReplacements) => Promise<Rows>;
    insert: (sql: string, replacements?: QueryReplacements) => Promise<void>;
    update: (sql: string, replacements?: QueryReplacements) => Promise<void>;
    // utils methods
    fetch: (url: string, params: FetchParams) => Promise<any>;

    // response methods
    table: (rows: Rows) => ResponseNeuron;
    value: (val: Row) => ResponseNeuron;
    chartLine: (rows: Rows) => ResponseNeuron;
    chartDoughnut: (rows: Rows) => ResponseNeuron;
    message: (message: string) => ResponseNeuron;
    error: (message: string) => ResponseNeuron;
  };
   ${code}`;

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
