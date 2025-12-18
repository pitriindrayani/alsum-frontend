import { useEffect, useState } from "react";
import {Col} from 'reactstrap'
import { useMediaQuery } from 'react-responsive'
import { API } from "../../../config/api";
import {FaListAlt, FaPlus,FaPlusCircle,FaTrash} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
// Modal Role
import ModalAddMedis from "./ModalAdmin/ModalAdd";
import LoaderHome from "../../Loader/LoaderHome";
import ToastError from "../../NotificationToast/ToastError";
import { useParams } from "react-router-dom";
import ModalTrashMedis from "./ModalAdmin/ModalTrash";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import {  useNavigate } from "react-router-dom";


export default function Login() {
  document.title = "List Sub Module";
  const navigate = useNavigate();
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

  const navigateHome = ()=>{
    navigate("/users");
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await API.get(`/user-service/privileges/roles/${id}?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&id_module=${id}`,fetchParams)

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
    <div className="body" >
      <div className="body-header">
        <h5> <FontAwesomeIcon icon={faUsers} /> Data Pengguna 1</h5>
      </div>
      <div className="body-content">
        <h6>Jenis Akun Role</h6>
        
        <hr />
    
        {/* LINE SHOW AND SEARCH */}
        
        {isTabletOrMobile ? 
        // HP
        <div  style={{padding: "10px 20px 10px 0px",
          backgroundColor:"",  justifyContent:"end" }}>
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
          <div className="line-search mt-3" style={{ fontSize: "14px" }} >
            <form onSubmit={e => e.preventDefault()} style={{  paddingRight: "0px", borderRadius: "5px" }}>
              <div style={{ marginRight: "0px", borderRadius: "5px" }}>
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
          :
        // DESKTOP
        <div style={{ display: "flex" }} >
          <div className="line-show" >
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
          <div className="line-search" >
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
      <div className="mt-3">
        <div className="body-table" >
          <div >
            <table className="table dt-responsive nowrap w-100" id="basic-datatable">
              <thead>
                <tr >
                  <th >No</th>
                  <th >Jenis Akun</th>
                  <th >Action</th>
                </tr>
              </thead>
              <tbody>
                  {/* {getData.map((roles,index) => (
                    <tr key={index}>
                      <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}
                      </td>  
                        
                      <td style={{ lineHeight: "2" }}> 
                        {roles.name}
                      </td>
                      <td >
                        <button onClick={() => navigateSubModules(roles?.id, roles?.slug_name)} className=" button-detail">
                          Lihat Detail
                        </button>
                        
                      </td>
                    </tr>
                  ))} */}
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
    </div>
  );
}
