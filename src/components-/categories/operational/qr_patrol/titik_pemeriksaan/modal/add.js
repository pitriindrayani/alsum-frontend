import { useState, useEffect, useRef } from "react";
import { Form, Button } from 'reactstrap';
import { APIMS } from "../../../../../../config/apims";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderAction";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalListCheckPointAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [data, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  
  const [checkPoint, setCheckPoint] = useState();

  const onChangeComboBox = (e) => {
    const selectedId = e.target.value;
    const selectedCheckPoint = data.filter((d) => d.id == selectedId)[0];
    setCheckPoint(selectedCheckPoint);

     setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };


  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    const response = await APIMS.get(`/api/access/rooms?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
    setGetData(response.data.data)
  }

  useEffect(() => {
      GetResponseData()
  }, [])

  const [form, setForm] = useState({
    ysb_room_id: "",
    ysb_floor_id: "",
    ysb_branch_id: "",
    ysb_school_id : "",
    user_id: ""
  });

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await APIMS.post("/api/check-points/store", {
        ysb_room_id: form?.ysb_room_id,
        user_id: form?.user_id
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
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" >  

      <div className="d-flex header-modal">
        <h5>Tambah Check Point</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >        

          <div className="mt-2" >
            <label className="label-form" >Check Point </label>
              <select aria-label="Default select example" name="ysb_room_id" className="select-form"  onChange={(e) => { onChangeComboBox(e); }} >
                <option value="" hidden>Pilih Check Point..</option>
                {data.map((ruangan,index) => (
                  <option key={index} value={ruangan?.id} >{ruangan?.name_room} - {ruangan?.name_branch}</option>
                ))}         
              </select>
          </div>
          
           {checkPoint ? (
                <>
                 
                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Lantai
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={checkPoint?.name_floor} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>

                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Cabang
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={checkPoint?.name_branch} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>

                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Cabang
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={checkPoint?.name_school} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>
                </>
                
              ) : (
                ""
          )}
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
  