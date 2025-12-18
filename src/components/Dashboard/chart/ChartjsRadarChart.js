// ** Reactstrap Imports
import React from "react";
import { Chart } from "react-google-charts";
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { useState,useEffect, Fragment } from 'react';
import axios from 'axios'
import {FaUser, FaGenderless, FaMailBulk, FaTransgender, FaPhone, FaAddressBook, FaAddressCard, FaEdit, FaTrash} from 'react-icons/fa'
import { Row, Col } from 'react-bootstrap';
import ReactPaginate from "react-paginate";
import DeleteData from './DeleteData';
import { useQuery, useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { API } from '../../../config/api';
import ShowMoreText from 'react-show-more-text';
import { setAuthToken } from '../../../config/api';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export const data = [
  ["Total",  "Total"],
  ["RSUD", 1000],
  ["RSUD", 1170],
  ["RSUD", 660],
  ["RSUD", 1030],
  ["RSUD", 1030],
 
];

export const options = {
  title: "",
  hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  chartArea: { width: "60%", height: "70%" },
};

const SalesByPrinciple = ({year, month}) => {
  const [users, setUsers] = useState([]);
  const [pagination,setPagination] = useState([])
  const [page, setPage] = useState("1");
  const navigate = useNavigate()
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(0);
  const [rows, setRows] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [dataMap, setDataMap] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  
  
    // let obj = {
    //   page: 1,
    //   limit: 10,
    //   ascending: 0
    // }

    let fetchParams = {
      headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

  const getDataUsers = async () => {
    const response = await API.get(`/api/dashboard-main/total-sales-principle?page=${page}&limit=${limit}&ascending=${ascending}`,fetchParams)
    setUsers(response.data.data)
    // setPage(response.data.pagination.current_page);
    // setPages(response.data.pagination.total_pages);
    // setRows(response.data.pagination.total);
  }

  useEffect(() => {
    getDataUsers()
  }, [year,page])
 
  const changePage = ({ selected }) => {
    setPage(selected+1);
    if (selected === 9) {
      setMsg(
        "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
      );
    } else {
      setMsg("");
    }
  };
 
  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const handleUpdate = (id) => {
    navigate('/user-update/' + id);
  };

  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  const deleteById = useMutation(async (id) => {
    try {
      await axios.delete(`/project/${id}`);
      getDataUsers()
    
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Card style={{ boxShadow:"2px 2px 10px #BFBFBF"}}>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='p'>Sales By Principle Tahun {year}</CardTitle>
      </CardHeader>
      <CardBody style={{display:"flex", height:"450px"}}> 
          <Chart
            chartType="AreaChart"
            width="90%"
            height="400px"
            data={data}
            options={options}
          />
          <div style={{paddingTop:"35px", width:"400px"}}>
          <table className="table is-striped is-bordered  mt-5" style={{marginTop:"5px"}}>
              <thead>
                <tr>
                  <th style={{textAlign:"center", fontSize:"10px", backgroundColor:"#99ccff"}}>No</th>
                  <th style={{textAlign:"center",fontSize:"10px",backgroundColor:"#99ccff"}}>Customer</th>
                  <th style={{textAlign:"center",fontSize:"10px",backgroundColor:"#99ccff"}}>Total</th>  
                  
                </tr>
              </thead>
              <tbody>
                {users.map((user,index) => (
                  <tr key={index}>
                    <td style={{textAlign:"center",fontSize:"9px"}}>{page === 1 ? index + 1 : page === 2 ? (index + 1) + 10 : (index + 1) + ( page * 10 )}</td>
                    <td style={{textAlign:"center",fontSize:"9px"}}>
                      <ShowMoreText
                        lines={1}
                        more="show"
                        less="hide"
                        className="content-css"
                        anchorClass="my-anchor-css-class text-primary"
                        expanded={false}
                        width={180}>
                          {user.name}
                      </ShowMoreText></td>
                    <td style={{textAlign:"center",fontSize:"9px"}}>{user.total_so}</td>                       
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
      
      </CardBody>
    </Card>
  )
}

export default SalesByPrinciple
