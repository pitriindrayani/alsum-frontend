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
import { Description } from "@material-ui/icons";

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const handleCheckboxChange = (id) => {
    setSelectedTeachers((prev) => 
      prev.includes(id) ? prev.filter(teacherId => teacherId !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (isAllChecked) {
      setSelectedTeachers([]); 
    } else {
      setSelectedTeachers(getDataTeacher.map((teacher) => teacher.id));
    }
    setIsAllChecked(!isAllChecked);
  };
  
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

  const [form, setForm] = useState({
    ysb_school_id: "",
    ysb_branch_id: "",
    date_in: "",
    date_out: "",
    in_time_hours: "",
    in_time_minute: "",
    out_time_hours: "",
    out_time_minute: "",
    description: ""
  });

  const GetResponseDataBranch = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetDataBranch(response.data.data)
        setLoading(false)
        }
    } catch (error) {
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const GetResponseDataSchool = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form?.ysb_branch_id}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetDataSchool(response.data.data)
        setLoading(false)
        }
    } catch (error) {
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const GetResponseDataTeacher = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await API.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ysb_school_id=${form?.ysb_school_id}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetDataTeacher(response.data.data)
        setLoading(false)
        }
    } catch (error) {
      setLoading(false)
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  }

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };

  useEffect(() => {
    GetResponseDataBranch()
  },[])

  useEffect(() => {
    if(form?.ysb_branch_id){
      GetResponseDataSchool()
    }
  }, [form?.ysb_branch_id])

  useEffect(() => {
    if(form?.ysb_school_id){
        GetResponseDataTeacher()
    }
  }, [form?.ysb_school_id])

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await API.post("/api/schedule-times/store", {
        date_in: form?.date_in,
        date_out: isCheckMulti === false? form?.date_in : form?.date_out,
        time_in: `${form?.in_time_hours}:${form?.in_time_minute}`,
        time_out: `${form?.out_time_hours}:${form?.out_time_minute}`,
        description: form?.description,
        array_id_teacher: selectedTeachers,       
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
          Tambah Kalender Shift Guru
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


        {isCheckMulti === false ? 
        <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
            border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
            <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                padding: '0 5px', fontSize: '15px' }}>
                Tanggal
            </label>
          <input type="date" name="date_in" onChange={handleChange} value={form?.date_in} placeholder="...." 
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
          <input type="date" name="date_in" onChange={handleChange} value={form?.date_in} placeholder="...." 
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
          <input type="date" name="date_out" onChange={handleChange} value={form?.date_out} placeholder="...." 
            onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
              width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
              cursor:"pointer"}}/>
          <style>{`input::placeholder { color: #B9B9B9; }`}</style>
        </div>
        </>
        }

          <div className="mt-2">
            <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                Jam Masuk
            </div>
            <div style={{  display: 'flex'}}>
                <select className="mr-2" aria-label="Default select example"  onChange={handleChange}  name="in_time_hours" style={{color:"#2e649d", textAlign:"center", 
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
                  <option value="22">22</option>
                  <option value="23">23</option>

                </select>
                <select aria-label="Default select example"  onChange={handleChange}  name="in_time_minute" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Menit..</option>
                  <option value="00:00">00</option>
                  <option value="01:00">01</option>
                  <option value="02:00">02</option>
                  <option value="03:00">03</option>
                  <option value="04:00">04</option>
                  <option value="05:00">05</option>
                  <option value="06:00">06</option>
                  <option value="07:00">07</option>
                  <option value="08:00">08</option>
                  <option value="09:00">09</option>
                  <option value="10:00">10</option>
                  <option value="11:00">11</option>
                  <option value="12:00">12</option>
                  <option value="13:00">13</option>
                  <option value="14:00">14</option>
                  <option value="15:00">15</option>
                  <option value="16:00">16</option>
                  <option value="17:00">17</option>
                  <option value="18:00">18</option>
                  <option value="19:00">19</option>
                  <option value="20:00">20</option>
                  <option value="21:00">21</option>
                  <option value="22:00">22</option>
                  <option value="23:00">23</option>
                  <option value="24:00">24</option>
                  <option value="25:00">25</option>
                  <option value="26:00">26</option>
                  <option value="27:00">27</option>
                  <option value="28:00">28</option>
                  <option value="29:00">29</option>
                  <option value="30:00">30</option>
                  <option value="31:00">31</option>
                  <option value="32:00">32</option>
                  <option value="33:00">33</option>
                  <option value="34:00">34</option>
                  <option value="35:00">35</option>
                  <option value="36:00">36</option>
                  <option value="37:00">37</option>
                  <option value="38:00">38</option>
                  <option value="39:00">39</option>
                  <option value="40:00">40</option>
                  <option value="41:00">41</option>
                  <option value="42:00">42</option>
                  <option value="43:00">43</option>
                  <option value="44:00">44</option>
                  <option value="45:00">45</option>
                  <option value="46:00">46</option>
                  <option value="47:00">47</option>
                  <option value="48:00">48</option>
                  <option value="49:00">49</option>
                  <option value="50:00">50</option>
                  <option value="51:00">51</option>
                  <option value="52:00">52</option>
                  <option value="53:00">53</option>
                  <option value="54:00">54</option>
                  <option value="55:00">55</option>
                  <option value="56:00">56</option>
                  <option value="57:00">57</option>
                  <option value="58:00">58</option>
                  <option value="59:00">59</option>
                </select>
            </div>
          </div>

          <div className="mt-2">
            <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                Jam Keluar
            </div>
            <div style={{  display: 'flex'}}>
                <select className="mr-2" aria-label="Default select example"  onChange={handleChange}  name="out_time_hours" style={{color:"#2e649d", textAlign:"center", 
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
                  <option value="22">22</option>
                  <option value="23">23</option>
                </select>
                <select aria-label="Default select example"  onChange={handleChange}  name="out_time_minute" style={{color:"#2e649d", textAlign:"center", 
                  cursor:"pointer", border:"2px solid #2e649d",width:"30%", height:"45px", borderRadius:"5px"}}>
                  <option value="" hidden>Menit..</option>
                  <option value="00:00">00</option>
                  <option value="01:00">01</option>
                  <option value="02:00">02</option>
                  <option value="03:00">03</option>
                  <option value="04:00">04</option>
                  <option value="05:00">05</option>
                  <option value="06:00">06</option>
                  <option value="07:00">07</option>
                  <option value="08:00">08</option>
                  <option value="09:00">09</option>
                  <option value="10:00">10</option>
                  <option value="11:00">11</option>
                  <option value="12:00">12</option>
                  <option value="13:00">13</option>
                  <option value="14:00">14</option>
                  <option value="15:00">15</option>
                  <option value="16:00">16</option>
                  <option value="17:00">17</option>
                  <option value="18:00">18</option>
                  <option value="19:00">19</option>
                  <option value="20:00">20</option>
                  <option value="21:00">21</option>
                  <option value="22:00">22</option>
                  <option value="23:00">23</option>
                  <option value="24:00">24</option>
                  <option value="25:00">25</option>
                  <option value="26:00">26</option>
                  <option value="27:00">27</option>
                  <option value="28:00">28</option>
                  <option value="29:00">29</option>
                  <option value="30:00">30</option>
                  <option value="31:00">31</option>
                  <option value="32:00">32</option>
                  <option value="33:00">33</option>
                  <option value="34:00">34</option>
                  <option value="35:00">35</option>
                  <option value="36:00">36</option>
                  <option value="37:00">37</option>
                  <option value="38:00">38</option>
                  <option value="39:00">39</option>
                  <option value="40:00">40</option>
                  <option value="41:00">41</option>
                  <option value="42:00">42</option>
                  <option value="43:00">43</option>
                  <option value="44:00">44</option>
                  <option value="45:00">45</option>
                  <option value="46:00">46</option>
                  <option value="47:00">47</option>
                  <option value="48:00">48</option>
                  <option value="49:00">49</option>
                  <option value="50:00">50</option>
                  <option value="51:00">51</option>
                  <option value="52:00">52</option>
                  <option value="53:00">53</option>
                  <option value="54:00">54</option>
                  <option value="55:00">55</option>
                  <option value="56:00">56</option>
                  <option value="57:00">57</option>
                  <option value="58:00">58</option>
                  <option value="59:00">59</option>
                </select>
            </div>
          </div>

        <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
            cursor: 'pointer', height:"42px", width:""}}>
          <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
            padding: '0 5px', fontSize: '15px' }}>
            Keterangan
          </label>
          <input type='text' name="description" onChange={handleChange}  
            placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
            outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
          <style>{`input::placeholder { color: #B9B9B9;}`}
          </style>
        </div>

        <div className="mt-3" style={{ display: "flex"}}>
          <div style={{ display:"flex", width:"100%"}}>
            <select ref={nameInputRef} aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" style={{color:"#2e649d", textAlign:"", 
              cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
              <option value="" hidden>Nama Branch..</option>
              {getDataBranch.map((user,index) => (
                <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
              ))}         
            </select>
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

        {getDataTeacher.length !== 0?
        <div className="mt-3">
            <div style={{ color: "#2e649d", fontFamily:"Poppins" }}>List Guru :</div>
            <div style={{display:"flex", borderTop:"3px solid #2e649d"}}></div>

            {/* Checkbox untuk Pilih Semua */}
            <div className="mt-2">
              <label style={{ fontWeight: "" }}>
                <input 
                  type="checkbox" 
                  checked={isAllChecked} 
                  onChange={handleCheckAll} 
                  style={{
                    transform: "scale(1.2)",  
                    marginRight: "5px",       
                    cursor: "pointer"     
                  }} 
                /> Pilih Semua
              </label>
            </div>

            {/* Checkbox untuk Setiap Guru dalam Dua Kolom */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {Array.from({ length: Math.ceil(getDataTeacher.length / 10) }, (_, colIndex) => (
                <div key={colIndex} style={{ flex: 1, minWidth: "200px" }}>
                  {getDataTeacher.slice(colIndex * 10, (colIndex + 1) * 10).map((teacher) => (
                    <label key={teacher.id} style={{ display: "block", marginBottom: "5px" }}>
                      <input 
                        type="checkbox" 
                        value={teacher.id} 
                        checked={selectedTeachers.includes(teacher.id)} 
                        onChange={() => handleCheckboxChange(teacher.id)} 
                        style={{
                          transform: "scale(1.2)",  
                          marginRight: "5px",       
                          cursor: "pointer"       
                        }} 
                      />
                      {" "}{teacher.full_name}
                    </label>
                  ))}
                </div>
              ))}
            </div>

            {/* Menampilkan ID Guru yang Dipilih */}
            {/* <div className="mt-3">
              <strong>ID Guru yang Dipilih:</strong> {JSON.stringify(selectedTeachers)}
            </div> */}
          </div>
        : <></>}
        
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
  