import { useEffect, useRef, useState } from "react";
import { Form, Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import axios from "axios";

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataHolidayType, setGetDataHolidayType] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const [isCheckMulti, setIsCheckMulti] = useState(false); 
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
  
  const toggleSwitchPuasa = () => {
    setIsCheckMulti(prevState => !prevState);
  };

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      setLoading(true);
      const [school,holidayType] = await axios.all([
        API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/holiday-types?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
      ]);

      if (school.status === 200 &&holidayType.status === 200){
        setGetDataSchool(school.data.data)
        setGetDataHolidayType(holidayType.data.data)
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  useEffect(() => {
    fetchDataRef.current = fetchData;
    fetchDataRef.current();
  }, []);

  const [form, setForm] = useState({
    ysb_school_id: "",
    holiday_name: "",
    holiday_date: "",
    holiday_date_end: "",
    holiday_weekday: "",
    holiday_type_id: ""
  });

  const {
    holiday_name,
    holiday_date,
    holiday_date_end,
  } = form;

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
      const response = await API.post("/api/holidays/store", {
        ysb_school_id: form?.ysb_school_id,
        holiday_name: form?.holiday_name,
        holiday_date: form?.holiday_date,
        holiday_date_end: isCheckMulti === false? form?.holiday_date : form?.holiday_date_end,
        holiday_weekday: form?.holiday_weekday,
        holiday_type_id: form?.holiday_type_id
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
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Tambah Kalender Libur
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="" >
        <div style={{display:"flex"}}>
        <div style={{display:"flex", justifyContent:"start"}}> 
            <div className="mr-1" style={{display:"flex", alignItems:"center", fontSize:"15px", fontWeight:"bold", fontStyle:"revert"}}>
              Multi Tanggal
            </div>
            <div style={{display:"flex", alignItems:"center"}}>
              <label className="toggle-switch">
                <input type="checkbox" checked={isCheckMulti} onChange={toggleSwitchPuasa} />
                <span className="switch"></span>
              </label>
            </div>
          </div>
        </div>

          <div className="mt-3" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Nama Sekolah..</option>
                {getDataSchool.map((user,index) => (
                  <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange}  name="holiday_type_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Tipe Tanggal Libur..</option>
                {getDataHolidayType.map((user,index) => (
                  <option value={user?.holiday_index} style={{textAlign:""}}>{user?.holiday_type}</option>
                ))}   
              </select>
            </div>
          </div>

        {isCheckMulti === false ? 
          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Libur
            </label>
          <input type="date" name="holiday_date" onChange={handleChange} value={holiday_date} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>
          :
          <>
          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Awal
            </label>
          <input type="date" name="holiday_date" onChange={handleChange} value={holiday_date} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>

        <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal Akhir
            </label>
          <input type="date" name="holiday_date_end" onChange={handleChange} value={holiday_date_end} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>
        </>
          }

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Keterangan Libur
            </label>
            <input type='text' name="holiday_name" onChange={handleChange} value={holiday_name}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Jumlah Hari
            </label>
            <input type='text' name="holiday_weekday" onChange={handleChange} value={holiday_weekday}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}
        
          <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
            <div>
              <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
                Tambahkan
              </Button>
            </div>
          </div>
        </Form>
        
      </Modal.Body>
      {/* <Modal.Footer>
        <div style={{ display: "flex" }}>
          <Button onClick={props.onHide} style={{marginRight:"8px"}}>Close</Button>
        </div>
      </Modal.Footer> */}
   
    </Modal>
    </div>
   
    );
}
  