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

export const POST = withAdmin(async function ({ req, user }: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  await Datasource.create({
    type: body.data.type,
    name: body.data.name,
    businessId: user.businessId,
    config: {
      database: body.data.config,
    },
  });

  return sendData({});
});
