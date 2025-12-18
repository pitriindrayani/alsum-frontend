import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APILA } from "../../../config/apila";
import { APIMS } from "../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderHome";
import "../../../index.css";
import ToastError from "../../NotificationToast/ToastError";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
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

  const [form, setForm] = useState({
     name_year: "",
     date_in: "",
     date_out: "",
     semester: "",
     status:"",
     user_id:"",
  });

  useEffect(() => {
    setForm({
    ...form,
      name_year: safeValue(props?.dataUpdate?.name_year),
      date_in: safeValue(props?.dataUpdate?.date_in),
      date_out: safeValue(props?.dataUpdate?.date_out),
      semester: safeValue(props?.dataUpdate?.semester),
      status: safeValue(props?.dataUpdate?.status),
      user_id: safeValue(props?.dataUpdate?.user_id)
    });
  },[props])

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
      const response = await APILA.put(`/api/semesters/${props.id}`, {
        name_year: form?.name_year,
        date_in: form?.date_in,
        dat_out: form?.date_out,
        semester: form?.semester,
        status: form?.status,
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
            <h5>Update Tahun AjAran</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tahun Ajaran
            </label>
            <input className="label-input-form"  type='text' name="name_year" onChange={handleChange} value={form?.name_year}   
              placeholder='..'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

         <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tanggal Mulai
            </label>
            <input type="date" name="date_in" onChange={handleChange} value={form?.date_in}  placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
             <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tanggal Akhir
            </label>
            <input type="date" name="date_out" onChange={handleChange} value={form?.date_out} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
             <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

           <div className="mt-2" >
            <label className="label-form" >Semester </label>
              <select aria-label="Default select example" value={form?.semester} onChange={handleChange}   name="semester" className="select-form" >
                <option value="" hidden>Pilih Semester..</option>
                <option value="1">1</option>
                <option value="2">2</option>      
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Aktif </label>
              <select aria-label="Default select example" value={form?.status}  onChange={handleChange}   name="status" className="select-form" >
                <option value="" hidden>Pilih Aktif..</option>
                <option value="1">Ya</option>
                <option value="0">Tidak</option>      
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
  