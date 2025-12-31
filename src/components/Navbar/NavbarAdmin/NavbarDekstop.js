import React, { useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FaSignOutAlt } from "react-icons/fa";
import logo_user from "../../../assets/profile.png";

function OffcanvasExample({ sidebarStatus, setSidebarStatus }) {
  let navigate = useNavigate();
  const username = localStorage.getItem("name-admin");
  const levelUser = localStorage.getItem('level');
  const storageItems = JSON.parse(localStorage.getItem('menus'));


  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/1337");
  };

  const toggleSidebar = () => {
    setSidebarStatus((prevStatus) => !prevStatus);
  };

  return (
    <div className='header' style={{ margin: "0px 5px 0px 5px" }}>
      <Row className='match-height' style={{ padding:"8px 15px" }}>
        <Col xl='12' sm='12' style={{ backgroundColor: "#098adaff", borderRadius:"5px"}}>
          <div className='d-sm-flex justify-content-between'>
           

            <Dropdown className='ml-auto'>
              <Dropdown.Toggle style={{ backgroundColor:"#098adaff",border:"none", borderRadius: "12px",
                  padding: "5px 5px",display: "flex",alignItems: "center",minHeight: "20px"}}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "5px"
                }}>
                  <div style={{position: "relative"}}>
                    <img 
                      src={logo_user} 
                      width={45} 
                      height={45} 
                      className="rounded-pill" 
                      style={{borderRadius: "50%"}}
                      alt="user"
                    />
                    <span style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "10px",
                      height: "10px",
                      background: "limegreen",
                      borderRadius: "50%",
                      border: "2px solid white"
                    }}></span>
                  </div>

                  <div style={{display: "flex", flexDirection: "column", textAlign: "left", marginLeft: "8px"}}>
                    <span style={{fontWeight: "600", color: "#fff"}}>{username}</span>
                    <span style={{fontSize: "13px", color: "#fff"}}>{levelUser}</span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu 
                variant="light" 
                style={{ marginTop: "5px", borderRadius:"10px" }}
              >
                <Dropdown.Item onClick={logout} style={{backgroundColor:"white"}}>
                  <FaSignOutAlt className="me-2" style={{color:"#098adaff"}}/>
                  <span style={{color:"#098adaff"}}>Logout</span>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Col>
      </Row>

    </div>
  );
}

export default OffcanvasExample;
