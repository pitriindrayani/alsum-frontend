import { useEffect, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { APIUS } from "../../config/apius";
import {FaListAlt, FaPlus,FaPlusCircle,FaTrash} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../index.css"
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd"
import LoaderHome from "../Loader/LoaderHome"
import ToastError from "../NotificationToast/ToastError"
import { useParams } from "react-router-dom";
import ModalTrashMedis from "./ModalAdmin/ModalTrash"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function Login() {
  document.title = "List Sub Module";
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
  const [modalAdd, setModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams()
  const [idTrash, setIdTrash] = useState();
  const [modalRoleTrash, setModalRoleTrash] = useState(false);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await APIUS.get(`/api/privileges/module-menus?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&id_module=${id}`,fetchParams)

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
 
  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  
  const viewModalAdd = () => {
    setModalAdd(true)
    setIdAdd(id)
  }

  const modalMedisRoleTrash = () => {
    setModalRoleTrash(true)
    setIdTrash(id)
  }

  return (
    <div className="body" style={{ backgroundColor: "white", margin: "10px", boxShadow: "2px 2px 10px #BFBFBF" }}>
      {modalAdd  && <ModalAddMedis GetResponseData={GetResponseData} idAdd={idAdd} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalRoleTrash && <ModalTrashMedis GetResponseData={GetResponseData} idTrash={idTrash} show={modalRoleTrash} onHide={() => setModalRoleTrash(false)} />}
      {loading && <LoaderHome />}
      
     
      {isTabletOrMobile ? 
        <div style={{ paddingLeft: "0px", width: "100%", borderBottom: "5px solid #EEEEEE", display: "", padding: "0px 0px 10px 0px" }}>
          <Col xl="6" style={{fontSize:"16px",display:"flex", justifyContent:"center", alignItems:"center", padding:"7px"}}>
            <FaListAlt style={{marginRight:"5px"}}/>List Sub Module
          </Col>
          <Col className="mt-2" xl="6" style={{ display: "flex", justifyContent:"end", paddingRight:"5px" }}>
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px", padding:"0px 12px", borderRadius:"3px", cursor:"pointer", fontSize:"12px", cursor:"pointer"}}>
              <FaPlus/>
            </div>
            <div onClick={modalMedisRoleTrash} style={{ display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: "white", color: "#E60000", padding: "0px 10px", boxShadow: "1px 1px 4px #8B8B8B", borderRadius: "3px", cursor: "pointer", fontSize: "15px", cursor: "pointer" }}>
              <FaTrash/>
            </div>
            <form onSubmit={searchData} style={{display:"flex", paddingRight:"0px"}}>
                <div style={{marginRight:"2px",borderRadius:"3px"}}>
                  <input value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="focused"
                    style={{backgroundColor:"#E9E9E9", border:"none",height:"35px", paddingLeft:"5px"}}
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
            <FaListAlt style={{marginRight:"5px"}}/>List Sub Module
          </div>
          <div style={{ flex: "50%", display: "flex", justifyContent:"end" }}>
            <div className="mr-2" style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"white",color:"black", borderRadius:"3px", cursor:"pointer", fontSize:"12px"}}>
            </div>
            <div onClick={modalMedisRoleTrash} style={{ display: "flex", alignItems: "center", marginRight: "10px", backgroundColor: "white", color: "#E60000", padding: "0px 10px", boxShadow: "1px 1px 4px #8B8B8B", borderRadius: "3px", cursor: "pointer", fontSize: "15px", cursor: "pointer" }}>
              <FaTrash/>
            </div>
            <div onClick={viewModalAdd} style={{display:"flex",alignItems:"center",marginRight:"5px",backgroundColor:"#4747AC",color:"#fff",padding:"8px 10px", borderRadius:"3px", cursor:"pointer", fontSize:"14px", cursor:"pointer"}}>
              <div>
                <FaPlusCircle/> &nbsp;
              </div>
              <div>
                Tambah Sub Module
              </div>
            </div>
          </div>
        </div>  
      }

      <div className="body-content">
          {/* LINE SHOW AND SEARCH */}
           {isTabletOrMobile ? 
            // HP
            <div  style={{padding: "10px 20px 10px 0px", backgroundColor:"",  justifyContent:"end" }}>
              <div className="line-show" style={{display:"flex", justifyContent:"end" }}>
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
              <div className="line-search mt-3" style={{ fontSize: "14px" }} >
                <form onSubmit={e => e.preventDefault()} style={{  paddingRight: "0px", borderRadius: "5px" }}>
                  <div style={{ marginRight: "0px", borderRadius: "5px" }}>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} className="focused" style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }} type="text" placeholder="Search" />
                  </div>
                </form>
              </div>
            </div> 
            :
            // DESKTOP
            <div style={{ display: "flex" }} >
              <div className="line-show" >
                <div>
                  Show 
                </div>
                &nbsp;
                <div>
                  <select className="form-select" aria-label="Default select example" style={{ textAlign: "", cursor: "pointer", height: "35px" }} onChange={(e) => setLimit(e.target.value)} value={limit}>
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
              <div className="line-search" >
                <form onSubmit={e => e.preventDefault()} style={{ display: "flex", paddingRight: "0px", borderRadius: "5px" }}>
                  <div style={{ marginRight: "5px", borderRadius: "5px" }}>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} className="focused" style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }} type="text" placeholder="Search"/>
                  </div>
                </form>
              </div>
            </div> 
          }
                          
          {/* TABLE */}
            <Col xl='12' sm='12'> 
            <div className="mt-3">
              <div className="body-table" >
                <div >
                  <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                    <thead>
                      <tr >
                        <th >No</th>
                        <th >Nama Menu</th>
                        <th >Icon</th>
                        <th >Number Order</th>
                      </tr>
                    </thead>
                    <tbody>
                        {getData.map((user,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}
                            </td>  
                            <td style={{ lineHeight: "2" }}> 
                               {user.menu_data.name}<i className={user.menu_data.icon} style={{ color: "#3D64FF", fontSize: "15px", marginLeft: "10px" }} />
                            </td>
                            <td style={{ lineHeight: "2" }}> 
                             {user.menu_data.url}
                            </td>
                            <td style={{ lineHeight: "2" }}> 
                              <div style={{  display:"flex" }}>
                                <div style={{ borderRadius:"3px", fontWeight:"bold",border:"1px solid #FFB450", color:"black", padding:"0px 20px"}}>
                                  {user?.menu_data.number_order}
                                </div>
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

      {/* {isTabletOrMobile ? 
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
      }
    
      <Col xl='12' sm='12'> 
      <div>
        <div style={{display:"block", height:"100%", overflowY:"auto",overflowX:"auto"}}>
          <div >
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr style={{backgroundColor: isTabletOrMobile? "white" : "white", borderBottom:"1px solid #BCBCBC"}}>
                  <th style={{ fontFamily: "revert", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>No</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Nama Menu</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Url</th>
                  <th style={{ fontFamily: "revert", fontSize: "12px", textAlign: "center", color: "#525252", border: "none", fontFamily: "sans-serif" }}>Number Order</th>
                </tr>
              </thead>
              <tbody>
                  {getData.map((user,index) => (
                    <tr key={index} style={{fontFamily:"Poppins", fontSize:"11px", textAlign:"center"}}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}</td> 
                      <td style={{ lineHeight: "2" }}>
                        <div style={{display:"flex", textAlign:"left"}}>
                          <div>
                            {user.menu_data.name}<i className={user.menu_data.icon} style={{ color: "#3D64FF", fontSize: "15px", marginLeft: "10px" }} />
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
                     
                      <td style={{ lineHeight: "2", display: "", justifyContent: "" }}>
                        <div style={{display:"flex", justifyContent:"center"}}>
                          <div style={{display: "flex",justifyContent:"center", padding: "0px 10px", backgroundColor:"white", borderRadius:"3px", cursor:"", border:"1px solid #00C670" }}>
                            <div style={{ display: "flex"}}>
                              <div style={{ display: "flex", alignItems: "center", fontSize: "11px", marginTop:"1px", color: "", fontWeight:"bold"}}>
                                {user?.menu_data.number_order}
                              </div>  
                            </div>
                          </div>  
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
                aria-label="pagination">
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
      </Col> */}
    </div>
  );
}
