"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { viewList, addView, deleteView } from "@/app/services/brain";
import AvatarName from "@/app/components/UI/AvatarName";
import AddCreditCard from "@/app/components/UI/AddCreditCard";
import { DS } from "@blokay/react";
import { useApi } from "@/hooks/useApi";
import Feedback from "@/app/dashboard/[workspace]/(home)/components/Feedback";
import NoViews from "@/app/dashboard/[workspace]/(home)/components/NoViews";
export default function ListViews({ workspace }: any) {
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";

  const modalDeleteRef: any = useRef();
  const modalRef: any = useRef();
  const [views, setViews] = useState([]);
  const [view, setView]: any = useState([]);
  const [form, setForm]: any = useState({ search: "" });
  const { loading, callApi, responded } = useApi(viewList);
  const { loading: loadingAdd, errors, callApi: callApiAdd } = useApi(addView);
  const { loading: loadingDelete, callApi: callApiDelete } = useApi(deleteView);

  useEffect(() => {
    listViews();
  }, []);

  const listViews = () => {
    callApi(workspace).then((result) => {
      setViews(result.Views);
    });
  };

  const handleClickCreateNew = () => {
    modalRef.current.showModal();
  };

  const handleSaveView = () => {
    callApiAdd({
      ...form,
      workspaceId: workspace,
    }).then((result) => {
      modalRef.current.hideModal();
      listViews();
      setForm({ search: "" });
    });
  };

  const handleDeleteView = () => {
    callApiDelete({
      viewId: view.id,
    }).then(() => {
      modalDeleteRef.current.hideModal();
      listViews();
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
      .filter((view: any) => view.Views.length > 0);
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

  if (loading || !responded) return <DS.Loader size="md" className="mx-auto" />;

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-5">
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
            autoComplete="off"
          />
        </div>

        <Feedback />

        {canCreateViews() && !loading && (
          <DS.Button
            icon="wizard"
            text="Add new"
            onClick={() => handleClickCreateNew()}
            variant="primary"
            size="md"
            className="shrink-0"
          />
        )}

        <div className="shrink-0">
          <AvatarName
            name={session?.user?.name}
            image={session?.user?.image}
            id={session?.user?.id}
            size="sm"
          />
        </div>
      </div>
      {!canCreateViews() && !session?.business?.addedCard && (
        <div className="mb-5 ">
          <AddCreditCard text="You need to add a credit card to continue building" />
        </div>
      )}

      <div className="flex flex-col gap-5 lg:gap-5 ">
        {viewsCount() > 0 && (
          <div className="flex flex-col gap-5 lg:gap-5 ">
            {viewsComputed.map((view: any) => (
              <div className="">
                {view.name && (
                  <h2 className="mb-4 text-sm font-medium text-neutral-900 dark:text-neutral-200">
                    {view.name}
                  </h2>
                )}

                <div className="dark:bg-transparent flex flex-col w-full divide-y dark:divide-neutral-800 border dark:border-neutral-800 divide-neutral-200 border-neutral-200 rounded-lg bg-neutral-50">
                  {view.Views.map((view: any) => (
                    <a
                      href={`/dashboard/${workspace}/view/${view.slug}`}
                      key={view.id}
                      className=" shadow-sm  border-transparent 	   text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 p-3 lg:px-3 lg:py-2 flex items-center gap-3  dark:hover:bg-neutral-800   duration-100 justify-between relative group/item transition-all"
                    >
                      <div className="font-light group-hover/item:bg-neutral-200 bg-neutral-100 dark:bg-neutral-800 size-7 flex items-center justify-center rounded-lg">
                        <DS.Icon
                          icon="layers"
                          className="size-5 group-hover/item:fill-neutral-700 fill-neutral-400 dark:fill-neutral-600"
                        />
                      </div>
                      <div className="font-light mr-auto text-sm md:text-base ">
                        {view.name}
                      </div>
                      {view.User && (
                        <div className="flex items-center gap-2 ">
                          <AvatarName
                            id={view?.User?.id}
                            name={view?.User?.name}
                            image={view?.User?.image}
                            size="xs"
                          />
                          <div className="font-light text-xs truncate">
                            {view.User.name}
                          </div>
                        </div>
                      )}

                      <div
                        className="ml-3 opacity-0 group-hover/item:opacity-100 transition-all p-2 rounded-lg dark:hover:bg-white/10 hover:bg-black/10"
                        onClick={(event) => {
                          event.preventDefault();
                          modalDeleteRef.current.showModal();
                          setView(view);
                        }}
                      >
                        <DS.Icon
                          icon="delete"
                          className="size-4 fill-neutral-600 dark:fill-white"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {viewsCount() <= 0 && <NoViews addView={handleClickCreateNew} />}
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
      <DS.Modal
        title="Delete view"
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="No, cancel"
              onClick={() => modalDeleteRef.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Yes, delete"
              onClick={() => handleDeleteView()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loadingDelete}
              disabled={form.textDeleteView != "yes, delete"}
            />
          </div>
        }
        size="sm"
        ref={modalDeleteRef}
      >
        <DS.Input
          type="text"
          value={form.textDeleteView}
          label="Write (yes, delete)"
          className="mb-3"
          onChange={(val: string) => {
            setForm({ ...form, textDeleteView: val });
          }}
        />
      </DS.Modal>
    </>
  );
}
