import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Row,Col } from 'reactstrap'
import { API } from "../../../config/api";
import {FaSave, FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import "bulma/css/bulma.css";
// import "../Styled.css"
import swal from "sweetalert";
import LoaderHome from "../../Loader/LoaderHome"
  
export default function ModalRoleUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  // console.log(props)
  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    create:false,
    read:false,
    update:false,
    delete:false
  });

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.type === "radio" ? e.target.value : e.target.checked,
    });
  };

  const UpdateMenu = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await API.put(`/api/privileges/permissions/${props.idAdd}`,
    {
      create: form.create,
      read: form.read,
      update: form.update,
      delete: form.delete
    },
    fetchParams)
    
    if (response.data.error == false) {
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
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }
  
  return (
    <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered style={{fontFamily:"sans-serif",border:"none"}}>
      {loading && <LoaderHome />}
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Update Role Permission
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none" }}>
      <form onSubmit={(e) =>UpdateMenu}>
          <Row style={{paddingLeft:"2vh",paddingRight:"2vh"}}>
            <Col xl='12' sm='12'>
             <div>
              <p style={{marginBottom:"10px",fontFamily:"revert", fontSize:"20px"}}/>
                <div style={{display: "grid", gridTemplateColumns:"repeat(4,2fr)"}}>
                    <>
                      {form.create?
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                        <input
                          type="checkbox" 
                          name="create"
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Create</span>
                      </label>
                      :
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                        <input
                          type="checkbox" 
                          name="create"
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Create</span>
                      </label>
                      }
                    </>

                    <>
                      {form.read?
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                        <input
                          type="checkbox" 
                          name="read"
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Read</span>
                      </label>
                      :
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                        <input
                          type="checkbox" 
                          name="read"
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Read</span>
                      </label>
                      }
                    </>

                    <>
                      {form.update?
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                        <input
                          type="checkbox" 
                          name="update"       
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Update</span>
                      </label>
                      :
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                        <input
                          type="checkbox" 
                          name="update"  
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Update</span>
                      </label>
                      }
                    </>

                    <>
                      {form.delete?
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                        <input
                          type="checkbox" 
                          name="delete"
                          value={form?.delete}
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Delete</span>
                      </label>
                      :
                      <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                        <input
                          type="checkbox" 
                          name="delete"
                          value={form?.delete}
                          onChange={handleChange}
                          className="check-btn"
                        />{" "}
                        <span className="text-inner">Delete</span>
                      </label>
                      }
                    </>
                </div> 
             </div>
            </Col>

            <Col xl='12' className='mt-4'>
              <div onClick={UpdateMenu} style={{display:"flex",justifyContent:"center", backgroundColor:"white", color:"white"}}>
                <button type='submit' style={{marginRight:"5px", fontFamily:"sans-serif",border:"none", backgroundColor:"#4040FF",color:"white",borderRadius:"5px",cursor:"pointer", width:"200px", height:"35px"}}><FaSave style={{marginRight:"5px"}}/>save</button>
              </div>
            </Col>

          </Row>
        </form>
    </Modal.Body>
  </Modal>
  );
}
