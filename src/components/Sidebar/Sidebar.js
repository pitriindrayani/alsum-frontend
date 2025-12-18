import React from 'react'
import { Sidebar, Menu, MenuItem,SubMenu } from 'react-pro-sidebar';
import {FaDotCircle} from "react-icons/fa";
import {  useNavigate } from "react-router-dom";
import "./Sidebar.css"
import { setAuthToken } from '../../config/api';
import Caro1 from "../../assets/ysb/logo_alsum_saja.png"


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function SidebarHome(){
  const navigate = useNavigate();
  const storageItems = JSON.parse(localStorage.getItem('menus'));
  const levelUser = localStorage.getItem('level');

  const navigateHome = ()=>{
    navigate("/dashboard");
  };

  

  return (
  <Sidebar backgroundColor="white" className='sidebar' style={{width:"100%",height:"100%",position:"",border:"none", background: "#0B5580"}}>
    <Menu style={{ marginTop: "" }}>
      <div style={{display:"flex", justifyContent:"", backgroundColor:"white", paddingLeft:"30px"}}>
        <div style={{display:"flex"}}>
          <div className='mr-4' style={{padding:"10px 0px"}}>
            <img src={Caro1} onClick={navigateHome} className="rounded-pill" style={{width:"80px", height:"70px", cursor:"pointer"}} />
          </div>
          <div style={{color:"#00487F", display:"flex", justifyContent:"center", alignItems:"center"}}>
            <div>
              <div style={{display:"flex", alignItems:"center", fontSize:"20px", fontWeight:"bold"}}>
                Al Azhar Summarecon
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div style={{display:"flex", justifyContent:"start", padding:"10px 0px", fontFamily:"Poppins", fontWeight:"bold", borderBottom:"2px solid white"}}>
        <div style={{marginLeft:"20px", color:"#00487F"}}>
          General
        </div>
      </div>
      
      {storageItems.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
            <></>
          ) : (
            <SubMenu className='mt-2 submenu-label' key={index} style={{fontFamily:"Poppins", paddingLeft:"", display:"flex", alignItems:"center", height:"5vh", fontWeight:"", color:"#575757", fontSize:"14px"}} label={item.name}  
              icon={<i className={item.icon_name} style={{display:"flex", height:"100%", alignItems:"center", paddingLeft:"10px", marginLeft:"10px", color: item?.color_icon, fontSize:"20px"}}/>}>
              {item.menus.map((itemss) => (
                <MenuItem className="menu-item"  href={itemss.url} style={{height:"5vh", fontSize:"12px", fontWeight:"", fontFamily: "sans-serif", paddingLeft: "55px", backgroundColor:""}}>
                  <FaDotCircle style={{ marginRight: "10px", marginBottom: "3px", fontSize: "10px", color: "#666666"}} />
                  {itemss.name}
                </MenuItem>
              ))}
            </SubMenu>
          )
        ) : (
          <MenuItem className="menu-item" href={item.url} style={{fontFamily: "sans-serif", marginLeft: "0px"}} icon={<i className={item.icon_name} style={{marginLeft: "15px", color:"#666666", fontSize: "20px"}} />}>
            {item.name}
          </MenuItem>
        )
      ))}
    </Menu>
  </Sidebar>
  )

  
    
}
