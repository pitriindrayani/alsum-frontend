// ** Reactstrap Imports
import { Card, CardBody } from 'reactstrap'
import React from "react";
import { Chart } from "react-google-charts";
import { useState, useEffect } from 'react';
import axios from 'axios'
import { setAuthToken } from '../../../config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export const data = [
  ["Name", "Total"],
  ["JAKARTA", 45],
  ["TANGERANG", 25],
  ["BEKASI", 31],
  ["DEPOK", 20],
];

const options = {
  // title: "Top Metal",
  is3D: true,
  pieHole: 0.4, // for a donut chart, change this value to create the hole in the middle
  legend: { position: 'bottom' },
};

const ChartjsPieChart = ({ year }) => {
  return (
    <Card style={{ boxShadow: "none", backgroundColor: "white", border: "none" }}>
      <CardBody>
        <div style={{ height: '400px' }}>
          <Chart chartType="PieChart" width="100%" height="400px" data={data} options={options} />
        </div>
      </CardBody>
    </Card>
  )
}

export default ChartjsPieChart;
