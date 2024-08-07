import Providers from "@/app/components/Providers/Providers";
import ListUsers from "./components/ListUsers";
import Menu from "@/app/components/Menu/Menu";
export default function User() {
  return (
    <div className="lg:px-8 px-3 pt-8 min-h-screen">
      <Providers>
        <div className="lg:flex lg:gap-10  mx-auto">
          <div className="lg:w-[18rem]">
            <Menu workspace={null} />
          </div>
          <div className="lg:flex-1 relative pb-10 lg:max-w-[48rem] mx-auto">
            <ListUsers />
          </div>
        </div>
      </Providers>
    </div>
  );
}
