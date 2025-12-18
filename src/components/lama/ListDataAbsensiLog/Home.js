import React, { useEffect, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import {FaPlus, FaSync, FaPlusCircle, FaCog , FaTimesCircle, FaListAlt, FaFileExcel} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../Loader/LoaderHome"
import * as XLSX from "xlsx";
import { Axios } from "axios";
import { useLocation, useNavigate } from "react-router-dom";


export default function Login() {
  document.title = "List Absensi Log";
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
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  // modal update
  const [id, setId] = useState();
  const [branchCodeUpdate, setBranchCodeUpdate] = useState();
  const [branchNameUpdate, setBranchNameUpdate] = useState();
  const [parentIdUpdate, setParentIdUpdate] = useState();  
  // modal add
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  // const storageBranch = localStorage.getItem('ysb_branch_id');
  // const storageSchool = localStorage.getItem('ysb_school_id');
  // const storageIdTeacher = localStorage.getItem('id_teacher');
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
      // setLoading(true)
      const response = await API.get(`/api/attendance-trxs?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
        setPage(response.data.pagination.current_page);
        setPages(response.data.pagination.total_pages);
        setRows(response.data.pagination.total);
        // setLoading(false)
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
        const response =  await API.delete(`/api/attendance-trxs/${id}`,fetchParams);
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

  const buttonRefresh = () => {
    window.location.reload();
  }
  
  const viewModalAdd = () => {
    setModalAdd(true)
  }

  const viewModalUpdate = (id, branch_code, branch_name, parent_id) => {
    setModalUpdate(true)
    setId(id)
    setBranchCodeUpdate(branch_code)
    setBranchNameUpdate(branch_name)
    setParentIdUpdate(parent_id)
  }

  const [data, setData] = useState([]);
const [dataName, setDataName] = useState("");

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    // Parse content
    const rows = content.split('\n').filter(Boolean); // Filter rows that are not empty
    const parsedData = rows
      .map((row, index) => {
        const [Tanggal, Jam, NIP, Nama] = row.split(',');

        // Skip header or invalid rows
        if (
          index === 0 || // Assume the first row is the header
          !Tanggal?.trim() ||
          !Jam?.trim() ||
          !NIP?.trim() ||
          !Nama?.trim()
        ) {
          return null;
        }

        return {
          att_date: Tanggal.trim(),
          att_time: Jam.trim(),
          finger_id: NIP.trim(),
          description: Nama.trim(),
        };
      })
      .filter(Boolean); // Remove null values

    setData(parsedData);
    setDataName(file.name);
    event.target.value = ""; // Clear the input value for re-uploading the same file
  };
  reader.readAsText(file);
};

  const postAttendanceData = async () => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Mengirim file ${dataName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Kirim'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await API.post('/api/attendance-trxs/excel/store', { absen_log: data },fetchParams);
          Swal.fire({
            title: 'Success',
            text: 'Data berhasil dikirim!',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
          setData([]);
          setDataName("");
          GetResponseData()
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'Gagal mengirim data',
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
          });
          setData([]);
          setDataName("");
        }
      } else {
        setData([]);
        setDataName("");
      }
    });
  };

  // Auto-trigger API POST on file upload
  React.useEffect(() => {
    if (dataName) {
      postAttendanceData();
    }
  }, [dataName]);

  return (
    <div style={{ backgroundColor: "white", margin: "15px", marginRight: "10px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} branchCodeUpdate={branchCodeUpdate} branchNameUpdate={branchNameUpdate} 
      parentIdUpdate={parentIdUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Absensi Log
          </Col>
          <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
            {permission.create === 1 ?
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#2e649d",color:"white",padding:"0px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <FaPlus/>
            </div>:""}
            {permission.read === 1 ?
            <div onClick={buttonRefresh} style={{ height: "100%", marginRight: "5px", paddingTop: "0px", backgroundColor: "white", padding: "10px 10px", borderRadius: "2px", cursor: "pointer", border: "1px solid #DEDEDE" }}>
              <FaSync style={{ fontSize: "15px", marginRight: "0px", marginTop: "0px", display: "flex", alignItems: "center", height:"100%", color:"#2e649d" }} />
            </div>:""}
            {permission.read === 1 ?
            <form onSubmit={searchData} style={{display:"flex", paddingRight:"0px"}}>
                <div style={{marginRight:"2px",borderRadius:"3px"}}>
                  <input value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="focused"
                    style={{backgroundColor:"#E9E9E9", border:"none",height:"100%", paddingLeft:"5px"}}
                    type="text"
                    placeholder="Search"
                  />
              </div>
            </form>:""}
          </Col>
        </div>
          :
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "flex", padding: "10px 20px 10px 0px",backgroundColor:"#2e649d", borderRadius:"5px" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"white"}}>
            <FaListAlt style={{marginRight:"5px"}}/>List Absensi Log
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
          {permission.create === 1 ?
          <div style={{ display: "flex", justifyContent: "end" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "5px",
                  backgroundColor: "white",
                  color: "black",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontFamily: "Poppins"
                }}
              >
                <label
                  htmlFor="file-upload"
                  style={{ display: "flex", alignItems: "center", cursor: "pointer", padding: "0px 10px" }}
                >
                  <span>📄 Upload TXT</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>
          </div>
          :""}
          </div>
        </div>  
      }

      {permission.read === 1 ?
      (isTabletOrMobile ? 
        <div style={{display: "flex", padding: "10px 20px 10px 0px",
          backgroundColor:"", justifyContent:"end" }}>
          <div style={{display:"flex",fontSize:"16px", alignItems:"center", paddingLeft:"10px", color:"black"}}>
            <div>
              Show
            </div>
            &nbsp;
            <div>
            <select
              className="form-select"
              aria-label="Default select example"
              style={{ textAlign: "", cursor: "pointer", height: "35px" }}
              onChange={(e) => setLimit(e.target.value)}
              value={limit}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            </div>
            &nbsp;
            <div>
              Entries
            </div>
          </div>
        </div> 
          :
        <div style={{display: "flex", padding: "10px 20px 10px 0px",
          backgroundColor:"" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"black"}}>
            <div>
              Show
            </div>
            &nbsp;
            <div>
            <select
              className="form-select"
              aria-label="Default select example"
              style={{ textAlign: "", cursor: "pointer", height: "35px" }}
              onChange={(e) => setLimit(e.target.value)}
              value={limit}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            </div>
            &nbsp;
            <div>
              Entries
            </div>
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", paddingRight: "0px", borderRadius: "5px" }}>
            <div style={{ marginRight: "5px", borderRadius: "5px" }}>
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="focused"
                style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }}
                type="text"
                placeholder="Search"
              />
            </div>
          </form>
          </div>
        </div> 
      ):""}
    
      <Col xl='12' sm='12'> 
      <div>
        <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
          <div >
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "white" : "white", borderBottom:"1px solid rgb(214, 214, 214)"}}>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center"}}>NO</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JAM</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>ID FINGER</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>KETERANGAN</th>
                  {permission.update === 0 && permission.delete === 0 ? <></> :
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                  }
                </tr>
              </thead>
              {permission.read === 1 ?
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center"}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td>  
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.att_date}
                          </div> 
                        </div>
                      </td>
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.att_time}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.finger_id}
                          </div> 
                        </div>
                      </td>
                      
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.description}
                          </div> 
                        </div>
                      </td>

                      {permission.update === 0 && permission.delete === 0 ? <></> :
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                          {/* {permission.update === 1 ? 
                            <button onClick={() => viewModalUpdate(user?.id, user)} style={{ fontSize: "17px", color: "#2196F3", backgroundColor: "white", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex", marginRight:"3px" }}>
                              <FaCog/>
                            </button> :""} */}
                            {permission.delete === 1 ?
                            <button onClick={() => {deleteById(user?.id)}} style={{ fontSize: "17px", color: "#dc3545", backgroundColor: "white",  borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              <FaTimesCircle/>
                            </button> :<></>}
                        </div>
                      </td> }

                    </tr>
                  ))}
              </tbody>:<></>}
            </table>
              
          </div>
          </div>
            </div>
            <div style={{ display: "flex", padding:"10px"}}>
          <div>
            <div style={{fontSize:"12px"}}>
              Total Rows: {rows} 
            </div>
            <div style={{fontSize:"12px"}}>
              Page: {rows ? page : 0} of {pages}
            </div>
            <p className="has-text-centered has-text-danger">{msg}</p>
          </div> 
            <div style={{flex:"50%", display:"flex", justifyContent:"end"}}>
              <nav
                style={{fontSize:"12px"}}
                className="pagination is-centered"
                key={rows}
                role="navigation"
                aria-label="pagination"
                >
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
    </div>
  );
}
