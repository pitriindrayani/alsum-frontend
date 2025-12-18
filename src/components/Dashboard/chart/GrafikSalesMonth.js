// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'
import React from "react";
import { Chart } from "react-google-charts";
import { useState,useEffect } from 'react';
import axios from 'axios'
import { API } from '../../../config/api';
import { setAuthToken } from '../../../config/api';
import { Fade } from 'react-bootstrap';
import { FadeLoader } from 'react-spinners';
import { FaChartBar, FaProjectDiagram } from 'react-icons/fa';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const GrafikSalesMonth = ({year}) => {
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(0);
  const [limit, setLimit] = useState(100);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("username");
  const [loading, setLoading] = useState(false);

  // Grafik Month Total 
  const [jan, setJan] = useState([]);
  const [feb, setFeb] = useState([]);
  const [mar, setMar] = useState([]);
  const [apr, setApr] = useState([]);
  const [may, setMay] = useState([]);
  const [jun, setJun] = useState([]);
  const [jul, setJul] = useState([]);
  const [aug, setAug] = useState([]);
  const [sep, setSep] = useState([]);
  const [oct, setOct] = useState([]);
  const [nov, setNov] = useState([]);
  const [des, setDes] = useState([]);
 
  useEffect(() => {
    getUsers();
  },[year])

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };
 
  const getUsers = async () => {
    // setLoading(true)
    const response = await API.post(
      `/api/dashboard-main/sales-per-month`,
      {
        year: `${year}`,
        page: 0,
        limit: 12,
        ascending: 0
      }, fetchParams
    );
    {response.data.data.length === 0 ? setJan(0): setJan(response.data.data[0].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1? setFeb(0): setFeb(response.data.data[1].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2? setMar(0): setMar(response.data.data[2].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3? setApr(0): setApr(response.data.data[3].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4? setMay(0): setMay(response.data.data[4].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5? setJun(0): setJun(response.data.data[5].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6? setJul(0): setJul(response.data.data[6].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6 && response.data.data.length === 7? setAug(0): setAug(response.data.data[7].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6 && response.data.data.length === 7 && response.data.data.length === 8? setSep(0): setSep(response.data.data[8].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6 && response.data.data.length === 7 && response.data.data.length === 8 && response.data.data.length === 9? setOct(0): setOct(response.data.data[9].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6 && response.data.data.length === 7 && response.data.data.length === 8 && response.data.data.length === 9 && response.data.data.length === 10? setNov(0): setNov(response.data.data[10].total_sales)}
    {response.data.data.length === 0 && response.data.data.length === 1 && response.data.data.length === 2 && response.data.data.length === 3 && response.data.data.length === 4 && response.data.data.length === 5 && response.data.data.length === 6 && response.data.data.length === 7 && response.data.data.length === 8 && response.data.data.length === 9 && response.data.data.length === 10 && response.data.data.length === 11? setDes(0): setDes(response.data.data[11].total_sales)}
    // setLoading(false)
    };
 
  const data = [
    ["Element", "Total", { role: "style" }],
    ["Jan",jan, "#0000FF"], 
    ["Feb",feb, "#0000FF"], 
    ["Mar",mar, "#0000FF"],
    ["Apr",apr, "#0000FF"], 
    ["May",may, "#0000FF"],
    ["Jun",jun, "#0000FF"],
    ["Jul",jul, "#0000FF"],
    ["Aug",aug, "#0000FF"],
    ["Sep",sep, "#0000FF"],
    ["Oct",oct, "#0000FF"],
    ["Nov",nov, "#0000FF"],
    ["Des",des, "#0000FF"],
  ];

  return (
    <Card style={{border:"none", backgroundColor:"white", boxShadow:"none"}}>
      {/* <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column' >
        <CardTitle tag='p' style={{color:"white"}}> <FaChartBar/> Grafik {year}</CardTitle>
      </CardHeader> */}
      {loading? 
        <CardBody>
          <div style={{ height: '400px' }}>
            <CardTitle tag='h4' style={{display:"flex",justifyContent:"center",alignItems:"center", 
            height:"50%",fontSize:"30px", paddingTop:"200px"}}><FadeLoader color={'#3F45FF'}/></CardTitle>
          </div>
        </CardBody>
      :
      <CardBody>
        <div style={{height:'400px'}}>
          <Chart chartType="ColumnChart" width="100%" height="400px" data={data} />
        </div>
      </CardBody>
    }
    </Card>
  )
}

export default GrafikSalesMonth
