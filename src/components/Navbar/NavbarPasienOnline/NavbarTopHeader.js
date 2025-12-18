import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
// import List from './Component/Home'
import { setAuthToken } from '../../../config/api';
import {  Dropdown } from "react-bootstrap";
import masgan from "../../../assets/masgan.png";
import { FaUserAlt, FaSignOutAlt, FaBell, FaSearch, FaListAlt, FaPhoneAlt, FaEnvelopeOpenText } from "react-icons/fa";
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
    navigate("/");
  };
  const location = useLocation();
  

  return (
    <Col xl='12' sm='12' style={{ backgroundImage:"linear-gradient(to left, #0071A2, #69D3FF)", padding:"15px 10px" , position:"fixed", width:"100%",  zIndex: 3 }}>
    <div style={{ display: "flex" }}>
      <div style={{flex:"50%", display:"flex", justifyContent:""}}>
        <div style={{display:"flex", alignItems:"center", fontSize:"20px", fontWeight:"bold", color:"#001F8B", textShadow:"1px 1px #848484"}}>
          <form style={{display:"flex", paddingRight:"10px"}}>
            <div style={{ marginRight: "5px", borderRadius: "3px", width: "200px" }}>
              {/* <FaListAlt style={{fontSize:"30px", color:"#3D64FF"}}/> */}
            </div>   
          </form>
        </div>
      </div>
      <div style={{ flex: "50%", display: "flex", justifyContent: "end" }}>
          <div style={{display:"flex", alignItems:"center", color:"#FFC41F"}}> 
            <FaEnvelopeOpenText style={{ marginRight: "20px", fontSize: "20px", cursor:"", color:"white" }} />
        </div>
        <div style={{display:"flex", alignItems:"center", color:"#FFC41F"}}> 
            <FaBell style={{ marginRight: "20px", fontSize: "20px", cursor:"", color:"white" }} />
          </div>
          <div style={{display:"flex", alignItems:"center"}}> 
            <FaSignOutAlt className="signOut" onClick={logout} style={{  marginRight: "20px", fontSize: "20px", cursor:"pointer", }} />
          </div>
        </div>
      </div>
  </Col>
  );
}

export default OffcanvasExample;