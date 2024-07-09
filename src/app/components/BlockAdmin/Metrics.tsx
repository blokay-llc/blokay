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
    <div className="flex flex-col gap-4 lg:w-2/3 mx-auto">
      <div className="flex gap-5 items-center">
        <DS.Input
          label="Date start"
          name="dateStart"
          type="date"
          value={form.dateStart}
          onChange={(val: string) => {
            setForm({ ...form, dateStart: val });
          }}
        />
        <DS.Input
          label="Date End"
          name="dateEnd"
          type="date"
          value={form.dateEnd}
          onChange={(val: string) => {
            setForm({ ...form, dateEnd: val });
          }}
        />
      </div>

      <div className="border border-neutral-800 rounded-lg p-4 ">
        <Block
          block="block.executions"
          defaultForm={form}
          autoExecute={true}
          jwt={jwt}
        />
      </div>

      <div className="border border-neutral-800 rounded-lg p-4 ">
        <Block
          jwt={jwt}
          block="block.chart.exections"
          defaultForm={form}
          autoExecute={true}
        />
      </div>
    </div>
  );
};
export default Metrics;