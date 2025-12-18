import { useEffect, useState } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";


export default function Login() {
  document.title = "List Guru";
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

  // upload excel 
  const [data, setData] = useState([]);
  const [dataNameUpload, setDataNameUpload] = useState("");

  console.log(data)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
    const binaryStr = e.target.result;
    const workbook = XLSX.read(binaryStr, { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    setData(jsonData);
    setDataNameUpload(file.name);
    event.target.value = "";  
    };
    reader.readAsBinaryString(file);
  };

  const postDataByExcel = async () => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Mengirim ${dataNameUpload}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Upload'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true)
          const response = await API.post(`/api/teachers/excel/store`,{ file: data },fetchParams);
          if(response.data.error === false) {
            setLoading(false)
            setData([]);
            setDataNameUpload("");
            GetResponseData();
            Swal.fire({
              title: 'Success',
              text: "Your data has been successfully",
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            });
          }
        } catch (error) {
          setLoading(false)
          setData([]);
          setDataNameUpload("");
          Swal.fire({
            title: 'Failed',
            text: `${error.response.data.message}`,
            icon: 'error',
            timer: 3000,
            showConfirmButton: false
          });
        }
      } 
      if (result.isDismissed) {  
        setData("");
        setDataNameUpload("");
      }
    });
    };
  
    useEffect(() => {
    if (dataNameUpload !== "") {
      postDataByExcel();
    }
    },[dataNameUpload]);

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  // modal update
  const [id, setId] = useState();
  const [dataUpdate, setDataUpdate] = useState();
  
  // modal add
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
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
      const response = await API.get(`/user-service/teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`,fetchParams)

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
        const response =  await API.delete(`/api/teachers/${id}`,fetchParams);
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

  const viewModalUpdate = (id, user) => {
    setModalUpdate(true)
    setId(id)
    setDataUpdate(user)
  }

  return (
    <div style={{ backgroundColor: "white", margin: "15px", marginRight: "15px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} dataUpdate={dataUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Guru
          </Col>
          <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
          {storageLevel === "developer" ?
            <div style={{ display: "flex", justifyContent:"end" }}>
              <div style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#00AB22",color:"white", borderRadius:"3px"}}>
                <label htmlFor="file-upload" style={{display:"flex",alignItems:"center", cursor:"pointer", padding:"0px 5px"}}>
                  <FaFileExcel style={{cursor:"pointer",fontSize:"20px",color:"white"}} /> 
                </label>
                <input id="file-upload" type="file" onChange={handleFileUpload} style={{display:'none'}}/>
              </div>
            </div> : <></>}
            {permission.create === 1 ?
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#2e649d",color:"white",padding:"0px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <FaPlus/>
            </div> : ""}
            {permission.read === 1 ?
            <div onClick={buttonRefresh} style={{ height: "100%", marginRight: "5px", paddingTop: "0px", backgroundColor: "white", padding: "10px 10px", borderRadius: "2px", cursor: "pointer", border: "1px solid #DEDEDE" }}>
              <FaSync style={{ fontSize: "15px", marginRight: "0px", marginTop: "0px", display: "flex", alignItems: "center", height:"100%", color:"#2e649d" }} />
            </div> : ""}
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
            </form> : ""}
          </Col>
        </div>
          :
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #f0f0f0ff", display: "flex", padding: "10px 20px 10px 0px",backgroundColor:"#2e649d", borderRadius:"0px" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"white"}}>
            <FaListAlt style={{marginRight:"5px"}}/>List Guru
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
            <div className="mr-2" style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"black", borderRadius:"3px", cursor:"pointer", fontSize:"12px"}}>
            </div>
            {storageLevel === "developer" ?
            <div style={{ display: "flex", justifyContent:"end" }}>
              <div style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"white", borderRadius:"3px"}}>
                <label htmlFor="file-upload" style={{display:"flex",alignItems:"center", cursor:"pointer", padding:"0px 5px"}}>
                  <FaFileExcel style={{cursor:"pointer",fontSize:"20px", color:"#00AB22"}} /> 
                </label>
                <input id="file-upload" type="file" onChange={handleFileUpload} style={{display:'none'}}/>
              </div>
            </div> : <></>}
            {permission.create === 1 ?
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"#005A9F",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"12px"}}>
                <div>
                  <FaPlusCircle/> &nbsp;
                </div>
                <div>
                  Tambah Guru
                </div>
              </div>
             : <></>}
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
            <select className="form-select"
              aria-label="Default select example"
              style={{ cursor: "pointer", height: "35px" }}
              onChange={(e) => setLimit(e.target.value)}
              value={limit}>
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
      ) :""}
    
      <Col xl='12' sm='12'> 
      <div>
        <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
          <div>
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "white" : "#f6f6f6", borderBottom:"1px solid rgba(234, 234, 234, 1)"}}>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center"}}>NO</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NIP YPI</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NAMA</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>SEKOLAH</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>STATUS</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>ID ABSENSI</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NA</th>
                  {permission.update === 0 && permission.delete === 0 ? <></> :
                    <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                  }
                </tr>
              </thead>
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center",}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td>  

                      <td style={{ lineHeight: "2", }}>
                        <div style={{display:"flex", textAlign:""}}>
                          <div>
                            {user?.nip_ypi_karyawan === null ? user?.nip_ypi : user?.nip_ypi_karyawan}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.full_name}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.ysb_school_id}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.employment_status}
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
                            {user?.fg_active === "1"? "Aktif":"Non Aktif"}
                          </div> 
                        </div>
                      </td>

                      {permission.update === 0 && permission.delete === 0 ? <></> :
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                          {permission.update === 1 ? 
                            <button onClick={() => viewModalUpdate(user?.id, user)} style={{ fontSize: "17px", color: "#2196F3", backgroundColor: "white", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex", marginRight:"3px" }}>
                              <FaCog/>
                            </button> :""}
                            {permission.delete === 1 ?
                            <button onClick={() => {deleteById(user?.id)}} style={{ fontSize: "17px", color: "#dc3545", backgroundColor: "white",  borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              <FaTimesCircle/>
                            </button> :<></>}
                        </div>
                      </td> }

                    </tr>
                  ))}
              </tbody>
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
