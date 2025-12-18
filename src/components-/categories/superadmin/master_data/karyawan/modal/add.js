import { useState, useEffect } from "react";
import { Form, Button } from 'reactstrap';
import { APIUS } from "../../../../../../config/apius";
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalKaryawanAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  // Data
  const [getCabang, setGetCabang] = useState([]);
  const [getDept, setGetDept] = useState([]);
  const [getRole, setGetRole] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetCabang(response.data.data);
  } 

  const GetResponseDept = async () => {
    const response = await APIUS.get(`/api/departments?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetDept(response.data.data);
  }

  const GetResponseRole = async () => {
    const response = await APIUS.get(`/api/privileges/roles?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetRole(response.data.data);
  }

  useEffect(() => {
      GetResponseCabang();
      GetResponseDept();
      GetResponseRole();
  }, [])

  const [form, setForm] = useState({
    nik: "",
    name: "",
    photo: "",
    email : "",
    password : "",
    jabatan: "",
    ysb_branch_id : "",
    ysb_department_id: "",
    id_role:""

  });

  const {
    nik,
    name,
    photo,
    email,
    password,
    jabatan,
    ysb_branch_id,
    ysb_department_id,
    id_role
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
      const response = await APIUS.post("/api/employes/store", {
        nik: form?.nik,
        name: form?.name,
        photo: form?.photo,
        email: form?.email,
        password: form?.password,
        jabatan: form?.jabatan,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_department_id: form?.ysb_department_id,
        id_role: form?.id_role
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

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" >  

      <div className="d-flex header-modal">
        <h5>Tambah Karyawan</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
        <Form onSubmit={(e) => handleSubmit.mutate(e)}  >

          <div className="mt-2" >
              <label className="label-form" >Cabang </label>
                <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" className="select-form" >
                  <option value="" hidden>Pilih Cabang..</option>
                  {getCabang.map((cabang,index) => (
                    <option value={cabang?.branch_code} >{cabang?.branch_name}</option>
                  ))}         
                </select>
            </div>

            <div className="mt-2">
              <label className="label-form" >Departement </label>
                <select aria-label="Default select example"  onChange={handleChange}  name="ysb_department_id" className="select-form" >
                  <option value="" hidden>Pilih Departement..</option>
                  {getDept.map((dept,index) => (
                    <option value={dept?.id} >{dept?.departemen}</option>
                  ))}         
                </select>
            </div>

            <div className="mt-2">
              <label className="label-form" >Role </label>
                <select aria-label="Default select example"  onChange={handleChange}  name="id_role" className="select-form" >
                  <option value="" hidden>Pilih Role..</option>
                  {getRole.map((role,index) => (
                    <option value={role?.id} >{role?.name}</option>
                  ))}         
                </select>
            </div>
        
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                NIK
              </label>
              <input className="label-input-form"  type='number' name="nik" onChange={handleChange} value={nik}  
                placeholder='NIK'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Nama
              </label>
              <input  className="label-input-form"  type='text' name="name" onChange={handleChange} value={name}  
                placeholder='Masukan Nama Sekolah' />
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Photo
              </label>
              <input  className="label-input-form"  type='file' name="photo" onChange={handleChange} value={photo}  
                placeholder='...'  />
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Email
              </label>
              <input  className="label-input-form"  type='email' name="email" onChange={handleChange} value={email}  
                placeholder='...'  />
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Password
              </label>
              <input  className="label-input-form"  type='password' name="password" onChange={handleChange} value={password}  
                placeholder='...'  />
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Jabatan
              </label>
              <input  className="label-input-form"  type='text' name="jabatan" onChange={handleChange} value={jabatan}  
                placeholder='...'  />
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>

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
  