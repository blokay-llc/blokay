import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Neuron, View, ViewGroup }: any = db;

function stripText(type: string, text: string) {
  text = text.replaceAll(type, "");
  text = text.replaceAll("'", "");
  text = text.replaceAll('"', "");
  text = text.replaceAll(",", "");
  text = text.replaceAll(":", "");
  text = text.trim();
  return text;
}
function getSubNeurons(str: string, neuronKeysMap: any[]) {
  if (!str) return [];

  let neurons: any = [];
  let ocurrences = str.match(/\b(neuronKey).{0,60}/g) || [];
  neurons = [...neurons, ...ocurrences];
  ocurrences = str.match(/\b(neuronId).{0,60}/g) || [];
  neurons = [...neurons, ...ocurrences];

  return neurons.map((n: any) => {
    if (n.includes("neuronId")) {
      return stripText("neuronId", n);
    }

    let neuronKey: any = stripText("neuronKey", n);
    return neuronKeysMap[neuronKey];
  });
}

export const POST = withAdmin(async function ({ user }: any) {
  const result = await Neuron.findAll({
    where: {
      businessId: user.businessId,
    },
  });

  let neuronsKeyMap = result.reduce((ac: any, item: any) => {
    ac[item.key] = item.id;
    return ac;
  }, {});

  for (let neuronIndex in result) {
    let childrenIds = getSubNeurons(result[neuronIndex].synapse, neuronsKeyMap);
    result[neuronIndex].childrenIds = childrenIds;
  }

  const list = result.map((n: any) => ({
    id: n.id,
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
