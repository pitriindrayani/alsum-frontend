import './App.css';
import {  Routes, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import {  Route } from 'react-router-dom';
import Auth from "./pages/Auth/Auth";

import NavbarMobile from "./components/Navbar/NavbarAdmin/NavbarMobile";
import NavbarDekstop from "./components/Navbar/NavbarAdmin/NavbarDekstop";
import { useMediaQuery } from 'react-responsive'
import Sidebar from "./components/Sidebar/SidebarHome";
import Dashboard from "./pages/Dashboard/Home";

// Master Data
import MasterDaftarPengguna from "./pages/DaftarPengguna/Home";
import MasterCabang from "./pages/categories/superadmin/master_data/cabang/Home";
import MasterKaryawan from "./pages/categories/superadmin/master_data/karyawan/Home";
import MasterGuru from "./pages/categories/superadmin/master_data/guru/Home";
import MasterPendaftaran from "./pages/categories/superadmin/master_data/pendaftaran/Home";
import MasterSekolah from "./pages/categories/superadmin/master_data/sekolah/Home";
import MasterJenjang from "./pages/categories/superadmin/master_data/jenjang/Home"; 
import MasterDept from "./pages/categories/superadmin/master_data/departemen/Home";
import MasterLantai from "./pages/categories/superadmin/master_data/lantai/Home";
import MasterCheckpoint from "./pages/categories/superadmin/master_data/checkpoint/Home";


// Privilege
import AdminSetups from "./pages/categories/superadmin/privilege/setup/Home";
import AdminApps from "./pages/categories/superadmin/privilege/kategori/Home";
import AdminAppsModule from "./pages/categories/superadmin/privilege/integrasi_module/Home";
import AdminModuleMenus from "./pages/categories/superadmin/privilege/integrasi_menu/Home";
import AdminMenus from "./pages/ListMenu/Home";
import AdminRoles from "./pages/ListRole/Home";
import AdminRolePermision from "./pages/ListRolePermission/Home";
import AdminModules from "./pages/ListModule/Home";
import AdminSubModules from "./pages/ListSubModule/Home";
import AdminUsers from "./pages/ListUser/Home";
import AdminUserPermission from "./pages/ListUserPermission/Home";
import AdminChangePassword from "./pages/ListChangePassword/Home";

// On Dev
import PageOnDev from "./pages/PageOnDev/PageOnDev";

// Not Found Page
import My404Component from "./pages/NotFoundPage/PageNotFound";

// QR Patrol
import BerandaPatrol from "./pages/categories/operational/qr_patrol/beranda/Home";
import CheckPoint from "./pages/categories/operational/qr_patrol/titik_pemeriksaan/Home";
import InspectionNotes from "./pages/categories/operational/qr_patrol/catatan_pemeriksaan/Home";

// LMS
import DataMurid from "./pages/DataMurid/Home";
import DataKelas from "./pages/categories/siakad/lms/data_kelas/Home";
import DataTahunAjaran from "./pages/DataTahunAjaran/Home";
import DataTingkatan from "./pages/categories/siakad/lms/data_tingkatan/Home";


// Laporan Adab
import MasterElements from "./pages/categories/siakad/laporan_adab/elements/Home";
import MasterSubElements from "./pages/categories/siakad/laporan_adab/sub_element/Home";
import MasterKKCA from "./pages/categories/siakad/laporan_adab/kkca/Home";
import MasterDimensi from "./pages/categories/siakad/laporan_adab/master_dimensi/Home";
import BerandaLA from "./pages/categories/siakad/laporan_adab/beranda/Home";
import IdentitasMurid from "./pages/categories/siakad/laporan_adab/identitas_sekolah/Home";
import Dimensi from "./pages/categories/siakad/laporan_adab/dimensi/Home";
import DimensiHead from "./pages/categories/siakad/laporan_adab/dimensi/HomeHead";
import DimensiHeadSuper from "./pages/categories/siakad/laporan_adab/dimensi/HomeHeadSuper";
import DimensiTeacher from "./pages/categories/siakad/laporan_adab/dimensi/HomeTeacher";
import Leger from "./pages/categories/siakad/laporan_adab/leger/Home";
import LegerHead from "./pages/categories/siakad/laporan_adab/leger/HomeHead";
import LegerTeacher from "./pages/categories/siakad/laporan_adab/leger/HomeTeacher";
import Rapor from "./pages/categories/siakad/laporan_adab/rapor/Home";
import RaporHead from "./pages/categories/siakad/laporan_adab/rapor/HomeHead";
import RaporTeacher from "./pages/categories/siakad/laporan_adab/rapor/HomeTeacher";
import PengaturanDimensi from "./pages/categories/siakad/laporan_adab/pengaturan_dimensi/Home";
import PengaturanDimensiHead from "./pages/categories/siakad/laporan_adab/pengaturan_dimensi/HomeHead";
import PengaturanDimensiConfig from "./pages/categories/siakad/laporan_adab/pengaturan_dimensi/HomeConfigDimensi";
import DashboardTeacher from "./pages/categories/siakad/laporan_adab/beranda/HomeTeacher";

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
    <Route exact path="/dashboard" element={<Dashboard />}/>
    
    {/* Master */}
    <Route exact path="/users" element={<MasterDaftarPengguna/>}/>
    <Route exact path="/branches" element={<MasterCabang/>}/>
    <Route exact path="/employes" element={<MasterKaryawan/>}/>
    <Route exact path="/teachers" element={<MasterGuru/>}/>
    <Route exact path="/students" element={<MasterPendaftaran/>}/>
    <Route exact path="/schools" element={<MasterSekolah/>}/>
    <Route exact path="/educational-stages" element={<MasterJenjang/>}/>
    <Route exact path="/departments" element={<MasterDept/>}/>
    <Route exact path="/rooms" element={<MasterCheckpoint/>}/>
    <Route exact path="/floors" element={<MasterLantai/>}/>
    

    {/* Privilege */}
    <Route exact path="/privileges/setups" element={<AdminSetups/>} />
    <Route exact path="/privileges/apps" element={<AdminApps/>} />
    <Route exact path="/privileges/app-modules/:id_app/:slug_name" element={<AdminAppsModule/>} />
    <Route exact path="/privileges/module_menus/:id_module/:slug_name" element={<AdminModuleMenus/>} />
    <Route exact path="/privileges/menus" element={<AdminMenus />} />
    <Route exact path="/privileges/roles" element={<AdminRoles />} />
    <Route exact path="/privileges/roles/:id/:name" element={<AdminRolePermision/>}/>
    <Route exact path="/privileges/modules" element={<AdminModules />} />
    <Route exact path="/privileges/sub-modules/:id/:slug_name" element={<AdminSubModules />} />
    <Route exact path="/privileges/users" element={<AdminUsers/>} />
    <Route exact path="/permissions/:id/:firstname/:lastname" element={<AdminUserPermission/>}/>
    <Route exact path="/change-password" element={<AdminChangePassword/>}/>

    {/* Not Found */}
    {/* <Route exact path="/*" element={<My404Component/>}/> */}

    {/* Page On Dev */}
    <Route exact path="/*" element={<PageOnDev/>}/>

    {/* QR Patrol */}
    <Route exact path="/beranda-patrol" element={<BerandaPatrol/>}/>
    <Route exact path="/check-points" element={<CheckPoint/>}/>
    <Route exact path="/log-check-points" element={<InspectionNotes/>}/>

    {/* LMS */}
    <Route exact path="/data-murid" element={<DataMurid/>} />
    <Route exact path="/kelas" element={<DataKelas/>} />
    <Route exact path="/tahun-ajaran" element={<DataTahunAjaran/>} />
    <Route exact path="/tingkatan" element={<DataTingkatan/>} />

    {/* Laporan Adab */}
    <Route exact path="/elements" element={<MasterElements/>}/>
    <Route exact path="/sub-elements/:id_element/:slug_name" element={<MasterSubElements/>} />
    <Route exact path="/kkca" element={<MasterKKCA/>} />
    <Route exact path="/data-dimensi" element={<MasterDimensi/>}/>
    <Route exact path="/beranda-laporan-adab" element={<BerandaLA/>} />
    <Route exact path="/identitas-murid" element={<IdentitasMurid/>} />
    <Route exact path="/element-recaps-dimensi" element={<Dimensi/>} />
    <Route exact path="/element-recaps-dimensi-head-super" element={<DimensiHeadSuper/>} />
    <Route exact path="/element-recaps-dimensi-head" element={<DimensiHead/>} />
    <Route exact path="/element-recaps-dimensi-teacher" element={<DimensiTeacher/>} />
    <Route exact path="/element-recaps-leger" element={<Leger/>} />
    <Route exact path="/element-recaps-leger-head" element={<LegerHead/>} />
    <Route exact path="/element-recaps-leger-teacher" element={<LegerTeacher/>} />
    <Route exact path="/element-recaps-rapot" element={<Rapor/>} />
    <Route exact path="/element-recaps-rapot-head" element={<RaporHead/>} />
    <Route exact path="/element-recaps-rapot-teacher" element={<RaporTeacher/>} />
    <Route exact path="/dimensi-configs" element={<PengaturanDimensi/>} />
    <Route exact path="/config-dimensi-head" element={<PengaturanDimensiHead/>} />
    <Route exact path="/config-list-dimensi" element={<PengaturanDimensiConfig/>} />
    <Route exact path="/dashboards-la-teacher" element={<DashboardTeacher />} />
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
