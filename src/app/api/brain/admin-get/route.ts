import { NextResponse } from "next/server";
import { withNeuron } from "@/lib/withNeuron";

export const POST = withNeuron(async function ({ neuron }: any) {
  return NextResponse.json({
    data: {
      Neuron: {
        id: neuron.id,
        type: neuron.type,
        cron: neuron.cron,
        createdAt: neuron.createdAt,
        key: neuron.key,
        description: neuron.description,
        filters: neuron.filters,
        synapse: neuron.synapse,
        history: neuron.history,
      },
    },
  });
});
