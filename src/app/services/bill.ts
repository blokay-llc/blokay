import { postRequest } from "./_base";

export const fetchUsage = async function () {
  let data = {};
  let result = await postRequest("bill/usage", data);
  return result.data;
};
