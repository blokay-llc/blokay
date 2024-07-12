import { sendData } from "@/lib/response";
import { withView } from "@/lib/withView";

export const POST = withView(async function ({ body, view }: any) {
  await view.destroy();

  return sendData({});
});
