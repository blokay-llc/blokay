"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
import Tree from "./Tree";
import { useSession } from "next-auth/react";

type MenuOptionProps = {
  name: string;
  icon: string;
  href: string;
};

const MenuOption = ({ name, icon, href }: MenuOptionProps) => {
  return (
    <li>
      <a
        className="py-1 text-sm hover:bg-stone-100 dark:hover:bg-stone-950 rounded-lg px-1.5 flex justify-between items-center"
        href={href}
      >
        <div>{name}</div>
        <DS.Icon icon={icon} className="size-5 fill-stone-700" />
      </a>
    </li>
  );
};

export default function Menu({
  views = [],
  view = null,
  onClickNeuron = null,
  editMode = null,
  neurons = [],
}: any) {
  const { isMobile } = useScreenDetector();

  const { data: session }: any = useSession();

  const isAdmin = session?.user?.rol == "admin";
  const [search, setSearch] = useState("");

  return (
    <div className="lg:pt-0 pt-16">
      <div className="lg:static pb-3 lg:px-0 px-3 lg:pt-0 pt-3 fixed z-10 left-0 top-0 w-full">
        <div className="border   bg-white dark:bg-stone-800/90 backdrop-blur-md md:dark:bg-stone-800 font-light border-stone-300 dark:border-stone-950  rounded-lg text-sm shadow py-2  text-stone-800 dark:text-stone-200 w-full lg:block flex items-center gap-5 lg:px-0 px-3">
          <div className="px-2 flex items-center gap-5 lg:py-5 py-3">
            <a href="/dashboard">
              <img
                src="/logo.svg"
                className=" h-8 shrink-0 dark:hidden block"
              />
              <img
                src="/logo-white.svg"
                className=" h-6 shrink-0 dark:block hidden"
              />
            </a>
            {session?.business?.logo && !isAdmin && (
              <img
                src={session?.business?.logo}
                className=" max-h-8 shrink-0 max-w-32"
              />
            )}
          </div>

          {view && !isMobile && (
            <div className="px-2">
              <DS.Input
                type="text"
                value={search}
                label="Search action"
                onChange={(s: string) => {
                  setSearch(s);
                }}
              />
            </div>
          )}
          <ul className="py-3 px-2 lg:block hidden ">
            <MenuOption name="Home" icon="right" href="/dashboard" />

            {isAdmin && (
              <MenuOption name="Users" icon="right" href="/dashboard/users" />
            )}

            {isAdmin && (
              <MenuOption
                name="Billing"
                icon="right"
                href="/dashboard/billing"
              />
            )}

            {isAdmin && (
              <MenuOption
                name="Settings"
                icon="right"
                href="/dashboard/settings"
              />
            )}

            <MenuOption name="Logout" icon="right" href="/logout" />
          </ul>

          <div className="lg:block hidden">
            {editMode && views?.length > 0 && (
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

        <div className="text-xs text-stone-400 mt-3 md:flex gap-3 px-2 hidden">
          <a href="https://blokay.com/contact">Contact</a>
          <a href="https://blokay.com/privacy">Privacy policy</a>
        </div>
      </div>
    </div>
  );
}
