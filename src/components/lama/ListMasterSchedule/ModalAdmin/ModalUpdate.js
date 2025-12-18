import { useEffect, useRef, useState } from "react";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css"
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import axios from "axios";

export default function ModalRoleUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataPositionType, setGetDataPosition] = useState([]);
  const [getDataHolidayType, setGetDataHolidayType] = useState([]);    
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 

  console.log(props)
  // console.log(props)
  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [school,position] = await axios.all([
        API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/positions?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
      ]);

      if (school.status === 200 && position.status === 200){
        setGetDataSchool(school.data.data)
        setGetDataPosition(position.data.data)
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
    ysb_position_id: "",
    schedule_code: "",
    in_time: "",
    in_time_hours: "",
    in_time_minute: "",
    out_time: "",
    out_time_hours: "",
    out_time_minute: "",
    day_1: "",
    day_2: "",
    day_3: "",
    day_4: "",
    day_5: "",
    day_6: "",
    day_7: "",
    fg_school_default: "",
    holiday_type: ""
  });

  useEffect(() => {
    setForm({
      ...form, 
      ysb_school_id: `${props?.ysbSchoolIdUpdate}`,
      ysb_position_id: `${props?.ysbPositionIdUpdate}`,
      in_time: `${props?.inTimeUpdate}`,
      in_time_hours: `${props?.inTimeUpdate.split(':')[0]}`,
      in_time_minute: `${props?.inTimeUpdate.split(':')[1]+':00'}`,
      out_time: `${props?.outTimeUpdate}`,
      out_time_hours: `${props?.outTimeUpdate.split(':')[0]}`,
      out_time_minute: `${props?.outTimeUpdate.split(':')[1]+':00'}`,
      day_1: `${props?.day1Update}`,
      day_2: `${props?.day2Update}`,
      day_3: `${props?.day3Update}`,
      day_4: `${props?.day4Update}`,
      day_5: `${props?.day5Update}`,
      day_6: `${props?.day6Update}`,
      day_7: `${props?.day7Update}`
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
      const response = await API.put(`/api/schedules/${props.id}`, {
        ysb_school_id: form?.ysb_school_id,
        ysb_position_id: form?.ysb_position_id,
        in_time: `${form?.in_time_hours}:${form?.in_time_minute}`,
        out_time: `${form?.out_time_hours}:${form?.out_time_minute}`,
        day_1: form?.day_1,
        day_2: form?.day_2,
        day_3: form?.day_3,
        day_4: form?.day_4,
        day_5: form?.day_5,
        day_6: form?.day_6,
        day_7: form?.day_7,
        fg_school_default: 1,
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
    <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Update Kalender Libur
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
        <div className="" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select ref={nameInputRef} aria-label="Default select example" value={form?.ysb_school_id}  onChange={handleChange}  name="ysb_school_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Nama Sekolah..</option>
                {getDataSchool.map((user,index) => (
                  <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-3" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select ref={nameInputRef} aria-label="Default select example" value={form?.ysb_position_id}  onChange={handleChange}  name="ysb_position_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Jabatan..</option>
                {getDataPositionType.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.position} ({user?.position_code})</option>
                ))}         
              </select>
            </div>
          </div>

          <div className="mt-2">
            <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                Jam Masuk
            </div>
            <div style={{  display: 'flex'}}> 
                <select className="mr-2" aria-label="Default select example" value={form?.in_time_hours}  onChange={handleChange}  name="in_time_hours" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Jam..</option>
                  <option value="03">3</option>
                  <option value="04">4</option>
                  <option value="05">5</option>
                  <option value="06">6</option>
                  <option value="07">7</option>
                  <option value="08">8</option>
                  <option value="09">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="3">20</option>
                  <option value="21">21</option>
                </select>
                <select aria-label="Default select example"  onChange={handleChange} value={form?.in_time_minute}  name="in_time_minute" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Menit..</option>
                  <option value="00:00">00</option>
                  <option value="05:00">05</option>
                  <option value="10:00">10</option>
                  <option value="15:00">15</option>
                  <option value="20:00">20</option>
                  <option value="25:00">25</option>
                  <option value="30:00">30</option>
                  <option value="35:00">35</option>
                  <option value="40:00">40</option>
                  <option value="45:00">45</option>
                  <option value="50:00">50</option>
                  <option value="55:00">55</option>
                </select>
            </div>
          </div>

          <div className="mt-2">
            <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                Jam Keluar
            </div>
            <div style={{  display: 'flex'}}>
                <select className="mr-2" aria-label="Default select example" value={form?.out_time_hours}  onChange={handleChange}  name="out_time_hours" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Jam..</option>
                  <option value="03">3</option>
                  <option value="04">4</option>
                  <option value="05">5</option>
                  <option value="06">6</option>
                  <option value="07">7</option>
                  <option value="08">8</option>
                  <option value="09">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                </select>
                <select aria-label="Default select example"  onChange={handleChange} value={form?.out_time_minute}  name="out_time_minute" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Menit..</option>
                  <option value="00:00">00</option>
                  <option value="05:00">05</option>
                  <option value="10:00">10</option>
                  <option value="15:00">15</option>
                  <option value="20:00">20</option>
                  <option value="25:00">25</option>
                  <option value="30:00">30</option>
                  <option value="35:00">35</option>
                  <option value="40:00">40</option>
                  <option value="45:00">45</option>
                  <option value="50:00">50</option>
                  <option value="55:00">55</option>
                </select>
            </div>
          </div>
        
          <div className="mt-3" style={{display:'flex',cursor:'pointer'}}>
            <label style={{fontSize:'15px', color:"#2e649d"}}>
             Status :&nbsp;
            </label>
            <div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="day_1" value="1" checked={form?.day_1  === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Senin
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="day_2" value="1" checked={form?.day_2 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Selasa
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="day_3" value="1" checked={form?.day_3 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Rabu
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="day_4" value="1" checked={form?.day_4 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Kamis
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="day_5" value="1" checked={form?.day_5 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Jumat
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="_day_6" value="1" checked={form?._day_6 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Sabtu
                </label>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center',  }}>
                <label style={{color: "#2e649d",fontSize: '15px', cursor: 'pointer',display: 'flex',alignItems: 'center',gap: '5px',}}>
                  <input type="checkbox" name="_day_7" value="1" checked={form?._day_7 === '1'} onChange={handleChange} 
                    style={{cursor: 'pointer',width: '15px', height: '20px',}} />
                    Minggu
                </label>
              </div>
              
            </div>
        
          </div>

        <div style={{ padding: "0px 0px", marginTop: "0px", display:"flex", justifyContent:"end" }}>
          <div>
            <Button className="mt-3" type='submit' color='primary' block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px"}}>
              Update
            </Button>
          </div>
        </div>
        </Form>
      </Modal.Body>
    </Modal>
  </div>
    );
  }
