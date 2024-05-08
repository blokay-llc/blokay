"use client";
import React, { useState, useEffect } from "react";
import { AppIcon, AppLoader } from "../Index";
import { postMultimedia } from "@/app/services/_base";

const AppFile = ({
  label,
  preview,
  classSelector,
  endpoint = "marketplace/uploadAsset",
  accept = ".pdf,.jpg,.jpeg,.png,.webp",
  size = "md",
  onError,
  onDone,
  onChangeFiles,
}: any) => {
  const [loading, setLoading] = useState(false);
  const [prev, setPrev] = useState("");
  const [filelist, setFileList]: any = useState([]);
  const [id] = useState((Math.random() + 1).toString(36).substring(7));

  const ext = () => {
    let file = prev || preview;
    return file ? file.split(".").pop() : null;
  };
  const previewImage = () => {
    let file = prev || preview;

    if (ext() === "pdf") {
      return null;
    }
    return file;
  };

  const onChange = () => {
    let el: any = document.getElementById(id);
    setFileList(el.files);
  };

  const sendFile = (pics: any[], endpoint: string) => {
    let formData = new FormData();
    formData.append("file", pics[0]);
    return postMultimedia(endpoint, formData, {
      // token: typeof window != "undefined" ? window.token_web : "",
    });
  };

  const uploadPhoto = (pics: any) => {
    setLoading(true);
    let formData = new FormData();
    formData.append("file", pics[0]);

    return sendFile(pics, endpoint)
      .then((result: any) => {
        onDone && onDone(result);
        if (result.data.Resource) {
          setPrev(result.data.Resource.preview);
          onChangeFiles && onChangeFiles(result.data.Resource);
        }
      })
      .catch((err: any) => {
        onError && onError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (filelist.length > 0) {
      uploadPhoto(filelist);
    }
  }, [filelist]);

  const renderImage = () => {
    if (loading) {
      return <AppLoader className="mx-auto px-3" size="sm" />;
    } else if (previewImage()) {
      return (
        <img
          src={previewImage()}
          alt="preview"
          className="rounded-lg mx-auto"
          style={{ width: "50px", height: "50px" }}
        />
      );
    } else if (ext() === "pdf") {
      return (
        <AppIcon
          icon="pdf"
          className="h-10 fill-stone-800 dark:fill-stone-200"
        />
      );
    } else {
      return (
        <AppIcon
          icon="upload"
          className="h-10 fill-stone-800 dark:fill-stone-200"
        />
      );
    }
  };

  return (
    <div
      className={`p-2 rounded-lg inline-block bg-stone-100 dark:bg-stone-900 dark:border-stone-900 dark:hover:bg-black border-2 border-stone-200 hover:bg-stone-200 w-full  ${classSelector} ${size}`}
    >
      <input
        type="file"
        className="hidden"
        id={id}
        onChange={onChange}
        accept={accept}
      />

      <label htmlFor={id} className=" items-center gap-3 cursor-pointer flex">
        <div className="prev">{renderImage()}</div>

        <div>
          {label ? (
            <div className="text-sm block py-1 text-stone-800 dark:text-stone-100 font-medium">
              {label}
            </div>
          ) : null}

          <div className="text-left font-light text-xs text-stone-600 dark:text-stone-300">
            <p className="md:hidden block">Click here to select a file</p>
            <p className="hidden md:block">Touch here to select.</p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default AppFile;
