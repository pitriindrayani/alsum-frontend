import { useState, useEffect, useRef } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Select from "react-select";
import AsyncSelect from "react-select";

  const options = [
      { value: "indonesia", label: "Indonesiaa"},
      { value: "inggris", label: "Ingriss"},
        { value: "korea", label: "Korea"},
        { value: "indonesia", label: "Indonesiaa"},
      { value: "inggris", label: "Ingriss"},
        { value: "korea", label: "Korea"},
        { value: "indonesia", label: "Indonesiaa"},
      { value: "inggris", label: "Ingriss"},
        { value: "korea", label: "Korea"},
      ] 

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
  const nameInputRef = useRef(null); 

  const [getLantai, setnameLantai] = useState([]);
  
  const [foodState, setFoodState] = useState();

  const onChangeComboBox = (e) => {
    const selectedId = e.target.value;
    const selectedFoodState = data.filter((d) => d.id == selectedId)[0];
    setFoodState(selectedFoodState);

     setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
    // console.log(selectedFoodState)
  };

 


  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
   
    const response = await API.get(`/master-service/rooms?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);

    setGetData(response.data.data)

  }

  
    // const dataRuangan = () => {
    //     return API.get(`/master-service/rooms?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams).then(result => {
    //     const res = result.data.data;
    //     return res;
    //   })
    // }

  //  console.log('dataapa', data)

   useEffect(() => {
      GetResponseData()
    }, [])

      const [inputValue, setValue] = useState('');
      const [selectedValue, setSelectedValue] = useState(null);
      
      const handleInputChange = (value) => {
        setValue(value)
      };

      const handleChange1 = (value) => {
        setSelectedValue(value)
      };



  const [form, setForm] = useState({
    ysb_room_id: "",
    ysb_floor_id: "",
    ysb_branch_id: "",
    ysb_school_id : "",
    user_id: ""
  });

  const {
    ysb_room_id,
    ysb_floor_id,
    ysb_branch_id,
    ysb_school_id,
    user_id,
  } = form;

  // const handleChange = async (e) => {
  //   setForm({
  //     ...form,
  //     [e.target.name] : e.target.type === "radio"? e.target.value : e.target.value,
  //   });
  // };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/master-service/check-points/store", {
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
      setLoading(false)
    }

    
  });

  

  

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

      <div className="d-flex header-modal">
        <h5>Tambah Ruangan</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >


        {/* <Select
          options={options}
          value={selectedValue}
          onChange={handleChange1}
          onInputChange={handleInputChange}
        /> */}

        <div className="mt-2" >
            <label className="label-form" >Ruangan </label>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={selectedValue}
                getOptionLabel={e => e.name_room}
                getOptionValue={e => e.id}
                //  loadOptions={data}
                options={data}
                onInputChange={handleInputChange}
                onChange={handleChange1}
        
        />
        
        
        </div>

        


          {/* <div className="mt-2" >
            <label className="label-form" >Ruangan </label>
              <select aria-label="Default select example" name="ysb_room_id" className="select-form"  onChange={(e) => { onChangeComboBox(e); }} >
                <option value="" hidden>Pilih Ruangan..</option>
                {data.map((ruangan,index) => (
                  <option key={index} value={ruangan?.id} >{ruangan?.name_room}</option>
                ))}         
              </select>
          </div> */}

          
           {foodState ? (
                <>
                 
                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Lantai
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={foodState?.name_floor} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>

                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Cabang
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={foodState?.name_branch} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>

                  <div className="mt-4 label-group-form" >
                    <label className="label-name-form">
                      Cabang
                    </label>
                    <input className="label-input-form" disabled autoFocus type='text' value={foodState?.name_school} 
                      placeholder='...'/>
                    <style>{`input::placeholder { color: #B9B9B9;}`}
                    </style>
                  </div>
               
                </>

                
              ) : (
                ""
              )}
       
          {/* <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Nama Ruangan
            </label>
            <input className="label-input-form" autoFocus type='text' name="stages" onChange={handleChange} value={stages}  
              placeholder='...'/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Lantai
            </label>
            <input  className="label-input-form"  type='text' name="stages_name" onChange={handleChange} value={stages_name}  
              placeholder='...' />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Gedung
            </label>
            <input  className="label-input-form"  type='number' name="seq" onChange={handleChange} value={seq}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4 label-group-form" >
            <label className="label-name-form">
              Cabang
            </label>
            <input  className="label-input-form"  type='number' name="seq" onChange={handleChange} value={seq}  
              placeholder='...'  />
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}


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
  