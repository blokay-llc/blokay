import { NextResponse, NextRequest } from "next/server";
import { withUser } from "@/lib/withUser";
import { uploadFile } from "@/app/helpers/aws";
export const POST = withUser(async function ({
  req,
  user,
}: {
  req: NextRequest;
  user: any;
}) {
  const formData = await req.formData();
  const file: any = formData.get("file");
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
