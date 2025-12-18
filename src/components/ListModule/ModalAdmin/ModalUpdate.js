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
    <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Update Modules
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #005A9F', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#005A9F', 
              padding: '0 5px', fontSize: '15px' }}>
              Name
            </label>
            <input autoFocus type='text' name="name" onChange={handleChange} value={form?.name}  
              placeholder='Masukan Nama Menu' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#005A9F', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #005A9F', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#005A9F', 
              padding: '0 5px', fontSize: '15px' }}>
              Icon
            </label>
            <input autoFocus type='text' name="icon_name" onChange={handleChange} value={form?.icon_name}  
              placeholder='Masukan Icon Menu' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#005A9F', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #005A9F', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#005A9F', 
              padding: '0 5px', fontSize: '15px' }}>
              Color Icon
            </label>
            <input autoFocus type='text' name="color_icon" onChange={handleChange} value={form?.color_icon}  
              placeholder='Masukan Icon Menu' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#005A9F', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #005A9F', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#005A9F', 
              padding: '0 5px', fontSize: '15px' }}>
              Number Order
            </label>
            <input autoFocus type='text' name="number_order" onChange={handleChange} value={form?.number_order}  
              placeholder='Masukan Icon Menu' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#005A9F', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

        <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
          <div>
            <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
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
