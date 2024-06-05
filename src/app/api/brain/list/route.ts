import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Neuron }: any = db;

function stripText(type: string, text: string) {
  text = text.replaceAll(type, "");
  text = text.replaceAll("'", "");
  text = text.replaceAll('"', "");
  text = text.replaceAll(",", "");
  text = text.replaceAll(":", "");
  text = text.trim();
  return text;
}
function getSubBlocks(str: string, blockKeysMap: any[]) {
  if (!str) return [];

  let blocks: any = [];
  let ocurrences = str.match(/\b(neuronKey).{0,60}/g) || [];
  blocks = [...blocks, ...ocurrences];
  ocurrences = str.match(/\b(neuronId).{0,60}/g) || [];
  blocks = [...blocks, ...ocurrences];

  return blocks.map((n: any) => {
    if (n.includes("neuronId")) {
      return stripText("neuronId", n);
    }

    let neuronKey: any = stripText("neuronKey", n);
    return blockKeysMap[neuronKey];
  });
}

export const POST = withAdmin(async function ({ user }: any) {
  const result = await Neuron.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  let blocksKeyMap = result.reduce((ac: any, item: any) => {
    ac[item.key] = item.id;
    return ac;
  }, {});

  for (let blockIndex in result) {
    let childrenIds = getSubBlocks(result[blockIndex].synapse, blocksKeyMap);
    result[blockIndex].childrenIds = childrenIds;
  }

  const list = result.map((n: any) => ({
    id: n.id,
    type: n.type,
    key: n.key,
    name: n.description,
    childrenIds: n.childrenIds,
  }));

  return NextResponse.json({
    data: {
      Neurons: list,
    },
  });
});
