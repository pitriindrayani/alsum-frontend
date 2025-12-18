import { useEffect, useRef, useState } from "react";
import {Col, Row} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import {FaPlus, FaSync, FaPlusCircle, FaCog , FaTimesCircle, FaListAlt, FaCalendar, FaCalendarDay, FaCalendarWeek, FaCalendarTimes, FaCalendarCheck} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../Loader/LoaderHome"
import moment from "moment";

export default function Login() {
  document.title = "List Cabang";
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(1);
  const [rows, setRows] = useState(1);
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
  const storageItems = JSON.parse(localStorage.getItem('menus'));
  console.log(storageItems)

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await API.get(`/api/periods?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
        setPage(response.data.pagination.current_page);
        setPages(response.data.pagination.total_pages);
        setRows(response.data.pagination.total);
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

  useEffect(() => {
    GetResponseData()
  }, [page,keyword,limit])

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

  const deleteById = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Menghapus data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/branches/${id}`,fetchParams);
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

  const viewModalUpdate = (id, branch_code, branch_name, parent_id) => {
    setModalUpdate(true)
    setId(id)
    setBranchCodeUpdate(branch_code)
    setBranchNameUpdate(branch_name)
    setParentIdUpdate(parent_id)
  }


  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1; // January is 0
  const [selectedMonth, setSelectedMonth] = useState(currentMonth - 1 || 12);
  const [selectedYear, setSelectedYear] = useState(
    selectedMonth === 12 ? currentYear - 1 : currentYear
  );

  const handleSubmit = () => {
    console.log(`Selected Month: ${selectedMonth}`);
    console.log(`Selected Year: ${selectedYear}`);
    alert(`Filter applied for ${selectedMonth}/${selectedYear}`);
  };


  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [dates, setDates] = useState([]);

  // Generate dates between two dates
  const generateDates = (start, end) => {
    const startDate = moment(start);
    const endDate = moment(end);
    const dateArray = [];

    while (startDate.isSameOrBefore(endDate)) {
      dateArray.push({
        date: startDate.format("DD/MM/YYYY"),
        day: startDate.format("dddd"),
      });
      startDate.add(1, "day");
    }
    return dateArray;
  };

  // Handle period selection
  const handlePeriodChange = (e) => {
    const periodId = e.target.value;
    const selected = getData.find((p) => p.id === periodId);
    if (selected) {
      setSelectedPeriod(selected);
      const generatedDates = generateDates(
        selected.period_start,
        selected.period_end
      );
      setDates(generatedDates);
    }
  };


  return (
    <div style={{ backgroundColor: "white"}}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} branchCodeUpdate={branchCodeUpdate} branchNameUpdate={branchNameUpdate} 
      parentIdUpdate={parentIdUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div className="mt-4" style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 0px 0px" }}>
          <Col xl="12" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
              <FaListAlt style={{marginRight:"5px"}}/>Absensi Guru
          </Col>
          
        </div>
          :
        <div style={{ paddingLeft: "0px", width: "100%",  display: "flex",justifyContent:"center", backgroundColor:"", padding:"7px"}}>
          <div style={{fontSize:"16px",display:"flex", alignItems:"center", justifyContent:"center", color:"#007bff", fontWeight:"bold"}}>
            <FaCalendarCheck style={{marginRight:"5px"}}/>Absensi Guru
          </div>
        
        </div>  
      }

    <div style={{ display: "flex", gap: "10px", alignItems: "center", backgroundColor:"#e78f08", padding:"3px 10px" }}>
      <div>
        {/* <label htmlFor="month">Bulan Laluu:</label> */}
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          style={{border:"1px solid #FFC400", borderRadius:"3px",height:"28px"}}
        >
            <option value="01-02">Januari-Februari</option>
            <option value="02-03">Februari-Maret</option>
            <option value="03-04">Maret-April</option>
            <option value="04-05">April-Mei</option>
            <option value="05-06">Mei-Juni</option>
            <option value="06-07">Juni-Juli</option>
            <option value="07-08">Juli-Agustus</option>
            <option value="08-09">Agustus-September</option>
            <option value="09-10">September-Oktober</option>
            <option value="10-11">Oktober-November</option>
            <option value="11-12">November-Desember</option>
            <option value="12-01">Desember-Januari</option>
        </select>
      </div>

      <div>
        {/* <label htmlFor="year">Tahun Lalu:</label> */}
        <select
          id="year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{border:"1px solid #FFC400", borderRadius:"3px",height:"28px"}}
        >
          {[...Array(3)].map((_, index) => (
            <option key={currentYear - index} value={currentYear - index}>
              {currentYear - index}
            </option>
          ))}
        </select>
      </div>

      <button color="" onClick={handlePeriodChange} style={{border:"1px solid #FFC400", borderRadius:"3px", height:""}}>
        Submit
        </button>
    </div>


    <div style={{ alignItems: "center", backgroundColor:"#FFB114", padding:"3px 10px", color:"#FFFFFF", fontWeight:"bold", fontSize:"12px"}}>
      <Row style={{display:"flex"}}>
        <Col xl='4' sm='12'> 
          NIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 202410101
        </Col>
        <Col xl='8' sm='12'>
          NO. ID FINGER   : 8731
        </Col>
      </Row>
      <Row style={{display:"flex"}}>
        <Col xl='4' sm='12'> 
          NAMA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;: DWIKI WANTARA
        </Col>
        <Col xl='8' sm='12'>
          APPROVAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: HERIADILLA MULYADI
        </Col>
      </Row>
    </div>
      
    <Col xl='12' sm='12'> 
    <div>
      <div style={{ display: "block", height: "100%", overflowY: "auto", overflowX: "auto", width:"100%" }}>
        <div>
          <table className="table is-bordered">
            <thead>
            <tr style={{backgroundColor: isTabletOrMobile? "white" : "#A8CBFF", lineHeight: "1" }}>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>NO</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>TANGGAL</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>HARI</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>JADWAL KERJA</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>ABSEN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center"  }}>DURASI HADIR</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>DATANG LAMBAT</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>PULANG CEPAT</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>ABSEN 1X</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>KEHADIRAN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>ALASAN TIDAK ABSEN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>CATATAN HADIR DIHARI LIBUR</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>FORM KOREKSI ABSEN</th>
              </tr>
            <tr></tr>
            <tr style={{backgroundColor: isTabletOrMobile? "white" : "#A8CBFF", lineHeight: "1"}}>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>MASUK</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>PULANG</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>MASUK</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>PULANG</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>-5 MENIT</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>+5 MENIT</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>-5 MENIT</th>
                <th style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1"}}>+5 MENIT</th>
              </tr>

            </thead>
            <tbody>
            {dates.map((d, index) => (
            <tr style={{fontFamily: "sans-serif", fontSize: "11px", textAlign: "center", lineHeight:"0.1",
              backgroundColor: d.day === "Saturday" || d.day === "Sunday" ? "red" : "transparent",
              color: d.day === "Saturday" || d.day === "Sunday" ? "white" : "black"
            }}>
              <td style={{ width:"20px", alignContent:"center"}}>{index + 1}</td>
              <td style={{ width:"80px", alignContent:"center" }}>{d.date}</td>
              <td style={{ width:"80px", alignContent:"center" }}>{d.day}</td>
              <td style={{ width:"80px", alignContent:"center" }}>7:00:00</td>
              <td style={{ width:"80px", alignContent:"center" }}>15:00:00</td>
              <td style={{ width:"80px", alignContent:"center" }}>7:05:00</td>
              <td style={{ minWidth:"80px", alignContent:"center" }}>3:16:29 PM</td>
              <td style={{ width:"80px", alignContent:"center" }}>Telat</td>
              <td style={{ width:"80px", alignContent:"center" }}></td>
              <td style={{ width:"80px", alignContent:"center" }}></td>
              <td style={{ width:"80px", alignContent:"center" }}></td>
              <td style={{ width:"80px", alignContent:"center" }}></td>
              <td style={{ width:"80px", alignContent:"center" }}>1</td>
              <td style={{ minWidth:"80px", alignContent:"center" }}></td>
              <td style={{ minWidth:"80px", alignContent:"center" }}></td>
              <td style={{ minWidth:"80px", alignContent:"center" }}></td>
              <td style={{ minWidth:"80px" }}>
              
              </td>
            </tr>
            ))}
              
            </tbody>
          </table>
            </div>
          </div>
      </div>
    </Col>

    <Col xl='4' sm='12'> 
      <div>
      <div style={{ display: "block", height: "100%", overflowY: "auto", overflowX: "auto", width:"100%" }}>
        <div>
          <table className="table is-bordered">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "#41D800" : "#41D800", borderBottom:"1px solid rgb(214, 214, 214)"}}>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252",  textAlign: "center"}}>KETERANGAN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252",  textAlign: "center"}}>KETENTUAN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252",  textAlign: "center"}}>POTONGAN ABSEN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252",  textAlign: "center"}}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Jumlah Hadir</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>22</td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Hadir Libur</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>2</td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Tidak Hadir</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>3</td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Absen 1X</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>2</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Datang -5</td>
                <td style={{ width:"80px", alignContent:"center" }}>7:00:59</td>
                <td style={{ width:"80px", alignContent:"center" }}>3</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Datang +5</td>
                <td style={{ width:"80px", alignContent:"center" }}>7:05:01</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>7</td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Plg Cepat -5</td>
                <td style={{ width:"80px", alignContent:"center" }}>14:54:59</td>
                <td style={{ width:"80px", alignContent:"center" }}>7</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Plg Cepat +5</td>
                <td style={{ width:"80px", alignContent:"center" }}>15:00:00</td>
                <td style={{ width:"80px", alignContent:"center" }}>2</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Hari Efektif</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}>23</td>
              </tr>

              
              
                 
              </tbody>
            </table>
              
          </div>
          </div>
            </div>
        
        </Col>    
        </div>
  );
}
