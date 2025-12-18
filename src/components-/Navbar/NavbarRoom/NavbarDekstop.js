import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
// import List from './Component/Home'
import { setAuthToken } from '../../../config/api';
import {  Dropdown } from "react-bootstrap";
import masgan from "../../../assets/masgan.png";
import { FaUserAlt, FaSignOutAlt, FaBell } from "react-icons/fa";
import 'chart.js/auto'
// import masgan from "../../assets/admin-logo.png";

function OffcanvasExample() {
  let navigate = useNavigate();
  const username = localStorage.getItem("username")

  const logout = (e)=>{
    e.preventDefault();
    localStorage.clear();
    navigate("/");
    };

  return (
    <div style={{padding:"0px 0px 0px 25px", backgroundColor:"#F3FFFD",padding:"0px 0px 5px 22px"}}>
      <Row className='match-height' style={{backgroundColor:"#F6F6F6", }}>
        <Col xl='12' sm='12' style={{ backgroundColor: "white", boxShadow: "2px 2px 10px #BFBFBF", }}>
          <div style={{ display: "flex" }}>
            <div style={{flex:"50%", display:"flex", justifyContent:""}}>
              <div style={{display:"flex", alignItems:"center", fontSize:"20px", fontWeight:"bold", color:"#001F8B", textShadow:"1px 1px #848484"}}>
                List Room
              </div>
              </div>
              <div style={{ flex: "50%", display: "flex", justifyContent: "end" }}>
                <div style={{display:"flex", alignItems:"center", color:"#FFC41F"}}> 
                  <FaBell style={{ borderRight: "2px solid #DBDBDB", paddingRight: "10px", fontSize: "28px", cursor:"pointer" }} />
                </div>
                {/* <p style={{marginTop:"15px", paddingLeft:"5px"}}>{username}</p> */}
                <Dropdown>
                  <Dropdown.Toggle id="user-dropdown" variant="white">
                    <img src={masgan} alt="Masgan" width={40} className="rounded-pill"  style={{boxShadow:"1px 1px 5px black"}}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant="light" style={{alignItem:"left", marginTop:"7px"}}>
                    <Dropdown.Item as={Link} to="/admin-profile">
                      <FaUserAlt className="me-2" style={{color:"#CC6600"}}></FaUserAlt>
                      <span style={{color:"#CC6600"}}>Profile</span>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logout} >
                      <FaSignOutAlt className="me-2" style={{color:"#CC6600"}}/>
                      <span style={{color:"#CC6600"}}>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Col>
      </Row>
    </div>
  );
}

export default OffcanvasExample;