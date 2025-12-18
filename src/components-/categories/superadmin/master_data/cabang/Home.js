import { useEffect, useState } from "react";
import {Col} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APIMS } from "../../../../../config/apims";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../../../../index.css"
import Swal from "sweetalert2";
import swal from "sweetalert";
import ModalAdd from "./modal/add";
import ModalUpdate from "./modal/update";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Cabang() {
  document.title = "List Cabang";
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(1);
  const [rows, setRows] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const token = localStorage.getItem("token");

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});

  // modal update
  const [id, setId] = useState();
  const [branchCodeUpdate, setBranchCodeUpdate] = useState();
  const [branchNameUpdate, setBranchNameUpdate] = useState();
  const [parentIdUpdate, setParentIdUpdate] = useState();  

  // modal add
  const [modalAdd, setModalAdd] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
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
      const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
        const response =  await APIMS.delete(`/api/branches/${id}`,fetchParams);
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

  return (
    <div className="body" >

      {modalAdd  && <ModalAdd GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
      {modalUpdate && <ModalUpdate GetResponseData={GetResponseData} branchCodeUpdate={branchCodeUpdate} branchNameUpdate={branchNameUpdate} 
      parentIdUpdate={parentIdUpdate} id={id} show={modalUpdate} onHide={() => setModalUpdate(false)} />}

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6> <FontAwesomeIcon icon={faCodeBranch} /> Data Cabang</h6>
            </div> 
            
            <div className="ml-auto">
              <button onClick={viewModalAdd} className="btn btn-create"> <FontAwesomeIcon icon={faPlus} />Cabang</button>
            </div>
          </>
            : 
          <>
            <div className="title-page">
              <h5> <FontAwesomeIcon icon={faCodeBranch} />Data Cabang </h5>
            </div>
      
            <div className="ml-auto">
              <button onClick={viewModalAdd} className="btn btn-create"> <FontAwesomeIcon icon={faPlus} /> Tambah Cabang</button>
            </div>
          </>
        }
      </div> 

      {loading && <LoaderHome />}

      <div className="body-content">

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
                        <th>No </th>
                        <th>Kode Cabang</th>
                        <th>Nama Cabang</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                        {getData.map((cabang,index) => (
                          <tr key={index}>
                            <td style={{ lineHeight: "2" }}> {(page - 1) * 10 + (index + 1)} </td>  
                            <td style={{ lineHeight: "2" }}> {cabang.branch_initial} </td>
                            <td style={{ lineHeight: "2" }}> {cabang.branch_name} </td>
                            <td>
                              <button className="button-edit button-table" onClick={() => viewModalUpdate(cabang?.id, cabang?.branch_code, cabang?.branch_name, cabang?.parent_id)} > <FontAwesomeIcon icon={faPenToSquare} /> </button>
                              <button className="ml-2 button-delete button-table" onClick={() => {deleteById(cabang?.id)}}> <FontAwesomeIcon icon={faTrash} /> </button>
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
