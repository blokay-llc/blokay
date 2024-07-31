"use client";
import { useRef } from "react";
import { DS } from "@blokay/react";
import { cn } from "@/lib/utils";
export default function AppVideoCard({
  duration,
  title,
  subtitle,
  name,
  youtubeUrl,
  previewImage,
}: any) {
  const modalRef: any = useRef();

  return (
    <>
      <div
        className={cn(
          "border px-5 group  transition  rounded-lg py-5 flex cursor-pointer select-none justify-between gap-5 items-center",
          "border-neutral-300 text-neutral-900 dark:text-white  bg-gradient-to-r from-white to-neutral-100 dark:from-neutral-800 dark:to-neutral-950"
        )}
        onClick={() => modalRef.current.showModal()}
      >
        <div>
          <div className="text-2xl font-bold">{title}</div>
          <div className="font-light">{subtitle}</div>
        </div>
        <div className="shadow-lg bg-white group-hover:bg-indigo-100 px-3 py-2 rounded-xl border-black/10 border flex gap-10 items-center">
          <div className="text-sm text-blue-950">
            <div>{name}</div>
            <div className="text-neutral-600">{duration}</div>
          </div>

          <div>
            <img
              src={
                previewImage ||
                "http://i3.ytimg.com/vi/" + youtubeUrl + "/hqdefault.jpg"
              }
              className="size-16 object-cover rounded-full "
            />
          </div>
        </div>
      </div>

      <DS.Modal size="lg" position="center" ref={modalRef}>
        <iframe
          width="100%"
          height="600"
          src={
            "https://www.youtube.com/embed/" +
            youtubeUrl +
            "?si=V-JkZZmsg-6dE9Fu"
          }
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </DS.Modal>
    </>
  );
}
