import { NextResponse } from "next/server";
import { withNeuron } from "@/lib/withNeuron";

export const POST = withNeuron(async function ({ req, neuron }: any) {
  return NextResponse.json({
    data: {
      Neuron: {
        id: neuron.id,
        createdAt: neuron.createdAt,
        key: neuron.key,
        description: neuron.description,
        filters: neuron.filters,
      },
    },
  });
});
