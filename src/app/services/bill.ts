import { postRequest } from "./_base";

export const fetchUsage = async function () {
  let data = {};
  let result = await postRequest("bill/usage", data);
  return result.data;
};

export const fetchBills = async function () {
  let data = {};
  let result = await postRequest("bill/list", data);
  return result.data.Bills;
};
