import {  useState } from "react";
import { Form,Button} from 'reactstrap';
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

export default function ModalKategoriAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    aplikasi: "",
    
  });

  const {
    aplikasi,
    
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
      const response = await APIUS.post("/api/privileges/apps/store", {
        aplikasi: form?.aplikasi,
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
            <h5>Tambah Kategori</h5>
    
            <div className="ml-auto x-close">
              <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
          <hr/>
    
          <Modal.Body className="modal-body">
          <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
           
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Nama Kategori
                </label>
                <input className="label-input-form" autoFocus type='text' name="aplikasi" onChange={handleChange} value={aplikasi}  
                  placeholder='...'/>
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
  