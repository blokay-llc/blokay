"use client";
import { useState, useRef, useContext } from "react";
import { DS } from "@blokay/react";
import { fetchAddWorkspace } from "@/app/services/workspace";
import { useApi } from "@/hooks/useApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/UI/Dropdown";
import { Context } from "../Providers/Workspace";

export default function Workspace({ workspace }: any) {
  const [form, setForm] = useState({ name: "" });
  const modalAdd: any = useRef();

  const { loading, getWorkspaces, workspaces, currentWorkspace } =
    useContext(Context);

  const {
    loading: loadingAdd,
    callApi: callApiAdd,
    errors,
  } = useApi(fetchAddWorkspace);

  const handleSubmit = () => {
    callApiAdd(form).then(() => {
      modalAdd.current.hideModal();
      getWorkspaces();
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="select-none px-2 md:mb-3 md:pb-3 md:border-b border-neutral-300 dark:border-neutral-800 text-neutral-600 w-full focus:outline-none">
          <div className="hover:bg-neutral-100 rounded-xl px-3 py-2 flex items-center gap-3">
            <div className="text-sm bg-neutral-300 dark:bg-neutral-800  rounded-lg px-3 py-1">
              Workspace
            </div>
            <div>{currentWorkspace?.name || "Select"}</div>
            <div className="ml-auto">
              {loading && <DS.Loader size="sm" className="mx-auto" />}
              {!loading && (
                <DS.Icon
                  icon="unfold"
                  className="size-5 ml-auto fill-neutral-700 dark:fill-neutral-500"
                />
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" w-64">
          <DropdownMenuLabel>My workspaces</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {workspaces.map((workspace: any) => (
            <DropdownMenuItem key={workspace.id}>
              <a className="block w-full" href={`/dashboard/${workspace.id}`}>
                {workspace.name}
              </a>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DS.Button
              className="w-full"
              icon="add"
              variant="primary"
              onClick={() => {
                modalAdd.current.showModal();
              }}
              text="Add workspace"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DS.Modal
        title="Add Workspace"
        footer={
          <div className="flex items-center gap-5">
            <DS.Button
              text="Cancel"
              onClick={() => modalAdd.current.hideModal()}
              variant="secondary"
              className="w-full"
              size="md"
            />
            <DS.Button
              text="Confirm"
              onClick={() => handleSubmit()}
              variant="primary"
              className="w-full"
              size="md"
              loading={loadingAdd}
              disabled={!form.name}
            />
          </div>
        }
        size="sm"
        ref={modalAdd}
      >
        <DS.Input
          type="text"
          value={form.name}
          label="Name"
          className="mb-3"
          error={errors?.name}
          onChange={(val: string) => {
            setForm({ ...form, name: val });
          }}
        />
      </DS.Modal>
    </>
  );
}
