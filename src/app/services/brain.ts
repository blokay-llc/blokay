import { postRequest } from "./_base";

export const viewGet = async function (
  slug: string,
  workspaceId: string,
  jwt: string
) {
  let data = {
    slug,
    workspaceId,
  };

  let result = await postRequest("views/get", data, {
    token: jwt,
  });

  return result.data;
};

export const saveView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("views/save", data);

  return result.data;
};
export const saveLayout = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("views/saveLayout", data);

  return result.data;
};

export const deleteFromLayout = async function (
  viewId: string | number,
  viewItemId: string | number
) {
  let data = {
    viewId,
    viewItemId,
  };

  let result = await postRequest("views/deleteFromLayout", data);

  return result.data;
};

export const addView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("views/add", data);

  return result.data;
};

export const deleteView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("views/delete", data);
  return result.data;
};

export const viewList = async function (workspaceId: string | null) {
  let data = {
    workspaceId,
  };

  let result = await postRequest("views/list", data);

  return result.data;
};

export const viewItemEdit = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("views/viewItemEdit", data);

  return result.data;
};

export const brainGet = async function ({ blockId = null, blockKey = null }) {
  let data = {
    blockId,
    blockKey,
  };

  let result = await postRequest("brain/get", data);

  return result.data;
};

export const newBlock = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/newBlock", data);

  return result.data.Block;
};

export const updateBlock = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/updateBlock", data);

  return result.data.Result;
};

export const deleteBlock = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/deleteBlock", data);

  return result.data;
};

export const rewriteFn = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/rewriteFn", data);

  return result.data.Result;
};

export const getBlockAdmin = async function (blockId: number) {
  let data = {
    blockId,
  };

  let result = await postRequest("brain/getAdmin", data);

  return result.data.Block;
};

export const brainList = async function (workspaceId: any = null) {
  let data = {
    workspaceId,
  };

  let result = await postRequest("brain/list", data);
  return result.data;
};

export const brainExec = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/exec", data);

  return result.data;
};
