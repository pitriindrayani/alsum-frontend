import React from 'react';
import { useEffect, useState, useRef } from "react";
import {Col, Row} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import { APIMS } from "../../../../../config/apims";
import { APIUS } from "../../../../../config/apius";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import ModalApprove from "./modal/approve";
import ModalTutup from "./modal/tutup.";

export default function PengaturanDimensi() {
  document.title = "Pengaturan Dimensi";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(1);
  const [descending, setDescending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

  // modal add
  const [modalApprove, setModalApprove] = useState(false)
  const [modalTutup, setModalTutup] = useState(false)

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});
  const [loading, setLoading] = useState(false);
  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");
   
  // Data
  const [getData, setGetData] = useState([]);

  // Filter permission menu
  const location = useLocation();
  const [permission, setPermission] = useState({
    create: 0,
    read: 0,
    update: 0,
    delete: 0
  });

  const navigate = useNavigate();
  useEffect(() => {
    const storageLevel = localStorage.getItem('level');
    const storageItems = JSON.parse(localStorage.getItem('role_permission')) || [];
    if (storageLevel === "developer" || storageLevel === "superadmin") {
      setPermission({
        create: 1,
        read: 1,
        update: 1,
        delete: 1
      });
    } else {
      const foundPermission = storageItems.find(item => item.menu?.url === location.pathname);
      if (!foundPermission) { 
        navigate('/dashboard');
      } else {
        setPermission({
          create: foundPermission.create,
          read: foundPermission.read,
          update: foundPermission.update,
          delete: foundPermission.delete
        });
      }}
  }, [location.pathname]);

  const [form, setForm] = useState({
    status: "",
    user_id: "",
  });

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  

  const GetResponseData = async () => {
        try {
           const response = await APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&`,fetchParams)
            if (response?.status === 200) {
            setGetData(response.data.data)
            }
        } catch (error) {
            swal({
            title: 'Failed',
            text: `${error.response.data.message}`,
            icon: 'error',
            timer: 3000,
            buttons: false
            });
        }
  }

   useEffect(() => {
      GetResponseData();
    }, []);

  //    const saveForm = async () => {
    
  //       try {
  //         const response = await axios.put(`http://127.0.0.1:2004/api/config-list-dimensi/${id}`, {
  //           status: form?.status,
  //           user_id: output_id_user
  //         }, fetchParams);
    
  //         if (response?.status === 200) {
  //           if (typeof GetResponseData === 'function') {
  //             GetResponseData();
  //           }
  //           ToastSuccess.fire({ icon: 'success', title: response.data.message });
  //         }
  //       } catch (error) {
  //         applyLocalUpdate(previousValue);
  //         ToastError.fire({ icon: 'error', title: error?.response?.data?.message || error.message || 'Failed to save' });
  //       }
  //     };

  //     const handleFormChange = (e) => {
  //       const { name, value } = e.target;
  //       setForm(prev => ({ ...prev, [name]: value }));
  //     };

 
  // const [value, setValue] = useState(0);
  // const handleCheckbox = (e) => {
  //   const checked = e.target.checked;
  //   setValue(checked ? 1 : 0);
  //   console.log("status", checked)
  // };



    const [values, setValues] = useState({});

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setModalApprove(true)
       setIsOpen(isOpen);
    };


    const saveForm = async (id, status) => {
      // try {
      //   const response = await axios.put(
      //     `http://127.0.0.1:2004/api/config-list-dimensi/${id}`,
      //     {
      //       status: status,
      //       user_id: output_id_user
      //     },
      //     fetchParams
      //   );

      try {
        const response = await APILA.put(`/api/config-list-dimensi/${id}`, {
          status: status,
          user_id: output_id_user
        }, fetchParams);

    //  api/dimensis/config

        if (response?.status === 200) {
          GetResponseData(); 
          ToastSuccess.fire({ icon: 'success', title: response.data.message });
        }

      } catch (error) {
        ToastError.fire({ 
          icon: 'error', 
          title: error?.response?.data?.message || error.message 
           
        });

        
      }

     
    };


    // const handleToggle = (row) => {
    //   const newStatus = row.status === 1 ? 0 : 1;

    //   setForm({
    //     status: newStatus,
    //     user_id: output_id_user
    //   });

    //   saveForm(row.id, newStatus); 
    // };

    const handleToggle = (row) => {
  const newStatus = row.status === 1 ? 0 : 1;

  // 1. LANGSUNG UPDATE STATE LIST FRONTEND
  setGetData(prev =>
    prev.map(item =>
      item.id === row.id ? { ...item, status: newStatus } : item
    )
  );

  // 2. UPDATE FORM
  setForm({
    status: newStatus,
    user_id: output_id_user
  });

  // 3. KIRIM KE API
  saveForm(row.id, newStatus);
};

  return (
    <div className="body" >
      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faGear}/> Konfigurasi Nilai</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faGear}/> Konfigurasi Nilai </h5>
            </div>
          </>
        }   
      </div> 

        <div className="body-content-menu">
          <div className="breadcrumb-header " style={{fontSize:"13px" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"> <Link style={{textDecoration:"none"}} to="">Beranda</Link>  </li>
                <li className="breadcrumb-item" > <Link style={{textDecoration:"none"}} to="/element-recaps-dimensi"> <span className='ml-2'> Penilaian </span> </Link> </li>
                <li className="breadcrumb-item iniaktif" > <span className='ml-2'> Konfigurasi Nilai </span> </li>
              </ol>
              </nav>
          </div>
        </div>

     
      
        <div className="body-content">

            <div className='d-flex mb-4'>
                <div>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0"}}> <Link style={{textDecoration: "none", color: "#327dffff"}} to="/config-dimensi"> Konfigurasi Nilai Guru</Link> </button>
                </div>
                <div className='ml-2'>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 18px', marginTop: '-2px', borderRadius:"0", borderLeft:"1px solid #dcdcdcff"}}> <Link style={{textDecoration: "none", color: "#327dffff"}} to="/config-dimensi-head"> Konfigurasi Nilai Kepala Sekolah</Link>  </button>
                </div>
                <div className='ml-2'>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#076db5ff", color: "#fff"}}> Konfigurasi Dimensi </button>
                </div>
            </div>
            <hr style={{borderBottom: "1px solid #327dffff", marginTop: "-22px"}}/>

            {loading && <LoaderHome />}
        
            <div className="mt-3">
                <div className="body-table">
                  <div className="test-table test-check">
                    <table className="table   table-bordered " id="basic-datatable">
                      <thead>
                        <tr>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>No</th>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>Nama Dimensi</th>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>ON / OFF</th>
                        
                        </tr>
                      </thead>

                      {/* <tbody>

                        {getData.map((row,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2",textAlign: "center" }}>{(page - 1) * 10 + (index + 1)} </td>  
                            <td style={{ lineHeight: "2" }}> {row.name_dimensi} </td>
                            <td style={{ lineHeight: "2", fontSize: "22px", paddingLeft: "75px" }} className="text-center" > 
                              <div className="d-flex justify-content-center align-items-center">
                                <div className="form-check form-switch m-0 p-0">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    onChange={handleFormChange}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody> */}

                      <tbody>
                          {getData.map((row, index) => (
                            <tr key={row.id}>
                              <td style={{ textAlign: "center" }}>
                                {(page - 1) * 10 + (index + 1)}
                              </td>

                              <td>{row.name_dimensi}</td>

                              <td className="text-center" style={{ fontSize: "22px" }}>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div className="form-check form-switch m-0 p-0">

                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={row.status === 1}
                                      onChange={() => handleToggle(row)}
                                    />

                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                    </table>
                  </div>
                </div>
              </div>
       
    </div>
  </div>
  );
}
