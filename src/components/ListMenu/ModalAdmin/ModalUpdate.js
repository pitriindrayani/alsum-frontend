import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css"
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
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
    name_menus: "",
    url: "",
    icon: "",
    color_icon: "",
    number_order: "",
    create: ""
  });

  useEffect(() => {
    setForm({
      ...form, 
      name_menus: `${props?.nameUpdate}`,
      url: `${props?.urlUpdate}`,
      icon: `${props?.iconUpdate}`,
      color_icon: `${props?.colorIconUpdate}`,
      number_order: `${props?.numberOrderUpdate}`,
      create: `${props?.showUpdate}`
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
      const response = await API.put(`/api/privileges/menus/${props.id}`, {
        name: form?.name_menus,
        url: form?.url,
        icon: form?.icon,
        color_icon: form?.color_icon,
        number_order: form?.number_order,
        show: `${form.create}` === "true" ? true : false
      }, fetchParams);
  
      // Checking process
      if (response?.status === 200) {
        swal({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 3000,
          buttons: false
        });
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
      // setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
      setLoading(false)
    }
  });

  const users = [
    {
    id: "true",
    name: "Show"
    },
    {
      id: "false",
      name: "Hide"
      }
  ]

  return (
    <div className="modal">
    {loading && <LoaderAction/>}

    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter"  backdrop="static" keyboard={false} centered >  
    
            <div className="d-flex header-modal">
                <h5>Update Menu</h5>
            
                <div className="ml-auto x-close">
                    <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
                </div>
              </div>
            <hr/>
          <Modal.Body className="modal-body">
          <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                   Nama Menu
                </label>
                <input className="label-input-form" autoFocus type='text' name="name_menus" onChange={handleChange} value={form?.name_menus}   
                  placeholder='Masukan Label Jenjang'/>
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
    
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Url
                </label>
                <input  className="label-input-form" autoFocus type='text' name="url" onChange={handleChange} value={form?.url}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>

              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Icon
                </label>
                <input  className="label-input-form" autoFocus type='text' name="icon" onChange={handleChange} value={form?.icon}  
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


              <div className="mt-2" style={{ width:"100%", outline:"none", padding:"10px 0px", display:"flex"}}>
                {users.map((user) => (
                  <>
                    {form.create === user.id ?
                    <label className='label-custom' style={{marginTop:"0px", backgroundColor:"#005A9F", color:"white"}}>
                      <input
                        type="radio"
                        name="create"
                        value={user.id}
                        className="check-btn"
                        onChange={handleChange}
                      />{" "}
                      <span className="text-inner">{user.name}</span>
                    </label>
                    :
                    <label className='label-custom' style={{marginTop:"0px", border:"1px solid #959595"}}>
                      <input
                        type="radio"
                        name="create"
                        value={user.id}
                        className="check-btn"
                        onChange={handleChange}
                      />{" "}
                      <span className="text-inner">{user.name}</span>
                    </label>
                    }
                  </>
                ))}
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