import React from 'react';
import { useEffect, useState, useRef } from "react";
import {Col, Row} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import { APIMS } from "../../../../../config/apims";
import { APIUS } from "../../../../../config/apius";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Autosave, useAutosave } from 'react-autosave';
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import Select from 'react-select';

export default function Dimensi() {
  document.title = "Dimensi";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(1);
  const [descending, setDescending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});
  const [loading, setLoading] = useState(false);
  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
   
  // Data
  const [storageBranch, setStorageBranch] = useState("");
  const [storageSchool, setStorageSchool] = useState("");
  const [storageTeacher, setStorageTeacher] = useState("");
  const [getDataDimensi, setGetDataDimensi] = useState([]);
  const [getDataDimensiDefault, setGetDataDimensiDefault] = useState([]);
  const [getDataSemester, setGetDataSemester] = useState([]);
  const [getDataSemesterMap, setGetDataSemesterMap] = useState([]);
  const [getData, setGetData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const storageSchoolId = localStorage.getItem('ysb_school_id');

  const [namaTA, setNamaTA] = useState([]);
  const [namaSmstr, setNamaSmstr] = useState([]);

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

  useEffect(() => {
    setStorageBranch(localStorage.getItem('ysb_branch_id') || "");
    setStorageSchool(localStorage.getItem('ysb_school_id') || "");
    setStorageTeacher(localStorage.getItem('teacherID') || "");
  }, [])

  // const id_teacher = localStorage.getItem('teacherID');
  // console.log(id_teacher);

  const [form, setForm] = useState({
    ysb_semester_id: "",
    ysb_dimensi_id: "",
    ysb_branch_id: "",
    ysb_school_id:"",
    ysb_teacher_id: ""
  });

  const [form2, setForm2] = useState({
    ysb_semester_id: "",
    ysb_dimensi_id: "",
    ysb_branch_id: "",
    ysb_school_id:"",
    ysb_teacher_id: "",
    ysb_sub_element_value:"",
  });

   const [form3, setForm3] = useState({
    ysb_element_recap_id_id:"",
    ysb_sub_element_value:"",
  });

  // const handleForm3Change = (e) => {
  //   const { name, value } = e.target;
  //   setForm3(prev => ({ ...prev, [name]: value }));
  // };

  const handleForm3Change = (e) => {
  const { name, value } = e.target;
    
    // cuma bisa angka 1-4
    if (value === '' || (Number(value) >= 1 && Number(value) <= 4 && !isNaN(value))) {
      setForm3(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveForm3 = async () => {
    if (!form3?.ysb_element_recap_id_id) return;
    const recapId = form3.ysb_element_recap_id_id;
    const newValue = form3.ysb_sub_element_value;
    // check value inputan sebelumnya
    let previousValue;
    const applyLocalUpdate = (value) => {
      setGetData(prev => {
        try {
          const copy = JSON.parse(JSON.stringify(prev));
          if (!Array.isArray(copy) || copy.length === 0) return prev;
          const dataElements = copy[0]?.data_element || [];
          for (const el of dataElements) {
            if (!el?.rekapan) continue;
            for (const r of el.rekapan) {
              if (!r?.sub_elements) continue;
              for (const s of r.sub_elements) {
                if (s?.ysb_element_recap_id === recapId) {
                  previousValue = s.ysb_sub_element_value;
                  s.ysb_sub_element_value = value;
                }
              }
            }
          }
          return copy;
        } catch (err) {
          return prev;
        }
      });
    };
    applyLocalUpdate(newValue);

    try {
      const response = await APILA.put(`/api/element-recaps-dimensi-teacher/${recapId}`, {
        ysb_sub_element_value: newValue,
        user_id: output_id_user
      }, fetchParams);

      if (response?.status === 200) {
        if (typeof GetResponseData2 === 'function') {
          GetResponseData2();
        } else if (typeof GetResponseData === 'function') {
          GetResponseData();
        }
        ToastSuccess.fire({ icon: 'success', title: response.data.message });
        setUpdateID(null);
      }
    } catch (error) {
      applyLocalUpdate(previousValue);
      ToastError.fire({ icon: 'error', title: error?.response?.data?.message || error.message || 'Failed to save' });
    }
  };

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      const [ dataSemester, dataDimensi] = await axios.all([
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`,fetchParams),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams),
      ]);
      if (dataSemester.status === 200  && dataDimensi.status === 200 ){
        const semesters = dataSemester.data.data.find(s => s.status === 1);
        setGetDataSemester(semesters);
        setGetDataSemesterMap(dataSemester.data.data);
        setGetDataDimensi(dataDimensi.data.data);
        setGetDataDimensiDefault(dataDimensi.data.data[0]);
        setNamaTA(semesters.name_year);
        setNamaSmstr(semesters.semester);
        
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
  };
  
  useEffect(() => {
    fetchDataRef.current = fetchData;
    fetchDataRef.current();
  }, []);

  // Get data awal ketika render halaman pertama kali
  useEffect(() => {
    const first = getData?.[0]?.data_element?.[0]?.name_element;
    if (first) setSelectedTab(prev => prev || first);
  }, [getData]);

  const handleTabSelect = async (key) => {
    try {
      if (updateId) {
        await saveForm3();
      }
    } catch (err) {
      
    }
    setSelectedTab(key);
  };

  const GetResponseData = async () => {
    try {
      setLoading(true);

      const response = await APILA.get('/api/element-recaps-dimensi-teacher/full', {
        params: {
          ysb_semester_id: form?.ysb_semester_id,
          level: storageLevel,
          branch: storageBranch,
          ysb_dimensi_id: form?.ysb_dimensi_id,
          ysb_school_id: storageSchoolId,
          ysb_teacher_id: storageTeacher
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  const GetResponseData2 = async () => {
    try {
      // setLoading(true);
      const response = await APILA.get('/api/element-recaps-dimensi-teacher/full', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: storageSchoolId,
          ysb_teacher_id: storageTeacher
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
        // setLoading(false);
      }

    } catch (error) {
      // setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  const handleChange = (e) => {
    setForm2({
      ...form2,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange2 = (e) => {
    setForm2({
      ...form2,
      ysb_teacher_id: e.value,
    });
  };

  useEffect(() => {
    if (storageBranch !== "") {
      setForm2(prevForm => ({
        ...prevForm,
        ysb_branch_id: storageBranch
      }));      
    }
  }, [storageBranch]);

  useEffect(() => {
    if(getDataSemester !== null){
      setForm({
        ...form, 
        ysb_semester_id: getDataSemester?.id
      });
    }
  }, [getDataSemester]);

  useEffect(() => {
    if( getDataSemester !== null){
      setForm2({
        ...form2, 
        ysb_semester_id: getDataSemester?.id
      });
    }
  }, [getDataSemester]);

  useEffect(() => {
    if(getDataDimensiDefault !== null){
      setForm({
        ...form, 
        ysb_dimensi_id: getDataDimensiDefault?.id
      });
    }
  }, [getDataDimensiDefault]);

  useEffect(() => {
    if( getDataDimensiDefault !== null){
      setForm2({
        ...form2, 
        ysb_dimensi_id: getDataDimensiDefault?.id
      });
    }
  }, [getDataDimensiDefault]);

  useEffect(() => {
    if (form.ysb_semester_id && form.ysb_semester_id !== "" && 
      form.ysb_dimensi_id && form.ysb_dimensi_id !== "") {
      GetResponseData();
    }
  }, [form.ysb_semester_id, form.ysb_dimensi_id ]); 

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // UPDATE NILAI
  const [updateId, setUpdateID] = useState(-1);
  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  return (
    <div className="body" >

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faListUl}/> Dimensi</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Dimensi </h5>
            </div>
          </>
        }   
      </div> 
      
      <div className="body-content">
        {/* Breadcrumnbs */}
        <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page"> <Link to="/beranda-laporan-adab"> Beranda </Link> </li>
              <li className="breadcrumb-item"> Dimensi</li>
            </ol>
          </nav>
        </div>

        {/* FILTER */}
        {isTabletOrMobile ? 
          <>
          <div className="title-page">
            <Row style={{marginTop: "10px", padding:"0 12px"}}>
              <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                {getDataSemesterMap.map((user,index) => (
                              <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                            ))}  
                </select>
            </Row>
          
            <Row style={{marginTop: "10px", padding:"0 12px"}}>
              <select className="mr-2" aria-label="Default select example" name="ysb_dimensi_id" value={form2?.ysb_dimensi_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
              <option value="" hidden>Pilih Dimensi</option>
              {getDataDimensi.map((user,index) => (
                <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
              ))} 
              </select>
            </Row>
                                      
            <Row style={{marginTop: "12px", padding:"0 12px"}}>
              <button onClick={GetResponseData2} className=" btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
            </Row>
            </div>
          </>
          :
          <>

            <div className="mb-3">
              <div className="d-flex">
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))} 
                </select>

                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_dimensi_id}  name="ysb_dimensi_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Dimensi</option>
                  {getDataDimensi.map((user,index) => (
                    <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
                  ))}      
                </select>

                <button onClick={GetResponseData2} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>

              </div>
            </div>


            {/* <div style={{display: "flex", padding: "5px"}}>
              <div style={{fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"0px", color:"black"}}>
                <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px"}}>

                  <div>
                    <select aria-label="Default select example" onChange={handleChange} value={form2?.ysb_semester_id}  name="ysb_semester_id" style={{
                        border: "1px solid #3272B3",
                        borderRadius: "3px",
                        height: "38px",
                      }}>
                      <option value="" hidden>Semester ..</option>
                      {getDataSemesterMap.map((user,index) => (
                        <option value={user?.id} style={{textAlign:""}}>{user?.name_year} - {user?.semester}</option>
                      ))}         
                    </select>
                  </div>

                  <div>
                    <select aria-label="Default select example" onChange={handleChange} value={form2?.ysb_dimensi_id}  name="ysb_dimensi_id" style={{
                          border: "1px solid #3272B3",
                          borderRadius: "3px",
                          height: "38px",
                      }}>
                        <option value="" hidden>Dimensi ..</option>
                        {getDataDimensi.map((user,index) => (
                          <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
                        ))}            
                      </select>
                  </div>

                  <button
                    onClick={GetResponseData2}
                    style={{
                      border: "1px solid #3272B3",
                      backgroundColor: "#3272B3",
                      color: "white",
                      borderRadius: "3px",
                      height: "38px",
                    }}>
                    Submit
                  </button>
              
                </div>
              </div>
            </div> 

            <div style={{display: "flex", padding: "5px"}}>
              <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"0px", color:"black"}}>
                <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px"}}>

                 
              
                </div>
              </div>
            
            </div>  */}
          </>
        }

        {loading && <LoaderHome />}
        <Tabs id="uncontrolled-tab-example" activeKey={selectedTab} onSelect={handleTabSelect} className="mb-3 mt-4 nav-tabs"> 
          
        {(getData?.[0]?.data_element || [] ).map((element, eIdx) => (
          <Tab key={element?.id || eIdx} eventKey={element?.name_element} title={element?.name_element} className="nav-item">
            <div className="text-center" style={{ marginTop: "10px", marginBottom: "20px", backgroundColor: "#9fd5ffff", padding: "5px 0px" }}>
              <h5 className="mt-2 mb-2">{element?.description}</h5>
            </div>

            {/* TABLE */}
            <Col xl='12' sm='12'>
              <div className="mt-3">
                <div className="body-table">
                  <div className="test-table">
                    <table className="table table-laporan-adab  table-hover table-bordered " id="basic-datatable">
                      <thead>
                        <tr>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>Nama</th>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>Nisn</th>

                          {/* rekapan pertama ditampilkan */}
                          {element?.rekapan?.[0]?.sub_elements?.map((sub, idx) => (
                            <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} key={sub?.ysb_sub_element_id || idx}>{sub?.ysb_sub_element_name || sub?.description}</th>
                          ))}
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>Rata-Rata</th>
                        </tr>
                      </thead>

                      <tbody>
                        {element?.rekapan?.map((rekap) => (
                          <tr key={rekap?.ysb_element_recap_id}>
                            <td style={{ lineHeight: "2" }}>{rekap?.name_student}</td>
                            <td style={{ lineHeight: "2", textAlign: "center"  }}>{rekap?.nisn}</td>
                            {/* Mapping dinamis valuenya  */}
                            {rekap?.sub_elements?.map((sub, i) => {
                              const subRecapIdVal = sub?.ysb_element_recap_id;
                              const subValueLocal = sub?.ysb_sub_element_value;
                              const isEditingLocal = updateId === subRecapIdVal;

                              const handleClickCell = () => {
                                setUpdateID(subRecapIdVal);
                                setForm3({ ysb_element_recap_id_id: subRecapIdVal, ysb_sub_element_value: subValueLocal == null ? "" : subValueLocal });
                              };

                              return (
                                <td key={subRecapIdVal || i} style={{ lineHeight: "2" }} className="text-center">
                                  {isEditingLocal ? (
                                    <input
                                      name="ysb_sub_element_value"
                                      value={form3?.ysb_sub_element_value ?? ""}
                                      onChange={handleForm3Change}
                                      onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          await saveForm3();
                                        }
                                      }}
                                      onBlur={async () => {
                                        await saveForm3();
                                      }}
                                      type="text"
                                      className="text-center"
                                      style={{ border: "none" }}
                                    />
                                  ) : (
                                    <input type="text" onClick={handleClickCell} value={subValueLocal == null ? "" : subValueLocal} className="text-center" style={{ border: "none" }} readOnly />
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ lineHeight: "2" }} className="text-center fw-bold">{Math.round(rekap?.average * 10) / 10 }</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Tab>
        ))}

      </Tabs>
    </div>
  </div>
  );
}
