import ListViews from "@/app/dashboard/[workspace]/(home)/components/ListViews";
import Menu from "@/app/components/Menu/Menu";
import Providers from "@/app/(auth)/login/components/Providers";

export default async function Home({
  params,
}: {
  params: { workspace: string };
}) {
  return (
    <div className="lg:px-8 px-3 pt-8 min-h-screen">
      <Providers>
        <div className="lg:flex lg:gap-10  mx-auto">
          <div className="lg:w-[18rem]">
            <Menu />
          </div>
          <div className="lg:flex-1 relative pb-10 lg:max-w-[48rem] mx-auto">
            <ListViews workspace={params.workspace} />
          </div>
        </div>
      </Providers>
    </div>
  );
}
