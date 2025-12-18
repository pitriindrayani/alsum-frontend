import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
// import List from './Component/Home'
import { setAuthToken } from '../../../config/api';
import {  Dropdown } from "react-bootstrap";
import masgan from "../../../assets/masgan.png";
import { FaUserAlt, FaSignOutAlt, FaBell, FaSearch, FaListAlt } from "react-icons/fa";
import 'chart.js/auto'
import logo_side from "../../../assets/signature/logo-side-detail.png"
import { useLocation } from 'react-router-dom';
import "./Styled.css"
// import masgan from "../../assets/admin-logo.png";

function OffcanvasExample() {
  let navigate = useNavigate();
  const username = localStorage.getItem("username")

  const logout = (e)=>{
    e.preventDefault();
    localStorage.clear();
    navigate("/admin");
  };
  const location = useLocation();
  

  return (
    <div style={{width:"100%", backgroundColor: "", boxShadow: "1px 1px 1px #ECECEC", backgroundImage: 'linear-gradient(to bottom, #0097D8 80%, white 20%)'}}>    
    <div style={{padding:"30px 0px 0px 0px", display:"flex", justifyContent:"center"}}>
      <img src={logo_side} style={{minWidth:"150px",maxWidth:"150px", borderRadius:"100px"}}></img>
    </div>
    <nav style={{ display: "flex", justifyContent: "center"}}>
      <div className="" style={{height:"5vh", display:"flex", alignItems:"center"}}>
        <Link className={location.pathname === "/dashboard-pasien-online"? "tagAppointmentBorder mr-4": "tagAppointment mr-4"} to="/dashboard-pasien-online" style={{textDecoration:"none", fontSize:"12px" }}>APPOINTMENT</Link>
      </div>
      <div className="" style={{height:"5vh", display:"flex", alignItems:"center"}}>
        <Link className={location.pathname === "/dashboard-pasien-online-penampung"? "tagAppointmentBorder mr-4": "tagAppointment mr-4"} to="/dashboard-pasien-online-penampung" style={{textDecoration:"none", fontSize:"12px" }}>PASIEN</Link>
      </div>
      <div className="" style={{height:"5vh", display:"flex", alignItems:"center"}}>
        <Link className={location.pathname === "/dashboard-pasien-online-profile"? "tagAppointmentBorder mr-4": "tagAppointment mr-4"} to="/dashboard-pasien-online-profile" style={{textDecoration:"none", fontSize:"12px" }}>PROFILE</Link>
      </div>
      <div className="" style={{height:"5vh", display:"flex", alignItems:"center"}}>
        <Link className={location.pathname === "/dashboard-pasien-online-ubah-password"? "tagAppointmentBorder mr-4": "tagAppointment mr-4"} to="/dashboard-pasien-online-ubah-password" style={{textDecoration:"none", fontSize:"12px" }}>UBAH PASSWORD</Link>
      </div>
    </nav>
  </div>  
  );
}

export default OffcanvasExample;