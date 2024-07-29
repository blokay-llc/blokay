import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Datasource, Workspace }: any = db;

const schema = z.object({
  name: z.string().min(3),
  workspaceId: z.string().refine(async (e: string) => {
    const workspace = await Workspace.findById(e);
    return workspace;
  }, "The workspace doesn't exists."),
  config: z.object({
    type: z.enum(["sqlite", "mariadb", "mysql", "postgresql", "oracle"]),
    host: z.string().min(3),
    database: z.string().min(3),
    password: z.string().min(3),
    username: z.string().min(3),
  }),
});

export const POST = withAdmin(async function ({ req, user }: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  const workspace = await Workspace.findById(body.data.workspaceId);

  await Datasource.create({
    type: body.data.type,
    name: body.data.name,
    businessId: user.businessId,
    workspaceId: workspace.id,
    config: {
      database: body.data.config,
    },
  });

  await workspace.increment("datasources", { by: 1 });

  return sendData({});
});
