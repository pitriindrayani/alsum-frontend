import {  useState,useEffect } from "react";
import { Form,Button} from 'reactstrap'
import { API } from "../../../../config/api";
import { FaPlus, FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../Loader/LoaderAction"


export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataRoom, setGetDataRoom] = useState([]);
  const [search, setSearch] = useState("")
  const [keyword, setKeyword] = useState("");
  const [ascending, setAscending] = useState(0);
  const [limit, setLimit] = useState(1000);
  const [page, setPage] = useState(0);

  const [inputList, setInputList] = useState([
    {
      id_menu: "",
    },
  ]);  

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
      const response = await API.post("/user-service/privileges/module-menus/store",{
        id_module: props.idAdd,
        menus: inputList,
      },fetchParams);
      // Checking process
      if (response?.status === 200){
        swal({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          buttons: false
        })
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
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

// handle input change
const handleInputChange = (e, index, fieldName) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

  // Copy inputList agar tidak merusak data asli
  const updatedInputList = [...inputList];

  // Update hanya elemen yang sedang aktif
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
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Tambah Module
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
      {inputList.map((x, i) => {
        return (
        <div>
        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{ flex: "80%", display:"flex"}}>
            <select className="form-select" aria-label="Default select example"  onChange={(e) => handleInputChange(e, i, "id_menu")}  name="id_menu" style={{ textAlign:"", cursor:"pointer"}}>
              <option value="" hidden>Pilih Menu..</option>
              {getDataRoom.map((user,index) => (
                <option value={user?.id} style={{textAlign:""}}>{user?.name} ( {user?.url} )</option>
              ))}         
            </select>
          </div>
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
    </div> 
  );
}
  