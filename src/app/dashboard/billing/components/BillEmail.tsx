"use client";
import { useState } from "react";
import { DS } from "@blokay/react";

export default function BillEmail({ session }: any) {
  const [form, setForm]: any = useState({
    name: session?.business?.name,
    billEmail: session?.business?.billEmail,
    address: session?.business?.address,
  });

  return (
    <div className="border border-neutral-800 rounded-lg py-5 ">
      <div className="px-5">
        <h2 className="font-bold text-xl mb-5">Billing details</h2>
        <p className=" text-sm font-light text-neutral-500">
          You can add a billing email to receive invoices and updates.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-3 mt-5">
          <DS.Input
            type="text"
            value={form.name}
            label="Name"
            onChange={(val: string) => {
              setForm({ ...form, name: val });
            }}
          />
          <DS.Input
            type="email"
            value={form.billEmail}
            label="Email"
            onChange={(val: string) => {
              setForm({ ...form, billEmail: val });
            }}
          />
          <DS.Input
            type="text"
            value={form.address}
            label="Address"
            onChange={(val: string) => {
              setForm({ ...form, address: val });
            }}
          />
        </div>
      </div>
      <div className="px-5 flex justify-start mt-5 pt-5 border-t border-neutral-800">
        <DS.Button text="Edit card" variant="primary" size="sm" icon="card" />
      </div>
    </div>
  );
}
