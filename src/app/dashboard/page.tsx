import ListViews from "@/app/components/Brain/ListViews";
import Menu from "@/app/components/Menu/Menu";
import Providers from "../login/components/Providers";
export default function Home() {
  return (
    <div className="min-h-screen  pt-8">
      <div className="mx-auto container">
        <Providers>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-3">
              <Menu />
            </div>
            <div className="lg:col-span-9 lg:px-10">
              <div className="relative pb-10">
                <ListViews />
              </div>
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
