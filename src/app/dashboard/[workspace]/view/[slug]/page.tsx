import Page from "./components/Page";
import Providers from "@/app/components/Providers/Providers";
import jwt from "jsonwebtoken";

const getJWT = () => {
  return jwt.sign(
    {
      data: { session: {} },
      businessId: process.env.BUSINESS_CORE_ID,
      blocks: ["block.executions", "block.chart.exections"],
    },
    process.env.BUSINESS_CORE_TOKEN || "",
    {}
  );
};

export default function View({
  params,
}: {
  params: { slug: string; workspace: string };
}) {
  return (
    <div className="min-h-screen h-full">
      <Providers>
        <Page slug={params.slug} workspace={params.workspace} jwt={getJWT()} />
      </Providers>
    </div>
  );
}
