"use client";
import { DS } from "@blokay/react";
import { useRouter } from "next/navigation";

export default function Usage() {
  const router = useRouter();

  return (
    <div className="text-neutral-950 bg-white border border-neutral-300 rounded-lg p-5 flex flex-col gap-3">
      <div className="text-sm">
        Plan usage
        <span className="ml-2 bg-neutral-100 rounded-lg px-3 py-1 text-xs font-light">
          Free
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 font-light text-sm text-neutral-600 mb-2">
          <div>Executions</div>
          <div className="flex items-center gap-1">
            <span className="font-bold">0</span>
            <span>/</span>5K
          </div>
        </div>
        <div className="relative">
          <div className="h-1 bg-blue-600 w-0 rounded-lg mb-2 top-0 left-0 absolute"></div>
          <div className="h-1 w-full bg-neutral-200 rounded-lg mb-2"></div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <DS.Button
          text="Go to billing"
          onClick={() => {
            router.push(`/dashboard/billing`);
          }}
          variant="secondary"
          className="w-full font-light "
          size="md"
        />
        <DS.Button
          text="Upgrade"
          onClick={() => {
            router.push(`/dashboard/billing`);
          }}
          variant="primary"
          className="w-full  font-light"
          size="md"
        />
      </div>
    </div>
  );
}
