import { z } from "zod";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";
import Email from "@/app/services/mail";
import ForgotPassword from "@/emails/ForgotPassword";

let db = new Models();
const { User }: any = db;

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  let { email } = body.data;

  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) return sendData({});

  let emailSender = new Email();
  emailSender.send(user.email, "Blokay - Reset your password", ForgotPassword, {
    name: user.name,
    token: "",
  });

  return sendData({});
}
