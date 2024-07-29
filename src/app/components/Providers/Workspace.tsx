import { createContext, useEffect, useState } from "react";
// import useSession from "../hooks/useSession";
import { fetchWorkspaces, fetchAddWorkspace } from "@/app/services/workspace";
import { useApi } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const contextDefaultValue: any = {
  session: null,
};
const Context = createContext(contextDefaultValue);

type WorkspaceProviderProps = {
  children: any;
};

const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  const { workspace } = useParams<{ workspace: string }>();
  const { loading, callApi } = useApi(fetchWorkspaces);
  const [workspaces, setWorkspaces] = useState([]);
  const [current, setCurrent] = useState({ id: null, name: null });
  const router = useRouter();

  useEffect(() => {
    getWorkspaces();
  }, []);

  useEffect(() => {
    getWorkspaces();
  }, [workspace]);

  const getWorkspaces = () => {
    callApi(workspace).then((result) => {
      setWorkspaces(result.Workspaces);
      setCurrent(result.CurrentWorkspace);
      if (!result.CurrentWorkspace && workspace) {
        router.push(`/dashboard`);
      }
    });
  };

  return (
    <Context.Provider
      value={{
        workspaces,
        loading,
        getWorkspaces,
        current,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, WorkspaceProvider };
