import { useEffect, useRef, useState } from "react";
import { Form,Button } from 'reactstrap';
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalCabangUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  // console.log(props)
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
    branch_code: "",
    branch_name: "",
    parent_id: ""
  });

  useEffect(() => {
    setForm({
      ...form, 
      branch_code: `${props?.branchCodeUpdate}`,
      branch_name: `${props?.branchNameUpdate}`,
      parent_id: `${props?.parentIdUpdate}`
    });
  }, [props])

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
  
      // Insert data for login process
      const response = await APIMS.put(`/api/branches/${props.id}`, {
        branch_code: form?.branch_code,
        branch_name: form?.branch_name,
        parent_id: form?.parent_id,
      }, fetchParams);
  
      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
      // setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
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
            <h5>Update Cabang</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Kode Cabang
            </label>
            <input className="label-input-form"  type='text' name="branch_code" onChange={handleChange} value={form?.branch_code}   
              placeholder='Masukan Kode Cabang'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Cabang
            </label>
            <input  className="label-input-form"  type='text' name="branch_name" onChange={handleChange} value={form?.branch_name}
              placeholder='Masukan Nama Cabang' />
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
  