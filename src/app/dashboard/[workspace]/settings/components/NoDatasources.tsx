"use client";
import { DS } from "@blokay/react";

export default function NoDatasources({ addNewDataSource }: any) {
  return (
    <div>
      <div className="px-10 mt-5 mb-10 py-16 border bg-neutral-50 border-neutral-300 rounded-lg text-neutral-950 ">
        <div className="">
          <div className="border bg-neutral-100 rounded-lg border-neutral-300 size-12 flex items-center justify-center mx-auto mb-5">
            <DS.Icon
              icon="layers"
              className="size-8 fill-neutral-400 dark:fill-neutral-600"
            />
          </div>
          <h2 className="text-2xl font-medium text-center ">
            No datasources yet
          </h2>
          <p className="font-light text-sm text-center mb-5 text-neutral-600">
            Create your first datasource to get started
          </p>
          <div className="flex items-center justify-center gap-5">
            <DS.Button
              text="Create new datasource"
              onClick={() => addNewDataSource()}
              variant="secondary"
              size="lg"
              icon="wizard"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
