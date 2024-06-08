"use client";
import { useState, useEffect, useRef } from "react";
import { DS } from "@blokay/react";
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
              <div className="size-8 p-1 cursor-pointer border-2 border-neutral-50 dark:border-neutral-800 hover:border-neutral-300 dark:hover:bg-neutral-700 dark:hover:border-neutral-700 rounded-full bg-white dark:bg-neutral-800">
                <DS.Icon
                  icon="left"
                  className="fill-neutral-900 dark:fill-neutral-200 size-full"
                />
              </div>
            </a>
            <h2 className="text-2xl text-neutral-800 dark:text-neutral-400">
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
          className="flex items-center gap-2 border-2 border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-500 px-3 py-2 ml-3 hover:bg-white dark:hover:bg-neutral-600"
        >
          <DS.Icon icon="share" className="size-4 fill-neutral-500" />
          Share
        </div>
      </div>

      <DS.Modal
        size="sm"
        position="center"
        title="Share page"
        ref={modalRef}
        footer={
          <div className="flex items-center justify-between">
            <DS.Button
              text="Copy link"
              icon="copy"
              // onClick={() => handleClickCreateNew()}
              variant="primary"
              size="md"
            />
            <DS.Button
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
      </DS.Modal>
    </div>
  );
}
