"use client";
import { useState, useEffect, useRef } from "react";
import { AppIcon, AppModal, AppButton } from "@/app/components/DS/Index";

export default function Header({ view, save, isAdmin }: any) {
  const modalRef: any = useRef();
  const [title, setTitle] = useState("Untitled view");

  useEffect(() => {
    setTitle(view?.name);
  }, [view]);

  const clickShare = (neuron: any) => {
    modalRef.current.showModal();
  };

  const names = view?.Users ? view.Users.map((u: any) => u.name) : [];
  const namesComputed = () => {
    return names.map((n: string) => {
      let short = n.split(" ");
      let n1 = short?.[0]?.[0] || "";
      let n2 = short?.[1]?.[0] || "";
      return { name: n, short: n1 + n2 };
    });
  };

  let colors = [
    { bg: "bg-rose-500", text: "text-rose-900" },
    { bg: "bg-yellow-500", text: "text-yellow-900" },
    { bg: "bg-indigo-500", text: "text-indigo-900" },
    { bg: "bg-lime-500", text: "text-lime-900" },
  ];

  return (
    <div className="flex justify-between items-center mb-8 lg:mb-16">
      <div className="flex gap-3 items-center w-full">
        <a className="" href="/dashboard">
          <div className="size-8 p-1 cursor-pointer border-2 border-stone-50 hover:border-stone-300 rounded-full bg-white">
            <AppIcon icon="left" className="fill-stone-900 size-full" />
          </div>
        </a>
        {view?.icon && <AppIcon icon={view.icon} className="size-6" />}

        {isAdmin && (
          <div className="w-full flex-1">
            <input
              className="text-stone-800 text-2xl bg-transparent focus:outline-none w-full"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                save({ name: e.target.value });
              }}
            />
          </div>
        )}
        {!isAdmin && <h2 className="text-2xl text-stone-800">{title}</h2>}
      </div>

      <div className="hidden lg:flex gap-1 items-center select-none ">
        {namesComputed().map((obj: any, index: any) => (
          <div
            key={"people-" + index}
            className={`group  text-sm relative size-8 rounded-full flex items-center justify-center ${colors[index].bg} ${colors[index].text}`}
          >
            {obj.short.toUpperCase()}
            <div className="group-hover:block absolute -bottom-7 -left-10  w-26 text-center hidden  bg-stone-900 text-stone-100 rounded-sm py-1 px-2 text-xs">
              <div className="truncate">{obj.name}</div>
            </div>
          </div>
        ))}

        <div
          onClick={clickShare}
          className="border-2 border-stone-600 rounded-lg text-sm text-stone-600 px-5 py-2 ml-3 hover:bg-white"
        >
          Share
        </div>
      </div>

      <AppModal
        size="sm"
        position="center"
        title="Share page"
        ref={modalRef}
        footer={
          <div className="flex items-center justify-between">
            <AppButton
              text="Copy link"
              // onClick={() => handleClickCreateNew()}
              variant="primary"
              size="md"
            />
            <AppButton
              text="Close"
              // onClick={() => handleClickCreateNew()}
              variant="secondary"
              size="md"
            />
          </div>
        }
      >
        <div>{JSON.stringify(view?.SharedUsers)}</div>
      </AppModal>
    </div>
  );
}
