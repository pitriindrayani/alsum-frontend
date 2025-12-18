import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ModalListCheckPointUpdate(props) {
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
    const response = await API.get(`/master-service/educational-stages?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    stages: "",
    stages_name: "",
    seq: "",
    min_grade : "",
    max_grade: ""
  });

  useEffect(() => {
    setForm({
    ...form,
      stages: safeValue(props?.dataUpdate?.stages),
      stages_name: safeValue(props?.dataUpdate?.stages_name),
      seq: safeValue(props?.dataUpdate?.seq),
      min_grade: safeValue(props?.dataUpdate?.min_grade),
      max_grade: safeValue(props?.dataUpdate?.max_grade),
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
      const response = await API.put(`/master-service/educational-stages/${props.id}`, {
        stages: form?.stages,
        stages_name: form?.stages_name,
        seq: form?.seq,
        min_grade: form?.min_grade,
        max_grade: form?.max_grade
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
            <h5>Update Jenjang</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Ruangan
            </label>
            <input className="label-input-form" autoFocus type='text' name="stages" onChange={handleChange} value={form?.stages}   
              placeholder='...'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Lantai
            </label>
            <input  className="label-input-form"  type='text' name="stages_name" onChange={handleChange} value={form?.stages_name}
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Gedung
            </label>
            <input  className="label-input-form"  type='number' name="seq" onChange={handleChange} value={form?.seq}
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
             Cabang
            </label>
            <input  className="label-input-form"  type='number' name="seq" onChange={handleChange} value={form?.seq}
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

        <div className="d-flex">
          <div className="ml-auto">
            <Button className="mt-4 btn-modal-create" type='submit'>
              Update
            </Button>
          </div>
        </div>
        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  