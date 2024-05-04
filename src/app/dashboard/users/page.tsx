import Providers from "@/app/login/components/Providers";
import ListUsers from "./components/ListUsers";
import Menu from "@/app/components/Menu/Menu";
export default function User() {
  return (
    <div className="min-h-screen   pt-8">
      <div className="mx-auto container">
        <Providers>
          <div className="grid grid-cols-12 gap-5">
            <div className="col-span-3">
              <Menu />
            </div>
            <div className="col-span-9 px-10">
              <div className="relative pb-10">
                <ListUsers />
              </div>
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
