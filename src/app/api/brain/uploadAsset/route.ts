import { NextResponse, NextRequest } from "next/server";
import { uploadFile } from "@/app/helpers/aws";
import { withJWT } from "@/lib/withJWT";
export const POST = withJWT(async function ({ body }: any) {
  const file: any = body.get("file");
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  let filename = file.name.replaceAll(" ", "_");
  filename = `${filename}`;

  let response = await uploadFile(filename, buffer);

  return NextResponse.json({
    data: {
      Resource: {
        publicUrl: process.env.AWS_PUBLIC_URL,
        url: process.env.AWS_PUBLIC_URL + "/" + response,
        Key: response,
        preview: process.env.AWS_PUBLIC_URL + "/" + response,
      },
    },
  });
});
