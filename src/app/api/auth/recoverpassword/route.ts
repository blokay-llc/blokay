import { z } from "zod";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
  sendError,
} from "@/lib/response";
import jwt from "jsonwebtoken";

let db = new Models();
const { User }: any = db;

const schema = z
  .object({
    jwtToken: z.string(),
    password: z.string().min(6).max(30),
    confirmPassword: z.string().min(6).max(30),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export async function POST(req: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let { password, jwtToken } = body.data;

  let decoded: any = null;
  try {
    decoded = jwt.verify(jwtToken, process.env.ENCRYPTION_KEY || "");
  } catch (err) {
    return sendError("Invalid json web token");
  }

  const user = await User.findOne({
    where: {
      email: decoded.email,
    },
  });

  await user.update({
    password,
  });

  return sendData({});
}
