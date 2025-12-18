import { useState, useEffect } from "react";
import { Form, Button } from 'reactstrap';
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

export default function DataTingkatanAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  // Data
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getSekolah, setGetSekolah] = useState([]);

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseCabang = async () => {
      const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDataCabang(response.data.data);
  } 

  useEffect(() => {
      GetResponseCabang();
  }, [])

  const [form, setForm] = useState({
    name_level: "",
    ysb_branch_id: "",
    ysb_school_id: "",
    user_id:"",
  });

  const GetResponseSekolah = async () => {
          try {
             const response = await APIMS.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetSekolah(response.data.data)
              }
          } catch (error) {
              swal({
              title: 'Failed',
              text: `${error.response.data.message}`,
              icon: 'error',
              timer: 3000,
              buttons: false
              });
          }
    }
  
  useEffect(() => {
    if (form?.ysb_branch_id) {
      GetResponseSekolah()     
    }
  }, [form?.ysb_branch_id]);

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
      const response = await APIMS.post("/api/grade-levels/store", {
        name_level: form?.name_level,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_school_id: form?.ysb_school_id,
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
        <h5>Tambah Tingkatan</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Tingkatan
            </label>
            <input  className="label-input-form"  type='text' name="name_level" onChange={handleChange} placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}</style>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" value={form?.ysb_branch_id} className="select-form" >
                <option value="" hidden>Pilih Cabang..</option>
                {getDataCabang.map((cabang,index) => (
                  <option key={index} value={cabang?.branch_code} >{cabang?.branch_name}</option>
                ))}         
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Sekolah </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" className="select-form" >
                <option value="" hidden>Pilih Sekolah..</option>
                {getSekolah.map((school,index) => (
                  <option key={index} value={school?.school_code} >{school?.school_name}</option>
                ))}         
              </select>
          </div>

        <div className="d-flex">
          <div className="ml-auto">
            <Button  className="mt-4 btn-modal-create" type='submit'>
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
  