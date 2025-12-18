import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
// import List from './Component/Home'
import { setAuthToken } from '../../../config/api';
import {  Dropdown } from "react-bootstrap";
import masgan from "../../../assets/masgan.png";
import { FaUserAlt, FaSignOutAlt, FaBell, FaSearch, FaListAlt, FaPhoneAlt } from "react-icons/fa";
import 'chart.js/auto'
import logo_side from "../../../assets/signature/logo-side-detail.png"
import { useLocation } from 'react-router-dom';
import "./Styled.css"
import Logo_Signature from "../../../assets/signature/signature logo.png"
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
    <Col xl='12' sm='12' style={{ backgroundColor: "white", boxShadow: "1px 1px 5px #BFBFBF", padding:"0px 0px", marginTop:"50px", display:"flex", position:"fixed", width:"100%",  zIndex: 2 }}>
    <div style={{flex:"30%", borderRight:"1px solid #E4E4E4", display:"flex", justifyContent:"center", alignItems:"center"}}>
       <div>
         <img src={Logo_Signature} style={{width:"60px"}}></img>
       </div>
       
       <div style={{fontSize:"12px", color:"#8B8B8B"}}>
         PT. Signature Anugerah Sentosa
     </div>
    </div>
     <div style={{flex:"40%", display: "flex", justifyContent: "center", borderRight:"1px solid #E4E4E4", color:"" }}>
        
        <div className="tagDashboard mr-4" style={{height:"11vh", display:"flex", alignItems:"center"}}>
          <Link to="/dashboard-pasien-online" style={{textDecoration:"none", color:"#989898" }}>OUR CLINIC</Link>
      </div>
      
      <div className="tagDashboard mr-4" style={{height:"11vh", display:"flex", alignItems:"center", color:""}}>
          <Link to="/dashboard-pasien-list-doctor" style={{textDecoration:"none", color:"#989898" }}>CLINIC DOCTOR</Link>
      </div>
      
   
{/* 
       <div className="tagDashboard mr-4" style={{height:"11vh", display:"flex", alignItems:"center"}}>
           INFORMATION
       </div> */}
     </div>

     <div style={{flex:"30%", display:"flex", justifyContent:"center", alignItems:"center"}}>
       <div style={{marginRight:"5px"}}>
         <FaPhoneAlt style={{fontSize:"20px", color:"#0071A2"}}/>
       </div>
       
     <div style={{fontFamily:"sans-serif", fontSize:"15px", color:"#8B8B8B"}}>
         CONTACT US | (150) - 178
     </div>
    </div>
   </Col>
  );
}

export default OffcanvasExample;