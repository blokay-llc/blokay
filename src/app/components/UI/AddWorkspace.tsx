import { useContext, useState } from "react";
import { DS } from "@blokay/react";
import { Context } from "@/app/components/Providers/Workspace";
import { useRouter } from "next/navigation";

export default function AddWorkspace() {
  const { currentWorkspace } = useContext(Context);
  const [show, setShow] = useState(true);
  const router = useRouter();
  if (currentWorkspace.datasources > 0) return null;
  if (!show) return null;
  return (
    <div className="top-0 left-0 absolute w-full h-full z-10 backdrop-blur-sm bg-neutral-100/60 border border-neutral-300 p-5 rounded-lg flex items-center justify-center">
      <div>
        <div className="text-center text-2xl">
          Probably you need to add a datasource to this workspace
        </div>
        <div className="flex justify-center gap-3 mt-5">
          <DS.Button
            text="Close and continue"
            onClick={() => {
              setShow(false);
            }}
            icon="close"
            variant="secondary"
            size="sm"
          />
          <DS.Button
            text="Add datasource"
            onClick={() => {
              router.push(`/dashboard/${currentWorkspace.id}/settings`);
            }}
            icon="add"
            variant="primary"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}
