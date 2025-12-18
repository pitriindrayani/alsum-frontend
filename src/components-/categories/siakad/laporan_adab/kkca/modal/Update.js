import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APILA } from "../../../../../../config/apila";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalKkcaUpdate(props) {
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

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APILA.get(`/api/kkca?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    name_kkca: "",
    persentase: "",
    user_id:"",
   
  });

  useEffect(() => {
    setForm({
    ...form,
      name_kkca: safeValue(props?.dataUpdate?.name_kkca),
      persentase: safeValue(props?.dataUpdate?.persentase),
      user_id: safeValue(props?.dataUpdate?.user_id)
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
      const response = await APILA.put(`/api/kkca/${props.id}`, {
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
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

        <div className="d-flex header-modal">
            <h5>Update KKCA</h5>
        
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
            <input className="label-input-form"  type='text' name="name_kkca" onChange={handleChange} value={form?.name_kkca}   
              placeholder='..'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

         <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Persentase
            </label>
            <input  className="label-input-form"  type='text' name="persentase" onChange={handleChange} value={form?.persentase}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

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
  