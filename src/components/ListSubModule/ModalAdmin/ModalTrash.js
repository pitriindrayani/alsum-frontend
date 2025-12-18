import { useEffect, useState } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import "../../../index.css"
import swal from "sweetalert";
import LoaderHome from "../../Loader/LoaderHome"
  
export default function ModalRoleUpdate(props) {
  document.title = "List Sub Module";
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
  const [inputList, setInputList] = useState([
    {
      id_menu: "",
    },
  ]);  

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [formSubModule, setFormTreatment] = useState({
    subModule: [],
  });


  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.get(`/api/privileges/module-menus?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&search=${search}&id_module=${props.idTrash}`,fetchParams)

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
      setLoading(true);
  
      const payload = {
        menus: formSubModule?.subModule.map(item => ({ id_menu: item.id_menu })),
      };
  
      // permintaan DELETE dengan payload
      const response = await API.delete(`/api/privileges/module-menus/${props.idTrash}`, {
        data: payload,
        ...fetchParams, 
      });
  
      // Periksa respons
      if (response?.status === 200) {
        swal({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          buttons: false,
        });
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message || 'An error occurred'}`,
        icon: 'error',
        timer: 3000,
        buttons: false,
      });
      setLoading(false);
    }
  });
  
  const handleChangeCheckbox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { subModule } = formSubModule;
    // console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setFormTreatment({
        subModule: [...subModule, {"id_menu" : `${value}`}],
      });
    }
  
    // Case 2  : The user unchecks the box
    else {
      setFormTreatment({
        subModule: subModule.filter(e => {return e.id_menu !== `${value}`} ),

      });
    }
  };

  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{fontFamily:"sans-serif",border:"none"}}>
      {loading && <LoaderHome />}
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Hapus Sub Module
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} style={{ fontFamily: "sans-serif" }} >
        {inputList.map((x, i) => {
        return (
        <div className="box">
        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{flex:"5%", display:"flex", alignItems:""}}>
           Pilih Menu yang Ingin Dihapus
          </div>
          <div style={{ flex: "60%", display:"flex"}}>
          <p style={{ marginRight: "10px", display: "flex", alignItems: "", height: "100%" }}>:</p>
        <div>
          {getDataRoom.map((user,index) => (
            <div key={index} className="mb-3" style={{display:"flex", width:"100%", cursor:"pointer"}}>
              <input autoFofcus type='checkbox' value={user?.id_menu} name="id_menu" onChange={handleChangeCheckbox} style={{display:"flex", alignItems:"center",marginRight:"5px", border: "none", borderBottom: "1px solid #804D00", cursor:"pointer" }} />
              <div style={{display:"flex", alignItems:"center"}}>
                {user?.menu_data.name}
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    
      </div>
      );
      })}

      <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
          <div>
            <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
              Hapus
            </Button>
          </div>
        </div>
    </Form>
        
    </Modal.Body>
    </Modal>
    );
}
