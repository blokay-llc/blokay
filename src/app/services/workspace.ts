import { postRequest } from "./_base";

export const fetchWorkspaces = async function (workspaceId: string) {
  let data = {
    workspaceId,
  };

  let result = await postRequest("workspace/get", data);
  return result.data;
};

export const fetchAddWorkspace = async function (form: any) {
  let data = { ...form };

  let result = await postRequest("workspace/add", data);
  return result.data;
};
