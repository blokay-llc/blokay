import { DS } from "@blokay/react";
export default function Workspace({ workspace }: any) {
  return (
    <div className="select-none px-2 mb-3 pb-3 border-b border-neutral-300 dark:border-neutral-800">
      <div className="hover:bg-neutral-100 rounded-xl px-3 py-2 flex items-center gap-3">
        <div className="text-sm bg-neutral-200 text-neutral-600 rounded-lg px-3 py-1">
          Workspace
        </div>
        <div>Main</div>
        <div className="ml-auto">
          <DS.Icon
            icon="right"
            className="size-5 ml-auto fill-neutral-700 dark:fill-neutral-500"
          />
        </div>
      </div>
    </div>
  );
}
