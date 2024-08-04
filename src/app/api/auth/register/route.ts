import { z } from "zod";
import Models from "@/db/index";
import CoreAPI from "@/app/services/core";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";
import Email from "@/app/services/mail";
import UserWelcome from "@/emails/UserWelcome";

let db = new Models();
const { User }: any = db;

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

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let coreApi = new CoreAPI("");
  let { email, password, companyName, companySize, name } = body.data;

  let result = await coreApi.newBusiness(name, companyName, companySize, email);

  const user = await User.createNew({
    email,
    password,
    name,
    image: null,
    companyName,
  });

  await user.Business.update({ coreToken: result.coreToken });

  let emailSender = new Email();
  emailSender.send(
    user.email,
    "Welcome to Blokay - Developing faster is impossible.",
    UserWelcome,
    { name }
  );

  return sendData({});
}
