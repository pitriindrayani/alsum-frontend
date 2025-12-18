import { useState, useEffect } from "react";
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

export default function ModalTutup(props) {
  const token = localStorage.getItem("token");

  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");


  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

   // Data
  const [getDimensi, setGetDimensi] = useState([]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseDimensi = async () => {
      const response = await APILA.get(`/api/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDimensi(response.data.data);
  }
  
  useEffect(() => {
    GetResponseDimensi();
  }, [])
  

  const [form, setForm] = useState({
    name_element: "",
    ysb_dimensi_id: "",
    description: "",
    output_id_user: "",
    user_id:"",
  });

  const {
    name_element,
    ysb_dimensi_id,
    description,
  } = form;

   const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };

  // const handleSubmit = useMutation(async (e) => {
  //   try {
  //     e.preventDefault();
  //     setLoading(true)
  //     // Insert data for login process
  //     const response = await APILA.post("/api/elements/store", {
  //       name_element: form?.name_element,
  //       ysb_dimensi_id: form?.ysb_dimensi_id,
  //       description: form?.description,
  //       user_id: output_id_user,
  //     }, fetchParams);
  //     // Checking process
  //     if (response?.status === 200) {
  //       ToastSuccess.fire({
  //         icon: 'success',
  //         title: response.data.message,
  //       })
  //       props.GetResponseData();
  //       props.onHide();
  //       setLoading(false)
  //     }
  //   } catch (error) {
  //     swal({
  //       title: 'Failed',
  //       text: `${error.response.data.message}`,
  //       icon: 'error',
  //       timer: 10000,
  //       buttons: false
  //     });
  //     setLoading(false);
  //     props.onHide();
  //   }
  // });

   const handleSubmit = useMutation(async (e) => {
      e.preventDefault();
     props.onHide();
       props.setIsOpen();
    
  });

   const submitYa = (e) => {
    e.preventDefault();
       props.onHide();
       props.setIsOpen();
    };

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        {/* <h5>Tambah Element</h5> */}

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      {/* <hr/> */}

      <Modal.Body className="modal-body mt-2">
        <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <h6 className="text-center">
             Yakin Kunci Penilaian Kepala Sekolah ?
          </h6>
         

          {/* <div className="mt-3">
              <label className="label-form" >Dimensi </label>
                <select aria-label="Default select example"  onChange={handleChange}  name="ysb_dimensi_id" className="select-form" >
                  <option value="" hidden>Pilih Dimensi..</option>
                  {getDimensi.map((dimensi,index) => (
                    <option value={dimensi?.id} >{dimensi?.name_dimensi}</option>
                  ))}         
                </select>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Judul Element
            </label>
            <input className="label-input-form" autoFocus type='text' name="name_element" onChange={handleChange} value={name_element}  
              placeholder='...'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kegiatan
            </label>
            <input  className="label-input-form"  type='text' name="description" onChange={handleChange} value={description}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          <div className="d-flex">
            <div className="ml-auto">
              <Button  className="mt-4 btn-primary" type='submi' style={{backgroundColor : "#0b48ffff"}} >
                Ya
              </Button>
              <Button className="mt-4 ml-3  btn-secondary" type='submit'>
                Tidak
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  