import { useEffect, useState } from "react";
import {Col} from 'reactstrap';
import { useMediaQuery } from 'react-responsive';
import { APILA } from "../../../../../config/apila";
import "bulma/css/bulma.css";
import "../../../../../index.css";
import swal from "sweetalert";
import LoaderHome from "../../../../Loader/LoaderHome";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl } from '@fortawesome/free-solid-svg-icons';

export default function IdentitasMurid() {
  document.title = "Identitas Murid";

  const token = localStorage.getItem("token");
  const id_teacher = localStorage.getItem("teacherID");
  const storageLevel = localStorage.getItem('level');
  const storageBranch = localStorage.getItem('ysb_branch_id');

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState();
  const [ascending, setAscending] = useState(1);
  const [rows, setRows] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
 
  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})


  const [loading, setLoading] = useState(false);

  // Data
  const [getDataTA, setGetDataTA] = useState([]);
  const [getDataIdentitasMurid, setGetIdentitasMurid] = useState([]);
  const [smstrAktf, setSmstrAktf] = useState([]);
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

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
      ysb_semester_id: "",
    });

  const GetResponseTA = async () => {
      const response = await APILA.get(`/api/access/semesters?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`,fetchParams);
      setGetDataTA(response.data.data);

      const ab = response.data.data
      let obj = ab.find(o => o.status === 1);
      setSmstrAktf(obj.id)
      setNamaTA(obj.name_year)
      setNamaSmstr(obj.semester)
  } 

  const GetResponseIdentitasMurid = async () => {
      setLoading(true);
      const response = await APILA.get(`/api/access/semester-assignments?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}&ysb_teacher_id=${id_teacher}&ysb_semester_id=${smstrAktf}`, fetchParams)
      setGetIdentitasMurid(response.data.data);
      setLoading(false)
  } 

  const GetResponseDataFilter = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await APILA.get(`/api/access/semester-assignments?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}&ysb_teacher_id=${id_teacher}&ysb_semester_id=${form?.ysb_semester_id}`, fetchParams)

      // Checking process
      if (response?.status === 200) {
       
        setGetIdentitasMurid(response.data.data)
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    GetResponseTA();
    GetResponseIdentitasMurid();
  }, [page,keyword,limit])


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

  return (

    <div className="body" >

      <div className="body-header d-flex">
        {isTabletOrMobile ? 
          <>
            <div className="title-page">
              <h6> <FontAwesomeIcon icon={faListUl} /> Identitas Murid</h6>
            </div> 
          </>
          : 
          <>
            <div className="title-page">
              <h5> <FontAwesomeIcon icon={faListUl} /> Identitas Murid </h5>
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
              <li className="breadcrumb-item active" aria-current="page"> <Link to="/beranda-laporan-adab"> Beranda </Link> </li>
              <li className="breadcrumb-item"> Identitas Murid </li>
            </ol>
          </nav>
        </div>

        {/* FILTER */}
        <div className="d-flex mb-4">
          <select className="mr-2" aria-label="Default select example" name="ysb_semester_id" value={form?.ysb_semester_id} onChange={handleChange} style={{ border: "1px solid #4368c5", borderRadius: "3px", fontSize: '14px', padding:'5px 5px'}}>
            <option value={smstrAktf} hidden>{namaTA} (Semester {namaSmstr})</option>
            {getDataTA.map((user,index) => (
              <option key={index} value={user?.id} style={{textAlign:""}}>{user?.name_year} (Semester {user?.semester}) </option>
            ))}  
          </select>

          <button onClick={GetResponseDataFilter} className="btn " style={{fontSize: '14px', padding:'0px 10px', marginTop: '0px', borderRadius:"4px", backgroundColor:"#eca91aff", color: "#fff"}}> Cari</button>
        </div>

        {/* TABLE */}
        <Col xl='12' sm='12'> 
          <div className="mt-3">
            <div className="body-table" >
              <div>
                <table className="table dt-responsive nowrap w-100" id="basic-datatable">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Siswa</th>
                      <th>NISN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDataIdentitasMurid.map((siswa,index) => (
                      <tr key={index}>
                        <td style={{ lineHeight: "2" }}>{(page - 1) * 10 + (index + 1)} </td>  
                        <td style={{ lineHeight: "2" }}> {siswa.name_student} </td>
                        <td style={{ lineHeight: "2" }}> {siswa.nisn} </td>
                      </tr>
                    ))}
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
