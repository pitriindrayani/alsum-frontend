import { useEffect, useState } from "react";
import { Form, Button, Col, Row } from 'reactstrap';
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

export default function ModalSekolahAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const storageBranch = localStorage.getItem('ysb_branch_id');

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    ysb_branch_id: "",
    school_name: "",
    school_code: "",
    npsn: "",
    province: "",
    district: "",
    subdistrict: "",
    address: "",
    postal_code: "",
    edu_stage: "",
    phone: "",
    website: "",
    email: "",
    school_logo: "",
    nss: "",
    village: "",
    footer_school_name: "",
    akreditasi: ""
  });

  const {
    ysb_branch_id,
    school_name,
    school_code,
    npsn,
    province,
    district,
    subdistrict,
    address,
    postal_code,
    edu_stage,
    phone,
    website,
    email,
    school_logo,
    nss,
    village,
    footer_school_name,
    akreditasi
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
      const response = await APIMS.post("/api/schools/store", {
        ysb_branch_id: form?.ysb_branch_id,
        school_name: form?.school_name,
        school_code: form?.school_code,
        npsn: form?.npsn,
        province: form?.province,
        district: form?.district,
        subdistrict: form?.subdistrict,
        address: form?.address,
        postal_code: form?.postal_code,
        edu_stage: form?.edu_stage,
        phone: form?.phone,
        website: form?.website,
        email: form?.email,
        school_logo: form?.school_logo,
        nss: form?.nss,
        village: form?.village,
        footer_school_name: form?.footer_school_name,
        akreditasi: form?.akreditasi
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
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        <h5>Tambah Sekolah</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >

        <div>
              <label className="label-form" >Pilih Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" className="select-form" >
                <option value="" hidden>Pilih Cabang..</option>
                {getData.map((user,index) => (
                  <option value={user?.branch_code} >{user?.branch_name}</option>
                ))}         
              </select>
        </div>

        <Row>
          <Col md='6'>
           <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Kode Sekolah
              </label>
              <input className="label-input-form"  type='text' name="school_code" onChange={handleChange} value={school_code}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Nama Sekolah
              </label>
              <input className="label-input-form"  type='text' name="school_name" onChange={handleChange} value={school_name}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Npsp
              </label>
              <input className="label-input-form"  type='text' name="npsn" onChange={handleChange} value={npsn}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Provinsi
              </label>
              <input className="label-input-form"  type='text' name="province" onChange={handleChange} value={province}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Kota/Kabupaten
              </label>
              <input className="label-input-form"  type='text' name="district" onChange={handleChange} value={district}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Alamat
              </label>
              <input className="label-input-form"  type='text' name="address" onChange={handleChange} value={address}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Kode Pos
              </label>
              <input className="label-input-form"  type='text' name="postal_code" onChange={handleChange} value={postal_code}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Jenjang Pendidikan
              </label>
              <input className="label-input-form"  type='text' name="edu_stage" onChange={handleChange} value={edu_stage}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                No Tlp
              </label>
              <input className="label-input-form"  type='text' name="phone" onChange={handleChange} value={phone}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Website
              </label>
              <input className="label-input-form"  type='text' name="website" onChange={handleChange} value={website}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Email
              </label>
              <input className="label-input-form"  type='text' name="email" onChange={handleChange} value={email}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Logo Sekolah
              </label>
              <input className="label-input-form"  type='text' name="school_logo" onChange={handleChange} value={school_logo}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                NSS
              </label>
              <input className="label-input-form"  type='text' name="nss" onChange={handleChange} value={nss}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Desa
              </label>
              <input className="label-input-form"  type='text' name="village" onChange={handleChange} value={village}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Nama Footer Sekolah
              </label>
              <input className="label-input-form"  type='text' name="footer_school_name" onChange={handleChange} value={footer_school_name}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
          <Col md='6'>
            <div className="mt-4 label-group-form" >
              <label className="label-name-form">
                Akreditasi
              </label>
              <input className="label-input-form"  type='text' name="akreditasi" onChange={handleChange} value={akreditasi}  
                placeholder='...'/>
              <style>{`input::placeholder { color: #B9B9B9;}`}
              </style>
            </div>
          </Col>
        </Row>
            


          

          

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
  