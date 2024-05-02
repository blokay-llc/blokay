import { postRequest } from "./_base";

export const fetchDatasources = async function () {
  let data = {};

  let result = await postRequest("datasources/list", data);

  return result.data;
};

export const fetchUpdateDatasources = async function (form = {}) {
  let data = { ...form };

  let result = await postRequest("datasources/update", data);

  return result.data;
};

export const fetchCreateDatasource = async function (form = {}) {
  let data = { ...form };

  let result = await postRequest("datasources/create", data);

  return result.data;
};
