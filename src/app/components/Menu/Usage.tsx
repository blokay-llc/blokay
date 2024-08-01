"use client";
import { useEffect, useState } from "react";
import { DS } from "@blokay/react";
import { useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { fetchUsage } from "@/app/services/bill";

const formatUsage = (num: number, digits: number = 1) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "MM" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  let formattedVal = item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";

  return formattedVal;
};

export default function Usage() {
  const router = useRouter();
  const { loading, callApi } = useApi(fetchUsage);
  const [bill, setBill] = useState({
    billId: null,
    planName: "",
    blockUsage: 0,
    blockUsageLimit: 0,
  });

  useEffect(() => {
    callApi().then((res: any) => {
      setBill(res);
    });
  }, []);

  return (
    <div className="text-neutral-950 bg-white border border-neutral-300 rounded-lg p-5 flex flex-col gap-3">
      <div className="text-sm">
        Plan usage
        <span className="ml-2 bg-neutral-100 rounded-lg px-3 py-1 text-xs font-light">
          {bill?.planName || "Free"}
        </span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 font-light text-sm text-neutral-600 mb-2">
          <div>Executions</div>

          {bill?.billId && (
            <div className="flex items-center gap-1">
              <span className="font-bold">
                {formatUsage(bill?.blockUsage || 0)}
              </span>
              <span>/</span>
              {formatUsage(bill?.blockUsageLimit || 0)}
            </div>
          )}
          {!bill?.billId && <DS.Loader size="sm" />}
        </div>
        <div className="relative">
          <div
            className="h-1 bg-blue-600 w-0 transition-all duration-200 rounded-lg mb-2 top-0 left-0 absolute"
            style={{
              width: `${(bill?.blockUsage / bill?.blockUsageLimit) * 100}%`,
            }}
          ></div>
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
