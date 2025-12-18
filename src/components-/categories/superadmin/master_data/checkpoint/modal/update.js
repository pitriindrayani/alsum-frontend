import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalRuanganUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const safeValue = (value) => value ?? "";

  // Data
  const [getCabang, setGetCabang] = useState([]);
  const [getLantai, setGetLantai] = useState([]);
  const [getSekolah, setGetSekolah] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetCabang(response.data.data);
  }

  const GetResponseLantai = async () => {
    const response = await APIMS.get(`/api/floors?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetLantai(response.data.data);
  }

  useEffect(() => {
    GetResponseCabang();
    GetResponseLantai();
  }, [])

  const [form, setForm] = useState({
    name_room: "",
    ysb_floor_id: "",
    ysb_branch_id: "",
    ysb_school_id : ""
  });

  useEffect(() => {
    setForm({
    ...form,
      name_room: safeValue(props?.dataUpdate?.name_room),
      ysb_floor_id: safeValue(props?.dataUpdate?.ysb_floor_id),
      ysb_branch_id: safeValue(props?.dataUpdate?.ysb_branch_id),
      ysb_school_id: safeValue(props?.dataUpdate?.ysb_school_id)
    });
  },[props])


  const GetResponseSekolah = async () => {
          try {
             const response = await APIMS.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetSekolah(response.data.data)
              }
          } catch (error) {
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
        if (form?.ysb_branch_id) {
          GetResponseSekolah()     
        }
  }, [form?.ysb_branch_id]);

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
      const response = await APIMS.put(`/api/rooms/${props.id}`, {
        name_room: form?.name_room,
        ysb_floor_id: form?.ysb_floor_id,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_school_id: form?.ysb_school_id
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
            <h5>Perbarui Check Point</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-2" >
            <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" className="select-form" value={form?.ysb_branch_id} >
                <option value="" hidden>Pilih Cabang..</option>
                {getCabang.map((cabang,index) => (
                  <option value={cabang?.branch_code} >{cabang?.branch_name}</option>
                ))}         
              </select>
          </div>


          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Check Point
            </label>
            <input  className="label-input-form"  type='text' name="name_room" onChange={handleChange} value={form?.name_room}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Lantai </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_floor_id" className="select-form"  value={form?.ysb_floor_id}>
                <option value="" hidden>Pilih Lantai..</option>
                {getLantai.map((lantai,index) => (
                  <option value={lantai?.id} >{lantai?.name}</option>
                ))}         
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Gedung </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" className="select-form"  value={form?.ysb_school_id} >
                <option value="" hidden>Pilih Gedung..</option>
                {getSekolah.map((school,index) => (
                  <option value={school?.id} >{school?.school_name}</option>
                ))}         
              </select>
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
  