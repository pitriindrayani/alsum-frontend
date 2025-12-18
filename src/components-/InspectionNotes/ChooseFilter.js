import { React,useEffect, useState,useRef } from "react";
import { Form, Button, Col, Row } from 'reactstrap';
import { API } from "../../config/api";
import { APIMS } from "../../config/apims";
import { APIUS } from "../../config/apius";
import { APITS } from "../../config/apits";
import swal from "sweetalert";
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { useMediaQuery } from 'react-responsive'
import Select from 'react-select'; 

export default function ChooseFilter() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});

    const tableRef = useRef(null);
    const exportToExcel = () => {
      const table = tableRef.current;
      const ws = XLSX.utils.table_to_sheet(table, { raw: true });

      // Set column width/formatting if needed
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Rekap');

      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      saveAs(blob, 'Daftar Catatan Pemeriksaan.xlsx');
    };

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(100);
    const [ascending, setAscending] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [query, setQuery] = useState("");
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(false);
    const [selectKey, setSelectKey] = useState(0);

    const storageBranchGroping = localStorage.getItem('ysb_branch_id');
    const storageLevel = localStorage.getItem('level');
    const [getDataCabang, setGetDataCabang] = useState([]);
    const [getDataDept, setGetDataDept] = useState([]);
    const [getDataPetugas, setGetDataPetugas] = useState([]);
    const [getDataFilter, setGetDataFilter] = useState([]);


    let fetchParams = {headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}};

    const fetchDataRef = useRef();

    const fetchData = async () => {
    try {
      setLoading(true);
      const [ dataBranch, dataDept] = await axios.all([
        await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        APIUS.get(`/api/department-filters?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams)
       
      ]);
      if (dataBranch.status === 200  && dataDept.status === 200 ){

       
        setGetDataCabang(dataBranch.data.data)
        setGetDataDept(dataDept.data.data)
       
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
    }, [])

    
    const [form, setForm] = useState({
      date_in: "",
      date_out: "",
      ysb_branch_id: "",
      ysb_department_id: "",
      ysb_user_id: "",
      
      
    });

    

    const GetResponseDataPetugas = async () => {
        try {
           const response = await APIUS.get(`/api/employes?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}&ysb_department_id=${form?.ysb_department_id}`,fetchParams)
          
            if (response?.status === 200) {
            setGetDataPetugas(response.data.data)
            }
        } catch (error) {
            swal({
            title: 'Failed',
            text: `${error.response.data.message}`,
            icon: 'error',
            timer: 3000,
            buttons: false
            });
        }
    }



    useEffect(() => {
      if (form?.ysb_department_id) {
        GetResponseDataPetugas()     
      }
    }, [form?.ysb_department_id]);
    

    const GetResponseDataFilter = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await APITS.post(`/api/log-check-points-filters`, {
       date_in: form?.date_in,
       date_out: form?.date_out,
       branch: form?.ysb_branch_id,
       ysb_department_id: form?.ysb_department_id,
       ysb_user_id: form?.ysb_user_id,
       
      },fetchParams)

      // Checking process
      if (response?.status === 200) {
       
        setGetDataFilter(response.data.data)
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputPetugas = (e) => {
    setForm({
      ...form,
      ysb_user_id: e.value,
    });
  };

  const handleDateChangeFirst = (date) => {
    const formattedDate = formatDate(date);
    setForm({
      ...form,
      date_in: formattedDate,
    });
  };

  const handleDateChangeLast = (date) => {
    const formattedDate = formatDate(date);
    setForm({
      ...form,
      date_in: formattedDate,
    });
  };

  const formatDate = () => {

    var date = new Date(document.getElementById('date').value);
 
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  };



return (
    <div className="body" >

       {isTabletOrMobile ? 
          <>
            <div className="title-page">

              <Row>
                <Col>
                <input className="mr-2" type="text"  onChange={handleDateChangeFirst} id="date"    onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Awal" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}}  /><span className="mr-2">-</span>

                <input className="mr-2" type="text" onChange={handleDateChangeLast} id="date" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Akhir" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}} />
                </Col>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_branch_id" onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Cabang</option>
                    {getDataCabang.map((user,index) => (
                      <option key={index} value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                    ))}  
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example"  onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Departemen</option>
                  <option value="ALL" >ALL</option>
                  {getDataDept.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.kode_dept}</option>
                  ))}  
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_user_id"  onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  {/* <option value="" hidden>Petugas</option>
                    {getDataPetugas.map((user,index) => (
                      <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                    ))}   */}
                </select>
              </Row>

              <Row style={{marginTop: "12px", padding:"0 12px"}}>
                <button onClick={GetResponseDataFilter} className=" btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>

              </Row>

              <Row style={{marginTop: "12px", padding:"0 12px"}}>
                <button onClick={exportToExcel} style={{ border:"none", backgroundColor: "#018a18ff", color:"#fff", borderRadius: "3px", padding:'4px 10px 5px 7px'}}>
                <FontAwesomeIcon icon={faFileExcel} /> <span style={{fontSize: '13px'}}> Export </span>
              </button>
              </Row>
            </div>
          </>
          : 
          <>
            <div  className="d-flex mb-3">
            <div className="">
              {/* <button className="mr-1" onClick={exportToExcel} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}}>
              <FaFileExcel className="mr-1"/> Export
            </button> */}

                <input className="mr-2" type="text"  onChange={handleDateChangeFirst} id="date"    onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Awal" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}}  /><span className="mr-2">-</span>

                <input className="mr-2" type="text" onChange={handleDateChangeLast} id="date" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Akhir" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}} />
                
                <select className="mr-2" aria-label="Default select example" name="ysb_branch_id"  value={form?.ysb_branch_id}   onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Cabang</option>
                    {getDataCabang.map((user,index) => (
                      <option key={index} value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                    ))}  
                </select>

                <select className="mr-2" aria-label="Default select example" name="ysb_department_id" value={form?.ysb_department_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Departemen</option>
                    <option value="ALL" >ALL</option>
                    {getDataDept.map((user,index) => (
                      <option key={index} value={user?.id} style={{textAlign:""}}>{user?.kode_dept}</option>
                    ))}  
                </select>

                <select className="mr-2" aria-label="Default select example" name="ysb_user_id"  onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Petugas</option>
                    {getDataPetugas.map((user,index) => (
                      <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                    ))}  
                </select>

                {/* <Select key={selectKey} name="ysb_user_id" onChange={handleInputPetugas} 
                    options={getDataPetugas.map(user => ({
                      value: user.id,
                      label: `${user.name}`,
                      color: '#2e649d'
                    }))}
                    placeholder="Petugas" styles={{
                      border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px',
                      control: (base) => ({
                        ...base,
                        color:"black",cursor:"pointer", border:"2px solid #3272B3",minWidth:"200px", height:"28px", borderRadius:"3px"
                      }),
                      menu: (base) => ({
                        ...base,
                        marginTop: 0,
                      }),
                      singleValue: (base, state) => ({
                        ...base,
                        color: "black",  
                      }),
                      dropdownIndicator: (base) => ({
                        ...base,
                        color: 'black',
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "black",  
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        color: state.data.color,  
                        backgroundColor: state.isSelected ? (state.data.color === 'white' ? 'white' : 'white') : 'white',
                      }
                    ),
                  }}/> */}

                <button onClick={GetResponseDataFilter} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
                    
            </div>

             <div className="ml-auto">
              <button onClick={exportToExcel} style={{ border:"none", backgroundColor: "#018a18ff", color:"#fff", borderRadius: "3px", padding:'4px 10px 5px 7px'}}>
                <FontAwesomeIcon icon={faFileExcel} /> <span style={{fontSize: '13px'}}> Export </span>
              </button>
              </div>
        </div>
          </>
        }
        
              
    </div>
   );

}
