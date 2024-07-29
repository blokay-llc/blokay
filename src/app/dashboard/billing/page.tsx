import Providers from "@/app/components/Providers/Providers";
import BillingView from "./components/BillingView";
import Menu from "@/app/components/Menu/Menu";
export default function Billing() {
  return (
    <div className="min-h-screen  pt-8">
      <div className="mx-auto container">
        <Providers>
          <div className="lg:flex lg:gap-10  mx-auto">
            <div className="lg:w-[18rem]">
              <Menu workspace={null} />
            </div>
            <div className="lg:flex-1 relative pb-10 lg:max-w-[48rem] mx-auto">
              <BillingView />
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
