import { NextResponse } from "next/server";
import { withBlock } from "@/lib/withBlock";

export const POST = withBlock(async function ({ block }: any) {
  return NextResponse.json({
    data: {
      Neuron: {
        id: block.id,
        type: block.type,
        cron: block.cron,
        createdAt: block.createdAt,
        key: block.key,
        description: block.description,
        filters: block.filters,
        synapse: block.synapse,
        history: block.history,
      },
    },
  });
});
