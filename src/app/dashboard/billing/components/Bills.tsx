"use client";
import { useEffect, useState } from "react";
import { fetchBills } from "@/app/services/bill";
import { useApi } from "@/hooks/useApi";
import { DS } from "@blokay/react";

const Bill = ({ bill }: any) => {
  return (
    <div className="flex flex-col gap-2 py-2 hover:bg-neutral-100 rounded-lg px-5">
      <div className="text-sm font-light text-neutral-500 flex items-center gap-2 justify-between">
        <div className="flex gap-2">
          <div className="bg-neutral-100 px-3 py-0.5 rounded-lg">
            Number {bill.number}
          </div>
          <div>
            {bill.paid != 0 && <div className="text-green-500">Paid</div>}
            {bill.paid == 0 && <div className="text-red-500">Unpaid</div>}
          </div>
        </div>
        <div className="flex gap-2">
          <div>{bill.startBillingCycle}</div>
          <div>
            <DS.Icon icon="right" className="w-4 h-4" />
          </div>
          <div>{bill.endBillingCycle}</div>
        </div>
      </div>
    </div>
  );
};
export default function Bills() {
  const { callApi } = useApi(fetchBills);
  const [bills, setBills] = useState([]);

  useEffect(() => {
    callApi().then((res: any) => {
      setBills(res);
    });
  }, []);

  if (!bills.length) {
    return;
  }
  return (
    <div className="text-neutral-800 dark:text-white ">
      <h2 className="font-bold text-lg mb-3">Past Bills</h2>

      <div className="text-neutral-800 dark:text-white border border-neutral-200 bg-white dark:bg-transparent dark:border-neutral-800 rounded-lg py-3 px-3">
        <div className=" flex flex-col divide-y divide-neutral-200">
          {bills.map((bill: any) => (
            <Bill bill={bill} key={bill.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
