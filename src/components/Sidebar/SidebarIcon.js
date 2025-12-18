import React, { useState, useEffect } from 'react'
import { Sidebar, Menu, MenuItem,SubMenu,useProSidebar } from 'react-pro-sidebar';
import Nav from 'react-bootstrap/Nav';
import { Link} from "react-router-dom";
import {FaDotCircle, FaOdnoklassnikiSquare} from "react-icons/fa";
import {  useNavigate } from "react-router-dom";
import {  Navbar as NavbarComp, NavDropdown } from 'react-bootstrap'
import Logonav from '../../assets/logo_digitel.png'
import { FaArrowRight } from 'react-icons/fa';
import "./Sidebar.css"
import { setAuthToken } from '../../config/api';
import { useMediaQuery } from 'react-responsive'
import BackgroundBatik from "../../assets/background_gotell.jpg"
import BackgroundBatik2 from "../../assets/signature/background-submenu.jpg"
import { useLocation } from 'react-router-dom';
import Caro1 from "../../assets/logo_digitel.png"

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function SidebarHome({ sidebarStatus, setSidebarStatus }){
  const navigate = useNavigate();
  const storageItems = JSON.parse(localStorage.getItem('menus'));
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)'})
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)'})
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })
  const urlColor = ""
  const levelUser = localStorage.getItem('level');

  // console.log(location.pathname)
  
  const logout = (e)=>{
    e.preventDefault();  
    localStorage.clear();
    navigate("/");
  };

  const modules = [
    {
      "id": "dd74266b-7ddd-4a84-80fc-b7bf7778f8d5",
      "name": "Dashboard",
      "slug_name": "user_previlege",
      "icon_name": "fa fa-home",
      "number_order": 2,
      "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
      "update_by": null,
      "created_at": "2023-08-30 08:20:00",
      "updated_at": "2023-08-30 08:20:00",
      "menus": [
          {
              "id": "1a730dc7-eede-4dd7-a8b7-22c3e8996ea7",
              "name": "Home",
              "slug_name": "specialist",
              "show": 1,
              "url": "\/dashboard",
              "icon": "fa fa-home",
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
        "name": "Partner",
        "slug_name": "user_previlege",
        "icon_name": "fa fa-user",
        "number_order": 2,
        "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
        "update_by": null,
        "created_at": "2023-08-30 08:20:00",
        "updated_at": "2023-08-30 08:20:00",
        "menus": [
            {
                "id": "1a730dc7-eede-4dd7-a8b7-22c3e8996ea7",
                "name": "Specialist",
                "slug_name": "specialist",
                "show": 1,
                "url": "\/specialists",
                "icon": "fa fa-user",
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
            {
                "id": "1aacc5e9-2efe-4c85-be35-b34933dfc027",
                "name": "Module",
                "slug_name": "module",
                "show": 1,
                "url": "\/privileges\/modules",
                "icon": "fa fa-user",
                "number_order": 6,
                "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                "update_by": null,
                "created_at": "2023-09-26 11:56:45",
                "updated_at": "2023-09-26 11:56:45",
                "create_by_data": {
                    "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                    "code": null,
                    "username": "superadmin",
                    "email": "ict@gratiajm.co.id",
                    "email_verified_at": null,
                    "level": "superadmin",
                    "extended_user": 0,
                    "created_at": "2023-08-30 08:16:38",
                    "updated_at": "2023-08-30 08:16:38",
                    "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
                },
                "update_by_data": null
            },
            {
                "id": "a8e1ebf9-a757-4ef9-bf70-42c40a1d3b37",
                "name": "User Privilege",
                "slug_name": "user_privilege",
                "show": 1,
                "url": "\/privileges\/users",
                "icon": "fa fa-user",
                "number_order": 4,
                "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                "update_by": null,
                "created_at": "2023-09-26 11:55:57",
                "updated_at": "2023-09-26 11:55:57",
                "create_by_data": {
                    "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                    "code": null,
                    "username": "superadmin",
                    "email": "ict@gratiajm.co.id",
                    "email_verified_at": null,
                    "level": "superadmin",
                    "extended_user": 0,
                    "created_at": "2023-08-30 08:16:38",
                    "updated_at": "2023-08-30 08:16:38",
                    "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
                },
                "update_by_data": null
            },
            {
                "id": "b193a01f-179a-4d07-811d-05fb8cd76658",
                "name": "Persentase Assurance",
                "slug_name": "persentase_assurance",
                "show": 1,
                "url": "\/persentase-assurances",
                "icon": "fa fa-user",
                "number_order": 42,
                "create_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
                "update_by": null,
                "created_at": "2024-03-15 07:47:01",
                "updated_at": "2024-03-15 07:47:01",
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
                "update_by_data": null
            },
            {
                "id": "de517954-85aa-4397-94a5-185a55295152",
                "name": "Menu",
                "slug_name": "menu",
                "show": 1,
                "url": "\/privileges\/menus",
                "icon": "fa fa-user",
                "number_order": 5,
                "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                "update_by": null,
                "created_at": "2023-09-26 11:56:26",
                "updated_at": "2023-09-26 11:56:26",
                "create_by_data": {
                    "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                    "code": null,
                    "username": "superadmin",
                    "email": "ict@gratiajm.co.id",
                    "email_verified_at": null,
                    "level": "superadmin",
                    "extended_user": 0,
                    "created_at": "2023-08-30 08:16:38",
                    "updated_at": "2023-08-30 08:16:38",
                    "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
                },
                "update_by_data": null
            },
            {
                "id": "e59add98-de13-492e-9776-d95dcfe38167",
                "name": "Role Privilege",
                "slug_name": "role_privilege",
                "show": 1,
                "url": "\/privileges\/roles",
                "icon": "fa fa-user",
                "number_order": 3,
                "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                "update_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
                "created_at": "2023-09-26 11:54:51",
                "updated_at": "2023-09-26 14:44:45",
                "create_by_data": {
                    "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                    "code": null,
                    "username": "superadmin",
                    "email": "ict@gratiajm.co.id",
                    "email_verified_at": null,
                    "level": "superadmin",
                    "extended_user": 0,
                    "created_at": "2023-08-30 08:16:38",
                    "updated_at": "2023-08-30 08:16:38",
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
            }
        ]
    },
    {
      "id": "dd74266b-7ddd-4a84-80fc-b7bf7778f8d5",
      "name": "Rangking",
      "slug_name": "user_previlege",
      "icon_name": "fa fa-user",
      "number_order": 2,
      "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
      "update_by": null,
      "created_at": "2023-08-30 08:20:00",
      "updated_at": "2023-08-30 08:20:00",
      "menus": [
          {
              "id": "1a730dc7-eede-4dd7-a8b7-22c3e8996ea7",
              "name": "Specialist",
              "slug_name": "specialist",
              "show": 1,
              "url": "\/specialists",
              "icon": "fa fa-user",
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
          {
              "id": "1aacc5e9-2efe-4c85-be35-b34933dfc027",
              "name": "Module",
              "slug_name": "module",
              "show": 1,
              "url": "\/privileges\/modules",
              "icon": "fa fa-user",
              "number_order": 6,
              "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
              "update_by": null,
              "created_at": "2023-09-26 11:56:45",
              "updated_at": "2023-09-26 11:56:45",
              "create_by_data": {
                  "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                  "code": null,
                  "username": "superadmin",
                  "email": "ict@gratiajm.co.id",
                  "email_verified_at": null,
                  "level": "superadmin",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:38",
                  "updated_at": "2023-08-30 08:16:38",
                  "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
              },
              "update_by_data": null
          },
          {
              "id": "a8e1ebf9-a757-4ef9-bf70-42c40a1d3b37",
              "name": "User Privilege",
              "slug_name": "user_privilege",
              "show": 1,
              "url": "\/privileges\/users",
              "icon": "fa fa-user",
              "number_order": 4,
              "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
              "update_by": null,
              "created_at": "2023-09-26 11:55:57",
              "updated_at": "2023-09-26 11:55:57",
              "create_by_data": {
                  "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                  "code": null,
                  "username": "superadmin",
                  "email": "ict@gratiajm.co.id",
                  "email_verified_at": null,
                  "level": "superadmin",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:38",
                  "updated_at": "2023-08-30 08:16:38",
                  "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
              },
              "update_by_data": null
          },
          {
              "id": "b193a01f-179a-4d07-811d-05fb8cd76658",
              "name": "Persentase Assurance",
              "slug_name": "persentase_assurance",
              "show": 1,
              "url": "\/persentase-assurances",
              "icon": "fa fa-user",
              "number_order": 42,
              "create_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
              "update_by": null,
              "created_at": "2024-03-15 07:47:01",
              "updated_at": "2024-03-15 07:47:01",
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
              "update_by_data": null
          },
          {
              "id": "de517954-85aa-4397-94a5-185a55295152",
              "name": "Menu",
              "slug_name": "menu",
              "show": 1,
              "url": "\/privileges\/menus",
              "icon": "fa fa-user",
              "number_order": 5,
              "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
              "update_by": null,
              "created_at": "2023-09-26 11:56:26",
              "updated_at": "2023-09-26 11:56:26",
              "create_by_data": {
                  "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                  "code": null,
                  "username": "superadmin",
                  "email": "ict@gratiajm.co.id",
                  "email_verified_at": null,
                  "level": "superadmin",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:38",
                  "updated_at": "2023-08-30 08:16:38",
                  "photo_profile": "https:\/\/storageapps.signatureanugerah.co.id\/public\/images\/no-profile.png"
              },
              "update_by_data": null
          },
          {
              "id": "e59add98-de13-492e-9776-d95dcfe38167",
              "name": "Role Privilege",
              "slug_name": "role_privilege",
              "show": 1,
              "url": "\/privileges\/roles",
              "icon": "fa fa-user",
              "number_order": 3,
              "create_by": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
              "update_by": "39ae2633-2de1-4740-ab24-0c76d2136345",
              "created_at": "2023-09-26 11:54:51",
              "updated_at": "2023-09-26 14:44:45",
              "create_by_data": {
                  "id": "2b660ec8-027f-4042-8f29-4bb59a3ecb1c",
                  "code": null,
                  "username": "superadmin",
                  "email": "ict@gratiajm.co.id",
                  "email_verified_at": null,
                  "level": "superadmin",
                  "extended_user": 0,
                  "created_at": "2023-08-30 08:16:38",
                  "updated_at": "2023-08-30 08:16:38",
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
          }
      ]
    },
  ]

  return (
    <Sidebar width={10} backgroundColor="#15283c" className='sidebar-icon' style={{ width: "100%", height: "100%", position: "", border: "none", background: "#0B5580" }}>
    <Menu style={{ marginTop: "" }} closeOnClick>
      <div style={{display:"flex", justifyContent:"center", backgroundColor:"#15283c"}}>
        <div style={{display:"flex"}}>
          <div style={{padding:"10px 0px"}}>
            <img src={Caro1} className="rounded-pill" style={{width:"80px", height:"70px"}} />
          </div>
          <div style={{color:"white", display:"flex", justifyContent:"center", alignItems:"center"}}>
            {/* <div>
              <div style={{display:"flex", alignItems:"center", fontSize:"20px", fontWeight:"bold"}}>
                Digi<div style={{color:"#00FF55"}}>Tel</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
  
      <div style={{display:"flex", justifyContent:"center", padding:"15px 0px", fontFamily:"Poppins", fontWeight:"bold", borderBottom:"1px solid #A59423"}}>
        <div style={{color:"white"}}>
          G
        </div>
      </div>
      
      {modules.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
            <></>
          ) : (
            <SubMenu className='mt-2' key={index}   
              icon={<i className="fa fa-book" style={{display:"flex",justifyContent:"center", height:"100%", alignItems:"center", color:"#DFFF00", fontSize:"20px"}}/>}>
              {item.menus.map((itemss) => (
                <MenuItem  href={itemss.url} style={{display:"flex", justifyContent:"center", height:"5vh", fontSize:"12px", fontWeight:"", fontFamily: "sans-serif", backgroundColor:""}}>
                  <FaDotCircle style={{ marginRight: "10px", marginBottom: "3px", fontSize: "10px", color: "#666666"}} />
                  {itemss.name}
                </MenuItem>
              ))}
            </SubMenu>
          )
        ) : (
          <MenuItem className="menu-item" href={item.url} style={{fontFamily: "sans-serif", marginLeft: "0px"}} icon={<i className={item.icon_name} style={{color:"#666666", fontSize: "20px"}} />}>
            {item.name}
          </MenuItem>
        )
      ))}
    </Menu>
  </Sidebar>
  )
}
