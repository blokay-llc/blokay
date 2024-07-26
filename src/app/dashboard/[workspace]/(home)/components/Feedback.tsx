"use client";
import { useRef, useState } from "react";
import { DS } from "@blokay/react";
import { useApi } from "@/hooks/useApi";
import { sendFeedback } from "@/app/services/users";

export default function Feedback() {
  const [form, setForm]: any = useState({});
  const modalFeedback: any = useRef();

  const { loading, errors, callApi } = useApi(sendFeedback);

  const handleSendFeedback = () => {
    callApi(form).then(() => {
      modalFeedback.current.hideModal();
    });
  };

  return (
    <>
      <div className="border border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-transparent rounded-lg p-5">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
          Feedback
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 font-light text-sm mb-3">
          We would love to hear your thoughts on how we can improve our product.
          Your feedback helps us make our product better.
        </p>
        <DS.Button
          text="Give us feedback"
          icon="feedback"
          variant="secondary"
          size="md"
          onClick={() => modalFeedback.current.showModal()}
        />
      </div>

      <DS.Modal
        title="Give us feedback"
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="Cancel"
              onClick={() => modalFeedback.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Send"
              onClick={() => handleSendFeedback()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loading}
              disabled={!form.feedback}
            />
          </div>
        }
        size="sm"
        ref={modalFeedback}
      >
        <DS.Textarea
          value={form.feedback}
          label="Your feedback"
          error={errors?.feedback}
          onChange={(val: string) => {
            setForm({ ...form, feedback: val });
          }}
        />
      </DS.Modal>
    </>
  );
}
