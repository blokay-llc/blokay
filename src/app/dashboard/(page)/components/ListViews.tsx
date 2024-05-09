"use client";
import React, { useState, useEffect, useRef } from "react";
import { viewList, addView } from "@/app/services/brain";
import {
  AppButton,
  AppModal,
  AppInput,
  AppLoader,
  AppSelect,
} from "@/app/components/DS/Index";
import { useSession } from "next-auth/react";
import AppVideoCard from "../../../components/UI/AppVideoCard";
import AvatarName from "../../../components/UI/AvatarName";
import AddCreditCard from "@/app/components/UI/AddCreditCard";

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

  const getViewsComputed = () => {
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

  const viewsCount = () => {
    return views.reduce((acc: any, view: any) => {
      return (acc += view.Views.length);
    }, 0);
  };
  const onLimit = () => {
    if (session?.business?.addedCard) return false;
    if (views.length <= 0) return false;
    return viewsCount() >= session?.business?.limitViews;
  };

  const canCreateViews = () => {
    return isAdmin && !onLimit();
  };
  const viewsComputed = getViewsComputed();

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
        {canCreateViews() && !loading && (
          <AppButton
            icon="wizard"
            text="Add new"
            onClick={() => handleClickCreateNew()}
            variant="primary"
            size="md"
            className="shrink-0"
          />
        )}
        <div className="shrink-0">
          <AvatarName name={session?.user?.name} />
        </div>
      </div>
      <div className="">
        {loading && <AppLoader size="md" className="mx-auto" />}
        {!loading && viewsComputed.length > 0 && (
          <div>
            {!canCreateViews() && !session?.business?.addedCard && (
              <div className="mb-10 ">
                <AddCreditCard text="You need to add a credit card to continue building" />
              </div>
            )}

            <h2 className="text-stone-900 dark:text-white text-2xl mb-5 ">
              My views
            </h2>

            <div className="flex flex-col gap-3 lg:gap-5">
              {viewsComputed.map((view: any) => (
                <div>
                  {view.name && (
                    <h2 className="mb-5 font-bold text-stone-900 dark:text-stone-200">
                      {view.name}
                    </h2>
                  )}
                  <div className="flex flex-wrap items-center gap-3 lg:gap-5">
                    {view.Views.map((view: any) => (
                      <a
                        href={"/dashboard/view/" + view.slug}
                        key={view.id}
                        className="bg-white dark:bg-stone-800 shadow-sm border-2 border-transparent transition	 hover:border-stone-600 text-stone-900 dark:text-stone-200 p-3 lg:p-5 rounded-xl flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800  dark:hover:bg-gradient-to-r  dark:hover:from-[#362230] dark:hover:to-[#122441]"
                      >
                        <div className="font-light">{view.name}</div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && viewsCount() <= 3 && isAdmin && (
          <div className="mt-10">
            <AppVideoCard
              youtubeUrl=""
              title="Quick intro"
              subtitle="Introduction by the Founder"
              name="Introduction"
              duration="1:09"
              preview="https://www.relume.io/app/a/adam-video.ece0d5b362faf0b7dfc4.webp"
            />
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
          label={"Name"}
        />

        {viewsComputed.length > 0 && (
          <div className="mt-3">
            <AppSelect
              value={form.categoryId}
              onChange={(categoryId: string) => {
                setForm({ ...form, categoryId });
              }}
              label={"Category"}
            >
              <option value={undefined}>Select an option</option>

              {viewsComputed
                .filter((x) => x.id)
                .map((category: any) => (
                  <option value={category.id}>{category.name}</option>
                ))}
            </AppSelect>
          </div>
        )}
      </AppModal>
    </div>
  );
}

export default ListViews;
