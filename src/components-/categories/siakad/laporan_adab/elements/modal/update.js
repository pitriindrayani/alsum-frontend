import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APILA } from "../../../../../../config/apila";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalElementUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  // Data
  const [getDimensi, setGetDimensi] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseDimensi = async () => {
      const response = await APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDimensi(response.data.data);
  }
  
  useEffect(() => {
    GetResponseDimensi();
  }, [])

  const [form, setForm] = useState({
    name_element: "",
    ysb_dimensi_id: "",
    description: "",
    output_id_user: "",
    user_id:"",
   
  });

  useEffect(() => {
    setForm({
    ...form,
      name_element: safeValue(props?.dataUpdate?.name_element),
      ysb_dimensi_id: safeValue(props?.dataUpdate?.ysb_dimensi_id),
      description: safeValue(props?.dataUpdate?.description),
      output_id_user: safeValue(props?.dataUpdate?.output_id_user),
      user_id: safeValue(props?.dataUpdate?.user_id),
      
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
      const response = await APILA.put(`/api/elements/${props.id}`, {
        name_element: form?.name_element,
        ysb_dimensi_id: form?.ysb_dimensi_id,
        description: form?.description,
        user_id: output_id_user,
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
            <h5>Update Element</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >

          <div className="mt-3">
              <label className="label-form" >Dimensi </label>
                <select aria-label="Default select example"  onChange={handleChange}  name="ysb_dimensi_id" value={form?.ysb_dimensi_id}  className="select-form" >
                  <option value="" hidden>Pilih Dimensi..</option>
                  {getDimensi.map((dimensi,index) => (
                    <option value={dimensi?.id} >{dimensi?.name_dimensi}</option>
                  ))}         
                </select>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Judul Element
            </label>
            <input className="label-input-form"  type='text' name="name_element" onChange={handleChange} value={form?.name_element}   
              placeholder='..'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

         {/* <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Judul
            </label>
            <input  className="label-input-form"  type='text' name="title" onChange={handleChange} value={form?.title}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kegiatan
            </label>
            <input  className="label-input-form"  type='text' name="description" onChange={handleChange} value={form?.description}  
              placeholder='...' />
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
  