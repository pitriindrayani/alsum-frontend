import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import {  Dropdown } from "react-bootstrap";
import { useNavigate } from 'react-router';
import { setAuthToken } from '../../../config/api';

import {  FaSignOutAlt } from "react-icons/fa";
// ** Third Party Components
import 'chart.js/auto'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import SidebarMenu from '../../Sidebar/SidebarHome';
import Offcanvas from 'react-bootstrap/Offcanvas';
import patrol_user from "../../../assets/ysb/logo_user.png";
import Logo from "../../../assets/logo-dash.png";

// init token on axios every time the app is refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const User = ({setViewSidebar}) => {
  document.title = 'Home Admin';
  let navigate = useNavigate();
  const username = localStorage.getItem("name-admin")

  const [form, setForm] = useState({ 
    name: "",
    desc: "",
    url: "",
  });

  const logout = (e)=>{
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };
  
    const viewSidebar = () => {
      setViewSidebar(true)
    }

    useEffect(() => {
    },[viewSidebar]);
    
  return (
  
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
        <div className="container-fluid" style={{position:"fixed", backgroundColor:"#4368c5", paddingTop: "10px"}}>
            {[false].map((expand) => (
            <Navbar key={expand} expand={expand} style={{backgroundColor:"#4368c5"}} bg="#4368c5"  variant="dark" color='white' >
                <Container >
                  {/* <Navbar.Brand href="#">Hi, Admin</Navbar.Brand> */}
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} bg="#4368c5" expand="lg" variant="dark" color='white'  />
                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="start"
                  >
                    <Offcanvas.Header closeButton style={{backgroundColor:"#4368c5", color:"white"}}>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{color:"white"}}>
                        <div>
                          <img src={Logo} style={{width:"210px"}}/>
                        </div>
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body style={{backgroundColor:"#4368c5"}}>
                      <SidebarMenu/>
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Container>
              </Navbar>
              ))}
              
            <div style={{display:"flex", justifyContent:"end"}}>
            <p style={{marginTop:"15px", paddingLeft:"10px", color:"white"}}>{username}</p>
                <Dropdown>
                  <Dropdown.Toggle style={{backgroundColor:"#4368c5", border:"1px solid #4368c5"}} >
                    <img src={patrol_user} alt="mas" width={40} className="rounded-pill"  
                    style={{ minHeight:"40px", maxHeight:"40px"}}/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu variant="light" style={{alignItem:"left", marginTop:"7px"}}>
                    {/* <Dropdown.Item as={Link} to="/admin-profile">
                      <FaUserAlt className="me-2" style={{color:"#CC6600"}}></FaUserAlt>
                      <span style={{color:"#CC6600"}}>Profile</span>
                    </Dropdown.Item> */}
                    <Dropdown.Item onClick={logout} style={{backgroundColor:"white"}}>
                      <FaSignOutAlt className="me-2" style={{color:"#4368c5"}}/>
                      <span style={{color:"#4368c5"}}>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
            </div>
          </div>
        </nav>  
     
    
  );
}
export default User;