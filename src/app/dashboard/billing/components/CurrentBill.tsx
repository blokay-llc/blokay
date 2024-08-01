"use client";
import { useEffect, useState } from "react";
import { fetchUsage } from "@/app/services/bill";
import { useApi } from "@/hooks/useApi";

const formatUsage = (num: number, digits: number = 1) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
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

const BillDetail = ({ label, detail = { value: 0 }, limit }: any) => {
  return (
    <div className="py-2 flex items-center justify-between gap-2 font-light text-sm text-neutral-600 ">
      <div>{label}</div>

      <div className="flex items-center gap-1">
        <span className="font-bold">{formatUsage(detail?.value || 0)}</span>
        {limit && (
          <>
            <span>/</span>
            {formatUsage(limit || 0)}
          </>
        )}
      </div>
    </div>
  );
};

export default function CurrentBill() {
  const { loading, callApi } = useApi(fetchUsage);
  const [bill, setBill] = useState({
    billId: null,
    planName: "",
    blockUsage: 0,
    blockUsageLimit: 0,
    Details: {} as any,
  });

  useEffect(() => {
    callApi().then((res: any) => {
      setBill(res);
    });
  }, []);
  return (
    <div className="text-neutral-800 dark:text-white ">
      <h2 className="font-bold text-lg mb-3">Current plan</h2>

      <div className="text-neutral-800 dark:text-white border border-neutral-200 bg-white dark:bg-transparent dark:border-neutral-800 rounded-lg py-5 px-5">
        <p className="text-sm font-light text-neutral-500">
          You are currently on the
          <span className="dark:text-neutral-200 font-bold ml-3 bg-black text-white px-3 py-0.5 rounded-md">
            {bill?.planName}
          </span>
        </p>

        <div className="mt-5 flex flex-col divide-y divide-neutral-200">
          <BillDetail
            label="Block Executions"
            detail={bill?.Details?.BLOCK_EXECUTIONS}
            limit={bill?.blockUsageLimit}
          />
          <BillDetail label="Block Time" detail={bill?.Details?.BLOCK_TIME} />

          <BillDetail
            label="Network Input"
            detail={bill?.Details?.NETWORK_INPUT}
          />
          <BillDetail
            label="Network Output"
            detail={bill?.Details?.NETWORK_OUTPUT}
          />
        </div>
      </div>
    </div>
  );
}
