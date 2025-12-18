import { useEffect, useState,useRef } from "react";
import {Col} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { Link} from "react-router-dom";
import { APIMS } from "../../../../../config/apims";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import Swal from "sweetalert2";
import swal from "sweetalert";
import ModalAdd from "./modal/add";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import {FaQrcode} from 'react-icons/fa';
import { useReactToPrint } from "react-to-print";
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Logo from "../../../../../assets/scanme.png";
import Modal from 'react-bootstrap/Modal';


export default function ListCheckPoint(props) {
  document.title = "Titik Pemeriksaan";
  const [propsData, setProopsData] = useState()
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

  const storageBranch = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');

  console.log('branch', storageBranch)

  // buat print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
      content: () => componentRef.current,
  })

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const [id, setId] = useState();

  // modal 
  const [modalAdd, setModalAdd] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedQR, setSelectedQR] = useState(null);

  const [showModalScan, setShowModalScan] = useState(false);
  const handleClose = () => setShowModalScan(false);

  const [form, setForm] = useState({
    name_room: "",
    
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleShow = async (imageUrl, checkpoint) => {
    setSelectedImage(imageUrl);
    setSelectedQR(checkpoint)
    setShowModalScan(true);
    
  };
  

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

  const [img, setImg] = useState();

  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await APIMS.get(`/api/check-points?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetData(response.data.data)
        setPage(response.data.pagination.current_page);
        setPages(response.data.pagination.total_pages);
        setRows(response.data.pagination.total);
        setImg(response.data.data.room_id)
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
        const response =  await APIMS.delete(`/api/check-points/${id}`,fetchParams);
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
 
  
  const viewModalAdd = () => {
    setModalAdd(true)
  }

  return (
    <div className="body" >

      {modalAdd  && <ModalAdd GetResponseData={GetResponseData} show={modalAdd} onHide={() => setModalAdd(false)} />}
  
     
      
      

      <div className="body-header d-flex">
      
            {isTabletOrMobile ? 
              <>
                <div className="title-page">
                  <h6> <FontAwesomeIcon icon={faUsers} /> List Titik Pemeriksaan</h6>
                </div> 
                
                <div className="ml-auto">
                  <button onClick={viewModalAdd} className="btn btn-create"> <FontAwesomeIcon icon={faUserPlus} />Titik Pemeriksaan</button>
                </div>
              </>
                : 
              <>
                <div className="title-page">
                  <h5> <FontAwesomeIcon icon={faUsers} /> List Titik Pemeriksaan </h5>
                </div>
          
                <div className="ml-auto">
                  {/* <button onClick={viewModalScanMe} className="btn btn-create mr-3"> Contoh Print QR</button> */}
                  <button onClick={viewModalAdd} className="btn btn-create "> <FontAwesomeIcon icon={faUserPlus} /> Tambah Titik Pemeriksaan</button>
                </div>
              </>
            }
      </div> 

      {loading && <LoaderHome />}
      
      <div className="body-content">
                  {/* LINE SHOW AND SEARCH */}

                  <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link to="/beranda-patrol"> Beranda </Link></li>
                          <li className="breadcrumb-item active" aria-current="page"> Titik Pemeriksaan</li>
                      </ol>
                    </nav>
                  </div>

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
              
              {/* TABLE */}
                <Col xl='12' sm='12'> 
                <div className="mt-3">
                  <div className="body-table" >
                    <div >
                      <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                        <thead>
                          <tr >
                            <th >No</th>
                            <th >Check Point</th>
                            <th >Lantai</th>
                            <th >Gedung</th>
                            <th >Cabang</th>
                            <th >Barcode</th>
                            {/* <th >Aksi</th> */}
                          </tr>
                        </thead>
                        <tbody>
                            {getData.map((checkpoint,index) => (
                              <tr key={index}>
                                <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}
                                </td>  
                                <td style={{ lineHeight: "2" }}> 
                                  {checkpoint.name_room}
                                </td>
                                <td style={{ lineHeight: "2" }}> 
                                  {checkpoint.name_floor}
                                </td>
                                <td  style={{ lineHeight: "2" }}> 
                                  {checkpoint.name_school}
                                </td>
                                <td  style={{ lineHeight: "2" }}> 
                                  {checkpoint.name_branch}
                                </td>
                                <td   style={{ lineHeight: "2" }}> 
                                   
                                    <a href="#" onClick={(e) => {e.preventDefault();handleShow(`${process.env.REACT_APP_MS}/${checkpoint.image_url}`,checkpoint);}} 
                                      style={{ textDecoration: "none", color: "blue", cursor: "pointer" }}>
                                      <FaQrcode />
                                    </a>
                                </td>
                                
                                {/* <td >
                                  <button className="ml-2 button-delete button-table" onClick={() => {deleteById(checkpoint?.id)}}> <FontAwesomeIcon icon={faTrash} />
                                  </button>                           
                                  
                                </td> */}
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

        {/* Modal */}
        <Modal size="md" aria-labelledby="contained-modal-title-vcenter"  show={showModalScan} onHide={handleClose} centered >  

          <div className="d-flex header-modal">
            <h5>Scan Me</h5>

            <div className="ml-auto x-close">
              <FontAwesomeIcon icon={faXmark} onClick={handleClose} />
            </div>
          </div>
          <hr/>

          <Modal.Body className="modal-body">
            <div >
              <div className="d-flex">
                <button onClick={handlePrint}  className="btn ml-auto mb-3" style={{backgroundColor:"#eca91aff", color:"#fff", fontSize:'14px'}}>
                Download / Print
                </button> 
              </div>
              
              <div className="scan-image-container" ref={componentRef} >
                <img src={Logo} className="mb-2" />
                <div className="img-qr" >
                  {/* <h3>Ini QR</h3> */}
                 
                    {selectedImage && <img src={selectedImage} alt="QR Code" style={{ maxWidth: "65%", height: "auto" }}/>}

                  <div className="text-qr">
                    <hr style={{width:"60%", margin: "auto"}}/>
                    <p className="mt-3">{selectedQR?.name_room} | Lantai  {selectedQR?.name_floor} </p>
                    <h6 style={{color: "#4368c5"}}>{selectedQR?.name_school}</h6>
                    <h6>{selectedQR?.name_branch}</h6>
                  </div>
                </div>
              </div>
            </div>
            
            
          </Modal.Body>
        </Modal>
      </div>


   );



}
