import "bulma/css/bulma.css";
import { useEffect, useState } from "react";
import { Link} from "react-router-dom";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuildingUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { APITS } from "../../../../../config/apits";

export default function BerandaPatrol() {
    document.title = "Beranda Patrol";
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("name-admin");
    const branch_name = localStorage.getItem("ysb_branch_name");
    const storageBranch = localStorage.getItem('ysb_branch_id');
    const storageLevel = localStorage.getItem('level');

    const today = new Date();

    const formattedDate = today.toLocaleDateString("id-ID", {
        weekday: "long",  
        day: "2-digit",    
        month: "short",    
        year: "numeric",  
    });

    // Page
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(100);
    const [ascending, setAscending] = useState(0);
    const [keyword, setKeyword] = useState("");

    // Data 
    const [sumPemeriksaan, setGetSumPemeriksaan] = useState([]);
    const [sumPetugas, setGetSumPetugas] = useState([]);
 

    let fetchParams = {
        headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

    //Get Data
    const GetSumPemeriksaan = async () => {
        const response = await APITS.get(`/api/access/checklist?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams);
        setGetSumPemeriksaan(response.data.sum);
    }

    const GetSumPetugas = async () => {
        const response = await APITS.get(`/api/access/checklist-officer?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams);
        setGetSumPetugas(response.data.sum);
    }
   
    useEffect(() => {
      GetSumPemeriksaan();
      GetSumPetugas();
    }, [])

    return (
        <div className="body" >
            <div className="body-header d-flex">
                {isTabletOrMobile ? 
                <>
                    <div className="title-dashboard">
                    <h4>Beranda Patrol, ({branch_name})</h4>
                    {username} | {formattedDate}
                    </div> 
                </>
                    : 
                <>
                    <div className="title-dashboard">
                    <h4>Beranda QR Patrol ({branch_name})</h4>
                    {username} | {formattedDate}
                    </div>
                </>
                }
            </div> 
        
            <div className="body-dashboard ">

                <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"> Beranda</li>
                            <li className="breadcrumb-item"> <Link to="/log-check-points"> Catatan Pemeriksaan </Link></li>
                        </ol>
                    </nav>
                </div>

                <div className="row mt-3 ">
                    <div className= "col-md-4 mb-3" >
                        <div className="card shadow ">
                            <div className="card-dash">
                                <div className="row ">
                                    <div className="col card-title-dash" > 
                                        <h5 className="font-weight-bold text-uppercase">Checklist Pemeriksaan</h5>
                                        <h6>Per Hari Ini</h6>
                                        <h2>{sumPemeriksaan}</h2>
                                    </div> 
                                    <div className="col-auto icon-dash">
                                        <FontAwesomeIcon icon={faBuildingUser} style={{fontSize: "30px", paddingTop: "20px", color:"#4368c5" }} /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className= "col-md-4 " >
                        <div className="card shadow mb-3">
                            <div className="card-dash">
                                <div className="row ">
                                    <div className="col card-title-dash" >
                                        <h5 className="font-weight-bold text-uppercase"> Checklist Petugas</h5>
                                        <h6>Per Hari Ini</h6>
                                        <h2>{sumPetugas}</h2>
                                    </div> 
                                    <div className="col-auto icon-dash">
                                        <FontAwesomeIcon icon={faUsers} style={{fontSize: "30px", paddingTop: "20px", color:"#4368c5" }} /> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
