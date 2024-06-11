import Providers from "@/app/(auth)/login/components/Providers";
import ListUsers from "./components/ListUsers";
import Menu from "@/app/components/Menu/Menu";
export default function User() {
  return (
    <div className="min-h-screen   pt-8">
      <div className="mx-auto container">
        <Providers>
          <div className="grid md:grid-cols-12 grid-cols-1 gap-5">
            <div className="md:col-span-3 ">
              <Menu />
            </div>
            <div className="md:col-span-9 md:px-10">
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
