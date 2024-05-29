import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Datasource }: any = db;

const schema = z.object({
  name: z.string().min(3),
  config: z.object({
    type: z.enum(["sqlite", "mariadb", "mysql", "postgresql", "oracle"]),
    host: z.string().min(3),
    database: z.string().min(3),
    password: z.string().min(3),
    username: z.string().min(3),
  }),
});

export const POST = withAdmin(async function ({ user, req }: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  const datasource = await Datasource.findOne({
    where: {
      id: body.data.datasourceId,
      businessId: user.businessId,
    },
  });

  await datasource.update({
    type: body.data.type,
    name: body.data.name,
    config: {
      database: body.data.config,
    },
  });

  return sendData({});
});
