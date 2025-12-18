// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import React from "react";
import { Chart } from "react-google-charts";
import { useState,useEffect } from 'react';
import axios from 'axios'
import { setAuthToken } from '../../../config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export const data = [
  ["Element", "Total", { role: "style" }],
  ["ARISMAN", 45, "#0B5580"], // RGB value
  ["RIKO SIALLAGAN", 25, "#0B5580"], // English color name
  ["FAJAR TUMINO", 31, "#0B5580"],
  ["INDRA GUNAWAN", 20, "#0B5580"], // CSS-style declaration
];

const options = {
  // title: "Density of Precious Metals, in g/cm^3",
  chartArea: { width: '50%' },
  hAxis: {
    title: '',
    minValue: 0,
  },
  vAxis: {
    title: 'Top Matel',
  },
  legend: { position: 'none' } // Tambahkan baris ini untuk menghilangkan legend
};

const ChartjsBarChart = ({year}) => {

  return (
    <Card style={{ boxShadow: "none", backgroundColor:"white", border:"none" }}>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Chart chartType="ColumnChart" width="100%" height="400px" data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsBarChart
