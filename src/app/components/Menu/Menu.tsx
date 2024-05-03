"use client";
import { useState } from "react";
import { AppInput, AppIcon } from "@/app/components/DS/Index";
import Tree from "./Tree";

import { useSession } from "next-auth/react";

export default function Menu({
  views = [],
  view = null,
  onClickNeuron = null,
  editMode = null,
  neurons = [],
}: any) {
  const { data: session }: any = useSession();

  const isAdmin = session?.user?.rol == "admin";
  const [search, setSearch] = useState("");

  return (
    <div className="lg:pt-0 pt-16">
      <div className="lg:static lg:px-0 px-3 lg:pt-0 pt-3 fixed z-10 left-0 top-0 w-full">
        <div className="border   bg-white font-light border-stone-300  rounded-lg text-sm shadow py-2  text-stone-800 w-full lg:block flex items-center gap-5 lg:px-0 px-3">
          <div>
            <a href="/dashboard">
              <img src="/logo.svg" className="lg:px-2 lg:py-5" />
            </a>
          </div>
          <div className="px-2">
            <AppInput
              type="text"
              value={search}
              label="Search action"
              onChange={(s: string) => {
                setSearch(s);
              }}
            />
          </div>
          <ul className="py-3 px-2 lg:block hidden ">
            <li>
              <a
                className="items-center py-1 text-sm hover:bg-stone-100 rounded-lg px-1.5 flex justify-between"
                href="/dashboard"
              >
                <div>Home</div>
                <AppIcon icon="right" className="size-5 fill-stone-700" />
              </a>
            </li>

            <li>
              <a
                className="py-1 text-sm hover:bg-stone-100 rounded-lg px-1.5 flex justify-between items-center"
                href="/dashboard/users"
              >
                <div>Users</div>
                <AppIcon icon="right" className="size-5 fill-stone-700" />
              </a>
            </li>

            <li>
              <a
                className="py-1 text-sm hover:bg-stone-100 rounded-lg px-1.5 flex justify-between items-center"
                href="/dashboard/billing"
              >
                <div>Billing</div>
                <AppIcon icon="right" className="size-5 fill-stone-700" />
              </a>
            </li>

            {isAdmin && (
              <li>
                <a
                  className="py-1 text-sm hover:bg-stone-100 rounded-lg px-1.5 flex justify-between items-center"
                  href="/dashboard/settings"
                >
                  <div>Settings</div>
                  <AppIcon icon="right" className="size-5 fill-stone-700" />
                </a>
              </li>
            )}

            <li>
              <a
                className="py-1 text-sm hover:bg-stone-100 rounded-lg px-1.5 flex justify-between items-center"
                href="/logout"
              >
                <div>Logout</div>
                <AppIcon icon="right" className="size-5 fill-stone-700" />
              </a>
            </li>
          </ul>

          <div className="lg:block hidden">
            {editMode && neurons?.length > 0 && (
              <Tree
                views={views}
                onClickNeuron={onClickNeuron}
                view={view}
                search={search}
                neurons={neurons}
                editMode={editMode}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
