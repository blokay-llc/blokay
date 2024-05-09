"use client";
import { useState, useEffect, useRef } from "react";
import { AppIcon, AppModal, AppButton } from "@/app/components/DS/Index";
import ShareView from "@/app/components/UI/ShareView";
import { useScreenDetector } from "@/app/hooks/user-screen-detector";
import AvatarName from "../../../../components/UI/AvatarName";
import Toolbar from "./Toolbar";

export default function Header({
  view,
  save,
  isAdmin,
  onCreate,
  refresh,
  editMode,
  setEditMode,
}: any) {
  const { isMobile } = useScreenDetector();
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
        {isAdmin && !isMobile && (
          <Toolbar
            onCreate={onCreate}
            refresh={refresh}
            title={title}
            onSetTitle={(val: any) => {
              setTitle(val);
              save({ name: val });
            }}
            editMode={editMode}
            setEditMode={setEditMode}
          />
        )}
        {!isAdmin && (
          <>
            <a className="" href="/dashboard">
              <div className="size-8 p-1 cursor-pointer border-2 border-stone-50 dark:border-stone-800 hover:border-stone-300 dark:hover:bg-stone-700 dark:hover:border-stone-700 rounded-full bg-white dark:bg-stone-800">
                <AppIcon
                  icon="left"
                  className="fill-stone-900 dark:fill-stone-200 size-full"
                />
              </div>
            </a>
            <h2 className="text-2xl text-stone-800 dark:text-stone-400">
              {title}
            </h2>
          </>
        )}
      </div>

      <div className="hidden lg:flex gap-1 items-center select-none ">
        {names.map((name: string, index: any) => (
          <AvatarName key={"people-" + index} name={name} colorIndex={index} />
        ))}

        <div
          onClick={clickShare}
          className="flex items-center gap-2 border-2 border-stone-300 dark:border-stone-700 rounded-lg text-sm text-stone-500 px-3 py-2 ml-3 hover:bg-white dark:hover:bg-stone-600"
        >
          <AppIcon icon="share" className="size-4 fill-stone-500" />
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
