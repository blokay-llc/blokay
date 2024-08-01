"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { useApi } from "@/hooks/useApi";
import { updateBusiness } from "@/app/services/users";

export default function BusinessInfo({ session }: any) {
  const [form, setForm]: any = useState({
    name: session?.business?.name,
    billEmail: session?.business?.billEmail,
    address: session?.business?.address,
    website: session?.business?.website,
  });

  const { loading, errors, callApi } = useApi(updateBusiness);

  const handleSave = () => {
    callApi(form);
  };

  return (
    <div className="text-neutral-800 dark:text-white ">
      <h2 className="font-bold text-lg mb-3">Billing details</h2>

      <div className="border border-neutral-200 bg-white dark:bg-transparent dark:border-neutral-800 rounded-lg py-5 ">
        <div className="px-5">
          <p className=" text-sm font-light text-neutral-500">
            You can add a billing email to receive invoices and updates.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-5 gap-3 mt-5">
            <DS.Input
              type="text"
              value={form.name}
              label="Name"
              error={errors?.name}
              onChange={(val: string) => {
                setForm({ ...form, name: val });
              }}
            />
            <DS.Input
              type="email"
              value={form.billEmail}
              error={errors?.billEmail}
              label="Email"
              onChange={(val: string) => {
                setForm({ ...form, billEmail: val });
              }}
            />
            <DS.Input
              type="text"
              value={form.address}
              label="Address"
              error={errors?.address}
              onChange={(val: string) => {
                setForm({ ...form, address: val });
              }}
            />

            <DS.Input
              type="text"
              value={form.website}
              error={errors?.website}
              label="Website"
              onChange={(val: string) => {
                setForm({ ...form, website: val });
              }}
            />
          </div>
        </div>
        <div className="px-5 flex justify-start mt-5 pt-5 border-t border-neutral-200 dark:border-neutral-800">
          <DS.Button
            onClick={() => handleSave()}
            loading={loading}
            text="Save"
            variant="primary"
            size="sm"
            icon="save"
          />
        </div>
      </div>
    </div>
  );
}
