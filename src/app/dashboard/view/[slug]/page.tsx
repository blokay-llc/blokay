import Page from "./components/Page";
import Providers from "@/app/(auth)/login/components/Providers";
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

export default function View({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full">
      <Providers>
        <Page params={params} jwt={getJWT()} />
      </Providers>
    </div>
  );
}
