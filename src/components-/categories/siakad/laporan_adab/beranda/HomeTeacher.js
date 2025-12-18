import React from 'react';
import { useEffect, useState, useRef } from "react";
import {Col, Row, Card, CardBody} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import "bulma/css/bulma.css";
import "../../../../../index.css";
// import "./Dashboard.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faListUl } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

import Chart from 'react-apexcharts';
// import ModalRapor from './modal/rapor';

export default function Home() {
  document.title = "Dashboard";
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
  // const [getRapor, setGetRapor] = useState([]);
  const [pages, setPages] = useState(1);
  // const [showModal, setShowModal] = useState(false);
  // const [selectedRapor, setSelectedRapor] = useState(null);

  // Dashboard-specific states for "Opsi A" (group by student)
  const [lowItems, setLowItems] = useState([]); // raw indicators with value < 4
  const [studentsLow, setStudentsLow] = useState([]); // grouped per-student (only low indicators)
  const [studentsAll, setStudentsAll] = useState([]); // grouped per-student (all indicators)
  const [onlyLow, setOnlyLow] = useState(true); // toggle: show only indicators < 4
  const [searchTerm, setSearchTerm] = useState(""); // search by name/nisn
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedIndicators, setSelectedIndicators] = useState([]);

  const [namaTA, setNamaTA] = useState([]);
  const [namaSmstr, setNamaSmstr] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Dashboard statistics
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgValue: 0,
    needAttention: 0,
    progressPercent: 0,
    weakestElement: null
  });

  // Chart data
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

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

  // const id_teacher = localStorage.getItem('teacherID');
  // console.log(id_teacher);

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

 

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  // guard to prevent duplicate auto-fetch of dashboard endpoint
  const dashboardAutoFetchedRef = useRef(false);
  const raporAutoFetchedRef = useRef(false);
  const lastFetchParamsRef = useRef(null);

  const fetchDataRef = useRef();
  const fetchData = async () => {
    try {
      // setLoading(true);
      const [ dataSemester, dataDimensi] = await axios.all([
        APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${descending}&search=${keyword}`,fetchParams),
        APILA.get(`/api/access/dimensis?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams),
      ]);
      if (dataSemester.status === 200  && dataDimensi.status === 200 ){
        const semesters = dataSemester.data.data.find(s => s.status === 1);
        // setGetDataBranch(dataBranch.data.data);
        setGetDataSemester(semesters);
        setGetDataSemesterMap(dataSemester.data.data);
        setGetDataDimensi(dataDimensi.data.data);
        setGetDataDimensiDefault(dataDimensi.data.data[0]);
        setNamaTA(semesters.name_year);
        setNamaSmstr(semesters.semester);
        // setLoading(false);
      }
    } catch (error) {
      // setLoading(false);
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
    const first = getData?.[0]?.data_element?.[0]?.name_description;
    if (first) setSelectedTab(prev => prev || first);
  }, [getData]);

  // open modal preview for a rapor
  // const viewModalRapor = (id, rapor) => {
  //   try {
  //     setSelectedRapor(rapor ?? null);
  //     setShowModal(true);
  //   } catch (err) {
  //     console.error('viewModalRapor error', err);
  //   }
  // };

  const GetResponseData = async () => {
    try {
      setLoading(true);

      const params = {
        ysb_semester_id: form?.ysb_semester_id || getDataSemester?.id,
        level: storageLevel,
        branch: storageBranch,
        ysb_school_id: storageSchoolId,
        ysb_teacher_id: storageTeacher
      };

      console.log('🔍 GetResponseData params:', params);

      const response = await APILA.get('/api/dashboards-la-teacher', {
        params,
        ...fetchParams
      });

      console.log('✅ API Response:', response.data);

      if (response?.status === 200) {
        const respData = response.data?.data || {};
        const items = respData.items || [];

        console.log('📊 Items from API:', items.length, items);

        // Group by student (name_student + nisn)
        const studentMap = new Map();
        items.forEach(item => {
          const key = `${item.name_student}_${item.nisn}`;
          
          if (!studentMap.has(key)) {
            studentMap.set(key, {
              name_student: item.name_student || "-",
              nisn: item.nisn || "-",
              name_kelas: item.name_kelas || "-",
              ysb_student_id: item.ysb_student_id,
              ysb_branch_id: item.ysb_branch_id,
              ysb_semester_id: item.ysb_semester_id,
              ysb_teacher_id: item.ysb_teacher_id,
              ysb_school_id: item.ysb_school_id,
              ysb_kelas_id: item.ysb_kelas_id,
              ysb_name_year: item.ysb_name_year,
              ysb_school_name: item.ysb_school_name,
              ysb_number_kelas: item.ysb_number_kelas,
              ysb_name_kelas: item.ysb_name_kelas,
              ysb_name_teacher: item.ysb_name_teacher,
              ysb_nama_kepsek: item.ysb_nama_kepsek,
              indicators: []
            });
          }
          
          studentMap.get(key).indicators.push({
            ysb_sub_element_value: item.ysb_sub_element_value,
            description: item.description,
            name_description: item.name_description
          });
        });

        const groupedStudents = Array.from(studentMap.values());
        
        console.log('👥 Grouped students:', groupedStudents.length, groupedStudents);

        
        const totalStudents = groupedStudents.length;
        console.log('📈 Total students:', totalStudents);
        
        
        const allValues = items.map(i => Number(i.ysb_sub_element_value));
        const avgValue = allValues.length > 0 ? (allValues.reduce((a,b) => a+b, 0) / allValues.length).toFixed(1) : 0;
        
        
        const needAttention = groupedStudents.filter(s => {
          const avg = s.indicators.reduce((sum, i) => sum + Number(i.ysb_sub_element_value), 0) / s.indicators.length;
          return avg < 3;
        }).length;
        
        
        const studentsAssessed = groupedStudents.filter(s => s.indicators.length > 0).length;
        const progressPercent = totalStudents > 0 ? ((studentsAssessed / totalStudents) * 100).toFixed(0) : 0;
        
     
        const elementScores = {};
        items.forEach(i => {
          const elem = i.name_description;
          if (!elementScores[elem]) {
            elementScores[elem] = { total: 0, count: 0 };
          }
          elementScores[elem].total += Number(i.ysb_sub_element_value);
          elementScores[elem].count++;
        });
        
        const elementAvgs = Object.entries(elementScores).map(([name, data]) => ({
          name,
          avg: (data.total / data.count).toFixed(2)
        }));
        const weakestElement = elementAvgs.length > 0 ? elementAvgs.sort((a,b) => a.avg - b.avg)[0] : null;
        
        const newStats = {
          totalStudents,
          avgValue,
          needAttention,
          progressPercent,
          weakestElement
        };

        console.log('📊 Stats calculated:', newStats);
        setStats(newStats);

        const chartData = {};
        items.forEach(i => {
          const elem = i.name_description;
          if (!chartData[elem]) {
            chartData[elem] = { '1': 0, '2': 0, '3': 0, '4': 0 };
          }
          const val = String(i.ysb_sub_element_value);
          if (chartData[elem][val] !== undefined) {
            chartData[elem][val]++;
          }
        });
        
        const barData = Object.entries(chartData).map(([element, values]) => ({
          element: element.length > 20 ? element.substring(0, 20) + '...' : element,
          nilai_1: values['1'],
          nilai_2: values['2'],
          nilai_3: values['3'],
          nilai_4: values['4']
        }));
        
        console.log('📊 Bar chart data:', barData);
        setBarChartData(barData);

        
        const studentsWithLowScores = groupedStudents.filter(s => {
          return s.indicators.some(i => Number(i.ysb_sub_element_value) < 4);
        }).length;

     
        const pieData = barData.map(d => ({
          name: d.element,
          value: (Number(d.nilai_1) || 0) + (Number(d.nilai_2) || 0) + (Number(d.nilai_3) || 0) + (Number(d.nilai_4) || 0)
        })).filter(d => d.value > 0);

        console.log('📊 Pie chart data (per-element):', pieData);
        setPieChartData(pieData);

        if (items.length > 0) {
          const firstItem = items[0];
          console.log('📋 Header info:', {
            year: firstItem.ysb_name_year,
            teacher: firstItem.ysb_name_teacher,
            kelas: `${firstItem.ysb_number_kelas} ${firstItem.ysb_name_kelas}`
          });
          if (firstItem.ysb_name_year) {
            setNamaTA(firstItem.ysb_name_year);
          }
        }

        console.log('✅ Setting getData with', groupedStudents.length, 'students');
        setGetData(groupedStudents);
     
        dashboardAutoFetchedRef.current = true;
        lastFetchParamsRef.current = {
          semester: params.ysb_semester_id,
          branch: params.branch,
          school: params.ysb_school_id,
          teacher: params.ysb_teacher_id
        };
        
        setLoading(false);
        console.log('✅ GetResponseData completed successfully');
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
      setLoading(true);
      const response = await APILA.get('/api/dashboards-la-teacher', {
        params: {
          level: storageLevel,
          branch: storageBranch,
          ysb_semester_id: form2?.ysb_semester_id,
          // ysb_dimensi_id: form2?.ysb_dimensi_id,
          ysb_school_id: form2?.ysb_school_id || storageSchoolId,
          ysb_teacher_id: form2?.ysb_teacher_id || storageTeacher
        },
        ...fetchParams
      });

      if (response?.status === 200) {
        // setGetRapor(response.data.data || []);
        setPages(response.data.totalPage || 1);
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
    if (storageSchool) {
      setForm2(prev => ({ ...prev, ysb_school_id: storageSchool }));
    }
    if (storageTeacher) {
      setForm2(prev => ({ ...prev, ysb_teacher_id: storageTeacher }));
    }
  }, [storageSchool, storageTeacher]);

  useEffect(() => {
  }, [form2?.ysb_semester_id, form2?.ysb_dimensi_id]);

  useEffect(() => {
    if (getDataSemester?.id && getDataDimensiDefault?.id && !isInitialized) {
      
      setForm({
        ysb_semester_id: getDataSemester.id,
        ysb_dimensi_id: getDataDimensiDefault.id,
        ysb_branch_id: storageBranch,
        ysb_school_id: storageSchoolId,
        ysb_teacher_id: storageTeacher
      });

      setForm2({
        ysb_semester_id: getDataSemester.id,
        ysb_dimensi_id: getDataDimensiDefault.id,
        ysb_branch_id: storageBranch,
        ysb_school_id: storageSchoolId,
        ysb_teacher_id: storageTeacher,
        ysb_sub_element_value: ""
      });

      setIsInitialized(true);
    }
  }, [getDataSemester?.id, getDataDimensiDefault?.id, storageBranch, storageSchoolId, storageTeacher, isInitialized]);

  useEffect(() => {
    if (!isInitialized) {
      console.log('⏸️ Waiting for initialization...');
      return;
    }

    const shouldFetch = 
      form.ysb_semester_id && 
      form.ysb_semester_id !== "" && 
      storageBranch && 
      storageBranch !== "" &&
      storageSchoolId && 
      storageSchoolId !== "" &&
      storageTeacher &&
      storageTeacher !== "";

    if (!shouldFetch) {
      console.log('⏸️ Params not ready yet:', {
        semester_id: form.ysb_semester_id,
        branch: storageBranch,
        school: storageSchoolId,
        teacher: storageTeacher
      });
      return;
    }


    const currentParams = {
      semester: form.ysb_semester_id,
      branch: storageBranch,
      school: storageSchoolId,
      teacher: storageTeacher
    };

    const paramsChanged = !lastFetchParamsRef.current || 
      lastFetchParamsRef.current.semester !== currentParams.semester ||
      lastFetchParamsRef.current.branch !== currentParams.branch ||
      lastFetchParamsRef.current.school !== currentParams.school ||
      lastFetchParamsRef.current.teacher !== currentParams.teacher;

    console.log('🔍 Fetch check:', {
      isInitialized,
      shouldFetch,
      paramsChanged,
      guardRef: dashboardAutoFetchedRef.current,
      currentParams,
      lastParams: lastFetchParamsRef.current
    });

    if (paramsChanged && dashboardAutoFetchedRef.current) {
      console.log('🔄 Params changed, resetting guard...');
      dashboardAutoFetchedRef.current = false;
    }

    if (!dashboardAutoFetchedRef.current || paramsChanged) {
      console.log('🚀 Triggering GetResponseData...');
      GetResponseData();
    } else {
      console.log('⏭️ Skipping fetch - already fetched with same params');
    }
  }, [isInitialized, form.ysb_semester_id, storageBranch, storageSchoolId, storageTeacher]); 

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
              <h6><FontAwesomeIcon icon={faListUl}/> Dashboard</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5><FontAwesomeIcon icon={faListUl}/> Dashboard </h5>
            </div>
          </>
        }   
      </div> 
      
      <div className="body-content">
        {/* Breadcrumnbs */}
        

        {/* FILTER */}
        {isTabletOrMobile ? 
          <>
            
          </>
          :
          <>

          
          </>
        }

        {loading && <LoaderHome />}

        {/* Summary Cards */}
        <Row className="mb-3">
          {/* Card 1 - Blue accent */}
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{position:'relative', background:'#fff', borderRadius:10, padding:18, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', overflow:'hidden'}}>
              <div style={{position:'absolute', left:0, top:0, bottom:0, width:6, background:'#3b82f6', borderRadius:'6px 0 0 6px'}} />
              <div style={{position:'absolute', right:12, top:6, fontSize:64, opacity:0.06, color:'#3b82f6'}}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <path d="M16 3v4M8 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:'#3b82f6', textTransform:'uppercase', letterSpacing:0.6}}>Total Siswa</div>
                <div style={{fontSize:22, fontWeight:800, color:'#111827', marginTop:6}}>{stats.totalStudents}</div>
                <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>Jumlah siswa sudah dinilai</div>
              </div>
            </div>
          </Col>

          {/* Card 2 - Green accent */}
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{position:'relative', background:'#fff', borderRadius:10, padding:18, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', overflow:'hidden'}}>
              <div style={{position:'absolute', left:0, top:0, bottom:0, width:6, background:'#10b981', borderRadius:'6px 0 0 6px'}} />
              <div style={{position:'absolute', right:12, top:6, fontSize:64, opacity:0.06, color:'#10b981'}}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 3v18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.12"/>
                  <path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="1.6" opacity="0.06" />
                </svg>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:0.6}}>Rata-rata Nilai</div>
                <div style={{fontSize:22, fontWeight:800, color:'#111827', marginTop:6}}>{stats.avgValue}</div>
                <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>Rata-rata nilai siswa</div>
              </div>
            </div>
          </Col>

          {/* Card 3 - Teal accent */}
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{position:'relative', background:'#fff', borderRadius:10, padding:18, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', overflow:'hidden'}}>
              <div style={{position:'absolute', left:0, top:0, bottom:0, width:6, background:'#06b6d4', borderRadius:'6px 0 0 6px'}} />
              <div style={{position:'absolute', right:12, top:6, fontSize:64, opacity:0.06, color:'#06b6d4'}}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M7 7h10M7 11h10M7 15h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.12"/>
                  <rect x="4" y="3" width="16" height="18" rx="2" ry="2" opacity="0.06" />
                </svg>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:'#06b6d4', textTransform:'uppercase', letterSpacing:0.6}}>Perlu Perbaikan</div>
                <div style={{fontSize:22, fontWeight:800, color:'#111827', marginTop:6}}>{stats.needAttention}</div>
                <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>Jumlah siswa perlu perhatian</div>
              </div>
            </div>
          </Col>

          {/* Card 4 - Yellow accent */}
          <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
            <div style={{position:'relative', background:'#fff', borderRadius:10, padding:18, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', overflow:'hidden'}}>
              <div style={{position:'absolute', left:0, top:0, bottom:0, width:6, background:'#f59e0b', borderRadius:'6px 0 0 6px'}} />
              <div style={{position:'absolute', right:12, top:6, fontSize:64, opacity:0.06, color:'#f59e0b'}}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" opacity="0.06" />
                </svg>
              </div>
              <div>
                <div style={{fontSize:11, fontWeight:700, color:'#f59e0b', textTransform:'uppercase', letterSpacing:0.6}}>Progress Penilaian</div>
                <div style={{fontSize:22, fontWeight:800, color:'#111827', marginTop:6}}>{stats.progressPercent}%</div>
                <div style={{fontSize:12, color:'#6b7280', marginTop:8}}>Persentase penilaian selesai</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Element Terlemah Card */}
        {stats.weakestElement && (
          <Row className="mb-4">
            <Col xs={12}>
              <div style={{position:'relative', background:'#fff', borderRadius:10, padding:18, boxShadow:'0 6px 18px rgba(15,23,42,0.06)', overflow:'hidden'}}>
                <div style={{position:'absolute', left:0, top:0, bottom:0, width:6, background:'#ef4444', borderRadius:'6px 0 0 6px'}} />
                <div style={{position:'absolute', right:12, top:8, fontSize:64, opacity:0.06, color:'#ef4444'}}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" opacity="0.06" />
                    <path d="M12 8v5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <div>
                  <div style={{fontSize:11, fontWeight:700, color:'#ef4444', textTransform:'uppercase', letterSpacing:0.6}}>Element Terlemah</div>
                  <div style={{fontSize:18, fontWeight:800, color:'#111827', marginTop:6}}>
                    {stats.weakestElement.name}
                    <span style={{fontSize:13, fontWeight:600, color:'#6b7280', marginLeft:10}}>(Rata-rata: <strong style={{color:'#d63031'}}>{stats.weakestElement.avg}</strong>)</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        )}

        {/* Charts Section */}
        <Row className="mb-4">
          <Col xs={12} md={7} className="mb-3 mb-md-0">
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h6 style={{marginBottom: '15px', color: '#333', fontWeight: 600}}>📊 Nilai per Element</h6>
              {barChartData.length > 0 && (
                <Chart
                  type="bar"
                  height={isTabletOrMobile ? 250 : 350}
                  series={[
                    { name: 'Nilai 1', data: barChartData.map(d => d.nilai_1) },
                    { name: 'Nilai 2', data: barChartData.map(d => d.nilai_2) },
                    { name: 'Nilai 3', data: barChartData.map(d => d.nilai_3) },
                    { name: 'Nilai 4', data: barChartData.map(d => d.nilai_4) }
                  ]}
                  options={{
                    chart: {
                      type: 'bar',
                      stacked: false,
                      toolbar: { show: true }
                    },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                        columnWidth: '60%',
                        borderRadius: 4
                      }
                    },
                    dataLabels: { enabled: false },
                    stroke: { show: true, width: 2, colors: ['transparent'] },
                    xaxis: {
                      categories: barChartData.map(d => d.element),
                      labels: {
                        rotate: -45,
                        style: { fontSize: '11px' }
                      }
                    },
                    yaxis: {
                      title: { text: 'Jumlah Siswa' }
                    },
                    fill: { opacity: 1 },
                    colors: ['#dc3545', '#ffc107', '#17a2b8', '#28a745'],
                    legend: {
                      position: 'top',
                      horizontalAlign: 'center'
                    },
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val + " siswa"
                        }
                      }
                    }
                  }}
                />
              )}
            </div>
          </Col>
          
          <Col xs={12} md={5}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h6 style={{marginBottom: '15px', color: '#333', fontWeight: 600}}>📈 Nilai per Element</h6>
              {pieChartData.length > 0 ? (
                <Chart
                  type="pie"
                  height={isTabletOrMobile ? 250 : 350}
                  series={pieChartData.map(d => d.value)}
                  options={{
                    chart: { type: 'pie' },
                    labels: pieChartData.map(d => d.name),
                    colors: ['#ef4444', '#ffc107', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#64748b'],
                    legend: { position: 'bottom', horizontalAlign: 'center' },
                    responsive: [{
                      breakpoint: 480,
                      options: {
                        chart: { width: '100%' },
                        legend: { position: 'bottom' }
                      }
                    }],
                    tooltip: {
                      y: {
                        formatter: function (val) {
                          return val + " siswa"
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div style={{padding:20, borderRadius:8, background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.05)', color:'#374151'}}>
                  <div style={{fontSize:14, fontWeight:700, color:'#374151'}}>Tidak ada data distribusi</div>
                  <div style={{fontSize:13, color:'#6b7280', marginTop:6}}>Tidak ditemukan indikator untuk divisualisasikan.</div>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Col xl='12' sm='12'> 
          <div className="mt-3">
            <div className="body-table" >
              <div>
                        <table className="table  w-100 table-hover table-bordered" id="basic-datatable">
                          <thead >
                            <tr >
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Murid</th>
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">NISN</th>
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Status</th>
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Nilai</th>
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Indikator</th>
                              <th style={{textAlign: "center", border: "1px solid #e0e0e0ff"}} className="text-center">Element</th>
                            </tr>
                          </thead>

                          <tbody>
                            {(getData || []).filter(student => {
                              if (!searchTerm) return true;
                              const q = searchTerm.toLowerCase();
                              return (student.name_student || "").toLowerCase().includes(q) || (student.nisn || "").includes(q);
                            }).map((student, studentIndex) => {
                              const indicators = student.indicators || [];
                              const rowSpan = indicators.length || 1;
                              
                        
                              const studentAvg = indicators.length > 0 
                                ? (indicators.reduce((sum, i) => sum + Number(i.ysb_sub_element_value), 0) / indicators.length).toFixed(1)
                                : 0;
                              
                              
                              const getBadge = (avg) => {
                                if (avg >= 3.5) return { icon: '✅', text: 'Excellent', color: '#28a745' };
                                if (avg >= 2.5) return { icon: '🟡', text: 'Good', color: '#ffc107' };
                                return { icon: '🔴', text: 'Perlu Perbaikan', color: '#dc3545' };
                              };
                              
                              const badge = getBadge(Number(studentAvg));
                              
                              return indicators.map((indicator, indicatorIndex) => (
                                <tr key={`${studentIndex}-${indicatorIndex}`}>
                                  {indicatorIndex === 0 && (
                                    <>
                                      <td 
                                        rowSpan={rowSpan} 
                                        style={{ 
                                          lineHeight: "2", 
                                          verticalAlign: "middle"
                                        }}
                                      > 
                                        {student.name_student} 
                                      </td>
                                      <td rowSpan={rowSpan} style={{ lineHeight: "2", textAlign: "center", verticalAlign: "middle" }}> 
                                        {student.nisn} 
                                      </td>
                                      <td rowSpan={rowSpan} style={{ lineHeight: "2", textAlign: "center", verticalAlign: "middle" }}>
                                        <div>
                                          <div style={{
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: badge.color,
                                            marginBottom: '8px'
                                          }}>
                                            {badge.icon} {badge.text}
                                          </div>
                                          <div style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: badge.color
                                          }}>
                                            {studentAvg}
                                          </div>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                  <td style={{ lineHeight: "2", textAlign: "center" }}> 
                                    {indicator.ysb_sub_element_value || '-'} 
                                  </td>
                                  <td style={{ lineHeight: "2" }}> 
                                    {indicator.description || '-'} 
                                  </td>
                                  <td style={{ lineHeight: "2" }}> 
                                    {indicator.name_description || '-'} 
                                  </td>
                                </tr>
                              ));
                            })}
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
