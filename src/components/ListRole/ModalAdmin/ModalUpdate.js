import { useEffect, useRef, useState } from "react";
import {Form,Button} from 'reactstrap';
import { API } from "../../../config/api";
import { FaTimes} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css";
import LoaderAction from "../../Loader/LoaderAction";
import ToastError from "../../NotificationToast/ToastError";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
  
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
    const response = await API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
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
      const response = await API.put(`/api/privileges/roles/${props.id}`, {
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
              
              <div className="mt-2" style={{ display: "flex"}}>
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
