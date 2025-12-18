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

export default function ModalRoleAdd(props) {
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

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    id_element: "",
    description: "",
    output_id_user: "",
    user_id:"",
   
  });

  useEffect(() => {
    setForm({
    ...form,
      id_element: safeValue(props?.data_update?.id_element),
      description: safeValue(props?.data_update?.description),
      output_id_user: safeValue(props?.data_update?.output_id_user),
      user_id: safeValue(props?.data_update?.user_id),
      
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
      const response = await APILA.put(`/api/sub-elements/${props.id}`, {
        id_element: form?.id_element,
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
        setLoading(false)
        props.onHide();
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
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" >  

        <div className="d-flex header-modal">
            <h5>Update</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" hidden >
            <label className="label-name-form">
              ID Element
            </label>
            <input className="label-input-form"  autoFocus type='text' name="id_element" onChange={handleChange} value={form?.id_element}   
              placeholder='Masukan Label Jenjang'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" >
            <label className="label-form" style={{fontSize:"16px"}} >Detail Kegiatan : </label>
            <textarea onChange={handleChange}  name="description" value={form?.description} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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
  