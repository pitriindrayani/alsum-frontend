import "bulma/css/bulma.css";
import "../../index.css"
import { FaBook, FaEnvelope, FaIdBadge, FaInfo, FaInfoCircle, FaMailBulk, FaPhone, FaSchool, FaSitemap, FaUser, FaUserTie } from "react-icons/fa";
import { useEffect, useState } from "react";
import LogoKanan from "../../assets/ysb/pathBanner.png"
import Logobawah from "../../assets/ysb/nothing-here.png"
import { useMediaQuery } from 'react-responsive'

export default function Login() {
  document.title = "Dashboard";
  const username = localStorage.getItem("name-admin");
  const storageEmail = JSON.parse(localStorage.getItem('email_admin'));
  const storageRole = localStorage.getItem('ysb_role_name');
  const [dataTeacher, setDataTeacher] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const today = new Date();

  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",  
    day: "2-digit",    
    month: "short",    
    year: "numeric",  
  });

  useEffect(() => {
    if (localStorage.getItem("teacher_data") === "") {
      setDataTeacher("")
    }else{
      setDataTeacher(JSON.parse(localStorage.getItem("teacher_data")))
    }
  }, [dataTeacher]);

  // Responsive to mobile or dekstop
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  return (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding: "15px 0px" }}>
    <div className="container">
      <div className="hero-container">
       
        <div className="top-content">
          <h4>Assalamu'alaikum {username} 👋</h4>
          {isTabletOrMobile? "":
          <>
            <p>{formattedDate}</p>
            <div className="logo-kanan">
              <img src={LogoKanan} alt="Logo" />
            </div>
          </>
          }
        </div>
        
        {dataTeacher === ""? 
         <div className="bottom-content">
          <div className="left-content">
            <div className="judul">
              <h3>Assignment</h3>
            </div>
            <div className="section"> 
            <div className="notification-nothing">
              <div className="nothing-row">
                <img src={Logobawah} alt="Image" className="nothing-image"/>
              </div>
              <div className="nothing-row"><p>No Notification Yet</p></div>
            </div>            
            </div>
          </div>
          <div className="right-content">
            <div className="card-hr">
              <p></p>
              <h2>0<br/></h2>
              <p>Assignment belum Dikerjakan</p>
            </div>
            
            <div className="recent-activity">
              <div className="judul2">
                <h3>Quick Links <img src="http://172.16.0.4/summarecon/images/icon/info.svg" alt=""/></h3>
              </div>
              <div className="recent-link"> 
              <ul>
                <li>
                  <a href="/attendance-trxs">Absen Log</a>
                </li>
                <li>
                  <a href="/teachers">List Guru</a>
                </li>
                <li>
                  <a href="/attendance-dailys">Koreksi Absen</a>
                </li>
              
              </ul>
              </div> 
                </div>
              </div>
            </div>
          : 
          <div className="bottom-content" style={{fontFamily:"Poppins"}}>
            <div className="left-content">
              <div className="judul">
                <h3>Data Pribadi</h3>
              </div>
              <div className="mt-2">
                <div className="card-pribadi" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px" }}>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaUser /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>Nama</span>: {username}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaIdBadge /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>NIP YPI</span>: {dataTeacher?.nip_ypi_karyawan === null? dataTeacher?.nip_ypi : dataTeacher?.nip_ypi_karyawan}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaIdBadge /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>NIK YSB</span>: {dataTeacher?.nik_ysb}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaSitemap /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>Cabang</span>:&nbsp;  
                    {dataTeacher?.ysb_branch_id === "MKS" ? "Makassar":""}
                    {dataTeacher?.ysb_branch_id === "SRP" ? "Serpong":""}
                    {dataTeacher?.ysb_branch_id === "BKS" ? "Bekasi":""}
                    {dataTeacher?.ysb_branch_id === "BDG" ? "Bandung":""}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaBook /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>Jenjang</span>: {dataTeacher?.edu_stage}
                  </p>
                  <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <FaSchool /> <span style={{ minWidth: "100px", display: "inline-block", textAlign: "left" }}>Sekolah</span>: {dataTeacher?.ysb_school_id}
                  </p>
                  
                </div>
              </div>
            </div>
            <div className="right-content">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div  style={{ display: "flex", flexDirection: "column", }}>
                
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaUserTie style={{ marginRight: "10px", fontSize:"20px", color:"#3272B3" }} />
                    <div>
                      <div>
                        Role
                      </div>
                      <div style={{fontSize:"15px", fontFamily:"sans-serif"}}>
                        {storageRole}
                      </div>
                    </div> 
                  </div>

                  <div className="mt-1" style={{ display: "flex", alignItems: "center" }}>
                    <FaMailBulk style={{ marginRight: "10px", fontSize:"20px", color:"#3272B3" }} />
                    <div>
                      <div>
                        Email
                      </div>
                      <div style={{fontSize:"15px", fontFamily:"sans-serif"}}>
                        {storageEmail}
                      </div>
                    </div> 
                  </div>

                  <div className="mt-1" style={{ display: "flex", alignItems: "center" }}>
                    <FaPhone style={{ marginRight: "10px" , transform: "scaleX(-1)", fontSize:"20px", color:"#3272B3" }} />
                    <div>
                      <div>
                      No. Telepon
                      </div>
                      <div style={{fontSize:"15px", fontFamily:"sans-serif"}}>
                      {dataTeacher?.mobile === null ? "-" : dataTeacher?.mobile}
                      </div>
                    </div> 
                  </div>
                  
                </div>
                  
                </div>
              <div className="recent-activity">
                <div className="judul2">
                  <h3>Quick Links &nbsp; <FaInfoCircle/></h3>
                </div>
                <div className="recent-link">
                  <ul>
                    <li><a href="/attendance-summarys">Absensi</a></li>
                    <li><a href="/attendance-dailys">Koreksi Absen</a></li>
                    {/* <li><a href="/dashboard">Form Cuti</a></li>
                    <li><a href="/dashboard">Status Cuti</a></li>
                    <li><a href="/dashboard">Form Pengajuan Lembur</a></li>
                    <li><a href="/dashboard">Perapihan Role</a></li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          }
      </div>
    </div>
  </div>
  );
}
