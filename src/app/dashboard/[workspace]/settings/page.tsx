import Providers from "@/app/components/Providers/Providers";
import SettingsView from "./components/SettingsView";
import Menu from "@/app/components/Menu/Menu";
export default function Settings({
  params,
}: {
  params: { slug: string; workspace: string };
}) {
  return (
    <div className="min-h-screen  pt-8">
      <div className="mx-auto container text-neutral-800 dark:text-white">
        <Providers>
          <div className="lg:flex lg:gap-10  mx-auto">
            <div className="lg:w-[18rem]">
              <Menu workspace={params.workspace} />
            </div>
            <div className="lg:flex-1 relative pb-10 lg:max-w-[48rem] mx-auto">
              <SettingsView workspace={params.workspace} />
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
