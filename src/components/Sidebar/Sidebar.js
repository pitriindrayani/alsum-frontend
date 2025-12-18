import {React, useState} from 'react'
import {FaDotCircle} from "react-icons/fa";
import "./Sidebar.css"
import { setAuthToken } from '../../config/api';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {  useNavigate, Link, useLocation } from "react-router-dom";
import "./Sidebar.css"
import Logo from "../../assets/logo.png";
import Arrow from "../../assets/arrow.png";
import App from "../../assets/app.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-regular-svg-icons'
import { useMediaQuery } from 'react-responsive'


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

  // Responsive to mobile or dekstop
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  return (
  <Sidebar backgroundColor='#0abcd7ff'  className='sidebar' style={{width:"100%",height:"100%",position:"",border:"none", color:"#ffffffff" }}>

     <Menu 
    >
     
    {isTabletOrMobile ? 
    // SIDEBAR MOBILE
        <>
          
          <MenuItem 
            className='dash-side'
                onClick={navigateHome}  
                style={{fontSize:"14px", paddingLeft: "40px", marginTop: "10px", marginBottom: "5px" }}> 
                <FontAwesomeIcon icon={faHouse}/> 
                <span style={{paddingLeft: "9px", }}>
                Dashboard  </span>
          </MenuItem>
        
          {storageItems.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
            <></>
          ) : (
            <SubMenu className='menu-module' 
              label={item.name}  
              style={{paddingLeft:"20px", height:"5vh"}} 
              icon={<i className={item.icon_name} style={{marginRight:"-20px"}}/>}>

                {item.menus.map((itemss) => (
                  <MenuItem  
                    className="menu-item "  
                    component={<Link to={{ pathname: `${itemss.url}`}}/>}
                    active={window.location.pathname === `${itemss.url}`}
                    style={{height:"4vh", fontSize:"13px", paddingLeft: "62px", backgroundColor:'#0abcd7ff'}}>
                    <img src={Arrow} className='icon-arrow' style={{marginRight:"6px"}} /> {itemss.name}
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
                              
                                          
        </>
        : 
        <>
        {/* SIDEBAR DESKTOP */}
          <div className='logo-dashboard' style={{paddingBottom:"15px",  borderBottom: "1px solid #ffffffff" }}>
            <img src={Logo} onClick={navigateHome}  />
          </div>
          
          <MenuItem 
            className='dash-side'
                onClick={navigateHome}  
                style={{fontSize:"14px", paddingLeft: "40px", marginTop: "10px", marginBottom: "5px" }}> 
                <FontAwesomeIcon icon={faHouse}/> 
                <span style={{paddingLeft: "9px", }}>
                Dashboard  </span>
          </MenuItem>
         
          
        {storageItems.map((item, index) => (
          (item.url === "" || item.url == null) ? (
            (item.name === "User Previlege" && levelUser !== "developer") ? (
              <></>
            ) : (
              <SubMenu className='menu-module' 
              label={item.name}  
              style={{paddingLeft:"20px", height:"5vh", borderBottom:"1px solid #4cd6ebff"}} 
              icon={<i className={item.icon_name} style={{marginRight:"-20px"}}/>}>

                {item.menus.map((itemss) => (
                  <MenuItem  
                    className="menu-item "  
                    component={<Link to={{ pathname: `${itemss.url}`}}/>}
                    active={window.location.pathname === `${itemss.url}`}
                    style={{height:"4vh", fontSize:"14px", paddingLeft: "62px", backgroundColor:'#0abcd7ff'}}>
                    <img src={Arrow} className='icon-arrow' style={{marginRight:"6px"}} /> {itemss.name}
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
                                    
        </>
    }
    </Menu>
  </Sidebar>
  )

  
    
}
