// TimeSeriesChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import type { PredictionResultI } from "../types";
import { emotionsLabels } from "../constants";
import type { ApexOptions } from "apexcharts";

interface ColumnChartsProps{
  data: PredictionResultI[],
}
const ColumnChart: React.FC<ColumnChartsProps> = ({data}: ColumnChartsProps ) => {
  
    const counts = [0,0,0,0,0,0,0];
    data.forEach(d => {
        counts[d.emotion] += 1;
    });

    const series = [
    {
      name: "Total",
      data: counts
    },
    ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      zoom: { enabled: false },
    },
    xaxis: {
      categories: emotionsLabels
    },
    plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: "50%"
        }
      },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: "Acumulado de emociones",
      align: "left",
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} width="100%"/>
    </div>
  );
};

export default ColumnChart;
