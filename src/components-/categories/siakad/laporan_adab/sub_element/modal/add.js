import { useState } from "react";
import { Form, Button } from 'reactstrap';
import { APILA } from "../../../../../../config/apila";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome"
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useParams} from "react-router-dom";

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

 

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    id_element: "",
    description: "",
    user_id:"",
    
  });

  const {
    id_element,
    description,
    user_id

  } = form;

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
      const response = await APILA.post("/api/sub-elements/store", {
        id_element: props.idelement,
        description: form?.description,
        user_id: output_id_user,
      }, fetchParams);
      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
        props.getresponsedata();
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
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static">  

      <div className="d-flex header-modal">
        <h5>Tambah Sub Element</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
       
          <div className="mt-4 label-group-form" hidden>
            <label className="label-name-form">
              ID Element
            </label>
            <input className="label-input-form"  type='text' name="id_element" onChange={handleChange} value={id_element}  
              placeholder={props.idelement} disabled/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-2" >
            <label className="label-form" style={{fontSize:"16px"}} >Detail Kegiatan : </label>
            <textarea onChange={handleChange}  name="description" value={description} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
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
  