import { z } from "zod";
import { withUser } from "@/lib/withUser";
import Models from "@/db/index";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";

let db = new Models();
const { View, Workspace }: any = db;

function string_to_slug(str: string) {
  str = str.replace(/^\s+|\s+$/g, "");
  str = str.toLowerCase();

  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }
  return str
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const schema = z.object({
  name: z.string().min(3),
  workspaceId: z.string().refine(async (e: string) => {
    const workspace = await Workspace.findById(e);
    return workspace;
  }, "The workspace doesn't exists."),
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
    userId: user.id,
    name: data.name,
    layout: [],
    slug: string_to_slug(data.name),
    viewGroupId: data.categoryId || null,
    workspaceId: data.workspaceId,
  };

  let view = await View.create(dataCreation);

  return sendData({
    View: {
      id: view.id,
    },
  });
});
