import { useState, useEffect} from "react";
import { Form, Button } from 'reactstrap';
import { APILA } from "../../../config/apila";
import { APIMS } from "../../../config/apims";
import { APIUS } from "../../../config/apius";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderHome";
import "../../../index.css";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import AsyncSelect from "react-select/async";

export default function ModalAddMurid(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");

  // Data
  const [getDataCabang, setGetDataCabang] = useState([]);
  const [getDataTA, setGetDataTA] = useState([]);
  const [getDataSekolah, setGetSekolah] = useState([]);
  const [getDataTeacher, setGetTeacher] = useState([]);
  const [getDataStudent, setGetStudent] = useState([]);
  const [getDataKelas, setGetKelas] = useState([]);

  const [getNamaStudent, setNamaStudent] = useState([]);

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  // const [selectedOptions, setSelectedOptions] = useState([]);
  // const handleChange1 = (selectedOption) => {
  //   setSelectedOptions (selectedOption);
  // };

  const [selectedOption, setSelectedOption] = useState(null);

  const [inputValue, setValue] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [xx, setXX] = useState(null);

  const handleInputChange = value => {
    setValue(value);
  }

  const handleChange2 = value => {
    setSelectedValue(value);
  }

  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  const [form, setForm] = useState({
    ysb_semester_id:"",
    ysb_branch_id : "",
    ysb_school_id:"",
    ysb_teacher_id: "",
    ysb_student_id: "",
    ysb_kelas_id:"",
    user_id:"",    
  });

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

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
      const response = await APIMS.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}`,fetchParams)
      setGetSekolah(response.data.data);
  } 

  
  useEffect(() => {
    if (form?.ysb_branch_id) {
      GetResponseSekolah()     
    }
  }, [form?.ysb_branch_id]);

  const GetResponseTeacher = async () => {
      const response = await APIUS.get(`/api/teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form?.ysb_branch_id}&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
      setGetTeacher(response.data.data);
  } 
  
  useEffect(() => {
    if (form?.ysb_school_id) {
      GetResponseTeacher()     
    }
  }, [form?.ysb_school_id]);

  const GetResponseKelas = async () => {
      const response = await APIMS.get(`/api/kelas?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
      setGetKelas(response.data.data);
  } 

  useEffect(() => {
    if (form?.ysb_school_id) {
      GetResponseKelas()     
    }
  }, [form?.ysb_school_id]);

  const GetResponseStudent = async () => {
      const response = await APIUS.get(`/api/students?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
      setGetStudent(response.data.data);
      const ab = response.data.data
      let nameSiswa = ab.filter(o => o.nama_lengkap);
      setNamaStudent(nameSiswa)
      // console.log(nameSiswa)
  } 

  const fetchStudent = async () => {
      const response = await APIUS.get(`/api/students?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams)
      setXX(response.data.data);
     
  } 

    useEffect(() => {
      fetchStudent();
    }, [])

  const [selectKey, setSelectKey] = useState(0);


  const handleInputChange2 = (e) => {
    setForm({
      ...form,
      ysb_student_id: e.value,
    });
  };

  // const fetchStudent = () => {
  //   return APIUS.get(`/api/students?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form?.ysb_school_id}`,fetchParams).then(result => {
  //     const res = result.data.data;
  //     return res
      
  //   })
    
  //   ;

  // }



  
  
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
      const response = await APILA.post("/api/semester-assignments/store", {
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
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 10000,
        buttons: false
      });
      setLoading(false);
      props.onHide();
    }
  });

  return (
  <div className="modal">
    {loading && <LoaderAction/>}
    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" >  

      <div className="d-flex header-modal">
        <h5>Tambah Murid</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >

       

         <div className="mt-2" >
            <label className="label-form" >Tahun Ajaran </label>
              <select aria-label="Default select example" name="ysb_semester_id"  onChange={handleChange}  className="select-form" >
                <option value="" hidden>Pilih Tahun Ajaran..</option>
                {getDataTA.map((ta,index) => (
                  <option key={index} value={ta?.id}>{ta?.name_year} (Semester {ta?.semester}) </option>
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
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_teacher_id"  className="select-form" >
                <option value="" hidden>Pilih Guru..</option>
                {getDataTeacher.map((teacher,index) => (
                  <option key={index} value={teacher?.id} >{teacher?.full_name}</option>
                ))}         
              </select>
          </div>

          {/* <div>
            <Select 
            key={selectKey} 
            name="ysb_student_id" 
            onChange={handleInputChange2}
            options={getDataStudent.map(user => ({
                      value: user.id,
                      label: `${user.nama_lengkap}`,
                    }))}
            placeholder="Pilih Murid"
             />
          </div> */}



           {/* <Select
          options={getNamaStudent}
          value={selectedOptions}
          onChange={handleChange1}
          isMulti={true}
          /> */}

          {/* <Select
            defaultValue={selectedOption}
            onChange={setSelectedOption}
            options={options}
            isMulti={true}
          /> */}

          {/* <AsyncSelect
          cacheOptions
          defaultOptions
          value={selectedValue}
          getOptionLabel={e => e.nama_lengkap}
          getOptionValue={e => e.id}
          loadOptions={fetchStudent}
          onInputChange={handleInputChange}
          onChange={handleChange2}
          /> */}

          <div className="mt-2" >
            <label className="label-form" >Siswa </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_student_id"  className="select-form" >
                <option value="" hidden>Pilih Siswa..</option>
                {getDataStudent.map((student,index) => (
                  <option key={index} value={student?.id} >{student?.nama_lengkap}</option>
                ))}         
              </select>
          </div>

          <div className="mt-2" >
            <label className="label-form" >Kelas </label>
              <select aria-label="Default select example"  onChange={handleChange}  name="ysb_kelas_id" className="select-form" >
                <option value="" hidden>Pilih Kelas..</option>
                {getDataKelas.map((kelas,index) => (
                  <option key={index} value={kelas?.id} >{kelas?.number_kelas} - {kelas?.name_kelas}</option>
                ))}         
              </select>
          </div>

        <div className="d-flex">
          <div className="ml-auto">
            <Button className="mt-4 btn-modal-create" type='submit'>
              Tambahkan
            </Button>
          </div>
        </div>
        </Form>
        
      </Modal.Body>
    </Modal>
    </div> 
  );
}
  