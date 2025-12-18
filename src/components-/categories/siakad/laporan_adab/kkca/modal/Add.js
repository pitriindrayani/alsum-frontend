import { useState } from "react";
import { Form, Button } from 'reactstrap';
import { APILA } from "../../../../../../config/apila";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalKkcaAdd(props) {
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
    name_kkca: "",
    persentase: "",
    user_id:"",
    
    
  });

  const {
    name_kkca,
    persentase,
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
      const response = await APILA.post("/api/kkca/store", {
        name_kkca: form?.name_kkca,
        persentase: form?.persentase,
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
        <h5>Tambah KKCA</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
        <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama KKCA
            </label>
            <input className="label-input-form" autoFocus type='text' name="name_kkca" onChange={handleChange} placeholder='...'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Persentase
            </label>
            <input  className="label-input-form"  type='text' name="persentase" onChange={handleChange} placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
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
  