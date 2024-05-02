"use client";
import { useEffect, useState, useRef } from "react";
import { AppLoader } from "@/app/components/DS/Index";
import {
  fetchUsers,
  fetchUser,
  fetchAddUser,
  fetchUpdateUser,
} from "@/app/services/users";
import { viewList } from "@/app/services/brain";
import {
  AppCheckbox,
  AppModal,
  AppButton,
  AppSelect,
  AppInput,
} from "@/app/components/DS/Index";

export default function Users() {
  const modalRef: any = useRef();
  const [users, setUsers] = useState([]);
  const [views, setViews] = useState([]);
  const [form, setForm]: any = useState({ permissions: {}, rol: "admin" });
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  const listViews = () => {
    viewList().then((result) => {
      setViews(result.Views);
    });
  };

  const getUsers = () => {
    setUsers([]);
    setLoading(true);
    fetchUsers()
      .then((result: any) => {
        setUsers(result.Users);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickSubmitNewUser = () => {
    setLoading(true);
    fetchAddUser(form)
      .then((result: any) => {
        modalRef.current.hideModal();
        getUsers();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClickSubmitUpdateUser = () => {
    setLoading(true);
    fetchUpdateUser({
      ...form,
      userId: form.id,
    })
      .then((result: any) => {
        modalRef.current.hideModal();
        getUsers();
      })
      .finally(() => {
        setLoading(false);
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
    listViews();
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {loading && (
        <div className="min-h-screen border-2 border-stone-300 rounded-xl flex items-center justify-center">
          <AppLoader size="md" />
        </div>
      )}
      {!loading && (
        <div>
          <div className="justify-end flex items-center gap-2 mb-5">
            <AppButton
              text="Add new user"
              onClick={() => createNewUser()}
              variant="primary"
              icon="add"
              className="ml-auto"
              size="md"
            />
          </div>

          {users.length > 0 && (
            <div className="bg-white px-3 py-3 flex flex-col gap-4 rounded-lg shadow-sm border border-stone-300">
              {users.map((user: any) => (
                <div
                  onClick={() => handleClickUser(user)}
                  key={user.id}
                  className="px-5 py-2 rounded-lg hover:bg-stone-100 flex items-center gap-3"
                >
                  <div className="size-10 bg-stone-200 flex items-center justify-center rounded-full">
                    <img src="/logo-sm.svg" className="w-full h-full" />
                  </div>
                  <div>
                    <div>{user.name}</div>
                    <div className="font-light text-sm">{user.rol}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AppModal
        title="Assign permissions"
        footer={
          <AppButton
            text="Save"
            onClick={() =>
              form.id
                ? handleClickSubmitUpdateUser()
                : handleClickSubmitNewUser()
            }
            variant="primary"
            className="w-full"
            size="md"
            loading={loading}
          />
        }
        size="sm"
        ref={modalRef}
      >
        {loadingUser && (
          <div className=" flex items-center justify-center">
            <AppLoader size="md" />
          </div>
        )}
        {!loadingUser && (
          <div className="flex gap-5 flex-col">
            <AppSelect
              value={form.rol}
              label="Rol"
              onChange={(val: string) => {
                setForm({ ...form, rol: val });
              }}
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </AppSelect>

            <AppInput
              type="text"
              value={form.name}
              label="Name"
              onChange={(val: string) => {
                setForm({ ...form, name: val });
              }}
            />

            {!form.id && (
              <>
                <AppInput
                  type="text"
                  value={form.email}
                  label="Email"
                  onChange={(val: string) => {
                    setForm({ ...form, email: val });
                  }}
                />

                <AppInput
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
              <div className="gap-5 flex flex-col">
                {views.map((c: any) => (
                  <div>
                    <div className="items-center gap-2 flex mb-3">
                      <AppCheckbox
                        type="text"
                        value={
                          c.Views.length ==
                          c.Views.filter((v: any) => !!form.permissions[v.id])
                            .length
                        }
                        onChange={() => {
                          let newForm: any = {};
                          for (let index in c.Views) {
                            let item: any = c.Views[index];
                            newForm[item.id] = true;
                          }
                          setForm({
                            ...form,
                            permissions: { ...form.permissions, ...newForm },
                          });
                        }}
                      />
                      <h2>{c.name}</h2>
                    </div>
                    <div className="flex flex-col gap-1 pl-3">
                      {c.Views.map((v: any) => (
                        <div key={"view" + v.id}>
                          <AppCheckbox
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
        )}
      </AppModal>
    </div>
  );
}
