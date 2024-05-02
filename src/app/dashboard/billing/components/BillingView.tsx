"use client";
import { useState, useRef } from "react";
import { AppInput, AppButton, AppModal } from "@/app/components/DS/Index";
import UpgradePlan from "@/app/components/UI/UpgradePlan";

export default function BillingView() {
  const modalRef: any = useRef();
  const [form, setForm]: any = useState({});
  const [loading, setLoading] = useState(false);

  const formAction = () => {};

  return (
    <div>
      <UpgradePlan
        onClick={() => {
          modalRef.current.showModal();
        }}
      />

      <AppModal
        title="Add card"
        footer={
          <AppButton
            text="Guardar tarjeta"
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
          <form action={formAction} className="flex flex-col gap-5">
            <AppInput
              type="text"
              value={form.creditCardNumber}
              label="Tarjeta de crédito"
              onChange={(val: string) => {
                setForm({ ...form, creditCardNumber: val });
              }}
            />

            <AppInput
              type="text"
              value={form.creditCardPlaceHolder}
              label="Nombre en la tarjeta de crédito"
              onChange={(val: string) => {
                setForm({ ...form, creditCardPlaceHolder: val });
              }}
            />

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <AppInput
                  type="text"
                  value={form.creditCardYear}
                  label="Año"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardYear: val });
                  }}
                />
              </div>
              <div className="col-span-4">
                <AppInput
                  type="text"
                  value={form.creditCardExpiryMonth}
                  label="Mes"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryMonth: val });
                  }}
                />
              </div>
              <div className="col-span-4">
                <AppInput
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
      </AppModal>
    </div>
  );
}
