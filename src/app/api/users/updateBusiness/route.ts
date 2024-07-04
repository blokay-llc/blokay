import { z } from "zod";
import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import { isValidSchema, sendDataValidationError } from "@/lib/response";
import Models from "@/db/index";

let db = new Models();

const schema = z.object({
  name: z.string().min(3),
  website: z.string().url(),
  billEmail: z.string().email(),
  address: z.string().min(3),
});

const { Business }: any = db;

export const POST = withAdmin(async function ({ user, req }: any) {
  const body = await req.json();

  const { success, errors } = await isValidSchema(schema, body.data);
  if (!success) return sendDataValidationError(errors);

  const business = await Business.findOne({ where: { id: user.businessId } });

  await business.update({
    name: body.data.name,
    address: body.data.address,
    website: body.data.website,
    billEmail: body.data.billEmail,
  });

  return NextResponse.json({
    data: {},
  });
});
