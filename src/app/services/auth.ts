import { postRequest } from "./_base";

export const fetchRegister = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/register", data);

  return result.data;
};
