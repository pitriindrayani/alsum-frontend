import AdminHome from "../../components/Admin/AdminHome";
import React from "react";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useMediaQuery } from 'react-responsive'
import Sidebar from "../../components/Sidebar/Sidebar";
import NavbarMobile from "../../components/Navbar/NavbarAdmin/NavbarMobile"
import NavbarDekstop from "../../components/Navbar/NavbarAdmin/NavbarDekstop"
// init token on axios every time the app is refreshed

// if (localStorage.token) {
//   setAuthToken(localStorage.token);
// }

export default function Home() {\
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
 
  return (
    <div style={{ minHeight:isTabletOrMobile? "100vh" : "100vh", display:isTabletOrMobile? "" : "flex" }}>
      {isTabletOrMobile ? (
      <div style={{display:""}}>
        <NavbarMobile />         
        <AdminHome />
      </div>
    ) : (
      <div style={{ display: "flex", flex: "1" }}>
        <div style={{ flex: "10%" }}>
          <Sidebar />
        </div>
        <div style={{ flex: "90%" }}>
          <NavbarDekstop />
          <AdminHome />
        </div>
      </div>
    )}
  </div>
  );
}
