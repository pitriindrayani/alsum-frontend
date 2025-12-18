import { useEffect, useRef, useState } from "react";
import { Form, Button, Col, Row } from 'reactstrap';
import { APIUS } from "../../../../../../config/apius";
import { APIMS } from "../../../../../../config/apims";
import { FaBan,FaPlus } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalGuruAdd(props) {
  const token = localStorage.getItem("token");
  
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  // Data 
  const [getDataRoleTeacher, setGetDataRoleTeacher] = useState([]); 
  const [getDataStatusTeacher, setGetDataStatusTeacher] = useState([]); 
  const [getDataKodeUkkTeacher, setGetDataKodeUkkTeacher] = useState([]);
  const [getDataJenjang, setGetDataJenjang] = useState([]);
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacherGroup, setGetDataTeacherGroup] = useState([]);

  // Page
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [editingRowId, setEditingRowId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formStatus, setFormStatus] = useState({
    id: "",
    ysb_id_teacher: "",
    nip_ypi: "",
    status_code: "",
    date: ""
  });

  const storageLevel = localStorage.getItem('level');
  const storageBranch = localStorage.getItem('ysb_branch_id');

  const [formStatusList, setFormStatusList] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  // const fetchDataRef = useRef();

  const GetResponseDataRoleTeacher = async () => {
    const response = await APIUS.get(`/api/role-teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams)
    
    setGetDataRoleTeacher(response.data.data)
  }

  const GetResponseDataStatusTeacher = async () => {
    const response = await APIUS.get(`/api/teacher-status?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)
    
    setGetDataStatusTeacher(response.data.data)
  }

  const GetResponseKodeUkkTeacher = async () => {
    const response = await APIUS.get(`/api/positions?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)
    
    setGetDataKodeUkkTeacher(response.data.data)
  }

  const GetResponseDataJenjang = async () => {
    const response = await APIMS.get(`/api/educational-stages?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)
    
    setGetDataJenjang(response.data.data)
  }

  const GetResponseDataCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)
    
    setGetDataCabang(response.data.data)
  }

  const GetResponseDataSchool = async () => {
    const response = await  APIMS.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams)

    setGetDataSchool(response.data.data)
  }

  const GetResponseDataTeacherGroup = async () => {
    const response = await APIUS.get(`/api/teacher-groups?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams)


    setGetDataTeacherGroup(response.data.data)
  }

  useEffect(() => {
      GetResponseDataRoleTeacher();
      GetResponseDataStatusTeacher();
      GetResponseKodeUkkTeacher();
      GetResponseDataJenjang();
      GetResponseDataCabang();
      GetResponseDataSchool();
      GetResponseDataTeacherGroup();
  }, [])

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
      const response = await APIUS.post("/api/teachers/store", {
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
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false} scrollable >  

      <div className="d-flex header-modal">
        <h5>Tambah Guru</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
        <div>
              <label className="label-form" >Pilih Role </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="id_role" className="select-form" >
                <option value="" hidden>Pilih Role..</option>
                {getDataRoleTeacher.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                ))}         
              </select>
        </div>

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
                        {getDataStatusTeacher.map((status, idx) => (
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

          <Row className="mt-2">
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                NIK YSB
                </label>
                <input  className="label-input-form" type='text' name="nik_ysb" onChange={handleChange} value={nik_ysb}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Id Finger
                </label>
                <input  className="label-input-form" type='text' name="finger_id" onChange={handleChange} value={finger_id}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Email
                </label>
                <input  className="label-input-form" type='email' name="email" onChange={handleChange} value={email}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Password
                </label>
                <input  className="label-input-form" type='password' name="password" onChange={handleChange} value={password}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
          </Row>

          <div className="mt-2" style={{display: 'flex', alignItems: 'center',  backgroundColor: 'transparent', cursor: 'pointer', height: "42px"}}>
            <label style={{ backgroundColor: '#fff', color: '#2e649d', padding: '0 5px', fontSize: '15px' }}>
              Fg Active :
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
            
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" name="fg_active" value="1" checked={form?.fg_active === '1'} onChange={handleChange} style={{ cursor: 'pointer' }}/>
                Aktif
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" name="fg_active" value="0" checked={form?.fg_active === '0'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                Tidak Aktif
              </label>
            </div>
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <Row>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Tanggal Masuk YPI
                </label>
                 <input type="date" name="join_date_ypi" onChange={handleChange} placeholder="...." 
                  onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                  width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Tanggal Masuk YSB
                </label>
                 <input type="date" name="join_date_ysb" onChange={handleChange} placeholder="...." onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Nama
                </label>
                <input  className="label-input-form" type='text' name="full_name" onChange={handleChange} value={full_name}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 NIK KTP
                </label>
                <input  className="label-input-form" type='text' name="nik_ktp" onChange={handleChange} value={nik_ktp}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md='6'>
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Tempat Lahir
                </label>
                <input  className="label-input-form" type='text' name="birthplace" onChange={handleChange} value={birthplace}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Tanggal Lahir
                </label>
                 <input type="date" name="birthdate" onChange={handleChange} placeholder="...." onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
          </Row>

          <div className="mt-2" style={{display: 'flex', alignItems: 'center',  backgroundColor: 'transparent', cursor: 'pointer', height: "42px"}}>
            <label style={{ backgroundColor: '#fff', color: '#2e649d', padding: '0 5px', fontSize: '15px' }}>
              Jenis Kelamin :
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
             
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" name="gender" value="1" checked={form?.gender === '1'} onChange={handleChange} style={{ cursor: 'pointer' }}/>
                Pria
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="radio" name="gender" value="0" checked={form?.gender === '0'} onChange={handleChange} style={{ cursor: 'pointer' }} />
                Wanita
              </label>
            </div>
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <Row className="mt-2">
            <Col md="6">
              <label className="label-form" >Status Kepegawaian </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="employment_status" className="select-form" >
                <option value="" hidden>Status Kepegawainan..</option>
                {getDataStatusTeacher.map((user,index) => (
                  <option value={user?.status_code} style={{textAlign:""}}>{user?.status} ({user?.status_code})</option>
                ))}         
              </select>
            </Col>
            <Col md="6">
              <label className="label-form" >Kode UKK </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_position_id" className="select-form" >
                <option value="" hidden>Kode UKK..</option>
                {getDataKodeUkkTeacher.map((user,index) => (
                  <option value={user?.position_code} style={{textAlign:""}}>{user?.position_code}</option>
                ))}        
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Jenjang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="edu_stage" className="select-form" >
                <option value="" hidden>Jenjang..</option>
                {getDataJenjang.map((user,index) => (
                  <option value={user?.stages} style={{textAlign:""}}>{user?.stages}</option>
                ))}        
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" className="select-form" >
                <option value="" hidden>Cabang..</option>
                {getDataCabang.map((user,index) => (
                  <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                ))}        
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Sekolah </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" className="select-form" >
                <option value="" hidden>Sekolah..</option>
                {getDataSchool.map((user,index) => (
                  <option value={user?.school_code} style={{textAlign:""}}>{user?.school_code}</option>
                ))}        
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Golongan </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_teacher_group_id" className="select-form" >
                <option value="" hidden>Golongan..</option>
                {getDataTeacherGroup.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.rank_code}</option>
                ))}       
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Agama </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="religion" className="select-form" >
                <option value="" hidden>Agama..</option>
                <option value="islam">ISLAM ..</option>       
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Status Pernikahan </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="marriage" className="select-form" >
                <option value="" hidden>Status Pernikahan..</option>
                <option value="lajang">Lajang ..</option>
                <option value="menikah">Menikah ..</option>
                <option value="duda">Duda ..</option>
                <option value="janda">Janda ..</option> 
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Pendidikan Terakhir </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="degree" className="select-form" >
                <option value="" hidden>Pendidikan Terakhir..</option>
                <option value="SMA">SMA..</option>
                <option value="DIPLOMA">DIPLOMA..</option>
                <option value="S1">S1..</option>
                <option value="S2">S2..</option>
                <option value="S3">S3..</option>
              </select>
            </Col>
            <Col md="6" className="mt-2">
              <label className="label-form" >Potongan Zakat </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="zakat" className="select-form" >
                <option value="" hidden>Potongan Zakat..</option>
                <option value="1">IYA..</option>
                <option value="0">TIDAK..</option>
              </select>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Bidang
                </label>
                <input  className="label-input-form" type='text' name="bidang" onChange={handleChange} value={bidang}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Alamat KTP
                </label>
                <input  className="label-input-form" type='text' name="addrees" onChange={handleChange} value={addrees}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Alamat Domisili
                </label>
                <input  className="label-input-form" type='text' name="dom_address" onChange={handleChange} value={dom_address}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Npwp
                </label>
                <input  className="label-input-form" type='text' name="npwp" onChange={handleChange} value={npwp}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  PTKP
                </label>
                <input  className="label-input-form" type='text' name="ptkp" onChange={handleChange} value={ptkp}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Universitas
                </label>
                <input  className="label-input-form" type='text' name="university" onChange={handleChange} value={university}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  No Handphone
                </label>
                <input  className="label-input-form" type='text' name="mobile" onChange={handleChange} value={mobile}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 BANK
                </label>
                <input  className="label-input-form" type='text' name="bank" onChange={handleChange} value={bank}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 No Rekening
                </label>
                <input  className="label-input-form" type='text' name="no_rekening" onChange={handleChange} value={no_rekening}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Nama Rekening
                </label>
                <input  className="label-input-form" type='text' name="nama_rekening" onChange={handleChange} value={nama_rekening}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Nama (Kontak Darurat)
                </label>
                <input  className="label-input-form" type='text' name="contact_name" onChange={handleChange} value={contact_name}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Hubungan (Kontak Darurat)
                </label>
                <input  className="label-input-form" type='text' name="contact_relation" onChange={handleChange} value={contact_relation}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Nomor Telp (Kon. Darurat)
                </label>
                <input  className="label-input-form" type='text' name="contact_number" onChange={handleChange} value={contact_number}  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}</style>
              </div>
            </Col>
          </Row>

          {/* <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
            <div>
              <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
                Tambahkan
              </Button>
            </div>
          </div> */}
            <div className="d-flex">
              <div className="ml-auto">
                <Button className="mt-4 btn-modal-create" type='submit'>
                  Tambahkan
                </Button>
              </div>
            </div>


        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  