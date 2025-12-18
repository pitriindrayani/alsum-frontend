// import './App.css';
// import { Routes, useNavigate } from "react-router-dom";
// import React, { useEffect } from 'react';
// import {  Route } from 'react-router-dom';
// import Auth from "./pages/Auth/Auth";

import './App.css';
import {  Routes, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import {  Route } from 'react-router-dom';
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
import AdminMasterJenjang from "./pages/ListMasterJenjang/Home";
import AdminMasterCabang from "./pages/ListMasterCabang/Home";
import AdminMasterJabatan from "./pages/ListMasterJabatan/Home";
import AdminMasterStatusGuru from "./pages/ListMasterStatusGuru/Home";
import AdminMasterGolongan from "./pages/ListMasterGolongan/Home";
import AdminMasterCuti from "./pages/ListMasterCuti/Home";
import AdminMasterKalenderLibur from "./pages/ListMasterKalenderLibur/Home";
import AdminMasterKalenderGuru from "./pages/ListMasterKalenderGuru/Home";
import AdminMasterPeriod from "./pages/ListMasterPeriod/Home";
import AdminMasterSchedules from "./pages/ListMasterSchedules/Home";
import AdminMasterTeacher from "./pages/ListMasterGuru/Home";
import AdminMasterUkk from "./pages/ListMasterUkk/Home";
import AdminMasterKinerja from "./pages/ListMasterKinerja/Home";

// Data 
import AdminDataAbsensi from "./pages/ListDataAbsesnsi/Home";
import AdminDataAbsensiDetail from "./pages/ListDataAbsesnsiDetail/Home";
import AdminDataAbsensiDetailHead from "./pages/ListDataAbsesnsiDetailHead/Home";

import AdminDataListAbsensi from "./pages/ListDataAbsensiAll/Home";
import AdminDataListAbsensiHead from "./pages/ListDataAbsensiAllHead/Home";

import AdminDataAbsenLog from "./pages/ListDataAbsensiLog/Home";
import AdminDataKoreksiAbsen from "./pages/ListDataKoreksiAbsen/Home";
import AdminWfh from "./pages/ListDataWfh/Home";
import AdminWfhFilterHead from "./pages/ListDataWfhFilterHead/Home";
import AdminWfhFilterHr from "./pages/ListDataWfhFilterHr/Home";

import AdminDataKoreksiAbsenFilter from "./pages/ListDataKoreksiAbsenFilter/Home";
import AdminDataKoreksiAbsenFilterHead from "./pages/ListDataKoreksiAbsenFilterHead/Home";

import AdminDataUkk from "./pages/ListMasterUkk/Home";

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
        navigate("/"); 
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
    { currentPath.length > 0 && <Layout />}
    <div className="main_content">
      <Routes>
          <Route path={'/'} element={<Auth />} />
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

      {/* Admin Sekolah */}
      <Route exact path="/educational-stages" element={<AdminMasterSekolah/>}/>

      {/* Admin Jenjang */}
      <Route exact path="/schools" element={<AdminMasterJenjang/>}/>

      {/* Admin Cabang */}
      <Route exact path="/branches" element={<AdminMasterCabang/>}/>

      {/* Admin Jabatan */}
      <Route exact path="/positions" element={<AdminMasterJabatan/>}/>
      
      {/* Admin Status Guru */}
      <Route exact path="/teacher-status" element={<AdminMasterStatusGuru/>}/>

      {/* Admin Golongan */}
      <Route exact path="/teacher-groups" element={<AdminMasterGolongan/>}/>\\

      {/* Admin Cuti */}
      <Route exact path="/leaves" element={<AdminMasterCuti/>}/>

      {/* Admin Kalender Libur */}
      <Route exact path="/holidays" element={<AdminMasterKalenderLibur/>}/>

      {/* Admin Kalender Guru */}
      <Route exact path="/schedule-times" element={<AdminMasterKalenderGuru/>}/>

      {/* Admin Periode */}
      <Route exact path="/periods" element={<AdminMasterPeriod/>}/>

      {/* Admin Jadwal Kerja */}
      <Route exact path="/schedules" element={<AdminMasterSchedules/>}/>
      
      {/* Admin Guru */}
      <Route exact path="/teachers" element={<AdminMasterTeacher/>}/>
      
      {/* Admin Kalender Libur */}
      <Route exact path="/attendance-summarys" element={<AdminDataAbsensi/>}/>

      {/* Admin Kalender Libur */}
      <Route exact path="/attendance-summary-details/:id_teacher/:year/:month" element={<AdminDataAbsensiDetail/>}/>

      {/* Admin Detail List Absensi Guru Untuk Kepala Sekolah */}
      <Route exact path="/attendance-summary-details-head/:id_teacher/:year/:month" element={<AdminDataAbsensiDetailHead/>}/>

      {/* Admin List Absensi Guru */}
      <Route exact path="/attendance-summary-lists" element={<AdminDataListAbsensi/>}/>

      {/* Admin List Absensi Guru Untuk Kepala Sekolah*/}
      <Route exact path="/attendance-summary-lists-head" element={<AdminDataListAbsensiHead/>}/>

      {/* Admin Absen Log */}
      <Route exact path="/attendance-trxs" element={<AdminDataAbsenLog/>}/>

      {/* Admin Koreksi Absen */}
      <Route exact path="/attendance-dailys" element={<AdminDataKoreksiAbsen/>}/>

      {/* Admin WFH */}
      <Route exact path="/wfh" element={<AdminWfh/>}/>

       {/* Admin WFH */}
      <Route exact path="/wfh-filter-head" element={<AdminWfhFilterHead/>}/>

      {/* Admin WFH */}
      <Route exact path="/wfh-filter-hr" element={<AdminWfhFilterHr/>}/>

      {/* Admin Koreksi Absen Filter */}
      <Route exact path="/attendance-dailys-filter" element={<AdminDataKoreksiAbsenFilter/>}/>

      {/* Admin Koreksi Absen Filter Head */}
      <Route exact path="/attendance-dailys-filter-head" element={<AdminDataKoreksiAbsenFilterHead/>}/>

      {/* Admin Absen Log */}
      <Route exact path="/attendance-summary-ukks" element={<AdminDataUkk/>}/>

      {/* Admin Master ukk */}
      <Route exact path="/ukk-configs" element={<AdminMasterUkk/>}/>

      {/* Admin Master kinerja */}
      <Route exact path="/kinerja" element={<AdminMasterKinerja/>}/>

      {/* Admin Ganti Password */}
      <Route exact path="/change-password" element={<AdminChangePassword/>}/>

      {/* Not Found Page */}
      <Route path="*" element={<My404Component />} />
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
