
import {  useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faGear } from '@fortawesome/free-solid-svg-icons';
import {  Link } from "react-router-dom";

export default function HeadPage() {
const [query, setQuery] = useState("");
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});


  return (
    <div >

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faListUl}/> Penilaian</h6>
            </div> 
            
            <div className="ml-auto">
                <button  className="btn btn-create"> <Link  to="/dimensi-configs" style={{color: "#fff", textDecoration: "none"}}><FontAwesomeIcon icon={faGear} /> Konfigurasi Nilai</Link> </button>
            </div>
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Penilaian </h5>
            </div>
            
            <div className="ml-auto">
                <button  className="btn btn-create"> <Link style={{color: "#fff", textDecoration: "none"}}  to="/dimensi-configs"><FontAwesomeIcon icon={faGear} /> Konfigurasi Nilai</Link> </button>
            </div>
          </>
        }   
      </div> 

  </div>
  );
}
