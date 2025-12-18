import React from 'react';
import { useEffect, useState, useRef, useCallback } from "react";
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
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import Select from 'react-select';
import HeadPage from './component/HeadPage';

export default function Dimensi() {
  document.title = "Penilaian Guru";
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
  const [getDataGuru, setGetDataGuru] = useState([]);
  const [getDataDimensi, setGetDataDimensi] = useState([]);
  const [getDataDimensiDefault, setGetDataDimensiDefault] = useState([]);
  const [getDataSemester, setGetDataSemester] = useState([]);
  const [getDataSemesterMap, setGetDataSemesterMap] = useState([]);
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [getData, setGetData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);

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
  }, [location.pathname, navigate]);

  useEffect(() => {
    setStorageBranch(localStorage.getItem('ysb_branch_id') || "");
    setStorageSchool(localStorage.getItem('ysb_school_id') || "");
    setStorageTeacher(localStorage.getItem('teacherID') || "");
  }, [])


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
      const response = await APILA.put(`/api/element-recaps-dimensi/${recapId}`, {
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

  // ---------- helper refs ----------
  const isMounted = useRef(true);
  const abortControllers = useRef([]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      // batalkan semua pending requests
      abortControllers.current.forEach(ctrl => {
        try { ctrl.abort(); } catch (e) {}
      });
    };
  }, []);

  // ---------- INIT fetch once ----------
  // Ambil branch, semester, dimensi  sekali saat mount
  const fetchInit = useCallback(async () => {
    setLoading(true);
    const controller = new AbortController();
    abortControllers.current.push(controller);
    try {
      // gunakan endpoint tanpa query string besar; server-side paging tetap bisa
      const [branchRes, semesterRes, dimensiRes] = await Promise.all([
        APIMS.get(`/api/access/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, { ...fetchParams.current, signal: controller.signal }),
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`, { ...fetchParams.current, signal: controller.signal }),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, { ...fetchParams.current, signal: controller.signal })
      ]);

      if (!isMounted.current) return;

      if (branchRes?.status === 200) setGetDataBranch(branchRes.data.data || []);
      if (semesterRes?.status === 200) {
        const active = (semesterRes.data.data || []).find(s => s.status === 1);
        setGetDataSemester(active || null);
        setGetDataSemesterMap(semesterRes.data.data || []);
        if (active) {
          setNamaTA(active.name_year || "");
          setNamaSmstr(active.semester || "");
        }
      }
      if (dimensiRes?.status === 200) {
        const activeDims = (dimensiRes.data.data || []).filter(d => d.status === 1);
        setGetDataDimensi(activeDims);
        setGetDataDimensiDefault(activeDims[0] || null);
      }

      // Set initial form values based on results (single update)
      setForm(prev => ({
        ...prev,
        ysb_semester_id: (semesterRes?.data?.data || []).find(s => s.status === 1)?.id || prev.ysb_semester_id,
        ysb_dimensi_id: ((dimensiRes?.data?.data || []).find(d => d.status === 1) || {}).id || prev.ysb_dimensi_id,
        ysb_branch_id: storageBranch || prev.ysb_branch_id
      }));

      setForm2(prev => ({
        ...prev,
        ysb_semester_id: (semesterRes?.data?.data || []).find(s => s.status === 1)?.id || prev.ysb_semester_id,
        ysb_dimensi_id: ((dimensiRes?.data?.data || []).find(d => d.status === 1) || {}).id || prev.ysb_dimensi_id,
        ysb_branch_id: storageBranch || prev.ysb_branch_id
      }));
    } catch (err) {
      if (!isMounted.current) return;
      console.error(err);
      swal({ title: 'Failed', text: err?.response?.data?.message || err.message || 'Error', icon: 'error', timer: 3000, buttons: false });
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [page, limit, ascending, descending, keyword, storageBranchGroping, storageLevel, storageBranch]);

  useEffect(() => {
    fetchInit();
  }, [fetchInit]);

  // Get data awal ketika render halaman pertama kali
  useEffect(() => {
    const first = getData?.[0]?.data_element?.[0]?.name_element;
    if (first) setSelectedTab(prev => prev || first);
  }, [getData]);

  // const handleTabSelect = async (key) => {
  //   try {
  //     if (updateId) {
  //       await saveForm3();
  //     }
  //   } catch (err) {
      
  //   }
  //   setSelectedTab(key);
  // };

  const GetResponseData = async () => {
    try {
      // setLoading(true);

      const response = await APILA.get('/api/element-recaps-dimensi/full', {
        params: {
          ysb_semester_id: form?.ysb_semester_id,
          level: storageLevel,
          branch: storageBranch,
          ysb_dimensi_id: form?.ysb_dimensi_id,
          ysb_school_id: form?.ysb_school_id,
          ysb_teacher_id: form?.ysb_teacher_id
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


  // ---------- smaller helper fetches (only when user requests) ----------
  const GetResponseDataSchool = useCallback(async (branchId) => {
    const controller = new AbortController();
    abortControllers.current.push(controller);
    try {
      const response = await APIMS.get(`/api/access/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${branchId || form2?.ysb_branch_id}&level=${storageLevel}`, { ...fetchParams.current, signal: controller.signal });
      if (response?.status === 200) setGetDataSchool(response.data.data || []);
    } catch (err) {
      console.error(err);
      swal({ title: 'Failed', text: err?.response?.data?.message || err.message || 'Error', icon: 'error', timer: 3000, buttons: false });
    }
  }, [page, limit, ascending, keyword, form2?.ysb_branch_id, storageLevel]);

  const GetResponseDataTeacher = useCallback(async (schoolId) => {
    const controller = new AbortController();
    abortControllers.current.push(controller);
    try {
      const response = await APIUS.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${schoolId || form2?.ysb_school_id}`,fetchParams);
      if (response?.status === 200) setGetDataTeacher(response.data.data || []);
    } catch (err) {
      console.error(err);
      swal({ title: 'Failed', text: err?.response?.data?.message || err.message || 'Error', icon: 'error', timer: 3000, buttons: false });
    }
  }, [page, limit, ascending, keyword, form2?.ysb_school_id]);


  // ---------- handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm2(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange2 = (option) => {
    setForm2(prev => ({ ...prev, ysb_teacher_id: option?.value || "" }));
  };

  const GetResponseData2 = async () => {
    try {
      //  setLoading(true);
      const response = await APILA.get('/api/element-recaps-dimensi/full', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: form2?.ysb_school_id,
          ysb_teacher_id: form2?.ysb_teacher_id
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
        //  setLoading(false);
      }

    } catch (error) {
      //  setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  // useEffect(() => {
  //   if (form2?.ysb_school_id) {
  //     GetResponseDataGuru()     
  //   }
  // }, [form2?.ysb_school_id]);

  // user klik Cari -> fetch school/teacher jika perlu, lalu fetch recap
  const handleSearchClick = async () => {
    // kalau ada branch terpilih, fetch schools
    if (form2?.ysb_branch_id) {
      await GetResponseDataSchool(form2.ysb_branch_id);
    }
    // kalau ada school terpilih, fetch teacher list (opsional)
    if (form2?.ysb_school_id) {
      await GetResponseDataTeacher(form2.ysb_school_id);
    }
    // akhirnya fetch recap
    await handleSearchClick();
  };

  useEffect(() => {
    if(getDataSemester !== null){
      setForm({
        ...form, 
        ysb_semester_id: getDataSemester?.id
      });
    }
  }, [getDataSemester]);

  ;

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

  // jika user memilih school via select change dan mau ambil teacher otomatis:
  useEffect(() => {
    if (form2?.ysb_branch_id) {
      // hanya fetch teacher list (ringan)
      GetResponseDataSchool(form2.ysb_branch_id);
    }
  }, [form2?.ysb_branch_id, GetResponseDataSchool]);

  // jika user memilih school via select change dan mau ambil teacher otomatis:
  useEffect(() => {
    if (form2?.ysb_school_id) {
      // hanya fetch teacher list (ringan)
      GetResponseDataTeacher(form2.ysb_school_id);
    }
  }, [form2?.ysb_school_id, GetResponseDataTeacher]);

  // set beberapa nilai awal ketika getData berubah (untuk set selectedTab)
  useEffect(() => {
    const first = getData?.[0]?.data_element?.[0]?.name_element;
    if (first) setSelectedTab(prev => prev || first);
  }, [getData]);

  const handleTabSelect = async (key) => {
    try {
      if (updateId && updateId !== -1) {
        await saveForm3();
      }
    } catch (err) {
      console.error(err);
    }
    setSelectedTab(key);
  };

  useEffect(() => {
    const t = setTimeout(() => setKeyword(query), 300);
    return () => clearTimeout(t);
  }, [query]);


  return (
    <div className="body" >

      {/* <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faListUl}/> Penilaian Guru</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Penilaian </h5>
            </div>
          </>
        }   
      </div>  */}
      <HeadPage />

      <div className="body-content-menu">
        <div className="breadcrumb-header " style={{fontSize:"13px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"> <Link style={{textDecoration:"none"}} to="">Beranda</Link>  </li>
              <li className="breadcrumb-item iniaktif" > <span className='ml-2'> Penilaian </span> </li>
            </ol>
          </nav>
        </div>
      </div>
      
      <div className="body-content">

        <div className='d-flex mb-4'>
          <div>
            <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#076db5ff", color: "#fff"}}>Penilaian Guru</button>
          </div>
          <div className='ml-2'>
            <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0"}}> <Link style={{textDecoration: "none", color: "#327dffff"}} to="/element-recaps-dimensi-head-super">Penilaian Kepala Sekolah</Link> </button>
          </div>
        </div>
        <hr style={{borderBottom: "1px solid #327dffff", marginTop: "-22px"}}/>
       
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

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_branch_id" value={form2?.ysb_branch_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>Pilih Cabang</option>
                  {getDataBranch.map((user,index) => (
                    <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                  ))}
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_school_id" value={form2?.ysb_school_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>Pilih Sekolah</option>
                    {getDataSchool.map((user,index) => (
                      <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                    ))} 
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 0px"}}>
                <Select 
                  className="mr-2"  
                  key={selectKey} 
                  name="ysb_teacher_id" 
                  onChange={handleInputChange2}
                  options={getDataTeacher.map(user => ({
                            value: user.id,
                            label: `${user.full_name}`,
                          }))}
                  placeholder="Pilih Guru"
                  styles = {{ control: (base) => ({
                                ...base,
                                color:"black",cursor:"pointer", border:"1px solid #4368c5",minWidth:"150px", height:"20px", borderRadius:"3px", fontSize:"14px"
                              }),
                              menu: (base) => ({
                                ...base,
                                marginTop: 0,
                              }),
                              singleValue: (base, state) => ({
                                ...base,
                                color: "black",  
                              }),
                              dropdownIndicator: (base) => ({
                                ...base,
                                color: 'black',
                              }),
                              placeholder: (base) => ({
                                ...base,
                                color: "black",  
                              }),
                              option: (provided, state) => ({
                                ...provided,
                                color: state.data.color,  
                                backgroundColor: state.isSelected ? (state.data.color === 'white' ? 'white' : 'white') : 'white',
                              }),
                          }}
                  />
              </Row>
              
                                      
              <Row style={{marginTop: "12px", padding:"0 12px"}}>
                <button onClick={GetResponseData2} className=" btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
              </Row>
            </div>
          </>
          :
          <>
            <div className="mb-3  mt-4">
              <div className="d-flex">
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))}  

                  {/* <option value="" hidden>Semester ..</option>
                    {getDataSemesterMap.map((user,index) => (
                        <option value={user?.id} style={{textAlign:""}}>{user?.name_year} - {user?.semester}</option>
                  ))}     */}
                </select>

                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_branch_id}  name="ysb_branch_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Cabang</option>
                  {getDataBranch.map((user,index) => (
                    <option key={index} value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                  ))}      
                </select>

                {/* <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_school_id}  name="ysb_school_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Pilih Sekolah</option>
                    {getDataSchool.map((user,index) => (
                      <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                    ))}     
                </select> */}

                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_school_id}  name="ysb_school_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Sekolah</option>
                  {getDataSchool
                  .filter((user) => user.school_code !== "BASEMENT_BEKASI") 
                  .map((user, index) => (
                    <option key={index} value={user?.school_code}>
                      {user?.school_name}
                    </option>
                  ))
                }
                </select>

                <Select
                className="mr-2"
                name="ysb_teacher_id"
                onChange={handleInputChange2}
                options={getDataTeacher.map(user => ({ value: user.id, label: `${user.full_name}` }))}
                placeholder="Pilih Guru"
                styles={{
                  control: (base) => ({ ...base, color: "black", cursor: "pointer", border: "1px solid #4368c5", minWidth: "150px", height: "28px", borderRadius: "3px", fontSize: "14px" }),
                  menu: (base) => ({ ...base, marginTop: 0 }),
                  singleValue: (base) => ({ ...base, color: "black" }),
                }}
              />
              </div>
              <div className='mt-3 d-flex'>
                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_dimensi_id}  name="ysb_dimensi_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Dimensi</option>
                  {getDataDimensi.map((user,index) => (
                    <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
                  ))}      
                </select>

                <button onClick={GetResponseData2} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>

              </div>
            </div>
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
                    <table className="table table-laporan-adab table-hover table-bordered " id="basic-datatable">
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
                            <td style={{ lineHeight: "2", textAlign: "center" }}>{rekap?.nisn}</td>
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
