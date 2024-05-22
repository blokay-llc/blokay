import Page from "./components/Page";
import Providers from "@/app/login/components/Providers";

export default function View({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full">
      <Providers>
        <Page params={params} />
      </Providers>
    </div>
  );
}
