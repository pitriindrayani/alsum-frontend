import ListRolePermission from "../../components/ListRolePermission/Home";
import React from "react";
import { useMediaQuery } from 'react-responsive'
import NavbarMobile from "../../components/Navbar/NavbarAdmin/NavbarMobile"
import NavbarDekstop from "../../components/Navbar/NavbarAdmin/NavbarDekstop"
import Sidebar from "../../components/Sidebar/SidebarHome";

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  
  return (
    <ListRolePermission/>
  );
}
