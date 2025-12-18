import "bulma/css/bulma.css";
import "../../index.css"

export default function Login() {
  document.title = "Dashboard";
  const username = localStorage.getItem("name-admin");

  // Responsive to mobile or dekstop
  // const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh", padding:"15px 0px"}}>
          <div className="container">
            <div className="hero-container">
              <div className="top-content">
                <h4>Assalamu'alaikum {username} 👋 </h4>          
                <p>Thu, 19-Dec-2024</p>
                <div className="logo-kanan">
                  <img src="http://172.16.0.4/summarecon/images/pathBanner.png" alt=""/>
                </div>
              </div>
              <div className="bottom-content">
            <div className="left-content">
              <div className="judul">
                <h3>Assignment</h3>
              </div>
              <div className="section"> 
              <div className="notification-nothing">
                <div className="nothing-row">
                <img src="http://172.16.0.4/summarecon/images/nothing-here.png" alt="Image" className="nothing-image"/>
                </div>
                <div className="nothing-row"><p>No Notification Yet</p></div>
              </div>            
              </div>
            </div>
            <div className="right-content">
              <div className="card">
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
                    <a href="/dashboard">Absensi</a>
                  </li>
                  <li>
                    <a href="/dashboard">Persediaan Cuti</a>
                  </li>
                  <li>
                    <a href="/dashboard">Form Cuti</a>
                  </li>
                  <li>
                    <a href="/dashboard">Status Cuti</a>
                  </li>
                  <li>
                    <a href="/dashboard">Form Pengajuan Lembur</a>
                  </li>
                <li>
                    <a href="/dashboard">Perapihan Role</a>
                </li>
          
                </ul>
                </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  );
}
