import { useState } from "react";
type apiCalback = (...args: any) => Promise<any>;

export function useApi(service: apiCalback) {
  const [loading, setLoading] = useState(false);
  const [responded, setResponded] = useState(false);
  const [errors, setErrors]: any = useState({});

  const callApi = async (...args: any) => {
    setErrors({});
    setLoading(true);
    return service(...args)
      .then((res) => {
        setLoading(false);
        setResponded(true);
        return Promise.resolve(res);
      })
      .catch((err) => {
        setLoading(false);
        setResponded(true);

        let inputsErrors = err?.errors?.issues || [];
        let errs = inputsErrors.reduce((acc: any, curr: any) => {
          let key = curr.path[0];
          acc[key] = curr.message;
          return acc;
        }, {});

        setErrors(errs);
        return Promise.reject(err);
      });
  };

  return { loading, errors, callApi, responded };
}
