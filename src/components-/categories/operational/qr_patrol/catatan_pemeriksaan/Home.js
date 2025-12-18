import { useEffect, useState, useRef } from "react";
import {Col, Row } from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { Link} from "react-router-dom";
import ReactPaginate from "react-paginate";
import { APITS } from "../../../../../config/apits";
import { APIMS } from "../../../../../config/apims";
import { APIUS } from "../../../../../config/apius";
import "bulma/css/bulma.css";
import "../../../../Loader/LoaderHome";
import Swal from "sweetalert2";
import swal from "sweetalert";
import ModalScan from "./modal/ModalScan";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import axios from "axios";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

export default function InspectionNotes() {
  document.title = "Catatan Pemeriksaan";
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(0);
  const [rows, setRows] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");
  const [idUser, setIdUser] = useState(false);
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
   
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  
  // modal add
  const [modalScan, setModalScan] = useState(false);

  const [loading, setLoading] = useState(false);

  // Filter permission menu
  const location = useLocation();
  const [permission, setPermission] = useState({
    create: 0,
    read: 0,
    update: 0,
    delete: 0
  });

  const navigate = useNavigate();
  useEffect(() => {
    const storageLevel = localStorage.getItem('level');
    const storageItems = JSON.parse(localStorage.getItem('role_permission')) || [];
    if (storageLevel === "developer" || storageLevel === "superadmin") {
      setPermission({
        create: 1,
        read: 1,
        update: 1,
        delete: 1
      });
    } else {
      const foundPermission = storageItems.find(item => item.menu?.url === location.pathname);
      if (!foundPermission) { 
        navigate('/dashboard');
      } else {
        setPermission({
          create: foundPermission.create,
          read: foundPermission.read,
          update: foundPermission.update,
          delete: foundPermission.delete
        });
      }}
  }, [location.pathname]);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await APITS.get(`/api/log-check-points?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
        setPage(response.data.pagination.current_page);
        setPages(response.data.pagination.total_pages);
        setRows(response.data.pagination.total);
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

  useEffect(() => {
    GetResponseData()
  }, [page,keyword,limit])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const changePage = ({ selected }) => {
    setPage(selected+1);
    if (selected === 10) {
      setMsg(
        ""
      );
    } else {
      setMsg("");
    }
  };

  const deleteById = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Menghapus data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await APITS.delete(`/api/log-check-points/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di hapus!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  const viewModalScan = ( id_user) => {
    setModalScan(true)
    setIdUser(id_user)
  }

  // =============== Filter =================
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

  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
 
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getDataDept, setGetDataDept] = useState([]);
  const [getDataPetugas, setGetDataPetugas] = useState([]);
  const [getDataFilter, setGetDataFilter] = useState([]);

  const fetchDataRef = useRef();

  const fetchData = async () => {
    try {
      // setLoading(true);
      const [ dataBranch, dataDept] = await axios.all([
        await APIMS.get(`/api/access/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        APIUS.get(`/api/access/department-filters?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams)
       
      ]);
      if (dataBranch.status === 200  && dataDept.status === 200 ){
        setGetDataCabang(dataBranch.data.data)
        setGetDataDept(dataDept.data.data)
      }
    } catch (error) {
      // setLoading(false);
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
      ysb_employe_id: ""
    });

    // console.log(form)

    const GetResponseDataPetugas = async () => {
        try {
           const response = await APIUS.get(`/api/access/employes?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}&ysb_department_id=${form?.ysb_department_id}`,fetchParams)
          
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
      const response = await APITS.post(`/api/log-check-point-filters`, {
       date_in: form?.date_in,
       date_out: form?.date_out,
       ysb_branch_id: form?.ysb_branch_id,
       ysb_department_id: form?.ysb_department_id,
       ysb_employe_id: form?.ysb_employe_id
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

  const handleDateChangeFirst = () => {
    const formattedDate = formatDate("date_in");
    setForm({
      ...form,
      date_in: formattedDate,
    });
  };

  const handleDateChangeLast = () => {
    const formattedDate = formatDate("date_out");
    setForm({
      ...form,
      date_out: formattedDate,
    });
  };

  const formatDate = (id) => {
    const value = document.getElementById(id).value;
    if (!value) return ""; 

    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}/${month}/${day}`;
  };

  return (
    <div className="body" >

      {modalScan  && <ModalScan GetResponseData={GetResponseData} iduser={idUser} show={modalScan} onHide={() => setModalScan(false)} />} 

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
        <>
          <div className="title-page">
            <h6> <FontAwesomeIcon icon={faUsers} /> Catatan Pemeriksaan</h6>
          </div> 
                
          <div className="ml-auto">
            <button  onClick={() => viewModalScan()}   className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} /> Scan QR</button>
          </div>
        </>
        : 
        <>
          <div className="title-page">
            <h5> <FontAwesomeIcon icon={faUsers} /> Catatan Pemeriksaan </h5>
          </div>
          
          <div className="ml-auto">
            <button onClick={viewModalScan}  className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} /> Scan QR</button>
          </div>
        </>
        } 
      </div> 

      {loading && <LoaderHome />}
      
      <div className="body-content">
        
        {/* Breadcrumbs */}
        <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"> <Link to="/beranda-patrol"> Beranda </Link></li>
              <li className="breadcrumb-item active" aria-current="page"> Catatan Pemeriksaan</li>
            </ol>
          </nav>
        </div>
              
        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example"className="mb-3 nav-tabs">

          <Tab eventKey="home" title="Data Pemeriksaan" className="nav-item">
            
            {isTabletOrMobile ? 
              // HP
              <div className="row d-flex">
                <div className="col-4 mt-1">
                  <select className="form-select" aria-label="Default select example" style={{ textAlign: "", cursor: "pointer", height: "35px", width: "70px",fontSize:"14px" }} onChange={(e) => setLimit(e.target.value)} value={limit}>
                    <option style={{fontSize:"14px"}} value={10}>10</option>
                    <option style={{fontSize:"14px"}} value={25}>25</option>
                    <option style={{fontSize:"14px"}} value={50}>50</option>
                    <option style={{fontSize:"14px"}} value={100}>100</option>
                  </select>
                </div>
                <div className="col-5 p-2 ml-auto">
                  <form onSubmit={e => e.preventDefault()}   >
                    <input style={{width: "130px", fontSize:"14px", border: "1px solid #cfcfcfff"}} value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search"/>
                  </form>
                </div>
              </div> 
            :
              // DESKTOP
              <div style={{ display: "flex" }} >
                <div className="line-show" >
                  <div> Show </div>
                  &nbsp;
                  <div>
                    <select className="form-select" aria-label="Default select example" style={{ textAlign: "", cursor: "pointer", height: "35px" }} onChange={(e) => setLimit(e.target.value)} value={limit} >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  &nbsp;
                  <div> Entries </div>
                </div>
                <div className="line-search" >
                  <form onSubmit={e => e.preventDefault()} style={{ display: "flex", paddingRight: "0px", borderRadius: "5px"}}>
                    <div style={{ marginRight: "5px", borderRadius: "5px" }}>
                      <input value={query} onChange={(e) => setQuery(e.target.value)} className="focused"  style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }} type="text" placeholder="Search"/>
                    </div>
                  </form>
                </div>
              </div> 
            }

            {/* TABLE */}
            <Col xl='12' sm='12'> 
              <div className="mt-3">
                <div className="body-table" >
                  <div>
                    <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                      <thead>
                        <tr>
                          <th>No </th>
                          <th>Petugas</th>
                          <th>Kode Dept</th>
                          <th>Tanggal</th>
                          <th>Waktu</th>
                          <th>Gedung</th>
                          <th>Check Point</th>
                          <th>Lantai</th>
                          <th>Cabang</th>
                          <th>Kategori</th>
                          <th>Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getData.map((checkpoint,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2" }}> {(page - 1) * 10 + (index + 1)} </td>  
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_users} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_department} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.date_check} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.time_check} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_school} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_room} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_floor} </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.name_branch} </td>
                            <td style={{ lineHeight: "2" }}> 
                                 {checkpoint.ysb_kategori_note}
                                </td>
                            <td style={{ lineHeight: "2" }}> {checkpoint.note} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", padding:"10px"}}>
                <div>
                  <div style={{fontSize:"12px"}}> Total Rows: {rows} </div>
                  <div style={{fontSize:"12px"}}> Page: {rows ? page : 0} of {pages} </div>
                  <p className="has-text-centered has-text-danger">{msg}</p>
                </div> 
                <div style={{flex:"50%", display:"flex", justifyContent:"end"}}>
                  <nav style={{fontSize:"12px"}} className="pagination is-centered" key={rows}role="navigation" aria-label="pagination">
                    <ReactPaginate
                      previousLabel={"<"}
                      nextLabel={">"}
                      pageCount={Math.min(10, pages)}
                      onPageChange={changePage}
                      containerClassName={"pagination-list"}
                      pageLinkClassName={"pagination-link"}
                      previousLinkClassName={"pagination-previous"}
                      nextLinkClassName={"pagination-next"}
                      activeLinkClassName={"pagination-link is-current"}
                      disabledLinkClassName={"pagination-link is-disabled"}
                    />
                  </nav>
                </div>
              </div> 
            </Col>

          </Tab>

          {/* FILTER DATA */}
          <Tab eventKey="profile" title="Filter Data">
            
            {isTabletOrMobile ? 
              <>
                <div className="title-page">
                  <Row>
                    <Col>
                      <input className="mr-2" type="text"  onChange={handleDateChangeFirst} id="date_in"  onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Awal" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}}  /><span className="mr-2">-</span>
                  
                      <input className="mr-2" type="text" onChange={handleDateChangeLast} id="date_out" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Akhir" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}} />
                    </Col>
                  </Row>
                  
                  <Row style={{marginTop: "10px", padding:"0 12px"}}>
                    <select className="mr-2" aria-label="Default select example" name="ysb_branch_id" value={form?.ysb_branch_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                      <option value="" hidden>Cabang</option>
                      {getDataCabang.map((user,index) => (
                        <option key={index} value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                      ))}  
                    </select>
                  </Row>
                  
                  <Row style={{marginTop: "10px", padding:"0 12px"}}>
                    <select className="mr-2" aria-label="Default select example" name="ysb_department_id" value={form?.ysb_department_id} onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                      <option value="" hidden>Departemen</option>
                      <option value="ALL" >ALL</option>
                      {getDataDept.map((user,index) => (
                        <option key={index} value={user?.id} style={{textAlign:""}}>{user?.kode_dept}</option>
                      ))}  
                    </select>
                  </Row>
                  
                  <Row style={{marginTop: "10px", padding:"0 12px"}}>
                    <select className="mr-2" aria-label="Default select example" name="ysb_employe_id"  onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                      <option value="" hidden>Petugas</option>
                      {getDataPetugas.map((user,index) => (
                        <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                      ))}  
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

                  <div>
                    <input className="mr-2" type="text"  onChange={handleDateChangeFirst} id="date_in" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Awal" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}}  /><span className="mr-2">-</span>

                    <input className="mr-2" type="text" onChange={handleDateChangeLast} id="date_out" onFocus={(e) => (e.target.type = "date")} onBlur={(e) => (e.target.type = "text")} placeholder="Tanggal Akhir" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'4px 5px', width: "120px"}} />
                                  
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

                    <select className="mr-2" aria-label="Default select example" name="ysb_employe_id"  onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                      <option value="" hidden>Petugas</option>
                      {getDataPetugas.map((user,index) => (
                        <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name}</option>
                      ))}  
                    </select>
                  
                    <button onClick={GetResponseDataFilter} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari </button>
                  </div>
                  
                  <div className="ml-auto">
                    <button onClick={exportToExcel} style={{ border:"none", backgroundColor: "#018a18ff", color:"#fff", borderRadius: "3px", padding:'4px 10px 5px 7px'}}>
                      <FontAwesomeIcon icon={faFileExcel} /> <span style={{fontSize: '13px'}}> Export </span>
                    </button>
                  </div>

                </div>
              </>
            }
                  
            <Col xl='12' sm='12'> 
              <div className="mt-4">
                <div className="body-table" >
                  <div>
                    <table className="table dt-responsive nowrap w-100" id="basic-datatable" ref={tableRef}>
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Petugas</th>
                          <th>Kode Dept</th>
                          <th>Tanggal</th>
                          <th>Waktu</th>
                          <th>Gedung</th>
                          <th>Check Point</th>
                          <th>Lantai</th>
                          <th>Cabang</th>
                          <th>Kategori</th>
                          <th>Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getDataFilter.map((filter,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2" }}> {(page - 1) * 10 + (index + 1)} </td>  
                            <td style={{ lineHeight: "2" }}> {filter.name_users} </td>
                            <td style={{ lineHeight: "2" }}> {filter.name_department} </td>
                            <td style={{ lineHeight: "2" }}> {filter.date_check} </td>
                            <td style={{ lineHeight: "2" }}> {filter.time_check} </td>
                            <td style={{ lineHeight: "2" }}> {filter.name_school} </td>
                            <td style={{ lineHeight: "2" }}> {filter.name_room} </td>
                            <td style={{ lineHeight: "2" }}> {filter.name_floor} </td>
                            <td style={{ lineHeight: "2" }}> {filter.name_branch} </td>
                            <td style={{ lineHeight: "2" }}> {filter.ysb_kategori_note_label} </td>
                            <td style={{ lineHeight: "2" }}> {filter.note} </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Tab>
        </Tabs>
              
      </div>
    </div>
  );
}
