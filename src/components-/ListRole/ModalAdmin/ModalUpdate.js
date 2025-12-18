import { useEffect, useRef, useState } from "react";
import {Form,Button} from 'reactstrap'
import { APIMS } from "../../../config/apims";
import { APIUS } from "../../../config/apius";
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
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [getDataCabang, setGetDataCabang] = useState([]);
  const nameInputRef = useRef(null); 
  
  console.log(props)
  // console.log(props)
  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    name: "",
    icon_name: "",
    ysb_branch_id:"",
    ysb_kategori:"",
  });

  const getResponseDataCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetDataCabang(response.data.data)
  }

  useEffect(() => {
    getResponseDataCabang()
  }, [])

  useEffect(() => {
    setForm({
      ...form, 
      name: `${props?.nameUpdate}`,
      icon_name: `${props?.iconUpdate}`,
      ysb_branch_id: `${props?.ysbBranchIdUpdate}`,
      ysb_kategori:`${props?.ysbKategoriUpdate}`,

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
      const response = await APIUS.put(`/api/privileges/roles/${props.id}`, {
        name: form?.name,
        icon_name: form?.icon_name,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_kategori: form?.ysb_kategori 
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
                <h5>Update Role</h5>
            
                <div className="ml-auto x-close">
                    <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
                </div>
              </div>
            <hr/>
          <Modal.Body className="modal-body">
          <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
               <div className="mt-4" style={{ display: "flex"}}>
                <div style={{ display:"flex", width:"100%"}}>
                <select className="select-form" ref={nameInputRef} value={form?.ysb_kategori}  aria-label="Default select example" onChange={handleChange} name="ysb_kategori" >
                    <option value="" hidden>Pilih Kategori</option>
                    <option value="karyawan">Karyawan</option>
                    <option value="guru">Guru</option>
                    <option value="siswa">Siswa</option>
                  </select>
                  
                </div>
              </div>

              <div className="mt-4" style={{ display: "flex"}}>
                <div style={{ display:"flex", width:"100%"}}>
                <select className="select-form" ref={nameInputRef} value={form?.ysb_branch_id}  aria-label="Default select example" onChange={handleChange} name="ysb_branch_id" >
                    <option value="" hidden>Pilih Cabang..</option>
                    {getDataCabang.map((user,index) => (
                      <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                    ))}  
                  </select>
                </div>
              </div>
           
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Nama Role
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



    {/* <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#005A9F", fontWeight:"600"}}>
          Update Role
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#005A9F"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
   
        <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select  ref={nameInputRef} aria-label="Default select example" value={form?.ysb_branch_id}  onChange={handleChange}  name="ysb_branch_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Pilih Cabang..</option>
                {getDataCabang.map((user,index) => (
                  <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
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

        <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
          <div>
            <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
              Update
            </Button>
          </div>
        </div>
        </Form>
      </Modal.Body>
    </Modal> */}
  </div>
    );
  }
