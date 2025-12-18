import React, { useState, useEffect } from "react";
import { Button, Col, Form } from 'reactstrap';
import { FaQrcode, FaTimes, FaUserShield, FaSign, FaStreetView, FaCalendar, FaRegCalendarTimes, FaCalendarTimes } from 'react-icons/fa';
import { useMutation } from "react-query";
import Modal from 'react-bootstrap/Modal';
import swal from "sweetalert";
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderAction";
import ToastError from "../../NotificationToast/ToastError";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { APIMS } from "../../../config/apims";
import { APITS } from "../../../config/apits";
import { QrReader } from "react-qr-reader";
// import QrReader from 'react-qr-scanner'

import "../../../index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const id_user = localStorage.getItem("id_admin");
  const username = localStorage.getItem("name-admin");
  const [loading, setLoading] = useState(false);
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  // const rolesData = JSON.parse(localStorage.getItem('roles')) || [];
  // const filteredRoles = rolesData[0];
  const [propsData, setProopsData] = useState();
  const [showModalFailed, setShowModalFailed] = useState();
  const handleClose = () => setShowModalFailed(false);


  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");
  // console.log(output_id_user);

  const [form, setForm] = useState({
    ysb_check_point_id:"",
    user_id:"",
    output_id_user: "",
    id: "",
    name_room: "",
    name_school:"",
    name_floor: "",
    note: "",
  });

  const {
    ysb_check_point_id,
    user_id,
    ysb_user_id,
    note,
  } = form;

  // console.log(form)

  const fetchParams = {
    headers: {
      "Authorization": `${token}`,
      "Content-Type": "application/json"
    }
  };

  const GetResponseData = async () => {
    try {
      const response = await APIMS.get(`/api/access/check-points/${form.id}`, fetchParams);
      if (response.status === 200) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
        const formattedTime = currentDate.toTimeString().split(' ')[0];
        setForm({
          ...form,
          id_user: id_user ?? "",
          id: response.data.data.id ?? "",
          name_room: response.data.data.name_room ?? "",
          name_floor: response.data.data.name_floor ?? "",
          name_school: response.data.data.name_school ?? "",
        });
      }
    } catch (error) {
      // console.error(error); //buat mmodal
      setShowModalFailed();
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (form.id !== "") {
      GetResponseData();
    }
  }, [form?.id]);

  const handleScan = (scanData) => {
    if (scanData) {
      setForm({ ...form, id: scanData });
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error('mana qr nya');

  };

  // const handleSubmit = useMutation(async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await API.post("/api/check-points-logs/store", {
  //       id_user: id_user,
  //       id: form?.id,
  //       name_pos: form?.name_pos,
  //       date_check: form?.date_check,
  //       time_check: form?.time_check,
  //       location: form?.location,
  //       image: form?.image,
  //       note: form?.note,
  //     }, fetchParams);
  //     if (response.status === 200) {
  //       ToastSuccess.fire({
  //         icon: 'success',
  //         title: response.data.message,
  //       });
  //       props.GetResponseDataCheckPoint();
  //       props.onHide();
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     ToastError.fire({
  //       icon: 'error',
  //       title: error.response.data.message,
  //     });
  //     setLoading(false);
  //   }
  // });

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await APITS.post("/api/log-check-points/store", {
        ysb_check_point_id: form?.id,
        user_id: output_id_user,
        note: form?.note,
      }, fetchParams);
      if (response.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        });
        props.GetResponseData();
        props.onHide();
        setLoading(false);
      }
    } catch (error) {
      ToastError.fire({
        icon: 'error',
        title: error.response.data.message,
      });
      setLoading(false);
    }
  });
  

  return (
    <div>
      {loading && <LoaderAction />}
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  
      
        <div className="d-flex header-modal">
            <h5>Scan QR</h5>
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
        </div>
        <hr/>
        <Modal.Body className="modal-body">
          <Form onSubmit={(e) => handleSubmit.mutate(e)}>
            {form.id === "" ? (
               <QrReader
               constraints={{ facingMode: "environment" }}
               onError={handleError}
               onResult={(result, error) => {
                 if (!!result) {
                   handleScan(result?.text);
                 }
                 if (!!error) {
                   handleError(error);
                 }
               }}
              
             />
            ) : (
              <>

              <div className="mt-4 label-group-form display-form" >
                <label className="label-name-form">
                  Id User:
                </label>
                <input disabled className="label-input-form" type='text' name="user_id" onChange={handleChange} value={output_id_user}  
                  />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>

              <div className="mt-4 label-group-form display-form" >
                <label className="label-name-form">
                  Id Check Point:
                </label>
                <input disabled className="label-input-form" type='text' name="ysb_check_point_id" onChange={handleChange} value={form.id}  
                  />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>

              <div className="mb-3 row hasil-scan">
                <label > <span  style={{color : "#4747AC", fontWeight: '600'}}> Petugas :</span> {username}</label>
              </div>

              <div className="mb-3 row hasil-scan">
                <label > <span  style={{color : "#4747AC", fontWeight: '600'}}> Check Point :</span>  {form.name_room}</label>
              </div>
                
              <div className="mb-3 row hasil-scan">
                <label> <span style={{color : "#4747AC", fontWeight: '600'}}> Lantai :</span>  {form.name_floor === null? "":form?.name_floor} </label>
              </div>

              <div className="mb-3 row hasil-scan">
                <label> <span style={{color : "#4747AC", fontWeight: '600'}}> Gedung :</span>  {form.name_school === null? "":form?.name_school} </label>
              </div>
                
              <div className="mb-3 mt-3 hasil-scan ">
                  <label className="form-label form-label-scan">Catatan :</label>
                <textarea onChange={handleChange}  name="note" value={note} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </div>

              <div className="d-flex">
                <div className="ml-auto">
                  <Button className="mt-2 btn-modal-create" type='submit'>
                    Tambahkan
                  </Button>
                </div>
              </div>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>


      <Modal size="md" aria-labelledby="contained-modal-title-vcenter"  show={showModalFailed} onHide={handleClose} centered >  

          <div className="d-flex header-modal">
            <h5>Error</h5>

            <div className="ml-auto x-close">
              <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
            </div>
          </div>
          <hr/>

          <Modal.Body className="modal-body">
            <div >
              gagal
            </div>
            
            
          </Modal.Body>
        </Modal>
    </div>
  );
}
