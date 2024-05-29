import { z } from "zod";
import Models from "@/db/index";
import CoreAPI from "@/app/services/core";
import {
  isValidSchema,
  sendDataValidationError,
  sendError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { User, Business }: any = db;

const schema = z.object({
  name: z.string().min(3),
  email: z
    .string()
    .email()
    .refine(async (e: string) => {
      const currentUser = await User.findByEmail(e);
      return !currentUser;
    }, "The user already exists."),
  password: z.string().min(5),
  companyName: z.string().min(3),
  companySize: z.string(),
});

export async function POST(req: any) {
  const body = await req.json();
  let coreApi = new CoreAPI("");

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let { email, password, companyName, companySize, name } = body.data;

  let result = await coreApi.newBusiness(name, companyName, companySize, email);

  const business = await Business.create({
    name: companyName,
    coreToken: result.coreToken,
  });

  const user = await User.create({
    name,
    password,
    email,
    businessId: business.id,
    rol: "admin",
  });

  await business.update({
    ownerId: user.id,
  });

  return sendData({});
}
