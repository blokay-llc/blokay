"use client";
import React, { useState, useEffect, useRef } from "react";
import { viewList, addView } from "@/app/services/brain";
import { useSession } from "next-auth/react";
import AppVideoCard from "../../../components/UI/AppVideoCard";
import AvatarName from "../../../components/UI/AvatarName";
import AddCreditCard from "@/app/components/UI/AddCreditCard";
import { DS } from "@blokay/react";
import { useApi } from "@/hooks/useApi";

export default function ListViews({}) {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const modalRef: any = useRef();
  const [views, setViews] = useState([]);
  const [form, setForm]: any = useState({ search: "" });
  const { loading, callApi } = useApi(viewList);
  const { loading: loadingAdd, errors, callApi: callApiAdd } = useApi(addView);

  useEffect(() => {
    listViews();
  }, []);

  const listViews = () => {
    callApi().then((result) => {
      setViews(result.Views);
    });
  };

  const handleClickCreateNew = () => {
    modalRef.current.showModal();
  };

  const handleSaveView = () => {
    callApiAdd(form).then((result) => {
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
      <div className="">
        {loading && <DS.Loader size="md" className="mx-auto" />}

        <div className="w-[42rem] mx-auto">
          {!loading && viewsComputed.length > 0 && (
            <div>
              <div className=" flex items-center justify-between gap-5 mb-10">
                <div className="lg:w-full mr-auto">
                  <DS.Input
                    type="text"
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
                  <DS.Button
                    icon="wizard"
                    text="Add new"
                    onClick={() => handleClickCreateNew()}
                    variant="secondary"
                    size="md"
                    className="shrink-0"
                  />
                )}
                <div className="shrink-0">
                  <AvatarName name={session?.user?.name} />
                </div>
              </div>

              {!canCreateViews() && !session?.business?.addedCard && (
                <div className="mb-10 ">
                  <AddCreditCard text="You need to add a credit card to continue building" />
                </div>
              )}

              {/* <h2 className="text-neutral-900 dark:text-white text-xl mb-5 ">
                <div>My views</div>
              </h2> */}

              <div className="flex flex-col gap-3 lg:gap-5 ">
                {viewsComputed.map((view: any) => (
                  <div className="">
                    {view.name && (
                      <h2 className="mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-200">
                        {view.name}
                      </h2>
                    )}

                    <div className="flex flex-col w-full divide-y divide-black dark:bg-neutral-900 rounded-xl  overflow-hidden">
                      {view.Views.map((view: any) => (
                        <a
                          href={"/dashboard/view/" + view.slug}
                          key={view.id}
                          className=" shadow-sm  border-transparent transition	   text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-3 lg:px-5 lg:py-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800  dark:bg-gradient-to-r  dark:hover:from-transparent dark:hover:to-blue-900/40 duration-100 justify-between relative group/delete"
                        >
                          <div className="font-light  ">
                            <DS.Icon
                              icon="layers"
                              className="size-5 fill-white"
                            />
                          </div>
                          <div className="font-light mr-auto ">{view.name}</div>
                          {view.User && (
                            <div className="flex items-center gap-2 ">
                              <AvatarName name={view?.User?.name} size="sm" />
                              <div className="font-light text-xs">
                                {view.User.name}
                              </div>
                            </div>
                          )}

                          <div className="pl-5 opacity-0 group-hover/delete:opacity-100 transition-all">
                            <DS.Icon
                              icon="delete"
                              className="size-4 fill-white"
                            />
                          </div>
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
      </div>

      <DS.Modal
        title="Add new"
        footer={
          <div className="flex justify-end">
            <DS.Button
              text="Add new"
              onClick={() => handleSaveView()}
              variant="secondary"
              icon="add"
              size="md"
              loading={loadingAdd}
            />
          </div>
        }
        size="sm"
        ref={modalRef}
      >
        <DS.Input
          type="text"
          value={form.name}
          onChange={(val: string) => setForm({ ...form, name: val })}
          label="Name"
          error={errors?.name || errors?.key}
        />
        {viewsComputed.filter((x) => x.id).length > 0 && (
          <div className="mt-3">
            <DS.Select
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
            </DS.Select>
          </div>
        )}
      </DS.Modal>
    </div>
  );
}
