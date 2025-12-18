import { useEffect, useState } from "react";
import {Button, Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import { FaSync, FaListAlt, FaCheck, FaPlus, FaPlusCircle} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
// Modal Role
import ModalAdd from "./ModalAdmin/ModalAdd";
import ModalUpdate from "./ModalAdmin/ModalUpdate";
import ModalUpdateHr from "./ModalAdmin/ModalUpdateHr";
import LoaderHome from "../Loader/LoaderHome"
import { Modal } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import FormatHolidayDate from '../Function/FormatDate';

export default function Login() {
  document.title = "List Wfh";
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
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
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dataUpdate, setDataUpdate] = useState();

  const handleShow = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  // modal add
  const handleClose = () => setShowModal(false);
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalUpdateHr, setModalUpdateHr] = useState(false);  
  const [loading, setLoading] = useState(false);
  const rolesData = JSON.parse(localStorage.getItem('roles')) || [];
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
  const storageSchoolId = localStorage.getItem('ysb_school_id');
  const storageTeacherId = localStorage.getItem('id_teacher');


  const filteredRolesHr = rolesData.filter(role => 
     ['hr_makassar', 'hr_serpong', 'hr_bekasi', 'hr_bandung', 'hr'].includes(role.slug_name)
  );

  // console.log(filteredRolesHr.length > 0 ? true:false)
  
  const filteredRolesHeadSchool = rolesData.filter(role => 
     ['kepala_sekolah_bekasi','kepala_sekolah_makassar','kepala_sekolah_bandung','kepala_sekolah_serpong','wakil_kepala_sekolah_serpong','wakil_kepala_sekolah_bekasi','wakil_kepala_sekolah_makassar','wakil_kepala_sekolah_bandung'].includes(role.slug_name)
  );

    // console.log(filteredRolesHeadSchool.length > 0 ? true:false)

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
    }else{
      const foundPermission = storageItems.find(item => item.menu?.url === location.pathname);
      if(!foundPermission){ 
        navigate('/dashboard');
      } else{
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
      const response = await API.get(`/api/wfh?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&level=${storageLevel}&branch=${storageBranch}&role_hr=${filteredRolesHr.length > 0 ? "true":"false"}&role_head_school=${filteredRolesHeadSchool.length > 0 ? "true":"false"}&ysb_school_id=${storageSchoolId}&ysb_teacher_id=${storageTeacherId}`,fetchParams)

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

  const approveHeadSchool = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Approve data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Approve'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/wfh/approve-head-school/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          swal({
            title: 'Success',
            text: "Data berhasil di approve!",
            icon: 'success',
            timer: 3000,
            buttons: false
          });
        }  
      }
    })
  };

  const cancelApproveHeadSchool = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Cancel data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/wfh/cancel-head-school/${id}`,fetchParams);
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

  const approveHr = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Approve data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Approve'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/wfh/approve-hr-school/${id}`,fetchParams);
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

  const cancelApproveHr = async (id) => {
    Swal.fire({
      title: 'Apakah Kamu Yakin?',
      text: `Cancel data ini`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    }).then( async (result) => {
      if(result.isConfirmed) {
        const response =  await API.delete(`/api/wfh/cancel-hr-school/${id}`,fetchParams);
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

  const viewModalUpdate = (id, user) => {
    setModalUpdate(true)
    setId(id)
    setDataUpdate(user)
  }

  const viewModalUpdatHr = (id, user) => {
    setModalUpdateHr(true)
    setId(id)
    setDataUpdate(user)
  }

  return (
    <div style={{ backgroundColor: "white", margin: "15px", marginRight: "10px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAdd GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdate GetResponseData={GetResponseData} dataUpdate={dataUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {modalUpdateHr && <ModalUpdateHr GetResponseData={GetResponseData} dataUpdate={dataUpdate} id={id} show={modalUpdateHr} onHide={() => setModalUpdateHr(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#2e649d"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Wfh
          </Col>
          <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
            {permission.create === 1 ?
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#2e649d",color:"white",padding:"0px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <FaPlus/>
            </div> : ""}
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
            <FaListAlt style={{marginRight:"5px"}}/>List Wfh
          </div>
          {permission.create === 1 ?
          <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"#005A9F",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
            <div>
              <FaPlusCircle/> &nbsp;
            </div>
            <div>
              Tambah 
            </div>
          </div> : ""}
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
          <div>
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "white" : "white", borderBottom:"1px solid rgb(214, 214, 214)"}}>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center"}}>NO</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NIP YPI</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>NAMA</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL PENGAJUAN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>TANGGAL APPROVE</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JAM MASUK</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JAM KELUAR</th>
                  {/* <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>JENIS KOREKSI</th> */}
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>KETERANGAN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>DOKUMEN</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: ""}}>STATUS</th>
                  {permission.update === 0 && permission.delete === 0 ? <></> :
                  (filteredRolesHr.length > 0 ? 
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                  : filteredRolesHeadSchool.length > 0 ? 
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign:"center"}}>ACTION</th>
                  : <></>
                  )}
                </tr>
              </thead>
              {permission.read === 1 ?
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center"}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td>  
                  
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                          <div>
                            {user?.teacher_nip_ypi}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left", minWidth:"120px"}}>
                          <div>
                            {user?.full_name}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                          <div>
                            <FormatHolidayDate props={user?.att_date}/>
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                          <div>
                            {user?.created_at !== null?
                            <>
                              <FormatHolidayDate props={user?.created_at.split(" ")[0]}/>
                              {user?.created_at.split(" ")[1].split(":")[0]}:{user?.created_at.split(" ")[1].split(":")[1]}
                            </>
                            :<></>}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left", minWidth:"80px"}}>
                          <div>
                            {user?.approve_at_head !== null?
                            <>
                              <FormatHolidayDate props={user?.approve_at_head.split(" ")[0]}/>
                              {user?.approve_at_head.split(" ")[1].split(":")[0]}:{user?.approve_at_head.split(" ")[1].split(":")[1]} 
                            </>
                            :<></>}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.att_clock_in}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.att_clock_out}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex",  textAlign:"left",wordWrap:"break-word",minWidth:"150px",maxWidth: "250px"}}>
                          <div>
                            {user?.keterangan}
                          </div> 
                        </div>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px", textAlign: "left" }}>
                        {user?.dokument? (
                          user.dokument.toLowerCase().endsWith(".pdf")?(
                            <a href={`${process.env.REACT_APP_API_KEY}/storage/${user.dokument}`} target="_blank" rel="noopener noreferrer"
                              style={{ textDecoration: "none", color: "blue" }}>
                              Lihat File PDF
                            </a>
                            ):(
                            <>
                              <a href="#" onClick={(e) => {e.preventDefault();handleShow(`${process.env.REACT_APP_API_KEY}/storage/${user.dokument}`);}} 
                                style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
                                Lihat File
                              </a>
                            </>
                            )
                          ):(
                            <></>
                          )}
                        </div>

                        {/* Modal */}
                        <Modal size="xl" show={showModal} onHide={handleClose} centered>
                          <Modal.Header closeButton>
                            <Modal.Title>Preview Dokumen</Modal.Title>
                          </Modal.Header>
                          <Modal.Body className="text-center">
                            {selectedImage && <img src={selectedImage} alt="Dokumen" style={{ maxWidth: "100%", height: "auto" }} />}
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Tutup
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </td>

                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", alignItems:"", justifyContent:"", textAlign:"left"}}>
                          <div>
                            {user?.approve_head_school === 0 && user?.approve_hr === 0 ? "Proses Kepsek" :
                            user?.approve_head_school === 1 && user?.approve_hr === 0 ? "Proses Hr" : 
                            user?.approve_head_school === 1 && user?.approve_hr === 1 ? 
                            <div style={{color:"#13C06F", fontWeight:""}}>Disetujui <FaCheck/></div> : <></>
                            }
                          </div> 
                        </div>
                      </td>

                    {permission.update === 0 && permission.delete === 0 ? <></> :
                      (user?.approve_head_school === 0 && user?.approve_hr === 0 && filteredRolesHeadSchool.length > 0 && user?.period_data !== null && user?.period_data?.fg_active === 1? 
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <Button className="mr-2" color="warning" onClick={() => {approveHeadSchool(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Approve
                            </Button>
                            <Button className="mr-2" color="primary" onClick={() => viewModalUpdate(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Edit
                            </Button>
                            <Button color="danger" onClick={() => {cancelApproveHeadSchool(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Batal
                            </Button>
                        </div>
                      </td>
                      : user?.approve_head_school === 1 && user?.approve_hr === 0 && filteredRolesHr.length > 0 && user?.period_data !== null && user?.period_data?.fg_active === 1?
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <Button className="mr-2" color="warning" onClick={() => {approveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Approve
                            </Button>
                            <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Edit
                            </Button>
                            <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Batal
                            </Button>
                        </div> 
                      </td>
                      : user?.approve_head_school === 1 && user?.approve_hr === 0 && filteredRolesHr.length > 0 && user?.period_data !== null && user?.period_data?.fg_active === 0?
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <Button className="mr-2" color="warning" onClick={() => {approveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Approve
                            </Button>
                            <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Edit
                            </Button>
                            <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Batal
                            </Button>
                        </div> 
                      </td>
                      : user?.approve_head_school === 1 && user?.approve_hr === 1 && filteredRolesHr.length > 0 && user?.period_data !== null && user?.period_data?.fg_active === 1?
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Edit
                            </Button>
                            <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Hapus
                            </Button>
                        </div> 
                      </td>
                      : user?.approve_head_school === 1 && user?.approve_hr === 1 && filteredRolesHr.length > 0 && user?.period_data !== null && user?.period_data?.fg_active === 0?
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <Button className="mr-2" color="primary" onClick={() => viewModalUpdatHr(user?.id, user)} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Edit
                            </Button>
                            <Button color="danger" onClick={() => {cancelApproveHr(user?.id)}} style={{color:"white", fontSize: "10px", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              Hapus
                            </Button>
                        </div> 
                      </td>
                      : user?.approve_head_school === 1 && user?.approve_hr === 1 ? 
                      <td style={{lineHeight:"1"}}></td>
                      : <td style={{lineHeight:"1"}}></td>
                      )}
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