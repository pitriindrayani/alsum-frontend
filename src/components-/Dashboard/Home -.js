import "bulma/css/bulma.css";
import "../../index.css"
import { useEffect, useState } from "react";
import ComingSoon from "../../assets/soon.png"
import { useMediaQuery } from 'react-responsive'

export default function Dashboard() {
  document.title = "Halaman Utama";
  const username = localStorage.getItem("name-admin");
  // const storageEmail = JSON.parse(localStorage.getItem('email_admin'));
  // const storageRole = localStorage.getItem('ysb_role_name');
  const [dataTeacher, setDataTeacher] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const today = new Date();

  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",  
    day: "2-digit",    
    month: "short",    
    year: "numeric",  
  });

  // useEffect(() => {
  //   if (localStorage.getItem("teacher_data") === "") {
  //     setDataTeacher("")
  //   }else{
  //     setDataTeacher(JSON.parse(localStorage.getItem("teacher_data")))
  //   }
  // }, [dataTeacher]);

  return (
    <div className="body" >
      <div className="body-header d-flex">
      
            {isTabletOrMobile ? 
              <>
                <div className="title-dashboard">
                  <h4>Selamat Datang, {username} ! 👋</h4>
                  {formattedDate}
                </div> 
                
                {/* <div className="ml-auto">
                  <button onClick={viewModalAdd} className="btn btn-create"> <FontAwesomeIcon icon={faUserPlus} />User</button>
                </div> */}
              </>
                : 
              <>
                <div className="title-dashboard">
                  <h4>Selamat Datang, {username} ! 👋</h4>
                  {formattedDate}
                </div>
          
                {/* <div className="ml-auto">
                  <button onClick={viewModalAdd} className="btn btn-create"> <FontAwesomeIcon icon={faUserPlus} /> Tambah Guru</button>
                </div> */}
              </>
            }
      </div> 
       <div className="body-content text-center" style={{padding: "30px 0"}}>..
        <img src={ComingSoon} className="img-fluid" style={{width:"60%"}} />
        <h5 style={{color: '#ff8902ff'}}>Halaman utama dalam pengembangan..</h5>
       </div>
      


 
       {/* <div className="body-content kosong">
          <div className="kosong">
            <h2>Hellow {username} ! 👋</h2>
            {formattedDate}
          </div>
       </div> */}

       
      
      
      

    </div>
  );
}
