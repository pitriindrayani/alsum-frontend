import { useEffect, useRef, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import {FaPlus, FaSync, FaPlusCircle, FaCog , FaTimesCircle, FaListAlt, FaTags, FaUserTag, FaFileExcel} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../Loader/LoaderHome"
import { useLocation, useNavigate } from "react-router-dom";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Select from 'react-select'; 

export default function AbsensiGuru() {
  document.title = "List Absensi Guru";
  const [getData, setGetData] = useState([]);
  const [getDataTotal, setGetDataTotal] = useState({});
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  // modal update
  const [id, setId] = useState();
  const [branchCodeUpdate, setBranchCodeUpdate] = useState();
  const [branchNameUpdate, setBranchNameUpdate] = useState();
  const [parentIdUpdate, setParentIdUpdate] = useState();  
  // modal add
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parentPeriod, setGetDataPeriod] = useState(null);
  const storageLevel = localStorage.getItem('level');
  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const [storageBranch, setStorageBranch] = useState("");
  const tableRef = useRef(null);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [selectKey, setSelectKey] = useState(0);

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

  useEffect(() => {
    setStorageBranch(localStorage.getItem('ysb_branch_id') || "");
  }, []);

  const [form, setForm] = useState({
    month: "",
    year: "",
    ysb_branch_id: "",
    ysb_school_id: "",
    ysb_id_teacher: "",
    period_start: "",
    period_end: "",
    period_start_puasa: "",
    period_end_puasa: "",
    in_time: "",
    out_time: "",
    in_time_puasa: "",
    out_time_puasa: ""
  });

  const [form2, setForm2] = useState({
    month: "",
    year: "",
    ysb_branch_id: "",
    ysb_school_id: "",
    ysb_id_teacher: "",
    period_start: "",
    period_end: "",
    period_start_puasa: "",
    period_end_puasa: "",
    in_time: "",
    out_time: "",
    in_time_puasa: "",
    out_time_puasa: ""
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

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      setLoading(true);
      const [ dataBranch, dataPeriod] = await axios.all([
        API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        API.get(`/api/periods?page=${page}&limit=${limit}&ascending=${ascending}`, fetchParams),
      ]);
      if (dataBranch.status === 200  && dataPeriod.status === 200 ){
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
      const response = await API.post(`/api/schedule-teachers/status`, {
       monthYear: `${form?.year}-${form?.month}`,
       level: storageLevel,
       branch: storageBranch,
       ysb_school_id: form2?.ysb_school_id
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
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
      const response = await API.post(`/api/schedule-teachers/status`, {
       monthYear: `${form2?.year}-${form2?.month}`,
       level: storageLevel,
       branch: form2?.ysb_branch_id,
       ysb_school_id: form2?.ysb_school_id,
       ysb_id_teacher: form2?.ysb_id_teacher
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
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

  const GetResponseDataSchool = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form2?.ysb_branch_id}&level=${storageLevel}`,fetchParams)
      // Checking prosess
      if (response?.status === 200) {
        setGetDataSchool(response.data.data)
        // setLoading(false)
      }
    } catch (error) {
      // setLoading(false)
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
      ysb_id_teacher: e.value,
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
    if(parentPeriod !== null){
      setForm({
        ...form, 
        month: parseInt(parentPeriod.split('-')[1], 10), 
        year: parentPeriod.split('-')[0],
        period_start: `${parentPeriod?.period_start}`,
        period_end: `${parentPeriod?.period_end}`,
        period_start_puasa: `${parentPeriod?.period_start_puasa}`,
        period_end_puasa: `${parentPeriod?.period_end_puasa}`,
        in_time: `${parentPeriod?.in_time}`,
        out_time: `${parentPeriod?.out_time}`,
        in_time_puasa: `${parentPeriod?.in_time_puasa}`,
        out_time_puasa: `${parentPeriod?.out_time_puasa}`,
      });
    }
  }, [parentPeriod]);

  useEffect(() => {
    if( parentPeriod !== null){
      setForm2({
        ...form2, 
        month: parseInt(parentPeriod.split('-')[1], 10), 
        year: parentPeriod.split('-')[0],
        period_start: `${parentPeriod?.period_start}`,
        period_end: `${parentPeriod?.period_end}`,
        period_start_puasa: `${parentPeriod?.period_start_puasa}`,
        period_end_puasa: `${parentPeriod?.period_end_puasa}`,
        in_time: `${parentPeriod?.in_time}`,
        out_time: `${parentPeriod?.out_time}`,
        in_time_puasa: `${parentPeriod?.in_time_puasa}`,
        out_time_puasa: `${parentPeriod?.out_time_puasa}`,
      });
    }
  }, [parentPeriod]);

  useEffect(() => {
    if (form?.month !== "" && form?.year !== "") {
    //   GetResponseData();
    }
  }, [form])

  useEffect(() => {
    if (form2?.ysb_branch_id) {
      GetResponseDataSchool()     
    }
  }, [form2?.ysb_branch_id]);
  
  useEffect(() => {
    if(form2?.ysb_school_id){
      GetResponseDataTeacher()
    }
  }, [form2?.ysb_school_id])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const tahunSaatIni = new Date().getFullYear();
  // Membuat array variabel dengan 10 tahun terakhir
  const panjangTahun = 3;
  const arrayTahun = Array.from({ length: panjangTahun }, (_, index) => tahunSaatIni - index);

  const today = new Date(); 
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6); // 6

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = (e) => {
      setIsScrolled(e.target.scrollLeft > 0);
    };
    document.querySelector(".table-container")?.addEventListener("scroll", handleScroll);
    return () => {
      document.querySelector(".table-container")?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function generateDates(start, end, form2) {
    // console.log(end)
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];

    while (startDate <= endDate) {
      dates.push({
        year: form2?.year || new Date().getFullYear().toString(),
        month: form2?.month || (new Date().getMonth() + 1).toString(),
        ysb_branch_id: form2?.year || new Date().getFullYear().toString(),
        ysb_school_id: form2?.year || new Date().getFullYear().toString(),
        ysb_id_teacher: form2?.ysb_id_teacher || "",
        update_arrive: false,
        update_late: false,
        update_duration: false,
        tanggal: new Date(startDate),
        hari: startDate.toLocaleDateString('id-ID', { weekday: 'long' }),
        in_time_hours: form2?.in_time?.split(':')[0] || "08",
        in_time_minute: form2?.in_time?.split(':')[1] || "00",
        in_time_second: "00",
        out_time_hours: form2?.out_time?.split(':')[0] || "17",
        out_time_minute: form2?.out_time?.split(':')[1] || "00",
        out_time_second: "00",
        day_libur: startDate.getDay() === 0 || startDate.getDay() === 6,
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    return dates;
  }

  const [data, setData] = useState([]);
  
  useEffect(() => {
    if (form2){
      const generatedDates = generateDates('2025-06-10', '2025-06-15');
      setData(generatedDates);
    } else {
      setData([]); 
    }
  }, [form2]);  

  const handleChange2 = (index, e) => {
    const { name, value } = e.target;
    const updated = [...data];
    updated[index] = { ...updated[index], [name]: value };
    setData(updated);
  };

  const toggleLibur = (index) => {
    const updated = [...data];
    updated[index].day_libur = !updated[index].day_libur;
    setData(updated);
  };

  const toggleDatang = (index) => {
    const updated = [...data];
    updated[index].update_arrive = !updated[index].update_arrive;
    setData(updated);
  };

  const togglePulang = (index) => {     
    const updated = [...data];
    updated[index].update_late = !updated[index].update_late;
    setData(updated);
  };

  const toggleDurasi = (index) => {
    const updated = [...data];
    updated[index].update_duration = !updated[index].update_duration;
    setData(updated);
  };

  return (
    <div style={{ backgroundColor: "white", margin: "15px", marginRight: "10px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} branchCodeUpdate={branchCodeUpdate} branchNameUpdate={branchNameUpdate} 
      parentIdUpdate={parentIdUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%",  display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Absensi Guru
          </Col>
          {/* <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
            {permission.read === 1 ?
            <div onClick={buttonRefresh} style={{ height: "100%", marginRight: "5px", paddingTop: "0px", backgroundColor: "white", padding: "10px 10px", borderRadius: "2px", cursor: "pointer", border: "1px solid #DEDEDE" }}>
        <FaSync style={{ fontSize: "15px", marginRight: "0px", marginTop: "0px", display: "flex", alignItems: "center", height:"100%", color:"#2e649d" }} />
          </div> : ""}
            {permission.read === 1 ?
            <form onSubmit={searchData} style={{display:"flex", paddingRight:"0px"}}>
                <div style={{marginRight:"2px",borderRadius:"3px"}}>
                  <input value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="focused"
                    style={{backgroundColor:"#E9E9E9", border:"none",height:"100%", paddingLeft:"5px"}}
                    type="text"
                    placeholder="Search"
                  />
              </div>
            </form> : ""}
          </Col> */}
        </div>
          :
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "flex", padding: "10px 20px 10px 0px",backgroundColor:"#2e649d", borderRadius:"5px" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"white"}}>
            <FaListAlt style={{marginRight:"5px"}}/>List Absensi Guru
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
            <div className="mr-2" style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"black", borderRadius:"3px", cursor:"pointer", fontSize:"12px"}}>
            </div>
          </div>
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
                height: "28px",
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
                border: "1px solid #3272B3", borderRadius: "3px", height: "28px", alignItems:"center", alignContent:"center"
              }}>
              {arrayTahun.map((tahun, index) => (
                <option key={index} value={tahun}>{tahun}</option>
              ))}
            </select>
          </div>

        </div>

        <div style={{display: "flex",gap: "10px",alignItems: "center",backgroundColor: "",padding: "3px 10px", justifyContent:"right"}}>
          <div>
          <button className="mr-1" onClick={exportToExcel} style={{border:"none", fontSize:"13px", backgroundColor:"#009900", borderRadius:"5px", color:"white"}}>
            <FaFileExcel/> 
          </button>

          </div>
          
          <div>
            <select aria-label="Default select example" value={form2?.ysb_branch_id} onChange={handleChange} name="ysb_branch_id" style={{
                  border: "1px solid #3272B3",
                  borderRadius: "3px",
                  height: "28px",
                }}>
                  <option value="" hidden>Cabang ..</option>
                  {getDataBranch.map((user,index) => (
                    <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                  ))}         
              </select>
            </div>
          
          <div>
            <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" style={{
                border: "1px solid #3272B3",
                borderRadius: "3px",
                height: "28px",
              }}>
                <option value="" hidden>Sekolah ..</option>
                <option value="">All</option>
                {getDataSchool.map((user,index) => (
                  <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                ))}            
            </select>
          </div>

          <button onClick={GetResponseData2} style={{
              border: "1px solid #3272B3",
              backgroundColor: "#3272B3",
              color: "white",
              borderRadius: "3px",
              height: "28px",
            }}>
            Submit
          </button>
        </div>
      </>
      :
      <div style={{display: "flex", padding: "5px"}}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"0px", color:"black"}}>
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
                    border: "1px solid #3272B3", borderRadius: "3px", height: "38px", alignItems:"center", alignContent:"center"}}>
                  {arrayTahun.map((tahun, index) => (
                    <option key={index} value={tahun}>{tahun}</option>
                  ))}
                </select>
              </div>

              <div>
                <select aria-label="Default select example" onChange={handleChange} value={form2?.ysb_branch_id}  name="ysb_branch_id" style={{
                    border: "1px solid #3272B3",
                    borderRadius: "3px",
                    height: "38px"}}>
                    <option value="" hidden>Cabang ..</option>
                    {getDataBranch.map((user,index) => (
                      <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                    ))}         
                </select>
              </div>

              <div>
              <select aria-label="Default select example" onChange={handleChange}  name="ysb_school_id" style={{
                    border: "1px solid #3272B3",
                    borderRadius: "3px",
                    height: "38px"}}>
                    <option value="" hidden>Sekolah ..</option>
                    <option value="">All</option>
                    {getDataSchool.map((user,index) => (
                      <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                    ))}            
                  </select>
              </div>

              <div>
                <Select key={selectKey} name="ysb_id_teacher" onChange={handleInputChange2}
                  options={getDataTeacher.map(user => ({
                    value: user.id,
                    label: `${user.full_name}`,
                    color: '#2e649d'}))}
                  placeholder="Guru..." styles={{
                    control: (base) => ({
                      ...base,
                      border: "1px solid #3272B3",
                      borderRadius: "3px",
                      minWidth:"200px",
                      width: "100%",
                      height: "18px",
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
                      color: "black",  
                      backgroundColor: state.isSelected ?  (state.data.color === 'white' ? 'white' : '#DFF1FF') : 'white',
                    }),
                  }}
                />
              </div>

              <button
                onClick={GetResponseData2}
                style={{
                  border: "1px solid #3272B3",
                  backgroundColor: "#3272B3",
                  color: "white",
                  borderRadius: "3px",
                  height: "28px",
                }}>
                Submit
              </button>
            </div>
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
            {/* <button className="mr-1" onClick={exportToExcel} style={{border:"none", fontSize:"13px", backgroundColor:"#009900", borderRadius:"5px", color:"white"}}>
              <FaFileExcel className="mr-1"/>
              Export 
            </button> */}
          </div>
      </div> 
      ):""}
    
      <Col xl='12' sm='12'> 
         <div>
           <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
             <div >
               <table className="table table-bordered dt-responsive nowrap w-100" id="basic-datatable">
                 <thead>
                  <tr style={{ backgroundColor: "rgb(240, 239, 239)"}}>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)", textAlign: "center" }}>NO</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>NIP</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>NIK YSB</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>NAMA GURU</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>TANGGAL</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>HARI</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>MASUK</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>PULANG</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>LIBUR</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>DATANG</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>PULANG</th>
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "1px solid rgb(226, 226, 226)" }}>DURASI</th>
                  </tr>
                </thead>

                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td colSpan="12">Tidak ada data</td>
                    </tr>
                  ) : (
                    data.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>202409015</td>
                        <td>202409015</td>
                        <td>JENJIT PURININGTIAS</td>
                        <td>{item.tanggal.toLocaleDateString()}</td>
                        <td>{item.hari}</td>
                        <td>
                          <div style={{ display: 'flex' }}>
                            <select
                              className="mr-2"
                              aria-label="Jam Masuk"
                              onChange={(e) => handleChange2(index, e)}
                              value={item.in_time_hours}
                              name="in_time_hours"
                              style={{
                                color: '#2e649d',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: '2px solid rgb(137, 194, 255)',
                                width: '50%',
                                height: '30px',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                              }}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select> : 
                            <select
                              aria-label="Menit Masuk"
                              onChange={(e) => handleChange2(index, e)}
                              value={item.in_time_minute}
                              name="in_time_minute"
                              style={{
                                color: '#2e649d',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: '2px solid rgb(137, 194, 255)',
                                width: '50%',
                                height: '30px',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                              }}
                            >
                              {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex' }}>
                            <select
                              className="mr-2"
                              aria-label="Jam Pulang"
                              onChange={(e) => handleChange2(index, e)}
                              value={item.out_time_hours}
                              name="out_time_hours"
                              style={{
                                color: '#2e649d',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: '2px solid rgb(137, 194, 255)',
                                width: '50%',
                                height: '30px',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                              }}
                            >
                              {Array.from({ length: 24 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            <select
                              aria-label="Menit Pulang"
                              onChange={(e) => handleChange2(index, e)}
                              value={item.out_time_minute}
                              name="out_time_minute"
                              style={{
                                color: '#2e649d',
                                textAlign: 'center',
                                cursor: 'pointer',
                                border: '2px solid rgb(137, 194, 255)',
                                width: '50%',
                                height: '30px',
                                borderRadius: '5px',
                                backgroundColor: '#fff',
                              }}
                            >
                              {Array.from({ length: 60 }, (_, i) => (
                                <option key={i} value={i.toString().padStart(2, '0')}>
                                  {i.toString().padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.day_libur}
                            onChange={() => toggleLibur(index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.update_arrive}
                            onChange={() => toggleDatang(index)}
                          />
                        </td>
                        <td>
                          <input specifying additional flags
                            type="checkbox"
                            checked={item.update_late}
                            onChange={() => togglePulang(index)}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.update_duration}
                            onChange={() => toggleDurasi(index)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

               </table>
                 
             </div>
             </div>
            </div>
             
      </Col>
    </div>
  );
}