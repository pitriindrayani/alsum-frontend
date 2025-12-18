import { useEffect, useRef, useState } from "react";
import {Col, Row} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import { FaListAlt, FaCalendarCheck} from 'react-icons/fa'
import "bulma/css/bulma.css";
import "../../index.css"
import swal from "sweetalert";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../Loader/LoaderHome"
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import FormatHolidayDate from '../Function/FormatDate';

export default function Login() {
  document.title = "List Absensi";
  const [getData, setGetData] = useState(null);
  const [getDataIdTeacher, setGetDataIdTeacher] = useState(null);
  const [getDataTeacher, setGetDataTeacher] = useState();
  const {id_teacher, year, month} = useParams()
  // Fungsi untuk membuat daftar tanggal
  const token = localStorage.getItem("token");
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  // modal update
  const [id, setId] = useState();
  const [branchCodeUpdate, setBranchCodeUpdate] = useState();
  const [branchNameUpdate, setBranchNameUpdate] = useState();
  const [parentIdUpdate, setParentIdUpdate] = useState();
  const [parentPeriod, setGetDataPeriod] = useState(null);

  // modal add
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const storageItems = JSON.parse(localStorage.getItem('email_admin'));
  const [dataTeacherAdd, setDataTeacherAdd] = useState();
  const [dateRangeAdd, setDateRangeAdd] = useState();
  const [dateAdd, setDateAdd] = useState();
  const [dayAdd, setDayAdd] = useState();
  const [startTimeAdd, setStartTimeAdd] = useState();
  const [endTimeAdd, setEndTimeAdd] = useState();
  const [durationAttendanceAdd, setDurationAttendanceAdd] = useState();
  const [arriveFiveMinutesAdd, setArriveFiveMinutesAdd] = useState();
  const [lateFiveMinutesAdd, setLateFiveMinutesAdd] = useState();
  const [inScheduleAdd, setInScheduleAdd] = useState();
  const [outScheduleAdd, setOutScheduleAdd] = useState();
  const [idHeadSchoolAdd, setIdHeadSchoolAdd] = useState();

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    month: "",
    year: "",
    id_teacher: ""
  });

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.post(`/api/attendance-summary-lists-head/details`, {
       monthYear: `${year}-${month}`,
       id_teacher: id_teacher
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
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
  
  useEffect(() => {
    if(getDataIdTeacher !== null && parentPeriod !== null){
      setForm({
        ...form, 
        month: parseInt(parentPeriod.split('-')[1], 10), 
        year: parentPeriod.split('-')[0],
        id_teacher: getDataIdTeacher,
      });
    }
  }, [getDataIdTeacher, parentPeriod]);
  
  useEffect(() => {
    if (month && year && id_teacher) {
      GetResponseData();
    }
  }, [month,year,id_teacher])
    
  const viewModalAdd = (dataTeacher, date_range, date, day, start_time, end_time, duration_attendance,
    arrive_five_minutes, late_five_minutes, in_schedule, out_schedule, id_head_school) => {
    setDataTeacherAdd(dataTeacher)
    setDateRangeAdd(date_range)
    setDateAdd(date)
    setDayAdd(day)
    setStartTimeAdd(start_time)
    setEndTimeAdd(end_time)
    setDurationAttendanceAdd(duration_attendance)
    setArriveFiveMinutesAdd(arrive_five_minutes)
    setLateFiveMinutesAdd(late_five_minutes)
    setInScheduleAdd(in_schedule)
    setOutScheduleAdd(out_schedule)
    setIdHeadSchoolAdd(id_head_school)
    setModalAdd(true)
  }

  const tahunSaatIni = new Date().getFullYear();
  // Membuat array variabel dengan 10 tahun terakhir
  const panjangTahun = 3;
  const arrayTahun = Array.from({ length: panjangTahun }, (_, index) => tahunSaatIni - index);

  const today = new Date(); 
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6); // 6

  const deleteById = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Membatalkan Pengajuan Ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/attendance-dailys/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Pengajuan berhasil dibatalkan!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

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
  
  return (
    <div style={{ backgroundColor: "white"}}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} dataTeacherAdd={dataTeacherAdd} dateRangeAdd={dateRangeAdd}
      dateAdd={dateAdd} dayAdd={dayAdd} startTimeAdd={startTimeAdd} endTimeAdd={endTimeAdd} durationAttendanceAdd={durationAttendanceAdd}
      arriveFiveMinutesAdd={arriveFiveMinutesAdd} lateFiveMinutesAdd={lateFiveMinutesAdd} inScheduleAdd={inScheduleAdd}
      outScheduleAdd={outScheduleAdd} idHeadSchoolAdd={idHeadSchoolAdd}
      show={modalAdd} onHide={() => setModalAdd(false)} />}
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

    <div style={{ alignItems: "center", backgroundColor:"#3272B3", padding:"3px 10px", color:"#FFFFFF", fontWeight:"bold", fontSize:"12px"}}>
      <Row style={{display:"flex"}}>
        <Col xl='4' sm='12'> 
          NIP&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {getData?.nip_ypi_karyawan === null ? getData?.nip_ypi : getData?.nip_ypi_karyawan}
        </Col>
        <Col xl='8' sm='12'>
          NO. ID FINGER   : {getData?.id_finger}
        </Col>
      </Row>
      <Row style={{display:"flex"}}>
        <Col xl='4' sm='12'> 
          NAMA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;: {getData?.full_name}
        </Col>
        <Col xl='8' sm='12'>
          APPROVAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {getData?.name_head_school}
        </Col>
      </Row>
    </div>
      
    <Col xl='12' sm='12'> 
    <div>
      <div style={{ display: "block", height: "100%", overflowY: "auto", overflowX: "auto", width:"100%" }}>
        <div>
          <table className="table is-bordered">
            <thead>
            <tr style={{backgroundColor: isTabletOrMobile? "#A8CBFF" : "#A8CBFF", lineHeight: "1" }}>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", 
                    color: "#525252", border: "1px solid #E1E1E1", alignContent:"center",
                    position: "sticky", left: "0px", zIndex: 3, backgroundColor: isScrolled? "#A8CBFF":"#A8CBFF" }}>NO</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", 
                    color: "#525252", border: "1px solid #E1E1E1", alignContent:"center",
                    position: "sticky", left: "30px", zIndex: 3, backgroundColor: isScrolled? "#A8CBFF":"#A8CBFF"}}>TANGGAL</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>HARI</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>JADWAL KERJA</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>ABSEN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center"  }}>DURASI HADIR</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>DATANG LAMBAT</th>
                <th colSpan={2} rowSpan={2} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>PULANG CEPAT</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>ABSEN 1X</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>KEHADIRAN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>KETERANGAN</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>CATATAN HADIR DIHARI LIBUR</th>
                <th rowSpan={3} style={{ fontFamily: "revert", fontSize: "11px", textAlign: "center", color: "#525252", border: "1px solid #E1E1E1", alignContent:"center" }}>FORM KOREKSI ABSEN</th>
              </tr>
            <tr>
            </tr>
            <tr style={{backgroundColor: isTabletOrMobile? "#A8CBFF" : "#A8CBFF", lineHeight: "1"}}>
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
          <tbody style={{
            //  backgroundColor: getData?.fg_active === 0 ? "#FF6262" : "transparent",
            //  color: getData?.fg_active === 0 ? "white" : "black",
          }}>
            {getData?.date_range.map((d, index) => {
                const currentDate = new Date(d.date);
                let actionContent = <td style={{textAlign:"center",wordWrap:"break-word",minWidth:"120px",maxWidth: "120px"}}></td>;
                if (d.attendance_daily !== null) {
                  const { approve_hr, approve_head_school } = d.attendance_daily;
                  if(approve_hr === 1 && approve_head_school === 1) {
                    actionContent = <td style={{textAlign:"center",wordWrap:"break-word",minWidth:"120px",maxWidth:"120px"}}>Disetujui</td>;
                  }else if (approve_hr === 0 && approve_head_school === 1) {
                    actionContent = <td style={{textAlign:"center",wordWrap:"break-word",minWidth:"120px",maxWidth:"120px"}}>Proses Hr</td>;
                  }else if (approve_hr === 0 && approve_head_school === 0) {
                    actionContent = <td style={{textAlign:"center",wordWrap:"break-word",minWidth:"120px",maxWidth:"120px"}}>Proses Kepsek</td>;
                  }else if(currentDate >= sixDaysAgo && currentDate <= today) {
                    actionContent = <td style={{textAlign:"center",wordWrap:"break-word",minWidth:"120px",maxWidth:"120px"}}></td>;
                  }}
                return (
                  <tr key={index} style={{fontFamily: "sans-serif",fontSize: "11px",textAlign: "center",lineHeight: "0.5",
                      // backgroundColor: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === null ? "#FF6262" : 
                      backgroundColor: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "#FF6262" : 
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "#FF6262" :
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "#FF6262" :
                      "transparent",
                      // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                      color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      "black",
                    }}>
                    <td style={{ minWidth: "20px", textAlign: "center", alignContent:"center",alignItems:"center",
                      position: "sticky", left: "0px",zIndex: 2, backgroundColor: 
                      // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                      d.day === "Sabtu" || d.day === "Minggu"|| d.day_libur === 1  ? "#FF6262" 
                      : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                      ? "#FF6262" 
                      : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                      ? "#FF6262" 
                      : "#fff", 
                      // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                      color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      "black",
                      zIndex: 1 }}>{index + 1}</td>
                    <td style={{ minWidth: "120px", textAlign: "center", alignContent:"center" ,
                      position: "sticky", left: "30px",zIndex: 2, 
                      backgroundColor: 
                      // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                      d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1  ? "#FF6262" 
                      : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                      ? "#FF6262" 
                      : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                      ? "#FF6262" 
                      : "#fff",
                      // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                      color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                      "black",
                      zIndex: 1 }}><FormatHolidayDate props={d.date}/></td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center",
                        backgroundColor: 
                        // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                        d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1  ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : "#ECECEC",
                        // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                        color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        "black",
                       }}>{d.day}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center",
                        backgroundColor: 
                        // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                        d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1  ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : "#ECECEC",
                        // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                        color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        "black",
                       }}>{d.in_schedule}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center",
                        backgroundColor: 
                        // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                        d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1  ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                        ? "#FF6262" 
                        : "#ECECEC",
                        // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                        color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                        "black",
                       }}>{d.out_schedule}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.start_time}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.end_time}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center",
                          backgroundColor: 
                          // d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 
                          d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1  ? "#FF6262" 
                          : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                          ? "#FF6262" 
                          : d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 
                          ? "#FF6262" 
                          : "#ECECEC",
                          // color: d.day === "Sabtu" || d.day === "Minggu" || getData?.fg_active === 0 ? "white" : 
                          color: d.day === "Sabtu" || d.day === "Minggu" || d.day_libur === 1 ? "white" : 
                          d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "1" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                          d?.attendance_daily !== null && d?.attendance_daily?.absent_type === "2" && d?.attendance_daily?.approve_hr === 1 && d?.attendance_daily?.approve_head_school === 1 ? "white" :
                          "black",
                       }}>{d.duration_attendance}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.arrive_five_minutes === 1 ? "Telat" : ""}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.arrive_five_minutes === 2 ? "Telat" : ""}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.late_five_minutes === 1 ? "Cepat" : ""}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.late_five_minutes === 2 ? "Cepat" : ""}</td>
                      <td style={{ width: "80px", textAlign: "center",alignContent:"center" }}>{d.absen_1x === 1? "Ya":""}</td>
                      <td style={{ width: "30px", textAlign: "center",alignContent:"center" }}>
                      {d.kehadiran === 1? "1" : d.kehadiran === "1"? "sakit" : d.kehadiran === "2"? "izin" : "0"}
                      </td>
                      <td style={{lineHeight: "1",textAlign: "center",wordWrap: "break-word",minWidth:"150px",maxWidth: "350px", 
                      }}>
                      {d.day_libur === 0 ? (
                          <>
                            <div>
                              {d.attendance_daily !== null ? (
                                d.attendance_daily.absent_type === "3" || d.attendance_daily.absent_type === "3_hr" ? "Masuk/Pulang" :
                                d.attendance_daily.absent_type === "4" || d.attendance_daily.absent_type === "4_hr" ? "Izin Datang Siang" :
                                d.attendance_daily.absent_type === "5" || d.attendance_daily.absent_type === "5_hr" ? "Izin Pulang Cepat" :
                                d.attendance_daily.absent_type === "6" ? "Dinas Dalam Kota/Training" :
                                d.attendance_daily.absent_type === "7" ? "Dinas/Training Online" :
                                d.attendance_daily.absent_type === "8" ? "Dinas Luar Kota" :
                                d.attendance_daily.absent_type === "9" || d.attendance_daily.absent_type === "9_hr" ? "Dinas Dalam Kampus" :
                                d.attendance_daily.absent_type === "10" || d.attendance_daily.absent_type === "10_hr" ? "Shalat Subuh Berjamaah" :
                                ""
                              ) : ""}
                            </div>
                            <div>
                              {d.attendance_daily !== null ? d.attendance_daily.keterangan : ""}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td style={{lineHeight: "1",textAlign: "center",wordWrap: "break-word",minWidth:"150px",maxWidth: "350px"}}>
                        {d.day_libur === 1 ? (
                          <>
                            <div>
                              {d.attendance_daily !== null ? (
                                d.attendance_daily.absent_type === "3" || d.attendance_daily.absent_type === "3_hr" ? "Masuk/Pulang" :
                                d.attendance_daily.absent_type === "4" || d.attendance_daily.absent_type === "4_hr" ? "Izin Datang Siang" :
                                d.attendance_daily.absent_type === "5" || d.attendance_daily.absent_type === "5_hr" ? "Izin Pulang Cepat" :
                                d.attendance_daily.absent_type === "6" ? "Dinas Dalam Kota/Training" :
                                d.attendance_daily.absent_type === "7" ? "Dinas/Training Online" :
                                d.attendance_daily.absent_type === "8" ? "Dinas Luar Kota" :
                                d.attendance_daily.absent_type === "9" || d.attendance_daily.absent_type === "9_hr" ? "Dinas Dalam Kampus" :
                                d.attendance_daily.absent_type === "10" || d.attendance_daily.absent_type === "10_hr" ? "Shalat Subuh Berjamaah" :
                                ""
                              ) : ""}
                            </div>
                            <div>
                              {d.attendance_daily !== null ? d.attendance_daily.keterangan : ""}
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      {actionContent}
                    </tr>
                  );
                })}
                            
              {/* <tr style={{fontFamily: "sans-serif", fontSize: "11px", textAlign: "center", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>1</td>
                <td style={{ width:"80px", alignContent:"center" }}>16/10/2024</td>
                <td style={{ width:"80px", alignContent:"center" }}>Rabu</td>
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
                  <button onClick={() => viewModalAdd()} style={{padding:"7px 15px", fontSize: "11px", color: "", backgroundColor: "#FFF921",
                    border:"1px solid #FFC400", borderRadius: "3px", cursor: "pointer" }}>
                    Form
                  </button>
                </td>
              </tr> */}    
            </tbody>
            <tfoot>
              <tr style={{  backgroundColor: "#f8f9fa",lineHeight: "0.1", fontFamily: "sans-serif",fontSize: "11px",color:"#FF6666" }}>
                <td colSpan="7" style={{ textAlign: "right" }}>Total : </td>
                <td style={{ textAlign: "center" }}></td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_datang_kurang_5_menit}</td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_datang_lebih_5_menit}</td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_pulang_kurang_5_menit}</td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_pulang_lebih_5_menit}</td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_absen_1x}</td>
                <td style={{ textAlign: "center",color:"#FF6666" }}>{getData?.total_kehadiran}</td>
                <td colSpan="5"></td>
              </tr>
            </tfoot>
          </table>
            
            </div>
          </div>
      </div>
    </Col>

    {/* <Col xl='4' sm='12'> 
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
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Hadir Libur</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Tidak Hadir</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Absen 1X</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Datang -5</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr> <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Datang +5</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Plg Cepat -5</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Plg Cepat +5</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>
              <tr style={{fontFamily: "sans-serif", fontSize: "11px", lineHeight:"0.1"}}>
                <td style={{ width:"20px", alignContent:"center"}}>Hari Efektif</td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
                <td style={{ width:"80px", alignContent:"center" }}></td>
              </tr>

              
              
                 
              </tbody>
            </table>
              
          </div>
          </div>
            </div>
        
        </Col>     */}
        </div>
  );
}
