import { useState, useRef } from "react";
import { Form, Button } from 'reactstrap';
import { API } from "../../../config/api";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction";
import "../../../index.css";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Logo from "../../../assets/scanme.png";
import { useReactToPrint } from "react-to-print";

export default function ModalScanMe(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })



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
        <h5>Scan Me</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
        <div >
          <div className="d-flex">
            <button onClick={handlePrint}  className="btn ml-auto mb-3" style={{backgroundColor:"#eca91aff", color:"#fff", fontSize:'14px'}}>
             Download / Print
            </button> 
          </div>
          
          <div className="scan-image-container" ref={componentRef}>
            <img src={Logo}/>
            <div class="img-qr">
              <h3>Ini QR</h3>
            </div>
          </div>
        </div>
        
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  