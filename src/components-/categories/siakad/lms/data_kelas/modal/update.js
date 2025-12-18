  import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import swal from "sweetalert";

export default function DataKelasUpdate(props) {

  const safeValue = (value) => value ?? "";
  const token = localStorage.getItem("token");
  
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  // Data
  const [getCabang, setGetCabang] = useState([]);
  const [getSekolah, setGetSekolah] = useState([]);

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseCabang = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetCabang(response.data.data);
  }

  useEffect(() => {
    GetResponseCabang();
  }, [])

  const [form, setForm] = useState({
     name_kelas: "",
     number_kelas: "",
     ysb_branch_id: "",
     ysb_school_id: "",
     user_id:"",
  });

  useEffect(() => {
    setForm({
    ...form,
      name_kelas: safeValue(props?.dataUpdate?.name_kelas),
      number_kelas: safeValue(props?.dataUpdate?.number_kelas),
      ysb_branch_id: safeValue(props?.dataUpdate?.ysb_branch_id),
      ysb_school_id: safeValue(props?.dataUpdate?.ysb_school_id),
      user_id: safeValue(props?.dataUpdate?.user_id)
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
      const response = await APIMS.put(`/api/kelas/${props.id}`, {
        name_kelas: form?.name_kelas,
        number_kelas: form?.number_kelas,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_school_id: form?.ysb_school_id,
        user_id: output_id_user,
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
            <h5>Update kelas</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kelas
            </label>
            <input className="label-input-form"  type='numbere' name="number_kelas" onChange={handleChange} value={form?.number_kelas}   
              placeholder='..'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

         <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Kelas
            </label>
            <input  className="label-input-form"  type='text' name="name_kelas" onChange={handleChange} value={form?.name_kelas}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" className="select-form" value={form?.ysb_branch_id} >
                <option value="" hidden>Pilih Cabang..</option>
                {getCabang.map((cabang,index) => (
                  <option value={cabang?.branch_code} >{cabang?.branch_name}</option>
                ))}         
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Sekolah </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" className="select-form"  value={form?.ysb_school_id} >
                <option value="" hidden>Pilih Sekolah..</option>
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
  