// TimeSeriesChart.tsx
import React from "react";
import Chart from "react-apexcharts";
import type { PredictionResultI } from "../types";
import { emotionsLabels } from "../constants";
import type { ApexOptions } from "apexcharts";

interface TimeSeriesChartsProps{
  data: PredictionResultI[],
}
const TimeSeriesChart: React.FC<TimeSeriesChartsProps> = ({data}: TimeSeriesChartsProps ) => {
  const series = [
    {
      name: "Emociones a lo largo del tiempo",
      data: data.map((d) => {
        return {x: d.time, y: d.emotion}
      }),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      zoom: { enabled: true },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
      }
    },
    yaxis: {
      min: 0,
      max: 6,
      labels: {
        formatter: (val: number) => emotionsLabels[val],
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 5,
      shape: "circle",
    },
    title: {
      text: "Emociones a lo largo del tiempo",
      align: "left",
    },
    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
      y:{
        formatter: (val: number) => emotionsLabels[val],
      }
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="area" height={350} width="100%"/>
    </div>
  );
};

export default TimeSeriesChart;
