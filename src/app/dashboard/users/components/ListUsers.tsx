"use client";
import { useEffect, useState, useRef } from "react";
import {
  fetchUsers,
  fetchUser,
  fetchAddUser,
  fetchUpdateUser,
} from "@/app/services/users";
import { viewList } from "@/app/services/brain";
import { useSession } from "next-auth/react";
import AddCreditCard from "@/app/components/UI/AddCreditCard";
import { DS } from "@blokay/react";
import AvatarName from "@/app/components/UI/AvatarName";
import { useApi } from "@/hooks/useApi";
import { fetchWorkspaces } from "@/app/services/workspace";

export default function ListUsers() {
  const [workspaces, setWorkspaces] = useState([]);
  const { data: session }: any = useSession();
  const isAdmin = session?.user?.rol == "admin";
  const modalRef: any = useRef();
  const [users, setUsers] = useState([]);
  const [views, setViews] = useState([]);
  const [form, setForm]: any = useState({ permissions: {}, rol: "admin" });
  const [loadingUser, setLoadingUser] = useState(false);

  const { loading: loadingUsers, callApi } = useApi(fetchUsers);
  const {
    loading: loadingAdd,
    errors: errorsAdd,
    callApi: callApiAdd,
  } = useApi(fetchAddUser);
  const {
    loading: loadingUpdate,
    errors: errorsUpdate,
    callApi: callApiUpdate,
  } = useApi(fetchUpdateUser);

  const { callApi: callApiWorkspace } = useApi(fetchWorkspaces);

  const { callApi: callApiViews, loading: loadingViews } = useApi(viewList);

  const listViews = (workspaceId: string | null) => {
    if (!workspaceId) return;
    callApiViews(workspaceId).then((result) => {
      setViews(result.Views);
    });
  };

  const getUsers = () => {
    setUsers([]);
    callApi().then((result: any) => {
      setUsers(result.Users);
    });
  };

  const handleClickSubmitNewUser = () => {
    callApiAdd(form).then((result: any) => {
      modalRef.current.hideModal();
      getUsers();
    });
  };

  const getWorkspaces = () => {
    callApiWorkspace(null).then((result) => {
      setWorkspaces(result.Workspaces);
    });
  };

  const handleClickSubmitUpdateUser = () => {
    callApiUpdate({
      ...form,
      userId: form.id,
    }).then((result: any) => {
      modalRef.current.hideModal();
      getUsers();
    });
  };

  const createNewUser = () => {
    setForm({ permissions: {}, rol: "admin" });
    setLoadingUser(false);
    modalRef.current.showModal();
  };

  const handleClickUser = (user: any) => {
    setLoadingUser(true);
    fetchUser(user.id)
      .then((result: any) => {
        setForm({ ...form, ...result.User });
      })
      .finally(() => {
        setLoadingUser(false);
      });

    modalRef.current.showModal();
  };

  useEffect(() => {
    getUsers();
    getWorkspaces();
  }, []);

  useEffect(() => {
    listViews(form.workspaceId);
  }, [form.workspaceId]);

  return (
    <div className="flex flex-col gap-5 relative">
      {loadingUsers && (
        <div className="min-h-screen border border-neutral-300 dark:border-neutral-800 rounded-xl flex items-center justify-center absolute z-10 top-0 left-0 w-full h-full dark:bg-black/40 bg-neutral-200/40  backdrop-blur-sm ">
          <DS.Loader size="md" />
        </div>
      )}

      {isAdmin &&
        users.length >= session?.business?.limitUsers &&
        !session?.business?.addedCard && (
          <div>
            <AddCreditCard text="You need to add a credit card to create more users" />
          </div>
        )}

      {!loadingUsers &&
        isAdmin &&
        (users.length < session?.business?.limitUsers ||
          session?.business?.addedCard) && (
          <DS.Button
            text="Add new user"
            onClick={() => createNewUser()}
            variant="primary"
            icon="add"
            className="ml-auto"
            size="md"
          />
        )}

      {users.length > 0 && (
        <div className="bg-white dark:bg-neutral-950  flex flex-col  rounded-lg shadow-sm border border-neutral-300 dark:border-neutral-800 dark:divide-neutral-800 divide-y ">
          {users.map((user: any, index: number) => (
            <div
              onClick={() => handleClickUser(user)}
              key={user.id}
              className="px-5 py-3  hover:bg-neutral-100 dark:hover:bg-black flex items-center gap-3"
            >
              <AvatarName
                name={user.name}
                image={user.image}
                id={user.id}
                colorIndex={index}
              />
              <div>
                <div className="dark:text-white text-neutral-800">
                  {user.name}
                </div>
                <div className="font-light text-sm dark:text-neutral-400 text-neutral-700">
                  <span className="text-xs font-light text-neutral-700 bg-neutral-200 px-2 py-0.5 rounded-xl mr-2">
                    {user.rol}
                  </span>
                  <span>{user.email}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DS.Modal
        title="Assign permissions"
        footer={
          <DS.Button
            text="Save"
            onClick={() =>
              form.id
                ? handleClickSubmitUpdateUser()
                : handleClickSubmitNewUser()
            }
            variant="primary"
            className="w-full"
            size="md"
            loading={loadingAdd || loadingUpdate}
          />
        }
        size="sm"
        ref={modalRef}
      >
        {(loadingUser || loadingUpdate) && (
          <div className=" flex items-center justify-center">
            <DS.Loader size="md" />
          </div>
        )}
        {!(loadingUser || loadingUpdate) && (
          <div className="flex gap-3 flex-col">
            {form.id && (
              <a
                target="_blank"
                href={`/api/users/downloadLogs?userId=${form.id}`}
                className="underline text-right text-sm font-medium pointer"
              >
                Download User logs
              </a>
            )}

            <DS.Select
              value={form.rol}
              error={errorsAdd?.rol || errorsUpdate?.rol}
              label="Rol"
              onChange={(val: string) => {
                setForm({ ...form, rol: val });
              }}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </DS.Select>

            <DS.Input
              type="text"
              value={form.name}
              error={errorsAdd?.name || errorsUpdate?.name}
              label="Name"
              onChange={(val: string) => {
                setForm({ ...form, name: val });
              }}
            />

            {!form.id && (
              <>
                <DS.Input
                  error={errorsAdd?.email || errorsUpdate?.email}
                  type="text"
                  value={form.email}
                  label="Email"
                  onChange={(val: string) => {
                    setForm({ ...form, email: val });
                  }}
                />

                <DS.Input
                  error={errorsAdd?.password || errorsUpdate?.password}
                  type="password"
                  value={form.password}
                  label="Password"
                  onChange={(val: string) => {
                    setForm({ ...form, password: val });
                  }}
                />
              </>
            )}

            {form.rol != "admin" && (
              <div>
                <DS.Select
                  value={form.workspaceId}
                  label="Workspace"
                  onChange={(workspaceId: string) => {
                    setForm({ ...form, workspaceId });
                  }}
                >
                  <option value="">Select</option>
                  {workspaces.map((workspace: any) => (
                    <option key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </option>
                  ))}
                </DS.Select>

                <div className="mt-5">
                  {loadingViews && <DS.Loader size="md" className="mx-auto" />}
                  {!loadingViews && (
                    <div className="gap-5 flex flex-col">
                      {views.map((c: any) => (
                        <div>
                          <div className="items-center gap-2 flex mb-3">
                            <DS.Checkbox
                              type="text"
                              value={
                                c.Views.length ==
                                c.Views.filter(
                                  (v: any) => !!form.permissions[v.id]
                                ).length
                              }
                              onChange={() => {
                                let newForm: any = {};
                                for (let index in c.Views) {
                                  let item: any = c.Views[index];
                                  newForm[item.id] = true;
                                }
                                setForm({
                                  ...form,
                                  permissions: {
                                    ...form.permissions,
                                    ...newForm,
                                  },
                                });
                              }}
                            />
                            <h2>{c.name}</h2>
                          </div>
                          <div className="flex flex-col gap-1 pl-3">
                            {c.Views.map((v: any) => (
                              <div key={"view" + v.id}>
                                <DS.Checkbox
                                  type="text"
                                  value={form.permissions[v.id]}
                                  label={v.name}
                                  onChange={() => {
                                    setForm({
                                      ...form,
                                      permissions: {
                                        ...form.permissions,
                                        [v.id]: !form.permissions[v.id],
                                      },
                                    });
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DS.Modal>
    </div>
  );
}
