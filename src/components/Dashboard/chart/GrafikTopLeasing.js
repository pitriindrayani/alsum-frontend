// ** Reactstrap Imports
import {Card} from 'reactstrap'
import React from "react";
import { Chart } from "react-google-charts";
import { CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
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
  ["Task", "Hours per Day"],
  ["1", 11],
  ["2", 2],
  ["3", 2],
  ["4", 2],
  ["5", 7],
];

export const options = {
  title: "Customer Chart",
  is3D: true,
};

const TopCustomer = ({year,month}) => {
  const [users, setUsers] = useState([]);
  const [pagination,setPagination] = useState([])
  const [page, setPage] = useState(0);
  const navigate = useNavigate()
  const [limit, setLimit] = useState(5);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState("0");
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
  
    let fetchParams = {
      headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

  const getDataUsers = async () => {
    const response = await API.post(`/api/dashboard-main/sales-month`,
    {
      year: `${year}`,
      month: month,
      page: `${page}`,
      limit: `${limit}`,
      ascending: `${ascending}`
    },fetchParams)

    setUsers(response.data.data)
    setPage(response.data.pagination.current_page);
    setPages(response.data.pagination.total_pages);
    setRows(response.data.pagination.total);
  }

  useEffect(() => {
    getDataUsers()
  }, [year,month,page])
 
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


  const data = [
    ["Element", "", { role: "style" }],
    ["PT. GEGE SUKSES MANDIRI", 8.94, "#b87333"], // RGB value
    ["PT LINTAS BORNEO SUKSES", 10.49, "silver"],
    ["PT PUTRA ANDESTAN JAYA", 19.3, "gold"],
    ["PT. MITRA PANCA NUSANTARA", 21.45, "color: #e5e4e2"] // CSS-style declaration
  ];
  
  const options = {
    // title: "Density of Precious Metals, in g/cm^3",
    chartArea: { width: '50%' },
    hAxis: {
      title: '',
      minValue: 0,
    },
    vAxis: {
      title: 'Top Leasing',
    },
    legend: { position: 'none' } // Tambahkan baris ini untuk menghilangkan legend
  };

  return (
    <Card style={{ boxShadow: "none", backgroundColor:"white", border:"none" }}>
    <CardBody>
      <div style={{ paddingLeft: "40px" }}>
        <Chart
          chartType="BarChart"
          data={data}
          options={options}
          width={"500px"}
          height={"300px"}
        />
      </div>
    </CardBody>
  </Card>
  )
}

export default TopCustomer
