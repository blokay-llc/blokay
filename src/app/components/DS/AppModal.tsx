"use client";
import React, { forwardRef, useState, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import { AppIcon } from "./Index";
import { CSSTransition } from "react-transition-group";

let container = typeof document != "undefined" ? document.body : null;
function Modal(
  {
    title,
    position,
    titleLogo,
    classSection,
    size,
    clickBack,
    children,
    footer,
    onClose = null,
  }: any,
  ref: any
) {
  const [showing, setShowing] = useState(false);
  const [bgColor, setBackgroundColor] = useState("white");
  const [error, setError] = useState("");

  const showModal = () => {
    setShowing(true);
  };

  const hideModal = () => {
    onClose && onClose();
    setShowing(false);
    setError("");
  };

  const clear = () => {
    setError("");
  };

  const putError = (error: string) => {
    setError(error);
  };

  const changeColorModal = (color: string) => {
    setBackgroundColor(color);
  };

  useImperativeHandle(ref, () => ({
    showModal,
    hideModal,
    clear,
    putError,
    changeColorModal,
  }));

  const positionClass = () => {
    if (position === "center") {
      return "justify-center items-center rounded-3xl";
    }
    return "";
  };

  const sizeClass = () => {
    if (size === "sm") {
      return "lg:w-96 w-full mx-3 ";
    } else if (size === "md") {
      return "lg:w-1/2 w-full mx-3 ";
    } else if (size === "lg") {
      return "lg:w-2/3 w-full mx-3 ";
    }
    return "";
  };

  return container
    ? createPortal(
        <>
          <CSSTransition
            mountOnEnter
            unmountOnExit
            in={showing}
            timeout={{ enter: 300, exit: 300 }}
            classNames="modal-back"
          >
            <div className="fixed z-50 backdrop-blur-sm bg-stone-600/40  top-0 left-0 w-full h-screen"></div>
          </CSSTransition>

          <CSSTransition
            mountOnEnter
            unmountOnExit
            in={showing}
            timeout={{ enter: 500, exit: 500 }}
            classNames="modalx"
          >
            <div
              onClick={hideModal}
              className="fixed z-50  w-full h-screen py-5  top-0 left-0 flex items-center justify-center"
            >
              <section
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className={`relative z-50 transition-all dark:text-stone-200 duration-100 ease-in-out text-black  rounded-xl   ${sizeClass()} ${positionClass()} ${size} ${classSection} ${
                  bgColor == "white" ? "bg-white dark:bg-stone-950" : ""
                }`}
                style={{ backgroundColor: bgColor != "white" ? bgColor : "" }}
              >
                {title && (
                  <div className="flex justify-between items-center border-b dark:border-stone-800 border-stone-200 py-4 px-4">
                    <div className="flex items-center justify-start gap-3">
                      <div
                        className="action-icon"
                        onClick={clickBack}
                        style={{ display: clickBack ? "block" : "none" }}
                      >
                        <svg viewBox="0 0 24 24">
                          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                        </svg>
                      </div>
                      <h2 className="text-base md:text-base">{title}</h2>
                      {titleLogo && (
                        <div>
                          <img
                            src="/web/logo.svg"
                            alt="Sigfre logo"
                            className="h-10"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      className="hover:bg-stone-200 dark:hover:bg-stone-800 p-1 rounded-full cursor-pointer"
                      onClick={hideModal}
                    >
                      <AppIcon
                        className="w-6 h-6 fill-black dark:fill-stone-200"
                        icon={position !== "bottom" ? "close" : "arrow_bottom"}
                      />
                    </div>
                  </div>
                )}
                {error && (
                  <div className=" w-full  p-3 bg-red-600 items-center text-indigo-100 leading-none flex lg:inline-flex font-light">
                    <span className="mr-2 text-left flex-auto text-white">
                      {error}
                    </span>
                  </div>
                )}
                <div
                  className={`py-5 px-4 overflow-y-auto  ${
                    error ? "with-error" : ""
                  }`}
                  style={{
                    maxHeight: `calc(100vh - ${
                      50 + (footer ? 70 : 0) + (title ? 70 : 0)
                    }px)`,
                  }}
                >
                  {children}
                </div>

                {footer && (
                  <div className="py-5 px-4 border-t dark:border-stone-800 border-stone-200">
                    <div className="footer">{footer}</div>
                  </div>
                )}
              </section>
            </div>
          </CSSTransition>
        </>,
        container
      )
    : null;
}

const AppModal = forwardRef(Modal);

export default AppModal;
