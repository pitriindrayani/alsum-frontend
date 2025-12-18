import "bulma/css/bulma.css";
import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import LoaderHome from "../../../../Loader/LoaderHome";
import Swal from "sweetalert2";
import swal from "sweetalert";

export default function BerandaLaporanAdab() {
    document.title = "Beranda Laporan Adab";
    
    const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("name-admin");
    const branch_name = localStorage.getItem("ysb_branch_name");
    const id_teacher = localStorage.getItem('teacherID');

    const [loading, setLoading] = useState(false);

    const today = new Date();

    const formattedDate = today.toLocaleDateString("id-ID", {
        weekday: "long",  
        day: "2-digit",    
        month: "short",    
        year: "numeric",  
    });

    // Data 
    const [nameSchool, setNameSchool] = useState([]);
    const [npsnSchool, setNpsnSchool] = useState([]);
    const [addressSchool, setAddressSchool] = useState([]);
    const [kecSchool, setKecSchool] = useState([]);
    const [kotaSchool, setKotaSchool] = useState([]);
    const [provSchool, setProvSchool] = useState([]);
    const [kepSchool, setKepSchool] = useState([]);
    const [kelas, setKelas] = useState([]);
    const [nameKelas, setNameKelas] = useState([]);

    let fetchParams = {
        headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

    //Get Data
    const GetIdentitasSekolah = async () => {
        try {
            setLoading(true)
            const response = await APILA.get(`/api/access/semester-assignments/teacher?ysb_teacher_id=${id_teacher}`, fetchParams);
            
            // Checking process
            if (response?.status === 200) {
                setNameSchool(response.data.data.name_school);
                setNpsnSchool(response.data.data.sekolah.npsn);
                setAddressSchool(response.data.data.sekolah.address);
                setKecSchool(response.data.data.sekolah.subdistrict);
                setKotaSchool(response.data.data.sekolah.district);
                setProvSchool(response.data.data.sekolah.province);
                setKelas(response.data.data.number_kelas);
                setNameKelas(response.data.data.name_kelas);
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            // swal({
            //     title: 'Failed',
            //     text: `${error.response.data.message}`,
            //     icon: 'error',
            //     timer: 3000,
            //     buttons: false
            // });
        }

    }
   
    useEffect(() => {
      GetIdentitasSekolah();
    }, [])

    return (

        <div className="body" >

            <div className="body-header d-flex">
                {isTabletOrMobile ? 
                <>
                    <div className="title-dashboard">
                        <h4>Beranda Laporan Adab, ({branch_name})</h4>
                        {username} | {formattedDate}
                    </div> 
                </>
                    : 
                <>
                    <div className="title-dashboard">
                        <h4>Beranda Laporan Adab ({branch_name})</h4>
                        {username} | {formattedDate}
                    </div>

                </>
                }
            </div> 
        
            <div className="body-dashboard ">
                {loading && <LoaderHome />}

                <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" aria-current="page"> Beranda</li>
                        </ol>
                    </nav>
                </div>

                <h5 className="mb-3" style={{color: "#4368c5"}}>Identitas Sekolah</h5>
                <hr />
                
                <div style={{fontSize: "14px"}}>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            Nama Sekolah 
                        </div>
                        <div className="col-10">
                            : {nameSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            NPSN
                        </div>
                        <div className="col-10">
                            : {npsnSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            Alamat Sekolah
                        </div>
                        <div className="col-10">
                            : {addressSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                           Kecamatan
                        </div>
                        <div className="col-10">
                            : {kecSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            Kabupaten/Kota
                        </div>
                        <div className="col-10">
                            : {kotaSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            Provinsi
                        </div>
                        <div className="col-10">
                            : {provSchool}
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                            Nama Kepala Sekolah 
                        </div>
                        <div className="col-10">
                            : 
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className="col-2 fw-bolder">
                           Kelas
                        </div>
                        <div className="col-10">
                            : {kelas} - {nameKelas}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
