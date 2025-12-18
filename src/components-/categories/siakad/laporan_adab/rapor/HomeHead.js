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
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import Select from 'react-select';
import ModalRapor from './modal/rapor';

export default function Home() {
  document.title = "Rapor";
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
  // states used by the Rapor table/modal snippet
  const [getRapor, setGetRapor] = useState([]);
  const [pages, setPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedRapor, setSelectedRapor] = useState(null);
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
    ysb_school_id: storageSchoolId || "",
    ysb_teacher_id: "",
    ysb_sub_element_value:"",
  });


  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      // setLoading(true);
      const [ dataBranch, dataSemester, dataDimensi, dataTeacher] = await axios.all([
        APIMS.get(`/api/access/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`,fetchParams),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams),
        APIUS.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${storageBranchGroping}&level=${storageLevel}&ysb_school_id=${storageSchoolId}`,fetchParams)
      ]);
      if (dataBranch.status === 200 && dataSemester.status === 200  && dataDimensi.status === 200 && dataTeacher.status === 200 ){
        const semesters = dataSemester.data.data.find(s => s.status === 1);
        setGetDataBranch(dataBranch.data.data);
        setGetDataSemester(semesters);
        setGetDataSemesterMap(dataSemester.data.data);
        setGetDataDimensi(dataDimensi.data.data);
        setGetDataDimensiDefault(dataDimensi.data.data[0]);
        setGetDataTeacher(dataTeacher.data.data);
        setNamaTA(semesters.name_year);
        setNamaSmstr(semesters.semester);
        // setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
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


  // open modal preview for a rapor
  const viewModalRapor = (id, rapor) => {
    try {
      setSelectedRapor(rapor ?? null);
      setShowModal(true);
    } catch (err) {
      console.error('viewModalRapor error', err);
    }
  };

  const GetResponseData = async () => {
    try {
      setLoading(true);

      const response = await APILA.get('/api/element-recaps-rapot-head/rapot', {
        params: {
          ysb_semester_id: form?.ysb_semester_id,
          level: storageLevel,
          branch: storageBranch,
          // ysb_dimensi_id: form?.ysb_dimensi_id,
          ysb_school_id: storageSchoolId,
          ysb_teacher_id: form?.ysb_teacher_id
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
      setLoading(true);
      const response = await APILA.get('api/element-recaps-rapot-head/rapot', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          // ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: form2?.ysb_school_id || storageSchoolId,
          ysb_teacher_id: form2?.ysb_teacher_id
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetRapor(response.data.data || []);
        setPages(response.data.totalPage || 1);
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

  const GetResponseDataSchool = async () => {
    try {
      const response = await APIMS.get(`/api/access/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form2?.ysb_branch_id}&level=${storageLevel}`,fetchParams)
      if (response?.status === 200) {
        setGetDataSchool(response.data.data);
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
    if (storageBranch !== "") {
      setForm2(prevForm => ({
        ...prevForm,
        ysb_branch_id: storageBranch
      }));      
    }
  }, [storageBranch]);

  useEffect(() => {
    if (form2?.ysb_branch_id) {
      GetResponseDataSchool();
    }
  }, [form2?.ysb_branch_id]);

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

  // When default semester and dimensi are set, load the rapor list automatically
  useEffect(() => {
    if (form2?.ysb_semester_id && form2?.ysb_semester_id !== "" && form2?.ysb_dimensi_id && form2?.ysb_dimensi_id !== "") {
      GetResponseData2();
    }
  }, [form2?.ysb_semester_id, form2?.ysb_dimensi_id]);

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


  return (
    <div className="body" >

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faListUl}/> Rapor</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Rapor </h5>
            </div>
          </>
        }   
      </div> 
      
      <div className="body-content">
        {/* Breadcrumnbs */}
        {/* <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page"> <Link to="/beranda-laporan-adab"> Beranda </Link> </li>
              <li className="breadcrumb-item"> Rapor</li>
            </ol>
          </nav>
        </div> */}

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
            <div className="mb-3">
              <div className="d-flex">
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))}  
                </select>

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
                              color:"black",cursor:"pointer", border:"1px solid #4368c5",minWidth:"150px", height:"28px", borderRadius:"3px", fontSize:"14px"
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

                <button onClick={GetResponseData2} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
              </div>
            </div>

            
          </>
        }

        {loading && <LoaderHome />}
        <Col xl='12' sm='12'> 
          <div className="mt-3">
            <div className="body-table" >
              <div>
                <table className="table  w-100 table-hover table-bordered" id="basic-datatable">
                  <thead >
                    <tr >
                      <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">No</th>
                      <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Nama Siswa</th>
                      <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Nisn</th>
                      <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
        
                  {getRapor.map((rapor, index) => (
                    <tr key={index}>
                      <td className='text-center' style={{ lineHeight: "2" }}> {(page - 1) * 10 + (index + 1)} </td>
                      <td style={{ lineHeight: "2" }}> {rapor.name_student} </td>
                      <td style={{ lineHeight: "2", textAlign: "center" }}> {rapor.nisn} </td>
                      <td className='text-center'>
                        <button   className="button-edit button-table text-center" onClick={() => viewModalRapor(rapor?.ysb_student_id || rapor?.id, rapor)}>
                          Lihat Rapor
                        </button>
                      </td>
                    </tr>
                  ))}
                              
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Col>
        
        {selectedRapor && (
          <ModalRapor
            show={showModal}
            onHide={() => setShowModal(false)}
            data_rapor={selectedRapor}
            id_student={selectedRapor?.ysb_student_id || selectedRapor?.id}
            getRapor={getRapor}
          />
        )}
    </div>
  </div>
  );
}
