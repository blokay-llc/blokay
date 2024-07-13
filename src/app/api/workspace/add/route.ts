import { z } from "zod";
import { withUser } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Workspace }: any = db;

const schema = z.object({
  name: z.string().min(3),
});

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  let dataCreation: any = {
    businessId: user.businessId,
    name: data.name,
    slug: data.name,
  };

  let workspace = await Workspace.create(dataCreation);

  return sendData({
    Workspace: {
      id: workspace.id,
    },
  });
});
