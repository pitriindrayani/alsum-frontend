import {  useState, useEffect, useRef } from "react";
import { Form,Input,Label,Button,CardText,CardTitle,FormFeedback,UncontrolledTooltip} from 'reactstrap'
import { APIUS } from "../../../config/apius";
import { FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APIUS.get(`/api/privileges/roles?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    id_role: "",
    username: "",
    password: "",
    email: "",
    level: "",
    unique_id: "",
    firstname: "",
    lastname: "",
    address: "",
    phone_number: "",
    birth_place: "",
    birth_day: "",
    gender: "",
    day_birth: "",
    month_birth: "",
    year_birth: "",
    ysb_branch_id:""
  });

  const {
    id_role,
    username,
    password,
    email,
    level,
    unique_id,
    firstname,
    lastname,
    address,
    phone_number,
    birth_place,
    birth_day,
    gender,
    day_birth,
    month_birth,
    year_birth,
    ysb_branch_id
  } = form;

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };

  useEffect(() => {
    if (props.show) {
      nameInputRef.current.focus(); 
    }
  },[])

  useEffect(() => {
    if (form?.id_role) {
        const selectedRole = getData.find(role => role.id === form.id_role);
        setForm(prevForm => ({
            ...prevForm,
            ysb_branch_id: selectedRole ? selectedRole.ysb_branch_id : ""
        }));
    }
}, [form?.id_role, getData]);

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
    
      // Insert data for login process
      const response = await APIUS.post("/api/privileges/users/store", {
        id_role: form?.id_role,
        username: form?.username,
        password: form?.password,
        email: form?.email,
        level: form?.level,
        unique_id: form?.unique_id,
        firstname: form?.firstname,
        lastname: form?.lastname,
        address: form?.address,
        phone_number: form?.phone_number,
        birth_place: form?.birth_place,
        birth_day: form?.year_birth && form?.month_birth && form?.day_birth?  `${form?.year_birth}-${form?.month_birth}-${form?.day_birth}` : "",
        gender: form?.gender,
        ysb_branch_id: form?.ysb_branch_id
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
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        <h5>Tambah User</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
        <div >
            <div>
              <label className="label-form" >Level </label>
              <select className="select-form" ref={nameInputRef}  aria-label="Default select example" onChange={handleChange} name="level" >
                <option value="" hidden>Pilih Level..</option>
                <option value="user">User</option>
                <option value="developer">Developer</option>
              </select>
            </div>
        </div>

        {form?.level !== "developer" && form?.level !== "" ?
        <div className="mt-2 mb-2">
            <div>
              <label className="label-form" >Role </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="id_role" className="select-form" >
                <option value="" hidden>Pilih Role..</option>
                {getData?.map((user,index) => (
                  <option value={user?.id} >{user?.name}</option>
                ))}         
              </select>
            </div>
          </div>:""}

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama
            </label>
            <input className="label-input-form" autoFocus type='text' name="username" onChange={handleChange} value={username}  
              placeholder='Masukan nama'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Email
            </label>
            <input  className="label-input-form" autoFocus type='email' name="email" onChange={handleChange} value={email}  
              placeholder='Masukan Email' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Password
            </label>
            <input className="label-input-form" autoFocus type='password' name="password" onChange={handleChange} value={password}  
              placeholder='***********' />
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
  