import { withUser } from "@/lib/withUser";
import { NextResponse } from "next/server";
import Models from "@/db/index";

let db = new Models();
const { Neuron }: any = db;

function stringtoKey(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  let from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  let to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, ".");

  return str;
}

export const POST = withUser(async function ({ req, user }: any) {
  const body = await req.json();
  const data = body.data;

  let neuron = await Neuron.create({
    businessId: user.businessId,
    icon: data.icon,
    description: data.name,
    key: stringtoKey(data.name),
    filters: [],
    synapse: "const fn = async (args: Args) => {}",
  });

  return NextResponse.json({
    data: {
      Neuron: {
        id: neuron.id,
      },
    },
  });
});
