import Providers from "@/app/(auth)/login/components/Providers";
import BillingView from "./components/BillingView";
import Menu from "@/app/components/Menu/Menu";
export default function Billing() {
  return (
    <div className="min-h-screen  pt-8">
      <div className="mx-auto container">
        <Providers>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-3">
              <Menu />
            </div>
            <div className="md:col-span-9 md:px-10">
              <div className="relative pb-10">
                <BillingView />
              </div>
            </div>
          </div>
        </Providers>
      </div>
    </div>
  );
}
