import {  useState, useEffect, useRef } from "react";
import { Form,Button, Row, Col } from 'reactstrap';
import { APIMS } from "../../../../../../config/apims";
import { FaTimes} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    stages: "",
    stages_name: "",
    seq: "",
    min_grade : "",
    max_grade: ""
  });

  useEffect(() => {
    setForm({
    ...form,
      ysb_branch_id: safeValue(props?.dataUpdate?.ysb_branch_id),
      school_name: safeValue(props?.dataUpdate?.school_name),
      school_code: safeValue(props?.dataUpdate?.school_code),
      npsn: safeValue(props?.dataUpdate?.npsn),
      province: safeValue(props?.dataUpdate?.province),
      district: safeValue(props?.dataUpdate?.district),
      subdistrict: safeValue(props?.dataUpdate?.subdistrict),
      address: safeValue(props?.dataUpdate?.address),
      postal_code: safeValue(props?.dataUpdate?.postal_code),
      edu_stage: safeValue(props?.dataUpdate?.edu_stage),
      phone: safeValue(props?.dataUpdate?.phone),
      website: safeValue(props?.dataUpdate?.website),
      email: safeValue(props?.dataUpdate?.email),
      school_logo: safeValue(props?.dataUpdate?.school_logo),
      nss: safeValue(props?.dataUpdate?.nss),
      village: safeValue(props?.dataUpdate?.village),
      footer_school_name: safeValue(props?.dataUpdate?.footer_school_name),
      akreditasi: safeValue(props?.dataUpdate?.akreditasi),
    });
  },[props])

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
      const response = await APIMS.put(`/api/schools/${props.id}`, {
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
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
      setLoading(false)
    }
  });

  return (
    <div className="modal">
      {loading && <LoaderAction/>}
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >  

        <div className="d-flex header-modal">
            <h5>Update Sekolah</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
         <div>
            <label className="label-form" >Pilih Cabang </label>
            <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" value={form?.ysb_branch_id}className="select-form" >
            <option value=""  hidden>Pilih Cabang..</option>
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
                      <input className="label-input-form" autoFocus type='text' name="school_code" onChange={handleChange} value={form?.school_code}  
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
                      <input className="label-input-form" autoFocus type='text' name="school_name" onChange={handleChange} value={form?.school_name}  
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
                      <input className="label-input-form" autoFocus type='text' name="npsn" onChange={handleChange} value={form?.npsn}  
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
                      <input className="label-input-form" autoFocus type='text' name="province" onChange={handleChange} value={form?.province}  
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
                      <input className="label-input-form" autoFocus type='text' name="district" onChange={handleChange} value={form?.district}  
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
                      <input className="label-input-form" autoFocus type='text' name="address" onChange={handleChange} value={form?.address}  
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
                      <input className="label-input-form" autoFocus type='text' name="postal_code" onChange={handleChange} value={form?.postal_code}  
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
                      <input className="label-input-form" autoFocus type='text' name="edu_stage" onChange={handleChange} value={form?.edu_stage}  
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
                      <input className="label-input-form" autoFocus type='text' name="phone" onChange={handleChange} value={form?.phone}  
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
                      <input className="label-input-form" autoFocus type='text' name="website" onChange={handleChange} value={form?.website}  
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
                      <input className="label-input-form" autoFocus type='text' name="email" onChange={handleChange} value={form?.email}  
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
                      <input className="label-input-form" autoFocus type='text' name="school_logo" onChange={handleChange} value={form?.school_logo}  
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
                      <input className="label-input-form" autoFocus type='text' name="nss" onChange={handleChange} value={form?.nss}  
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
                      <input className="label-input-form" autoFocus type='text' name="village" onChange={handleChange} value={form?.village}  
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
                      <input className="label-input-form" autoFocus type='text' name="footer_school_name" onChange={handleChange} value={form?.footer_school_name}  
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
                      <input className="label-input-form" autoFocus type='text' name="akreditasi" onChange={handleChange} value={form?.akreditasi}  
                        placeholder='...'/>
                      <style>{`input::placeholder { color: #B9B9B9;}`}
                      </style>
                    </div>
                  </Col>
                </Row>
                    

            <div className="d-flex">
              <div className="ml-auto">
                <Button className="mt-4 btn-modal-create" type='submit'>
                  Perbarui
                </Button>
              </div>
            </div>
        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  