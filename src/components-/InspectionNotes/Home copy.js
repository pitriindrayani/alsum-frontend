import { useEffect, useState } from "react";
import {Col} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { API } from "../../config/api";
import "bulma/css/bulma.css";
import "../../index.css";
import Swal from "sweetalert2";
import swal from "sweetalert";
import ModalHasilScan from "./ModalAdmin/ModalHasilScan";
import ModalScan from "./ModalAdmin/ModalScan";
import ModalUpdate from "./ModalAdmin/ModalUpdate";
import LoaderHome from "../Loader/LoaderHome";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import ChooseFilter from './ChooseFilter';

export default function InspectionNotes() {
  document.title = "Catatan Pemeriksaan";
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
  const [idUser, setIdUser] = useState(false);
  const [getDataTotalCheckPointLog, setGetDataToltalCheckPointLog] = useState([]);

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  // modal update
  const [id, setId] = useState();
  const [dataUpdate, setDataUpdate] = useState();

  // modal add
  const [modalScan, setModalScan] = useState(false);
  const [modalHasilScan, setModalHasilScan] = useState(false);
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
      // setLoading(true)
      const response = await API.get(`/master-service/check-points?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)

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
        const response =  await API.delete(`/master-service/check-points/${id}`,fetchParams);
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

  // const viewModalScan = async () => {
  //     setModalScan(true)
  //     await new Promise(r => setTimeout(r, 100))
  //     const videoElement = document.getElementById('scanView')
  //     const scanner = new QrScanner(
  //       videoElement,
  //       result => {
  //         hasilScan = result.data
         
  //         stopScan = true
  //       },
  //       {
  //         onDecodeError: error => {
  //           console.error(error)
  //         },
  //         maxScansPerSecond: 1,
  //         highlightScanRegion: true,
  //         highlightCodeOutline: true,
  //         returnDetailedScanResult: true
  //       }
  //     )
  //     await scanner.start()
  //     while (stopScan === false) await new Promise(r => setTimeout(r, 100))
  //     scanner.stop()
  //     scanner.destroy()
  //   }

  
  
  // const viewModalScan = () => {
  //   setModalScan(true)
  // }

  const viewModalHasilScan = () => {
    setModalHasilScan(true)
  }

  const viewModalUpdate = (id, checkpoint) => {
    setModalUpdate(true)
    setId(id)
    setDataUpdate(checkpoint)
  }

  const GetResponseDataCheckPoint = async () => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await API.get(`/master-service/check-points?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&date_check=${currentDate}`,fetchParams)
      if (response?.status === 200) {
        setGetDataToltalCheckPointLog(response.data.pagination.total)
        }
    } catch (error) {
    
    }
  }

  useEffect(() => {
    GetResponseDataCheckPoint()
  }, [])

  const viewModalScan = ( id_user) => {
    setModalScan(true)
    setIdUser(id_user)
  }
  return (
    <div className="body" >

      {modalHasilScan  && <ModalHasilScan GetResponseData={GetResponseData} show={ModalHasilScan} onHide={() => setModalHasilScan(false)} />}

      {/* {modalScan  && <ModalScan GetResponseData={GetResponseData} show={ModalScan} onHide={() => setModalScan(false)} />} */}

         

      {modalScan  && <ModalScan GetResponseDataCheckPoint={GetResponseDataCheckPoint} iduser={idUser} show={modalScan} onHide={() => setModalScan(false)} />}

      {modalUpdate && <ModalUpdate GetResponseData={GetResponseData} id={id} dataUpdate={dataUpdate} show={modalUpdate} onHide={() => setModalUpdate(false)} />}
      
      {loading && <LoaderHome />}

      <div className="body-header d-flex">
      
            {isTabletOrMobile ? 
              <>
                <div className="title-page">
                  <h6> <FontAwesomeIcon icon={faUsers} /> Catatan Pemeriksaan</h6>
                </div> 
                
                <div className="ml-auto">
                  {/* <button onClick={viewModalHasilScan} className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} />Scan QR</button> */}
                  {/* <button onClick={viewModalScan}  className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} /> Scan QR</button> */}

                  <button  onClick={() => viewModalScan()}   className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} /> Scan QR</button>
                  
                </div>
              </>
                : 
              <>
                <div className="title-page">
                  <h5> <FontAwesomeIcon icon={faUsers} /> Catatan Pemeriksaan </h5>
                </div>
          
                
                <div className="ml-auto">
                  {/* <button onClick={viewModalHasilScan} className="btn btn-create mr-3"> Contoh Setelah di QR</button> */}
                  <button onClick={viewModalScan}  className="btn btn-create"> <FontAwesomeIcon icon={faQrcode} /> Scan QR</button>
                </div>
              </>
            }
                
      </div> 
      
      <div className="body-content">
              
              <ChooseFilter/>
              <hr/>

              <h6 style={{fontSize: '18px'}}> Data Per Hari Ini</h6>
              
              
              {/* TABLE */}
                <Col xl='12' sm='12'> 
                <div className="mt-3">
                  <div className="body-table" >
                    <div >
                      <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                        <thead>
                          <tr >
                            <th >No</th>
                            <th >Ruangan</th>
                            <th >Lantai</th>
                            <th >Gedung</th>
                            <th >Note</th>
                            <th >Action</th>
                          </tr>
                        </thead>
                        <tbody>
                            {/* {getData.map((checkpoint,index) => (
                              <tr key={index}>
                                <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)}
                                </td>  
                                <td style={{ lineHeight: "2" }}> 
                                  {checkpoint.ysb_room_id}
                                </td>
                                <td >
                                  <button className="button-edit button-table" onClick={() => viewModalUpdate(checkpoint?.id, checkpoint)} > <FontAwesomeIcon icon={faPenToSquare} />
                                  </button>
                                  <button className="ml-2 button-delete button-table" onClick={() => {deleteById(checkpoint?.id)}}> <FontAwesomeIcon icon={faTrash} />
                                  </button>                           
                                  
                                </td>
                              </tr>
                            ))} */}
                        </tbody>
                      </table>
                        
                    </div>
                  </div>
                </div>
              </Col>
        </div>
      </div>
   );



}
