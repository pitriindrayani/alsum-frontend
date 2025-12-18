import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form ,Button} from 'reactstrap'
import { API } from "../../../config/api";
import {FaPlus, FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css"
import swal from "sweetalert";
import LoaderHome from "../../Loader/LoaderHome"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import ToastError from "../../NotificationToast/ToastError"
  
export default function ModalRoleUpdate(props) {
  document.title = "Role Permission";
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(0);
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("")
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataRoom, setGetDataRoom] = useState([]);
  const [keyword, setKeyword] = useState("");
  // const [formTreatment, setFormTreatment] = useState({ assistants: [] });
  const [inputList, setInputList] = useState([
    {
      id_menu: "",
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  ]);  
  // Menghapus nilai null dalam array assistant di inputList

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      setLoading(true)
      // e.preventDefault();
      const response = await API.get(`/user-service/privileges/menus?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&search=${search}`,fetchParams)
      // Checking process
      if (response?.status === 200) {
        setGetDataRoom(response.data.data)
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

  useEffect(() => {
    GetResponseData()
  },[])

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/user-service/privileges/permissions/store",{
        id_user: props.idAdd,
        menus: inputList,
      },fetchParams);
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
      setLoading(false)
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
    }
  });

  // handle input change
  const handleInputChange = (e, index, fieldName) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
  const updatedInputList = [...inputList];
  updatedInputList[index] = {
    ...updatedInputList[index],
    [fieldName]: value,
  };
  setInputList(updatedInputList);
  };

  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        id_menu: "",
        create: false, 
        read: false,   
        update: false, 
        delete: false, 
      },
    ]);
  };
  
  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  return (
    <Modal {...props} size="" aria-labelledby="contained-modal-title-center" centered style={{fontFamily:"sans-serif",border:"none"}}>
      {loading && <LoaderHome />}
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Tambah Permission
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} style={{ fontFamily: "sans-serif" }} >
        {inputList.map((x, i) => {
        return (
        <div>
          <div className="mt-1" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select className="form-select" aria-label="Default select example"  onChange={(e) => handleInputChange(e, i, "id_menu")}  name="id_menu" style={{ textAlign:"", cursor:"pointer"}}>
                <option value="" hidden>Pilih Menu..</option>
                {getDataRoom.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                ))}         
              </select>
            </div>
          </div>
              
          <div style={{display: "grid", gridTemplateColumns:"repeat(4,2fr)"}}>
            <>
              {x.create?
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                <input
                  type="checkbox" 
                  name="create"
                  onChange={(e) => handleInputChange(e, i, "create")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Create</span>
              </label>
              :
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                <input
                  type="checkbox" 
                  name="create"
                  onChange={(e) => handleInputChange(e, i, "create")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Create</span>
              </label>
              }
            </>
                
            <>
              {x.read?
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                <input
                  type="checkbox" 
                  name="read"
                  onChange={(e) => handleInputChange(e, i, "read")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Read</span>
              </label>
              :
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                <input
                  type="checkbox" 
                  name="read"
                  onChange={(e) => handleInputChange(e, i, "read")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Read</span>
              </label>
              }
            </>

            <>
              {x.update?
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                <input
                  type="checkbox" 
                  name="update"
                  onChange={(e) => handleInputChange(e, i, "update")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Update</span>
              </label>
              :
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                <input
                  type="checkbox" 
                  name="update"
                  onChange={(e) => handleInputChange(e, i, "update")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Update</span>
              </label>
              }
            </>

            <>
              {x.delete?
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"#4d5b9e", color:"white"}}>
                <input
                  type="checkbox" 
                  name="delete"
                  onChange={(e) => handleInputChange(e, i, "delete")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Delete</span>
              </label>
              :
              <label className='label-custom' style={{marginTop:"10px", backgroundColor:"", color:"black"}}>
                <input
                  type="checkbox" 
                  name="delete"
                  onChange={(e) => handleInputChange(e, i, "delete")}
                  className="check-btn"
                />{" "}
                <span className="text-inner">Delete</span>
              </label>
              }
            </> 
          </div>  
    
          <div className="" style={{ display: "" }}>
            <div className="mt-3">
              {inputList.length !== 1 && <button className="mr10" style={{border:"none", backgroundColor:"red", color:"white", borderRadius:"3px", fontSize:"12px", padding:"5px 10px"}} onClick={() => handleRemoveClick(i)}>Remove</button>}
            </div>
            <div className="mt-3">
              {inputList.length - 1 === i && <button style={{border:"none", backgroundColor:"#667BFF", color:"white", borderRadius:"3px", fontSize:"12px", padding:"5px 10px"}} onClick={handleAddClick}><FaPlus style={{marginRight:"5px", fontSize:"10px"}}/>Add</button>}
            </div>
          </div>
        </div>
      );
    })}

      <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
        <div>
          <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
            Tambahkan
          </Button>
        </div>
      </div>
    </Form>   
    </Modal.Body>
  </Modal>
  );
}
