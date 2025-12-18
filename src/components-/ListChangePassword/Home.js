import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { FaKey } from "react-icons/fa";
import Swal from "sweetalert2";
import "../../index.css";
import { API } from "../../config/api";
import swal from "sweetalert";
import ToastSuccess from "../NotificationToast/ToastSuccess"
import LoaderHome from "../Loader/LoaderHome"


export default function GantiPassword() {
  document.title = "Ganti Password";
  const storageItems = JSON.parse(localStorage.getItem('email_admin'));
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setForm({
      ...form, 
      email: `${storageItems}`,
    });
  }, [storageItems])

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form?.newPassword !== form.confirmPassword) {
      Swal.fire("Oops!", "Password baru dan konfirmasi tidak cocok!", "error");
      return;
    }
    try {
      setLoading(true);
      const response = await API.put("/api/change-passwords", {
        email: form.email,
        password: form.oldPassword,
        new_password: form.newPassword,
      },fetchParams);
      if (response?.status === 200) {
        setForm({
          email: storageItems,
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
          background: '#1d3557', 
          color: '#ffffff'
        })
      }
      setLoading(false);
    }catch(error){
      swal({
        title: 'Failed',
        text: error?.response?.data?.message || "Terjadi kesalahan",
        icon: 'error',
        timer: 10000,
        buttons: false
      });
      setLoading(false);
    }
  };
  
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "85vh",
        padding: "0 15px",
      }}
    >
      {loading && <LoaderHome />}
      
      <Row className="justify-content-center w-100">
        <Col xs="12" sm="10" md="8" lg="6" xl="5">
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div
              className="text-white d-flex align-items-center justify-content-center mb-4"
              style={{
                backgroundColor: "#9898c0ff",
                padding: "12px",
                borderRadius: "5px",
                fontSize: "18px",
              }}
            >
              <FaKey className="me-2" />
              Ganti Password
            </div>

            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={form?.email}
                  onChange={handleChange}
                  disabled
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="oldPassword">Password Lama</Label>
                <Input
                  type="password"
                  name="oldPassword"
                  id="oldPassword"
                  value={form.oldPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="newPassword">Password Baru</Label>
                <Input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label for="confirmPassword">Konfirmasi Password Baru</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <div className="d-grid mt-3">
                <Button style={{backgroundColor:"#4747AC"}}  type="submit">
                  Simpan Perubahan
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
