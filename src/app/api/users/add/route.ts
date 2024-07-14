import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import {
  isValidSchema,
  sendDataValidationError,
  sendData,
} from "@/lib/response";
import Models from "@/db/index";

let db = new Models();
const { User, UserPermission, View }: any = db;

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(100),
  name: z.string().min(1).max(100),
});

export const POST = withAdmin(async function ({ user, req }: any) {
  const body = await req.json();
  let permissions = body.data.permissions;

  const { success, errors } = await isValidSchema(schema, {
    ...body.data,
  });
  if (!success) return sendDataValidationError(errors);

  const userCreated = await User.create({
    email: body.data.email,
    password: body.data.password,
    name: body.data.name,
    rol: body.data.rol,
    businessId: user.businessId,
    blockedAt: null,
    lastActionAt: null,
  });

  const viewIds = Object.keys(permissions).filter((v) => permissions[v]);
  let queryBuilder = {
    where: {
      id: { [db.Op.in]: viewIds },
      businessId: user.businessId,
    },
  };
  let views = await View.findAll(queryBuilder);

  let bulkCreate = [];
  for (let view of views) {
    bulkCreate.push({
      viewId: view.id,
      userId: userCreated.id,
    });
  }
  if (bulkCreate.length > 0) {
    await UserPermission.bulkCreate(bulkCreate);
  }

  return sendData({});
});
