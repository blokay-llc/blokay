import { z } from "zod";
import { withUser } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Neuron }: any = db;

const schema = z.object({
  name: z.string().min(3),
  key: z.string().refine(async (e: string) => {
    const currentBlock = await Neuron.findByKey(e);
    return !currentBlock;
  }, "The block already exists."),
});

function stringtoKey(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, ".");

  return str;
}

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();
  const data = body.data;

  let key = stringtoKey(data.name);
  const { success, errors } = await isValidSchema(schema, {
    name: data.name,
    key,
  });
  if (!success) return sendDataValidationError(errors);

  let neuron = await Neuron.create({
    type: data.type || "function",
    businessId: user.businessId,
    icon: data.icon,
    description: data.name,
    key,
    filters: {},
    synapse:
      "const fn = async (req: Request, res: Response) => {\n\treturn null;\n}",
  });

  return sendData({
    Neuron: {
      id: neuron.id,
    },
  });
});
