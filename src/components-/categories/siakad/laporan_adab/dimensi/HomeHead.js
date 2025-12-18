import React from 'react';
import { useEffect, useState, useRef } from "react";
import {Col, Row} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import { APIMS } from "../../../../../config/apims";
import { APIUS } from "../../../../../config/apius";
import ReactPaginate from "react-paginate";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { Autosave, useAutosave } from 'react-autosave';
import ToastError from "../../../../NotificationToast/ToastError";
import ToastSuccess from "../../../../NotificationToast/ToastSuccess";
import Select from 'react-select';

export default function Dimensi() {
  document.title = "Dimensi";
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(1);
  const [descending, setDescending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const token = localStorage.getItem("token");

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
  const storageSchoolId = localStorage.getItem('ysb_school_id');


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
  });

//   const handleForm3Change = (e) => {
//     const { name, value } = e.target;
//     setForm3(prev => ({ ...prev, [name]: value }));
//   };

  const handleForm3Change = (e) => {
  const { name, value } = e.target;
    
    // cuma bisa angka 1-4
    if (value === '' || (Number(value) >= 1 && Number(value) <= 4 && !isNaN(value))) {
      setForm3(prev => ({ ...prev, [name]: value }));
    }
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
      const response = await APILA.put(`/api/element-recaps-dimensi-head/${recapId}`, {
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
      const [ dataSemester, dataDimensi, dataTeacher] = await axios.all([
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`,fetchParams),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams),
        APIUS.get(`/api/teachers/all?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&ascending_name=true&ysb_school_id=${storageBranchGroping}&level=${storageLevel}&ysb_school_id=${storageSchoolId}`,fetchParams)
      ]);
      if (dataSemester.status === 200  && dataDimensi.status === 200 && dataTeacher.status === 200 ){
        const semesters = dataSemester.data.data.find(s => s.status === 1);
        setGetDataSemester(semesters);
        setGetDataSemesterMap(dataSemester.data.data);
        setGetDataDimensi(dataDimensi.data.data);
        setGetDataDimensiDefault(dataDimensi.data.data[0]);
        setGetDataTeacher(dataTeacher.data.data);
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

  const GetResponseData = async () => {
    try {
      setLoading(true);

      const response = await APILA.get('/api/element-recaps-dimensi-head/full', {
        params: {
          ysb_semester_id: form?.ysb_semester_id,
          level: storageLevel,
          branch: storageBranch,
          ysb_dimensi_id: form?.ysb_dimensi_id,
          ysb_school_id: storageSchoolId,
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
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
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
                                    "created_at": "2025-11-18T09:28:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e66615b-297a-4316-9d48-9682076ec114",
                                    "ysb_sub_element_id": "9ca96421-c565-43b0-8117-0fc1213ceb22",
                                    "ysb_sub_element_name": "Diwujudkan dengan keyakinan dalam hati, diucapkan dengan lisan dan dibuktikan dengan perbuatan.",
                                    "ysb_sub_element_value": 3,
                                    "created_at": "2025-11-20T01:47:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c032c09b-25ac-4ac8-92af-88032f9c5971",
                                    "ysb_sub_element_id": "27253925-98f6-4116-a653-9667b2935da1",
                                    "ysb_sub_element_name": "Indikator keimanan adanya keteguhan keyakinan dalam hati seseorang bahwa Allah Swt telah memerintahkan untuk beribadah kepadaNya melalui Ikhlas dalam berbuat, senantiasa berdzikir dan beramal sholeh.",
                                    "ysb_sub_element_value": 4,
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
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
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
                                    "created_at": "2025-11-20T01:47:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fbd3b646-35f0-47a7-bf70-d589e02072fb",
                                    "ysb_sub_element_id": "44f2b78b-442e-4dbb-adc4-a83aab63cef2",
                                    "ysb_sub_element_name": "Kecintaan terhadap Sang Pemberi nikmat.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:48:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8f2e120d-a7a6-4c39-b557-f17125241b0b",
                                    "ysb_sub_element_id": "cb805196-da17-4fed-8029-d53b1943f11e",
                                    "ysb_sub_element_name": "Mengakui seluruh kenikmatan yang Dia berikan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:48:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c846c3f9-4594-473c-b969-c2af880513c7",
                                    "ysb_sub_element_id": "e5ed1bda-1224-4feb-912e-8a786db29d7e",
                                    "ysb_sub_element_name": "Senantiasa memuji-Nya atas segala nikmat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:48:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1358db17-264f-4256-bac7-9d627f3c437d",
                                    "ysb_sub_element_id": "5c956935-2cd9-413b-a38e-485ff04f9ecc",
                                    "ysb_sub_element_name": "Tidak menggunakan nikmat tersebut untuk sesuatu yang dibenci oleh Allah Swt.",
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
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
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
                                    "created_at": "2025-11-20T01:48:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6a6fcf8c-20fb-42c8-8bbb-a80b25fc777f",
                                    "ysb_sub_element_id": "f1083c7c-eb48-4ea0-a8bf-4e6db8c9c5d4",
                                    "ysb_sub_element_name": "Dzikir dengan lisan (ucapan mengucapkan tasbih, tahmid, takbir, tahlil, sholawat, membaca Al Quran dan sebagainya.",
                                    "ysb_sub_element_value": 4,
                                    "created_at": "2025-11-20T01:49:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "12820e68-76d6-4f9c-835f-49a1874c8ab9",
                                    "ysb_sub_element_id": "dba9f511-5ca7-4f93-bd61-0eb17ad6960b",
                                    "ysb_sub_element_name": "Dzikir dengan perbuatan, Berdzikir pagi dan petang, Tadarus dan Tahfiz Al Quran, Sapa dan Salam, melaksanakan shalat, berinfaq dll",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:13.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "dd2aaa54-2538-4151-ac6d-dcc73950faba",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.4",
                    "description": "Taat",
                    "created_at": "2025-11-19T03:00:04.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "17e45eed-3c1a-446e-82ea-0b23e9b58e19",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "dd2aaa54-2538-4151-ac6d-dcc73950faba",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "c7b53239-d5de-42e1-a94d-69875e6828da",
                                    "ysb_sub_element_id": "8e505899-01a2-4c93-a1ba-833be23173b4",
                                    "ysb_sub_element_name": "Taat bermakna patuh; shalat, puasa, dan menunaikan zakat. Menjauhi larangannya, contohnya tidak saling mencela, tidak meninggalkan shalat, tidak berpuasa, tidak meminum minuman yang diharamkan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:33.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e1fbd035-f3a5-4226-b6c3-ce485802d72e",
                                    "ysb_sub_element_id": "584d2a71-d4c7-400f-b8cc-4f51128ca185",
                                    "ysb_sub_element_name": "Taat bermakna penurut adalah menuruti semua aturan yang bersumber dari ajaran Islam",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:41.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a2f56b27-bd24-4e34-b094-164b38d288c2",
                                    "ysb_sub_element_id": "db285e42-45da-485e-8d33-30e4698b77f4",
                                    "ysb_sub_element_name": "Taat bermakna tunduk adalah tunduk terhadap qada dan qadar",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f09e12e9-33e7-467e-ab68-97946bf0bb12",
                                    "ysb_sub_element_id": "bc3ec308-cbe4-460a-93e8-82bec10bf59e",
                                    "ysb_sub_element_name": "shalat fardu lima waktu dengan ikhlas dalam hati;",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:58.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b4d54b50-20a2-4fb4-b735-606d0eab7488",
                                    "ysb_sub_element_id": "b93d3b17-da82-45a8-8e9b-6f81a982cad2",
                                    "ysb_sub_element_name": "menunaikan zakat atau sebagian hartanya di jalan Allah SWT",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:50:13.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "614afd40-9046-4ff1-8764-f13c86121961",
                                    "ysb_sub_element_id": "1910d32d-3182-470f-be4c-47b297bb91a5",
                                    "ysb_sub_element_name": "berpuasa di bulan Ramadan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:50:23.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "17e45eed-3c1a-446e-82ea-0b23e9b58e19",
                                    "ysb_sub_element_id": "7f4ef54f-d0f7-4a5f-8ec8-1686df00c5af",
                                    "ysb_sub_element_name": "melaksanakan ibadah haji bagi yang mampu melaksanakannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:50:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e0fa7328-df26-4d74-ade3-2ab9f3a9714e",
                                    "ysb_sub_element_id": "ad89c507-2b54-48a2-a8a2-bd650b5b87e9",
                                    "ysb_sub_element_name": "berbuat baik dan berbakti kepada kedua orang tua",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:50:46.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9c579eeb-2d4f-468d-8341-d92164acd448",
                                    "ysb_sub_element_id": "4fc6f0e8-4c03-436a-888e-552b4e3a4560",
                                    "ysb_sub_element_name": "menjaga sopan santun ketika berbicara",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:50:55.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "71b2798b-1833-441e-87bc-cb028a2de8ca",
                                    "ysb_sub_element_id": "2443f88a-dd9a-4de0-a281-6667ac118d65",
                                    "ysb_sub_element_name": "jujur memegang amanah yang diberikan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1b372ddb-7db6-4eab-9cfd-ef7ffd542779",
                                    "ysb_sub_element_id": "8e47ccf5-a9ce-4d58-a2e2-4fbd7f8b1575",
                                    "ysb_sub_element_name": "sabar ketika tertimpa musibah, dan bersyukur ketika mendapat rezeki",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:13.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8fa238e5-e9db-444c-adac-9d3d935d3ce3",
                                    "ysb_sub_element_id": "eea85c8e-6a91-4cb7-9372-c531efc2aa79",
                                    "ysb_sub_element_name": "selalu berkalimah thayyibah, tidak berkata-kata kotor",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fa5d4c4a-6081-4cff-b884-a9c2c983ee80",
                                    "ysb_sub_element_id": "8b5cbb5d-f972-48b9-8401-4b759f1aff68",
                                    "ysb_sub_element_name": "selalu berbuat dan beramal saleh",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:33.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f9dae2fc-a457-441e-94fe-ecc0a83f95c7",
                                    "ysb_sub_element_id": "a502e15a-31b6-4a2c-9d03-875d612caf06",
                                    "ysb_sub_element_name": "saling menasihati dengan haq dan kesabaran.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:44.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "07d4bb17-5831-4cc6-b2c7-1f17a846fb57",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.5",
                    "description": "Tak mendahului Allah SWT & Rasul-Nya",
                    "created_at": "2025-11-19T03:00:05.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "30035fa9-538b-41ec-a5c6-e748f158fada",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "07d4bb17-5831-4cc6-b2c7-1f17a846fb57",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "30035fa9-538b-41ec-a5c6-e748f158fada",
                                    "ysb_sub_element_id": "744b7cdf-42f2-4835-aa31-d681d974b5f8",
                                    "ysb_sub_element_name": "Tidak berucap dan bertindak, sebelum Rasulullah SAW. menyuruh atau melarangnya untuk melakukannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "cc3a84bd-d378-4a24-80b6-e0f9a994faec",
                                    "ysb_sub_element_id": "3743743d-996d-4cfa-bd0c-5f492d77830d",
                                    "ysb_sub_element_name": "Janganlah menentang Allah SWT dan Rasul-Nya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "33d165fe-74f9-4fcd-bb65-184b3ae52e44",
                                    "ysb_sub_element_id": "c84eb843-75cf-4bb0-81b5-4e822d87e94f",
                                    "ysb_sub_element_name": "Janganlah menyalahi Kitab Allah SWT dan sunnah Rasulullah SAW.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:24.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "cb8ce279-bec9-4a57-b79f-7c6e39572478",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.6",
                    "description": "Takut",
                    "created_at": "2025-11-19T03:00:06.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "41547b17-a4e9-404d-ab6a-0e4a42e0268f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "cb8ce279-bec9-4a57-b79f-7c6e39572478",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "798bfea4-f1e3-470b-9615-1beb9b71632e",
                                    "ysb_sub_element_id": "5b386a21-4a46-433f-bd3a-fd286921eb6d",
                                    "ysb_sub_element_name": "Membimbing",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "41547b17-a4e9-404d-ab6a-0e4a42e0268f",
                                    "ysb_sub_element_id": "9a19994c-b04d-4e7a-9da1-aaee3e3dd12d",
                                    "ysb_sub_element_name": "Mengantarkannya meraih ridha dan ganjaran Allah SWT dan bersemangat untuk melakukan amalan besar.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7b6d9fc1-9419-4158-bb85-1c1ffee555dd",
                                    "ysb_sub_element_id": "6abc14fb-4dcd-4a0d-910a-871caca7cdd1",
                                    "ysb_sub_element_name": "Rasa cemas, gundah, dan khawatir terkena adzab Allah SWT akibat melakukan perbuatan haram atau meninggalkan kewajiban",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:57.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "66964b36-5943-461d-ac43-85a25fd8fff2",
                                    "ysb_sub_element_id": "430bd91a-0789-4a2a-90f1-a4a454c763e2",
                                    "ysb_sub_element_name": "Khawatir jika Allah SWT tidak menerima amalan shalihnya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:53:06.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "38862ce0-0ce1-400a-85a2-1392b6143533",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.7",
                    "description": "Malu",
                    "created_at": "2025-11-19T03:00:07.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "58c292e4-ac2a-4164-b9aa-937ae6688d45",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "38862ce0-0ce1-400a-85a2-1392b6143533",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "a32ac2e0-af79-4ecd-9a56-4843ff0e36d6",
                                    "ysb_sub_element_id": "9fa11eda-38a2-451f-b987-b5a19a29bc53",
                                    "ysb_sub_element_name": "Malu berasal dari kata Hayaah, artinya hidup. Hidup dan matinya hati seseorang sangat mempengaruhi sifat malu.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:53:46.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c3fee8a2-3428-4c1b-92ac-a99d751ec93f",
                                    "ysb_sub_element_id": "fa9dacde-fbab-4bf2-9452-881f44c70409",
                                    "ysb_sub_element_name": "Melihat kenikmatan dan keteledoran sehingga menimbulkan suatu kondisi.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:59:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "612e3ad5-13fe-4df6-815c-2ec1a349451f",
                                    "ysb_sub_element_id": "57f3a118-e458-4651-b0c4-1b43546b9ad8",
                                    "ysb_sub_element_name": "Memotivasi untuk meninggalkan keburukan dan mencegah sikap menyia-nyiakan hak pemiliknya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:59:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "58c292e4-ac2a-4164-b9aa-937ae6688d45",
                                    "ysb_sub_element_id": "36192fa0-e03f-4812-ae98-d77be644ba36",
                                    "ysb_sub_element_name": "Meninggalkan perbuatan-perbuatan yang buruk dan tercela, sehingga mampu menghalangi seseorang dari melakukan dosa dan maksiat serta mencegah sikap melalaikan hak orang lain.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:59:26.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "87898901-31fc-40ab-98b2-4cad3f733cfd",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.8",
                    "description": "Bertaubat",
                    "created_at": "2025-11-19T03:00:08.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "1c50192f-4282-40b0-b525-2f105d0606ac",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "87898901-31fc-40ab-98b2-4cad3f733cfd",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "1c50192f-4282-40b0-b525-2f105d0606ac",
                                    "ysb_sub_element_id": "63368216-ac76-4bb8-8c0a-87fab08890ea",
                                    "ysb_sub_element_name": "Berazam/bercita-cita dengan sungguh-sungguh tidak akan mengulangi lagi.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7641afc2-b9da-4fae-b819-d3da5f5a0206",
                                    "ysb_sub_element_id": "c5854934-0305-4153-bcc5-71b3b3c1100b",
                                    "ysb_sub_element_name": "Meninggalkan perkara-perkara yang mendatangkan dosa.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f587b56f-c9d9-4738-b736-756bcf8a8196",
                                    "ysb_sub_element_id": "cf4bda85-aff1-4176-ad17-c8f8dee5538b",
                                    "ysb_sub_element_name": "Menyesal sungguh-sungguh di atas segala kesalahan .",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:25.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8014947a-a5bc-4434-97ae-ab1678fa6820",
                                    "ysb_sub_element_id": "b5972b3e-19d3-4bca-9570-df4cd82df1df",
                                    "ysb_sub_element_name": "Meninggalkan perkara-perkara yang mendatangkan dosa dengan manusia.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3497d1c5-cd7c-4b96-bfc7-c2ae93238795",
                                    "ysb_sub_element_id": "dcb5e32d-31dd-4e77-842c-025dcbec3a4d",
                                    "ysb_sub_element_name": "Bersungguh-sungguh untuk tidak mengulangi perkara-perkara yang mendatangkan dosa yang ada hubungan dengan manusia (mu’amaidh).",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:47.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "debe58c5-9390-42b1-83c8-2a146b69275b",
                                    "ysb_sub_element_id": "d20ce7d7-10af-4172-b996-270849f0126b",
                                    "ysb_sub_element_name": "Meminta maaf atau meminta ridho (halal) kepada orang yang kita telah berbuat dosa.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:58.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "037b6175-40f5-45d7-806e-c42853cd6dd5",
                    "ysb_dimensi_id": "ff5df708-7d27-4638-bd48-025dc53fe6c2",
                    "name_element": "Element 1.9",
                    "description": "Husnuzhan (berbaik sangka)",
                    "created_at": "2025-11-19T03:00:09.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0087cc70-44f3-44a7-b638-8de480daef5e",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "037b6175-40f5-45d7-806e-c42853cd6dd5",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "0087cc70-44f3-44a7-b638-8de480daef5e",
                                    "ysb_sub_element_id": "d0d8af96-be46-4752-8122-d466be326c88",
                                    "ysb_sub_element_name": "Menyesali dosa-dosa yang telah dilakukan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:00:42.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7c49dda6-bb0b-4d81-bdcc-44ae95140613",
                                    "ysb_sub_element_id": "c98c0692-170e-4f58-9409-cf25fced2a3b",
                                    "ysb_sub_element_name": "Sifat husnuzan ditunjukan dengan selalu berbaik sangka atas segala kehendak Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:00:56.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
            "name_dimensi": "Adab Kepada Al-Quran",
            "slug_name": "adab_kepada_al_quran",
            "created_at": "2025-10-21T09:15:42.000000Z",
            "data_element": [
                {
                    "id": "0a2f5e60-9eae-4b7d-b896-874074cc1900",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.1",
                    "description": "Membaca",
                    "created_at": "2025-11-19T03:00:10.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "2f28f86b-5eb4-4482-9db9-fc6349302e05",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "0a2f5e60-9eae-4b7d-b896-874074cc1900",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "2f28f86b-5eb4-4482-9db9-fc6349302e05",
                                    "ysb_sub_element_id": "8e11b026-5946-4629-ba38-9f1175d3cd29",
                                    "ysb_sub_element_name": "Membacanya dalam keadaan yang paling baik, yaitu suci dari hadas, menghadap kiblat.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:34.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d314104a-4deb-457d-a55e-ef3c6073b41e",
                                    "ysb_sub_element_id": "970f75b7-0f8b-479e-bf59-ebe11af75c85",
                                    "ysb_sub_element_name": "Tidak terburu-buru membaca dan mengkhatamkannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:44.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7424b566-19c2-4f06-b807-ec6df20af237",
                                    "ysb_sub_element_id": "06dff431-06ce-4895-bcf3-296069a48fc3",
                                    "ysb_sub_element_name": "Menunjukkan sikap khusyu ketika membacanya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "947f343d-e071-4849-a2f5-2bebd193e9ef",
                                    "ysb_sub_element_id": "ff407315-d73f-4674-8d3b-e92c7b3859bb",
                                    "ysb_sub_element_name": "Membaguskan suaranya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:04:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "46d2cf0d-dffa-4d1b-8bad-7baf2b293a38",
                                    "ysb_sub_element_id": "a2dd9ea9-170c-453f-b49f-e4aada8ee042",
                                    "ysb_sub_element_name": "Membacanya dengan suara pelan berada di tengah-tengah orang yang shalat.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:04:24.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "de68d467-41a9-4609-9851-409bf0803f97",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.2",
                    "description": "Menghafal",
                    "created_at": "2025-11-19T03:00:11.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "a4fbd040-4812-45dc-aefe-66a1ec8b988f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "de68d467-41a9-4609-9851-409bf0803f97",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "a4fbd040-4812-45dc-aefe-66a1ec8b988f",
                                    "ysb_sub_element_id": "71ddadcb-3a50-4ee7-b4b2-6bfc96d635c1",
                                    "ysb_sub_element_name": "Menambah Hafalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:37:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fd41a5d3-57fd-4979-8ce1-9a4e5b41bef2",
                                    "ysb_sub_element_id": "2f5093fd-3819-468b-85f3-2ab01f1de89d",
                                    "ysb_sub_element_name": "Mengulang-ulang hafalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:38:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "adb1fc89-04a4-48c2-a86c-5939e5977b16",
                                    "ysb_sub_element_id": "0721c908-cc6f-43dd-8216-6c23f9a2cc1a",
                                    "ysb_sub_element_name": "Menjaga Hafalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:38:10.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "32a6d1b5-04e0-4085-8ace-1e2ce138ec32",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.3",
                    "description": "Mentadaburi dan Mentafakuri",
                    "created_at": "2025-11-19T03:00:12.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "dce8f75d-f7d2-4f3f-ba46-985cd4de74cd",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "32a6d1b5-04e0-4085-8ace-1e2ce138ec32",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "dce8f75d-f7d2-4f3f-ba46-985cd4de74cd",
                                    "ysb_sub_element_id": "229ec684-8c2f-4d7f-836e-f65ddda28623",
                                    "ysb_sub_element_name": "Mentadaburi (mengambil pelajaran) dan mentafakkuri (berfikir, menghayati) apa yang sedang dibaca",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:39:24.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "8a8e89b3-892a-4447-bf80-a0ce82a1ed1b",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.4",
                    "description": "Membaguskan suaranya",
                    "created_at": "2025-11-19T03:00:13.000000Z",
                    "rekapan": []
                },
                {
                    "id": "40ae87df-e745-4083-86f5-8c4723e57497",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.5",
                    "description": "Membacanya dengan suara pelan ketika takut timbul sikap riya dan berada di Tengah-Tengah orang yang Sholat",
                    "created_at": "2025-11-19T03:00:14.000000Z",
                    "rekapan": []
                },
                {
                    "id": "62a3029d-3ab1-49dd-9651-3e5396c094ea",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.6",
                    "description": "Mentadaburi & mentafakkuri apa yang sedang dibaca ",
                    "created_at": "2025-11-19T03:00:15.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "f64f3766-860c-4305-8939-92e3f7e0fef1",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "62a3029d-3ab1-49dd-9651-3e5396c094ea",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "f64f3766-860c-4305-8939-92e3f7e0fef1",
                                    "ysb_sub_element_id": "84eb711f-8b89-481d-9d34-bff9969678aa",
                                    "ysb_sub_element_name": "Mentadaburi\t(mengambil pelajaran) dan mentafakkuri (berfikir, menghayati) apa yang sedang dibaca.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:37:14.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "92b31dff-ce99-4964-b743-6f6d9b67f3d1",
                    "ysb_dimensi_id": "5e7a09b3-2df4-418a-a3da-3b7d9fb75c55",
                    "name_element": "Element 2.7",
                    "description": "Tidak lalai dan tidak menentang apa yang dibacanya",
                    "created_at": "2025-11-19T03:00:16.000000Z",
                    "rekapan": []
                }
            ]
        },
        {
            "id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
            "name_dimensi": "Adab Terhadap Rasul",
            "slug_name": "adab_kepada_rasul",
            "created_at": "2025-10-21T09:15:43.000000Z",
            "data_element": [
                {
                    "id": "86d3745c-50f3-4ca1-9908-d14d7ed5397a",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.1",
                    "description": "Menaati",
                    "created_at": "2025-11-19T03:00:17.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "76881071-849a-4449-8b09-71a0793a6808",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "86d3745c-50f3-4ca1-9908-d14d7ed5397a",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "9d0c4536-7378-47f5-a20f-ef594d460b0b",
                                    "ysb_sub_element_id": "c43f0f71-f8bd-41ef-9066-ece3ce865c0f",
                                    "ysb_sub_element_name": "Melaksanakan ibadah sesuai dengan contoh Rasulullah Saw",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:15:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "76881071-849a-4449-8b09-71a0793a6808",
                                    "ysb_sub_element_id": "c7c1824f-be10-49be-8423-2f191dd654e0",
                                    "ysb_sub_element_name": "Menghindari apa yang tidak disukai Rasulullah saw",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:15:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8fc562fd-3739-43ef-9406-9cacd2cbbf9d",
                                    "ysb_sub_element_id": "69649784-9623-49f2-9020-e97f54b0e478",
                                    "ysb_sub_element_name": "Mengikuti sunnahnya dengan menjalankan 7 Sunnah Rasulullah saw",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:15:44.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "ecbaa828-cba4-4532-8c04-ae782b610f31",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.2",
                    "description": "Mencintai",
                    "created_at": "2025-11-19T03:00:18.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "2074cb95-9b2c-43de-8011-96ab75c55cdf",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "ecbaa828-cba4-4532-8c04-ae782b610f31",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "36361e82-ab37-4614-9e89-be4c2a573927",
                                    "ysb_sub_element_id": "347ffae7-dcb3-4a27-9b48-499f9c61a455",
                                    "ysb_sub_element_name": "Membaca hadits-hadits, menghapal, mengamalkan\tdan mendakwahkannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:16:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6f3df726-8dde-4f2b-ae19-8c751ab40be3",
                                    "ysb_sub_element_id": "62f8a7f5-d72d-4777-8dd4-ca5c6f5e6b5b",
                                    "ysb_sub_element_name": "Menyebutnya setiap saat baik dalam shalat maupun di luar shalat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:16:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2074cb95-9b2c-43de-8011-96ab75c55cdf",
                                    "ysb_sub_element_id": "384f2fc4-1def-4a36-9e3f-1856fa8a0d7d",
                                    "ysb_sub_element_name": "Membaca Shalawat kepadanya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:17:34.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f205a0ab-924b-4ae5-847f-de08ac6b54ca",
                                    "ysb_sub_element_id": "6050b416-3955-49b4-b11f-08075fd41c99",
                                    "ysb_sub_element_name": "Banyak membaca buku-buku sejarah hidupnya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:17:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a04688cc-25dc-454f-a580-b8d6df91e1e9",
                                    "ysb_sub_element_id": "b7593e0f-16c1-48e7-bf39-8d158d1d5613",
                                    "ysb_sub_element_name": "Menentang orang-orang yang mengejek Nabi shallallohu ‘alaihi wa sallam dan yang menyelisihi sunnah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:18:08.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "345df68a-98a8-4213-a19c-76a89de6ce85",
                                    "ysb_sub_element_id": "064972fc-ea20-4cd0-a81a-a0f09caf755e",
                                    "ysb_sub_element_name": "Membersihkan hadis-hadis yang shahih dan hasan dari hadis-hadis yang dha’if (lemah) dan maudhu’ (palsu) yang dinisbatkan kepada Nabi shallallohu ‘alaihi wa sallam dan mencukupkan diri beramal dengan hadis-hadis yang shahih.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:18:23.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "5d8d87e5-90c4-4ac9-bc5d-772cad09e7ba",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.3",
                    "description": "Ber Sholawat",
                    "created_at": "2025-11-19T03:00:19.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0e9fd9b7-46e5-48d1-be3c-d6b1070da8db",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "5d8d87e5-90c4-4ac9-bc5d-772cad09e7ba",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "fcd22044-298c-4107-8e2b-0c58ac2784d2",
                                    "ysb_sub_element_id": "a3d44f5c-1686-48c2-bbe0-2768f3b68eb3",
                                    "ysb_sub_element_name": "Bershalawat dengan memujinya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0e9fd9b7-46e5-48d1-be3c-d6b1070da8db",
                                    "ysb_sub_element_id": "798af626-623f-48e6-9a51-dd4473d71744",
                                    "ysb_sub_element_name": "Mengucapkan bacaan shalawat.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:14.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "17be8cdd-37c4-4aae-a754-2122f5d61777",
                                    "ysb_sub_element_id": "8fd53a73-8098-4ab2-8c96-8170fc77f2db",
                                    "ysb_sub_element_name": "Membaca shalawat ketika berdoa setelah memuji Allah Swt.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:29.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0f072fd5-59a1-41a9-ab24-ca24444a15e3",
                                    "ysb_sub_element_id": "7c7fd83d-25b9-4ff4-b3c4-4906a9b8c4e6",
                                    "ysb_sub_element_name": "Membaca shalawat ketika Nama Nabi Muhammad saw disebut.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:44.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "226c4d76-e57f-4bfa-a511-276b674c3c3f",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.4",
                    "description": "Waspada",
                    "created_at": "2025-11-19T03:00:20.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "12bbe7a7-e4ee-4f61-8064-1548b0af6f1f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "226c4d76-e57f-4bfa-a511-276b674c3c3f",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "12bbe7a7-e4ee-4f61-8064-1548b0af6f1f",
                                    "ysb_sub_element_id": "9f1ed92e-2bb2-4526-8fd8-5d5bad7cd953",
                                    "ysb_sub_element_name": "Tidak menyelisihi dan mendurhakai Rasulullah Saw",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:20:46.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "faff1b45-aa60-40ef-9516-87105595a1aa",
                                    "ysb_sub_element_id": "6b0d2186-e01c-4af2-a7ef-79d21e02b26b",
                                    "ysb_sub_element_name": "Tidak menyianyiakan sunnah Rasulullah Saw dalam semua aktivitas, seperti: makan, minum, berpakaian, berbicara, bergaul dll",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:21:06.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b7329aa7-5204-4cf0-9200-666d250ae36c",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.5",
                    "description": "Mendahulukan perkataannya",
                    "created_at": "2025-11-19T03:00:21.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "451255cb-0414-427d-957a-60b1911720da",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "b7329aa7-5204-4cf0-9200-666d250ae36c",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "451255cb-0414-427d-957a-60b1911720da",
                                    "ysb_sub_element_id": "ffc743f5-354e-4927-b475-abf1a050bbb8",
                                    "ysb_sub_element_name": "Sopan santun dalam bergaul dengan Rasulullah SAW",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:21:47.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d51c2d5d-d5f1-4205-8fb3-d5ff220eab55",
                                    "ysb_sub_element_id": "da805e10-3b58-4517-93d9-9f42c4ff30d2",
                                    "ysb_sub_element_name": "Menghormati, memuliakan dan mengagungkan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:21:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "de803bfd-4409-4067-a97d-3ba4027a272b",
                                    "ysb_sub_element_id": "4db9e88c-00aa-401c-ab9d-3f70a30f0d92",
                                    "ysb_sub_element_name": "Jangan tergesa-gesa berbuat sesuatu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:22:14.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5599945e-40cf-4385-b29f-4f45b18f612c",
                                    "ysb_sub_element_id": "1039b713-a28b-4eab-b2af-0f33ceceb1c3",
                                    "ysb_sub_element_name": "Jangan melakukan sebelum Rasulullah Saw",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:22:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b822fa7e-daf3-4000-b534-d015b3d0d0cf",
                                    "ysb_sub_element_id": "35bd700c-ae1f-4c76-b8d0-b1ea34d68fac",
                                    "ysb_sub_element_name": "Mengikuti Rasulullah Saw dalam segala urusan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:22:47.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "803f2e97-7745-4269-8ef9-d740a7db0f1e",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.6",
                    "description": "Mengimani kenabian & kerasulan",
                    "created_at": "2025-11-19T03:00:22.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "37e2bf31-871b-4f81-9f64-d5f9a486a1a2",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "803f2e97-7745-4269-8ef9-d740a7db0f1e",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "37e82b35-bd88-499a-a9dc-d69f24c44ed2",
                                    "ysb_sub_element_id": "3318c916-04d6-4dc9-9747-b6eaa50caaf6",
                                    "ysb_sub_element_name": "Mengimani bahwa Allah SWT benar-benar mengutus para nabi dan rasul.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ffa81a6e-5943-4cfc-a4ed-061f90be5f3d",
                                    "ysb_sub_element_id": "827673fe-383f-405a-866b-cf17fa4f7456",
                                    "ysb_sub_element_name": "Mengimani nama-nama Nabi dan Rasul yang kita ketahui",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:41.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "37e2bf31-871b-4f81-9f64-d5f9a486a1a2",
                                    "ysb_sub_element_id": "79fa2655-02fc-4121-b7a4-7beb4e954d23",
                                    "ysb_sub_element_name": "Mengimani nama-nama nabi dan rasul yang tidak diketahui dan tidak boleh membeda-bedakannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:57.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "7b2b5cc8-e02b-497e-aaa0-022861194333",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.7",
                    "description": "Menghindari sikap ghulluw",
                    "created_at": "2025-11-19T03:00:23.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "11ab694b-4556-4f44-8830-26ff299f746a",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "7b2b5cc8-e02b-497e-aaa0-022861194333",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "11ab694b-4556-4f44-8830-26ff299f746a",
                                    "ysb_sub_element_id": "9ad5389a-cd00-44a3-90d6-5fc979b3f6ff",
                                    "ysb_sub_element_name": "Tidak berlebih-lebihan dalam beribadah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bece08a8-e8f0-455e-82f8-60354f2cc41f",
                                    "ysb_sub_element_id": "0b084ab8-d51f-45c8-be84-2492625b7bf4",
                                    "ysb_sub_element_name": "Tidak menambah, meninggikan dan melampaui batas.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c7f38018-3a63-4835-af70-ab10cc287bd2",
                                    "ysb_sub_element_id": "8001357b-07ee-4937-98fb-23df9d0c2527",
                                    "ysb_sub_element_name": "Tidak menyimpang dari apa yang sudah ditentukan dalam syariat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:55.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "ef1d89a0-05f5-4ec5-b642-18a8d6950f1a",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.8",
                    "description": "Mencintai orang yang mencintai Rasulullah SAW",
                    "created_at": "2025-11-19T03:00:24.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "893c3be4-3ded-422e-b88d-6241222bc839",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "ef1d89a0-05f5-4ec5-b642-18a8d6950f1a",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "893c3be4-3ded-422e-b88d-6241222bc839",
                                    "ysb_sub_element_id": "ff0e3ac3-553c-40ae-b1ba-642fb2240ce5",
                                    "ysb_sub_element_name": "Menghormati, membanggakan dan memuji orang-orang yang mengamalkan dan menghidupkan sunnah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8a31ec0e-08f9-4e75-8771-ee4b32a799df",
                                    "ysb_sub_element_id": "ab369def-05ee-4cf8-b370-9226ee07886b",
                                    "ysb_sub_element_name": "Menghormati dan mencintai Ahlu bait Nabi Saw. dengan penghormatan dan kecintaan yang layak untuk mereka.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b4b1d597-7af6-4b3d-814d-b9ab65f86e75",
                                    "ysb_sub_element_id": "e91301eb-f019-49f3-b545-d9a509bc895d",
                                    "ysb_sub_element_name": "Mencintai para sahabat Nabi Saw menyebut-nyebut kebaikan dan keutamaan mereka dan berdiam diri atas pertikaian yang terjadi di antara mereka.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:26:09.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "7ea821df-64ad-4d67-850b-6aa5196a2cd0",
                    "ysb_dimensi_id": "71cf2634-863e-4c3e-99be-a4ec715b1d82",
                    "name_element": "Element 3.9",
                    "description": "Menjaga Sunnah",
                    "created_at": "2025-11-19T03:00:25.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "165abb4f-cf57-4a44-902a-bfed75f17a6f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "7ea821df-64ad-4d67-850b-6aa5196a2cd0",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "83e21f81-a17e-493e-ad36-e1ed861da463",
                                    "ysb_sub_element_id": "2907e9f8-7b5e-4fb8-8780-826d7af72f7e",
                                    "ysb_sub_element_name": "Shalat tahajud",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:26:56.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8636ac62-e136-4769-a580-731d64742978",
                                    "ysb_sub_element_id": "88cf55f8-3306-49b0-85fb-da207d8839db",
                                    "ysb_sub_element_name": "Membaca Al-Quran.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:07.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b7776cae-4c1c-44d4-a937-345e8706d58f",
                                    "ysb_sub_element_id": "069191c1-15a3-4ea5-be15-737f86702323",
                                    "ysb_sub_element_name": "Memakmurkan masjid/shalat subuh di masjid.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "165abb4f-cf57-4a44-902a-bfed75f17a6f",
                                    "ysb_sub_element_id": "1edc99c6-63fd-4112-9866-9faf3f8f3f08",
                                    "ysb_sub_element_name": "Shalat Dhuha",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9195eab3-8b8a-48e0-b15c-eca33f6f0d3b",
                                    "ysb_sub_element_id": "af32a1fa-5474-4cee-aa2d-b986a07f72df",
                                    "ysb_sub_element_name": "Bersedekah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a6762556-7695-4138-93dd-4c6d522b8f19",
                                    "ysb_sub_element_id": "9f266219-ceb9-4337-b8c8-b54b022b3ddf",
                                    "ysb_sub_element_name": "Menjaga wudhu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:57.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "24c2d41a-df57-4e86-b3a2-c11e542d8f3a",
                                    "ysb_sub_element_id": "2f210514-fd71-4a36-bf5f-1649eafe53c2",
                                    "ysb_sub_element_name": "Istighfar",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:28:08.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "2dd5625c-0f11-47c2-8b2c-84a973ea90f4",
            "name_dimensi": "Adab Terhadap Islam",
            "slug_name": "adab_terhadap_islam",
            "created_at": "2025-10-21T09:15:44.000000Z",
            "data_element": [
                {
                    "id": "be1ca615-6a86-4a5c-99d1-09313044a9f8",
                    "ysb_dimensi_id": "2dd5625c-0f11-47c2-8b2c-84a973ea90f4",
                    "name_element": "Element 4.1",
                    "description": "Berpegang teguh",
                    "created_at": "2025-11-19T03:00:26.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "05f6460e-18a3-4ca6-8199-0bfffb419a84",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "be1ca615-6a86-4a5c-99d1-09313044a9f8",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "e4e239f0-e6da-42f8-8e89-c7b983a4db55",
                                    "ysb_sub_element_id": "f95c6049-5a60-4a85-9873-460971418551",
                                    "ysb_sub_element_name": "Menjadikan Islam sebagai panduan berdasar kepada dua sumber ajaran Islam (Al Quran dan Al Hadits)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:29:19.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "05f6460e-18a3-4ca6-8199-0bfffb419a84",
                                    "ysb_sub_element_id": "72b4df68-377e-4549-af07-bc3fe5d7e61b",
                                    "ysb_sub_element_name": "Islam memerintahkan umatnya untuk selalu kembali kepada Al Quran dan as-Sunnah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:29:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d109d273-a0c8-44c0-ad9e-1aac44878bd8",
                                    "ysb_sub_element_id": "f81cb4c8-c813-45df-81c3-bf921ca6fccb",
                                    "ysb_sub_element_name": "Antar umat Islam harus bersatu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:29:45.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "a8130760-9240-44da-9406-d49b73b7f0ec",
                    "ysb_dimensi_id": "2dd5625c-0f11-47c2-8b2c-84a973ea90f4",
                    "name_element": "Element 4.2",
                    "description": "Bangga",
                    "created_at": "2025-11-19T03:00:27.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "02f2b39f-2178-456d-beaf-23f0fbb930e9",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "a8130760-9240-44da-9406-d49b73b7f0ec",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "4c10080a-2795-4f67-a139-f28bb99809ac",
                                    "ysb_sub_element_id": "16a822ec-de0b-405a-b783-5ee9463df7e4",
                                    "ysb_sub_element_name": "Tetap dalam keadaan Islam.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "18cb3fde-2e93-44b4-923d-c3741bb618aa",
                                    "ysb_sub_element_id": "7e34cc08-1666-44ec-9542-7ee300ce01b2",
                                    "ysb_sub_element_name": "Mengatakan dengan lantang, ”Saya adalah Muslim”.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "02f2b39f-2178-456d-beaf-23f0fbb930e9",
                                    "ysb_sub_element_id": "aca6eb1b-3b99-4071-99a4-b354850312cb",
                                    "ysb_sub_element_name": "Mendakwahkan Islam",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:31:06.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "861b1154-ffe9-4cc5-89b2-53e387e387f2",
                    "ysb_dimensi_id": "2dd5625c-0f11-47c2-8b2c-84a973ea90f4",
                    "name_element": "Element 4.3",
                    "description": "Mendakwahkan",
                    "created_at": "2025-11-19T03:00:28.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0eed0d2a-3dce-40d7-bd64-d35f3fab08b0",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "861b1154-ffe9-4cc5-89b2-53e387e387f2",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "cdc7ccb3-e9db-406f-9eb7-d43cb3b63cd1",
                                    "ysb_sub_element_id": "6811da2d-c11b-4ae4-80ac-e2dba076718e",
                                    "ysb_sub_element_name": "Menyeru manusia untuk beribadah kepada Allah Swt dengan cara bijaksana.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:31:55.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "12294ed1-e789-480d-a9e9-844cdb1e3269",
                                    "ysb_sub_element_id": "477bc603-a27d-4c5f-9436-f267412e5d0e",
                                    "ysb_sub_element_name": "Diperlukan perdebatan dan bantahan dengan cara yang baik, kecuali dengan orang-orang yang zhalim, orang-orang yang tidak meyakini Islam sebagai Agama yang benar.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:32:19.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0eed0d2a-3dce-40d7-bd64-d35f3fab08b0",
                                    "ysb_sub_element_id": "81d11e92-a1f2-4214-acef-bd6bc7be388f",
                                    "ysb_sub_element_name": "Serulah mereka dengan lemah lembut.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:32:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "23de5d2c-1f1a-4722-be8e-65b8f246515f",
                                    "ysb_sub_element_id": "71f74b46-55f3-48b0-ae19-e2f74580ba98",
                                    "ysb_sub_element_name": "Serulah mereka untuk menyembah Allah Swt dan jangan merasa kecewa (bersedih hati) terhadap orang yang sesat diantara mereka.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:32:57.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "e52384a9-1a09-4ab7-b4c8-93873f6bfe35",
            "name_dimensi": "Adab Terhadap Diri Sendiri",
            "slug_name": "adab_terhadap_diri_sendiri",
            "created_at": "2025-10-21T09:15:45.000000Z",
            "data_element": [
                {
                    "id": "5ca801f1-d4d4-4f38-97f2-46e1874137cc",
                    "ysb_dimensi_id": "e52384a9-1a09-4ab7-b4c8-93873f6bfe35",
                    "name_element": "Element 5.1",
                    "description": "Taubat",
                    "created_at": "2025-11-19T03:00:29.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "1271fd15-edbe-4f58-9c43-eb1fa247fcb8",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "5ca801f1-d4d4-4f38-97f2-46e1874137cc",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "1271fd15-edbe-4f58-9c43-eb1fa247fcb8",
                                    "ysb_sub_element_id": "8f74fc4c-bff6-4b9f-be62-2d86ffbf4852",
                                    "ysb_sub_element_name": "Menyesal sungguh di atas dosa-dosa yang telah dilakukan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a9a39723-775f-4b98-bec9-92865f9567f5",
                                    "ysb_sub_element_id": "f02095e0-63b7-4594-a220-7f2c3fc3cf1d",
                                    "ysb_sub_element_name": "Berazam/bercita-cita bersungguh-sungguh tidak akan mengulangi lagi.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2b5e6e50-0ab6-4aa3-87a0-4e574cb22099",
                                    "ysb_sub_element_id": "c7a6a562-c7db-48fa-942f-3657b351426f",
                                    "ysb_sub_element_name": "Meninggalkan perkara-perkara yang mendatangkan dosa-dosa.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:46.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "284b91ad-1531-4204-bb77-759c89162deb",
                    "ysb_dimensi_id": "e52384a9-1a09-4ab7-b4c8-93873f6bfe35",
                    "name_element": "Element 5.2",
                    "description": "Muroqobah (kejujuran)",
                    "created_at": "2025-11-19T03:00:30.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "05395455-d502-463d-a562-9a67f8a72d03",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "284b91ad-1531-4204-bb77-759c89162deb",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "21b583cf-8c7d-4919-84fb-f7d8930a33ad",
                                    "ysb_sub_element_id": "97f308b2-1e14-4a66-a078-eb065b219b7d",
                                    "ysb_sub_element_name": "Merasakannya di setiap saat dari kehidupannya sehingga keyakinannya menjadi sempurna bahwa Allah SWT selalu melihatnya, mengetahui rahasia-rahasianya, memperhatikan amal- amalnya, menegakkan putusan terhadapnya dan terhadap setiap jiwa dengan apa yang telah dilakukan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:42:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "05395455-d502-463d-a562-9a67f8a72d03",
                                    "ysb_sub_element_id": "1bcc2c9f-12dd-403b-b960-88a1711e45f2",
                                    "ysb_sub_element_name": "Tenggelam dalam pengawasan keagungan dan kesempurnaan Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:42:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "51fa7722-bb18-4208-a0d4-3584bced72a2",
                                    "ysb_sub_element_id": "9000adcc-fb82-4676-8395-4c07900f5b12",
                                    "ysb_sub_element_name": "Merasakan kedamaian dengan mengingat-Nya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:42:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9dab73a9-693e-47e5-ac08-7a43f6d1a023",
                                    "ysb_sub_element_id": "bc518e13-6023-4c14-9481-9780922bb038",
                                    "ysb_sub_element_name": "Memperoleh kenyamanan dengan menjalankan ketaatan kepada-Nya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:21.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1a5d5cb2-1a89-46a9-9772-0e52bcb01b0d",
                                    "ysb_sub_element_id": "9755eb30-4a62-439d-8626-fb0468411705",
                                    "ysb_sub_element_name": "Mengharapkan pahala di sisiNya, menghadap kepadaNya dan berpaling dari selainNya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "95c1070b-a129-4ced-bb70-3d0381b8b887",
                                    "ysb_sub_element_id": "73017c7a-7a32-4ba7-80bd-efe9c33afc71",
                                    "ysb_sub_element_name": "Beribadahlah kepada Allah Swt seakan-akan kamu melihatNya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:57.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "90044b92-64c6-4e26-9154-b8bca694fe5c",
                                    "ysb_sub_element_id": "6d04edb6-4eee-42ce-b1aa-7cf7beb5ea6f",
                                    "ysb_sub_element_name": "Jadikanlah dirimu seakan-akan senantiasa melihat Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:08.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "abee32fb-aeae-481b-be17-63356069a7d4",
                    "ysb_dimensi_id": "e52384a9-1a09-4ab7-b4c8-93873f6bfe35",
                    "name_element": "Element 5.3",
                    "description": "Muhasabah (instropeksi diri)",
                    "created_at": "2025-11-19T03:00:31.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0ef3a7fc-6f23-44d3-8e5b-f1c62f29b07d",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "abee32fb-aeae-481b-be17-63356069a7d4",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "40a51ec4-6cac-47db-b3da-305e09eae981",
                                    "ysb_sub_element_id": "f2cb0fe1-1fb0-4d6b-bee1-03549c2b75a3",
                                    "ysb_sub_element_name": "Memperbaiki, melatih, menyucikan dan membersihkan diri.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:46.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "88b8fdb3-3e4d-4532-b247-f56fe686a0c6",
                                    "ysb_sub_element_id": "a6a25ba3-5a31-4c54-8cb6-ad2237ee5552",
                                    "ysb_sub_element_name": "Menghisab dirimu sebelum dihisab.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "acf2c77a-fad7-40dc-8353-a75da1dab365",
                                    "ysb_sub_element_id": "c686a420-4b9c-4769-b13c-abc3dc78c74a",
                                    "ysb_sub_element_name": "Memuhasabah diri dari perbuatan sia-sia.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:03.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0ef3a7fc-6f23-44d3-8e5b-f1c62f29b07d",
                                    "ysb_sub_element_id": "15244f5c-dece-4574-9faf-ad9ea4ebcb1b",
                                    "ysb_sub_element_name": "Mencela atas keteledoran.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:39.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "867ea9fd-9fd5-45d1-a671-968c47bc434e",
                                    "ysb_sub_element_id": "f36a31bb-3bd3-4e1d-a5eb-0fac34a210be",
                                    "ysb_sub_element_name": "Menetapi sifat takwa.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "13205264-3ba4-4b5c-8019-296c7f7735cf",
                                    "ysb_sub_element_id": "f62b0639-4317-4a58-8846-1607d631ec40",
                                    "ysb_sub_element_name": "Menahan diri dari hawa nafsu.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:10.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "a9c5718c-f14b-43ae-a8da-c68fcc6c1c08",
                    "ysb_dimensi_id": "e52384a9-1a09-4ab7-b4c8-93873f6bfe35",
                    "name_element": "Element 5.4",
                    "description": "Mujahadah (kedisiplinan, tanggung-jawab, kemandirian, percaya diri",
                    "created_at": "2025-11-19T03:00:32.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "8fef3b98-4f51-44c6-9623-5261b0211b27",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "a9c5718c-f14b-43ae-a8da-c68fcc6c1c08",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "8fef3b98-4f51-44c6-9623-5261b0211b27",
                                    "ysb_sub_element_id": "0a8d66b3-fb08-4440-ad7b-434e95e6f6c5",
                                    "ysb_sub_element_name": "mengetahui bahwa musuhnya adalah nafsu (diri) nya sendiri.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:47.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e50ba428-b33e-45ac-95ef-f980787ccd91",
                                    "ysb_sub_element_id": "57269543-a3bc-456e-bbd7-ca7950f22cbc",
                                    "ysb_sub_element_name": "menyiapkan dirinya kemudian mengumumkan peperangan terhadapnya, mengangkat senjata untuk memeranginya, bercita- cita tetap untuk melawan kebodohannya dan memerangi syahwatnya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:47:06.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
            "name_dimensi": "Adab Terhadap Sesama",
            "slug_name": "adab_terhadap_sesama",
            "created_at": "2025-10-21T09:15:46.000000Z",
            "data_element": [
                {
                    "id": "059d8d77-987c-44a5-a374-20dab84b2983",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.1",
                    "description": "Adab terhadap orang tua",
                    "created_at": "2025-11-19T03:00:33.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "167ca169-41a1-4687-9a4b-55aadbe525b8",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "059d8d77-987c-44a5-a374-20dab84b2983",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "67ffd6a0-91b8-4eeb-a723-eab57101211b",
                                    "ysb_sub_element_id": "c8e1e1a0-a95a-4041-938e-0963facef70c",
                                    "ysb_sub_element_name": "Tidak memandang orang tua dengan pandangan yang tajam atau tidak menyenangkan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:25.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "519a9430-fa7f-4462-9359-704c9c299c1d",
                                    "ysb_sub_element_id": "46aaec8a-9986-45d8-9ffb-4dc92e58c5de",
                                    "ysb_sub_element_name": "Tidak meninggikan suara ketika berbicara dengan orang tua",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:41.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "653369d3-35c8-43be-a79b-b3fdf7285c04",
                                    "ysb_sub_element_id": "787ab789-24f7-4d63-92ff-1e6c3ed04e3b",
                                    "ysb_sub_element_name": "Tidak mendahului mereka dalam berkata-kata",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:19:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "167ca169-41a1-4687-9a4b-55aadbe525b8",
                                    "ysb_sub_element_id": "3802ccb8-b9f7-4095-a609-322a4f574cdc",
                                    "ysb_sub_element_name": "Tidak duduk di depan orang tua sedangkan mereka berdiri",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:20:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "815b2783-2e62-456e-997d-c132916237c3",
                                    "ysb_sub_element_id": "ebeac7e5-52f5-4c8a-b8ca-1e79ebc4e38e",
                                    "ysb_sub_element_name": "Lebih mengutamakan orang tua daripada diri sendiri atau iitsaar dalam perkara duniawi",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:20:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b339fe77-2065-40e5-9a5b-ffc478330ff5",
                                    "ysb_sub_element_id": "8f1f7ece-5ca2-48da-b4a0-9f7613b0a612",
                                    "ysb_sub_element_name": "Berbuat baik kepada kedua orang tua (Birrul Waalidain)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:20:22.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "c12b691f-7cea-441e-947e-56260cb34761",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.2",
                    "description": "Adab terhadap Guru ",
                    "created_at": "2025-11-19T03:00:34.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "64b6aa87-86f1-4cc4-947a-e0ce3f5b3666",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "c12b691f-7cea-441e-947e-56260cb34761",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "825a237d-08f5-4816-b025-5de1db0f15e3",
                                    "ysb_sub_element_id": "541986d2-a516-401c-bbfc-73809f8d31e3",
                                    "ysb_sub_element_name": "Memuliakan guru",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:22:52.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a0686f4e-b307-4bc1-b14e-cef0a4aabdb4",
                                    "ysb_sub_element_id": "59394f74-b0d7-4e2c-a842-3c9eb4fe61b7",
                                    "ysb_sub_element_name": "Mendo’akan kebaikan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:22:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "64b6aa87-86f1-4cc4-947a-e0ce3f5b3666",
                                    "ysb_sub_element_id": "477d002a-17b5-4ded-a77a-dfd5e8321d44",
                                    "ysb_sub_element_name": "Rendah diri kepada guru",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:06.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b2c3feb2-2c73-408d-aa20-2d76f998e545",
                                    "ysb_sub_element_id": "9781e605-03a3-4bbb-803d-b23842ff8a2d",
                                    "ysb_sub_element_name": "Meneladani akhlaknya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:13.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "9b53f945-724c-45f5-bf74-f22fbecc52b0",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.3",
                    "description": "Adab terhadap keluarga",
                    "created_at": "2025-11-19T03:00:35.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "6491989e-51ab-4d71-9c9e-6a1028fa4bad",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "9b53f945-724c-45f5-bf74-f22fbecc52b0",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "c9794f10-125f-41fa-a5c9-2282e07e19d1",
                                    "ysb_sub_element_id": "6077d94a-762a-470b-b46e-e610d9863558",
                                    "ysb_sub_element_name": "Tanggung jawab",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bdb91501-092f-422d-8c6c-47944dbd9963",
                                    "ysb_sub_element_id": "0b4683b0-8bbf-4139-8a96-67335c43012c",
                                    "ysb_sub_element_name": "Kerjasama",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:23:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6491989e-51ab-4d71-9c9e-6a1028fa4bad",
                                    "ysb_sub_element_id": "dc260c45-6db0-4329-9237-64dcde2963a2",
                                    "ysb_sub_element_name": "Perhitungan dan keseimbangan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:06.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a545803e-2a47-4ab5-b875-103c92d38353",
                                    "ysb_sub_element_id": "59c05e68-2ca0-4215-b2f7-4a0a954afc96",
                                    "ysb_sub_element_name": "Disiplin",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b7c4c904-2a2d-4d3b-8c30-f3a19d0ffd06",
                                    "ysb_sub_element_id": "3742f730-9440-4f7b-8ef4-fb2c34059afe",
                                    "ysb_sub_element_name": "Kasih sayang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:18.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f926ab58-45c1-4862-87ff-159f0e8c5b4a",
                                    "ysb_sub_element_id": "1490665d-787b-444a-97f1-56b4d4a267b7",
                                    "ysb_sub_element_name": "Keteladan Ibu dan Bapak",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:25.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "9aa221b2-b6b3-4690-bb3d-f798f5fca00f",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.4",
                    "description": "Adab terhadap tetangga",
                    "created_at": "2025-11-19T03:00:36.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "136e9300-39f4-4030-9813-f46632e449ee",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "9aa221b2-b6b3-4690-bb3d-f798f5fca00f",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "136e9300-39f4-4030-9813-f46632e449ee",
                                    "ysb_sub_element_id": "62078f21-0fd8-4201-ba71-f53f7fa2cd4b",
                                    "ysb_sub_element_name": "menghormati tetangga dan berperilaku baik terhadap mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:48.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "76eb7e14-f9e9-4cd2-9abd-c6b6cb80f26a",
                                    "ysb_sub_element_id": "ca934e37-4197-437e-87d1-0bb593693e06",
                                    "ysb_sub_element_name": "bangunan rumah kita jangan mengganggu tetangga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:24:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bb54f24e-89f7-4e4d-b216-a6a7cea22b23",
                                    "ysb_sub_element_id": "f5ec6505-833e-4f14-a9e3-bb4360ec5f99",
                                    "ysb_sub_element_name": "memelihara hak-hak tetangga, terutama tetangga yang paling dekat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:08.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d61d6e2b-c5fe-43b5-b6d4-6c241e279317",
                                    "ysb_sub_element_id": "541ebd2d-1d93-4464-88da-5bc3acadd648",
                                    "ysb_sub_element_name": "tidak mengganggu tetangga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "69af3689-acfb-45b9-9ba7-3110f0494708",
                                    "ysb_sub_element_id": "7f3156f6-a94a-4f1d-a437-78b244d30eac",
                                    "ysb_sub_element_name": "jangan kikir untuk memberikan nasehat dan saran kepada mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:25.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2c883717-bbbd-4d06-b03e-c5568349330c",
                                    "ysb_sub_element_id": "17dbbbda-d4d3-4955-9211-e695fd2daafe",
                                    "ysb_sub_element_name": "memberikan makanan kepada tetangga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8d1ebf18-fef0-4fed-a2b6-95ed268149ba",
                                    "ysb_sub_element_id": "2342ba7a-7e3f-45f8-8200-875cfeda7785",
                                    "ysb_sub_element_name": "bergembira ketika mereka bergembira dan berduka ketika mereka berduka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:38.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e720559e-4751-4e88-80ab-45b63a387a69",
                                    "ysb_sub_element_id": "10bc8301-248e-49e6-9bdd-c8878197f9d1",
                                    "ysb_sub_element_name": "tidak mencari-cari kesalahan tetangga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:46.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "42382c2d-3de9-45d8-90c0-0dd0d53cda2f",
                                    "ysb_sub_element_id": "65bcb839-4afe-4d25-833c-1c1a7d8f7891",
                                    "ysb_sub_element_name": "sabar atas perilaku kurang baik mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:25:53.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "8facc1d4-ac2e-4bf5-a306-f64a316ade3a",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.5",
                    "description": "Adab terhadap tamu",
                    "created_at": "2025-11-19T03:00:37.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "050159e0-de98-4af8-9b6c-350a3f239b4d",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "8facc1d4-ac2e-4bf5-a306-f64a316ade3a",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "77814deb-91a6-48cc-af23-85ab2998d923",
                                    "ysb_sub_element_id": "9979302e-8902-4f3e-9214-ccea29b07421",
                                    "ysb_sub_element_name": "mengucapkan selamat datang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:26:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b0c708fd-9b48-4e96-b6e7-d667266ad57a",
                                    "ysb_sub_element_id": "01bd98ca-71b8-4bea-a9b7-8d6d55a27b1f",
                                    "ysb_sub_element_name": "Menghormati tamu dan menyediakan hidangan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:26:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "324bf7b6-493f-40dc-a1b7-af7a9b259fc0",
                                    "ysb_sub_element_id": "c3665a1a-3bc6-4640-a24c-fb6021ffebfd",
                                    "ysb_sub_element_name": "Dalam penyajiannya tidak bermaksud untuk bermegah-megah dan berbangga-bangga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:28.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "86987c74-c3fe-4080-9aa4-7c55972d9f3c",
                                    "ysb_sub_element_id": "7b4a1972-af93-4594-95d8-0c12b054f6d5",
                                    "ysb_sub_element_name": "Dalam pelayanannya diniatkan untuk memberikan kegembiraan kepada sesama muslim",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:39.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "450f6990-f284-4c4d-a2c9-36e8a0faeca6",
                                    "ysb_sub_element_id": "84d20aff-977c-4554-b05c-963f8c443c3e",
                                    "ysb_sub_element_name": "Mendahulukan tamu yang sebelah kanan daripada yang sebelah kiri",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:48.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "23a1821b-9763-4e3e-b981-b568c3236157",
                                    "ysb_sub_element_id": "f0265b24-38a7-414c-9d30-b66f9d1a8dc9",
                                    "ysb_sub_element_name": "Mendahulukan tamu yang lebih tua daripada tamu yang lebih mudaMendahulukan tamu yang lebih tua daripada tamu yang lebih muda",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:27:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7f0f1dea-935e-4053-8ea8-69ca1dab2c17",
                                    "ysb_sub_element_id": "157ce4f0-3450-422e-bc9c-9dfbb32d03b2",
                                    "ysb_sub_element_name": "Jangan mengangkat makanan yang dihidangkan sebelum tamu selesai menikmatinya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:28:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1c140144-3458-4403-8f53-5f260c766668",
                                    "ysb_sub_element_id": "625e54e3-3d69-4558-9413-81197f2a97ff",
                                    "ysb_sub_element_name": "Mengajak mereka berbincang-bincang dengan pembicaraan yang menyenangkan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:28:19.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "273ae68b-ae3d-493a-aa3d-b90c8b7aa392",
                                    "ysb_sub_element_id": "de7f70c6-62ac-4fe3-86e4-204c023cd9a4",
                                    "ysb_sub_element_name": "Tidak tidur sebelum mereka tidur",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:28:25.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "050159e0-de98-4af8-9b6c-350a3f239b4d",
                                    "ysb_sub_element_id": "a64b1210-92c9-40f6-9fe4-af64fcb86f45",
                                    "ysb_sub_element_name": "Tidak mengeluhkan kehadiran mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:24.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bf4ce94c-452c-4ca5-9e05-31b75b650202",
                                    "ysb_sub_element_id": "767bae82-fd82-4b35-bbf2-b6e37a11f7e4",
                                    "ysb_sub_element_name": "Bermuka manis ketika mereka datang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6759eecf-d757-4260-9788-f19edb0f4e4f",
                                    "ysb_sub_element_id": "3db0f732-995d-4a82-9a50-13b60114e1da",
                                    "ysb_sub_element_name": "Merasa kehilangan tatkala pamitan pulang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5bd6b037-9e92-48c5-8543-9ea7b79cc863",
                                    "ysb_sub_element_id": "897e2fbb-016c-4081-a7d5-9f2268e19a10",
                                    "ysb_sub_element_name": "Mendekatkan makanan kepada tamu tatkala menghidangkan makanan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:30:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "376c0535-0ca0-4091-9b3f-4285c3019e4e",
                                    "ysb_sub_element_id": "4a6e8ff5-2c97-444b-ba8d-1055fa5c2546",
                                    "ysb_sub_element_name": "Mempercepat untuk menghidangkan makanan bagi tamu sebab hal tersebut merupakan penghormatan bagi mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:31:15.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "53dfd1e6-c087-421b-956b-2e6f8ea8af43",
                                    "ysb_sub_element_id": "c6378858-281e-40f5-9cf8-75e96aa5137c",
                                    "ysb_sub_element_name": "Melayani para tamunya dan menampakkan kepada mereka kebahagiaan serta menghadapi mereka dengan wajah yang ceria dan berseri-seri",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:32:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d2a201fd-c672-4923-9c71-49595514fde3",
                                    "ysb_sub_element_id": "08f4e0d9-e049-4b4e-8cc1-68cdbfb6017c",
                                    "ysb_sub_element_name": "Menjamu tamu selama tiga hari",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:33:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b3963265-478a-4a45-b9a3-4f6fb83c1939",
                                    "ysb_sub_element_id": "186ca0fb-7fe2-47b9-a880-62254bfc76cf",
                                    "ysb_sub_element_name": "Hendaknya mengantarkan tamu yang mau pulang sampai ke depan rumah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:33:15.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "493b380e-5e7d-4068-b346-162ab9a9518d",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.6",
                    "description": "Adab terhadap sesama Muslim ",
                    "created_at": "2025-11-19T03:00:38.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "54f4abef-ebb8-4bd7-9ee6-069d91a77c7c",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "493b380e-5e7d-4068-b346-162ab9a9518d",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "f21c637a-fcea-4581-a07e-1d7632f0a7a6",
                                    "ysb_sub_element_id": "d40dace4-41ff-44a0-b31b-320551f20eed",
                                    "ysb_sub_element_name": "mengucapkan salam jika kita bertemu dengan saudara semuslim",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:35:26.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "db4ef74b-2cd8-4b71-818c-0181673ff2fc",
                                    "ysb_sub_element_id": "04e79276-02b8-4f43-8978-23e95679345c",
                                    "ysb_sub_element_name": "menasihati saudara semuslim jika ia meminta nasihat kepada kita dalam satu persoalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:35:40.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b12d5521-3a43-485f-a593-3234781bb12a",
                                    "ysb_sub_element_id": "e83560e3-bdff-426b-b7b8-bab15e256366",
                                    "ysb_sub_element_name": "senantiasa menolong dan tidak menelantarkan saudara kita",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:35:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7733543b-da4c-4137-9247-1d4570c88f3b",
                                    "ysb_sub_element_id": "33c11c27-eff9-4497-a8da-b3b62bab3bcb",
                                    "ysb_sub_element_name": "tidak menimpakan keburukan kepada saudara muslim lainnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:36:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "54f4abef-ebb8-4bd7-9ee6-069d91a77c7c",
                                    "ysb_sub_element_id": "8dd1644b-cda2-47e5-b640-56499d83315e",
                                    "ysb_sub_element_name": "bersikap rendah hati dan tidak sombong",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:36:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8148e444-13d4-4a72-8820-41f15dc51b2c",
                                    "ysb_sub_element_id": "cf204b6b-758e-42d1-b7ee-896859cf6cfa",
                                    "ysb_sub_element_name": "tidak menggunjing/ tidak menghina/ tidak mencaci",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:36:57.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "38e3e76e-bbdf-4e77-9c9b-6e1ed7ec68ae",
                    "ysb_dimensi_id": "2cd455e2-bd36-4cac-9a4f-029483c8ac9c",
                    "name_element": "Element 6.7",
                    "description": "Adab terhadap sesama manusia",
                    "created_at": "2025-11-19T03:00:39.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "1cb3805d-181a-4591-9f10-a82f59334135",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "38e3e76e-bbdf-4e77-9c9b-6e1ed7ec68ae",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "76c0f172-3954-483f-9fad-cb09a66a7277",
                                    "ysb_sub_element_id": "e9a0f348-0505-41f0-bd28-47dac7c83158",
                                    "ysb_sub_element_name": "memilih teman bergaul dan teman duduk",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1cb3805d-181a-4591-9f10-a82f59334135",
                                    "ysb_sub_element_id": "ec429f27-7c0d-49f6-a432-b8364e1202b9",
                                    "ysb_sub_element_name": "mencintai karena Allah SWT",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:40.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a525e192-18af-4848-8e30-dabe3a5b46a5",
                                    "ysb_sub_element_id": "db257800-cada-4d1b-bc1d-7eff0a2d96e7",
                                    "ysb_sub_element_name": "menampakkan senyum, bersikap lembut dan kasih sayang kepada sesama saudara\nse-Iman",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ad8c05ac-fc9b-4948-ab83-c798b9ea2a2f",
                                    "ysb_sub_element_id": "62fa6df4-229d-46d0-8f9f-283d0e3e2d10",
                                    "ysb_sub_element_name": "disunnahkan memberi nasihat dan hal itu termasuk kesempurnaan persaudaraan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:37:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "91a91479-ac3d-48a4-999a-757f9918f1e2",
                                    "ysb_sub_element_id": "355598ea-b1fa-402e-804d-4010d9a9db38",
                                    "ysb_sub_element_name": "saling tolong menolong antar sesama",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:38:08.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d6a02fef-ab77-4376-abf7-2cad9f271a9b",
                                    "ysb_sub_element_id": "b1581f53-13df-48ea-903d-6a28d61140d3",
                                    "ysb_sub_element_name": "sesama saudara semestinya saling merendahkan diri diantara mereka dan tidak sombong atau meremehkan yang lain",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:38:18.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6cd32b6a-f36c-4d7d-84bc-0c76fe2badc1",
                                    "ysb_sub_element_id": "1cf03ed6-6a48-4927-93ab-e555686d9602",
                                    "ysb_sub_element_name": "berakhlak yang terpuji",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:38:42.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4296f3de-2c70-40a8-9544-29595e9d068b",
                                    "ysb_sub_element_id": "a87c17f0-19bb-4aa6-8f6d-60bca1e2264b",
                                    "ysb_sub_element_name": "hati yang selamat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f6c96f43-4e8d-4342-82ce-3feb855b3da2",
                                    "ysb_sub_element_id": "640d4ac7-2cdd-4d32-be90-b2d93ac01a3e",
                                    "ysb_sub_element_name": "berbaik sangka kepada saudara dan tidak memata-matai mereka",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2bbbb5b9-ee36-4ad2-886f-d0e93be0f2fc",
                                    "ysb_sub_element_id": "27cc875d-18d4-42b0-80e2-cf8131cb758f",
                                    "ysb_sub_element_name": "memaafkan kesalahan dan menahan marah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:43:52.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e5ecf3b-18b2-47eb-a755-aacfcc034596",
                                    "ysb_sub_element_id": "dc266f1b-cb1c-4183-aeda-296502a62a5c",
                                    "ysb_sub_element_name": "larangan saling hasad dan saling membenci dan memboikot",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ec6c5e93-8fc0-4591-a13b-6f31a918932d",
                                    "ysb_sub_element_id": "6bae42a0-e40e-4224-9293-570f68a459b8",
                                    "ysb_sub_element_name": "larangan panggil memanggil dengan gelar-gelar yang buruk",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:18.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "aa55cf77-65ee-4767-9d26-87665557022a",
                                    "ysb_sub_element_id": "3bc7b7fe-74e7-4c4a-a3a4-0309990dab77",
                                    "ysb_sub_element_name": "disenangi mengadakan ishlah (perbaikan) antar sesama saudara",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e18a5a0b-a717-4d3f-bb08-d427f67f519a",
                                    "ysb_sub_element_id": "d7aef856-b7f8-4cb0-b989-5d8a4420a707",
                                    "ysb_sub_element_name": "keharaman mengungkit-ungkit pemberian",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:44:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3dbfe1b6-8d7b-4450-84f7-d3f45ae6eef4",
                                    "ysb_sub_element_id": "ac2e87d9-d6be-4753-ae95-43d3e1465c47",
                                    "ysb_sub_element_name": "menjaga rahasia dan tidak menyebarluaskannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "de1dcdf5-eef9-4ee9-b70e-4be4a393f4fa",
                                    "ysb_sub_element_id": "6e03741f-1227-4da3-80d5-58d1df24001f",
                                    "ysb_sub_element_name": "celaan kepada seseorang yang bermuka dua",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:17.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "a6fdf00e-e08b-4f14-bd21-7f47a27ed30d",
            "name_dimensi": "Adab Terhadap Lingkungan",
            "slug_name": "adab_terhadap_lingkungan",
            "created_at": "2025-10-21T09:15:47.000000Z",
            "data_element": [
                {
                    "id": "c484cb62-e3df-4954-8eb7-6ec1d0aad74d",
                    "ysb_dimensi_id": "a6fdf00e-e08b-4f14-bd21-7f47a27ed30d",
                    "name_element": "Element 7.1",
                    "description": "Adab terhadap tumbuhan",
                    "created_at": "2025-11-19T03:00:40.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "27834d72-df6c-4d87-bf3e-d018c1b0884c",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "c484cb62-e3df-4954-8eb7-6ec1d0aad74d",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "27834d72-df6c-4d87-bf3e-d018c1b0884c",
                                    "ysb_sub_element_id": "bbe24c52-6eb5-4f1d-87f3-0b05ae1f13b0",
                                    "ysb_sub_element_name": "Tidak merusak dan menebang pohon sembarangan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "82850a59-2b74-435e-9f5e-cc3458bae74a",
                                    "ysb_sub_element_id": "63af9772-2d70-4662-a86f-caafcc8baaa1",
                                    "ysb_sub_element_name": "Tidak buang hajat dibawah pohon berbuah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8b87ab16-d8dd-4710-b03e-cb78bbf4f045",
                                    "ysb_sub_element_id": "e0eb3117-dc6b-4d65-b790-3233d0456a73",
                                    "ysb_sub_element_name": "Membayar zakat hasil tanaman",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:45:59.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b05e8338-7b4c-476f-9a21-5cb73b6b56bb",
                    "ysb_dimensi_id": "a6fdf00e-e08b-4f14-bd21-7f47a27ed30d",
                    "name_element": "Element 7.2",
                    "description": "Adab terhadap hewan",
                    "created_at": "2025-11-19T03:00:41.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "2c7f4479-2f07-40a5-ab75-3521c068f516",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "b05e8338-7b4c-476f-9a21-5cb73b6b56bb",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "9effd109-926b-433b-80be-f65181c69400",
                                    "ysb_sub_element_id": "185252af-b119-40d3-8ffa-b1cdcb596da4",
                                    "ysb_sub_element_name": "Memberi makan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:26.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4a044cdb-8d4c-4a0c-8593-fd441a94245f",
                                    "ysb_sub_element_id": "999c36cc-c1b8-451a-a8ab-9da7f1c13f2e",
                                    "ysb_sub_element_name": "Menyayangi dan memberikan kasih sayang kepadanya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a29e3e4a-e8b9-4bf7-8845-d2f5421a1881",
                                    "ysb_sub_element_id": "7984c7f9-d730-4a92-a0b4-3db26e1f9e8d",
                                    "ysb_sub_element_name": "Menyenangkannya di saat menyembelih",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:44.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a7ced40c-a522-4f5f-b36d-6d764935df0c",
                                    "ysb_sub_element_id": "3064ba94-f35f-43fa-a66c-5f0e835fd3e8",
                                    "ysb_sub_element_name": "Tidak menyiksanya dengan cara penyiksaan apapun",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:46:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2c7f4479-2f07-40a5-ab75-3521c068f516",
                                    "ysb_sub_element_id": "f921dbdf-0b5e-4906-a1c8-83dfa66fa89e",
                                    "ysb_sub_element_name": "Boleh membunuh hewan yang mengganggu, seperti anjing buas, serigala, ular, kalajengking, tikus dan lain-lainnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:47:19.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "0fe4dc11-5785-46e5-b356-d7ba87daa240",
                    "ysb_dimensi_id": "a6fdf00e-e08b-4f14-bd21-7f47a27ed30d",
                    "name_element": "Element 7.3",
                    "description": "Adab terhadap lingkungan",
                    "created_at": "2025-11-19T03:00:42.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "7557148e-7b42-4146-86b2-e626a26d4f93",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "0fe4dc11-5785-46e5-b356-d7ba87daa240",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "7557148e-7b42-4146-86b2-e626a26d4f93",
                                    "ysb_sub_element_id": "db5a6e84-625f-45a6-aed0-12c0bf3663a3",
                                    "ysb_sub_element_name": "Syafaqah : perasaan halus dan rasa belas kasih untuk berbuat baik kepada sesama makhluk",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fd4958c9-5596-4d56-ba18-95a017d413e6",
                                    "ysb_sub_element_id": "bf3f1d6e-2ee1-4194-8a3d-be1d4325545a",
                                    "ysb_sub_element_name": "Himayah (Pemeliharaan); Memelihara dan menjaga Lingkungan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:49:46.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": "88600e00-c9de-4288-97ed-48572635c8b0",
            "name_dimensi": "Adab Terhadap Aktifitas Keseharian",
            "slug_name": "adab_terhadap_aktifitas_keseharian",
            "created_at": "2025-10-21T09:15:48.000000Z",
            "data_element": [
                {
                    "id": "31e2ca75-5888-4457-8ed9-2d81a8021161",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.1",
                    "description": "Adab makan & minum",
                    "created_at": "2025-11-19T03:00:43.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "38dba24e-477a-452b-9b32-aa8a067037b5",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "31e2ca75-5888-4457-8ed9-2d81a8021161",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "518534ff-a49f-4500-a704-77b598919660",
                                    "ysb_sub_element_id": "be604a11-74c6-4388-bc91-0c2358abf964",
                                    "ysb_sub_element_name": "Memilih makanan dan minuman yang halal",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:34.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "815179eb-ab3c-4d14-9c09-e43c060073e0",
                                    "ysb_sub_element_id": "5167474e-c1a8-4291-9869-fc1b5e0b9ca4",
                                    "ysb_sub_element_name": "Meniatkan tujuan dalam makan dan minum untuk menguatkan badan, agar dapat melakukan ibadah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:51:47.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d3de25ff-e608-4d7d-ac74-c26c4eb8c53c",
                                    "ysb_sub_element_id": "7bb71718-0b1e-4951-bacb-1dbcbd36db57",
                                    "ysb_sub_element_name": "Mencuci kedua tangannya sebelum makan, jika dalam keadaan kotor atau ketika belum yakin dengan kebersihan keduanya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "38dba24e-477a-452b-9b32-aa8a067037b5",
                                    "ysb_sub_element_id": "133c5290-b214-40ad-9607-4ab1d38b67ac",
                                    "ysb_sub_element_name": "Meletakkan hidangan makanan pada sufrah (alas yang biasa dipakai untuk meletakkan makanan) yang digelar di atas lantai, tidak diletakkan di atas meja makan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "626655ea-6384-45a2-af8c-5a8458f02b6c",
                                    "ysb_sub_element_id": "3160380a-90e6-490a-99bb-b1edbb6ee1f3",
                                    "ysb_sub_element_name": "Duduk dengan tawadhu’, yaitu duduk di atas kedua lututnya atau duduk di atas punggung kedua kaki atau berposisi dengan kaki kanan ditegakkan dan duduk di atas kaki kiri",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "43e20c06-f819-408a-9a18-1a6047ed2a0b",
                                    "ysb_sub_element_id": "faf40d84-481a-4e6a-b964-a3a9193b0a98",
                                    "ysb_sub_element_name": "Hendaknya merasa ridha dengan makanan apa saja yang telah terhidangkan dan tidak mencela-nya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3ee19e27-464d-4e21-9ae5-b92fb1d37d79",
                                    "ysb_sub_element_id": "db9a2afb-9f24-4cc9-9920-a60095bfc034",
                                    "ysb_sub_element_name": "Hendaknya makan bersama-sama dengan orang lain, baik tamu, keluarga, kerabat, anak-anak atau pembantu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T01:52:57.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "520bbcdd-bcb5-432d-829b-b19516ba9571",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.10",
                    "description": "Adab Takziah",
                    "created_at": "2025-11-19T03:00:44.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "17e0de20-0b6b-4b26-b275-00a369ca8fe9",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "520bbcdd-bcb5-432d-829b-b19516ba9571",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "e45d8088-34b6-4904-829b-c4a38ccdc99a",
                                    "ysb_sub_element_id": "4c09c8ae-3d8b-4032-949c-252016dc557e",
                                    "ysb_sub_element_name": "Takziah dilakukan dengan ikhlas untuk mengharapkan rida Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:25.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e7dc253-2df1-4ca2-820a-199d54b73ed0",
                                    "ysb_sub_element_id": "ade8ff26-4c26-4231-9496-60c5ee0f18e0",
                                    "ysb_sub_element_name": "Berpakaian sopan dan menutup aurat.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:37.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "17e0de20-0b6b-4b26-b275-00a369ca8fe9",
                                    "ysb_sub_element_id": "af5aa72f-4ea2-4635-90a8-c02116d19b5d",
                                    "ysb_sub_element_name": "Bertingkah laku dan berperilaku sopan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5b4d4e48-98e2-48ae-8d5e-da34f75061ee",
                                    "ysb_sub_element_id": "cbbe05ee-2195-4ac1-b401-f03d2ab2bb04",
                                    "ysb_sub_element_name": "Memberi bantuan kepada keluarga jenazah, baik bantuan moril maupun materil.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "71153cbd-3141-4816-b9fa-73c1de05f929",
                                    "ysb_sub_element_id": "eeb2ca6d-10a2-4e6f-b59c-327dd0fc926f",
                                    "ysb_sub_element_name": "Memberikan nasihat kepada keluarga jenazah agar tabah, sabar dan meningkatkan iman kepada Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "227d1b86-a3f6-4a52-a583-897d7af48c77",
                                    "ysb_sub_element_id": "ebdefcab-fb87-4b49-b199-15b5e0713b74",
                                    "ysb_sub_element_name": "Mengikuti salat jenazah dan medoakannya agar mendapatkan ampunan dari Allah SWT dari segala dosanya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:26.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3c2be1f6-92f7-40be-b33b-46a956f30754",
                                    "ysb_sub_element_id": "a61a21ba-4dbc-473a-b772-acc492d0628e",
                                    "ysb_sub_element_name": "Ikut mengantarkan jenazah ke tempat pemakaman\tuntuk menyaksikan penguburannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:40.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "32d65a43-57e6-416f-96e2-f0d0f78869eb",
                                    "ysb_sub_element_id": "89d480e4-c374-43fa-8021-c6a86afc3418",
                                    "ysb_sub_element_name": "Medoakan jenazah agar amal baiknya diterima dan dosanya di ampuni Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:52.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "26bb9672-9b2e-4ab3-bf80-4f1b05313d2c",
                                    "ysb_sub_element_id": "f2bb4f3e-3b33-448b-9b48-7d97245249b5",
                                    "ysb_sub_element_name": "Memberi bantuan baik materi maupun moril.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:22:05.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3b9d9cce-662e-42a6-ab1a-2ed1b5b010c7",
                                    "ysb_sub_element_id": "fdc03c2d-754e-46bd-b87f-31372e37fbe8",
                                    "ysb_sub_element_name": "Tidak bercanda atau berkata keras.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:22:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7621abaa-8bcf-482b-b3e1-0d50aea62664",
                                    "ysb_sub_element_id": "bfa95b2c-3ce3-43fd-bc36-e2125faabd32",
                                    "ysb_sub_element_name": "Tidak mengungkit –ungkit keburukan jenazah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:22:27.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b5f910fe-eedb-4619-ac14-9b037db3e0c9",
                                    "ysb_sub_element_id": "f937b6aa-da22-480d-b49e-fc83317ccc6d",
                                    "ysb_sub_element_name": "Mengantar jenazah sampai ke tempat pemakaman.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:22:38.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b45a5c5b-22a3-4f40-a9f6-0281e654a1e0",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.11",
                    "description": "Adab Jual beli",
                    "created_at": "2025-11-19T03:00:45.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "2606e72e-6947-4d13-871e-9dd5feac5b77",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "b45a5c5b-22a3-4f40-a9f6-0281e654a1e0",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "2606e72e-6947-4d13-871e-9dd5feac5b77",
                                    "ysb_sub_element_id": "79e1ad24-2b3e-4749-9d1e-b0230afd72f3",
                                    "ysb_sub_element_name": "tidak menjual sesuatu yang haram.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:08.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "be5c5330-6088-47a8-a72f-490f55e03f16",
                                    "ysb_sub_element_id": "64361eb3-cff3-4217-94ef-207d05fd336c",
                                    "ysb_sub_element_name": "tidak melakukan sistem perdagangan terlarang.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "370c4fec-1c38-4e18-8e87-82cbd419f4b5",
                                    "ysb_sub_element_id": "153a310f-671f-4693-bb94-55ec40666226",
                                    "ysb_sub_element_name": "tidak terlalu banyak mengambil untung.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a26471b1-058c-4bec-8c86-3b557ce053e3",
                                    "ysb_sub_element_id": "27f5c3c6-b5d7-4b28-8b3a-385b2a30d8ad",
                                    "ysb_sub_element_name": "tidak membiasakan bersumpah ketika menjual dagangan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e21e7704-bc54-4d7e-aa03-4af73c39aa8d",
                                    "ysb_sub_element_id": "002428a1-a6d8-4c53-9ab1-1ff165244f8b",
                                    "ysb_sub_element_name": "tidak berbohong ketika berdagang.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "32fcb7a1-e340-4c24-9376-e1a7ec6e0a93",
                                    "ysb_sub_element_id": "09dc7eb8-7329-4b1c-9fcd-a21053185c48",
                                    "ysb_sub_element_name": "penjual harus melebihkan timbangan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:27.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d48a37b9-7b6d-4070-8f8e-176b3ec07888",
                                    "ysb_sub_element_id": "25f4c7b8-5fb8-41c7-9be2-8d7ba1a9bd8c",
                                    "ysb_sub_element_name": "pemaaf, mempermudah, dan lemah lembut dalam berjual beli.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:56.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ffffac2b-f90a-4235-9593-7cd1d31ba88c",
                                    "ysb_sub_element_id": "5a62a232-dbca-450b-be24-29260a860c63",
                                    "ysb_sub_element_name": "menjauhkan sebab-sebab munculnya permusuhan dan dendam.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "36c663cb-9c72-497d-9cd0-4ea21985ee6c",
                                    "ysb_sub_element_id": "ab82c74b-6224-4e1a-84f2-34198fcb776d",
                                    "ysb_sub_element_name": "penjual dan pembeli boleh menentukan pilihan selama mereka belum berpisah kecuali jual beli khiyaar.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "64c51cbe-dcba-438b-8ff0-eb5e35e30dd9",
                                    "ysb_sub_element_id": "35c1b32e-d413-44ed-8366-881f70aaf07d",
                                    "ysb_sub_element_name": "tidak boleh menimbun atau memonopoli barang dagangan tertentu.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:43.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b3c99a4d-6f83-451e-ba77-49e3f9859289",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.12",
                    "description": "Adab belajar",
                    "created_at": "2025-11-19T03:00:46.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "4d1fbb0e-d4de-418a-88d0-076760e31a3f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "b3c99a4d-6f83-451e-ba77-49e3f9859289",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "b939c125-1c5d-4439-b409-b99a842b277a",
                                    "ysb_sub_element_id": "d172d86b-bf49-4502-ad46-b4a008519c6f",
                                    "ysb_sub_element_name": "meneguhkan niat yang ikhlas karena semata-mata mengharap ridha Allah Swt Swt, agar ilmu yang diperoleh membuahkan keberkahan dan memberi manfaat bagi orang lain.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6d73e08c-5e17-4359-afcd-46bbae0cecd8",
                                    "ysb_sub_element_id": "fc6e5395-e450-426d-b758-83497e6130d7",
                                    "ysb_sub_element_name": "belajar harus jauh dari perbuatan maksiat agar apa yang dimuridi menjadi “cahaya” yang dapat menerangi jalan hidup si pembelajar.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bb96df4c-764a-47c9-bb21-9df24bbce0c7",
                                    "ysb_sub_element_id": "87bef99e-48a8-4fac-a1f6-3f68d2d5bcd3",
                                    "ysb_sub_element_name": "murid juga harus senantiasa berperilaku yang baik (husnul adab), rajin, tekun, rendah hati, dan selalu mengamalkan ilmunya. “Ilmu yang tidak diamalkan itu bagaikan pohon yang tidak berbuah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:05.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d3156aca-a357-4dbc-82db-d9ca6359382c",
                                    "ysb_sub_element_id": "69339535-5387-4c62-bdd0-ab3feb8ef112",
                                    "ysb_sub_element_name": "memerlukan kerja ikhlas, keras, dan cerdas.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:18.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b0b99422-f0f7-448e-b4cd-b35ae00b4240",
                                    "ysb_sub_element_id": "9e1d77ed-1e31-4976-b3a4-5f9a27761f9f",
                                    "ysb_sub_element_name": "kecerdasan, antusiasme (kesungguhan), ke sabaran, bekal yang cukup, bimbingan guru, dan waktu yang lama.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4d1fbb0e-d4de-418a-88d0-076760e31a3f",
                                    "ysb_sub_element_id": "d2d8ff32-120a-4e9e-af3e-987dd82fc82d",
                                    "ysb_sub_element_name": "berusaha mengembangkan pemikiran, pengetahuan, kepribadian, moralitas, dan profesionalitas.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fc4c20ff-cc1b-4a27-85bc-f95d614138ca",
                                    "ysb_sub_element_id": "d41db5f8-0105-4283-8dcc-a046e3deb86d",
                                    "ysb_sub_element_name": "belajar itu harus dimulai dengan thaharah (pembersihan diri) dan berwudhu agar terhindar dari godaan setan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:59.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a6c4e686-d41a-40c5-a280-2f02704a193f",
                                    "ysb_sub_element_id": "50e04948-b558-471c-a29c-9758cc878573",
                                    "ysb_sub_element_name": "menghormati guru dan ulama.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:16:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "951c8697-3d56-4091-8238-8794d02cb457",
                                    "ysb_sub_element_id": "203e4ed3-78c1-4dc7-a2cf-d681538062a9",
                                    "ysb_sub_element_name": "murid juga dianjurkan untuk berlapang dada (toleran) dalam menghadapi perbedaan pendapat dan pemikiran.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:16:32.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "da2b9fd6-1c06-4ef1-b686-c974a807ab1b",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.13",
                    "description": "Adab berpakaian",
                    "created_at": "2025-11-19T03:00:47.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "19413cee-c665-478d-abb6-84dc1aca04b7",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "da2b9fd6-1c06-4ef1-b686-c974a807ab1b",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "1982d2c7-8a6d-4ebf-b5c0-1c20e37787ac",
                                    "ysb_sub_element_id": "a32cab65-85c5-4a52-983a-76464da8e0fe",
                                    "ysb_sub_element_name": "Tidak berpakaian dari bahan sutra.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:09:50.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "54e76f2f-2645-40a9-80bc-ab40c6c10db7",
                                    "ysb_sub_element_id": "ae4cdb4e-713b-4f07-8f23-24d86a9bd44b",
                                    "ysb_sub_element_name": "Mengenakan baju dan celana tidak melebihi batas dua mata kaki dengan sombong.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:10:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "19f164e8-cea2-4790-ae5d-65c4dbcc955e",
                                    "ysb_sub_element_id": "ba829ebd-17e7-4cf0-a286-e729dc2d0659",
                                    "ysb_sub_element_name": "Memakai pakaian yang berwarna putih.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:10:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6d9b83c7-da30-4329-9f85-53e7b2fcbc64",
                                    "ysb_sub_element_id": "5d385655-e2f7-4d51-a89e-0cc788f23c8b",
                                    "ysb_sub_element_name": "Pakaian perempuan menutupi kedua tumit dan kerudungnya menutupi dada.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:10:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "684ac4bb-f93d-4c87-bf2c-d6470a6df3c9",
                                    "ysb_sub_element_id": "146a93f3-f8dc-4889-a86b-ad5a06e9b339",
                                    "ysb_sub_element_name": "Laki-laki tidak berpakaian yang digunakan\tperempuan dan perempuan tidak memakai pakaian yang digunakan laki-laki.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:11:09.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "886ed294-386a-473a-a655-f2b3efb2a87b",
                                    "ysb_sub_element_id": "0f21fd1d-4ee5-4b4e-a07c-7fa770a07f97",
                                    "ysb_sub_element_name": "Mengenakan sandal atau sepatu dengan mendahulukan kaki kanan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:11:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "78cd7d09-98f1-433a-8e9d-d322e0093040",
                                    "ysb_sub_element_id": "e2bdfd16-df60-4046-b6ae-7bba79da10f8",
                                    "ysb_sub_element_name": "Memakai pakaian dengan mendahulukan anggota tubuh yang paling kanan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:11:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3b7d7f33-aff4-41a0-9243-7b4b378f576a",
                                    "ysb_sub_element_id": "7abed8a1-98df-436e-91bd-34979eded004",
                                    "ysb_sub_element_name": "Membaca doa ketika memiliki pakaian baru.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:12:07.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "19413cee-c665-478d-abb6-84dc1aca04b7",
                                    "ysb_sub_element_id": "da5d00b8-dc1b-4368-98d6-2c7c36a3d2f6",
                                    "ysb_sub_element_name": "Berdoa ketika saudara yang lain memakai baju baru.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:12:24.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "871afa64-6686-427b-aa12-8c40093096bf",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.14",
                    "description": "Adab membersihkan badan",
                    "created_at": "2025-11-19T03:00:48.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "06c33652-0394-434a-8ac6-901094756c19",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "871afa64-6686-427b-aa12-8c40093096bf",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "41328f06-1932-4d8f-a9ba-1df1ee6b887d",
                                    "ysb_sub_element_id": "da4a7ee5-18b5-4c02-b997-e9ba2bf68788",
                                    "ysb_sub_element_name": "mandi",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:07:21.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "12b81f74-0264-4205-857d-7d51baf34b8a",
                                    "ysb_sub_element_id": "beb409a8-d58c-4037-bba1-a2c3e874da28",
                                    "ysb_sub_element_name": "membersihkan dan menyucikan mulut dengan siwak.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:07:35.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "06c33652-0394-434a-8ac6-901094756c19",
                                    "ysb_sub_element_id": "e995f949-e3a3-48d1-bc8e-cb64b80b77f4",
                                    "ysb_sub_element_name": "khitan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:07:47.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8c0bcdf0-8432-47c0-bec6-18043c269a58",
                                    "ysb_sub_element_id": "42060110-050f-4998-b7a8-48b1def278c1",
                                    "ysb_sub_element_name": "mencukur bulu kemaluan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:08:00.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "30083bcd-17f8-4e6c-9bbe-ce3ba7ed9beb",
                                    "ysb_sub_element_id": "4bca3b74-a7f0-413e-9dd1-19409a455e42",
                                    "ysb_sub_element_name": "memotong kumis",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:08:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d7248806-f82e-4691-800d-a38302bd9cb5",
                                    "ysb_sub_element_id": "21b104e8-6599-41a4-9984-c30d0cd20957",
                                    "ysb_sub_element_name": "memotong kuku",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:08:23.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "884a6424-2d65-42d2-8bcb-a8d70b0074fc",
                                    "ysb_sub_element_id": "6bc6c00e-29aa-4448-a089-c08a3c101891",
                                    "ysb_sub_element_name": "mencabut bulu ketiak.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:08:37.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "b1939967-b99e-4b7f-8008-02864c236578",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.2",
                    "description": "Adab tidur",
                    "created_at": "2025-11-19T03:00:49.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "23c0bede-b101-4aa9-9449-a6f40b0c6f4a",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "b1939967-b99e-4b7f-8008-02864c236578",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "cc1042e7-b32e-489f-b646-ab7567f0d4e5",
                                    "ysb_sub_element_id": "fc08235a-925e-4326-9e13-268b70776675",
                                    "ysb_sub_element_name": "Tidak mengakhirkan tidur malam selepas shalat Isya’ kecuali dalam keadaan darurat seperti untuk mengulang (muraja’ah) ilmu atau adanya tamu atau menemani keluarga",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:01:00.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "74b67df8-663e-4f81-9fd5-ebe9ade16baf",
                                    "ysb_sub_element_id": "e552df83-e7fe-4b4a-8795-c633160bfd3f",
                                    "ysb_sub_element_name": "Hendaknya tidur dalam keadaan sudah berwudhu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:01:19.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d9f7f84b-3bad-4c22-8cf3-0912966da840",
                                    "ysb_sub_element_id": "5220d8d3-e8f9-4a8b-b400-d3c06f192a66",
                                    "ysb_sub_element_name": "Hendaknya mendahulukan posisi tidur di atas sisi sebelah kanan (rusuk kanan sebagai tumpuan) dan berbantal dengan tangan kanan, tidak mengapa apabila setelahnya berubah posisinya di atas sisi kiri (rusuk kiri sebagai tumpuan)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:01:44.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "dbcfdb1b-a3f4-400a-ad54-3de9ab7ab7e1",
                                    "ysb_sub_element_id": "56a8d6aa-a787-4bb9-8ee8-52b4a01c414c",
                                    "ysb_sub_element_name": "Tidak dibenarkan telungkup dengan posisi perut sebagai tumpuannya baik ketika tidur malam ataupun tidur siang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:01:58.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b0091e63-4d73-406b-80fc-e04c44beda00",
                                    "ysb_sub_element_id": "e22abb28-fe43-4d6b-8ae0-d18b3d4b85e0",
                                    "ysb_sub_element_name": "Membaca ayat kursi",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "23c0bede-b101-4aa9-9449-a6f40b0c6f4a",
                                    "ysb_sub_element_id": "ad6bb16b-baa6-41db-9429-7533185bda13",
                                    "ysb_sub_element_name": "Membaca dua ayat terakhir dari surat al-Baqarah: 285-286",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:02:52.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5ce6370d-4a50-450a-8dd1-4690224193be",
                                    "ysb_sub_element_id": "64db0b1b-1f1f-4cac-82cf-58b0145f415a",
                                    "ysb_sub_element_name": "Membaca Qul Huwallaahu Ahad, Qul a’uudzu bi Rabbil falaq dan Qul a’uudzu bi Rabbin naas",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5ef8f231-7a37-44dc-b737-d8328d12f4d9",
                                    "ysb_sub_element_id": "6b60aec9-1780-4910-87cd-6490aaec6474",
                                    "ysb_sub_element_name": "Mengakhiri berbagai do’a tidur dengan do’a",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7a1d8348-e76b-4cce-9a72-ddcd0dd3039e",
                                    "ysb_sub_element_id": "e7f2707a-50e9-4878-aca3-303ef7765791",
                                    "ysb_sub_element_name": "Disunnahkan apabila hendak membalikkan tubuh (dari satu sisi ke sisi yang lain) mengucapkan doa",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "96144007-c972-41e4-9133-3a76680bbd0d",
                                    "ysb_sub_element_id": "3b5ae1fb-aa73-44bd-9bd6-3aebbef46fca",
                                    "ysb_sub_element_name": "Apabila merasa gelisah, risau, merasa takut ketika tidur malam atau merasa kesepian maka dianjurkan sekali baginya untuk berdo’a",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:37.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "27d8bd00-c0c9-4b12-8876-af0be7841145",
                                    "ysb_sub_element_id": "9c5b616e-80ba-465e-9c91-e2d766240a31",
                                    "ysb_sub_element_name": "Memakai celak mata ketika hendak tidur",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:03:55.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "73879299-5f6f-46c8-abc5-33eef1ac985e",
                                    "ysb_sub_element_id": "2789eab7-7a6e-4138-9930-1618fa5ab288",
                                    "ysb_sub_element_name": "Hendaknya mengibaskan tempat tidur (membersihkan tempat)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:04:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4a797946-17ca-4ad8-8e74-d2b0f3bd9083",
                                    "ysb_sub_element_id": "d89f2f14-3420-4eb6-b001-207fa45a18f5",
                                    "ysb_sub_element_name": "Jika sudah bangun tidur hendaknya membaca do’a sebelum berdiri dari tempat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:06:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4e1acd71-25ab-458c-812f-b83ace0c3ba8",
                                    "ysb_sub_element_id": "3314df95-f79c-4caa-9c97-60afbca9a8c3",
                                    "ysb_sub_element_name": "Hendaknya menyucikan hati dari setiap dengki yang (mungkin timbul) pada saudaranya sesama muslim dan membersihkan dadanya dari setiap kemarahannya kepada manusia lainnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:06:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2ce7140e-8171-4fbe-9907-259f5811aafd",
                                    "ysb_sub_element_id": "2895b4b7-7795-4b76-98e9-617b1c1b7dcb",
                                    "ysb_sub_element_name": "Hendaknya senantiasa menghisab (mengevaluasi) diri dan melihat (merenungkan) kembali amalan-amalan dan perkataan perkataan yang pernah diucapkan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:07:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e18bce0-0ec5-49c4-a59d-fe8cb1ffc2b0",
                                    "ysb_sub_element_id": "db9701a3-b1c9-4271-8648-ed8599f39b00",
                                    "ysb_sub_element_name": "Hendaknya bersegera bertaubat dari seluruh dosa yang dilakukan dan memohon ampun kepada Allah Swtdari setiap dosa yang dilakukan pada hari itu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:07:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d3190ddf-17ed-4320-a14c-12592fe165f3",
                                    "ysb_sub_element_id": "9f99c529-09f0-44f0-91b5-08c0af36a9c7",
                                    "ysb_sub_element_name": "Mengusap bekas tidur yang ada di wajah maupun tangan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:08:55.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4dd8ef9c-e6bd-4769-9bc3-3ed6bc089ab4",
                                    "ysb_sub_element_id": "59a5b8be-d742-4b7f-bd2a-bb1d87e7ae00",
                                    "ysb_sub_element_name": "Bersiwak",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:09:06.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c6f45540-c1b0-4058-9a16-95e722348b54",
                                    "ysb_sub_element_id": "116db54f-586f-4d71-ad2b-5747a29b6772",
                                    "ysb_sub_element_name": "Beristintsaar (mengeluarkan atau menyemburkan air dari hidung sesudah menghirupnya)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:09:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "49395b72-dbed-41de-97af-4d1bda0a2357",
                                    "ysb_sub_element_id": "de255601-2faa-4651-99d8-f5c90f9160dd",
                                    "ysb_sub_element_name": "Mencuci kedua tangan tiga kali",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:09:44.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "917e4468-f051-4a82-9bc1-9fd206bdf367",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.3",
                    "description": "Adab berbicara",
                    "created_at": "2025-11-19T03:00:50.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "07f5d40b-fc2f-4810-9d2c-556766701408",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "917e4468-f051-4a82-9bc1-9fd206bdf367",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "07f5d40b-fc2f-4810-9d2c-556766701408",
                                    "ysb_sub_element_id": "c146ca9c-55ea-400f-96cb-d84e135203e6",
                                    "ysb_sub_element_name": "berkata baik atau diam",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:12:00.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fba2bc36-ff9b-4aa5-9506-9fe6860dc6d8",
                                    "ysb_sub_element_id": "19b3f1fe-d5dd-4d1e-b335-95e5bbf253c0",
                                    "ysb_sub_element_name": "sedikit bicara lebih utama",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:12:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b95b0f91-193e-4f78-ad7c-4b4cde5f0b02",
                                    "ysb_sub_element_id": "915dca64-251f-4a89-95eb-05d55a1ece07",
                                    "ysb_sub_element_name": "dilarang membicarakan setiap yang didengar",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:12:19.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "45bab5a5-e803-47cd-837a-190c2dcb4e36",
                                    "ysb_sub_element_id": "68894f20-1faa-4a9c-b6c0-72fcda697589",
                                    "ysb_sub_element_name": "jangan mengutuk dan berbicara kotor",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7a1c8e5e-8182-4609-9f44-d8175f4f4ba5",
                                    "ysb_sub_element_id": "9bf74f47-d998-4c3e-a522-bcab722d9074",
                                    "ysb_sub_element_name": "jangan senang berdebat meski benar",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:38.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f8b9d6f9-2edb-4ec7-a459-cba6129861c5",
                                    "ysb_sub_element_id": "7ec9c193-adfd-4bb5-b029-ee4d38014259",
                                    "ysb_sub_element_name": "dilarang berdusta untuk membuat Orang Tertawa",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:44.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "233adac0-7ac6-4ac7-b129-ca01eece1761",
                                    "ysb_sub_element_id": "36cb5c57-697e-4396-b410-43ce6d054718",
                                    "ysb_sub_element_name": "hendaknya berbicara dengan suara yang dapat didengar, tidak terlalu keras dan tidak pula terlalu rendah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:14:56.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "f9fcd188-513a-4325-a7f9-6f5e5706a379",
                                    "ysb_sub_element_id": "ac94316c-4538-4227-8043-34ffd4f68d66",
                                    "ysb_sub_element_name": "Jangan membicarakan sesuatu yang tidak berguna",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "31b7bf49-3100-473e-916d-634ba2a84207",
                                    "ysb_sub_element_id": "dad55fbe-d6ba-4251-bade-db2b4e3a3704",
                                    "ysb_sub_element_name": "Tenang dalam berbicara dan tidak tergesa-gesa",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "eaf763a4-46fe-40a0-bc0d-9bb018feaafb",
                                    "ysb_sub_element_id": "b9a3303d-6359-496a-958f-3b38e69b5aaa",
                                    "ysb_sub_element_name": "Menghindari perbuatan menggunjing (ghibah) dan mengadu domba",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:15:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3594e73d-78a8-4931-a0e5-32b27e60ea12",
                                    "ysb_sub_element_id": "6a9dcfb8-3a17-4c40-b946-23cb6fc61d06",
                                    "ysb_sub_element_name": "Mendengarkan pembicaraan orang lain dengan baik dan tidak memotongnya, juga tidak menampakkan bahwa kamu mengetahui apa yang dibicarakannya, tidak mengganggap rendah pendapatnya atau mendustakannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:16:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4627b3f7-418d-4f21-940b-4b157429c914",
                                    "ysb_sub_element_id": "883214ce-56a2-4d3d-9ec4-e4e82fa681c7",
                                    "ysb_sub_element_name": "Menghindari perkataan kasar, keras, dan ucapan yang menyakitkan perasaan, dan tidak mencari-cari kesalahan pembicaraan orang lain dan kekeliruannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:16:25.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "d384d4ac-5ac1-4958-ab04-815174a85374",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.4",
                    "description": "Adab berjalan",
                    "created_at": "2025-11-19T03:00:51.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "064cc1eb-8c74-4a1e-b2c4-a3a38be75903",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "d384d4ac-5ac1-4958-ab04-815174a85374",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "7c9af891-b8cf-4ead-b697-54026e1b2191",
                                    "ysb_sub_element_id": "296b2c68-316b-47d1-af83-2136d4f3b378",
                                    "ysb_sub_element_name": "bersikap tawadhu dan tidak sombong dalan berjalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "adf1e5c2-4fbf-47ec-aa39-91a2b8f1fd7f",
                                    "ysb_sub_element_id": "8ab5bab4-58f8-4771-b5c1-6080fdbcac6f",
                                    "ysb_sub_element_name": "tidak berjalan dengan memakai satu sandal",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:09.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bc8b52f5-2896-4a20-87cb-2e4a4b6fe912",
                                    "ysb_sub_element_id": "95f4eafc-e359-430d-ad80-c6d5d284a091",
                                    "ysb_sub_element_name": "sesekali bertelanjang kaki dalam berjalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "25b884dd-cea0-44aa-9dd3-a77ce98d1481",
                                    "ysb_sub_element_id": "a59a50ae-2c5f-4cf3-a8f7-4325b608c846",
                                    "ysb_sub_element_name": "melakukan cara jalan yang baik dan meninggalkan cara jalan yang tidak baik",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ced164be-e6a1-4bf5-9111-1caefd983383",
                                    "ysb_sub_element_id": "dd347095-2c8c-4258-a920-62bbbfdfb529",
                                    "ysb_sub_element_name": "berjalan dengan cepat, tenang, dan baik",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:33.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b9282b73-21ac-4979-9501-9d4cf1770acc",
                                    "ysb_sub_element_id": "abc3635b-1f15-45b5-95b3-cd915486775d",
                                    "ysb_sub_element_name": "berjalan tegak dan tidak membungkuk",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:42.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "064cc1eb-8c74-4a1e-b2c4-a3a38be75903",
                                    "ysb_sub_element_id": "e52927d4-0f6e-429c-9145-a124ab896257",
                                    "ysb_sub_element_name": "memosisikan badan condong ke depan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:17:50.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "488ecafd-038f-4f69-bb0d-bbaec7ed40c4",
                                    "ysb_sub_element_id": "d95ca4e4-fd60-47cd-8a31-acdcc866c728",
                                    "ysb_sub_element_name": "tidak banyak menoleh ke kanan dan ke kiri ketika berjalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:01.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6ea5a54b-0b18-41d2-b288-d5d82f65f5b9",
                                    "ysb_sub_element_id": "4700d5e5-52fe-40a8-8d1f-c038931b0d48",
                                    "ysb_sub_element_name": "tidak bersikap lemah ketika berjalan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "62003764-6ee6-45b2-a9da-03b8f5641657",
                                    "ysb_sub_element_id": "c7575242-da4d-437d-b60f-5a7f87ef6288",
                                    "ysb_sub_element_name": "tidak berjalan meniru cara berjalan lawan jenis",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:18:35.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "e12feb53-945a-4640-b4c9-2980e2481ddc",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.5",
                    "description": "Adab duduk di Majlis",
                    "created_at": "2025-11-19T03:00:52.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0268206b-7c00-4cc7-8e23-6f787dbe2fe5",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "e12feb53-945a-4640-b4c9-2980e2481ddc",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "1014f416-bed1-4033-8aec-da2ccab0a6cf",
                                    "ysb_sub_element_id": "d5318a51-b274-4327-8e5d-86876335f567",
                                    "ysb_sub_element_name": "ikhlas",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:30.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "609c60bc-ab94-46f5-a31a-695cfd45138e",
                                    "ysb_sub_element_id": "0f7311c1-0b7b-4518-b93f-60c4d6f5508a",
                                    "ysb_sub_element_name": "bersemangat menghadiri majelis ilmu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:39.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fd33a15b-1bd6-480f-b133-6b0e54a72e35",
                                    "ysb_sub_element_id": "11a01849-e377-4c5f-806d-94d495f50c22",
                                    "ysb_sub_element_name": "bersegera datang ke majelis ilmu dan tidak terlambat, bahkan harus mendahuluinya dari selainnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:19:50.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "be2af28e-6de7-4054-9d42-384550f8489f",
                                    "ysb_sub_element_id": "5ebbc079-be8e-4b88-b719-d9d7bc9bd895",
                                    "ysb_sub_element_name": "mencari dan berusaha mendapatkan muridan yang ada di majelis ilmu yang tidak dapat dihadirinya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8164da09-7688-46e5-b492-de8c72040314",
                                    "ysb_sub_element_id": "40f3852c-73bc-4730-b24b-61d0807debef",
                                    "ysb_sub_element_name": "mencatat faidah-faidah yang didapatkan dari kitab",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:15.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "45a7e201-a981-4fc4-b973-f9c8c19fe72f",
                                    "ysb_sub_element_id": "9a8dcfcf-576b-4621-b372-ddafea324d7b",
                                    "ysb_sub_element_name": "tenang dan tidak sibuk sendiri dalam majelis ilmu",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:23.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ce17631c-0378-4c88-b14d-e5d670319f67",
                                    "ysb_sub_element_id": "06622a15-317c-40eb-aa4c-6d4e2ba79176",
                                    "ysb_sub_element_name": "tidak boleh berputus asa",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "18302412-310b-4f2d-b461-21614f96aded",
                                    "ysb_sub_element_id": "2e271c90-47b9-44d9-8d4f-ae772b172aa4",
                                    "ysb_sub_element_name": "jangan memotong pembicaraan guru atau penceramah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:40.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0268206b-7c00-4cc7-8e23-6f787dbe2fe5",
                                    "ysb_sub_element_id": "9a9d123f-3379-4f63-a085-8422f657146d",
                                    "ysb_sub_element_name": "beradab dalam bertanya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:20:53.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "065a359a-fd05-4f26-a38a-9a2affb03647",
                                    "ysb_sub_element_id": "ca88af88-41ca-4d54-8dbd-00005cc1be57",
                                    "ysb_sub_element_name": "bertanya perkara yang tidak diketahuinya dengan tidak bermaksud menguji",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:00.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2d5b6bbd-6c59-4977-8a7c-ca3243e0c4c9",
                                    "ysb_sub_element_id": "d901965c-046c-494f-a5c3-ef222a60d054",
                                    "ysb_sub_element_name": "tidak boleh menanyakan sesuatu yang tidak dibutuhkan, yang jawabannya dapat menyusahkan penanya atau menyebabkan kesulitan bagi kaum muslimin",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "19a18417-0d2b-40bd-b8bc-d3e3072750d4",
                                    "ysb_sub_element_id": "638e31ed-87c0-48e5-91ee-6ffaa8b4f1e2",
                                    "ysb_sub_element_name": "diperbolehkan bertanya kepada seorang ‘alim tentang dalil dan alasan pendapatnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "66805ece-0145-4535-a8cc-78cf510a18b8",
                                    "ysb_sub_element_id": "e6436396-9fe6-428f-b1e3-c877b3b2a797",
                                    "ysb_sub_element_name": "diperbolehkan bertanya tentang ucapan seorang ‘alim yang belum jelas",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:39.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1da67a9c-bde3-4513-8b24-1776731f0431",
                                    "ysb_sub_element_id": "642d4b25-bd22-4a6a-ac32-745f5e66b281",
                                    "ysb_sub_element_name": "jangan bertanya tentang sesuatu yang telah engkau ketahui jawabannnya, untuk menunjukkan kehebatanmu dan melecehkan orang lain",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:21:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "78237986-6ef4-4e21-acc2-61aeb1cdc303",
                                    "ysb_sub_element_id": "690947ec-2757-4f89-84a1-a9a3c6defbd0",
                                    "ysb_sub_element_name": "mengambil akhlak dan budi pekerti gurunya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:24:10.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "f3920dfe-c3af-4ef9-86c1-34b975bbec3c",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.6",
                    "description": "Adab di Masjid & kamar mandi",
                    "created_at": "2025-11-19T03:00:53.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "013a35bd-40fd-414f-a111-e5cc3b5feecc",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "f3920dfe-c3af-4ef9-86c1-34b975bbec3c",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "792941d2-b23e-4064-85c3-bd41e82514f1",
                                    "ysb_sub_element_id": "219c84a3-659d-438c-a443-dc345212d13d",
                                    "ysb_sub_element_name": "mengikhlaskan niat kepada Allah Swtta’ala",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:07.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1dace71b-6cbe-42d7-9ab5-f38864b0ab07",
                                    "ysb_sub_element_id": "01d02883-3594-4cdc-aaf1-d404f8dfc61b",
                                    "ysb_sub_element_name": "berpakaian indah ketika hendak menuju masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:11.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3fa2216f-0a7d-4dc9-9f40-872c98242efd",
                                    "ysb_sub_element_id": "f56fe586-7510-4dc0-b790-453fa1c855ec",
                                    "ysb_sub_element_name": "menghindari makanan tidak sedap baunya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b7ddc815-b7ea-4a33-a41d-aec99ea8286a",
                                    "ysb_sub_element_id": "ba77f77f-39a1-455f-a028-749019f8b196",
                                    "ysb_sub_element_name": "bersegera menuju rumah Allah Swtta’ala",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:26.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a0fe14fc-d99f-4819-9f32-36dd3b8461c8",
                                    "ysb_sub_element_id": "b612b024-268a-44c6-a064-7c128d06ddcc",
                                    "ysb_sub_element_name": "berjalan menuju masjid dengan tenang dan sopan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "18eeffc9-dc37-49e9-84e3-ea42f0a83123",
                                    "ysb_sub_element_id": "043f18b5-91fa-49bc-bbe9-1d6572acb019",
                                    "ysb_sub_element_name": "Meminta izin kepada suami atau mahramnya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:38.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9a6abf6f-c65c-4306-b64a-b054b2e7b2ff",
                                    "ysb_sub_element_id": "dbd3530c-bc0c-4025-b84c-37e711dc849a",
                                    "ysb_sub_element_name": "Tidak menimbulkan fitnah",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:56.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b63d8d32-cc3b-4a75-8e50-7a8e98d5e3cb",
                                    "ysb_sub_element_id": "6e9e650c-18f2-48c2-b829-27da04efc516",
                                    "ysb_sub_element_name": "Menutup aurat secara lengkap",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:04.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "fe42da97-680a-44d1-a708-8a99c484889f",
                                    "ysb_sub_element_id": "9466d1ee-554f-40bc-a063-0a18707c4548",
                                    "ysb_sub_element_name": "Tidak berhias dan memakai parfum",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3514c440-aefa-432c-ac44-fc9e60ce20d1",
                                    "ysb_sub_element_id": "0ae1e6fb-7326-4d73-ba5b-ba361f460e7f",
                                    "ysb_sub_element_name": "melaksanakan Shalat Tahiyatul Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:28.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9a01037c-2fcb-43e7-a51b-1439547d2305",
                                    "ysb_sub_element_id": "17a9c953-3789-4ba4-b817-40685b20be7c",
                                    "ysb_sub_element_name": "mengagungkan Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:33.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "62699456-0e03-45c7-92bc-6adef50642a8",
                                    "ysb_sub_element_id": "d4758c57-3abd-4aca-8dbd-14a59949b0ee",
                                    "ysb_sub_element_name": "menunggu ditegakkannya shalat dengan berdoa dan berdzikir",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:57.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3a4abd41-096a-4be4-a7ec-d701b4fd8452",
                                    "ysb_sub_element_id": "0d7105d7-fc64-4e83-a057-6e82cab8c4c8",
                                    "ysb_sub_element_name": "mengaitkan hati dengan Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:03.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "3e0a55c1-3adf-4b70-9bdf-0c82d922fe35",
                                    "ysb_sub_element_id": "c79683a7-3395-49c1-af31-94b53badc5bb",
                                    "ysb_sub_element_name": "anjuran untuk berpindah tempat ketika merasa ngantuk",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:08.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "d146dc32-c163-42fb-a487-6869da2e4346",
                                    "ysb_sub_element_id": "cd5512ca-0333-49fd-be70-28a0f208b639",
                                    "ysb_sub_element_name": "anjuran membuat pintu khusus untuk Wanita",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:24.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "6e63dbf5-74e3-484b-b24b-46a4210e2dd6",
                                    "ysb_sub_element_id": "2135e4b6-d2f3-42e2-82f3-95fe8f2b3455",
                                    "ysb_sub_element_name": "dibolehkan untuk tidur di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:32.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "281ebfe6-d2d5-4acc-b640-9bc7d50c2f0d",
                                    "ysb_sub_element_id": "95d9bedc-2cdc-4b8f-bb3d-1c758c9625ca",
                                    "ysb_sub_element_name": "boleh memakai sandal di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:39.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1a85a1fd-939b-46a8-a970-d0039df5c358",
                                    "ysb_sub_element_id": "abb31d2d-594b-4831-bfe2-b103a69263b7",
                                    "ysb_sub_element_name": "boleh makan dan minum di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:44.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "75ff3c5b-a18b-428c-ba22-7a5124ceb138",
                                    "ysb_sub_element_id": "1febfb2c-cd94-4677-b7d7-b2a8bf5c01eb",
                                    "ysb_sub_element_name": "boleh membawa anak kecil ke Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:49.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a11cca41-28ac-4cc0-85af-fc535b4d54b7",
                                    "ysb_sub_element_id": "93cb2f35-7db4-49b8-831e-18c663f8da82",
                                    "ysb_sub_element_name": "menjaga dari ucapan yang jorok dan tidak layak di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "92a145f3-7ec7-4ea4-b240-2490a7e3b347",
                                    "ysb_sub_element_id": "6e6f8eda-11c6-4a20-92fa-d39361acc5b0",
                                    "ysb_sub_element_name": "tidak bermain-main di Masjid selain permainan yang mengandung bentuk melatih ketangkasan dalam\nperang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:03.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "2cbf3287-e6ad-4d20-ac9b-77c4ba66a7ca",
                                    "ysb_sub_element_id": "e46f4294-448e-4607-a4c9-3410fbc9c7eb",
                                    "ysb_sub_element_name": "tidak menjadikan Masjid sebagai tempat lalu lalang",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "5188877a-9c84-4018-a22c-589fab52cc0d",
                                    "ysb_sub_element_id": "1ebd7b79-ef31-478d-ade6-f35988abaa26",
                                    "ysb_sub_element_name": "tidak menghias Masjid secara berlebihan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:23.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "1700a042-5353-4ffe-9110-4b8586fba1f6",
                                    "ysb_sub_element_id": "f56b4fcc-d86f-4da7-bb9b-a18698f0bed0",
                                    "ysb_sub_element_name": "tidak mengambil tempat khusus di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:28.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "e8f4dc35-6c61-4c9c-b50e-46178f1a4fd4",
                                    "ysb_sub_element_id": "51317a8e-00cd-4be6-afd2-d7b6efc6b9e1",
                                    "ysb_sub_element_name": "tidak keluar setelah adzan kecuali ada alasan",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:30:03.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ffa5a6f1-89a5-4daf-8bfb-1e86ce70cdb4",
                                    "ysb_sub_element_id": "b889a9af-19be-4085-b484-55fea1859c65",
                                    "ysb_sub_element_name": "tidak mencari barang yang hilang di Masjid dan mengumumkannya",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:30:10.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "013a35bd-40fd-414f-a111-e5cc3b5feecc",
                                    "ysb_sub_element_id": "2dbd155e-60af-4310-95bd-85d93de05358",
                                    "ysb_sub_element_name": "tidak jual beli di masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:30:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ecaa1fb1-768a-49c8-9da9-5075ae50760e",
                                    "ysb_sub_element_id": "c3be6778-76f9-44c8-b148-fbab8ddd1954",
                                    "ysb_sub_element_name": "tidak mengganggu orang yang beribadah di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "738b3370-1662-4323-9bc3-8a79d8b1b125",
                                    "ysb_sub_element_id": "26c01c20-ebec-4224-820d-42f561fbdb22",
                                    "ysb_sub_element_name": "tidak berteriak dan membuat gaduh di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:41.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "99d5f4e7-5677-4cd7-b52f-4d88956238a0",
                                    "ysb_sub_element_id": "2fbb9580-c067-4341-bf6d-15390f1b08f8",
                                    "ysb_sub_element_name": "tidak lewat di dalam Masjid dengan membawa senjata tajam",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c64013da-4893-4c8a-a8c5-c39ffae4340a",
                                    "ysb_sub_element_id": "26b538c4-1a67-4c92-83ae-edc8e169205a",
                                    "ysb_sub_element_name": "tidak lewat di depan orang shalat",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:02.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "03a50402-2d11-497c-835f-bde08f51871b",
                                    "ysb_sub_element_id": "9b7aa39a-c546-4d03-9a71-95dba6fc1e54",
                                    "ysb_sub_element_name": "tidak melingkar di dalam Masjid untuk berkumpul untuk kepentingan dunia",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:14.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "dbba298a-2bc6-4e09-8d41-2dbf182f5864",
                                    "ysb_sub_element_id": "4da03fb3-94f2-4b23-8adb-5a3de1278007",
                                    "ysb_sub_element_name": "tidak meludah di Masjid",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:22.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "8556a15d-e3a0-4a64-9152-548e54193b90",
                                    "ysb_sub_element_id": "f937b3fc-3f29-430e-a8da-61813235346b",
                                    "ysb_sub_element_name": "keluar Masjid dengan mendahulukan kaki kiri dan membaca doa",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:29.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "244531f2-f641-496f-b34d-3457b54b5863",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.7",
                    "description": "Adab pergaulan",
                    "created_at": "2025-11-19T03:00:54.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "0a943394-2e65-4183-a6fe-072600a943ad",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "244531f2-f641-496f-b34d-3457b54b5863",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "0a943394-2e65-4183-a6fe-072600a943ad",
                                    "ysb_sub_element_id": "07798f6f-38ed-4094-871b-75e3b3e72a24",
                                    "ysb_sub_element_name": "Ta’aruf (saling mengenal)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:34:00.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a4a18b89-374e-46b2-8f52-a455ceb74d68",
                                    "ysb_sub_element_id": "f3821793-b805-4b8e-9bdc-6aa841127533",
                                    "ysb_sub_element_name": "Tafahum (saling memahami)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:34:20.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7b7acbe3-59c2-4eb9-a1b1-9706d84dd8b3",
                                    "ysb_sub_element_id": "cd5c2e07-b8e3-4c96-9029-0871f5285c5c",
                                    "ysb_sub_element_name": "Ta’awun (saling menolong)",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:34:32.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "d90aed10-cd57-455c-b8d4-f2441195d859",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.8",
                    "description": "Adab bertamu",
                    "created_at": "2025-11-19T03:00:55.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "1a8ffe2e-34b5-4fb5-8a22-aba7cceaad9f",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "d90aed10-cd57-455c-b8d4-f2441195d859",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "1a8ffe2e-34b5-4fb5-8a22-aba7cceaad9f",
                                    "ysb_sub_element_id": "d4fc02fa-0a11-4674-8083-28f682ed6282",
                                    "ysb_sub_element_name": "Bagi seorang yang diundang, hendaknya memenuhinya sesuai waktunya kecuali ada udzur.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:31.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "52335b9d-4ed3-42e4-b7b9-91022c5abb5b",
                                    "ysb_sub_element_id": "726e37d7-8d51-4af9-abdc-868845659c92",
                                    "ysb_sub_element_name": "Hendaknya tidak membeda-bedakan siapa yang mengundang, baik orang kaya ataupun orang miskin.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:45.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4fd48980-84be-4888-9f44-3a50f8fedc39",
                                    "ysb_sub_element_id": "471411db-4b9d-4085-b448-14450e572a72",
                                    "ysb_sub_element_name": "Berniatlah bahwa kehadiran kita sebagai tanda hormat kepada sesama muslim.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:31:58.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "639fb624-766b-4be2-80cd-999fc1f5e2f2",
                                    "ysb_sub_element_id": "a466970c-111c-4e63-9915-40971bcdfcb6",
                                    "ysb_sub_element_name": "Masuk dengan seizin tuan rumah, begitu juga segera pulang setelah selesai memakan hidangan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:18.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "29407cf4-bbfc-40ca-926f-b0672a488862",
                                    "ysb_sub_element_id": "dcf61b0c-ab04-4bd4-92e9-ae43a1f1a277",
                                    "ysb_sub_element_name": "Seorang tamu meminta persetujuan tuan untuk menyantap, tidak melihat-lihat ke arah tempat keluarnya perempuan, tidak menolak tempat duduk yang telah disediakan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:29.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ed7cd731-66b5-4a24-88cb-6f83919d3f83",
                                    "ysb_sub_element_id": "97450d19-f27f-4dc6-a665-bf0fd344d241",
                                    "ysb_sub_element_name": "Tidak banyak melirik-lirik kepada wajah orang-orang yang sedang makan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:43.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "9b4457ce-6a50-47e0-a32b-014eb6c215f3",
                                    "ysb_sub_element_id": "bdcce3ea-da82-4ab0-b79a-792bb4ab036f",
                                    "ysb_sub_element_name": "Tidak memberatkan tuan rumah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:32:54.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "b7831ef3-944c-4b6c-be30-35ac9f83c657",
                                    "ysb_sub_element_id": "0f660145-7221-47bb-aba6-2431ec4f56a5",
                                    "ysb_sub_element_name": "Sebagai tamu, kita dianjurkan membawa hadiah untuk tuan rumah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:33:05.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a1274a9f-586e-4472-888c-1576d40bdee6",
                                    "ysb_sub_element_id": "cf78b3b3-d40b-44e4-a306-b8f9227fe083",
                                    "ysb_sub_element_name": "Jika seorang tamu datang bersama orang yang tidak diundang, ia harus meminta izin kepada tuan rumah dahulu.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:33:17.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "7952f1aa-5feb-4612-8ea0-b7ec7f3f4bd8",
                                    "ysb_sub_element_id": "abd35731-8bf9-4454-987c-d3d3c05126e2",
                                    "ysb_sub_element_name": "Seorang tamu hendaknya mendoakan orang yang memberi hidangan kepadanya setelah selesai mencicipi makanan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:33:29.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "4c1a06a8-70a1-4d99-af57-a06c6cc9be5c",
                                    "ysb_sub_element_id": "83416487-efed-44b4-87e3-40408be56961",
                                    "ysb_sub_element_name": "Setelah selesai bertamu hendaklah seorang tamu pulang dengan lapang dada, memperlihatkan budi pekerti yang mulia, dan memaafkan segala kekurangan tuan rumah.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:33:40.000000Z"
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "0f1151b2-f16a-486a-a9f5-9698bd511454",
                    "ysb_dimensi_id": "88600e00-c9de-4288-97ed-48572635c8b0",
                    "name_element": "Element 8.9",
                    "description": "Adab menengok orang sakit",
                    "created_at": "2025-11-19T03:00:56.000000Z",
                    "rekapan": [
                        {
                            "ysb_element_recap_id": "041fb436-6d21-463f-b1dc-281d2c55b1b7",
                            "ysb_student_id": "99f2b143-908b-46e1-8672-9da371d3fb5f",
                            "name_student": "Fathan Satya Negara",
                            "nisn": "654321",
                            "ysb_element_id": "0f1151b2-f16a-486a-a9f5-9698bd511454",
                            "ysb_teacher_id": "85547955-11a6-47dd-8a11-e38e1f0a91f6",
                            "ysb_school_id": "SMPIA41",
                            "average": null,
                            "sub_elements": [
                                {
                                    "ysb_element_recap_id": "610e3020-2a6c-4fbb-ae3b-1cfbc2287abf",
                                    "ysb_sub_element_id": "561893dc-5765-4b05-a48e-149a2f86faac",
                                    "ysb_sub_element_name": "memberikan kesenangan di hati orang yang sedang sakit, menyuguhkan apa yang dia perlukan, dan menasehati tentang derita yang ia alami.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:38.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "054aa710-2872-4fcb-a892-b9195f3d4d08",
                                    "ysb_sub_element_id": "10f41721-c5ba-4586-aa56-32667a9e8b4a",
                                    "ysb_sub_element_name": "Wanita dibolehkan menjenguk laki-laki yang sedang sakit meskipun mereka bukan mahramnya. Akan tetapi, dengan beberapa syarat seperti aman dari fitnah, menutup aurat, dan tidak bercampur-baur antara laki-laki dan perempuan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:26:51.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "a9a44aad-b6ef-4a3b-bda1-d69cb8de0692",
                                    "ysb_sub_element_id": "5bd6c2e8-64ff-4bda-9f6b-c1518f8bf28d",
                                    "ysb_sub_element_name": "memakruhkan menjenguk orang kafir, karena menjenguk orang yang sakit adalah memuliakannya. Dan sebagian ulama membolehkannya apabila dengan bersikap seperti itu dia akan masuk Islam.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:03.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "041fb436-6d21-463f-b1dc-281d2c55b1b7",
                                    "ysb_sub_element_id": "145e9839-8acb-4f3e-a800-25253efe1474",
                                    "ysb_sub_element_name": "kapan saja dibolehkan baik siang atau malam selama tidak mengganggu orang yang sedang sakit.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:16.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "490e5a25-7c67-44df-80c0-2ea88004fb27",
                                    "ysb_sub_element_id": "45a784ec-fb8e-4e2e-bcbb-05f3a38fa84a",
                                    "ysb_sub_element_name": "meringankan beban orang yang sedang sakit dan menenangkan hatinya, bukan malah memberatkannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:29.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "c1778403-ae46-47ab-9451-e557b5dd8b6b",
                                    "ysb_sub_element_id": "002bac93-ac51-4904-8a95-0db98512e2c6",
                                    "ysb_sub_element_name": "dianjurkan duduk di dekat kepala orang yang sedang sakit menanyakan keadaannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:40.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "0e2c2011-6295-4696-87b7-1ff404432d28",
                                    "ysb_sub_element_id": "ae8b1b45-d018-444c-a67f-199bb3b17407",
                                    "ysb_sub_element_name": "menyemangatinya seperti berkata, “Tidak apa-apa, kamu akan sembuh Insya Allah SWT.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:27:57.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "73e7f2e3-1bc3-49a2-a849-23e667ce1a06",
                                    "ysb_sub_element_id": "bffa8f8a-bc14-41c2-a95e-9b8c6b06dc63",
                                    "ysb_sub_element_name": "orang yang menjenguk orang yang sedang sakit tidak mengucapkan apa pun kecuali kata-kata yang baik, karena para malaikat mengamini ucapannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:12.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "bc6953ca-48b3-4431-8c23-356db9bacede",
                                    "ysb_sub_element_id": "0a30112e-f272-4349-801f-e80fda87eddc",
                                    "ysb_sub_element_name": "mendoakan orang yang sedang sakit agar diberikan rahmat dan ampunan, pembersihan dari dosa dan keselamatan serta Kesehatan.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:23.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "861c2a27-c399-44dc-8e20-d747660239fe",
                                    "ysb_sub_element_id": "218e3f22-f24c-4c15-a339-3efe983e6f4d",
                                    "ysb_sub_element_name": "meletakkan tangannya pada tubuh orang yang sedang sakit, seperti tangan atau kening.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:36.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "259d6754-4010-49ac-9ea0-a1459accc161",
                                    "ysb_sub_element_id": "f22f18e1-1721-4dc3-a173-043fde709376",
                                    "ysb_sub_element_name": "disunnahkan merukyah orang yang sakit, sebagaimana yang dilakukan Nabi shallAllah Swt Swtu ‘alaihi wa sallam. dan Malik). Al Hafiz Ibnu Hajar berkata, “Yang dimaksud dengan Al Mu’awwidzat adalah dua surat (Al Falaq dan An Nas) serta Al Ikhlas”.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:28:52.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "28535156-dad2-4461-9546-97f23aec43fd",
                                    "ysb_sub_element_id": "c98abab5-2a0b-40b9-b37c-0ff276ab4111",
                                    "ysb_sub_element_name": "Ketika ajal orang yang sakit itu sudah dekat dan tampak tanda-tanda kematian, maka yang menjenguknya dianjurkan mengingatkan kepada orang yang sakit itu betapa luasnya rahmat Allah SWT dan jangan pernah merasa berputus asa.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:07.000000Z"
                                },
                                {
                                    "ysb_element_recap_id": "ff60af0d-217c-46f5-841c-79c48b4ce80e",
                                    "ysb_sub_element_id": "132ada91-7e4f-4724-9faa-62eb3efe2540",
                                    "ysb_sub_element_name": "Jika wafat, bagi yang hadir dianjurkan memejamkan matanya dan mendoakannya.",
                                    "ysb_sub_element_value": null,
                                    "created_at": "2025-11-20T02:29:24.000000Z"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

  const GetResponseData2 = async () => {
    try {
      const response = await APILA.get('/api/element-recaps-dimensi-head/full', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: storageSchoolId,
          ysb_teacher_id: form2?.ysb_teacher_id
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        setGetData(response.data.data);
      }

    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
    }
  };

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
    const delayDebounceFn = setTimeout(() => {
      setKeyword(query);
    }, 300); 

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // UPDATE NILAI
  const [updateId, setUpdateID] = useState(-1);
  const id_user = localStorage.getItem("id_admin");
  const output_id_user = id_user.replace(/[|&;$%@"<>()+,]/g, "");

  return (
    <div className="body" >

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6><FontAwesomeIcon icon={faListUl}/> Dimensi</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Penilaian </h5>
            </div>
          </>
        }   
      </div> 
      
      <div className="body-content">
        {/* Breadcrumnbs */}
        {/* <div className="breadcrumb-header mb-4" style={{fontSize:"14px" }}>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page"> <Link to="/beranda-laporan-adab"> Beranda </Link> </li>
              <li className="breadcrumb-item">/ Dimensi</li>
            </ol>
          </nav>
        </div> */}

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

                                      
              <Row style={{marginTop: "12px", padding:"0 12px"}}>
                <button onClick={GetResponseData2} className=" btn " style={{fontSize: '13px', padding:'5px 10px', marginTop: '-2px', borderRadius:"0", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
              </Row>
            </div>
          </>
          :
          <>
            <div className="mb-3">
              <div className="d-flex">
                <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form2?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
                  <option value="" hidden>{namaTA} (Semester {namaSmstr})</option>
                  {getDataSemesterMap.map((user,index) => (
                    <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester})</option>
                  ))}  
                
                </select>

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
                  <div className="">
                   <table className="table table-laporan-adab  table-hover table-bordered " id="basic-datatable">
                      <thead>
                        <tr>
                          {/* Header kosong untuk kolom header samping */}
                            <th className="border border-gray-300 p-3 bg-gray-100 text-center">Nama Kegiatan</th>
                            <th className="border border-gray-300 p-3 bg-gray-100 text-center">Nilai</th>
                        </tr>
                      </thead>
                      <tbody>
                        {element?.rekapan?.[0]?.sub_elements?.map((sub, idx) => (
                          <tr >
                            <th style={{border: "1px solid #e0e0e0ff", lineHeight: "2", fontSize: "14px", fontWeight: "400"}} key={sub?.ysb_sub_element_id || idx}>{sub?.ysb_sub_element_name || sub?.description}</th>
                            
                            

                            {element?.rekapan?.map((rekap) => (
                              <>
                              <td> <input
                                        type="text"
                                        className="text-center"
                                        style={{ border: "none" }}
                                      /></td>
                              </>
                            ))}
                           {/* <td><input/></td> */}

                          </tr>
                        ))}

                        {/* <tr></tr>
                        <tr><td><input/></td></tr> */}
                     

                       
                        {/* {element?.rekapan?.map((rekap) => (
                            <tr key={rekap?.ysb_element_recap_id}>
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
                              
                            </tr>
                        ))} */}

                          

                        {/* {sampleData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                       
                          <th className="border border-gray-300 p-3 bg-gray-50 text-left font-semibold">
                          {row.name}
                          </th>
                          <td className="border border-gray-300 p-3">{row.qty}</td>
                          <td className="border border-gray-300 p-3">{row.price.toLocaleString()}</td>
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
