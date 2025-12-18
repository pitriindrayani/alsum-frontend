import React, { useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FaSignOutAlt } from "react-icons/fa";
import patrol_user from "../../../assets/ysb/logo_user.png";
import Logo_Dashboard from '../../../assets/ysb/logo_alsum.png'

function OffcanvasExample({ sidebarStatus, setSidebarStatus }) {
  let navigate = useNavigate();
  const username = localStorage.getItem("name-admin");
  const levelUser = localStorage.getItem('level');
  const storageItems = JSON.parse(localStorage.getItem('menus'));


  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarStatus((prevStatus) => !prevStatus);
  };

  return (
    <div style={{  padding: "0px 0px 0px 0px" }}>
      <Row className='match-height' style={{ backgroundColor: "#3272B3" }}>
        <Col xl='12' sm='12' style={{ backgroundColor: "#3272B3"}}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: "50%", display: "flex" }}>
              <div onClick={toggleSidebar} style={{ backgroundColor: "#3272B3", display: "flex", alignItems: "center", padding: "0px 5px 0px 15px", color:"white" }}>
                <img  style={{ width:"40px", height:"40px"}} src={Logo_Dashboard} alt='Login Cover' />
              </div>
              <div onClick={toggleSidebar} style={{ backgroundColor: "#3272B3", display: "flex", alignItems: "center", padding: "0px 20px 0px 0px", color:"white" }}>
                Sekolah Islam Al Azhar Summarecon
              </div>
            </div>
            <div style={{ flex: "50%", display: "flex", justifyContent: "end" }}>
              <Dropdown style={{ backgroundColor: "#3272B3" }}>
                <Dropdown.Toggle variant="white" style={{ color: "white", fontFamily:"Poppins", fontSize:"15px", fontWeight:"" }}>
                  <img src={patrol_user} width={40} className="rounded-pill" style={{ minHeight: "40px", maxHeight: "40px", marginRight: "3px" }} />
                  {username}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="light" style={{ alignItem: "left", marginTop: "7px"}}>
                  <Dropdown.Item onClick={logout} style={{backgroundColor:"white"}}>
                    <FaSignOutAlt className="me-2" style={{color:"#3272B3"}}/>
                    <span style={{color:"#3272B3"}}>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='match-height' style={{backgroundColor: "#CDCDCD", padding:"5px", borderBottom:"2px solid #BDBDBD" }}>
        <Col xl='12' sm='12' >
        <div id="myjquerymenu_" className="jquerycssmenu" tabIndex="1">
            <ul className="sf-menu">
            {storageItems.map((item, index) => (
                  (item.url === "" || item.url == null) ? (
                    (item.name === "User Previlege" && levelUser !== "developer") ? (
                      <></>
                    ) : (
                      <li className="dropdown" key={index}>
                        <a>{item.name}</a>
                        <ul className="dropdown-menu">
                          {item.menus.map((itemss, subIndex) => (
                            itemss.url === "" ? (
                              <li key={subIndex}>
                                <a href={itemss.url}>{itemss.name}</a>
                              </li>
                              ):(
                              <li key={subIndex}>
                                <a href={itemss.url}>{itemss.name}</a>
                              </li>
                            )
                          ))}
                        </ul>
                      </li>
                    )
                  ):(
                <li key={index}>
                  <a href={item.url}>{item.name}</a>
                </li>
              )
            ))} 
            </ul>
          </div>
        </Col>
       </Row>
    </div>
  );
}

export default OffcanvasExample;
