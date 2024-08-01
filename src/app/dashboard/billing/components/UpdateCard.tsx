"use client";
import { DS } from "@blokay/react";

export default function UpdateCard({ onClick }: any) {
  return (
    <div className="text-neutral-800 dark:text-white ">
      <h2 className="font-bold text-lg mb-3">Edit credit card</h2>

      <div className="text-neutral-800 dark:text-white border border-neutral-200 bg-white dark:bg-transparent dark:border-neutral-800 rounded-lg py-5 px-5 ">
        <div className="flex gap-5 justify-between items-center">
          <p className=" text-sm font-light text-neutral-500">
            You can edit your credit card details here.
          </p>
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
      </div>
    </div>
  );
}
