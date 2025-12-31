import "./App.css";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

// Layout
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public Pages
import Beranda from "./pages-public/Beranda/Home";

// Auth
import Auth from "./pages/Auth/Auth";

// Admin Pages
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminHome from "./pages/Dashboard/Home";
import AdminMenus from "./pages/ListMenu/Home";
import AdminRoles from "./pages/ListRole/Home";
import AdminRolePermision from "./pages/ListRolePermission/Home";
import AdminModules from "./pages/ListModule/Home";
import AdminSubModules from "./pages/ListSubModule/Home";
import AdminUsers from "./pages/ListUser/Home";
import AdminUserPermission from "./pages/ListUserPermission/Home";
import AdminMasterSekolah from "./pages/ListMasterSekolah/Home";
import AdminMasterJenjang from "./pages/DataSekolah/Home";
import AdminMasterCabang from "./pages/ListMasterCabang/Home";
import AdminChangePassword from "./pages/ListChangePassword/Home";

// Not Found
import My404Component from "./pages/NotFoundPage/PageNotFound";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* ===== PUBLIC ROUTE ===== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Beranda />} />
      </Route>

      {/* ===== AUTH (NO LAYOUT) ===== */}
      <Route path="/1337" element={<Auth />} />

      {/* ===== ADMIN ROUTE ===== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<AdminHome />} />
          <Route path="/privileges/menus" element={<AdminMenus />} />
          <Route path="/privileges/roles" element={<AdminRoles />} />
          <Route path="/privileges/roles/:id/:name" element={<AdminRolePermision />} />
          <Route path="/privileges/modules" element={<AdminModules />} />
          <Route path="/privileges/sub-modules/:id/:slug_name" element={<AdminSubModules />} />
          <Route path="/privileges/users" element={<AdminUsers />} />
          <Route path="/permissions/:id/:firstname/:lastname" element={<AdminUserPermission />} />
          <Route path="/change-password" element={<AdminChangePassword />} />
          <Route path="/educational-stages" element={<AdminMasterSekolah />} />
          <Route path="/schools" element={<AdminMasterJenjang />} />
          <Route path="/branches" element={<AdminMasterCabang />} />
          {/* <Route path="/*" element={<My404Component />} /> */}
        </Route>
      </Route>

      {/* ===== GLOBAL NOT FOUND ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
      
    </Routes>
  );
}

export default App;
