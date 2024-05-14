"use client";
import { useState, useRef } from "react";
import {
  AppInput,
  AppButton,
  AppSelect,
  AppModal,
} from "@/app/components/DS/Index";
import UpgradePlan from "@/app/components/UI/UpgradePlan";
import { addCard } from "@/app/services/users";

export default function BillingView() {
  const modalRef: any = useRef();
  const [form, setForm]: any = useState({});
  const [error, setError]: any = useState(null);
  const [loading, setLoading] = useState(false);

  const range = (start: number, finish: number) => {
    let arr = [];
    for (let i = start; i < finish; i++) {
      arr.push(i);
    }
    return arr;
  };

  /*
    We don't save your credit cards in our database. Instead, we tokenize your cards using an external service, and we only send the token.
  */
  const formAction = async () => {
    setLoading(true);
    setError(null);

    try {
      let result: any = await fetch(
        process.env.NEXT_PUBLIC_WOMPI_TOKENIZE_URL || "",
        {
          headers: {
            Authorization: "Bearer " + process.env.NEXT_PUBLIC_WOMPI_PUB_KEY,
          },
          method: "POST",
          body: JSON.stringify({
            number: form.creditCardNumber,
            cvc: form.creditCardCVC,
            exp_month: form.creditCardExpiryMonth,
            exp_year: form.creditCardExpiryYear,
            card_holder: form.creditCardPlaceHolder,
          }),
        }
      );
      result = await result.json();
      if (result.error) {
        throw { message: "Invalid fields " };
      }

      let token_card = result.data.id;
      let last_four = result.data.last_four;

      // we only save the card token and last_four digits
      await addCard(token_card, last_four);
    } catch (err: any) {
      console.log(err);
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

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
            disabled={
              !form.creditCardNumber ||
              !form.creditCardPlaceHolder ||
              !form.creditCardExpiryYear ||
              !form.creditCardExpiryMonth
            }
            text="Save"
            icon="account"
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={loading}
            onClick={formAction}
          />
        }
        size="sm"
        ref={modalRef}
      >
        <div className="0">
          <div className="flex flex-col gap-5">
            {error && <div className="text-red-400">{error}</div>}
            <AppInput
              type="text"
              value={form.creditCardNumber}
              label="Card number"
              onChange={(val: string) => {
                setForm({ ...form, creditCardNumber: val });
              }}
            />

            <AppInput
              type="text"
              value={form.creditCardPlaceHolder}
              label="Name on credit card"
              onChange={(val: string) => {
                setForm({ ...form, creditCardPlaceHolder: val });
              }}
            />

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-4">
                <AppSelect
                  value={form.creditCardExpiryYear}
                  label="Year"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryYear: val });
                  }}
                >
                  <option value={undefined}>00</option>
                  {range(24, 50).map((year) => (
                    <option value={year}>{year}</option>
                  ))}
                </AppSelect>
              </div>
              <div className="col-span-4">
                <AppSelect
                  value={form.creditCardExpiryMonth}
                  label="Month"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardExpiryMonth: val });
                  }}
                >
                  <option value={undefined}>00</option>
                  {[
                    "01",
                    "02",
                    "03",
                    "04",
                    "05",
                    "06",
                    "07",
                    "08",
                    "09",
                    "10",
                    "11",
                    "12",
                  ].map((month) => (
                    <option value={month}>{month}</option>
                  ))}
                </AppSelect>
              </div>
              <div className="col-span-4">
                <AppInput
                  type="text"
                  value={form.creditCardCVC}
                  label="CVV"
                  onChange={(val: string) => {
                    setForm({ ...form, creditCardCVC: val });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </AppModal>
    </div>
  );
}
