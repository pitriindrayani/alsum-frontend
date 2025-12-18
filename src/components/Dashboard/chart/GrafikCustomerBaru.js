import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import React, { useEffect } from "react";
import { Chart } from "react-google-charts";
import { setAuthToken } from '../../../config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export const data = [
  [
    "Element",
    "Density",
    { role: "style" },
    {
      sourceColumn: 0,
      role: "annotation",
      type: "string",
      calc: "stringify",
    },
  ],
  ["2023", 15000000, "#FFFF00", null],
  ["2022", 84000000, "#FFFF00", null],
  ["2021", 55000000, "#FFFF00", null],
  ["2020", 73000000, "#FFFF00", null],
];

export const options = {
  title: "",
  width: 380,
  height: 400,
  bar: { groupWidth: "60%" },
  legend: { position: "none" },
};


const ChartjsHorizontalBarChart = ({ year,month }) => {
 
  return (
    <Card style={{ boxShadow:"2px 2px 10px #BFBFBF"}}>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='p'>Grafik Customer Baru Tahun {year}</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Chart
            chartType="BarChart"
            width="100%"
            height="100%"
            data={data}
            options={options}
          />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsHorizontalBarChart
