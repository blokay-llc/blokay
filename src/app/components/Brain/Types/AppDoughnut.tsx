import React from "react";
import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(Tooltip, Legend, ArcElement);

const colors = [
  "#ea5d0c",
  "#1e78d1",
  "#50c677",
  "#c92b94",
  "#4f46e5",
  "#c026d3",
];
function AppDoughnut({ data, title = "", onReload = null }: any) {
  const [hover, setHover] = useState(false);

  const dataLine = {
    labels: data.labels,
    datasets: data.datasets.map((row: any, index: number) => ({
      pointBorderColor: colors[index],
      label: row.label,
      data: row.vals,
      backgroundColor: colors,
    })),
  };

  const options: any = {
    hoverBorderWidth: "3",
    pointRadius: [0],
    pointHoverRadius: [5],
    // pointRadius: pointRadius,
    elements: {
      line: {
        tension: 0.4,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  const optionsHover: any = {
    ...options,
    pointRadius: [3],
  };

  return (
    <div
      className=""
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Doughnut options={hover ? optionsHover : options} data={dataLine} />
    </div>
  );
}

export default AppDoughnut;
