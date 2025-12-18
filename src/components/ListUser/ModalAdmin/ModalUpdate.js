import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderAction";
import "../../../index.css";
import ToastError from "../../NotificationToast/ToastError";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await API.get(`/api/privileges/roles?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
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
    gender: "",
  });

  useEffect(() => {
    setForm({
    ...form,
      id_role: safeValue(props?.dataUpdate?.id_role),
      username: safeValue(props?.dataUpdate?.username),
      email: safeValue(props?.dataUpdate?.email),
      level: safeValue(props?.dataUpdate?.level),
      gender: safeValue(props?.dataUpdate?.gender),
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
      const response = await API.put(`/api/privileges/users/${props.id}`, {
        id_role: form?.id_role,
        username: form?.username,
        password: form?.password,
        email: form?.email,
        level: form?.level,
        gender: form?.gender
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
            <h5>Update User</h5>
        
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
              <select className="select-form" ref={nameInputRef}  aria-label="Default select example" onChange={handleChange}  name="level"  value={form?.level}>
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
              <select aria-label="Default select example"  onChange={handleChange}  name="id_role"  value={form?.id_role} className="select-form" >
                <option value="" hidden>Pilih Role..</option>
                {getData.map((user,index) => (
                  <option value={user?.id} >{user?.name}</option>
                ))}         
              </select>
            </div>
          </div>:""}

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama
            </label>
            <input className="label-input-form" autoFocus type='text' name="username" onChange={handleChange} value={form?.username}   
              placeholder='Masukan nama'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Email
            </label>
            <input  className="label-input-form" autoFocus type='email' name="email" onChange={handleChange} value={form?.email}
              placeholder='Masukan Email' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Password
            </label>
            <input className="label-input-form" autoFocus type='password' name="password" onChange={handleChange} value={form?.password}
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
  