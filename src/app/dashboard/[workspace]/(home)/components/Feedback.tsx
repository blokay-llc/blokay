"use client";
import { useRef, useState } from "react";
import { DS } from "@blokay/react";
import { useApi } from "@/hooks/useApi";
import { sendFeedback } from "@/app/services/users";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
export default function Feedback() {
  const [form, setForm]: any = useState({});
  const modalFeedback: any = useRef();
  const { isMobile } = useScreenDetector();

  const { loading, errors, callApi } = useApi(sendFeedback);

  const handleSendFeedback = () => {
    callApi(form).then(() => {
      modalFeedback.current.hideModal();
    });
  };

  return (
    <>
      <DS.Button
        text={isMobile ? "" : "Feedback"}
        icon="feedback"
        variant="secondary"
        size="md"
        onClick={() => modalFeedback.current.showModal()}
      />

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
