import AdminHome from "../../components/ListMasterJenjang/Home";
import React from "react";
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from "../../components/Navbar/NavbarAdmin/NavbarMobile"
import NavbarDekstop from "../../components/Navbar/NavbarAdmin/NavbarDekstop"
import Sidebar from "../../components/Sidebar/SidebarHome";

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  
  return (
  <div style={{ minHeight:"100vh"}}>
      {isTabletOrMobile ? (
      <div>
        <NavbarMobile />         
        <AdminHome />
      </div>
    ) : (
      <div style={{ minHeight: "100vh", display: "flex" }}>
            <div style={{ display: "flex", flex: "1" }}>
              <div style={{ flex: "10%" }}>
                <Sidebar />
              </div>
              <div style={{ flex: "90%" }}>
                <NavbarDekstop />
                <AdminHome />
              </div>
            </div>
          </div>
    )}
  </div>
  );
}
