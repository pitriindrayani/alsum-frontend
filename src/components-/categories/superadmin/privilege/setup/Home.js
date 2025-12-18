import { useEffect, useState } from "react";
import {Col} from 'reactstrap';
import { useMediaQuery } from 'react-responsive'
import { APIUS } from "../../../../../config/apius";
import {FaArrowAltCircleRight} from 'react-icons/fa';
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import Swal from "sweetalert2";
import LoaderHome from "../../../../Loader/LoaderHome";
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function ListSetup() {
  document.title = "List Setup";
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
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});

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
      setLoading(true)
      const response = await APIUS.get(`/api/privileges/apps?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
        const response =  await APIUS.delete(`/api/privileges/apps/${id}`,fetchParams);
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

  const navigateSubModules = (id, slug_name) => {
    navigate("/privileges/app-modules/" + id  + "/" + slug_name)
  }

  return (
    <div className="body">
      <div className="body-header d-flex">
          {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6> <FontAwesomeIcon icon={faBars} /> Setup </h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faBars} /> Setup </h5>
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
              <li className="breadcrumb-item active" aria-current="page"> Setup</li>
            </ol>
          </nav>
        </div>

        {/* LINE SHOW AND SEARCH */}
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
              <div>Show </div>
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
              <div>Entries</div>
            </div>
            <div className="line-search" >
              <form onSubmit={e => e.preventDefault()} style={{ display: "flex", paddingRight: "0px", borderRadius: "5px" }}>
                <div style={{ marginRight: "5px", borderRadius: "5px" }}>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} className="focused" style={{ backgroundColor: "white", border: "3px solid #C6C6C6", height: "100%", paddingLeft: "5px", borderRadius: "5px" }} type="text" placeholder="Search" />
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
                      <tr>
                        <th>No</th>
                        <th>Kategori</th>
                        <th>Module</th>
                      </tr>
                    </thead>
                    <tbody>
                        {getData.map((user,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)} </td>  
                            <td style={{ lineHeight: "2" }}> {user?.aplikasi} </td>
                            <td style={{ lineHeight: "2" }}>
                              <div onClick={() => navigateSubModules(user?.id, user?.slug_name)}  style={{backgroundColor:"#4747AC", borderRadius:"3px", cursor:"pointer", width:"70px", color: "white", paddingLeft: "8px" }}>
                                <FaArrowAltCircleRight /> Detail 
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
      </div>
    </div>
  );
}
