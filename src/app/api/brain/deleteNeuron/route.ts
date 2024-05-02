import { NextResponse } from "next/server";
import { withNeuron } from "@/lib/withNeuron";

export const POST = withNeuron(async function ({ neuron }: any) {
  await neuron.destroy();
  return NextResponse.json({
    data: {},
  });
});
