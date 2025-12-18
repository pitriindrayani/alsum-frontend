import { useEffect, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { APIUS } from "../../config/apius";
import {FaPlus,FaPlusCircle, FaCog, FaTimesCircle, FaSync, FaListAlt} from 'react-icons/fa'
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
import { useParams } from "react-router-dom";

export default function Login() {
  document.title = "List Role Permission";
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
  const [idAdd, setIdAdd] = useState();
  const [iconUpdate, setIconUpdate] = useState();
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams()

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await APIUS.get(`/api/privileges/role-permissions/${id}?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
        const response =  await APIUS.delete(`/api/privileges/role-permissions/${id}`,fetchParams);
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
    setIdAdd(id)
  }

  const viewModalUpdate = (id) => {
    setModalUpdate(true)
    setIdAdd(id)
  }

  return (
    <div className="body" style={{ backgroundColor: "white", margin: "15px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} idAdd={idAdd} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdateMedis GetResponseData={GetResponseData} idAdd={idAdd} iconUpdate={iconUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      {loading && <LoaderHome />}
      
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px"}}>
              <FaListAlt style={{marginRight:"5px"}}/>List Role Permission
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
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "flex", padding: "10px 20px 10px 0px", borderRadius:"5px" }}>
          <div style={{flex:"50%",fontSize:"16px",display:"flex", alignItems:"center", paddingLeft:"10px", }}>
            <FaListAlt style={{marginRight:"5px"}}/>List Role Permission
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
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#4747AC",color:"#fff",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"14px", cursor:"pointer"}}>
              <div>
                <FaPlusCircle/> &nbsp;
              </div>
              <div>
                Tambah Permission
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
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>No</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Nama Menu</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Url</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Create</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Read</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Update</th>
                  <th style={{ fontFamily: "revert", fontSize: "14px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Delete</th>
                  <th style={{fontFamily:"revert",fontSize:"14px",textAlign:"center", color:"#525252",border:"none", fontFamily:"sans-serif"}}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"14px", textAlign:"center"}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td>                      
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user.menu_data.name} 
                          </div> 
                        </div>
                      </td>
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user.menu_data.url} 
                          </div> 
                        </div>
                      </td>

                  <td style={{ lineHeight: "2" }}>
                    {user.create?
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#159B00", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Acces</div> 
                    </div>
                      :
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#B92500", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Not Acces</div> 
                    </div>
                    }
                  </td>
                  <td style={{ lineHeight: "2" }}>
                    {user.read?
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#159B00", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Acces</div> 
                    </div>
                      :
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#B92500", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Not Acces</div> 
                    </div>
                    }
                  </td><td style={{ lineHeight: "2" }}>
                    {user.update?
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#159B00", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Acces</div> 
                    </div>
                      :
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#B92500", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Not Acces</div> 
                    </div>
                    }
                  </td><td style={{ lineHeight: "2" }}>
                    {user.delete?
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#159B00", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Acces</div> 
                    </div>
                      :
                    <div style={{display:"flex", justifyContent:"center"}}> 
                      <div style={{border:"", padding:"0px 10px", backgroundColor:"#B92500", borderRadius:"3px", color:"white", fontWeight:"bold"}}>Not Acces</div> 
                    </div>
                    }
                  </td>
                      <td style={{lineHeight:"1"}}>
                        <div style={{display:"flex",justifyContent:"center", alignItems:"center", alignContent:"center"}}>
                            <button onClick={() => viewModalUpdate(user?.id)} style={{ fontSize: "17px", color: "#2196F3", backgroundColor: "white", borderRadius: "3px", cursor: "pointer", border: "none", display:"flex", marginRight:"3px" }}>
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
