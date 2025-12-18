import { useEffect, useState } from "react";
import {Form,Button} from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css"
import LoaderAction from "../../Loader/LoaderAction"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
  
export default function ModalRoleUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  // console.log(props)
  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    name: "",
    icon_name: "",
    color_icon: "",
    number_order: ""
  });

  useEffect(() => {
    setForm({
      ...form, 
      name: `${props?.nameUpdate}`,
      icon_name: `${props?.iconUpdate}`,
      color_icon: `${props?.colorIconUpdate}`,
      number_order: `${props?.numberOrder}`
    });
  }, [props])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
  
      // Insert data for login process
      const response = await API.put(`/api/privileges/modules/${props.id}`, {
        name: form?.name,
        icon_name: form?.icon_name,
        color_icon: form?.color_icon,
        number_order: form?.number_order
      }, fetchParams);
      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
      // setLoading(false)
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
                <h5>Update Module</h5>
            
                <div className="ml-auto x-close">
                    <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
                </div>
              </div>
            <hr/>
          <Modal.Body className="modal-body">
          <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Nama Module
                </label>
                <input className="label-input-form" autoFocus type='text' name="name" onChange={handleChange} value={form?.name}  
                  placeholder='...'/>
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
    
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Icon
                </label>
                <input  className="label-input-form" autoFocus type='text' name="icon_name" onChange={handleChange} value={form?.icon_name}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
    
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Color Icon
                </label>
                <input  className="label-input-form" autoFocus type='text' name="color_icon" onChange={handleChange} value={form?.color_icon}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
    
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Number Order
                </label>
                <input  className="label-input-form" autoFocus type='text' name="number_order" onChange={handleChange} value={form?.number_order}  
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
