import { useState } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ModalHasilScan(props) {
   const id_user = localStorage.getItem("id_admin");
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

   const [form, setForm] = useState({
    id_user: "",
    id: "",
    name_room: "",
    name_school:"",
    name_floor: "",
    note: "",
  });


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
      const response = await API.post("/master-service/educational-stages/store", {
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
        <h5>Hasil Scan QR</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          
           <div class="mb-3 row hasil-scan">
              <label > <span  style={{color : "#4747AC", fontWeight: '600'}}> Nama Ruangan :</span>  {form.name_room}</label>
              </div>
                
              <div class="mb-3 row hasil-scan">
                <label> <span style={{color : "#4747AC", fontWeight: '600'}}> Lantai :</span>  {form.name_floor === null? "":form?.name_floor} </label>
              </div>

              <div class="mb-3 row hasil-scan">
                <label> <span style={{color : "#4747AC", fontWeight: '600'}}> Gedung :</span>  {form.name_school === null? "":form?.name_school} </label>
              </div>

              <div class="mb-3 row hasil-scan">
                <label> <span style={{color : "#4747AC", fontWeight: '600'}}> Petugas :</span>  {form.id_user} </label>
              </div>

                <div class="mb-3 mt-3 hasil-scan ">
                    <label for="exampleFormControlTextarea1" class="form-label form-label-scan">Catatan :</label>
                    <textarea onChange={handleChange} class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                </div>

                <div className="d-flex">
                    <div className="ml-auto">
                        <Button className="mt-2 btn-modal-create" type='submit'>
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
  