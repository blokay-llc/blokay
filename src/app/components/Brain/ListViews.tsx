"use client";
import React, { useState, useEffect, useRef } from "react";
import { viewList, addView } from "@/app/services/brain";
import {
  AppButton,
  AppModal,
  AppInput,
  AppLoader,
} from "@/app/components/DS/Index";
import { useSession } from "next-auth/react";

function ListViews({}) {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const modalRef: any = useRef();
  const [views, setViews] = useState([]);
  const [form, setForm]: any = useState({ search: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listViews();
  }, []);

  const listViews = () => {
    setLoading(true);
    viewList()
      .then((result) => {
        setViews(result.Views);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickCreateNew = () => {
    modalRef.current.showModal();
  };

  const handleSaveView = () => {
    addView(form).then((result) => {
      modalRef.current.hideModal();
      listViews();
      setForm({ search: "" });
    });
  };

  const viewsComputed = () => {
    const s: string = form.search.toLowerCase();
    return views
      .map((view: any) => {
        return {
          ...view,
          Views: view.Views.filter((v: any) => {
            return (
              (v.name && v.name.toLowerCase().includes(s)) ||
              (view.name && view.name.toLowerCase().includes(s))
            );
          }),
        };
      })
      .filter((view: any) => {
        return view.Views.length > 0;
      });
  };

  const onLimit = () => {
    if (views.length <= 0) return false;
    const created = views.reduce((acc: any, view: any) => {
      return (acc += view.Views.length);
    }, 0);
    return created >= 10;
  };

  return (
    <div className="">
      <div className=" flex items-center justify-between gap-5 mb-10">
        <div className="lg:w-full mr-auto">
          <AppInput
            type="view"
            value={form.search}
            onChange={(val: string) => {
              setForm({ ...form, search: val });
            }}
            icon="search"
            className="w-full"
            label="Search"
          />
        </div>
        {isAdmin && !onLimit() && !loading && (
          <AppButton
            icon="wizard"
            text="Add new"
            onClick={() => handleClickCreateNew()}
            variant="primary"
            size="md"
            className="shrink-0"
          />
        )}
      </div>
      <div className="">
        {loading && <AppLoader size="md" className="mx-auto" />}
        {!loading && (
          <div>
            {isAdmin && onLimit() && (
              <div
                className=" text-purple-900 font-light px-3 py-5 rounded-xl mb-10 flex items-center justify-between gap-5"
                style={{
                  background: "linear-gradient(45deg, #d8b4fe, #abb5fc)",
                }}
              >
                <div>You need to add a credit card to continue building</div>
                <AppButton
                  href="/dashboard/billing"
                  text="Upgrade"
                  variant="primary"
                  size="sm"
                />
              </div>
            )}

            <h2 className="text-stone-800 text-2xl mb-5 ">My views</h2>

            <div className="flex flex-col gap-3 lg:gap-5">
              {viewsComputed().map((view: any) => (
                <div>
                  {view.name && <h2 className="mb-5 font-bold">{view.name}</h2>}
                  <div className="flex flex-wrap items-center gap-3 lg:gap-5">
                    {view.Views.map((view: any) => (
                      <a
                        href={"/dashboard/view/" + view.slug}
                        key={view.id}
                        className="bg-white shadow-sm border-2 border-transparent transition	 hover:border-stone-600 p-3 lg:p-5 rounded-xl flex items-center gap-3 hover:bg-stone-50"
                      >
                        {/* <AppIcon icon={view.icon} className="size-8" /> */}
                        <div className="font-light">{view.name}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AppModal
        title="Add new"
        footer={
          <AppButton
            text="Add new"
            onClick={() => handleSaveView()}
            variant="primary"
            className="w-full"
            size="md"
          />
        }
        size="sm"
        ref={modalRef}
      >
        <AppInput
          type="text"
          value={form.name}
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
          label={"Nombre"}
        />
      </AppModal>
    </div>
  );
}

export default ListViews;
