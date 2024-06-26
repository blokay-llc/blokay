import ListViews from "@/app/dashboard/(page)/components/ListViews";
import Menu from "@/app/components/Menu/Menu";
import Providers from "@/app/(auth)/login/components/Providers";

export default async function Home() {
  return (
    <div className="lg:px-8 px-3 pt-8 min-h-screen">
      <Providers>
        <div className="lg:flex lg:gap-10 lg:container mx-auto">
          <div className="lg:w-[18rem]">
            <Menu />
          </div>
          <div className="lg:flex-1 relative pb-10">
            <ListViews />
          </div>
        </div>
      </Providers>
    </div>
  );
}
