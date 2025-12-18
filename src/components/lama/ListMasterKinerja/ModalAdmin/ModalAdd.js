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
    console.log(form)

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
    const getTimeValue = (source, field, backupField) => {
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
    const inTime = getTimeValue('start', 'in_time', 'time_in');
    const outTime = getTimeValue('end', 'out_time', 'time_out');

    setForm({
      ...form,
      in_time_hours: getTimePart(inTime, 0),
      in_time_minute: getTimePart(inTime, 1),
      in_time_second: getTimePart(inTime, 2),
      out_time_hours: getTimePart(outTime, 0),
      out_time_minute: getTimePart(outTime, 1),
      out_time_second: getTimePart(outTime, 2),
      in_time: getDataTeacherAbsen?.start_time === null? "" : getDataTeacherAbsen?.start_time,
      out_time: getDataTeacherAbsen?.out_time === null? "" : getDataTeacherAbsen?.out_time,
    });
  }
}, [getDataTeacherAbsen]);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/api/attendance-dailys/hr/store", {
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
          Tambah 
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)}>
        <div className="" style={{ display: "flex"}}>
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

        <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Kinerja
            </label>
            <input type='text' name="keterangan" onChange={handleChange} value={form?.keterangan}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
        </div>
        
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
  