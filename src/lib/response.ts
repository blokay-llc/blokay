import { NextResponse } from "next/server";

export const isValidSchema = async (schema: any, data: any) => {
  const response = await schema.safeParseAsync(data);

  return { success: response.success, errors: response.error };
};

export const sendDataValidationError = (errors: any) => {
  return NextResponse.json(
    { message: "Invalid request", errors },
    { status: 400 }
  );
};

export const sendError = (error: any) => {
  return NextResponse.json(
    {
      error,
    },
    { status: 400 }
  );
};

export const sendData = (data: any) => {
  return NextResponse.json({ data }, { status: 200 });
};
