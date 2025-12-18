import { useEffect, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../config/api";
import {FaPlus,FaPlusCircle, FaCog, FaTimesCircle, FaShieldAlt, FaSync, FaArrowAltCircleRight, FaListAlt} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
import Swal from "sweetalert2";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../Loader/LoaderHome"
import ToastError from "../NotificationToast/ToastError"
import ToastSuccess from "../NotificationToast/ToastSuccess"
import { useNavigate } from "react-router-dom";

export default function Login() {
  document.title = "List Module";
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
  // modal role add 
  const [id, setId] = useState();
  const [nameUpdate, setNameUpdate] = useState();
  const [iconUpdate, setIconUpdate] = useState();
  const [colorIconUpdate, setColorIconUpdate] = useState();
  const [numberOrder, setNumberOrder] = useState();
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await API.get(`/api/privileges/modules?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
    }
  }

  useEffect(() => {
    GetResponseData()
  }, [page, keyword, limit])

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
        const response =  await API.delete(`/api/privileges/modules/${id}`,fetchParams);
        if (response.data.error == false) {
          GetResponseData()
          ToastSuccess.fire({
            icon: 'success',
            title: response.data.message,
          })
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

  const viewModalUpdate = (id, name, icon_name, color_icon, number_order) => {
    setModalUpdate(true)
    setId(id)
    setNameUpdate(name)
    setIconUpdate(icon_name)
    setColorIconUpdate(color_icon)
    setNumberOrder(number_order)
  }

  const navigateSubModules = (id,slug_name) => {
    navigate("/privileges/sub-modules/" + id  + "/" + slug_name)
  }

  return (
    <div style={{ backgroundColor: "white", margin: "15px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} nameUpdate={nameUpdate} iconUpdate={iconUpdate} colorIconUpdate={colorIconUpdate} numberOrder={numberOrder} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px", color:"white", backgroundColor:"#005A9F"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Module
          </Col>
          <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#005A9F",color:"white",padding:"0px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <FaPlus/>
            </div>
            <div onClick={buttonRefresh} style={{ height: "100%", marginRight: "5px", paddingTop: "0px", backgroundColor: "white", padding: "10px 10px", borderRadius: "2px", cursor: "pointer", border: "1px solid #DEDEDE" }}>
              <FaSync style={{ fontSize: "15px", marginRight: "0px", marginTop: "0px", display: "flex", alignItems: "center", height:"100%", color:"#005A9F" }} />
            </div>
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
            </form>
          </Col>
        </div>
          :
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "flex", padding: "10px 20px 10px 0px",backgroundColor:"#005A9F", borderRadius:"5px" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", color:"white"}}>
            <FaListAlt style={{marginRight:"5px"}}/>List Module
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
            <div className="mr-2" style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"black", borderRadius:"3px", cursor:"pointer", fontSize:"12px"}}>
            {/* <div style={containerStyle} onClick={handleFileUpload}>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  style={inputStyle}
                />
                <div style={{display:"flex",alignItems:"center", cursor:"pointer"}}>
                <FaFileExcel style={{cursor:"pointer"}}/> &nbsp;
                Export To Excel
              </div>
              </div> */}
            </div>
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"#005A9F",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <div>
                <FaPlusCircle/> &nbsp;
              </div>
              <div>
                Tambah Module
              </div>
            </div>
          </div>
        </div>  
      }

      {isTabletOrMobile ? 
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
      }
    
      <Col xl='12' sm='12'> 
      <div>
        <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
          <div >
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "white" : "white", borderBottom:"1px solid #BCBCBC"}}>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>No</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Nama Module</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Icon</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Number Order</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Sub Module</th>
                  <th style={{fontFamily:"revert",fontSize:"12px",textAlign:"center", color:"#525252",border:"none", fontFamily:"sans-serif"}}>Action</th>
                </tr>
              </thead>
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center"}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td>                      
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user?.name}
                          </div> 
                        </div>
                      </td>
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            <i className={user?.icon_name} style={{fontSize:"15px", color: user?.color_icon === null? "black" : user?.color_icon}}/>
                          </div> 
                        </div>
                      </td>
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", alignItems:"center", justifyContent:"center"}}>
                          <div>
                            <div style={{  display:"flex", justifyContent:"center" }}>
                              <div style={{ borderRadius:"3px", fontWeight:"bold",border:"1px solid #FFB450", color:"black", padding:"0px 20px"}}>
                                {user?.number_order}
                              </div>
                            </div>
                          </div> 
                        </div>
                      </td>
                      <td style={{ lineHeight: "2"}}>
                        <div style={{display:"flex", justifyContent:"center"}}>
                          <div onClick={() => navigateSubModules(user?.id, user?.slug_name)} style={{display: "flex",justifyContent:"center", backgroundColor:"#005A9F", borderRadius:"3px", cursor:"pointer", width:"70px" }}>
                              <div style={{ display: "flex"}}>
                                <FaArrowAltCircleRight style={{display:"flex", alignItems:"center", height:"100%", fontSize:"11px", marginRight:"4px", color:"white"}}/>  
                              </div>
                              <div style={{ display: "flex", alignItems: "center", height: "100%", fontSize: "11px", marginTop:"1px", color: "white", fontWeight:"bold"}}>
                                Detail
                              </div>  
                            </div> 
                          </div>
                      </td>
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <button onClick={() => viewModalUpdate(user?.id, user?.name, user?.icon_name, user?.color_icon, user?.number_order)} style={{ fontSize: "17px", color: "#2196F3", backgroundColor: "white", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex", marginRight:"3px" }}>
                              <FaCog/>
                            </button>
                            <button onClick={() => {deleteById(user?.id)}} style={{ fontSize: "17px", color: "#dc3545", backgroundColor: "white",  borderRadius: "3px", cursor: "pointer", border: "none", display:"flex" }}>
                              <FaTimesCircle/>
                            </button>
                        </div>
                      </td>
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
