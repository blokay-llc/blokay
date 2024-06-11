import Providers from "@/app/(auth)/login/components/Providers";
import SettingsView from "./components/SettingsView";
import Menu from "@/app/components/Menu/Menu";
export default function Settings() {
  return (
    <div className="min-h-screen  pt-8">
      <div className="mx-auto container text-neutral-800 dark:text-white">
        <Providers>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-3">
              <Menu />
            </div>
            <div className="md:col-span-9 md:px-10">
              <div className="relative pb-10">
                <SettingsView />
              </div>
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
