import { useEffect, useRef, useState } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaArrowAltCircleUp, FaTimes } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import Swal from "sweetalert2";

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const rolesData = JSON.parse(localStorage.getItem('roles')) || [];

  const filteredRolesHr = rolesData.filter(role => 
     ['hr_makassar', 'hr_serpong', 'hr_bekasi', 'hr_bandung', 'hr'].includes(role.slug_name)
  );

 const fetchParams = {
  headers: {
    Authorization: `${token}`
    // Content-Type akan otomatis diset oleh Axios jika pakai FormData
  }
};

  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file); 
    }
  };

  const [form, setForm] = useState({
    att_date              : "",
    att_clock_in          : "",
    att_clock_out         : "",
    schedule_in           : "",
    schedule_out          : "",
    absent_type           : "",
    keterangan            : "",
    dokument              : "",
    in_time               : "",
    in_time_hours         : "",
    in_time_minute        : "",
    in_time_second        : "",
    out_time              : "",
    out_time_hours        : "",
    out_time_minute       : "",
    out_time_second       : "",
    tipe_koreksi          : "",
    total_koreksi_absen   : "",
    telat_kurang_5 : "",
    telat_lebih_5 : "",
    pulang_kurang_5 : "",
    pulang_lebih_5 : "",
    });

  useEffect(() => {
    setForm({
      ...form, 
      att_date              : `${props?.dataUpdate?.att_date}`,
      absent_type           : `${props?.dataUpdate?.absent_type}`,
      total_koreksi_absen   : `${props?.dataUpdate?.total_koreksi === null? "" : props?.dataUpdate?.total_koreksi}`,
      tipe_koreksi          : `${props?.dataUpdate?.tipe_koreksi === null? "" : props?.dataUpdate?.tipe_koreksi}`,
      att_clock_in          : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in}`,
      att_clock_out         : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out}`,
      in_time               : `${props?.dataUpdate?.in_time === null? "" : props?.dataUpdate?.in_time}`,
      in_time_hours         : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
      in_time_minute        : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
      in_time_second        : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
      out_time              : `${props?.dataUpdate?.out_time === null? "" : props?.dataUpdate?.out_time}`,
      out_time_hours        : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
      out_time_minute       : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
      out_time_second       : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
      schedule_in           : `${props?.dataUpdate?.schedule_in === null? "" : props?.dataUpdate?.schedule_in}`,
      schedule_out          : `${props?.dataUpdate?.schedule_out === null? "" : props?.dataUpdate?.schedule_out}`,
      dokument              : `${props?.dataUpdate?.dokument === null? "" : props?.dataUpdate?.dokument}`,
      keterangan            : `${props?.dataUpdate?.keterangan === null? "" : props?.dataUpdate?.keterangan}`,
      telat_kurang_5        : `${props?.dataUpdate?.telat_kurang_5 === null? "" : props?.dataUpdate?.telat_kurang_5}`,
      telat_lebih_5         : `${props?.dataUpdate?.telat_lebih_5 === null? "" : props?.dataUpdate?.telat_lebih_5}`,
      pulang_kurang_5       : `${props?.dataUpdate?.pulang_kurang_5 === null? "" : props?.dataUpdate?.pulang_kurang_5}`,
      pulang_lebih_5        : `${props?.dataUpdate?.pulang_lebih_5 === null? "" : props?.dataUpdate?.pulang_lebih_5}`,
    });
    setFileName(props?.dataUpdate?.dokument?.split("/").pop() || "");
  }, [props])

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };       
  
  useEffect(() => {
    if(form?.absent_type === 1 || form?.absent_type === "1"){
      setForm({
        ...form, 
        in_time_hours     : "00",
        in_time_minute    : "00",
        in_time_second    : "00",
        out_time_hours    : "00",
        out_time_minute   : "00",
        out_time_second   : "00",
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 2 || form?.absent_type === "2"){
      setForm({
        ...form, 
        in_time_hours     : "00",
        in_time_minute    : "00",
        in_time_second    : "00",
        out_time_hours    : "00",
        out_time_minute   : "00",
        out_time_second   : "00",
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 3 || form?.absent_type === "3" || form?.absent_type === "3_hr"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi :  `${props?.dataUpdate?.tipe_koreksi === null? "masuk_pulang" : props?.dataUpdate?.tipe_koreksi}`
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 4 || form?.absent_type === "4" || form?.absent_type === "4_hr"){
      setForm({
        ...form, 
       in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])
  
  useEffect(() => {
    if(form?.absent_type === 5 || form?.absent_type === "5" || form?.absent_type === "5_hr"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 6 || form?.absent_type === "6"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 7 || form?.absent_type === "7"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 8 || form?.absent_type === "8"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi      : ""
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 9 || form?.absent_type === "9" || form?.absent_type === "9_hr"){
      setForm({
        ...form, 
       in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi :  `${props?.dataUpdate?.tipe_koreksi === null? "masuk_pulang_kampus" : props?.dataUpdate?.tipe_koreksi}`
      });
    }
  }, [form?.absent_type])

  useEffect(() => {
    if(form?.absent_type === 10 || form?.absent_type === "10" || form?.absent_type === "10_hr"){
      setForm({
        ...form, 
        in_time_hours     : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[0]}`,
        in_time_minute    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[1]}`,
        in_time_second    : `${props?.dataUpdate?.att_clock_in === null? "" : props?.dataUpdate?.att_clock_in.split(':')[2]}`,
        out_time_hours    : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[0]}`,
        out_time_minute   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[1]}`,
        out_time_second   : `${props?.dataUpdate?.att_clock_out === null? "" : props?.dataUpdate?.att_clock_out.split(':')[2]}`,
        tipe_koreksi :  `${props?.dataUpdate?.tipe_koreksi === null? "masuk_pulang_shalat" : props?.dataUpdate?.tipe_koreksi}`
      });
    }
  }, [form?.absent_type])

    const handleSubmit = useMutation(async (e) => {
    console.log("Form sebelum kirim:", form);
    if ((form?.absent_type === "3" || form?.absent_type === "3_hr") && form?.total_koreksi_absen > 1 && form?.tipe_koreksi === "masuk_pulang") {
      Swal.fire(
        'Pilih Jam Masuk / Keluar yang ingin dikoreksi',
        'Mohon Periksa',
        'warning'
    );
      return null;
    }

    if (form?.keterangan === "") {
        Swal.fire(
          'Keterangan wajib di isi',
          'Mohon Periksa',
          'warning'
      );
        return null;
      }

    if ((form?.absent_type === "9" || form?.absent_type === "9_hr") && (form?.total_koreksi_absen > 1 && form?.total_koreksi_absen < 3) && form?.tipe_koreksi === "masuk_pulang_kampus" &&
        (form?.pulang_kurang_5 === "1" || (form?.in_time === "" && form?.out_time === "") || (form?.in_time !== "" && form?.out_time === "") || (form?.in_time === "" && form?.out_time !== ""))
    ){
      Swal.fire(
        'Pilih Jam Masuk / Keluar yang ingin dikoreksi',
        'Mohon Periksa',
        'warning'
    );
      return null;
    }
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
     // Gunakan FormData
    const formData = new FormData();
    formData.append("absent_type", form?.absent_type || "");
    formData.append("att_clock_in", `${form?.in_time_hours}:${form?.in_time_minute}:${form?.in_time_second}`);
    formData.append("att_clock_out", `${form?.out_time_hours}:${form?.out_time_minute}:${form?.out_time_second}`);
    formData.append("keterangan", form?.keterangan || "");
    formData.append("tipe_koreksi", form?.tipe_koreksi || "");

    if (selectedFile) {
      formData.append("dokument", selectedFile);
    }

    const response = await API.post(`/api/attendance-dailys-filter/${props.id}?_method=PUT`, formData, {
      headers: {
        Authorization: `${token}`,
      },
    });

      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
        setSelectedFile(null);
        setFileName("");
        props.GetResponseData();
        props.onHide();
        setLoading(false)
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 10000,
        buttons: false
      });
      setLoading(false)
    }
  });
 
  return (
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Koreksi Absen
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="" >
          <div className="" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange} value={form?.absent_type}  name="absent_type" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                  {filteredRolesHr.length > 0 ?
                  <>
                    <option value="" hidden>Jenis Absensi ..</option>
                    <option value="1">Sakit</option>
                    <option value="2">Izin</option>
                    <option value="3">Masuk/Pulang</option>       
                    <option value="3_hr">Masuk/Pulang - Tanpa Kuota</option>       
                    <option value="4">Izin Datang Siang</option>
                    <option value="4_hr">Izin Datang Siang - Tanpa Kuota</option>
                    <option value="5">Izin Pulang Cepat</option>
                    <option value="5_hr">Izin Pulang Cepat - Tanpa Kuota</option>
                    <option value="6">Dinas Dalam Kota / Training</option>
                    <option value="7">Dinas/Training Online</option>
                    <option value="8">Dinas Luar Kota</option>  
                    <option value="9">Dinas Dalam Kampus</option>
                    <option value="9_hr">Dinas Dalam Kampus - Tanpa Kuota</option>
                    <option value="10">Shalat Subuh Berjamaah</option>
                  </>
                  :
                  <>
                    <option value="" hidden>Jenis Absensi ..</option>
                    <option value="1">Sakit</option>
                    <option value="2">Izin</option>
                    <option value="3">Masuk/Pulang</option>       
                    <option value="4">Izin Datang Siang</option>
                    <option value="5">Izin Pulang Cepat</option>
                    <option value="6">Dinas Dalam Kota / Training</option>
                    <option value="7">Dinas/Training Online</option>
                    <option value="8">Dinas Luar Kota</option>  
                    <option value="9">Dinas Dalam Kampus</option>
                    <option value="10">Shalat Subuh Berjamaah</option>
                  </>
                  }
              </select>
            </div>
          </div>

          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#F3F3F3', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal
            </label>
          <input disabled type="date" name="holiday_date" value={form?.att_date} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: '#F3F3F3', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>
          
        {/* Kondisi sama dengan backend , */}
        {(form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "1"  && 
          form?.telat_lebih_5 === "0" && 
          form?.pulang_kurang_5 === "1" && 
          form?.pulang_lebih_5 === "0" && 
          form?.in_time !== "" && 
          form?.out_time !== "") 
         ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "1" && 
          form?.telat_lebih_5 === "0" &&
          form?.pulang_kurang_5 === "0" &&  
          form?.pulang_lebih_5 === "1" && 
          form?.in_time !== "" && 
          form?.out_time !== "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "1" &&
          form?.telat_lebih_5 === "0" && 
          form?.pulang_kurang_5 === "" && 
          form?.pulang_lebih_5 === "" &&
          form?.in_time !== "" && 
          form?.out_time === "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "" &&
          form?.telat_lebih_5 === "" && 
          form?.pulang_kurang_5 === "1" && 
          form?.pulang_lebih_5 === "0" &&
          form?.in_time === "" && 
          form?.out_time !== "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "" &&
          form?.telat_lebih_5 === "" && 
          form?.pulang_kurang_5 === "0" && 
          form?.pulang_lebih_5 === "1" &&
          form?.in_time === "" && 
          form?.out_time !== "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "" &&
          form?.telat_lebih_5 === "" && 
          form?.pulang_kurang_5 === "" && 
          form?.pulang_lebih_5 === "" &&
          form?.in_time === "" && 
          form?.out_time === "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "1" && 
          form?.pulang_kurang_5 === "1" && 
          form?.pulang_lebih_5 === "0" &&
          form?.in_time !== "" && 
          form?.out_time !== "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "1" && 
          form?.pulang_kurang_5 === "0" && 
          form?.pulang_lebih_5 === "1" &&
          form?.in_time !== "" && 
          form?.out_time !== "") 
          ||
         (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "1" && 
          form?.pulang_kurang_5 === "" && 
          form?.pulang_lebih_5 === "" &&
          form?.in_time !== "" && 
          form?.out_time === "") 
          // Kondisi jika ada salah satu yang wajib dipilih
          ||
        (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "0" && 
          form?.pulang_kurang_5 === "1" && 
          form?.pulang_lebih_5 === "0" &&
          form?.in_time !== "" && 
          form?.out_time !== "") 
          ||
        (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "0" && 
          form?.pulang_kurang_5 === "0" && 
          form?.pulang_lebih_5 === "1" &&
          form?.in_time !== "" && 
          form?.out_time !== "")
          || 
        (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "1" &&
          form?.telat_lebih_5 === "0" && 
          form?.pulang_kurang_5 === "0" && 
          form?.pulang_lebih_5 === "0" &&
          form?.in_time !== "" && 
          form?.out_time !== "") 
          || 
        (form?.absent_type === "3" && 
          form?.total_koreksi_absen > 1 && 
          form?.telat_kurang_5 === "0" &&
          form?.telat_lebih_5 === "1" && 
          form?.pulang_kurang_5 === "0" && 
          form?.pulang_lebih_5 === "0" &&
          form?.in_time !== "" && 
          form?.out_time !== "") 
         ?
          <>
            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Masuk
              </div>
              <div style={{display:'flex'}}>
                  <select disabled={form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"} 
                    className="mr-2" aria-label="Default select example"  onChange={handleChange} 
                    value={form?.in_time_hours}  name="in_time_hours" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"} 
                    aria-label="Default select example"  onChange={handleChange} value={form?.in_time_minute}  
                    name="in_time_minute" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.tipe_koreksi === "pulang" || form?.tipe_koreksi === "masuk_pulang"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>
                  
                  <div className="form-group mt-3 ml-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="tipe_koreksi" id="radioMasuk" value="masuk"
                        checked={form?.tipe_koreksi === 'masuk'} onChange={(e) => setForm({ ...form, tipe_koreksi: e.target.value })}
                        style={{cursor:"pointer"}}/>
                      <label className="form-check-label" htmlFor="radioMasuk">
                        {form?.tipe_koreksi === "masuk"? "":""}                    
                      </label>
                    </div>
                  </div>
              </div>
            </div>

            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Keluar
              </div>
              <div style={{  display: 'flex'}}>
                  <select disabled={form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"} 
                  className="mr-2" aria-label="Default select example"  onChange={handleChange}  value={form?.out_time_hours}
                  name="out_time_hours" style={{color:"#2e649d", textAlign:"center", 
                  cursor: form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"? "not-allowed" : "pointer", 
                  border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                  backgroundColor: form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"} 
                    aria-label="Default select example"  onChange={handleChange}  name="out_time_minute"  value={form?.out_time_minute}
                    style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",backgroundColor: 
                    form?.tipe_koreksi === "masuk" || form?.tipe_koreksi === "masuk_pulang"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>

                  <div className="form-group mt-3 ml-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="tipe_koreksi" id="radioPulang" value="pulang"
                        checked={form?.tipe_koreksi === 'pulang'} onChange={(e) => setForm({ ...form, tipe_koreksi: e.target.value })}
                        style={{cursor:"pointer"}}/>
                      <label className="form-check-label" htmlFor="radioPulang">
                        {form?.tipe_koreksi === "pulang"? "":""}
                      </label>
                    </div>
                  </div>
              </div>
            </div>
          </>
        :
        (form?.absent_type === "9" && 
          form?.total_koreksi_absen > 1 && 
          form?.in_time === "" && 
          form?.out_time !== "") 
          ||
        (form?.absent_type === "9" && 
          form?.total_koreksi_absen > 1 && 
          form?.in_time !== "" && 
          form?.out_time === "")
          ||
        (form?.absent_type === "9" && 
            form?.total_koreksi_absen > 1 && 
            form?.in_time === "" && 
            form?.out_time === "")
          ||
          (form?.absent_type === "9" && 
            form?.total_koreksi_absen > 1 && 
            form?.in_time !== "" && 
            form?.out_time !== "" &&
            form?.pulang_kurang_5 === "1")
          ?
          <>
            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Masuk
              </div>
              <div style={{display:'flex'}}>
                  <select disabled={form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2 } 
                    className="mr-2" aria-label="Default select example"  onChange={handleChange} 
                    value={form?.in_time_hours}  name="in_time_hours" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2 ? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2} 
                    aria-label="Default select example"  onChange={handleChange} value={form?.in_time_minute}  
                    name="in_time_minute" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.tipe_koreksi === "pulang_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>
                  
                  {form?.total_koreksi_absen > 2?
                  <></>
                  :
                  <div className="form-group mt-3 ml-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="tipe_koreksi" id="radioMasuk" value="masuk_kampus"
                        checked={form?.tipe_koreksi === 'masuk_kampus'} onChange={(e) => setForm({ ...form, tipe_koreksi: e.target.value })}
                        style={{cursor:"pointer"}}/>
                      <label className="form-check-label" htmlFor="radioMasuk">
                        {form?.tipe_koreksi === "masuk_kampus"? "":""}                    
                      </label>
                    </div>
                  </div>
                  }
                  
              </div>
            </div>

            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Keluar
              </div>
              <div style={{  display: 'flex'}}>
                  <select disabled={form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2} 
                  className="mr-2" aria-label="Default select example"  onChange={handleChange}  value={form?.out_time_hours}
                  name="out_time_hours" style={{color:"#2e649d", textAlign:"center", 
                  cursor: form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "not-allowed" : "pointer", 
                  border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                  backgroundColor: form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2} 
                    aria-label="Default select example"  onChange={handleChange}  name="out_time_minute"  value={form?.out_time_minute}
                    style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",backgroundColor: 
                    form?.tipe_koreksi === "masuk_kampus" || form?.tipe_koreksi === "masuk_pulang_kampus" || form?.total_koreksi_absen > 2? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>

                  {form?.total_koreksi_absen > 2?
                  <></>
                  :
                  <div className="form-group mt-3 ml-3">
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="tipe_koreksi" id="radioPulangKampus" value="pulang_kampus"
                        checked={form?.tipe_koreksi === 'pulang_kampus'} onChange={(e) => setForm({ ...form, tipe_koreksi: e.target.value })}
                        style={{cursor:"pointer"}}/>
                      <label className="form-check-label" htmlFor="radioPulangKampus">
                        {form?.tipe_koreksi === "pulang_kampus"? "":""}
                      </label>
                    </div>
                  </div>
                  }
                  
              </div>
            </div>
          </>
          : 
          <>
            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Masuk
              </div>
              <div style={{  display: 'flex'}}>
                  <select disabled={form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"} 
                    className="mr-2" aria-label="Default select example"  onChange={handleChange} 
                    value={form?.in_time_hours}  name="in_time_hours" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"} 
                    aria-label="Default select example"  onChange={handleChange} value={form?.in_time_minute}  
                    name="in_time_minute" style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                    backgroundColor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "5"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>
              </div>
            </div>

            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Keluar
              </div>
              <div style={{  display: 'flex'}}>
                  <select disabled={form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"} 
                  className="mr-2" aria-label="Default select example"  onChange={handleChange}  value={form?.out_time_hours}
                  name="out_time_hours" style={{color:"#2e649d", textAlign:"center", 
                  cursor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"? "not-allowed" : "pointer", 
                  border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",
                  backgroundColor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                  </select>
                  <select disabled={form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"} 
                    aria-label="Default select example"  onChange={handleChange}  name="out_time_minute"  value={form?.out_time_minute}
                    style={{color:"#2e649d", textAlign:"center", 
                    cursor: form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"? "not-allowed" : "pointer", 
                    border:"2px solid #2e649d",width:"20%", height:"45px", borderRadius:"5px",backgroundColor: 
                    form?.absent_type === "1" || form?.absent_type === "2" || form?.absent_type === "4"? "#e9ecef" : "#fff"}}>
                    <option value="00">00</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                    <option value="32">32</option>
                    <option value="33">33</option>
                    <option value="34">34</option>
                    <option value="35">35</option>
                    <option value="36">36</option>
                    <option value="37">37</option>
                    <option value="38">38</option>
                    <option value="39">39</option>
                    <option value="40">40</option>
                    <option value="41">41</option>
                    <option value="42">42</option>
                    <option value="43">43</option>
                    <option value="44">44</option>
                    <option value="45">45</option>
                    <option value="46">46</option>
                    <option value="47">47</option>
                    <option value="48">48</option>
                    <option value="49">49</option>
                    <option value="50">50</option>
                    <option value="51">51</option>
                    <option value="52">52</option>
                    <option value="53">53</option>
                    <option value="54">54</option>
                    <option value="55">55</option>
                    <option value="56">56</option>
                    <option value="57">57</option>
                    <option value="58">58</option>
                    <option value="59">59</option>
                  </select>
              </div>
            </div>
          </> 
          } 

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Catatan
            </label>
            <input type='text' name="keterangan" onChange={handleChange} value={form?.keterangan}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          {form?.absent_type === "6" || form?.absent_type === "7" || form?.absent_type === "8" || form?.absent_type === "9" || form?.absent_type === "10" || form?.absent_type === "9_hr" || form?.absent_type === "10_hr" ?
          <div className="mt-3">
            <div style={{position: "relative",display: "flex",alignItems: "center",gap: "10px",backgroundColor: "#f1f1f1",
              borderRadius: "5px",padding: "5px",cursor: "pointer",border: "1px solid #ccc",width: "100%"}}>
              <label htmlFor="fileInput" style={{backgroundColor: "#2e649d",color: "#fff",padding: "5px 10px",
                borderRadius: "5px",fontSize: "14px",cursor: "pointer",fontWeight: "bold",whiteSpace: "nowrap"}}>
                <FaArrowAltCircleUp style={{marginRight:"5px"}}/>Upload Surat
              </label>
              <input type="file" name="keterangan" onChange={handleFileChange} id="fileInput" style={{ display: "none" }}/>
              <span style={{flex: 1,fontSize: "14px",color: "#818181",whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}>
                {fileName || "Pilih file..."}
              </span>
            </div>
          </div>:""} 

          <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
            <div>
              <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
                Simpan
              </Button>
            </div>
          </div>

        </Form>
      </Modal.Body>
    
    </Modal>
    </div>
   
    );
}
  