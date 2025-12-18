import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap';
import { APILA } from "../../../../../../config/apila";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastError from "../../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useReactToPrint } from "react-to-print";

export default function ModalRapor(props) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [data, setData] = useState({
    name_student: "",
    nisn: "",
    output_id_user: "",
    user_id:"",
   
  });

  // no local mirror of props needed; read directly from props

  // gunakan tanggal hari ini (format Indonesia)
  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const componentRef = useRef();
  
  // const handlePrint = useReactToPrint({
    
  //         content: () => componentRef.current,

  // })

  const handlePrint = useReactToPrint({
    content: () => {
      const el = document.getElementById("printThis");
      return el;

    //   const modal = document.getElementById("printThis")
    //   const cloned = modal.cloneNode(true)
    //   let section = document.getElementById("printSection")

    //   if (!section) {
    //     section  = document.createElement("div")
    //     section.id = "printSection"
    //     document.body.appendChild(section)
    //   }

    //   section.innerHTML = "";
     

    //  return  section.appendChild(cloned);
      },
  });

  // const handlePrint = () => {

  //   const modal = document.getElementById("printThis")
  //   const cloned = modal.cloneNode(true)
  //   let section = document.getElementById("printSection")

  //   if (!section) {
  //     section  = document.createElement("div")
  //     section.id = "printSection"
  //     document.body.appendChild(section)
  //   }

  //   section.innerHTML = "";
  //   section.appendChild(cloned);

  //   window.print();
  // }

  // print() {
            
  //           const modal = document.getElementById("printThis")
  //           const cloned = modal.cloneNode(true)
  //           let section = document.getElementById("printSection")

  //           if (!section) {
  //               section  = document.createElement("div")
  //               section.id = "printSection"
  //               document.body.appendChild(section)
  //           }
  //           // let a = this.kodePengajuan

  //           section.innerHTML = "";
  //           section.appendChild(cloned);
  //           document.title='Pengajuan '+this.namaJenisPengajuan +' '+this.kodePengajuan;
  //           window.print();
  //       },

  useEffect(() => {
    setData(prev => ({
      ...prev,
      name_student: safeValue(props?.data_rapor?.name_student),
      nisn: safeValue(props?.data_rapor?.nisn),
      ysb_school_name: safeValue(props?.data_rapor?.ysb_school_name),
      ysb_number_kelas: safeValue(props?.data_rapor?.ysb_number_kelas),
      ysb_name_kelas: safeValue(props?.data_rapor?.ysb_name_kelas),
      ysb_name_year: safeValue(props?.data_rapor?.ysb_name_year),
      ysb_name_teacher: safeValue(props?.data_rapor?.ysb_name_teacher),
      ysb_nama_kepsek: safeValue(props?.data_rapor?.ysb_nama_kepsek),
      dimensi_name1: safeValue(props?.data_rapor?.dimensi?.[0]?.ysb_dimensi_name),
      dimensi_name2: safeValue(props?.data_rapor?.dimensi?.[1]?.ysb_dimensi_name),
    }));
  },[props?.data_rapor])

  return (
    <div className="modal">
      {loading && <LoaderAction/>}
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" >  

        <div className="d-flex header-modal">
            <h5>{data?.name_student}</h5>
        
            <div className="ml-auto x-close">
            <FontAwesomeIcon icon={faXmark} onClick={() => props.onHide && props.onHide()} />
          </div>
        </div>
        <hr/>
        <Modal.Body className="modal-body">
            <div className="d-flex">
                <button onClick={handlePrint}  className="btn ml-auto mb-3" style={{backgroundColor:"#eca91aff", color:"#fff", fontSize:'14px'}}>
                    Download / Print
                </button> 
            </div>

    <div ref={componentRef} style={{border: "1px solid #e2e2e2ff", paddingTop: "50px"}}>
            <div  id="printThis" className="wrap"style={{margin: "0px 30px 50px 30px"}}>

                <div className="text-center mb-4">
                    <h5>Laporan Hasil Capaian Adab</h5>
                </div>

                    <div className="row ">
                        <div className="col-8">
                            <div className="row">
                                <div className="col-4 mb-2">
                                    Nama  
                                </div>
                                <div className="col-6">
                                    : {data?.name_student}
                                </div>
                                <div className="col-4 mb-2">
                                    NISN  
                                </div>
                                <div className="col-6">
                                    : {data?.nisn}
                                </div>
                                <div className="col-4 mb-2">
                                    Nama Sekolah 
                                </div>
                                <div className="col-6">
                                    : {data?.ysb_school_name}
                                </div>
                            </div>
                        </div>

                        <div className="col-4">
                            <div className="row">
                                <div className="col-4 mb-2">
                                    Kelas  
                                </div>
                                <div className="col-6">
                                    : {data?.ysb_number_kelas} - {data?.ysb_name_kelas}
                                </div>
                                <div className="col-4 mb-2">
                                    TA
                                </div>
                                <div className="col-6">
                                    : {data?.ysb_name_year}
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <div className="table-print">
                        <table 
                          className="table table-hover table-bordered"
                          style={{
                            border: "1px solid #585858ff",
                            width: "100%",
                            tableLayout: "auto" // biarkan lebar mengikuti isi / colgroup
                          }}
                        >
                          <colgroup>
                            <col style={{ width: "12%" }} />   {/* Muatan Adab */}
                            <col style={{ width: "45%" }} />   {/* Indikator */}
                            <col style={{ width: "15%" }} />   {/* Capaian */}
                            <col style={{ width: "28%" }} />   {/* Deskripsi Pencapaian */}
                          </colgroup>

                          <thead>
                            <tr>
                              <th
                                scope="col"
                                className="table-no"
                                rowSpan={3}
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  textAlign: "center",
                                  border: "1px solid #585858ff",
                                  verticalAlign: "middle",
                                }}
                              >
                                Muatan Adab
                              </th>
                              <th
                                scope="col"
                                className="table-name"
                                rowSpan={3}
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  textAlign: "center",
                                  border: "1px solid #585858ff",
                                  verticalAlign: "middle",
                                }}
                              >
                                Indikator
                              </th>
                              <th
                                scope="col"
                                colSpan={2}
                                rowSpan={2}
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  textAlign: "center",
                                  border: "1px solid #585858ff",
                                  verticalAlign: "middle",
                                }}
                              >
                                KKCA
                              </th>
                            </tr>
                            <tr></tr>
                            <tr>
                              <th
                                scope="col"
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  textAlign: "center",
                                  border: "1px solid #585858ff",
                                }}
                              >
                                Capaian
                              </th>
                              <th
                                scope="col"
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  textAlign: "center",
                                  border: "1px solid #585858ff",
                                }}
                              >
                                Deskripsi Pencapaian
                              </th>
                            </tr>
                            <tr>
                              <th
                                scope="col"
                                className="table-no"
                                colSpan={4}
                                style={{
                                  backgroundColor: "#e2e2e2ff",
                                  border: "1px solid #585858ff",
                                }}
                              >
                                A. Adab Prioritas Nasional
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {(() => {
                              const raporForStudent = (props.getRapor || []).find(
                                (r) => r.ysb_student_id === props.id_student
                              );
                              if (!raporForStudent) return null;

                              const rows = [];
                              (raporForStudent.dimensi || []).forEach((dim, dimIdx) => {
                                // header per dimensi 
                                rows.push(
                                  <tr key={`dim-header-${dimIdx}`}>
                                    <th
                                      colSpan={4}
                                      style={{
                                        backgroundColor: "#e2e2e2ff",
                                        border: "1px solid #585858ff",
                                        textAlign: "left",
                                        paddingLeft: "12px",
                                      }}
                                    >
                                      {dimIdx + 1}. {dim?.ysb_dimensi_name}
                                    </th>
                                  </tr>
                                );

                                (dim.data_elements || []).forEach((el, elIdx) => {
                                  rows.push(
                                    <tr key={`de-${dimIdx}-${elIdx}`}>
                                      <td
                                        style={{
                                          lineHeight: "1.6",
                                          border: "1px solid #e8e8e8",
                                          verticalAlign: "top",
                                          padding: "8px",
                                        }}
                                      >
                                        {el?.name_element
                                          ? (el.name_element.split(" ")[1] ?? "") + " "
                                          : ""}
                                        {el?.name_description}
                                      </td>

                                      <td
                                        style={{
                                          lineHeight: "1.6",
                                          border: "1px solid #e8e8e8",
                                          verticalAlign: "top",
                                          padding: "8px",
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {(el.sub_elements || []).map((sub, subIdx) => (
                                          <div key={`sub-${dimIdx}-${elIdx}-${subIdx}`}>
                                            {subIdx + 1}. {sub?.ysb_sub_element_name}
                                          </div>
                                        ))}
                                      </td>

                                      <td
                                        style={{
                                          lineHeight: "1.6",
                                          border: "1px solid #e8e8e8",
                                          verticalAlign: "middle",
                                          textAlign: "center",
                                          padding: "8px",
                                          whiteSpace: "normal",
                                        }}
                                      >
                                        {el?.kkca_description}
                                      </td>

                                      <td
                                        style={{
                                          lineHeight: "1.6",
                                          border: "1px solid #e8e8e8",
                                          verticalAlign: "top",
                                          padding: "8px",
                                          whiteSpace: "normal",
                                          wordBreak: "break-word",
                                        }}
                                      >
                                        {el?.kkca_description_full}
                                      </td>
                                    </tr>
                                  );
                                });
                              });
                              return rows;
                            })()}
                          </tbody>
                        </table>
                      </div>

                    {/* <div style={{marginTop: "-15px", width: "100%", backgroundColor:"#e2e2e2ff", padding:"7px 0px", border: "1px solid #585858ff"}} >
                        <h6 className="ml-2 fw-bold" style={{color: "#383838ff"}}>2. {data?.dimensi_name2}.</h6>
                    </div> */}

                    <div className="ttd mt-4">
                        <div className="d-flex">
                            <p className="ml-auto">Tangerang, {formattedDate}</p>
                        </div>

                        <div className="row" style={{ marginTop: "20px" }}>
                            <div className="col-6">
                                <p>Orang Tua/Wali Peserta Didik</p>
                                <div style={{ height: "48px" }} /> {/* ruang tanda tangan */}
                                <p>________________________________</p>
                            </div>

                            <div className="col-6 d-flex">
                                <div className="ml-auto" style={{ textAlign: "right" }}>
                                    <p>Wali Kelas {data?.ysb_number_kelas} - {data?.ysb_name_kelas}</p>
                                    <div style={{ height: "48px" }} />
                                    <p style={{ fontWeight: 600 }}>{data?.ysb_name_teacher}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row" style={{ marginTop: "40px", textAlign: "center" }}>
                            <div style={{ width: "100%" }}>
                                <p>Mengetahui,</p>
                                <p style={{ marginTop: "-8px" }}>Kepala Sekolah</p>
                                <div style={{ height: "48px" }} />
                                <p style={{ fontWeight: 600 }}>{data?.ysb_nama_kepsek}</p>
                            </div>
                        </div>
                    </div>

                    {/* <div style={{marginTop: "-10px"}}>
                        <table className="table  table-hover table-bordered " style={{border: "1px solid #585858ff"}} >
                            <tbody>
                                 {props.dummyRapor.map((rapor,index) => (
                                    rapor.ysb_student_id === props.id_student ? 
                                    <>
                                    <tr>
                                        <td style={{ lineHeight: "2" }}> 2.1 {rapor?.dimensi[1].data_elements[0].name_description} </td>
                                        <td style={{ lineHeight: "2" }}>
                                            1. {rapor?.dimensi[1].data_elements[0].sub_elements[0].ysb_sub_element_name} <br/>
                                            2. {rapor?.dimensi[1].data_elements[0].sub_elements[1].ysb_sub_element_name} <br/>
                                            3. {rapor?.dimensi[1].data_elements[0].sub_elements[2].ysb_sub_element_name} <br/>
                                            4. {rapor?.dimensi[1].data_elements[0].sub_elements[3].ysb_sub_element_name} <br/>
                                        </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[0].kkca_description} </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[0].kkca_description_full} </td>
                                    </tr>
                                    <tr>
                                        <td style={{ lineHeight: "2" }}> 2.2 {rapor?.dimensi[1].data_elements[1].name_description} </td>
                                        <td style={{ lineHeight: "2" }}>
                                            1. {rapor?.dimensi[1].data_elements[1].sub_elements[0].ysb_sub_element_name} <br/>
                                            2. {rapor?.dimensi[1].data_elements[1].sub_elements[1].ysb_sub_element_name} <br/>
                                            3. {rapor?.dimensi[1].data_elements[1].sub_elements[2].ysb_sub_element_name} <br/>
                                            4. {rapor?.dimensi[1].data_elements[1].sub_elements[3].ysb_sub_element_name} <br/>
                                        </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[1].kkca_description} </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[1].kkca_description_full} </td>
                                    </tr>
                                    <tr>
                                        <td style={{ lineHeight: "2" }}> 3.3 {rapor?.dimensi[1].data_elements[2].name_description} </td>
                                        <td style={{ lineHeight: "2" }}>
                                            1. {rapor?.dimensi[1].data_elements[2].sub_elements[0].ysb_sub_element_name} <br/>
                                            2. {rapor?.dimensi[1].data_elements[2].sub_elements[1].ysb_sub_element_name} <br/>
                                            3. {rapor?.dimensi[1].data_elements[2].sub_elements[2].ysb_sub_element_name} <br/>
                                            4. {rapor?.dimensi[1].data_elements[2].sub_elements[3].ysb_sub_element_name} <br/>
                                        </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[2].kkca_description} </td>
                                        <td style={{ lineHeight: "2" }}> {rapor?.dimensi[1].data_elements[2].kkca_description_full} </td>
                                    </tr>
                                    </>
                                    :
                                    <>
                                        
                                    </>
                                    
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="ttd mt-4">
                        <div className="d-flex">
                            <p className="ml-auto">Tangerang, 10 November 2025</p>
                        </div>
                        <div className="row ">
                            <div className="col-6">
                                <p>Orang Tua/Wali Peserta Didik</p>
                                <br />
                                <br />
                                <p>________________________________ </p>
                            </div>

                            <div className="col-6 d-flex">
                                <div className="ml-auto">
                                    <p>Wali Kelas {data?.ysb_number_kelas} - {data?.ysb_name_kelas}</p>
                                    <br />
                                    <br />
                                    <p>{data?.ysb_name_teacher}</p>
                                </div>
                                
                            </div>

                        </div>

                        <div className="row text-center " style={{margin: "auto"}}>
                            <p>Mengetahui,</p>
                            <p style={{marginTop: "-15px"}}>Kepala Sekolah</p>
                                <br />
                                <br />
                                <br />
                            <p>{data?.ysb_nama_kepsek}</p>
                           

                        </div>

                    </div> */}

            
       

                <div>
            </div>
        </div>

            
        </div>
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  