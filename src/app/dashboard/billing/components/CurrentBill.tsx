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
  const item = lookup
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

function humanFileSize(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return bytes.toFixed(dp) + " " + units[u];
}

const BillDetail = ({ label, value = 0, limit }: any) => {
  return (
    <div className="py-2 flex items-center justify-between gap-2 font-light text-sm text-neutral-600 ">
      <div>{label}</div>

      <div className="flex items-center gap-1">
        <span className="font-bold">{value}</span>
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
          <span className="dark:text-neutral-200 font-medium ml-3 bg-neutral-200 text-neutral-600 px-3 py-0.5 rounded-md">
            {bill?.planName}
          </span>
        </p>

        <div className="mt-5 flex flex-col divide-y divide-neutral-200">
          <BillDetail label="Users" value={bill?.Details?.USERS?.value} />

          <BillDetail
            label="Block Executions"
            value={formatUsage(bill?.Details?.BLOCK_EXECUTIONS?.value || 0)}
            limit={bill?.blockUsageLimit}
          />

          <BillDetail
            label="Block Time"
            value={
              ((bill?.Details?.BLOCK_TIME?.value || 0) / 1000).toFixed() + "s"
            }
          />

          <BillDetail
            label="Network Input"
            value={humanFileSize(
              bill?.Details?.NETWORK_INPUT?.value || 0,
              true
            )}
          />

          <BillDetail
            label="Network Output"
            value={humanFileSize(
              bill?.Details?.NETWORK_OUTPUT?.value || 0,
              true
            )}
          />
        </div>
      </div>
    </div>
  );
}
