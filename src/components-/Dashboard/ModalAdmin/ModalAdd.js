import React, { useState, useEffect } from "react";
import { Button, Col, Form } from 'reactstrap';
import { FaTimes, FaSign, FaStreetView, FaCalendar, FaCalendarTimes } from 'react-icons/fa';
import { useMutation } from "react-query";
import Modal from 'react-bootstrap/Modal';
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderAction";
import ToastError from "../../NotificationToast/ToastError";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { API } from "../../../config/api";
import { QrReader } from "react-qr-reader";
import "../../../index.css";

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const id_user = localStorage.getItem("id_admin");
  const [loading, setLoading] = useState(false);
  const [startScan, setStartScan] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);
  // const rolesData = JSON.parse(localStorage.getItem('roles')) || [];
  // const filteredRoles = rolesData[0];

  const [form, setForm] = useState({
    id_user: "",
    id_qr_code: "",
    name_pos: "",
    date_check: "",
    time_check: "",
    location: "",
    latitude: "",
    longitude: "",
    image: "",
    // image_url: "",
    note: "",
  });

  const fetchParams = {
    headers: {
      "Authorization": `${token}`,
      "Content-Type": "application/json"
    }
  };

  const GetResponseData = async () => {
    try {
      const response = await API.get(`/api/dashboard-pos-check-points/${form.id_qr_code}`, fetchParams);
      if (response.status === 200) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getFullYear()}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getDate().toString().padStart(2, '0')}`;
        const formattedTime = currentDate.toTimeString().split(' ')[0];
        setForm({
          ...form,
          id_user: id_user ?? "",
          date_check: formattedDate,
          time_check: formattedTime,
          name_pos: response.data.data.name_pos ?? "",
          location: response.data.data.location ?? "",
          latitude: response.data.data.latitude ?? "",
          longitude: response.data.data.longitude ?? "",
          image: response.data.data.image ?? "",
          // image_url: response.data.data.image_url ?? "",
          // note: response.data.data.note ?? "-",
          // date_check: ,
          // time_check: ,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (form.id_qr_code !== "") {
      GetResponseData();
    }
  }, [form?.id_qr_code]);

  const handleScan = (scanData) => {
    if (scanData) {
      setForm({ ...form, id_qr_code: scanData });
      setStartScan(false);
      setLoadingScan(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post("/api/check-points-logs/store", {
        id_user: id_user,
        id_qr_code: form?.id_qr_code,
        name_pos: form?.name_pos,
        date_check: form?.date_check,
        time_check: form?.time_check,
        location: form?.location,
        image: form?.image,
        note: form?.note,
      }, fetchParams);
      if (response.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        });
        props.GetResponseDataCheckPoint();
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
      <Modal {...props} size="" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>
        <div style={{ width: "100%", display: "flex", padding: "10px 0px", backgroundColor: "#005A9F" }}>
          <div style={{ flex: "92%", fontSize: "20px", display: "flex", alignItems: "center", paddingLeft: "10px", color: "white", fontWeight: "600" }}>
            Check Point
          </div>
          <div style={{ flex: "8%", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <FaTimes onClick={props.onHide} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <Modal.Body style={{ borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", border: "none", backgroundImage: "transparent" }}>
          <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-1">
            {form.id_qr_code === "" ? (
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
               style={{ width: "100%" }}
             />
            ) : (
              <>
                <Col className="mb-2">
                  <div style={{ backgroundColor: "#B9D8FF", border: "none", borderRadius: "0px", padding: "10px", width: "100%", boxSizing: "border-box", margin: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <div style={{ flex: "20%", display: "flex", justifyContent: "center", borderRadius: "10px", alignItems: "center", padding: "10px", backgroundColor: "#2C8FFF" }}>
                        <div style={{ border: "3px solid white", padding: "10px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <FaSign style={{ color: "white", fontSize: "24px" }} />
                        </div>
                      </div>
                      <div style={{ flex: "80%", padding: "10px", backgroundColor: "#B9D8FF" }}>
                        <div style={{ fontSize: "24px", color: "#005A9F", fontWeight: "bold" }}>Nama Pos</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#005A9F" }}>{form.name_pos}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="mb-2">
                  <div style={{ backgroundColor: "white", border: "none", borderRadius: "0px", width: "100%", boxSizing: "border-box", margin: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <div style={{ flex: "20%", display: "flex", justifyContent: "center", borderRadius: "10px", alignItems: "center", backgroundColor: "white" }}>
                        <div style={{ border: "5px solid #005A9F", padding: "10px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <FaStreetView style={{ color: "#005A9F", fontSize: "24px" }} />
                        </div>
                      </div>
                      <div style={{ flex: "80%", padding: "10px 10px 10px 5px", backgroundColor: "white" }}>
                        <div style={{ fontSize: "20px",color: "#005A9F", fontWeight: "bold" }}>Location</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#AEB7C0" }}>{form.location === null? "":form?.location}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="mb-2">
                  <div style={{ backgroundColor: "white", border: "none", borderRadius: "0px", width: "100%", boxSizing: "border-box", margin: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <div style={{ flex: "20%", display: "flex", justifyContent: "center", borderRadius: "10px", alignItems: "center", backgroundColor: "white" }}>
                        <div style={{ border: "5px solid #005A9F", padding: "10px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <FaCalendar style={{ color: "#005A9F", fontSize: "24px" }} />
                        </div>
                      </div>
                      <div style={{ flex: "80%", padding: "10px 10px 10px 5px", backgroundColor: "white" }}>
                        <div style={{ fontSize: "20px",color: "#005A9F", fontWeight: "bold" }}>Tanggal</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#AEB7C0" }}>{form.date_check === null? "":form?.date_check}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="mb-2">
                  <div style={{ backgroundColor: "white", border: "none", borderRadius: "0px", width: "100%", boxSizing: "border-box", margin: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <div style={{ flex: "20%", display: "flex", justifyContent: "center", borderRadius: "10px", alignItems: "center", backgroundColor: "white" }}>
                        <div style={{ border: "5px solid #005A9F", padding: "10px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                          <FaCalendarTimes style={{ color: "#005A9F", fontSize: "24px" }} />
                        </div>
                      </div>
                      <div style={{ flex: "80%", padding: "10px 10px 10px 5px", backgroundColor: "white" }}>
                        <div style={{ fontSize: "20px",color: "#005A9F", fontWeight: "bold" }}>Waktu</div>
                        <div style={{ fontSize: "14px", fontWeight: "bold", color: "#AEB7C0" }}>{form.time_check === null? "":form?.time_check}</div>
                      </div>
                    </div>
                  </div>
                </Col>

                <Col className="mb-2">
                  <div style={{ backgroundColor: "white", border: "none", borderRadius: "0px", width: "100%", boxSizing: "border-box", margin: "auto" }}>
                    <div style={{ display: "flex", alignItems: "center", overflow: "hidden" }}>
                      <div style={{ flex: "20%", display: "flex", justifyContent: "center", borderRadius: "10px", alignItems: "", backgroundColor: "white" }}>
                        <div style={{ border: "5px solid #005A9F", padding: "10px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "" }}>
                          <FaSign style={{ color: "#005A9F", fontSize: "24px" }} />
                        </div>
                      </div>
                      <div style={{ flex: "80%", padding: "10px 10px 10px 5px", backgroundColor: "white" }}>
                        <div style={{ fontSize: "20px",color: "#005A9F", fontWeight: "bold" }}>Note</div>
                        <textarea onChange={handleChange} name="note" value={form?.note}  style={{ width: "100%", border:"3px solid #005A9F" }}></textarea>
                      </div>
                    </div>
                  </div>
                </Col>

               <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"center" }}>
                <div>
                  <Button className="mt-1" type='submit' color='info' block style={{color:"white", padding: "8px 25px", fontSize: "12px", borderRadius: "5px"}}>
                    Simpan
                  </Button>
                </div>
              </div>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
