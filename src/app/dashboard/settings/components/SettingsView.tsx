"use client";
import { useState, useRef } from "react";
import { DS } from "@blokay/react";
import Datasources from "./Datasources";

export default function SettingsView() {
  const modalRef: any = useRef();
  const [form, setForm]: any = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <Datasources />

      <DS.Modal
        title="Add card"
        footer={
          <DS.Button
            text="Save card"
            icon="account"
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
          />
        }
        size="sm"
        ref={modalRef}
      >
        <div className="0">
          <form className="flex flex-col gap-5">
            <DS.Input
              type="text"
              value={form.creditCardNumber}
              label="Credit card number"
              onChange={(val: string) => {
                setForm({ ...form, creditCardNumber: val });
              }}
            />

            <DS.Input
              type="text"
              value={form.creditCardPlaceHolder}
              label="Credit card label"
              onChange={(val: string) => {
                setForm({ ...form, creditCardPlaceHolder: val });
              }}
            />

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <DS.Input
                  type="text"
                  value={form.creditCardYear}
                  label="Year"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardYear: val });
                  }}
                />
              </div>
              <div className="col-span-4">
                <DS.Input
                  type="text"
                  value={form.creditCardExpiryMonth}
                  label="Month"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryMonth: val });
                  }}
                />
              </div>
              <div className="col-span-4">
                <DS.Input
                  type="text"
                  value={form.creditCardCVV}
                  label="CVV"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardCVV: val });
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </DS.Modal>
    </div>
  );
}
