"use client";
import { useState, useEffect, useRef } from "react";
import { AppIcon, AppModal, AppButton } from "@/app/components/DS/Index";
import ShareView from "@/app/components/UI/ShareView";
import AvatarName from "./UI/AvatarName";
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
        {names.map((name: string, index: any) => (
          <AvatarName key={"people-" + index} name={name} colorIndex={index} />
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
              icon="copy"
              // onClick={() => handleClickCreateNew()}
              variant="primary"
              size="md"
            />
            <AppButton
              icon="close"
              text="Close"
              onClick={() => {
                modalRef.current.hideModal();
              }}
              variant="secondary"
              size="md"
            />
          </div>
        }
      >
        {view?.SharedUsers?.length > 0 && (
          <ShareView SharedUsers={view.SharedUsers} />
        )}
      </AppModal>
    </div>
  );
}
