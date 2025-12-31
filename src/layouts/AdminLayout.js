import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import NavbarMobile from "../components/Navbar/NavbarAdmin/NavbarMobile";
import NavbarDekstop from "../components/Navbar/NavbarAdmin/NavbarDekstop";
import Sidebar from "../components/Sidebar/Sidebar";

export default function AdminLayout() {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 780px)" });

  return (
    <div style={{ backgroundColor: "#fafbffff", minHeight: "100vh" }}>
      {isTabletOrMobile ? (
        <>
          <NavbarMobile />
          <Outlet />
        </>
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div style={{ flex: "10%" }}>
            <Sidebar />
          </div>
          <div style={{ flex: "90%" }}>
            <NavbarDekstop />
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
}
