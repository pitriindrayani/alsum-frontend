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
import QrScanner from "qr-scanner";


export default function ModalScan(props) {
    const token = localStorage.getItem("token");
    // Untuk Close Proops Data
    const [propsData, setProopsData] = useState()
    const [loading, setLoading] = useState(false);

    let fetchParams = {
        headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

    // const [scan, setScan] = useState(true);

   


    return (
        <div className="modal">
            {loading && <LoaderAction/>}
            <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

            <div className="d-flex header-modal">
                <h5>Scan QR</h5>

                <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
                </div>
            </div>
            <hr/>

                <Modal.Body className="modal-body">
                
                    <div>
                        <video
                            id="scanView"
                            style={{
                            width: "100%",
                            height: "100%",
                            borderStyle: "dotted",
                        }}></video>
                        Hasil Scan:
            <br />
           
                    </div>
                    
                </Modal.Body>
            </Modal>
        </div> 
        );
    }
  