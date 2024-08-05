"use client";
import { useEffect, useState } from "react";
import { Block, DS } from "@blokay/react";

type MetricsProps = {
  block: any;
  reload?: any;
  jwt: string;
};

const getDefaultDateStart = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 7);
  const formattedDate = yesterday.toISOString().split("T")[0];
  return formattedDate;
};
const getDefaultDateEnd = () => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  return formattedDate;
};

const Metrics = ({ block, reload, jwt }: MetricsProps) => {
  if (!block?.id || !jwt) return null;

  const [form, setForm] = useState({
    id: block?.id,
    dateStart: getDefaultDateStart(),
    dateEnd: getDefaultDateEnd(),
  });

  useEffect(() => {
    setForm({
      id: block?.id,
      dateStart: getDefaultDateStart(),
      dateEnd: getDefaultDateEnd(),
    });
  }, [block]);

  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex gap-2 items-center">
        <DS.Input
          label="Date start"
          type="date"
          value={form.dateStart}
          onChange={(val: string) => {
            setForm({ ...form, dateStart: val });
          }}
        />
        <DS.Input
          label="Date End"
          type="date"
          value={form.dateEnd}
          onChange={(val: string) => {
            setForm({ ...form, dateEnd: val });
          }}
        />
      </div>

      <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
        <Block
          block="block.executions"
          defaultForm={form}
          autoExecute={true}
          jwt={jwt}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg ">
          <Block
            jwt={jwt}
            block="block.chart.exections"
            defaultForm={form}
            autoExecute={true}
          />
        </div>

        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg ">
          <Block
            jwt={jwt}
            block="block.chart.network"
            defaultForm={form}
            autoExecute={true}
          />
        </div>
      </div>
    </div>
  );
};
export default Metrics;
