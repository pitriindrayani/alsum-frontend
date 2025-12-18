import { useEffect, useRef, useState } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaBan, FaEdit, FaPlug, FaPlus, FaSave, FaTimes, FaTrash } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import axios from "axios";
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
  
  const [getRoleTeacher, setGetRoleTeacher] = useState([]);
  const [getTeacherSchool, setGetTeacherSchool] = useState([]);
  const [getPositionSchool, setGetPositionSchool] = useState([]);
  const [getEducationalSTageSchool, setGetEducationalSTageSchool] = useState([]);
  const [getBranchesSchool, setGetBranchesSchool] = useState([]);
  const [getSchool, setGetSchool] = useState([]);
  const [getSchedules, setGetSchedules] = useState([]);
  const [getTeacherGroup, setGetTeacherGroup] = useState([]);
  const storageLevel = localStorage.getItem('level');
  const storageBranch = localStorage.getItem('ysb_branch_id');

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [formStatusList, setFormStatusList] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formStatus, setFormStatus] = useState({
    id: "",
    ysb_id_teacher: "",
    nip_ypi: "",
    status_code: "",
    date: ""
  });

  const [form, setForm] = useState({
    id_role: "",
    nip_ypi: "",
    nip_ypi_karyawan:"",
    nik_ysb: "",
    join_date_ypi: "",
    join_date_ysb: "",
    full_name: "",
    nik_ktp: "",
    birthplace: "",
    birthdate: "",
    gender: "",
    employment_status: "",
    ysb_branch_id: "",
    edu_stage: "",
    ysb_school_id: "",
    ysb_position_id: "",
    // ysb_schedule_id: "",
    bidang: "",
    ysb_teacher_group_id: "",
    religion: "",
    addrees: "",
    dom_address: "",
    marriage: "",
    npwp: "",
    ptkp: "",
    university: "",
    major: "",
    degree: "",
    mobile: "",
    email: "",
    password: "",
    bank: "",
    nama_rekening: "",
    no_rekening: "",
    contact_name: "",
    contact_relation: "",
    contact_number: "",
    nuptk: "",
    user_id: "",
    zakat: "",
    fg_active: "",
    finger_id: ""
  });

  const {
    id_role,
    nip_ypi,
    nip_ypi_karyawan,
    nik_ysb,
    join_date_ypi,
    join_date_ysb,
    full_name,
    nik_ktp,
    birthplace,
    birthdate,
    gender,
    employment_status,
    ysb_branch_id,
    edu_stage,
    ysb_school_id,
    ysb_position_id,
    // ysb_schedule_id,
    bidang,
    ysb_teacher_group_id,
    religion,
    addrees,
    dom_address,
    marriage,
    npwp,
    ptkp,
    university,
    major,
    degree,
    mobile,
    email,
    password,
    bank,
    nama_rekening,
    no_rekening,
    contact_name,
    contact_relation,
    contact_number,
    nuptk,
    user_id,
    zakat,
    fg_active,
    finger_id
  } = form;

  const fetchDataRef = useRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [roleTeacher, teacher,position,educationalSTage, branches, school, schedules, teacherGroup, teacherStatusRecord] = await axios.all([
        API.get(`/api/role-teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/teacher-status?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/positions?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/educational-stages?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/schedules?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/teacher-groups?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)
      ]);

      if (roleTeacher.status === 200 && teacher.status === 200 && position.status === 200 && educationalSTage.status === 200 && branches.status === 200
        && school.status === 200 && schedules.status === 200 && teacherGroup.status === 200
      ){
        setGetRoleTeacher(roleTeacher.data.data)
        setGetTeacherSchool(teacher.data.data)
        setGetPositionSchool(position.data.data)
        setGetEducationalSTageSchool(educationalSTage.data.data)
        setGetBranchesSchool(branches.data.data)
        setGetSchool(school.data.data)
        setGetSchedules(schedules.data.data)
        setGetTeacherGroup(teacherGroup.data.data)
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

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/api/teachers/store", {
        id_role: form?.id_role,
        nip_ypi: form?.nip_ypi,
        nip_ypi_karyawan: form?.nip_ypi_karyawan,
        nik_ysb: form?.nik_ysb,
        join_date_ypi: form?.join_date_ypi,
        join_date_ysb: form?.join_date_ysb,
        full_name: form?.full_name,
        nik_ktp: form?.nik_ktp,
        birthplace: form?.birthplace,
        birthdate: form?.birthdate,
        gender: form?.gender,
        employment_status: form?.employment_status,
        ysb_branch_id: form?.ysb_branch_id,
        edu_stage: form?.edu_stage,
        ysb_school_id: form?.ysb_school_id,
        ysb_position_id: form?.ysb_position_id,
        // ysb_schedule_id: form?.ysb_schedule_id,
        bidang: form?.bidang,
        ysb_teacher_group_id: form?.ysb_teacher_group_id,
        religion: form?.religion,
        addrees: form?.addrees,
        dom_address: form?.dom_address,
        marriage: form?.marriage,
        npwp: form?.npwp,
        ptkp: form?.ptkp,
        university: form?.university,
        major: form?.major,
        degree: form?.degree,
        mobile: form?.mobile,
        email: form?.email,
        password: form?.password,
        bank: form?.bank,
        nama_rekening: form?.nama_rekening,
        no_rekening: form?.no_rekening,
        contact_name: form?.contact_name,
        contact_relation: form?.contact_relation,
        contact_number: form?.contact_number,
        nuptk: form?.nuptk,
        user_id: form?.user_id,
        zakat: form?.zakat,
        fg_active: form?.fg_active,
        finger_id: form?.finger_id,
        array_status : formStatusList
      }, fetchParams);
      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
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

  const handleChangeStatus = (index, e) => {
    const { name, value } = e.target;
    const updatedList = [...formStatusList];
    updatedList[index][name] = value;
    setFormStatusList(updatedList);
  };

  const handleAddRow = () => {
    const newRow = {
      id: "",
      ysb_id_teacher: props?.dataUpdate?.id || "",
      nip_ypi: "",
      status_code: "",
      date: ""
    };
    setFormStatusList(prev => [...prev, newRow]);
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
    setIsAdding(false);
    setFormStatus({
      id: "",
      ysb_id_teacher: "",
      nip_ypi: "",
      status_code: "",
      date: ""
    });
  };

  const handleCancelRow = (index) => {
    const updatedList = [...formStatusList];
    updatedList.splice(index, 1);
    setFormStatusList(updatedList);
  };

  return (
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Tambah Guru
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
        <div className="mt-2" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select autoFocus aria-label="Default select example"  onChange={handleChange}  name="id_role" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Pilih Role</option>
                {getRoleTeacher.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                ))}         
              </select>
            </div>
          </div>
          
          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              NIP YPI Kontrak
            </label>
            <input  type='text' name="nip_ypi" onChange={handleChange} value={nip_ypi}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              NIP YPI Karyawan
            </label>
            <input  type='text' name="nip_ypi_karyawan" onChange={handleChange} value={nip_ypi_karyawan}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}
          
          <table className="table dt-responsive nowrap w-100 mt-4" id="basic-datatable">
            <thead>
              <tr style={{ backgroundColor: "white", borderBottom: "1px solid rgb(214, 214, 214)" }}>
                <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none" }}>NIP YPI</th>
                <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none" }}>STATUS</th>
                <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none" }}>TANGGAL</th>
                <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center" }}>ACTION</th>
              </tr>
            </thead>
          <tbody>
            {formStatusList.map((form, index) => (
              <tr key={index} style={{ fontFamily: "Poppins", fontSize: "11px", textAlign: "left" }}>
                <td>
                  <input
                    type="text"
                    name="nip_ypi"
                    value={form.nip_ypi}
                    onChange={(e) => handleChangeStatus(index, e)}
                    placeholder="...."
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #9bcbffff",
                      outline: "none",
                      color: "#2e649d",
                      width: "100%",
                      height: "30px",
                      borderRadius: "5px"
                    }}
                  />
                </td>
                <td>
                  <select
                    name="status_code"
                    value={form.status_code}
                    onChange={(e) => handleChangeStatus(index, e)}
                    style={{
                      color: "#2e649d",
                      cursor: "pointer",
                      border: "2px solid #9bcbffff",
                      width: "100%",
                      height: "30px",
                      borderRadius: "5px"
                    }}
                  >
                    <option value="" hidden>Status ..</option>
                    {getTeacherSchool.map((status, idx) => (
                      <option key={idx} value={status.status_code}>
                        {status.status} ({status.status_code})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={(e) => handleChangeStatus(index, e)}
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #9bcbffff",
                      width: "100%",
                      height: "30px",
                      borderRadius: "5px"
                    }}
                  />
                </td>
                <td style={{ textAlign: "center" }}>
                  <FaBan
                    onClick={() => handleCancelRow(index)}
                    style={{ cursor: "pointer", color: "#dc3545", fontSize: "15px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        
          <div style={{ display: "flex", justifyContent: "" }}>
            <Button color="primary" onClick={handleAddRow} style={{ padding: "3px 5px", fontSize: "12px", borderRadius: "5px" }}>
              <FaPlus style={{ marginRight: "3px"}}/>Add
            </Button>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              NIK YSB
            </label>
            <input type='text' name="nik_ysb" onChange={handleChange} value={nik_ysb}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Id Finger
            </label>
            <input type='text' name="finger_id" onChange={handleChange} value={finger_id}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
             Email
            </label>
            <input type='email' name="email" onChange={handleChange} value={email}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
             Password
            </label>
            <input type='password' name="password" onChange={handleChange} value={password}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" style={{display: 'flex', alignItems: 'center',  backgroundColor: 'transparent', cursor: 'pointer', height: "42px"}}>
          <label style={{ backgroundColor: '#fff', color: '#2e649d', padding: '0 5px', fontSize: '15px' }}>
            Fg Active :
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Radio button for TRUE */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="radio" name="fg_active" value="1" checked={form?.fg_active === '1'} onChange={handleChange} style={{ cursor: 'pointer' }}/>
              Aktif
            </label>

            {/* Radio button for FALSE */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="radio" name="fg_active" value="0" checked={form?.fg_active === '0'} onChange={handleChange} style={{ cursor: 'pointer' }} />
              Tidak Aktif
            </label>
          </div>
          <style>{`input::placeholder { color: #B9B9B9;}`}</style>
        </div>


        <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Masuk YPI
            </label>
          <input type="date" name="join_date_ypi" onChange={handleChange} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>

        <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Masuk YSB
            </label>
          <input type="date" name="join_date_ysb" onChange={handleChange} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>


          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Nama
            </label>
            <input type='text' name="full_name" onChange={handleChange} value={full_name}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Nik Ktp
            </label>
            <input type='text' name="nik_ktp" onChange={handleChange} value={nik_ktp}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Tempat Lahir
            </label>
            <input type='text' name="birthplace" onChange={handleChange} value={birthplace}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Lahir
            </label>
          <input type="date" name="birthdate" onChange={handleChange} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>

          <div className="mt-2" style={{display: 'flex', alignItems: 'center',  backgroundColor: 'transparent', cursor: 'pointer', height: "42px"}}>
          <label style={{ backgroundColor: '#fff', color: '#2e649d', padding: '0 5px', fontSize: '15px' }}>
            Jenkel :
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Radio button for TRUE */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="radio" name="gender" value="1" checked={form?.gender === '1'} onChange={handleChange} style={{ cursor: 'pointer' }}/>
              Pria
            </label>

            {/* Radio button for FALSE */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input type="radio" name="gender" value="0" checked={form?.gender === '0'} onChange={handleChange} style={{ cursor: 'pointer' }} />
              Wanita
            </label>
          </div>
          <style>{`input::placeholder { color: #B9B9B9;}`}</style>
        </div>

        <div className="mt-2" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="employment_status" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Status Kepegawainan ..</option>
                {getTeacherSchool.map((user,index) => (
                  <option value={user?.status_code} style={{textAlign:""}}>{user?.status} ({user?.status_code})</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_position_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Kode UKK ..</option>
                {getPositionSchool.map((user,index) => (
                  <option value={user?.position_code} style={{textAlign:""}}>{user?.position_code}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Bidang
            </label>
            <input type='text' name="bidang" onChange={handleChange} value={bidang}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="edu_stage" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Jenjang ..</option>
                {getEducationalSTageSchool.map((user,index) => (
                  <option value={user?.stages} style={{textAlign:""}}>{user?.stages}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select  aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Cabang ..</option>
                {getBranchesSchool.map((user,index) => (
                  <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Sekolah ..</option>
                {getSchool.map((user,index) => (
                  <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                ))}         
              </select>
            </div>
          </div>

          {/* <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_schedule_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Jadwal Jam Kerja ..</option>
                {getSchedules.map((user,index) => (
                  <option value={user?.schedule_code} style={{textAlign:""}}>{user?.schedule_code}</option>
                ))}         
              </select>
            </div>
          </div> */}

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_teacher_group_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Golongan ..</option>
                {getTeacherGroup.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.rank_code}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="religion" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Agama ..</option>
                <option value="islam">ISLAM ..</option>          
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Alamat KTP
            </label>
            <input type='text' name="addrees" onChange={handleChange} value={addrees}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Alamat Domisili
            </label>
            <input type='text' name="dom_address" onChange={handleChange} value={dom_address}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select  aria-label="Default select example"  onChange={handleChange}  name="marriage" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Status Pernikahan ..</option>
                <option value="lajang">Lajang ..</option>
                <option value="menikah">Menikah ..</option>
                <option value="duda">Duda ..</option>
                <option value="janda">Janda ..</option>
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Npwp
            </label>
            <input type='text' name="npwp" onChange={handleChange} value={npwp}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              PTKP
            </label>
            <input type='text' name="ptkp" onChange={handleChange} value={ptkp}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="degree" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Pendidikan Terakhir ..</option>
                <option value="SMA">SMA..</option>
                <option value="DIPLOMA">DIPLOMA..</option>
                <option value="S1">S1..</option>
                <option value="S2">S2..</option>
                <option value="S3">S3..</option>
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Universitas
            </label>
            <input type='text' name="university" onChange={handleChange} value={university}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              No Handphone
            </label>
            <input type='text' name="mobile" onChange={handleChange} value={mobile}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              BANK
            </label>
            <input type='text' name="bank" onChange={handleChange} value={bank}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              No Rekening
            </label>
            <input type='text' name="no_rekening" onChange={handleChange} value={no_rekening}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Nama Rekening
            </label>
            <input type='text' name="nama_rekening" onChange={handleChange} value={nama_rekening}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Nama (Kontak Darurat)
            </label>
            <input type='text' name="contact_name" onChange={handleChange} value={contact_name}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Hubungan (Kontak Darurat)
            </label>
            <input type='text' name="contact_relation" onChange={handleChange} value={contact_relation}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
             Nomor Telp (Kon. Darurat)
            </label>
            <input type='text' name="contact_number" onChange={handleChange} value={contact_number}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange}  name="zakat" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Potongan Zakat..</option>
                <option value="1">IYA..</option>
                <option value="0">TIDAK..</option>
              </select>
            </div>
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
  