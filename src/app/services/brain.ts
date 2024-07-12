import { postRequest } from "./_base";

export const brainGet = async function ({ blockId = null, blockKey = null }) {
  let data = {
    blockId,
    blockKey,
  };

  let result = await postRequest("brain/get", data);

  return result.data;
};

export const viewGet = async function (slug: string) {
  let data = {
    slug,
  };

  let result = await postRequest("brain/views/get", data);

  return result.data;
};

export const saveView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/views/save", data);

  return result.data;
};
export const saveLayout = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/views/saveLayout", data);

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

  let result = await postRequest("brain/views/deleteFromLayout", data);

  return result.data;
};

export const addView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/views/add", data);

  return result.data;
};

export const deleteView = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/views/delete", data);
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

  let result = await postRequest("brain/admin-get", data);

  return result.data.Block;
};

export const viewList = async function (workspaceId: string | null) {
  let data = {
    workspaceId,
  };

  let result = await postRequest("brain/views/list", data);

  return result.data;
};

export const brainList = async function (group: any = null) {
  let data = {
    group,
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

export const viewItemEdit = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("brain/views/viewItemEdit", data);

  return result.data;
};
