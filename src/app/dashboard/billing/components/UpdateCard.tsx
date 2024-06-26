"use client";
import { DS } from "@blokay/react";

export default function UpdateCard({ onClick }: any) {
  return (
    <div className="border border-neutral-800 rounded-lg py-5 px-5 ">
      <div className="flex gap-5 justify-between">
        <h2 className="font-bold text-xl ">Edit credit card</h2>

        <div>
          <DS.Button
            text="Edit card"
            onClick={onClick}
            variant="primary"
            size="sm"
            className="w-full"
            icon="card"
          />
        </div>
      </div>

      <p className=" text-sm font-light text-neutral-500">
        You can edit your credit card details here.
      </p>
    </div>
  );
}
