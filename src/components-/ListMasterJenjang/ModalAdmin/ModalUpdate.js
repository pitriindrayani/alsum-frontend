import { useEffect, useState } from "react";
import { Form,Button } from 'reactstrap'
import { API } from "../../../config/api";
import { FaEnvelope, FaTimes} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
// import "../Styled.css"
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction"
import ToastSuccess from "../../NotificationToast/ToastSuccess"

export default function ModalRoleUpdate(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const [getData, setGetData] = useState("");
  const [getDataCabang, setGetDataCabang] = useState([]);  
  
  // console.log(props)
  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    ysb_branch_id: "",
    school_name: "",
    school_code: "",
    npsn: "",
    province: "",
    district: "",
    subdistrict: "",
    address: "",
    postal_code: "",
    edu_stage: "",
    phone: "",
    website: "",
    email: "",
    school_logo: "",
    nss: "",
    village: "",
    footer_school_name: "",
    akreditasi: ""
  });

  const GetResponseData = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/api/schools/${props?.id}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
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

  const GetResponseDataCabang = async () => {
    const response = await API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}`,fetchParams)
    setGetDataCabang(response.data.data)
  }

  useEffect(() => {
    GetResponseData()
  }, [])

  useEffect(() => {
    if(getData !==  "")
    setForm({
      ...form, 
      ysb_branch_id: getData?.ysb_branch_id === null ? "" : getData?.ysb_branch_id,
      school_name: getData?.school_name === null ? "" : getData?.school_name,
      school_code: getData?.school_code === null ? "" : getData?.school_code,
      npsn: getData?.npsn === null ? "" : getData?.npsn,
      province: getData?.province === null ? "" : getData?.province,
      district: getData?.district === null ? "" : getData?.district,
      subdistrict: getData?.subdistrict === null ? "" : getData?.subdistrict,
      address: getData?.address === null ? "" : getData?.address,
      postal_code: getData?.postal_code === null ? "" : getData?.postal_code,
      edu_stage: getData?.edu_stage === null ? "" : getData?.edu_stage,
      phone: getData?.phone === null ? "" : getData?.phone,
      website: getData?.website === null ? "" : getData?.website,
      email: getData?.email === null ? "" : getData?.email,
      school_logo: getData?.school_logo === null ? "" : getData?.school_logo,
      nss: getData?.nss === null ? "" : getData?.nss,
      village: getData?.village === null ? "" : getData?.village,
      footer_school_name: getData?.footer_school_name === null ? "" : getData?.footer_school_name,
      akreditasi: getData?.akreditasi === null ? "" : getData?.akreditasi,
    });
  }, [getData])

  useEffect(() => {
    if(getData !==  ""){
      GetResponseDataCabang()
    };
  }, [getData])

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
      const response = await API.put(`/api/schools/${props.id}`, {
        ysb_branch_id: form?.ysb_branch_id,
        school_name: form?.school_name,
        school_code: form?.school_code,
        npsn: form?.npsn,
        province: form?.province,
        district: form?.district,
        subdistrict: form?.subdistrict,
        address: form?.address,
        postal_code: form?.postal_code,
        edu_stage: form?.edu_stage,
        phone: form?.phone,
        website: form?.website,
        email: form?.email,
        school_logo: form?.school_logo,
        nss: form?.nss,
        village: form?.village,
        footer_school_name: form?.footer_school_name,
        akreditasi: form?.akreditasi
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
          Update Jenjang
        </div> 
        <div  style={{flex:"8%",fontSize:"20px",display:"flex",alignItems:"center",justifyContent:"center", color:"#2e649d"}}>
          <FaTimes onClick={() => setProopsData(props.onHide)} style={{cursor:"pointer"}}/>
        </div> 
      </div>
      <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px",border:"none",backgroundImage:"transparent" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3" >
         <div className="" style={{ display: "flex"}}>
            <div style={{ display:"flex", width:"100%"}}>
              <select autoFocus  aria-label="Default select example"  onChange={handleChange} value={form?.ysb_branch_id}  name="ysb_branch_id" style={{color:"#2e649d", textAlign:"", 
                cursor:"pointer", border:"2px solid #2e649d",width:"100%", height:"45px", borderRadius:"5px"}}>
                <option value="" hidden>Pilih Cabang..</option>
                {getDataCabang.map((user,index) => (
                  <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                ))}         
              </select>
            </div>
          </div>
         
        <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
            cursor: 'pointer', height:"42px", width:""}}>
          <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
            padding: '0 5px', fontSize: '15px' }}>
            Kode Sekolah
          </label>
          <input type='text' name="school_code" onChange={handleChange} value={form?.school_code}  
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
            Nama Sekolah
          </label>
          <input type='text' name="school_name" onChange={handleChange} value={form?.school_name}  
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
            Npsn
          </label>
          <input type='text' name="npsn" onChange={handleChange} value={form?.npsn}  
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
            Provinsi
          </label>
          <input type='text' name="province" onChange={handleChange} value={form?.province}  
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
            Kota/Kabupaten
          </label>
          <input type='text' name="district" onChange={handleChange} value={form?.district}  
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
            Alamat
          </label>
          <input type='text' name="address" onChange={handleChange} value={form?.address}  
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
            Kode Post
          </label>
          <input type='text' name="postal_code" onChange={handleChange} value={form?.postal_code}  
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
            Jenjang
          </label>
          <input type='text' name="edu_stage" onChange={handleChange} value={form?.edu_stage}  
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
            No Telp.
          </label>
          <input type='number' name="phone" onChange={handleChange} value={form?.phone}  
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
            Website
          </label>
          <input type='text' name="website" onChange={handleChange} value={form?.website}  
            placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
            outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
          <style>{`input::placeholder { color: #B9B9B9;}`}
          </style>
        </div>

        <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            border: '2px solid #2e649d', padding: '0px', borderRadius: '5px',
            cursor: 'pointer', height:"42px", width:""}}>
          <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
            padding: '0px 5px', fontSize: '15px' }}>
            Email
          </label>
          <FaEnvelope
            style={{
              // height: '20px',
              fontSize: "20px", 
              margin: '0px 10px 0px 25px',
              color:"#2e649d",
            }}
          />
          <input type='email' name="email" onChange={handleChange} value={form?.email}  
            placeholder='....' style={{ backgroundColor: 'white', border: 'none', height:"100%",
            outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
          <style>{`input::placeholder { color: #B9B9B9;}`}
          </style>
        </div>

        <div className="mt-4" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            backgroundColor: 'transparent', border: '2px solid #2e649d', padding: '5px', borderRadius: '5px',
            cursor: 'pointer', height:"42px", width:""}}>
          <label style={{ position: 'absolute', top: '-12px', left: '10px', backgroundColor: '#fff', color: '#2e649d', 
            padding: '0 5px', fontSize: '15px' }}>
            Logo Sekolah
          </label>
          <input type='text' name="school_logo" onChange={handleChange} value={form?.school_logo}  
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
            Nss
          </label>
          <input type='text' name="nss" onChange={handleChange} value={form?.nss}  
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
            Desa
          </label>
          <input type='text' name="village" onChange={handleChange} value={form?.village}  
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
            Nama Footer Sekolah
          </label>
          <input type='text' name="footer_school_name" onChange={handleChange} value={form?.footer_school_name}  
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
          Akreditasi
          </label>
          <input type='text' name="akreditasi" onChange={handleChange} value={form?.akreditasi}  
            placeholder='....' style={{ backgroundColor: 'transparent', border: 'none', 
            outline: 'none', color: '#818181', padding: '5px 5px 5px 10px', flex: 1, fontSize: '14px',width:"300px" }}/>
          <style>{`input::placeholder { color: #B9B9B9;}`}
          </style>
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
