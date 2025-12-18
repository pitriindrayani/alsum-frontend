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
       
        {/* <div className="top-content">
          <h4>Assalamu'alaikum {username} 👋</h4>
          {isTabletOrMobile? "":
          <>
            <p>{formattedDate}</p>
            <div className="logo-kanan">
              <img src={LogoKanan} alt="Logo" />
            </div>
          </>
          }
        </div> */}
        
        
      </div>
    </div>
  </div>
  );
}
