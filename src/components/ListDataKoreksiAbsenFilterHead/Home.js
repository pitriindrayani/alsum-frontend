import { useEffect, useRef, useState } from "react";
import {Button, Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import { FaSync, FaListAlt, FaCheck, FaPlus, FaPlusCircle, FaFileExcel} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
// Modal Role
import ModalAdd from "./ModalAdmin/ModalAdd";
import ModalUpdate from "./ModalAdmin/ModalUpdate";
import ModalUpdateHr from "./ModalAdmin/ModalUpdateHr";
import LoaderHome from "../Loader/LoaderHome"
import { Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import FormatHolidayDate from '../Function/FormatDate';
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select from 'react-select'; 

export default function Login() {
  document.title = "List Koreksi Absen";
  const [getData, setGetData] = useState([]);
  const [getDataTotal, setGetDataTotal] = useState({});
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  // modal update
  const [id, setId] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataUpdate, setDataUpdate] = useState();

  const handleShow = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  // modal add
  const handleClose = () => setShowModal(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalUpdateHr, setModalUpdateHr] = useState(false);  
  const [loading, setLoading] = useState(false);
  const rolesData = JSON.parse(localStorage.getItem('roles')) || [];
  const storageLevel = localStorage.getItem('level');
  const [parentPeriod, setGetDataPeriod] = useState(null);
  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const storageSchoolId = localStorage.getItem('ysb_school_id');
  const storageTeacherId = localStorage.getItem('id_teacher');
  const [storageBranch, setStorageBranch] = useState("");
  const tableRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);
  // console.log(selectedRows)

  const exportToExcel = () => {
    const table = tableRef.current;
    const ws = XLSX.utils.table_to_sheet(table, { raw: true });

    // Set column width/formatting if needed
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Rekap');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Rekapitulasi Kehadiran.xlsx');
  };
  
  const filteredRolesHr = rolesData.filter(role => 
     ['hr_makassar', 'hr_serpong', 'hr_bekasi', 'hr_bandung', 'hr'].includes(role.slug_name)
  );

  // console.log(filteredRolesHr.length)
  // console.log(storageLevel)
  
  const filteredRolesHeadSchool = rolesData.filter(role => 
     ['kepala_sekolah_bekasi','kepala_sekolah_makassar','kepala_sekolah_bandung','kepala_sekolah_serpong','wakil_kepala_sekolah_serpong','wakil_kepala_sekolah_bekasi','wakil_kepala_sekolah_makassar','wakil_kepala_sekolah_bandung'].includes(role.slug_name)
  );

  //  console.log(filteredRolesHeadSchool.length)

  useEffect(() => {
    setStorageBranch(localStorage.getItem('ysb_branch_id') || "");
  }, []);

  const [selectKey, setSelectKey] = useState(0);

  const [form, setForm] = useState({
    month: "",
    year: "",
    ysb_branch_id: "",
    ysb_school_id: "",
    ysb_teacher_id: "",
    date_in: "",
    date_out: ""
  });

  const [form2, setForm2] = useState({
    month: "",
    year: "",
    ysb_branch_id: "",
    ysb_school_id: "",
    ysb_teacher_id: "",
    date_in: "",
    date_out: ""
  });

  // const storageBranch = localStorage.getItem('ysb_branch_id');
  // const storageSchool = localStorage.getItem('ysb_school_id');
  // const storageIdTeacher = localStorage.getItem('id_teacher');
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
    }else{
      const foundPermission = storageItems.find(item => item.menu?.url === location.pathname);
      if(!foundPermission){ 
        navigate('/dashboard');
      } else{
        setPermission({
          create: foundPermission.create,
          read: foundPermission.read,
          update: foundPermission.update,
          delete: foundPermission.delete
        });
      }}
  }, [location.pathname]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ dataBranch, dataPeriod, dataSchool] = await axios.all([
        API.get(`/api/attendance-dailys-filter-head/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        API.get(`/api/attendance-dailys-filter-head/periods?page=${page}&limit=${limit}&ascending=${ascending}`, fetchParams),
        API.get(`/api/attendance-summary-lists-head/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}&ysb_school_id=${storageSchoolId}`, fetchParams)
      ]);
      if (dataBranch.status === 200  && dataPeriod.status === 200 && dataSchool.status === 200){
        const periods = dataPeriod.data.data;
        const latestPeriod = periods.reduce((latest, current) => {
        const currentEndDate = new Date(current.period_end);
        const latestEndDate = latest ? new Date(latest.period_end) : null;
        if (!latest || currentEndDate > latestEndDate) {
          return current;
        }
          return latest;
        }, null);
        setGetDataPeriod(latestPeriod.period_end);
        setGetDataBranch(dataBranch.data.data)
        setGetDataSchool(dataSchool.data.data)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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

  const GetResponseData = async () => {
    try {
      // e.preventDefault();;
      setLoading(true)
      const response = await API.post(`/api/attendance-dailys-filter-head`, {
       monthYear: `${form?.year}-${form?.month}`,
       level: storageLevel,
       branch: storageBranch,
       ysb_school_id: form2?.ysb_school_id,
       ysb_teacher_id: form2?.ysb_teacher_id,
       date_in: form2?.date_in,
       date_out: form2?.date_out
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
        setSelectedRows([])
        setGetData(response.data.data)
        setGetDataTotal(response.data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const GetResponseData2 = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.post(`/api/attendance-dailys-filter-head`, {
       monthYear: `${form2?.year}-${form2?.month}`,
       level: storageLevel,
       branch: form2?.ysb_branch_id,
       ysb_school_id: form2?.ysb_school_id,
       ysb_teacher_id: form2?.ysb_teacher_id,
       date_in: form2?.date_in,
       date_out: form2?.date_out
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
        // handleSelectAll(false)
        setSelectedRows([])
        setGetData(response.data.data)
        setGetDataTotal(response.data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const GetResponseDataTeacher = async () => {
      try {
        // e.preventDefault();
        setLoading(true)
        const response = await API.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form2?.ysb_school_id}`,fetchParams)
  
        // Checking process
        if (response?.status === 200) {
          setGetDataTeacher(response.data.data)
          setLoading(false)
          }
      } catch (error) {
        setLoading(false)
        swal({
          title: 'Failed',
          text: `${error.response.data.message}`,
          icon: 'error',
          timer: 3000,
          buttons: false
        });
      }
  }
    
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

  // useEffect(() => {
  //   GetResponseData2()
  // }, [keyword])

  useEffect(() => {
    if (storageBranch !== "") {
      setForm2(prevForm => ({
        ...prevForm,
        ysb_branch_id: storageBranch
      }));      
    }
  }, [storageBranch]);

  useEffect(() => {
    if (storageSchoolId !== "") {
      setForm2(prevForm => ({
        ...prevForm,
        ysb_school_id: storageSchoolId
      }));      
    }
  }, [storageSchoolId]);

  useEffect(() => {
    if(parentPeriod !== null){
      setForm({
        ...form, 
        month: parseInt(parentPeriod.split('-')[1], 10), 
        year: parentPeriod.split('-')[0]
      });
    }
  }, [parentPeriod]);

  useEffect(() => {
    if( parentPeriod !== null){
      setForm2({
        ...form2, 
        month: parseInt(parentPeriod.split('-')[1], 10), 
        year: parentPeriod.split('-')[0],
      });
    }
  }, [parentPeriod]);

  useEffect(() => {
    if (form?.month !== "" && form?.year !== "") {
      GetResponseData();
    }
  }, [form])

  useEffect(() => {
    if(getDataSchool.length !== 0) {
      GetResponseDataTeacher()     
    }
  }, [getDataSchool]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const changePage = ({ selected }) => {
    setPage(selected+1);
    if (selected === 10) {
      setMsg(
        ""
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const buttonRefresh = () => {
    window.location.reload();
  }
  
  const viewModalAdd = () => {
    setModalAdd(true)
  }

  const approveHeadSchool = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Approve data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Approve'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/attendance-dailys-filter-head/approve-head-school/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di approve!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const cancelApproveHeadSchool = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Cancel data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/attendance-dailys-filter-head/cancel-head-school/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di hapus!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const approveHr = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Approve data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Approve'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/attendance-dailys-filter-head/approve-hr-school/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di hapus!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const cancelApproveHr = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Cancel data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/attendance-dailys-filter-head/cancel-hr-school/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di hapus!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const viewModalUpdate = (id, user) => {
    setModalUpdate(true)
    setId(id)
    setDataUpdate(user)
  }

  const viewModalUpdatHr = (id, user) => {
    setModalUpdateHr(true)
    setId(id)
    setDataUpdate(user)
  }

  const approveHrAll = async () => {
      Swal.fire({
        title: 'Apakah Kamu Yakin?',
        text: `Approve ${selectedRows.length} data ini`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Approve'
      }).then( async (result) => {
        if(result.isConfirmed) {
          const response =  await API.put(`/api/attendance-dailys-filter-head/approve-hr-all`,{selectedRows : selectedRows},fetchParams);
          if (response.data.error == false) {
            GetResponseData()
            setSelectedRows([])
            swal({
              title: 'Success',
              text: "Data berhasil di approve!",
              icon: 'success',
              timer: 3000,
              buttons: false
            });
          }  
        }
      })
    };

    const approveHeadSchoolAll = async () => {
      Swal.fire({
        title: 'Apakah Kamu Yakin?',
        text: `Approve ${selectedRows.length} data ini`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Approve'
      }).then( async (result) => {
        if(result.isConfirmed) {
          const response =  await API.put(`/api/attendance-dailys-filter-head/approve-head-all`,{selectedRows : selectedRows},fetchParams);
          if (response.data.error == false) {
            GetResponseData()
            setSelectedRows([])
            swal({
              title: 'Success',
              text: "Data berhasil di approve!",
              icon: 'success',
              timer: 3000,
              buttons: false
            });
          }  
        }
      })
    };

    const tahunSaatIni = new Date().getFullYear();
    // Membuat array variabel dengan 10 tahun terakhir
    const panjangTahun = 3;
    const arrayTahun = Array.from({ length: panjangTahun }, (_, index) => tahunSaatIni - index);
    const today = new Date();
    const sixDaysAgo = new Date();
    sixDaysAgo.setDate(today.getDate() - 6); 

    // check box untuk approve
    const handleSelectAll = (e) => {
      if (e.target.checked) {
        const eligibleIds = getData
          ?.filter((user) =>
            (storageLevel === "developer" &&
              user?.approve_head_school === 0 &&
              user?.approve_hr === 0 &&
              user?.period?.fg_active === 1) ||
            (storageLevel === "developer" &&
              user?.approve_head_school === 1 &&
              user?.approve_hr === 0 &&
              user?.period?.fg_active === 1) ||
            (filteredRolesHeadSchool?.length > 0 &&
              user?.approve_head_school === 0 &&
              user?.approve_hr === 0 &&
              user?.period?.fg_active === 1 &&
              storageLevel !== "developer") ||
            (filteredRolesHr?.length > 0 &&
              user?.approve_head_school === 1 &&
              user?.approve_hr === 0 &&
              user?.period?.fg_active === 1 &&
              storageLevel !== "developer")
          )
          ?.map((user) => user?.id)
        setSelectedRows(eligibleIds);
      } else {
        setSelectedRows([]);
      }
    };

    const handleRowSelect = (id) => {
      if (selectedRows.includes(id)) {
        setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
      } else {
        setSelectedRows([...selectedRows, id]);
      }
    };

    const getEligibleIds = () => {
      return getData
        ?.filter((user) =>
          (storageLevel === "developer" &&
            user?.approve_head_school === 0 &&
            user?.approve_hr === 0 &&
            user?.period?.fg_active === 1) ||
          (storageLevel === "developer" &&
            user?.approve_head_school === 1 &&
            user?.approve_hr === 0 &&
            user?.period?.fg_active === 1) ||
          (filteredRolesHeadSchool?.length > 0 &&
            user?.approve_head_school === 0 &&
            user?.approve_hr === 0 &&
            user?.period?.fg_active === 1 &&
            storageLevel !== "developer") ||
          (filteredRolesHr?.length > 0 &&
            user?.approve_head_school === 1 &&
            user?.approve_hr === 0 &&
            user?.period?.fg_active === 1 &&
            storageLevel !== "developer")
        )
        ?.map((user) => user?.id) || [];
    };

    return (
      <div style={{ backgroundColor: "white", margin: "15px", marginRight: "10px", boxShadow: "2px 2px 10px #BFBFBF" }}>
        {modalAdd  && <ModalAdd GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
        {modalUpdate && <ModalUpdate GetResponseData={GetResponseData} dataUpdate={dataUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
        {modalUpdateHr && <ModalUpdateHr GetResponseData={GetResponseData} dataUpdate={dataUpdate} id={id} show={modalUpdateHr} onHide={() => setModalUpdateHr(false)} />}
        {loading && <LoaderHome />}
        
        {isTabletOrMobile ? 
          <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "1px solid #EEEEEE", display: "", padding: "0px 0px 0px 0px" }}>
            <Col xl="12" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
                <FaListAlt style={{marginRight:"5px"}}/>List Koreksi Absen
            </Col>
          </div>
            :
          <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "flex", padding: "10px 20px 10px 0px",backgroundColor:"#2e649d", borderRadius:"5px" }}>
            <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"white"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Koreksi Absen
            </div>
            {permission.create === 1 ?
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"#005A9F",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <div>
                <FaPlusCircle/> &nbsp;
              </div>
              <div>
                Tambah Koreksi
              </div>
            </div> : ""}
          </div>  
        }

        {permission.read === 1 ?
        (isTabletOrMobile ? 
          <>
          <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
            <div>
              <select value={form2?.month} name="month" onChange={handleChange} style={{
                  border: "1px solid #3272B3",
                  borderRadius: "3px",
                  height: "38px",
                }}>
                <option value="1">Desember-Januari</option>
                <option value="2">Januari-Februari</option>
                <option value="3">Februari-Maret</option>
                <option value="4">Maret-April</option>
                <option value="5">April-Mei</option>
                <option value="6">Mei-Juni</option>
                <option value="7">Juni-Juli</option>
                <option value="8">Juli-Agustus</option>
                <option value="9">Agustus-September</option>
                <option value="10">September-Oktober</option>
                <option value="11">Oktober-November</option>
                <option value="12">November-Desember</option>
              </select>
            </div>

            <div>
              <select className="" aria-label="Default select example" value={form2?.year} name="year" onChange={handleChange}  style={{
                  border: "1px solid #3272B3", borderRadius: "3px", height: "38px", alignItems:"center", alignContent:"center"
                }}>
                {arrayTahun.map((tahun, index) => (
                  <option key={index} value={tahun}>{tahun}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
            {/* <div>
              <button className="mr-1" onClick={exportToExcel} style={{border:"none", fontSize:"13px", backgroundColor:"#009900", borderRadius:"5px", color:"white"}}>
                <FaFileExcel/> 
              </button>
            </div> */}
            
            <div>
              <select aria-label="Default select example" value={form2?.ysb_branch_id} onChange={handleChange} name="ysb_branch_id" style={{
                    border: "1px solid #3272B3",
                    borderRadius: "3px",
                    height: "38px",
                  }}>
                    <option value="" hidden>Cabang ..</option>
                    {getDataBranch.map((user,index) => (
                      <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                    ))}         
                </select>
              </div>
            
            <div>
              <select aria-label="Default select example"  onChange={handleChange} value={form2?.ysb_school_id} name="ysb_school_id" style={{
                  border: "1px solid #3272B3",
                  borderRadius: "3px",
                  height: "38px",
                }}>
                  <option value="" hidden>Sekolah ..</option>
                  {getDataSchool.map((user,index) => (
                    <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                  ))}            
              </select>
            </div>
          </div>

          <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
            <Select key={selectKey} name="ysb_teacher_id" onChange={handleInputChange2}
                  options={getDataTeacher.map(user => ({
                    value: user.id,
                    label: `${user.full_name}`,
                    color: '#2e649d'
                  }))}
                  placeholder="Guru..." styles={{
                    control: (base) => ({
                      ...base,
                      color:"black",cursor:"pointer", border:"2px solid #3272B3",minWidth:"200px", height:"28px", borderRadius:"3px"
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
                }}/>
          </div>

          <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
              <div>
                <input type="date" name="date_in" onChange={handleChange} value={form2?.date_in} placeholder="...." 
                  style={{width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',cursor:"", height:"38px", borderRadius:"3px",border: "1px solid #3272B3"}}
                />
              </div>

              <div>
                <input type="date" name="date_out" onChange={handleChange} value={form2?.date_out} placeholder="...." 
                  style={{width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',cursor:"", height:"38px", borderRadius:"3px",border: "1px solid #3272B3"}}
                />
              </div>

              <button onClick={GetResponseData2} style={{
                  border: "1px solid #3272B3",
                  backgroundColor: "#3272B3",
                  color: "white",
                  borderRadius: "3px",
                  height: "38px",
                }}>
                Submit
              </button>
          </div>

           <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
            {selectedRows.length !== 0 &&
              filteredRolesHeadSchool.length > 0 &&
              storageLevel !== "developer" ? (
                <button
                  onClick={approveHeadSchoolAll}
                  style={{
                    border: "1px solid #ffc107",
                    backgroundColor: "#ffc107",
                    color: "warning",
                    borderRadius: "3px",
                    height: "38px",
                    cursor:"pointer"
                  }}>
                  Approve
                </button>
              ) : selectedRows.length !== 0 &&
                filteredRolesHr.length > 0  &&
                storageLevel !== "developer" ? (
                <button
                    onClick={approveHrAll}                    
                    style={{
                    border: "1px solid #ffc107",
                    backgroundColor: "#ffc107",
                    color: "white",
                    borderRadius: "3px",
                    height: "38px",
                    cursor:"pointer"
                  }}>
                  Approve
                </button>
              ) : (
                <></>
              )}
            </div>
          </>
          :
          <>
            <div style={{display: "flex", padding: "5px"}}>
              <div style={{fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"0px", color:"black"}}>
                <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px"}}>
                  <div>
                    <select value={form2?.month} name="month" onChange={handleChange} style={{
                        border: "1px solid #3272B3",
                        borderRadius: "3px",
                        height: "38px",
                      }}>
                      <option value="1">Desember-Januari</option>
                      <option value="2">Januari-Februari</option>
                      <option value="3">Februari-Maret</option>
                      <option value="4">Maret-April</option>
                      <option value="5">April-Mei</option>
                      <option value="6">Mei-Juni</option>
                      <option value="7">Juni-Juli</option>
                      <option value="8">Juli-Agustus</option>
                      <option value="9">Agustus-September</option>
                      <option value="10">September-Oktober</option>
                      <option value="11">Oktober-November</option>
                      <option value="12">November-Desember</option>
                    </select>
                  </div>
            
                  <div>
                    <select className="" aria-label="Default select example" value={form2?.year} name="year" onChange={handleChange}  style={{
                        border: "1px solid #3272B3", borderRadius: "3px", height: "38px", alignItems:"center", alignContent:"center"
                      }}>
                      {arrayTahun.map((tahun, index) => (
                        <option key={index} value={tahun}>{tahun}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                  <select aria-label="Default select example" onChange={handleChange} value={form2?.ysb_branch_id}  name="ysb_branch_id" style={{
                        border: "1px solid #3272B3",
                        borderRadius: "3px",
                        height: "38px",
                      }}>
                        <option value="" hidden>Cabang ..</option>
                        {getDataBranch.map((user,index) => (
                          <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                        ))}         
                      </select>
                  </div>

                  <div>
                  <select aria-label="Default select example" onChange={handleChange} value={form2?.ysb_school_id}  name="ysb_school_id" style={{
                        border: "1px solid #3272B3",
                        borderRadius: "3px",
                        height: "38px",
                      }}>
                        <option value="" hidden>Sekolah ..</option>
                        {getDataSchool.map((user,index) => (
                          <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                        ))}            
                      </select>
                  </div>

                  <Select key={selectKey} name="ysb_teacher_id" onChange={handleInputChange2}
                    options={getDataTeacher.map(user => ({
                      value: user.id,
                      label: `${user.full_name}`,
                      color: '#2e649d'
                    }))}
                    placeholder="Guru..." styles={{
                      control: (base) => ({
                        ...base,
                        color:"black",cursor:"pointer", border:"2px solid #3272B3",minWidth:"200px", height:"28px", borderRadius:"3px"
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
                  }}/>
              
                </div>
              </div>
              {/* <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
                <button className="mr-1" onClick={exportToExcel} style={{border:"none", fontSize:"13px", backgroundColor:"#009900", borderRadius:"5px", color:"white",height:"38px"}}>
                  <FaFileExcel className="mr-1"/>
                  Export 
                </button>
              </div> */}
            </div> 
            
            <div style={{display: "flex", padding: "5px"}}>
              <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"0px", color:"black"}}>
                <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px"}}>

                  <div>
                    <input type="date" name="date_in" onChange={handleChange} value={form2?.date_in} placeholder="...." 
                      style={{width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',cursor:"", height:"38px", borderRadius:"3px",border: "1px solid #3272B3"}}
                    />
                  </div>

                  <div>
                    <input type="date" name="date_out" onChange={handleChange} value={form2?.date_out} placeholder="...." 
                      style={{width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',cursor:"", height:"38px", borderRadius:"3px",border: "1px solid #3272B3"}}
                    />
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
                  
                  {selectedRows.length !== 0 &&
                  filteredRolesHeadSchool.length > 0 &&
                  storageLevel !== "developer" ? (
                    <button
                      onClick={approveHeadSchoolAll}
                      style={{
                        border: "1px solid #ffc107",
                        backgroundColor: "#ffc107",
                        color: "warning",
                        borderRadius: "3px",
                        height: "38px",
                        cursor:"pointer"
                      }}>
                      Approve
                    </button>
                  ) : selectedRows.length !== 0 &&
                    filteredRolesHr.length > 0  &&
                    storageLevel !== "developer" ? (
                    <button
                        onClick={approveHrAll}                    
                        style={{
                        border: "1px solid #ffc107",
                        backgroundColor: "#ffc107",
                        color: "white",
                        borderRadius: "3px",
                        height: "38px",
                        cursor:"pointer"
                      }}>
                      Approve
                    </button>
                  ) : (
                    <></>
                  )}
                  
                </div>
              </div>
            
            </div> 
          </>
        ):""}
      
        <Col xl='12' sm='12'> 
        <div>
          <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
            <div>
              <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                <thead>
                  <tr style={{backgroundColor: isTabletOrMobile? "white" : "white", borderBottom:"1px solid rgb(214, 214, 214)"}}>
                    <th style={{ width: "20px", textAlign: "center" }}>
                    <input
                      type="checkbox"
                      onChange={(e) => handleSelectAll(e)}
                      checked={selectedRows.length > 0 && selectedRows.length === getEligibleIds().length}
                      style={{ width: "10px", height: "10px", transform: "scale(1.5)" }}
                    />
                  </th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center"}}>NO</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NIP YPI</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NAMA</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL PENGAJUAN</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL APPROVE</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JAM MASUK</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JAM KELUAR</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JENIS KOREKSI</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>KETERANGAN</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>DOKUMEN</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>STATUS</th>
                    {permission.update === 0 && permission.delete === 0 ? <></> :
                    (filteredRolesHr.length > 0 ? 
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                    : filteredRolesHeadSchool.length > 0 ? 
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                    : <></>
                    )}
                  </tr>
                </thead>
                {permission.read === 1 ?
                <tbody>
                    {getData.map((user,index) => (
                      <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center"}}>

                        <td style={{ lineHeight: "2" }}>
                          {storageLevel === "developer" &&
                          user?.approve_head_school === 0 &&
                          user?.approve_hr === 0 &&
                          user?.period?.fg_active === 1 ? (
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(user?.id)}
                              onChange={() => handleRowSelect(user?.id)}
                              style={{ width: "10px", height: "10px", transform: "scale(1.5)" }}
                            />
                          ) : storageLevel === "developer" &&
                            user?.approve_head_school === 1 &&
                            user?.approve_hr === 0 &&
                            user?.period?.fg_active === 1 ? (
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(user?.id)}
                              onChange={() => handleRowSelect(user?.id)}
                              style={{ width: "10px", height: "10px", transform: "scale(1.5)" }}
                            />
                          ) : filteredRolesHeadSchool.length > 0 &&
                            user?.approve_head_school === 0 &&
                            user?.approve_hr === 0 &&
                            user?.period?.fg_active === 1 &&
                            storageLevel !== "developer" ? (
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(user?.id)}
                              onChange={() => handleRowSelect(user?.id)}
                              style={{ width: "10px", height: "10px", transform: "scale(1.5)" }}
                            />
                          ) : filteredRolesHr.length > 0 &&
                            user?.approve_head_school === 1 &&
                            user?.approve_hr === 0 &&
                            user?.period?.fg_active === 1 &&
                            storageLevel !== "developer" ? (
                            <input
                              type="checkbox"
                              checked={selectedRows.includes(user?.id)}
                              onChange={() => handleRowSelect(user?.id)}
                              style={{ width: "10px", height: "10px", transform: "scale(1.5)" }}
                            />
                          ) : (
                            <input type="checkbox" disabled style={{ width: "10px", height: "10px", transform: "scale(1.5)" }} />
                          )}
                        </td>

                        <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td> 
                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                            <div>
                            {user?.teacher_detail?.nip_ypi_karyawan === null? user?.teacher_detail?.nip_ypi : user?.teacher_detail?.nip_ypi_karyawan}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left", minWidth:"120px"}}>
                            <div>
                            {user?.full_name}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                            <div>
                              <FormatHolidayDate props={user?.att_date}/>
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                            <div>
                              {user?.created_at !== null?
                              <>
                                <FormatHolidayDate props={user?.created_at.split(" ")[0]}/>
                                {user?.created_at.split(" ")[1].split(":")[0]}:{user?.created_at.split(" ")[1].split(":")[1]}
                              </>
                              :<></>}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                            <div>
                              {user?.approve_at_head !== null?
                              <>
                                <FormatHolidayDate props={user?.approve_at_head.split(" ")[0]}/>
                                {user?.approve_at_head.split(" ")[1].split(":")[0]}:{user?.approve_at_head.split(" ")[1].split(":")[1]} 
                              </>
                              :<></>}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left"}}>
                            <div>
                            {user?.att_clock_in}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left"}}>
                            <div>
                            {user?.att_clock_out}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", textAlign:"left"}}>
                            <div>
                            {user?.absent_type === "1"? "Sakit" :
                              user?.absent_type === "2"? "Izin" :
                              user?.absent_type === "3"? "Masuk/Pulang" :
                              user?.absent_type === "4"? "Izin Datang Siang" :
                              user?.absent_type === "5"? "Izin Pulang Cepat" :
                              user?.absent_type === "3_hr"? "Masuk/Pulang" :
                              user?.absent_type === "4_hr"? "Izin Datang Siang" :
                              user?.absent_type === "5_hr"? "Izin Pulang Cepat" :
                              user?.absent_type === "6"? "Dinas Dalam Kota/Training" :
                              user?.absent_type === "7"? "Dinas/Training Online" :
                              user?.absent_type === "8"? "Dinas Luar Kota" : 
                              user?.absent_type === "9"? "Dinas Dalam Kampus" :
                              user?.absent_type === "9_hr"? "Dinas Dalam Kampus" :
                              user?.absent_type === "10"? "Shalat Subuh Berjamaah" :
                              user?.absent_type === "10_hr"? "Shalat Subuh Berjamaah"
                              : ""
                            }
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex",  textAlign:"left",wordWrap:"break-word",minWidth:"150px",maxWidth: "250px"}}>
                            <div>
                            {user?.keterangan}
                            </div> 
                          </div>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" }}>
                          {user?.dokument? (
                            user.dokument.toLowerCase().endsWith(".pdf")?(
                              <a href={`${process.env.REACT_APP_API_KEY}/storage/${user.dokument}`} target="_blank" rel="noopener noreferrer"
                                style={{ textDecoration: "none", color: "blue" }}>
                                Lihat File PDF
                              </a>
                              ):(
                              <>
                                <a href="#" onClick={(e) => {e.preventDefault();handleShow(`${process.env.REACT_APP_API_KEY}/storage/${user.dokument}`);}} 
                                  style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
                                  Lihat File
                                </a>
                              </>
                              )
                            ):(
                              <></>
                            )}
                          </div>

                          {/* Modal */}
                          <Modal size="xl" show={showModal} onHide={handleClose} centered>
                            <Modal.Header closeButton>
                              <Modal.Title>Preview Dokumen</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                              {selectedImage && <img src={selectedImage} alt="Dokumen" style={{ maxWidth: "100%", height: "auto" }} />}
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={handleClose}>
                                Tutup
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </td>

                        <td style={{ lineHeight: "2" }}>
                          <div style={{display:"flex", alignItems:"", justifyContent:"", textAlign:"left"}}>
                            <div>
                            {user?.approve_head_school === 0 && user?.approve_hr === 0 ? "Proses Kepsek" :
                              user?.approve_head_school === 1 && user?.approve_hr === 0 ? "Proses Hr" : 
                              user?.approve_head_school === 1 && user?.approve_hr === 1 ? 
                              <div style={{color:"#13C06F", fontWeight:""}}>Disetujui <FaCheck/></div> : <></>
                            }
                            </div> 
                          </div>
                        </td>

                        {permission.update === 0 && permission.delete === 0 ? <></> :
                          (user?.approve_head_school === 0 && user?.approve_hr === 0 && filteredRolesHeadSchool.length > 0 && user?.period !== null && user?.period?.fg_active === 1? 
                          <td style={{lineHeight:"1"}}>
                            <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                                <Button className="mr-2" color="warning" onClick={() => {approveHeadSchool(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Approve
                                </Button>
                                <Button className="mr-2" color="primary" onClick={() => viewModalUpdate(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Edit
                                </Button>
                                <Button color="danger" onClick={() => {cancelApproveHeadSchool(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Batal
                                </Button>
                            </div>
                          </td>
                          : user?.approve_head_school === 1 && user?.approve_hr === 0 && filteredRolesHr.length > 0 && user?.period !== null && user?.period?.fg_active === 1?
                          <td style={{lineHeight:"1"}}>
                            <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                                <Button className="mr-2" color="warning" onClick={() => {approveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Approve
                                </Button>
                                <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Edit
                                </Button>
                                <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Batal
                                </Button>
                            </div> 
                          </td>
                          : user?.approve_head_school === 1 && user?.approve_hr === 0 && filteredRolesHr.length > 0 && user?.period !== null && user?.period?.fg_active === 0?
                          <td style={{lineHeight:"1"}}>
                            <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                                <Button className="mr-2" color="warning" onClick={() => {approveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Approve
                                </Button>
                                <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Edit
                                </Button>
                                <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Batal
                                </Button>
                            </div> 
                          </td>
                          : user?.approve_head_school === 1 && user?.approve_hr === 1 && filteredRolesHr.length > 0 && user?.period !== null && user?.period?.fg_active === 1?
                          <td style={{lineHeight:"1"}}>
                            <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                                <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Edit
                                </Button>
                                <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Hapus
                                </Button>
                            </div> 
                          </td>
                          : user?.approve_head_school === 1 && user?.approve_hr === 1 && filteredRolesHr.length > 0 && user?.period !== null && user?.period?.fg_active === 0?
                          <td style={{lineHeight:"1"}}>
                            <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                                <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Edit
                                </Button>
                                <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                                  Hapus
                                </Button>
                            </div> 
                          </td>
                          : user?.approve_head_school === 1 && user?.approve_hr === 1 ? 
                          <td style={{lineHeight:"1"}}></td>
                          : <td style={{lineHeight:"1"}}></td>
                          )}
                      </tr>
                    ))}
                </tbody>:<></>}
              </table>
                
            </div>
            </div>
              </div>
              {/* <div style={{ display: "flex", padding:"10px"}}>
            <div>
              <div style={{fontSize:"12px"}}>
                Total Rows: {rows} 
              </div>
              <div style={{fontSize:"12px"}}>
                Page: {rows ? page : 0} of {pages}
              </div>
              <p className="has-text-centered has-text-danger">{msg}</p>
            </div> 
              <div style={{flex:"50%", display:"flex", justifyContent:"end"}}>
                <nav
                  style={{fontSize:"12px"}}
                  className="pagination is-centered"
                  key={rows}
                  role="navigation"
                  aria-label="pagination"
                  >
                  <ReactPaginate
                    previousLabel={"<"}
                    nextLabel={">"}
                    pageCount={Math.min(10, pages)}
                    onPageChange={changePage}
                    containerClassName={"pagination-list"}
                    pageLinkClassName={"pagination-link"}
                    previousLinkClassName={"pagination-previous"}
                    nextLinkClassName={"pagination-next"}
                    activeLinkClassName={"pagination-link is-current"}
                    disabledLinkClassName={"pagination-link is-disabled"}
                  />
                </nav>
                </div>
            </div>  */}
          </Col>
      </div>
    );
  }
