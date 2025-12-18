import { useState } from "react";
import { Form, Button } from 'reactstrap';
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

export default function ModalJenjangAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    stages: "",
    stages_name: "",
    seq: "",
    min_grade : "",
    max_grade: ""
  });

  const {
    stages,
    stages_name,
    seq,
    min_grade,
    max_grade,
  } = form;

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
      const response = await APIMS.post("/api/educational-stages/store", {
        stages: form?.stages,
        stages_name: form?.stages_name,
        seq: form?.seq,
        min_grade: form?.min_grade,
        max_grade: form?.max_grade
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
      setLoading(false)
    }
  });

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        <h5>Tambah Jenjang</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
       
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Label Sekolah
            </label>
            <input className="label-input-form"  type='text' name="stages" onChange={handleChange} value={stages}  
              placeholder='SD/SMP/SMA'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Sekolah
            </label>
            <input  className="label-input-form"  type='text' name="stages_name" onChange={handleChange} value={stages_name}  
              placeholder='Masukan Nama Sekolah' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Tahap Jenjang
            </label>
            <input  className="label-input-form"  type='number' name="seq" onChange={handleChange} value={seq}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kelas Awal
            </label>
            <input  className="label-input-form"  type='number' name="min_grade" onChange={handleChange} value={min_grade}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kelas Akhir
            </label>
            <input  className="label-input-form"  type='number' name="max_grade" onChange={handleChange} value={max_grade}  
              placeholder='...'  />
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
    </div> 
  );
}
  