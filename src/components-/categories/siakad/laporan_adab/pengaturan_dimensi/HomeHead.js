import React from 'react';
import { useEffect, useState, useRef } from "react";
import {Col, Row} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import { APIMS } from "../../../../../config/apims";
import { APIUS } from "../../../../../config/apius";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import ModalApprove from "./modal/approve";
import ModalTutup from "./modal/tutup.";

export default function PengaturanDimensi() {
  document.title = "Pengaturan Dimensi";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(1);
  const [descending, setDescending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

  // modal add
  const [modalApprove, setModalApprove] = useState(false)
  const [modalTutup, setModalTutup] = useState(false)

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'});
  const [loading, setLoading] = useState(false);
  const storageBranchGroping = localStorage.getItem('ysb_branch_id');
  const storageLevel = localStorage.getItem('level');
   
  // Data
  const [storageBranch, setStorageBranch] = useState("");
  const [storageSchool, setStorageSchool] = useState("");
  const [storageTeacher, setStorageTeacher] = useState("");
  const [getDataGuru, setGetDataGuru] = useState([]);
  const [getDataDimensi, setGetDataDimensi] = useState([]);
  const [getDataDimensiDefault, setGetDataDimensiDefault] = useState([]);
  const [getDataSemester, setGetDataSemester] = useState([]);
  const [getDataSemesterMap, setGetDataSemesterMap] = useState([]);
  const [getDataBranch, setGetDataBranch] = useState([]);
  const [getDataSchool, setGetDataSchool] = useState([]);
  const [getDataTeacher, setGetDataTeacher] = useState([]);
  const [selectKey, setSelectKey] = useState(0);
  const [getData, setGetData] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);

  const [namaTA, setNamaTA] = useState([]);
  const [namaSmstr, setNamaSmstr] = useState([]);

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

  useEffect(() => {
    setStorageBranch(localStorage.getItem('ysb_branch_id') || "");
    setStorageSchool(localStorage.getItem('ysb_school_id') || "");
    setStorageTeacher(localStorage.getItem('teacherID') || "");
  }, [])


  const [form, setForm] = useState({
    ysb_semester_id: "",
    ysb_dimensi_id: "",
    ysb_branch_id: "",
    ysb_school_id:"",
    ysb_teacher_id: ""
  });

  const [form2, setForm2] = useState({
    ysb_semester_id: "",
    ysb_dimensi_id: "",
    ysb_branch_id: "",
    ysb_school_id:"",
    ysb_teacher_id: "",
    ysb_sub_element_value:"",
  });

   const [form3, setForm3] = useState({
    ysb_element_recap_id_id:"",
    ysb_sub_element_value:"",
    ysb_sub_element_status:"",
  });

  const handleForm3Change = (e) => {
    const { name, value } = e.target;
    setForm3(prev => ({ ...prev, [name]: value }));
  };

  const saveForm3 = async () => {
    if (!form3?.ysb_element_recap_id_id) return;
    const recapId = form3.ysb_element_recap_id_id;
    const newValue = form3.ysb_sub_element_value;
    // check value inputan sebelumnya
    let previousValue;
    const applyLocalUpdate = (value) => {
      setGetData(prev => {
        try {
          const copy = JSON.parse(JSON.stringify(prev));
          if (!Array.isArray(copy) || copy.length === 0) return prev;
          const dataElements = copy[0]?.data_element || [];
          for (const el of dataElements) {
            if (!el?.rekapan) continue;
            for (const r of el.rekapan) {
              if (!r?.sub_elements) continue;
              for (const s of r.sub_elements) {
                if (s?.ysb_element_recap_id === recapId) {
                  previousValue = s.ysb_sub_element_value;
                  s.ysb_sub_element_value = value;
                }
              }
            }
          }
          return copy;
        } catch (err) {
          return prev;
        }
      });
    };
    applyLocalUpdate(newValue);

    try {
      const response = await APILA.put(`/api/element-recaps-dimensi/${recapId}`, {
        ysb_sub_element_value: newValue,
        user_id: output_id_user
      }, fetchParams);

      if (response?.status === 200) {
        if (typeof GetResponseData2 === 'function') {
          GetResponseData2();
        } else if (typeof GetResponseData === 'function') {
          GetResponseData();
        }
        ToastSuccess.fire({ icon: 'success', title: response.data.message });
        setUpdateID(null);
      }
    } catch (error) {
      applyLocalUpdate(previousValue);
      ToastError.fire({ icon: 'error', title: error?.response?.data?.message || error.message || 'Failed to save' });
    }
  };

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      const [ dataBranch, dataSemester, dataDimensi] = await axios.all([
        APIMS.get(`/api/access/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranchGroping}&level=${storageLevel}`, fetchParams),
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`,fetchParams),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams)
      ]);
      if (dataBranch.status === 200  && dataSemester.status === 200 && dataDimensi.status === 200 ){
        const semesters = dataSemester.data.data.find(s => s.status === 1);
        setGetDataBranch(dataBranch.data.data);
        setGetDataSemester(semesters);
        setGetDataSemesterMap(dataSemester.data.data);
        setGetDataDimensi(dataDimensi.data.data);
        setGetDataDimensiDefault(dataDimensi.data.data[0]);
        setNamaTA(semesters.name_year);
        setNamaSmstr(semesters.semester);
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
  };
  
  useEffect(() => {
    fetchDataRef.current = fetchData;
    fetchDataRef.current();
  }, []);

  // Get data awal ketika render halaman pertama kali
  useEffect(() => {
    const first = getData?.[0]?.data_element?.[0]?.name_element;
    if (first) setSelectedTab(prev => prev || first);
  }, [getData]);

  const handleTabSelect = async (key) => {
    try {
      if (updateId) {
        await saveForm3();
      }
    } catch (err) {
      
    }
    setSelectedTab(key);
  };
  
  const GetResponseDataGuru = async () => {
    try {
      const response = await APIUS.get(`/api/access/teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&branch=${form2?.ysb_branch_id}&ysb_school_id=${form2?.ysb_school_id}&ysb_teacher_id=${form2?.ysb_teacher_id}`,fetchParams)
            
      if (response?.status === 200) {
          setGetDataGuru(response.data.data)
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

  const GetResponseData = async () => {
    try {
      setLoading(true);

      const response = await APILA.get('/api/element-recaps-dimensi/full', {
        params: {
          ysb_semester_id: form?.ysb_semester_id,
          level: storageLevel,
          branch: storageBranch,
          ysb_dimensi_id: form?.ysb_dimensi_id,
          ysb_school_id: form?.ysb_school_id,
          ysb_teacher_id: form?.ysb_teacher_id
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
        setLoading(false);
      }

    } catch (error) {
      setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  const GetResponseData2 = async () => {
    try {
      // setLoading(true);
      const response = await APILA.get('/api/element-recaps-dimensi/full', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: form2?.ysb_school_id,
          ysb_teacher_id: form2?.ysb_teacher_id
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
        // setLoading(false);
      }

    } catch (error) {
      // setLoading(false);
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

  const GetResponseDataSchool = async () => {
      try {
        const response = await APIMS.get(`/api/access/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${form2?.ysb_branch_id}&level=${storageLevel}`,fetchParams)
        // Checking process
        if (response?.status === 200) {
          setGetDataSchool(response.data.data)
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

  const GetResponseDataTeacher = async () => {
      try {
        // e.preventDefault();
        const response = await APIUS.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${form2?.ysb_school_id}`,fetchParams)
  
        // Checking process
        if (response?.status === 200) {
          setGetDataTeacher(response.data.data)
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
    
  const handleChange = (e) => {
    setForm2({
      ...form2,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange2 = (e) => {
    setForm2({
      ...form2,
      ysb_teacher_id: e.value,
    });
  };

  useEffect(() => {
    if (form2?.ysb_school_id) {
      GetResponseDataGuru()     
    }
  }, [form2?.ysb_school_id]);

  useEffect(() => {
    if (storageBranch !== "") {
      setForm2(prevForm => ({
        ...prevForm,
        ysb_branch_id: storageBranch
      }));      
    }
  }, [storageBranch]);

  useEffect(() => {
    if(getDataSemester !== null){
      setForm({
        ...form, 
        ysb_semester_id: getDataSemester?.id
      });
    }
  }, [getDataSemester]);

  useEffect(() => {
    if( getDataSemester !== null){
      setForm2({
        ...form2, 
        ysb_semester_id: getDataSemester?.id
      });
    }
  }, [getDataSemester]);

  useEffect(() => {
    if(getDataDimensiDefault !== null){
      setForm({
        ...form, 
        ysb_dimensi_id: getDataDimensiDefault?.id
      });
    }
  }, [getDataDimensiDefault]);

  useEffect(() => {
    if( getDataDimensiDefault !== null){
      setForm2({
        ...form2, 
        ysb_dimensi_id: getDataDimensiDefault?.id
      });
    }
  }, [getDataDimensiDefault]);

  useEffect(() => {
    if (form.ysb_semester_id && form.ysb_semester_id !== "" && 
      form.ysb_dimensi_id && form.ysb_dimensi_id !== "") {
      GetResponseData();
    }
  }, [form.ysb_semester_id, form.ysb_dimensi_id ]); 

  useEffect(() => {
    if (form2?.ysb_branch_id) {
      GetResponseDataSchool()     
    }
  }, [form2?.ysb_branch_id]);

  useEffect(() => {
    if (form2?.ysb_school_id) {
      GetResponseDataTeacher()     
    }
  }, [form2?.ysb_school_id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // UPDATE NILAI
  const [updateId, setUpdateID] = useState(-1);
  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  const [value, setValue] = useState(0);
  const handleCheckbox = (e) => {
    const checked = e.target.checked;
    setValue(checked ? 1 : 0);
    console.log("status", checked)
  };


  const getData2 = [
        {
            "id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
            "name_dimensi": "Adab Kepada Allah SWT",
            "slug_name": "adab_kepada_allah_swt",
            "created_at": "2025-10-21T09:15:41.000000Z",
            "data_element": [
                {
                    "id": "499cb1e4-984a-456e-85b3-91cc21e02a01",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.1",
                    "description": "Beriman (Shalat)",
                    "created_at": "2025-11-19T03:00:01.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "6e66615b-297a-4316-9d48-9682076ec114",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_tingkatan": "SD 1 (Merdeka)",
                            "ysb_element_id": "499cb1e4-984a-456e-85b3-91cc21e02a01",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": 3.666666666666666518636930049979127943515777587890625,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "fdf752bc-0b74-414a-81a7-59237cbb1674",
                                    "ysb_sub_element_id": "285790da-9a31-464c-91b4-feedb0c94b9c",
                                    "ysb_sub_element_name": "Membenarkan keberadaanNya, penciptaanNya",
                                    "ysb_sub_element_value": 4,
                                    "ysb_sub_element_status": 1,
                                    "created_at": "2025-11-18T09:28:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e66615b-297a-4316-9d48-9682076ec114",
                                    "ysb_sub_element_id": "9ca96421-c565-43b0-8117-0fc1213ceb22",
                                    "ysb_sub_element_name": "Diwujudkan dengan keyakinan dalam hati, diucapkan dengan lisan dan dibuktikan dengan perbuatan.",
                                    "ysb_sub_element_value": 3,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:47:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c032c09b-25ac-4ac8-92af-88032f9c5971",
                                    "ysb_sub_element_id": "27253925-98f6-4116-a653-9667b2935da1",
                                    "ysb_sub_element_name": "Indikator keimanan adanya keteguhan keyakinan dalam hati seseorang bahwa Allah Swt telah memerintahkan untuk beribadah kepadaNya melalui Ikhlas dalam berbuat, senantiasa berdzikir dan beramal sholeh.",
                                    "ysb_sub_element_value": 4,
                                    "ysb_sub_element_status": 1,
                                    "created_at": "2025-11-20T01:47:34.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "86596c6b-98aa-4466-815c-4dcdec740e2a",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.2",
                    "description": "Bersyukur",
                    "created_at": "2025-11-19T03:00:02.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "1358db17-264f-4256-bac7-9d627f3c437d",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                           "name_tingkatan": "SD 1 (Merdeka)",
                            "ysb_element_id": "86596c6b-98aa-4466-815c-4dcdec740e2a",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "6e888750-3511-4fb3-8a13-257596db70eb",
                                    "ysb_sub_element_id": "a20f2fd9-ae61-4413-be6b-554e64b48ac6",
                                    "ysb_sub_element_name": "Merendahkan diri di hadapan yang dia syukuri.",
                                    "ysb_sub_element_value": null,
                                    "ysb_sub_element_status": 1,
                                    "created_at": "2025-11-20T01:47:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fbd3b646-35f0-47a7-bf70-d589e02072fb",
                                    "ysb_sub_element_id": "44f2b78b-442e-4dbb-adc4-a83aab63cef2",
                                    "ysb_sub_element_name": "Kecintaan terhadap Sang Pemberi nikmat.",
                                    "ysb_sub_element_value": null,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:48:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8f2e120d-a7a6-4c39-b557-f17125241b0b",
                                    "ysb_sub_element_id": "cb805196-da17-4fed-8029-d53b1943f11e",
                                    "ysb_sub_element_name": "Mengakui seluruh kenikmatan yang Dia berikan",
                                    "ysb_sub_element_value": null,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:48:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c846c3f9-4594-473c-b969-c2af880513c7",
                                    "ysb_sub_element_id": "e5ed1bda-1224-4feb-912e-8a786db29d7e",
                                    "ysb_sub_element_name": "Senantiasa memuji-Nya atas segala nikmat",
                                    "ysb_sub_element_value": null,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:48:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1358db17-264f-4256-bac7-9d627f3c437d",
                                    "ysb_sub_element_id": "5c956935-2cd9-413b-a38e-485ff04f9ecc",
                                    "ysb_sub_element_name": "Tidak menggunakan nikmat tersebut untuk sesuatu yang dibenci oleh Allah Swt.",
                                    "ysb_sub_element_status": 0,
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:48:34.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "a3dcb294-5df7-47b2-96fa-8910c801774e",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.3",
                    "description": "Mengingat (Dzikir) ",
                    "created_at": "2025-11-19T03:00:03.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "029715b0-5d27-431c-a507-1310c18eb2cf",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_tingkatan": "SD 1 (Merdeka)",
                            "ysb_element_id": "a3dcb294-5df7-47b2-96fa-8910c801774e",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": 4,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "029715b0-5d27-431c-a507-1310c18eb2cf",
                                    "ysb_sub_element_id": "b27bece0-b7aa-4e17-9c88-c4c5c139327a",
                                    "ysb_sub_element_name": "Dzikir dengan hati,",
                                    "ysb_sub_element_value": 4,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:48:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6a6fcf8c-20fb-42c8-8bbb-a80b25fc777f",
                                    "ysb_sub_element_id": "f1083c7c-eb48-4ea0-a8bf-4e6db8c9c5d4",
                                    "ysb_sub_element_name": "Dzikir dengan lisan (ucapan mengucapkan tasbih, tahmid, takbir, tahlil, sholawat, membaca Al Quran dan sebagainya.",
                                    "ysb_sub_element_value": 4,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:49:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "12820e68-76d6-4f9c-835f-49a1874c8ab9",
                                    "ysb_sub_element_id": "dba9f511-5ca7-4f93-bd61-0eb17ad6960b",
                                    "ysb_sub_element_name": "Dzikir dengan perbuatan, Berdzikir pagi dan petang, Tadarus dan Tahfiz Al Quran, Sapa dan Salam, melaksanakan shalat, berinfaq dll",
                                    "ysb_sub_element_value": null,
                                    "ysb_sub_element_status": 0,
                                    "created_at": "2025-11-20T01:49:13.000000Z"
                                }
                            ]
                        }
                    ]
                }
                
            ]
        }
    ]
  

    const [values, setValues] = useState({});

    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
      setModalApprove(true)
       setIsOpen(isOpen);
    };

    const handleClickTtutup = () => {
      setModalTutup(true)
       setIsOpen(!isOpen);
    };

    

  return (
    <div className="body" >
      {modalApprove  && <ModalApprove show={modalApprove} onHide={() => [setModalApprove(false), setIsOpen(!isOpen)]}  />}

      {modalTutup  && <ModalTutup show={modalTutup} onHide={() => [setModalTutup(false), setIsOpen(isOpen)]}  />}

      {/* <div className="body-content-menu">
        <div className="breadcrumb-header " style={{fontSize:"14px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item" > <Link to="/element-recaps-dimensi"> Penilaian Guru </Link> </li>
              <li className="breadcrumb-item" > <Link to="/element-recaps-dimensi-head-super"> Penilaian Kepala Sekolah </Link>  </li>
            </ol>
          </nav>
        </div>
      </div> */}

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faGear}/> Konfigurasi Nilai</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faGear}/> Konfigurasi Nilai </h5>
            </div>
          </>
        }   
      </div> 

      <div className="body-content-menu">
          <div className="breadcrumb-header " style={{fontSize:"13px" }}>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"> <Link style={{textDecoration:"none"}} to="">Beranda</Link>  </li>
                <li className="breadcrumb-item" > <Link style={{textDecoration:"none"}} to="/element-recaps-dimensi"> <span className='ml-2'> Penilaian </span> </Link> </li>
                <li className="breadcrumb-item iniaktif" > <span className='ml-2'> Konfigurasi Nilai </span> </li>
              </ol>
              </nav>
          </div>
        </div>

     
      
        <div className="body-content">

            <div className='d-flex mb-4'>
                <div>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0"}}> <Link style={{textDecoration: "none", color: "#327dffff"}} to="/config-dimensi"> Konfigurasi Nilai Guru</Link> </button>
                </div>
                <div className='ml-2'>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#076db5ff", color: "#fff"}}> Konfigurasi Nilai Kepala Sekolah </button>
                </div>
                <div className='ml-2'>
                    <button  className=" btn " style={{fontSize: '15px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0"}}> <Link style={{textDecoration: "none", color: "#327dffff"}} to="/config-list-dimensi"> Konfigurasi Dimensi</Link> </button>
                </div>
            </div>
            <hr style={{borderBottom: "1px solid #327dffff", marginTop: "-22px"}}/>
        

        {/* FILTER */}
        {isTabletOrMobile ? 
          <>
          <div className="title-page">
              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))}  
                </select>
              </Row>
          
              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_dimensi_id" value={form2?.ysb_dimensi_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>Pilih Dimensi</option>
                  {getDataDimensi.map((user,index) => (
                    <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
                  ))} 
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_branch_id" value={form2?.ysb_branch_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>Pilih Cabang</option>
                  {getDataBranch.map((user,index) => (
                    <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                  ))}
                </select>
              </Row>

              <Row style={{marginTop: "10px", padding:"0 12px"}}>
                <select className="mr-2" aria-label="Default select example" name="ysb_school_id" value={form2?.ysb_school_id}  onChange={handleChange}  style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                          
                <option value="" hidden>Pilih Sekolah</option>
                    {getDataSchool.map((user,index) => (
                      <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                    ))} 
                </select>
              </Row>

                                      
              <Row style={{marginTop: "12px", padding:"0 12px"}}>
                <button onClick={GetResponseData2} className=" btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
              </Row>
            </div>
          </>
          :
          <>
            <div className="mb-3 mt-4">
              <div className="d-flex">
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))}  

                  {/* <option value="" hidden>Semester ..</option>
                    {getDataSemesterMap.map((user,index) => (
                        <option value={user?.id} style={{textAlign:""}}>{user?.name_year} - {user?.semester}</option>
                  ))}     */}
                </select>

                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_branch_id}  name="ysb_branch_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Cabang</option>
                  {getDataBranch.map((user,index) => (
                    <option value={user?.branch_code} style={{textAlign:""}}>{user?.branch_name}</option>
                  ))}      
                </select>

                {/* <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_school_id}  name="ysb_school_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                    <option value="" hidden>Pilih Sekolah</option>
                    {getDataSchool.map((user,index) => (
                      <option value={user?.school_code} style={{textAlign:""}}>{user?.school_name}</option>
                    ))}     
                </select> */}

                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_school_id}  name="ysb_school_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Sekolah</option>
                  {getDataSchool
                  .filter((user) => user.school_code !== "BASEMENT_BEKASI")  
                  .map((user, index) => (
                    <option key={index} value={user?.school_code}>
                      {user?.school_name}
                    </option>
                  ))
                }
                </select>

                
              </div>
              <div className='mt-3 d-flex'>
                <select className="mr-2" aria-label="Default select example" onChange={handleChange} value={form2?.ysb_dimensi_id}  name="ysb_dimensi_id" style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>Pilih Dimensi</option>
                  {getDataDimensi.map((user,index) => (
                    <option value={user?.id} style={{textAlign:""}}>{user?.name_dimensi}</option>
                  ))}      
                </select>

                <button onClick={GetResponseData2} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>

              </div>
            </div>
          </>
        }

        {loading && <LoaderHome />}
        {/* <div>
          
            <div className="text-center" style={{ marginTop: "10px", padding: "5px 0px", borderTop: "1px solid #000", borderBottom: "1px solid #000" }}>

              {isOpen ? 
              <>
                <button onClick={handleClickTtutup} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#808080ff", color: "#fff"}}> 
                 Kunci Penilaian Kepsek"
                </button>
              </> 
              : 
              <>
               <button onClick={handleClick} className="btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"3px", backgroundColor:"#2c44fbff", color: "#fff"}}> 
                  Buka Penilaian Kepsek"
                </button>
              </>}
            </div>

          
        </div> */}
        

        <Tabs id="uncontrolled-tab-example" activeKey={selectedTab} onSelect={handleTabSelect} className="mb-3 mt-4 nav-tabs"> 
          
        {(getData2?.[0]?.data_element || [] ).map((element, eIdx) => (
          <Tab key={element?.id || eIdx} eventKey={element?.name_element} title={element?.name_element} className="nav-item">
            <div className="text-center" style={{ marginTop: "10px", marginBottom: "20px", backgroundColor: "#9fd5ffff", padding: "5px 0px" }}>
              <h5 className="mt-2 mb-2">{element?.description}</h5>
            </div>

            {/* TABLE */}
            <Col xl='12' sm='12'>
              <div className="mt-3">
                <div className="body-table">
                  <div className="test-table test-check">
                    <table className="table   table-bordered " id="basic-datatable">
                      <thead>
                        <tr>
                          <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}}>Sekolah</th>
                        
                          {/* rekapan pertama ditampilkan */}
                          {element?.rekapan?.[0]?.sub_elements?.map((sub, idx) => (
                            <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} key={sub?.ysb_sub_element_id || idx}>{sub?.ysb_sub_element_name || sub?.description}</th>
                          ))}
                         
                        </tr>
                      </thead>

                      <tbody>
                        {/* <tr style={{ textAlign: "center" }}>
                            <td>SD 1 (Merdeka)</td> */}

                          {element?.rekapan?.map((rekap) => (
                          <tr className='text-center' key={rekap?.ysb_element_recap_id}>
                            <td style={{ lineHeight: "2" }}>SMP ISLAM AL AZHAR 41</td>
                           
                           
                            {rekap?.sub_elements?.map((sub, i) => {
                              const subRecapIdVal = sub?.ysb_element_recap_id;
                              const subValueLocal = sub?.ysb_sub_element_status;
                              const isEditingLocal = updateId === subRecapIdVal;

                              const handleClickCell = () => {
                                setUpdateID(subRecapIdVal);
                                setForm3({ ysb_element_recap_id_id: subRecapIdVal, ysb_sub_element_status: subValueLocal == null ? "" : subValueLocal });
                              };

                              return (
                                <td key={subRecapIdVal || i} style={{ lineHeight: "2", fontSize: "22px", paddingLeft: "50px" }} className="text-center">

                                  {isEditingLocal ? (
                                    <div className="d-flex justify-content-center align-items-center">
                                      <div className="form-check form-switch m-0 p-0">
                                        <input
                                          className="form-check-input"
                                          type="checkbox"
                                          id={`switch-${subRecapIdVal}`}
                                          value={subValueLocal}
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      {sub?.ysb_sub_element_status === 1 ? (
                                        <div className="d-flex justify-content-center align-items-center">
                                          <div className="form-check form-switch m-0 p-0">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`switch-${subRecapIdVal}`}
                                              checked={values[subRecapIdVal] === 1}
                                              onChange={(e) =>
                                                setValues(prev => ({
                                                  ...prev,
                                                  [subRecapIdVal]: e.target.checked ? 1 : 0
                                                }))
                                              }
                                            />
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="d-flex justify-content-center align-items-center">
                                          <div className="form-check form-switch m-0 p-0">
                                            <input
                                              className="form-check-input"
                                              type="checkbox"
                                              id={`switch-${subRecapIdVal}`}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </td>


                              );
                            })}
                           
                          </tr>
                        ))}

                        {/* {element?.rekapan?.map((rekap) => (
                          <tr key={rekap?.ysb_element_recap_id}>
                            <td style={{ lineHeight: "2" }}>{rekap?.name_student}</td>
                            <td style={{ lineHeight: "2", textAlign: "center" }}>{rekap?.nisn}</td>
                           
                            {rekap?.sub_elements?.map((sub, i) => {
                              const subRecapIdVal = sub?.ysb_element_recap_id;
                              const subValueLocal = sub?.ysb_sub_element_value;
                              const isEditingLocal = updateId === subRecapIdVal;

                              const handleClickCell = () => {
                                setUpdateID(subRecapIdVal);
                                setForm3({ ysb_element_recap_id_id: subRecapIdVal, ysb_sub_element_value: subValueLocal == null ? "" : subValueLocal });
                              };

                              return (
                                <td key={subRecapIdVal || i} style={{ lineHeight: "2" }} className="text-center">
                                  {isEditingLocal ? (
                                    <input
                                      name="ysb_sub_element_value"
                                      value={form3?.ysb_sub_element_value ?? ""}
                                      onChange={handleForm3Change}
                                      onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          await saveForm3();
                                        }
                                      }}
                                      onBlur={async () => {
                                        await saveForm3();
                                      }}
                                      type="text"
                                      className="text-center"
                                      style={{ border: "none" }}
                                    />
                                  ) : (
                                    <input type="text" onClick={handleClickCell} value={subValueLocal == null ? "" : subValueLocal} className="text-center" style={{ border: "none" }} readOnly />
                                  )}
                                </td>
                              );
                            })}
                            <td style={{ lineHeight: "2" }} className="text-center fw-bold">{rekap?.average}</td>
                          </tr>
                        ))} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
          </Tab>
        ))}

      </Tabs>
    </div>
  </div>
  );
}
