import React, { useState } from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { FaSignOutAlt } from "react-icons/fa";
import patrol_user from "../../../assets/patrol_user.jpg";
import Logo_Dashboard from '../../../assets/ysb/logo-ysb.png'

function OffcanvasExample({ sidebarStatus, setSidebarStatus }) {
  let navigate = useNavigate();
  const username = localStorage.getItem("name-admin");

  const logout = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setSidebarStatus((prevStatus) => !prevStatus);
  };

  const storageItems = [
    {
      "id": "dd74266b-7ddd-4a84-80fc-b7bf7778f8d5",
      "name": "Dashboard",
      "slug_name": "user_previlege",
      "icon_name": "fa fa-shield",
      "number_order": 2,
      "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
      "update_by": null,
      "created_at": "2023-08-30 08:20:00",
      "updated_at": "2023-08-30 08:20:00",
      "menus": [
          {
              "id": "1a730dc7-eede-4dd7-a8b7-22c3e8996ea7",
              "name": "Home",
              "slug_name": "home",
              "show": 1,
              "url": "\/dashboard",
              "icon": "fa fa-shield",
              "color_icon": "blue",
              "number_order": 41,
              "create_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
              "update_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
              "created_at": "2024-03-14 02:13:55",
              "updated_at": "2024-03-14 06:54:07",
              "create_by_data": {
                  "id": "39ae2633-2de1-4740-ab24-0c76d2136345",
                  "code": null,
                  "username": "dwiki",
                  "email": "dwiki_wantara@gratiajm.co.id",
                  "email_verified_at": "2023-08-30 15:17:59",
                  "level": "developer",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:39",
                  "updated_at": "2023-09-23 15:49:25",
                  "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
              },
              "update_by_data": {
                  "id": "39ae2633-2de1-4740-ab24-0c76d2136345",
                  "code": null,
                  "username": "dwiki",
                  "email": "dwiki_wantara@gratiajm.co.id",
                  "email_verified_at": "2023-08-30 15:17:59",
                  "level": "developer",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:39",
                  "updated_at": "2023-09-23 15:49:25",
                  "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
              }
          },
      ]
    }, 
    {
        "id": "dd74266b-7ddd-4a84-80fc-b7bf7778f8d5",
        "name": "Patroli",
        "slug_name": "user_previlege",
        "icon_name": "fa fa-user",
        "number_order": 2,
        "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
        "update_by": null,
        "created_at": "2023-08-30 08:20:00",
        "updated_at": "2023-08-30 08:20:00",
        "menus": []
    },
 
  ]

  
  return (
    <div style={{  padding: "0px 0px 5px 0px" }}>
      <Row className='match-height' style={{ backgroundColor: "#e78f08" }}>
        <Col xl='12' sm='12' style={{ backgroundColor: "#e78f08", boxShadow: "2px 2px 10px #BFBFBF" }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: "50%", display: "flex" }}>
              <div onClick={toggleSidebar} style={{ backgroundColor: "#3272B3", display: "flex", alignItems: "center", padding: "0px 5px 0px 15px", color:"white" }}>
                <img  style={{ width:"40px", height:"40px"}} src={Logo_Dashboard} alt='Login Cover' />
              </div>
              <div onClick={toggleSidebar} style={{ backgroundColor: "#3272B3", display: "flex", alignItems: "center", padding: "0px 20px 0px 0px", color:"white" }}>
                Yayasan Syiar Bangsa
              </div>
            </div>
            <div style={{ flex: "50%", display: "flex", justifyContent: "end" }}>
              <Dropdown style={{ backgroundColor: "#e78f08" }}>
                <Dropdown.Toggle variant="white" style={{ color: "white", fontFamily:"Poppins", fontSize:"15px", fontWeight:"" }}>
                  <img src={patrol_user} width={40} className="rounded-pill" style={{ minHeight: "40px", maxHeight: "40px", marginRight: "3px" }} />
                  {username}
                </Dropdown.Toggle>
                <Dropdown.Menu variant="light" style={{ alignItem: "left", marginTop: "7px" }}>
                  <Dropdown.Item onClick={logout}>
                    <FaSignOutAlt className="me-2" style={{ color: "#CC6600" }} />
                    <span style={{ color: "#CC6600" }}>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </Col>
      </Row>

      <Row className='match-height' style={{backgroundColor: "#B0B0B0", padding:"5px" }}>
        <Col xl='12' sm='12' >
        <div id="myjquerymenu_" className="jquerycssmenu" tabindex="1">
            <ul className="sf-menu">
              {storageItems.map((item, index) => {
                <li><a href="#">Home</a></li>
                <li className="dropdown">
                    <a href="#">Sistem</a>
                    <ul className="dropdown-menu">
                      <li><a href="#">Ganti Password</a></li>
                    </ul>
                </li>
                <li><a href="#">Vicon</a></li>
                <li className="dropdown">
                    <a href="#">Dokumentasi</a>
                    <ul className="dropdown-menu">
                        <li><a href="#">Manual Book</a></li>
                        <li className="dropdown">
                          <a href="#">Manual Video</a>
                          <ul className="dropdown-menu">
                                <li><a href="#">Option 1</a></li>
                                <li><a href="#">Option 2</a></li>
                              </ul>
                        </li>
                        <li><a href="#">Manual Book</a></li>
                        <li><a href="#">Manual Book</a></li>
                    </ul>
                </li>
            </ul>
        </div>

        </Col>
       </Row>
      
    </div>
  );
}

export default OffcanvasExample;
