import { postRequest, postFile } from "./_base";

export const fetchUsers = async function () {
  let data = {};

  let result = await postRequest("users/list", data);

  return result.data;
};

export const fetchUser = async function (userId: number) {
  let data = { userId };

  let result = await postRequest("users/get", data);

  return result.data;
};

export const fetchAddUser = async function (form: any) {
  let data = { ...form };

  let result = await postRequest("users/add", data);

  return result.data;
};

export const fetchUpdateUser = async function (form: any) {
  let data = { ...form };

  let result = await postRequest("users/edit", data);

  return result.data;
};

export const downloadUserLogs = async function (form: any) {
  let data = { ...form };

  let result = await postFile("users/downloadLogs", data);

  return result;
};
