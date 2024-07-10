"use client";
import { useState } from "react";
import { DS } from "@blokay/react";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
import Tree from "./Tree";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type MenuOptionProps = {
  name: string;
  icon: string;
  href: string;
  currentPath: string;
};

const MenuOption = ({ name, icon, currentPath, href }: MenuOptionProps) => {
  const isActive = (href: string) => currentPath === href;

  return (
    <li>
      <a
        className={
          "py-1.5 text-sm   rounded-lg px-1.5 flex justify-between items-center gap-2 " +
          (isActive(href)
            ? "dark:text-white text-neutral-600 font-medium dark:bg-white/10 bg-black/10 "
            : "dark:hover:bg-neutral-800 hover:bg-neutral-200")
        }
        href={href}
      >
        <DS.Icon
          icon={icon}
          className={
            "size-5 fill-neutral-500  " +
            (isActive(href)
              ? "dark:fill-white fill-neutral-800"
              : "dark:fill-neutral-500")
          }
        />
        <div>{name}</div>
        <DS.Icon
          icon="right"
          className="size-5 ml-auto fill-neutral-700 dark:fill-neutral-500"
        />
      </a>
    </li>
  );
};

type MenuProps = {
  views?: any[];
  view?: any;
  onClickBlock?: any;
  editMode?: any;
  blocks?: any[];
};
export default function Menu({
  views = [],
  view = null,
  onClickBlock = null,
  editMode = null,
  blocks = [],
}: MenuProps) {
  const pathName = usePathname();
  const { isMobile } = useScreenDetector();

  const { data: session }: any = useSession();

  const isAdmin = session?.user?.rol == "admin";
  const [search, setSearch] = useState("");

  return (
    <div className="lg:pt-0 pt-16">
      <div className="lg:static pb-3 lg:px-0 px-3 lg:pt-0 pt-3 fixed z-10 left-0 top-0 w-full">
        <div className="border   bg-white dark:bg-black backdrop-blur-md  font-light border-neutral-300 dark:border-neutral-800  rounded-lg text-sm  py-2  text-neutral-600 dark:text-neutral-200 w-full lg:block flex items-center gap-5 lg:px-0 px-3">
          <div className="px-4 flex items-center gap-5  py-3 lg:pt-5">
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
                autocomplete="off"
              />
            </div>
          )}
          <ul className="py-3 px-2 lg:block hidden ">
            <MenuOption
              currentPath={pathName}
              name="Home"
              icon="home"
              href="/dashboard"
            />

            {isAdmin && (
              <MenuOption
                currentPath={pathName}
                name="Users"
                icon="account"
                href="/dashboard/users"
              />
            )}

            {isAdmin && (
              <MenuOption
                currentPath={pathName}
                name="Billing"
                icon="bill"
                href="/dashboard/billing"
              />
            )}

            {isAdmin && (
              <MenuOption
                currentPath={pathName}
                name="Settings"
                icon="config"
                href="/dashboard/settings"
              />
            )}

            <MenuOption
              currentPath={pathName}
              name="Logout"
              icon="security"
              href="/logout"
            />
          </ul>

          <div className="lg:block hidden">
            {editMode && views?.length > 0 && (
              <Tree
                views={views}
                onClickBlock={onClickBlock}
                view={view}
                search={search}
                blocks={blocks}
                editMode={editMode}
              />
            )}
          </div>
        </div>

        <div className="text-xs text-neutral-400 mt-3 md:flex gap-3 px-2 hidden">
          <a href="https://blokay.com/contact">Contact</a>
          <a href="https://blokay.com/privacy">Privacy policy</a>
        </div>
      </div>
    </div>
  );
}
