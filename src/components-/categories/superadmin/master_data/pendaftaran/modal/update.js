import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APIUS } from "../../../../../../config/apius";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalPendaftaranUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APIUS.get(`/api/students?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    nik: "",
    nama_lengkap: "",
    kelas:"",
    tahun_ajaran: "",
    tahun_ajaran_pindahan: "",
    semester: "",
    email_murid: "",
    password:""
  });

  useEffect(() => {
    setForm({
    ...form,
      nik: safeValue(props?.dataUpdate?.nik),
      nama_lengkap: safeValue(props?.dataUpdate?.nama_lengkap),
      kelas: safeValue(props?.dataUpdate?.kelas),
      tahun_ajaran: safeValue(props?.dataUpdate?.tahun_ajaran),
      tahun_ajaran_pindahan: safeValue(props?.dataUpdate?.tahun_ajaran_pindahan),
      semester: safeValue(props?.dataUpdate?.semester),
      email_murid: safeValue(props?.dataUpdate?.email_murid),
      password: safeValue(props?.dataUpdate?.password),
    });
  },[props])

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
      const response = await APIUS.put(`/api/students/${props.id}`, {
        nik: form?.nik,
        nama_lengkap: form?.nama_lengkap,
        kelas: form?.kelas,
        tahun_ajaran: form?.tahun_ajaran,
        tahun_ajaran_pindahan: form?.tahun_ajaran_pindahan,
        semester: form?.semester,
        email_murid: form?.email_murid,
        password: form?.password,
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
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
      setLoading(false)
    }
  });

  return (
    <div className="modal">
      {loading && <LoaderAction/>}

      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static"
        keyboard={false} scrollable>  

        <div className="d-flex header-modal">
            <h5>Update Siswa</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
        <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nomor Induk
            </label>
            <input className="label-input-form"  type='text' name="nik" onChange={handleChange} value={form?.nik}   
              placeholder='..'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Siswa
            </label>
            <input  className="label-input-form"  type='text' name="nama_lengkap" onChange={handleChange} value={form?.nama_lengkap}
              placeholder='..' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Kelas
            </label>
            <input  className="label-input-form"  type='text' name="kelas" onChange={handleChange} value={form?.kelas}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Tahun Ajaran
            </label>
            <input  className="label-input-form"  type='text' name="tahun_ajaran" onChange={handleChange} value={form?.tahun_ajaran}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Tahun Ajaran Pindahan
            </label>
            <input  className="label-input-form"  type='text' name="tahun_ajaran_pindahan" onChange={handleChange} value={form?.tahun_ajaran_pindahan}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

           <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Semester
            </label>
            <input  className="label-input-form"  type='text' name="semester" onChange={handleChange} value={form?.semester}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Email
            </label>
            <input  className="label-input-form"  type='email' name="email_murid" onChange={handleChange} value={form?.email_murid}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Password
            </label>
            <input  className="label-input-form"  type='password' name="password" onChange={handleChange} value={form?.password}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="d-flex">
            <div className="ml-auto">
              <Button className="mt-4 btn-modal-create" type='submit'>
                Perbarui
              </Button>
            </div>
          </div>
        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  