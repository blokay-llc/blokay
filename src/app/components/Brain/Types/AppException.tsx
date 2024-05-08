"use client";
import { useRef } from "react";
import { AppIcon, AppModal } from "@/app/components/DS/Index";

function ShowError({ type, message, fullDescription }: any) {
  return (
    <div>
      <div className="text-2xl font-bold uppercase mb-3">{type}</div>
      <div className="text-red-500">{message}</div>
      {fullDescription && (
        <div className="font-light text-stone-800 bg-stone-200 p-5 rounded-lg mt-5">
          {fullDescription}
        </div>
      )}
    </div>
  );
}

function ErrorDecide({ error }: any) {
  console.error(error);

  if (error.name == "SQL_ERROR") {
    return (
      <ShowError
        type={error.name}
        message={error.message}
        fullDescription={error.sql}
      />
    );
  }

  return <ShowError type={error?.name} message={error?.message} />;
}
export default function ({ data }: any) {
  const modalRef: any = useRef();

  return (
    <>
      <div
        className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 cursor-pointer  text-white px-3 py-1 text-sm rounded-lg z-30 flex items-center gap-1 select-none"
        onClick={() => {
          modalRef.current.showModal();
        }}
      >
        <AppIcon icon="error" className="size-4 fill-white" />
        <div> Error</div>
      </div>

      <AppModal size="lg" position="center" ref={modalRef}>
        <ErrorDecide error={data} />
      </AppModal>
    </>
  );
}
