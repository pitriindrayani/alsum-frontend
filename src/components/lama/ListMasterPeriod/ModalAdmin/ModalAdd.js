import { useEffect, useRef, useState } from "react";
import { Form, Button, Col, Row } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes, FaTimesCircle } from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import "./Style.css"

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    period_start: "",
    period_end: "",
    in_time_hours: "",
    in_time_minute: "",
    out_time_hours:"",
    out_time_minute: "",
    alazhar_title: "",
    alazhar_pic: "",
    // puasa
    period_start_puasa: "",
    period_end_puasa:"",
    in_time_hours_puasa: "",
    in_time_minute_puasa:"",
    out_time_hours_puasa: "",
    out_time_minute_puasa: ""
    // libur
  });

  const {
    period_start,
    period_end,
    alazhar_title,
    alazhar_pic,
    // puasa
    period_start_puasa,
    period_end_puasa,
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
      const response = await API.post("/api/periods/store", {
        period_start: form?.period_start,
        period_end: form?.period_end,
        in_time: `${form?.in_time_hours}:${form?.in_time_minute}`,
        out_time: `${form?.out_time_hours}:${form?.out_time_minute}`,
        alazhar_title: form?.alazhar_title,
        alazhar_pic: form?.alazhar_pic,
        // puasa
        period_start_puasa: form?.period_start_puasa,
        period_end_puasa:form?.period_end_puasa,
        in_time_puasa: form?.in_time_hours_puasa === "" ? "" : `${form?.in_time_hours_puasa}:${form?.in_time_minute_puasa}`,
        out_time_puasa: form?.out_time_hours_puasa === "" ? "" : `${form?.out_time_hours_puasa}:${form?.out_time_minute_puasa}`,
      
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

  const [isCheckedPuasa, setIsCheckedPuasa] = useState(false); 
  const toggleSwitchPuasa = () => {
    setIsCheckedPuasa(prevState => !prevState);
  };

  return (
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Tambah Periode
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <div style={{display:"flex"}}>

          <div style={{display:"flex", justifyContent:"start"}}> 
              <div className="mr-1" style={{display:"flex", alignItems:"center", fontSize:"15px", fontWeight:"bold", fontStyle:"revert"}}>
                Ramadhan
              </div>
              <div style={{display:"flex", alignItems:"center"}}>
                <label className="toggle-switch">
                  <input type="checkbox" checked={isCheckedPuasa} onChange={toggleSwitchPuasa} />
                  <span className="switch"></span>
                </label>
              </div>
            </div>
          </div>
        
          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
              border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
              <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                  padding: '0 5px', fontSize: '15px' }}>
                  Periode Awal
              </label>
            <input type="date" name="period_start" onChange={handleChange} value={period_start} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                cursor:"pointer"}}/>
            <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>

          <div className="mt-4" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
              border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
              <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                  padding: '0 5px', fontSize: '15px' }}>
                  Periode Akhir
              </label>
            <input type="date" name="period_end" onChange={handleChange} value={period_end} placeholder="...." 
              onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                cursor:"pointer"}}/>
            <style>{`input::placeholder { color: #B9B9B9; }`}</style>
          </div>

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
              Jabatan Ypi
            </label>
            <input type='text' name="alazhar_title" onChange={handleChange} value={alazhar_title}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Pic Ypi
            </label>
            <input type='text' name="alazhar_pic" onChange={handleChange} value={alazhar_pic}  
              placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          {isCheckedPuasa === false ? 
          <></>
          :
          <>
            <div className="mt-4" style={{display:"flex", justifyContent:"center", fontFamily:"Poppins", color:"#2e649d" }}>
               ----- Jadwal Ramadhan -----
            </div>
            <div className="mt-3" style={{position: 'relative', display: 'flex', alignItems: 'center', backgroundColor: 'transparent', 
                border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',cursor: 'pointer', height: "42px", width: "100%"}}>
                <label style={{position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
                    padding: '0 5px', fontSize: '15px' }}>
                    Tanggal Awal
                </label>
              <input type="date" name="period_start_puasa" onChange={handleChange} value={period_start_puasa} placeholder="...." 
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
              <input type="date" name="period_end_puasa" onChange={handleChange} value={period_end_puasa} placeholder="...." 
                onFocus={(e) => e.target.showPicker()} style={{backgroundColor: 'transparent', border: 'none', 
                  width:"100%",outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',
                  cursor:"pointer"}}/>
              <style>{`input::placeholder { color: #B9B9B9; }`}</style>
            </div>

            <div className="mt-2">
              <div style={{backgroundColor: '#fff', color: '#2e649d',fontSize: '15px' }}>
                  Jam Masuk
              </div>
              <div style={{  display: 'flex'}}>
                  <select className="mr-2" aria-label="Default select example"  onChange={handleChange}  name="in_time_hours_puasa" style={{color:"#2e649d", textAlign:"center", 
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
                  <select aria-label="Default select example"  onChange={handleChange}  name="in_time_minute_puasa" style={{color:"#2e649d", textAlign:"center", 
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
                  <select className="mr-2" aria-label="Default select example"  onChange={handleChange}  name="out_time_hours_puasa" style={{color:"#2e649d", textAlign:"center", 
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
                  <select aria-label="Default select example"  onChange={handleChange}  name="out_time_minute_puasa" style={{color:"#2e649d", textAlign:"center", 
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
          </>
          }
        
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
  