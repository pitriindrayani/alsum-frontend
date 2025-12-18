import React, { useState, useEffect, Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import {  Dropdown } from "react-bootstrap";
import { useNavigate } from 'react-router';
import { setAuthToken } from '../../../config/api';
import { Link } from 'react-router-dom';
import masgan from "../../../assets/masgan.png";
import { FaUserAlt, FaSignOutAlt, FaList } from "react-icons/fa";
// ** Third Party Components
import 'chart.js/auto'
import { useMediaQuery } from 'react-responsive'
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaAccessibleIcon, FaAdjust, FaMailBulk, FaRssSquare, FaStackExchange, FaStackpath, FaStarOfLife, FaTransgender, FaUser } from 'react-icons/fa';
import SidebarMenu from '../../Sidebar/Sidebar';

// init token on axios every time the app is refreshed
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const User = ({setViewSidebar}) => {
  document.title = 'Home Admin';
  let navigate = useNavigate();
  const username = localStorage.getItem("username")

  const handleChangeName = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.toLowerCase(),
    });
  };

  const [form, setForm] = useState({ 
    name: "",
    desc: "",
    url: "",
  });

//   const handleSubmitName = (e) => {
//     e.preventDefault();
//     setDataMap(form.name);
// };

  const logout = (e)=>{
    e.preventDefault();
    localStorage.clear();
    navigate("/");
  };

    // ** Context, Hooks & Vars
    // const { colors } = useContext(ThemeColors),
      // { skin } = useSkin(),
      
      const labelColor = '#6e6b7b',
      color = 'black',
      colorWarning = 'black',
      colorPrimary = 'black',
      tooltipShadow = 'rgba(0, 0, 0, 0.25)',
      gridLineColor = 'rgba(200, 200, 200, 0.2)',
      lineChartPrimary = '#666ee8',
      lineChartDanger = '#ff4961',
      warningColorShade = '#ffbd1f',
      warningLightColor = '#FDAC34',
      successColorShade = '#0066CC',
      successColorShadeYear = '#00cc00',
      primaryColorShade = '#836AF9',
      infoColorShade = '#299AFF',
      yellowColor = '#ffe800',
      greyColor = '#4F5D70',
      blueColor = '#2c9aff',
      blueLightColor = '#84D0FF',
      greyLightColor = '#EDF1F4'
  
      // setting Marque Speed
      const setting = {
        speed : 40
      }
      
    const viewSidebar = () => {
      setViewSidebar(true)
    }

    useEffect(() => {
    },[viewSidebar]);

    // const viewSidebar = () => {
    //   localStorage.setItem("open", false)
    // }
    
  return (
  <Fragment>
  <Row className='match-height' style={{backgroundColor:"#F6F6F6"}}>
    <Col xl='12' sm='12' style={{backgroundColor:"white",boxShadow:"10px 0px 10px #BFBFBF"}}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid" style={{position:"fixed", backgroundColor:"white"}}>
            {[false].map((expand) => (
            <Navbar key={expand} expand={expand} >
                <Container fluid>
                  {/* <Navbar.Brand href="#">Hi, Admin</Navbar.Brand> */}
                  <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} style={{color:"white"}} />
                  <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-${expand}`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                    placement="start"
                    style={{backgroundColor:"#FCFCFC"}}
                  >
                    <Offcanvas.Header closeButton style={{backgroundColor:"#0091FF"}}>
                      <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`} style={{color:"white"}}>
                        Sidebar
                      </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>

                      <SidebarMenu />
              
                    </Offcanvas.Body>
                  </Navbar.Offcanvas>
                </Container>
              </Navbar>
              ))}
              
            <div style={{display:"flex", justifyContent:"end"}}>
              <p style={{marginTop:"15px", paddingLeft:"5px"}}>{username}</p>
              <Dropdown>
                <Dropdown.Toggle id="user-dropdown" variant="white">
                  <img src={masgan} alt="Masgan" width={40} className="rounded-pill" />
                </Dropdown.Toggle>
                <Dropdown.Menu variant="light" style={{alignItem:"left", marginTop:"7px"}}>
                  <Dropdown.Item as={Link} to="/admin-profile">
                    <FaUserAlt className="text-danger me-2" ></FaUserAlt>
                    <span>Profile</span>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logout} >
                    <FaSignOutAlt className="text-danger me-2"/>
                    <span>Logout</span>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>  
        </Col>
        </Row>
    </Fragment>
  );
}
export default User;