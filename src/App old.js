
import './App.css';
import {  Routes, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import {  Route } from 'react-router-dom';


// ------------ ROUTE HALAMAN PUBLIC ------------------- //
import Header from "./components-public/Header";
import Beranda from "./pages-public/Beranda/Home";



// ------------ ROUTE HALAMAN ADMIN ------------------- //

import Auth from "./pages/Auth/Auth";
import NavbarMobile from "./components/Navbar/NavbarAdmin/NavbarMobile";
import NavbarDekstop from "./components/Navbar/NavbarAdmin/NavbarDekstop";
import { useMediaQuery } from 'react-responsive'
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Home";

// User Management
import AdminHome from "./pages/Dashboard/Home";
import AdminMenus from "./pages/ListMenu/Home";
import AdminRoles from "./pages/ListRole/Home";
import AdminRolePermision from "./pages/ListRolePermission/Home";
import AdminModules from "./pages/ListModule/Home";
import AdminSubModules from "./pages/ListSubModule/Home";
import AdminUsers from "./pages/ListUser/Home";
import AdminUserPermission from "./pages/ListUserPermission/Home";

// Master Data
import AdminMasterSekolah from "./pages/ListMasterSekolah/Home";
import AdminMasterJenjang from "./pages/DataSekolah/Home";
import AdminMasterCabang from "./pages/ListMasterCabang/Home";

// Ganti Password
import AdminChangePassword from "./pages/ListChangePassword/Home";

// Not Found Page
import My404Component from "./pages/NotFoundPage/PageNotFound";


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      const expiry = localStorage.getItem("token_expiry");

      if (!token || !expiry || new Date().getTime() > expiry) {
        localStorage.clear();
        // navigate("/"); 
        navigate("/1337");
      }
    };

    checkToken();
    const interval = setInterval(() => {
      checkToken();
    }, 3600000);

    return () => clearInterval(interval);
  }, [navigate]);


  const pathName = window.location.pathname
  const arr = pathName.toString().split("/");
  const currentPath = arr[arr.length-1];

return (
  <>
  <div>
    {/* { currentPath.length > 0 && <Layout />} */}
    { currentPath !== "1337" && <Layout /> }
    <div className="main_content">
      <Routes>
          {/* <Route path={'/'} element={<Auth />} /> */}
          <Route path="/1337" element={<Auth />} />
      </Routes>
    </div>
  </div>
     
  </>        
 
  );
}

function Content() {
  return (
  <>
  <Routes>
     {/* Auth */}
      {/* <Route exact path="/" element={<Auth />} /> */}

      {/* Dashboard */}
      <Route exact path="/dashboard" element={<AdminHome />}/>

      {/* Admin Menus */}
      <Route exact path="/privileges/menus" element={<AdminMenus />} />

      {/* Admin Roles */}
      <Route exact path="/privileges/roles" element={<AdminRoles />} />

      {/* Admin Role Permision */}
      <Route exact path="/privileges/roles/:id/:name" element={<AdminRolePermision/>}/>
      
      {/* Admin Modules */}
      <Route exact path="/privileges/modules" element={<AdminModules />} />

      {/* Admin Sub Modules */}
      <Route exact path="/privileges/sub-modules/:id/:slug_name" element={<AdminSubModules />} />

      {/* Admin User */}
      <Route exact path="/privileges/users" element={<AdminUsers/>} />

      {/* Admin User Permission */}
      <Route exact path="/permissions/:id/:firstname/:lastname" element={<AdminUserPermission/>}/>
     
      {/* Admin Ganti Password */}
      <Route exact path="/change-password" element={<AdminChangePassword/>}/>

      {/* Not Found Page */}
      <Route path="*" element={<My404Component />} />

       {/* Admin Sekolah */}
      <Route exact path="/educational-stages" element={<AdminMasterSekolah/>}/>

      {/* Admin Jenjang */}
      <Route exact path="/schools" element={<AdminMasterJenjang/>}/>

      {/* Admin Cabang */}
      <Route exact path="/branches" element={<AdminMasterCabang/>}/>

  </Routes>
  </>
  )
}


function Layout() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});
  return (
  <>
  <div style={{ backgroundColor:"#fafbffff", minHeight:isTabletOrMobile? "100vh" : "", display:isTabletOrMobile? "" : "" }}>
          {isTabletOrMobile ? (
          <div style={{display:""}}>
            <NavbarMobile />         
            <Content />
          </div>
        ) : (
        <div style={{ minHeight: "100vh", display: "flex" }}>
              <div style={{ display: "flex", flex: "1" }}>
                <div style={{ flex: "10%" }}>
                  <Sidebar />
                </div>
                <div style={{ flex: "90%" }}>
                  <NavbarDekstop />
                  <Content />
                </div>
              </div>
        </div>
        )}
      </div>
    </>
  )
}

export default App;
