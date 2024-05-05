import ViewBrain from "./components/ViewBrain";
import Providers from "@/app/login/components/Providers";

export default function View({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen h-full">
      <Providers>
        <ViewBrain slug={params.slug} />
      </Providers>
    </div>
  );
}
