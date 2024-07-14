import { z } from "zod";
import { withUser } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Feedback }: any = db;

const schema = z.object({
  feedback: z.string().min(3).max(1000),
});

export const POST = withUser(async function ({ user, req }: any) {
  const body = await req.json();
  const data = body.data;

  const { success, errors } = await isValidSchema(schema, {
    ...data,
  });
  if (!success) return sendDataValidationError(errors);

  await Feedback.create({
    businessId: user.businessId,
    feedback: data.feedback,
    userId: user.id,
  });
  return sendData({});
});
