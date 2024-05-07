import { withAdmin } from "@/lib/withUser";
import { NextResponse } from "next/server";
import moment from "moment";
import Models from "@/db/index";

let db = new Models();
const { User, NeuronExecution, Neuron }: any = db;

export const GET = withAdmin(async function ({ req, user }: any) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const userChild = await User.findOne({
    where: {
      id: userId,
      businessId: user.businessId,
    },
  });

  const executions = await NeuronExecution.findAll({
    include: [
      {
        model: User,
        required: true,
      },
      {
        model: Neuron,
        required: true,
      },
    ],
    where: {
      userId: userChild.id,
      createdAt: {
        [db.Op.gte]: moment().subtract("1", "month").format("YYYY-MM-DD"),
      },
    },
    order: [["id", "DESC"]],
  });

  const str = executions
    .map((e: any, index: number) => {
      let str = `${index + 1};${e.Neuron.description};${moment(
        e.createdAt
      ).format("YYYY-MM-DD HH:mm:ss")};${e.User.name}`;
      if (e.data) {
        str += "," + Object.values(e.data).join(",");
      }
      return str;
    })
    .join("\n");

  const response = new NextResponse(str);
  response.headers.set(
    "content-disposition",
    `attachment;filename=${userChild.id}_logs.csv`
  );

  return response;
});
