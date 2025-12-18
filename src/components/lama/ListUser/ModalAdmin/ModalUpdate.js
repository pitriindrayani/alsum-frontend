import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../Loader/LoaderAction"
import "../../../index.css"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"

export default function ModalRoleAdd(props) {
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

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

console.log(props)
  const GetResponseData = async () => {
    const response = await API.get(`/api/role-developers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
    setGetData(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  const [form, setForm] = useState({
    id_role: "",
    username: "",
    password: "",
    email: "",
    level: "",
    gender: "",
  });

  useEffect(() => {
    setForm({
    ...form,
      id_role: safeValue(props?.dataUpdate?.id_role),
      username: safeValue(props?.dataUpdate?.username),
      email: safeValue(props?.dataUpdate?.email),
      level: safeValue(props?.dataUpdate?.level),
      gender: safeValue(props?.dataUpdate?.gender),
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
      const response = await API.put(`/api/privileges/users/${props.id}`, {
        id_role: form?.id_role,
        username: form?.username,
        password: form?.password,
        email: form?.email,
        level: form?.level,
        gender: form?.gender
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
  <div>
    {loading && <LoaderAction/>}
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>  
      <div style={{width: "100%",display:"flex",padding:"10px 0px", backgroundColor:""}}>
        <div style={{flex:"92%", fontSize:"20px",display:"flex",alignItems:"center", paddingLeft:"10px", color:"#2e649d", fontWeight:"600"}}>
          Update User
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent", }}>
      <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-1" >
      <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select  ref={nameInputRef}  aria-label="Default select example" onChange={handleChange} value={form?.level} name="level" style={{color:"#2e649d", textAlign:"", cursor:"pointer", border:"2px solid #2e649d"
               ,width:"100%", height:"45px", borderRadius:"5px"
              }}>
                <option value="" hidden>Pilih Level..</option>
                <option value="user">User</option>
                <option value="developer">Developer</option>
              </select>
            </div>
          </div>

          {form?.level !== "developer" && form?.level !== "" ?
          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select aria-label="Default select example"  onChange={handleChange} value={form?.id_role} name="id_role" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Pilih Role..</option>
                {getData.map((user,index) => (
                  <option value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                ))}         
              </select>
            </div>
          </div>:""}

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Nama
            </label>
            <input autoFocus type='text' name="username" onChange={handleChange} value={form?.username}  
              placeholder='Masukan nama' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Email
            </label>
            <input autoFocus type='email' name="email" onChange={handleChange} value={form?.email}  
              placeholder='Masukan Email' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Password
            </label>
            <input autoFocus type='password' name="password" onChange={handleChange} value={form?.password}  
              placeholder='***********' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div>

          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              No KTP
            </label>
            <input autoFocus type='number' name="unique_id" onChange={handleChange} value={form?.unique_id}  
              placeholder='Masukan No KTP' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Alamat
            </label>
            <input autoFocus type='text' name="address" onChange={handleChange} value={form?.address}  
              placeholder='Masukan Alamat' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              No Ponsel
            </label>
            <input autoFocus type='number' name="phone_number" onChange={handleChange} value={form?.phone_number}  
              placeholder='Masukan Nomor Ponsel' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          {/* <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
              cursor: 'pointer', height:"42px", width:""}}>
            <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
              padding: '0 5px', fontSize: '15px' }}>
              Tempat Lahir
            </label>
            <input autoFocus type='text' name="birth_place" onChange={handleChange} value={form?.birth_place}  
              placeholder='Masukan Tempat Lahir' style={{ backgroundColor: 'transparent', border: 'none', 
              outline: 'none', color: '#2e649d', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
            <style>{`input::placeholder { color: #B9B9B9;}`}
            </style>
          </div> */}

          <div className="mt-4" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select  aria-label="Default select example"  onChange={handleChange} value={form?.gender} name="gender" style={{color:"#2e649d", textAlign:"", cursor:"pointer", border:"2px solid #2e649d"
               ,width:"100%", height:"45px", borderRadius:"5px"
              }}>
                <option value="" hidden>Pilih Jenis Kelamin..</option>
                <option value="1">Laki-Laki</option>
                <option value="0">Wanita</option>
              </select>
            </div>
          </div>

          {/* <div className="mt-3" style={{ display: ""}}>
          <div className="mb-1" style={{display:"flex", alignItems:"center", color:"#2e649d", fontSize: '15px'}}>
            Tanggal Lahir
          </div>
          <div style={{display:"flex"}}>                        
              <select className="form-select" aria-label="Default select example" onChange={handleChange}  name="day_birth" style={{height:"45px", textAlign:"center", cursor:"pointer", fontSize:"13px"}}>
                <option value="" hidden>Day</option>
                <option value="01" style={{textAlign:"center"}}>1</option>
                <option value="02" style={{textAlign:"center"}}>2</option>
                <option value="03" style={{textAlign:"center"}}>3</option>
                <option value="04" style={{textAlign:"center"}}>4</option>
                <option value="05" style={{textAlign:"center"}}>5</option>
                <option value="06" style={{textAlign:"center"}}>6</option>
                <option value="07" style={{textAlign:"center"}}>7</option>
                <option value="08" style={{textAlign:"center"}}>8</option>
                <option value="09" style={{textAlign:"center"}}>9</option>
                <option value="10" style={{textAlign:"center"}}>10</option>
                <option value="11" style={{textAlign:"center"}}>11</option>
                <option value="12" style={{textAlign:"center"}}>12</option>
                <option value="13" style={{textAlign:"center"}}>13</option>
                <option value="14" style={{textAlign:"center"}}>14</option>
                <option value="15" style={{textAlign:"center"}}>15</option>
                <option value="16" style={{textAlign:"center"}}>16</option>
                <option value="17" style={{textAlign:"center"}}>17</option>
                <option value="18" style={{textAlign:"center"}}>18</option>
                <option value="19" style={{textAlign:"center"}}>19</option>
                <option value="20" style={{textAlign:"center"}}>20</option>
                <option value="21" style={{textAlign:"center"}}>21</option>
                <option value="22" style={{textAlign:"center"}}>22</option>
                <option value="23" style={{textAlign:"center"}}>23</option>
                <option value="24" style={{textAlign:"center"}}>24</option>
                <option value="25" style={{textAlign:"center"}}>25</option>
                <option value="26" style={{textAlign:"center"}}>26</option>
                <option value="27" style={{textAlign:"center"}}>27</option>
                <option value="28" style={{textAlign:"center"}}>28</option>
                <option value="29" style={{textAlign:"center"}}>29</option>
                <option value="30" style={{textAlign:"center"}}>30</option>
                <option value="31" style={{textAlign:"center"}}>31</option>    
              </select>
                        
              <select className="form-select" aria-label="Default select example" onChange={handleChange}  name="month_birth" style={{height:"45px", textAlign:"center", cursor:"pointer", fontSize:"13px"}}>
                <option value="" hidden>Month</option>
                <option value="01" style={{ textAlign:"center"}}>Januari</option>
                <option value="02" style={{textAlign:"center"}}>Februari</option>
                <option value="03" style={{textAlign:"center"}}>Maret</option>
                <option value="04" style={{textAlign:"center"}}>April</option>
                <option value="05" style={{textAlign:"center"}}>Mei</option>
                <option value="06" style={{textAlign:"center"}}>Juni</option>
                <option value="07" style={{textAlign:"center"}}>Juli</option>
                <option value="08" style={{textAlign:"center"}}>Agustus</option>
                <option value="09" style={{textAlign:"center"}}>September</option>
                <option value="10" style={{textAlign:"center"}}>Oktober</option>
                <option value="11" style={{textAlign:"center"}}>November</option>
                <option value="12" style={{textAlign:"center"}}>Desember</option>    
              </select> 
                        
              <select className="form-select" aria-label="Default select example" onChange={handleChange}  name="year_birth" style={{height:"45px", textAlign:"center", cursor:"pointer", fontSize:"13px"}}>
                <option value="" hidden>Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                <option value="2011">2011</option>
                <option value="2010">2010</option>
                <option value="2009">2009</option>
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>
                <option value="1999">1999</option>
                <option value="1998">1998</option>
                <option value="1997">1997</option>
                <option value="1996">1996</option>
                <option value="1995">1995</option>
                <option value="1994">1994</option>
                <option value="1993">1993</option>
                <option value="1992">1992</option>
                <option value="1991">1991</option>
                <option value="1990">1990</option>
                <option value="1989">1989</option>
                <option value="1988">1988</option>
                <option value="1987">1987</option>
                <option value="1986">1986</option>
                <option value="1985">1985</option>
                <option value="1984">1984</option>
                <option value="1983">1983</option>
                <option value="1982">1982</option>
                <option value="1981">1981</option>
                <option value="1980">1980</option>
                <option value="1979">1979</option>
                <option value="1978">1978</option>
                <option value="1977">1977</option>
                <option value="1976">1976</option>
                <option value="1975">1975</option>
                <option value="1974">1974</option>
                <option value="1973">1973</option>
                <option value="1972">1972</option>
                <option value="1971">1971</option>
                <option value="1970">1970</option>
                <option value="1969">1969</option>
                <option value="1968">1968</option>
                <option value="1967">1967</option>
                <option value="1966">1966</option>
                <option value="1965">1965</option>
                <option value="1964">1964</option>
                <option value="1963">1963</option>
                <option value="1962">1962</option>
                <option value="1961">1961</option>
                <option value="1960">1960</option>
                <option value="1959">1959</option>
                <option value="1958">1958</option>
                <option value="1957">1957</option>
                <option value="1956">1956</option>
                <option value="1955">1955</option>
                <option value="1954">1954</option>
                <option value="1953">1953</option>
                <option value="1952">1952</option>
                <option value="1951">1951</option>
                <option value="1950">1950</option>
                <option value="1949">1949</option>
                <option value="1948">1948</option>
                <option value="1947">1947</option>
                <option value="1946">1946</option>
                <option value="1945">1945</option>
                <option value="1944">1944</option>
                <option value="1943">1943</option>
                <option value="1942">1942</option>
                <option value="1941">1941</option>
                <option value="1940">1940</option>
              </select>
            </div>
          </div> */}
         
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
  