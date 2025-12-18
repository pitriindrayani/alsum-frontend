import AdminHome from "../../components/ListMasterCabang/Home";
import React from "react";
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from "../../components/Navbar/NavbarAdmin/NavbarMobile"
import NavbarDekstop from "../../components/Navbar/NavbarAdmin/NavbarDekstop"

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
    <div>
      <NavbarDekstop />
      <AdminHome />
    </div>
  )}
</div>
  );
}
