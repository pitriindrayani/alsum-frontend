import "bulma/css/bulma.css";

import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
// ========
import {Col} from 'reactstrap'
import { API } from "../../../config/api";
import {FaPlus,FaPlusCircle, FaCog, FaTimesCircle, FaShieldAlt, FaSync, FaArrowAltCircleRight, FaListAlt} from 'react-icons/fa'
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
// Modal Role
// import ModalAddMedis from "./ModalAdmin/ModalAdd"
// import ModalUpdateMedis from "./ModalAdmin/ModalUpdate"
import LoaderHome from "../../Loader/LoaderHome"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { useNavigate, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Login() {
  document.title = "Pengguna";
  const username = localStorage.getItem("name-admin");
  const storageEmail = JSON.parse(localStorage.getItem('email_admin'));
  const storageRole = localStorage.getItem('ysb_role_name');
  const [dataTeacher, setDataTeacher] = useState("");
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  // ==
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
  // modal role add 
 // const [id, setId] = useState();
  const [dataUpdate, setDataUpdate] = useState();
  
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  // ===
  const { id} = useParams()

  console.log('hah', id)
  const today = new Date();

  const formattedDate = today.toLocaleDateString("id-ID", {
    weekday: "long",  
    day: "2-digit",    
    month: "short",    
    year: "numeric",  
  });

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      // setLoading(true)
      const response = await 
    //   API.get(`/user-service/privileges/roles?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
      API.get(`/user-service/privileges/roles/${id}?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
        const response =  await API.delete(`/user-service/privileges/roles/${id}`,fetchParams);
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

  const viewModalUpdate = (id, user) => {
    setModalUpdate(true)
    // setId(id)
    setDataUpdate(user)
  }

  const navigateSubModules = (id, name) => {
    navigate("/users-role/" + id + "/" + name  )
  }

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  return (
    <div className="body" >
      <div className="body-header">
        <h5> <FontAwesomeIcon icon={faUsers} /> Data Pengguna</h5>
      </div>
      <div className="body-content">
        <h6>Jenis Akun Role</h6>
  
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
