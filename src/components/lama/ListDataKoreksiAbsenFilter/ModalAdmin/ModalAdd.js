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
import { Description } from "@material-ui/icons";
import Select from 'react-select'; 

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [getDataTeacherAbsen, setGetDataTeacherAbsen] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedTeachers((prev) => 
      prev.includes(id) ? prev.filter(teacherId => teacherId !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (isAllChecked) {
      setSelectedTeachers([]); 
    } else {
      setSelectedTeachers(getDataTeacher.map((teacher) => teacher.id));
    }
    setIsAllChecked(!isAllChecked);
  };
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const [isCheckMulti, setIsCheckMulti] = useState(false); 
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
  
  const toggleSwitchPuasa = () => {
    setIsCheckMulti(prevState => !prevState);
  };

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "multipart/form-data"}
  };

  // upload file
  const [selectedFile, setSelectedFile] = useState(null); 
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file); 
    }
  };

  // select search data guru
  const [selectKey, setSelectKey] = useState(0);
  const [selectKeyDiagnosa, setSelectKeyDiagnosa] = useState(0);

  const resetSelect = () => {
    setSelectKey(prevKey => prevKey + 1); 
    setSelectKeyDiagnosa(prevKey => prevKey + 1); 
  };

   const [form, setForm] = useState({
      id_head_school        : "",
      ysb_teacher_id        : "",
      ysb_branch_id         : "",
      ysb_school_id         : "",
      id_user_head_school   : "",
      id_user_hr            : "",
      approve_hr            : "",
      approve_head_school   : "",
      att_date              : "",
      att_clock_in          : "",
      att_clock_out         : "",
      schedule_in           : "",
      schedule_out          : "",
      late_min              : "",
      early_min             : "",
      absent_type           : "",
      tipe_koreksi          : "",
      keterangan            : "",
      kjm                   : "",
      ket1                  : "",
      telat_kurang_5        : "",
      telat_lebih_5         : "",
      pulang_kurang_5       : "",
      pulang_lebih_5        : "",
      jumlah_waktu          : "",
      jam_lembur            : "",
      absen1                : "",
      fg_locked             : "",
      dokument              : "",
      in_time               : "",
      in_time_hours         : "",
      in_time_minute        : "",
      in_time_second        : "",
      out_time              : "",
      out_time_hours        : "",
      out_time_minute       : "",
      out_time_second       : "",
      total_koreksi_absen   : ""
    });
    // console.log(form)

  const GetResponseDataBranch = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`,fetchParams)

      // Checking proses  
      if (response?.status === 200) {
        setGetDataBranch(response.data.data)
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
      setLoading(true)
      const response = await API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form?.ysb_branch_id}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetDataSchool(response.data.data)
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
      const response = await API.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)

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

  const GetResponseDataTeacherAbsen = async () => {
    try {
      // setLoading(true)

      const response = await API.get('/api/attendance-trxs/date', {
        params: {
          ysb_teacher_id: form?.ysb_teacher_id,
          att_date: form?.date_in
        },
        ...fetchParams // jika `fetchParams` berisi headers, auth, dsb
      });

      if (response?.status === 200) {
        setGetDataTeacherAbsen(response.data.data)
      }
      // setLoading(false)
    } catch (error) {
      // setLoading(false)
      swal({
        title: 'Failed',
        text: `${error?.response?.data?.message || 'Terjadi kesalahan'}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };

  const handleInputChange2 = (e) => {
    setForm({
      ...form,
      ysb_teacher_id: e.value,
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
          in_time_hours     : "00",
          in_time_minute    : "00",
          in_time_second    : "00",
          out_time_hours    : "00",
          out_time_minute   : "00",
          out_time_second   : "00",
          tipe_koreksi : "masuk_pulang"
        });
      }
    }, [form?.absent_type])
  
    useEffect(() => {
      if(form?.absent_type === 4 || form?.absent_type === "4" || form?.absent_type === "4_hr"){
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
      if(form?.absent_type === 5 || form?.absent_type === "5" || form?.absent_type === "5_hr"){
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
      if(form?.absent_type === 6 || form?.absent_type === "6"){
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
      if(form?.absent_type === 7 || form?.absent_type === "7"){
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
      if(form?.absent_type === 8 || form?.absent_type === "8"){
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
      if(form?.absent_type === 9 || form?.absent_type === "9" || form?.absent_type === "9_hr"){
        setForm({
          ...form, 
          in_time_hours     : "00",
          in_time_minute    : "00",
          in_time_second    : "00",
          out_time_hours    : "00",
          out_time_minute   : "00",
          out_time_second   : "00",
          tipe_koreksi      : "masuk_pulang_kampus"
        });
      }
    }, [form?.absent_type])

     useEffect(() => {
      if(form?.absent_type === 10 || form?.absent_type === "10" || form?.absent_type === "10_hr"){
        setForm({
          ...form, 
          in_time_hours     : "00",
          in_time_minute    : "00",
          in_time_second    : "00",
          out_time_hours    : "00",
          out_time_minute   : "00",
          out_time_second   : "00",
          tipe_koreksi      : "masuk_pulang_shalat"
        });
      }
    }, [form?.absent_type])

    useEffect(() => {
      GetResponseDataBranch()
    },[])

    useEffect(() => {
      if(form?.ysb_branch_id){
        GetResponseDataSchool()
      }
    }, [form?.ysb_branch_id])

    useEffect(() => {
      if(form?.ysb_school_id){
          GetResponseDataTeacher()
      }
    }, [form?.ysb_school_id])

    useEffect(() => {
    if(form?.ysb_teacher_id && form?.date_in){
        GetResponseDataTeacherAbsen()
    }
    }, [form?.ysb_teacher_id && form?.date_in])

 useEffect(() => {
  if (getDataTeacherAbsen) {
    // Fungsi pembantu untuk mendapatkan jam, menit, detik dari waktu
    const getTimePart = (time, partIndex) => {
      if (time && typeof time === 'string' && time.includes(':')) {
        return time.split(':')[partIndex] || '00';
      }
      return '00';
    };

    // Fungsi untuk menentukan waktu berdasarkan prioritas
    const getTimeValue = (source, field, backupField, form) => {
      // Jika absent_type adalah "1" (izin) atau "2" (sakit), kembalikan "00:00:00"
      if (form?.absent_type === "1" || form?.absent_type === "2") {
        return "00:00:00";
      }

      // Prioritas 1: start_time atau end_time
      if (source === 'start' && getDataTeacherAbsen.start_time) {
        return getDataTeacherAbsen.start_time;
      }
      if (source === 'end' && getDataTeacherAbsen.end_time) {
        return getDataTeacherAbsen.end_time;
      }

      // Prioritas 2: jadwal_shift.time_in atau jadwal_shift.time_out
      if (getDataTeacherAbsen.jadwal_shift && typeof getDataTeacherAbsen.jadwal_shift === 'object') {
        return source === 'start' ? getDataTeacherAbsen.jadwal_shift[field] : getDataTeacherAbsen.jadwal_shift[backupField];
      }

      // Prioritas 3: periode.period_start_puasa atau periode.period_end_puasa
      if (getDataTeacherAbsen.periode && typeof getDataTeacherAbsen.periode === 'object') {
        if (source === 'start' && getDataTeacherAbsen.periode.period_start_puasa) {
          return getDataTeacherAbsen.periode.period_start_puasa;
        }
        if (source === 'end' && getDataTeacherAbsen.periode.period_end_puasa) {
          return getDataTeacherAbsen.periode.period_end_puasa;
        }
        // Prioritas 4: periode.in_time atau periode.out_time
        return source === 'start' ? getDataTeacherAbsen.periode[field] : getDataTeacherAbsen.periode[backupField];
      }

      return null;
    };

    // Ambil waktu untuk in_time dan out_time
    const inTime = getTimeValue('start', 'in_time', 'time_in', form);
    const outTime = getTimeValue('end', 'out_time', 'time_out', form);

    setForm({
      ...form,
      in_time_hours: getTimePart(inTime || "00:00:00", 0),
      in_time_minute: getTimePart(inTime || "00:00:00", 1),
      in_time_second: getTimePart(inTime || "00:00:00", 2),
      out_time_hours: getTimePart(outTime || "00:00:00", 0),
      out_time_minute: getTimePart(outTime || "00:00:00", 1),
      out_time_second: getTimePart(outTime || "00:00:00", 2),
      in_time: inTime || "00:00:00",
      out_time: outTime || "00:00:00",
    });
  }
}, [getDataTeacherAbsen]);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/api/attendance-dailys-filter/hr/store", {
        date_in: form?.date_in,
        date_out: isCheckMulti === false? form?.date_in : form?.date_out,
        // array_id_teacher: selectedTeachers,
        ysb_teacher_id : form?.ysb_teacher_id,
        id_user_head_school: form?.id_head_school,
        id_user_hr: form?.id_user_hr,
        approve_hr: form?.approve_hr,
        approve_head_school: form?.approve_head_school,
        in_time : form?.in_time,
        out_time : form?.out_time,
        att_clock_in: `${form?.in_time_hours}:${form?.in_time_minute}:${form?.in_time_second}`,
        att_clock_out: `${form?.out_time_hours}:${form?.out_time_minute}:${form?.out_time_second}`,
        schedule_in: form?.schedule_in,
        total_koreksi: form?.total_koreksi_absen,
        schedule_out: form?.schedule_out,
        late_min: form?.late_min,
        early_min: form?.early_min,
        absent_type: form?.absent_type,
        tipe_koreksi: form?.tipe_koreksi,
        keterangan: form?.keterangan,
        kjm: form?.kjm,
        ket1: form?.ket1,
        telat_kurang_5: form?.telat_kurang_5,
        telat_lebih_5: form?.telat_lebih_5,
        pulang_kurang_5: form?.pulang_kurang_5,
        pulang_lebih_5: form?.pulang_lebih_5,
        jumlah_waktu: form?.jumlah_waktu,
        jam_lembur: form?.jam_lembur,
        absen1: form?.absen1,
        fg_locked: form?.fg_locked,
        dokument: selectedFile      
      }, fetchParams);
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
          Tambah Koreksi
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="" >
        <div style={{display:"flex"}}>
        <div style={{display:"flex", justifyContent:"start"}}> 
            <div className="mr-1" style={{display:"flex", alignItems:"center", fontSize:"15px", fontWeight:"bold", fontStyle:"revert"}}>
              Multi Tanggal
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
              <label className="toggle-switch">
                <input type="checkbox" checked={isCheckMulti} onChange={toggleSwitchPuasa} />
                <span className="switch"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{ display:"flex", width:"100%"}}>
            <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" style={{color:"#2e649d", textAlign:"", 
              cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
              <option value="" hidden>&nbsp;Cabang..</option>
              {getDataBranch.map((user,index) => (
                <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
              ))}         
            </select>
          </div>
        </div>

        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{ display:"flex", width:"100%"}}>
            <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" style={{color:"#2e649d", textAlign:"", 
              cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
              <option value="" hidden>&nbsp;Sekolah..</option>
              {getDataSchool.map((user,index) => (
                <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
              ))}         
            </select>
          </div>
        </div>
      
          <Select className="mt-3" key={selectKey} name="ysb_teacher_id" onChange={handleInputChange2}
            options={getDataTeacher.map(user => ({
              value: user.id,
              label: `${user.full_name}`,
              color: '#2e649d'
            }))}
            placeholder="Guru..." styles={{
              control: (base) => ({
                ...base,
                color:"#2e649d",cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"
              }),
              menu: (base) => ({
                ...base,
                marginTop: 0,
              }),
              singleValue: (base, state) => ({
                ...base,
                color: "#2e649d",  
              }),
              dropdownIndicator: (base) => ({
                ...base,
                color: '#2e649d', // ubah warna ikon
              }),

              placeholder: (base) => ({
                ...base,
                color: "#2e649d",  
              }),
              option: (provided, state) => ({
                ...provided,
                color: state.data.color,  
                backgroundColor: state.isSelected ? (state.data.color === 'white' ? 'white' : 'white') : 'white',
              }),
            }}
          />

        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{ display:"flex", width:"100%"}}>
            <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange} value={form?.absent_type}  name="absent_type" style={{color:"#2e649d", textAlign:"", 
              cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
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
                    <option value="10_hr">Shalat Subuh Berjamaah</option> 
            </select>
          </div>
        </div>

        {isCheckMulti === false ? 
          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
              border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
              <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                  padding: '0 5px', fontSize: '15px' }}>
                  Tanggal
              </label>
            <input type="date" name="date_in" onChange={handleChange} value={form?.date_in} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                cursor:"pointer"}}/>
            <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>
          :
          <>
            <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
              border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
              <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                  padding: '0 5px', fontSize: '15px' }}>
                  Tanggal Awal
              </label>
            <input type="date" name="date_in" onChange={handleChange} value={form?.date_in} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                cursor:"pointer"}}/>
            <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>

          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
              border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
              <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                  padding: '0 5px', fontSize: '15px' }}>
                  Tanggal Akhir
              </label>
            <input type="date" name="date_out" onChange={handleChange} value={form?.date_out} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                cursor:"pointer"}}/>
            <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>
          </>
        }

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

        {form?.absent_type === "6" || form?.absent_type === "7" || form?.absent_type === "8" || form?.absent_type === "9_hr" || form?.absent_type === "9" || form?.absent_type === "10_hr" || form?.absent_type === "10"?
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
                Tambahkan
              </Button>
            </div>
          </div>
        </Form>
        
      </Modal.Body>
      {/* <Modal.Footer>
        <div style={{ display: "flex" }}>
          <Button onClick={props.onHide} style={{marginRight:"8px"}}>Close</Button>
        </div>
      </Modal.Footer> */}
   
    </Modal>
    </div>
   
    );
}
  