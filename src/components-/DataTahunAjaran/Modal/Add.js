import { useState, useEffect } from "react";
import { Form, Button } from 'reactstrap';
import { APILA } from "../../../config/apila";
import { APIMS } from "../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderHome";
import "../../../index.css";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function DataTahunAjaran(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  // Data
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getDataSekolah, setGetDataSekolah] = useState([]);
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
    status: "",
    user_id:"",
  });

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
      const response = await APILA.post("/api/semesters/store", {
        name_year: form?.name_year,
        date_in: form?.date_in,
        date_out: form?.date_out,
        semester: form?.semester,
        status: form?.semester,
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
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        <h5>Tambah Data Tahun Ajaran</h5>

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
            <input className="label-input-form" autoFocus type='text' name="name_year" onChange={handleChange} placeholder='...'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tanggal Mulai
            </label>
            <input type="date" name="date_in" onChange={handleChange} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
             <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tanggal Akhir
            </label>
            <input type="date" name="date_out" onChange={handleChange} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px', cursor:"pointer"}}/>
             <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Semester </label>
              <select aria-label="Default select example"  onChange={handleChange}   name="semester" className="select-form" >
                <option value="" hidden>Pilih Semester..</option>
                <option value="1">1</option>
                <option value="2">2</option>      
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Aktif </label>
              <select aria-label="Default select example"  onChange={handleChange}   name="status" className="select-form" >
                <option value="" hidden>Pilih Aktif..</option>
                <option value="1">Ya</option>
                <option value="0">Tidak</option>      
              </select>
          </div>       

        <div className="d-flex">
          <div className="ml-auto">
            <Button  className="mt-4 btn-modal-create" type='submit'>
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
  