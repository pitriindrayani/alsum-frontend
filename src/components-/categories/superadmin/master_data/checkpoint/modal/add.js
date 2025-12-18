import { useState, useEffect } from "react";
import { Form, Button } from 'reactstrap'
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalRuanganAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');

  // Data
  const [getCabang, setGetCabang] = useState([]);
  const [getLantai, setGetLantai] = useState([]);
  const [getSekolah, setGetSekolah] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`,fetchParams);
    setGetCabang(response.data.data);
  }

  const GetResponseLantai = async () => {
    const response = await APIMS.get(`/api/floors?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`,fetchParams);
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

  const {
    name_room
  } = form;

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
      [e.target.name] : e.target.type === "radio"? e.target.value : e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await APIMS.post("/api/rooms/store", {
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
        props.abc();
        props.onHide();
        setLoading(false);
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 10000,
        buttons: false
      });
      setLoading(false);
      props.onHide();
    }
  });

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" backdrop="static" keyboard={false} scrollable>  

      <div className="d-flex header-modal">
        <h5>Tambah Check Point</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
       
          <div className="mt-2" >
            <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" value={form?.ysb_branch_id} className="select-form" >
                <option value="" hidden>Pilih Cabang..</option>
                {getCabang.map((cabang,index) => (
                  <option key={index} value={cabang?.branch_code} >{cabang?.branch_name}</option>
                ))}         
              </select>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Check Point
            </label>
            <input  className="label-input-form"  type='text' name="name_room" onChange={handleChange} value={name_room}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Lantai </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_floor_id" className="select-form" >
                <option value="" hidden>Pilih Lantai..</option>
                {getLantai.map((lantai,index) => (
                  <option key={index} value={lantai?.id} >{lantai?.name}</option>
                ))}         
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Gedung </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" className="select-form" >
                <option value="" hidden>Pilih Gedung..</option>
                {getSekolah.map((school,index) => (
                  <option key={index} value={school?.id} >{school?.school_name}</option>
                ))}         
              </select>
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
    </div> 
  );
}
  