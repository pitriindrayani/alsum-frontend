import {  useState, useEffect, useRef } from "react";
import { Form,Button } from 'reactstrap'
import { APILA } from "../../../config/apila";
import { APIMS } from "../../../config/apims";
import { APIUS } from "../../../config/apius";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderHome"
import "../../../index.css"
import ToastError from "../../NotificationToast/ToastError"
import ToastSuccess from "../../NotificationToast/ToastSuccess"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const nameInputRef = useRef(null); 
  const safeValue = (value) => value ?? "";

  // Data
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getDataTA, setGetDataTA] = useState([]);
  const [getDataSekolah, setGetSekolah] = useState([]);
  const [getDataTeacher, setGetTeacher] = useState([]);
  const [getDataStudent, setGetStudent] = useState([]);
  const [getDataKelas, setGetKelas] = useState([]);

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };


  const [form, setForm] = useState({
    ysb_semester_id:"",
    ysb_branch_id : "",
    ysb_school_id:"",
    ysb_teacher_id: "",
    ysb_student_id: "",
    ysb_kelas_id:"",
    user_id:"",    
   
  });

  useEffect(() => {
    setForm({
    ...form,
      ysb_semester_id: safeValue(props?.dataUpdate?.ysb_semester_id),
      ysb_branch_id: safeValue(props?.dataUpdate?.ysb_branch_id),
      ysb_school_id: safeValue(props?.dataUpdate?.ysb_school_id),
      ysb_teacher_id: safeValue(props?.dataUpdate?.ysb_teacher_id),
      ysb_student_id: safeValue(props?.dataUpdate?.ysb_student_id),
      ysb_kelas_id: safeValue(props?.dataUpdate?.ysb_kelas_id),
      user_id: safeValue(props?.dataUpdate?.user_id)
    });
  },[props])

  const GetResponseTA = async () => {
      const response = await APILA.get(`/api/semesters?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDataTA(response.data.data);
  } 

  const GetResponseCabang = async () => {
      const response = await APIMS.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDataCabang(response.data.data);
  } 

   useEffect(() => {
      GetResponseTA();
      GetResponseCabang();
    }, [])

  const GetResponseSekolah = async () => {
          try {
             const response = await APIMS.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetSekolah(response.data.data)
              }
          } catch (error) {
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
    if (form?.ysb_branch_id) {
      GetResponseSekolah()     
    }
  }, [form?.ysb_branch_id]);

  const GetResponseTeacher = async () => {
          try {
             const response = await APIUS.get(`/api/teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form?.ysb_branch_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetTeacher(response.data.data)
              }
          } catch (error) {
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
    if (form?.ysb_school_id) {
      GetResponseTeacher()     
    }
  }, [form?.ysb_school_id]);

   const GetResponseKelas = async () => {
          try {
             const response = await APIMS.get(`/api/kelas?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetKelas(response.data.data)
              }
          } catch (error) {
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
    if (form?.ysb_school_id) {
      GetResponseKelas()     
    }
  }, [form?.ysb_school_id]);

  const GetResponseStudent = async () => {
          try {
             const response = await APIUS.get(`/api/students?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
            
              if (response?.status === 200) {
              setGetStudent(response.data.data)
              }
          } catch (error) {
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
    if (form?.ysb_school_id) {
      GetResponseStudent()     
    }
  }, [form?.ysb_school_id]);

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  };


  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
   
      // Insert data for login process
      const response = await APILA.put(`/api/semester-assignments/${props.id}`, {
        ysb_semester_id: form?.ysb_semester_id,
        ysb_branch_id: form?.ysb_branch_id,
        ysb_school_id: form?.ysb_school_id,
        ysb_teacher_id: form?.ysb_teacher_id,
        ysb_student_id: form?.ysb_student_id,
        ysb_kelas_id: form?.ysb_kelas_id,
        user_id: output_id_user,
      }, fetchParams);
  
      // Checking process
      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        })
        props.GetResponseData();
        props.onHide();
        setLoading(false)
      }

    } catch (error) {
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
      setLoading(false)
    }
  });

  return (
    <div className="modal">
      {loading && <LoaderAction/>}
      <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

        <div className="d-flex header-modal">
            <h5>Update Data Murid</h5>
        
            <div className="ml-auto x-close">
                <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
            </div>
          </div>
        <hr/>
      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
          

            <div className="mt-2" >
                <label className="label-form" >Tahun Ajaran </label>
                <select aria-label="Default select example" name="ysb_semester_id"  onChange={handleChange} value={form?.ysb_semester_id}   className="select-form" >
                    <option value="" hidden>Pilih Tahun Ajaran..</option>
                    {getDataTA.map((ta,index) => (
                    <option key={index} value={ta?.id}>{ta?.name_year} - {ta?.semester}</option>
                    ))}         
                </select>
            </div>

            <div className="mt-2" >
              <label className="label-form" >Cabang </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_branch_id" value={form?.ysb_branch_id} className="select-form" >
                <option value="" hidden>Pilih Cabang..</option>
                {getDataCabang.map((cabang,index) => (
                  <option key={index} value={cabang?.branch_code} >{cabang?.branch_name}</option>
                ))}         
              </select>
            </div>

            <div className="mt-2" >
              <label className="label-form" >Sekolah </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_school_id" value={form?.ysb_school_id} className="select-form" >
                  <option value="" hidden>Pilih Sekolah..</option>
                  {getDataSekolah.map((sekolah,index) => (
                    <option key={index} value={sekolah?.school_code} >{sekolah?.school_name}</option>
                  ))}         
              </select>
            </div>

            <div className="mt-2" >
              <label className="label-form" >Guru </label>
                <select aria-label="Default select example"  onChange={handleChange} value={form?.ysb_teacher_id}  name="ysb_teacher_id"  className="select-form" >
                  <option value="" hidden>Pilih Guru..</option>
                  {getDataTeacher.map((teacher,index) => (
                    <option key={index} value={teacher?.id} >{teacher?.full_name}</option>
                  ))}         
                </select>
            </div>

            <div className="mt-2" >
              <label className="label-form" >Siswa </label>
                <select aria-label="Default select example"  onChange={handleChange} value={form?.ysb_student_id}  name="ysb_student_id"  className="select-form" >
                  <option value="" hidden>Pilih Siswa..</option>
                  {getDataStudent.map((student,index) => (
                    <option key={index} value={student?.id} >{student?.nama_lengkap}</option>
                  ))}         
                </select>
            </div>

            <div className="mt-2" >
              <label className="label-form" >Kelas </label>
                <select aria-label="Default select example"  onChange={handleChange} name="ysb_kelas_id" value={form?.ysb_kelas_id} className="select-form" >
                  <option value="" hidden>Pilih Kelas..</option>
                  {getDataKelas.map((kelas,index) => (
                    <option key={index} value={kelas?.id} >{kelas?.number_kelas} - {kelas?.name_kelas}</option>
                  ))}         
                </select>
            </div>

        <div className="d-flex">
          <div className="ml-auto">
            <Button className="mt-4 btn-modal-create" type='submit'>
              Perbarui
            </Button>
          </div>
        </div>
        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  