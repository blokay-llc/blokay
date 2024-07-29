import { createContext, useEffect, useState } from "react";
import { fetchWorkspaces } from "@/app/services/workspace";
import { useApi } from "@/hooks/useApi";
import { useRouter, useParams } from "next/navigation";

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
  const [currentWorkspace, setCurrentWorkspace] = useState({
    id: null,
    name: null,
  });
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
      setCurrentWorkspace(result.CurrentWorkspace);
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
        currentWorkspace,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, WorkspaceProvider };
