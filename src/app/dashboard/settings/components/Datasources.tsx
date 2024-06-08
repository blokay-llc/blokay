"use client";
import { useState, useEffect } from "react";
import {
  fetchDatasources,
  fetchUpdateDatasources,
  fetchCreateDatasource,
} from "@/app/services/datasource";
import { DS } from "@blokay/react";
import DatasourceForm from "./DatasourceForm";

export default function SettingsView() {
  const [datasources, setDatasources]: any = useState(null);
  const [datasource, setDatasource]: any = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]: any = useState({});

  const getDatasources = () => {
    setLoading(true);
    fetchDatasources()
      .then((result) => {
        setDatasources(result.Datasource);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleUpdate = (form: any) => {
    setLoading(true);
    fetchUpdateDatasources({
      datasourceId: datasource.id,
      ...form,
    })
      .then(() => {
        setDatasource(null);
        getDatasources();
      })
      .catch((err) => {
        let inputsErrors = err?.errors?.issues || [];
        let errs = inputsErrors.reduce((acc: any, curr: any) => {
          let key = curr.path.join(".");
          acc[key] = curr.message;
          return acc;
        }, {});

        setErrors(errs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreate = (form: any) => {
    setLoading(true);
    fetchCreateDatasource(form)
      .then(() => {
        setDatasource(null);
        getDatasources();
      })
      .catch((err) => {
        let inputsErrors = err?.errors?.issues || [];
        let errs = inputsErrors.reduce((acc: any, curr: any) => {
          let key = curr.path.join(".");
          acc[key] = curr.message;
          return acc;
        }, {});

        setErrors(errs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const newDataSource = () => {
    setErrors({});
    setDatasource({ name: "Your first datasource", type: "mysql", config: {} });
  };

  useEffect(() => {
    getDatasources();
  }, []);

  return (
    <div>
      {datasource?.id && (
        <DatasourceForm
          errors={errors}
          title="Datasource config"
          datasource={datasource}
          loading={loading}
          onDone={handleUpdate}
          onBack={() => setDatasource(null)}
        />
      )}

      {datasource && !datasource?.id && (
        <DatasourceForm
          errors={errors}
          title="Create Datasource"
          datasource={datasource}
          loading={loading}
          onDone={handleCreate}
          onBack={() => setDatasource(null)}
        />
      )}

      {loading && (
        <div className="mx-auto">
          <DS.Loader size="lg" className="mx-auto" />
        </div>
      )}
      {Array.isArray(datasources) && !loading && !datasource && (
        <div>
          <div className="flex justify-between items-center gap-5 mb-3">
            <h2 className="font-bold text-xl ">My Datasources</h2>

            {datasources.length > 0 && (
              <DS.Button
                onClick={newDataSource}
                text="Create"
                icon="add"
                variant="primary"
                size="md"
                loading={loading}
              />
            )}
          </div>

          <div className="flex-col flex gap-3 border-neutral-300 dark:border-neutral-800 border-2 px-5 py-5 rounded-xl ">
            {datasources.length == 0 && (
              <div className="py-5">
                <h2 className="mb-5 text-lg font-bold text-neutral-700 dark:text-neutral-200">
                  You don't have any datasource created
                </h2>
                <DS.Button
                  onClick={newDataSource}
                  text="Create your first datasource"
                  icon="add"
                  variant="primary"
                  loading={loading}
                />
              </div>
            )}
            {datasources.length > 0 && (
              <div className="flex flex-col  divide-y divide-neutral-300">
                {datasources.map((datasource: any) => (
                  <div
                    key={datasource.id}
                    className="flex items-center gap-3 py-4"
                    onClick={() => {
                      setErrors({});
                      setDatasource(datasource);
                    }}
                  >
                    <div>
                      <DS.IconTools
                        className="size-10 fill-neutral-600"
                        icon={datasource.type}
                      />
                    </div>
                    <div>
                      <div>{datasource.name}</div>
                      {datasource.lastUseAt && (
                        <div className="text-sm font-light">
                          Last use {datasource.lastUseAt}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
