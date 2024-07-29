import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Block }: any = db;

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
  let ocurrences: any = str.match(/\b(blockKey).{0,60}/g) || [];
  blocks = [...blocks, ...ocurrences];
  ocurrences = str.match(/\b(blockId).{0,60}/g) || [];
  blocks = [...blocks, ...ocurrences];

  ocurrences = str.match(/\b(createButton).{0,100}/g) || [];
  if (ocurrences.length > 0) {
    ocurrences = ocurrences.map((item: any) => {
      return item.split(",")[1];
    });
  }
  blocks = [...blocks, ...ocurrences];

  return blocks.map((n: any) => {
    let toSearch = n || "";
    if (toSearch.includes("blockId")) {
      return stripText("blockId", toSearch);
    }

    let blockKey: any = stripText("blockKey", toSearch);
    return blockKeysMap[blockKey];
  });
}

export const POST = withAdmin(async function ({ user, req }: any) {
  const body = await req.json();
  const data = body.data;

  const result = await Block.findAll({
    where: {
      businessId: user.businessId,
      workspaceId: data.workspaceId,
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
      Blocks: list,
    },
  });
});
