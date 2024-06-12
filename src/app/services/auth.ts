import { postRequest } from "./_base";

export const fetchRegister = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/register", data);

  return result.data;
};

export const fetchForgotPassword = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/forgot", data);
  return result.data;
};

export const fetchRecoverPassword = async function (form: any) {
  let data = {
    ...form,
  };

  let result = await postRequest("auth/recoverpassword", data);
  return result.data;
};
