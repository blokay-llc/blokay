import { z } from "zod";
import { withUser } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { Block, Workspace }: any = db;

const schema = z
  .object({
    name: z.string().min(3),
    key: z.string().min(1).max(100),
    workspaceId: z.string().refine(async (e: string) => {
      const workspace = await Workspace.findById(e);
      return workspace;
    }, "The workspace doesn't exists."),
  })
  .superRefine(async ({ key, workspaceId }, ctx) => {
    const currentBlock = await Block.findByKeyWorkspace(key, workspaceId);
    if (currentBlock) {
      ctx.addIssue({
        code: "custom",
        message: "The block already exists.",
        path: ["key"],
      });
    }
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
    ...data,
    key,
  });
  if (!success) return sendDataValidationError(errors);

  let block = await Block.create({
    type: data.type || "function",
    businessId: user.businessId,
    icon: data.icon,
    description: data.name,
    key,
    filters: {},
    workspaceId: data.workspaceId,
    synapse:
      "const fn = async (req: Request, res: Response) => {\n\treturn null;\n}",
  });

  return sendData({
    Block: {
      id: block.id,
    },
  });
});
