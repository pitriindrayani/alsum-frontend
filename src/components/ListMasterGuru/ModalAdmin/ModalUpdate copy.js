import { useEffect, useRef, useState } from "react";
import { Form, Button } from 'reactstrap';
import { API } from "../../../config/api";
import { FaCog, FaTimes, FaTimesCircle, FaEdit, FaSave, FaBan } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../Loader/LoaderAction";
import ToastSuccess from "../../NotificationToast/ToastSuccess";
import axios from "axios";

export default function ModalRoleUpdate(props) {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [getData, setGetData] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(100);
  const [ascending, setAscending] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [getRoleTeacher, setGetRoleTeacher] = useState([]);
  const [getTeacherSchool, setGetTeacherSchool] = useState([]);
  const [getPositionSchool, setGetPositionSchool] = useState([]);
  const [getEducationalStageSchool, setGetEducationalStageSchool] = useState([]);
  const [getBranchesSchool, setGetBranchesSchool] = useState([]);
  const [getSchool, setGetSchool] = useState([]);
  const [getSchedules, setGetSchedules] = useState([]);
  const [getTeacherGroup, setGetTeacherGroup] = useState([]);
  const [teacherStatusRecord, setTeacherStatusRecord] = useState([]);
  const storageLevel = localStorage.getItem('level');
  const storageBranch = localStorage.getItem('ysb_branch_id');
  const fetchDataRef = useRef();
  const safeValue = (value) => value ?? "";

  let fetchParams = {
    headers: { "Authorization": `${token}`, "Content-Type": "application/json" }
  };

  // State to track which row is being edited (store the index or id)
  const [editingRowId, setEditingRowId] = useState(null);
  const [formStatus, setFormStatus] = useState({
    id: "",
    ysb_id_teacher: "",
    nip_ypi: "",
    status_code: "",
    date: ""
  });

  // Fetch data (unchanged)
  const fetchData = async () => {
    try {
      setLoading(true);
      const [roleTeacher, teacher, position, educationalStage, branches, school, schedules, teacherGroup, teacherStatusRecord] = await axios.all([
        API.get(`/api/role-teachers?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/teacher-status?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/positions?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/educational-stages?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/branches?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/schools?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&branch=${storageBranch}&level=${storageLevel}`, fetchParams),
        API.get(`/api/schedules?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/teacher-groups?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}`, fetchParams),
        API.get(`/api/teacher-status-records/array/${props?.dataUpdate?.id}`, fetchParams),
      ]);

      if (roleTeacher.status === 200 && teacher.status === 200 && position.status === 200 && educationalStage.status === 200 && branches.status === 200
        && school.status === 200 && schedules.status === 200 && teacherGroup.status === 200 && teacherStatusRecord.status === 200) {
        setGetRoleTeacher(roleTeacher.data.data);
        setGetTeacherSchool(teacher.data.data);
        setGetPositionSchool(position.data.data);
        setGetEducationalStageSchool(educationalStage.data.data);
        setGetBranchesSchool(branches.data.data);
        setGetSchool(school.data.data);
        setGetSchedules(schedules.data.data);
        setGetTeacherGroup(teacherGroup.data.data);
        setTeacherStatusRecord(teacherStatusRecord.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
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

  // Form state for the modal (unchanged)
  const [form, setForm] = useState({
    id_role: "",
    nip_ypi: "",
    nip_ypi_karyawan: "",
    nik_ysb: "",
    join_date_ypi: "",
    join_date_ysb: "",
    full_name: "",
    nik_ktp: "",
    birthplace: "",
    birthdate: "",
    gender: "",
    employment_status: "",
    ysb_branch_id: "",
    edu_stage: "",
    ysb_school_id: "",
    ysb_position_id: "",
    bidang: "",
    ysb_teacher_group_id: "",
    religion: "",
    addrees: "",
    dom_address: "",
    marriage: "",
    npwp: "",
    ptkp: "",
    university: "",
    major: "",
    degree: "",
    mobile: "",
    email: "",
    password: "",
    bank: "",
    nama_rekening: "",
    no_rekening: "",
    contact_name: "",
    contact_relation: "",
    contact_number: "",
    nuptk: "",
    user_id: "",
    zakat: "",
    fg_active: "",
    finger_id: ""
  });

  useEffect(() => {
    setForm({
      ...form,
      id_role: safeValue(props?.dataUpdate?.user_detail?.id_role),
      nip_ypi: safeValue(props?.dataUpdate?.nip_ypi),
      nip_ypi_karyawan: safeValue(props?.dataUpdate?.nip_ypi_karyawan),
      nik_ysb: safeValue(props?.dataUpdate?.nik_ysb),
      join_date_ypi: safeValue(props?.dataUpdate?.join_date_ypi),
      join_date_ysb: safeValue(props?.dataUpdate?.join_date_ysb),
      full_name: safeValue(props?.dataUpdate?.full_name),
      nik_ktp: safeValue(props?.dataUpdate?.nik_ktp),
      birthplace: safeValue(props?.dataUpdate?.birthplace),
      birthdate: safeValue(props?.dataUpdate?.birthdate),
      gender: safeValue(props?.dataUpdate?.gender),
      employment_status: safeValue(props?.dataUpdate?.employment_status),
      ysb_branch_id: safeValue(props?.dataUpdate?.ysb_branch_id),
      edu_stage: safeValue(props?.dataUpdate?.edu_stage),
      ysb_school_id: safeValue(props?.dataUpdate?.ysb_school_id),
      ysb_position_id: safeValue(props?.dataUpdate?.ysb_position_id),
      bidang: safeValue(props?.dataUpdate?.bidang),
      ysb_teacher_group_id: safeValue(props?.dataUpdate?.ysb_teacher_group_id),
      religion: safeValue(props?.dataUpdate?.religion),
      addrees: safeValue(props?.dataUpdate?.addrees),
      dom_address: safeValue(props?.dataUpdate?.dom_address),
      marriage: safeValue(props?.dataUpdate?.marriage),
      npwp: safeValue(props?.dataUpdate?.npwp),
      ptkp: safeValue(props?.dataUpdate?.ptkp),
      university: safeValue(props?.dataUpdate?.university),
      major: safeValue(props?.dataUpdate?.major),
      degree: safeValue(props?.dataUpdate?.degree),
      mobile: safeValue(props?.dataUpdate?.mobile),
      email: safeValue(props?.dataUpdate?.email),
      bank: safeValue(props?.dataUpdate?.bank),
      nama_rekening: safeValue(props?.dataUpdate?.nama_rekening),
      no_rekening: safeValue(props?.dataUpdate?.no_rekening),
      contact_name: safeValue(props?.dataUpdate?.contact_name),
      contact_relation: safeValue(props?.dataUpdate?.contact_relation),
      contact_number: safeValue(props?.dataUpdate?.contact_number),
      nuptk: safeValue(props?.dataUpdate?.nuptk),
      user_id: safeValue(props?.dataUpdate?.user_id),
      zakat: safeValue(props?.dataUpdate?.zakat),
      fg_active: safeValue(props?.dataUpdate?.fg_active),
      finger_id: safeValue(props?.dataUpdate?.finger_id)
    });
  }, [props]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const response = await API.put(`/api/teachers/${props.id}`, {
        id_role: form?.id_role,
        nip_ypi: form?.nip_ypi,
        nip_ypi_karyawan: form?.nip_ypi_karyawan,
        nik_ysb: form?.nik_ysb,
        join_date_ypi: form?.join_date_ypi,
        join_date_ysb: form?.join_date_ysb,
        full_name: form?.full_name,
        nik_ktp: form?.nik_ktp,
        birthplace: form?.birthplace,
        birthdate: form?.birthdate,
        gender: form?.gender,
        employment_status: form?.employment_status,
        ysb_branch_id: form?.ysb_branch_id,
        edu_stage: form?.edu_stage,
        ysb_school_id: form?.ysb_school_id,
        ysb_position_id: form?.ysb_position_id,
        bidang: form?.bidang,
        ysb_teacher_group_id: form?.ysb_teacher_group_id,
        religion: form?.religion,
        addrees: form?.addrees,
        dom_address: form?.dom_address,
        marriage: form?.marriage,
        npwp: form?.npwp,
        ptkp: form?.ptkp,
        university: form?.university,
        major: form?.major,
        degree: form?.degree,
        mobile: form?.mobile,
        email: form?.email,
        password: form?.password,
        bank: form?.bank,
        nama_rekening: form?.nama_rekening,
        no_rekening: form?.no_rekening,
        contact_name: form?.contact_name,
        contact_relation: form?.contact_relation,
        contact_number: form?.contact_number,
        nuptk: form?.nuptk,
        user_id: form?.user_id,
        zakat: form?.zakat,
        fg_active: form?.fg_active,
        finger_id: form?.finger_id
      }, fetchParams);

      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        });
        props.GetResponseData();
        props.onHide();
        setLoading(false);
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
      setLoading(false);
    }
  });

  const handleChangeStatus = (e) => {
    setFormStatus({
      ...formStatus,
      [e.target.name]: e.target.value,
    });
  };

  // Start editing a specific row
  const handleEditRow = (row, index) => {
    setEditingRowId(index); // Track the row being edited
    setFormStatus({
      id: row.id || "",
      ysb_id_teacher: row.ysb_id_teacher || "",
      nip_ypi: row.nip_ypi || "",
      status_code: row.status_code || "",
      date: row.date || ""
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRowId(null); // Reset editing state
    setFormStatus({
      id: "",
      ysb_id_teacher: "",
      nip_ypi: "",
      status_code: "",
      date: ""
    });
  };

  // Save edited row
  const handleSaveRow = useMutation(async () => {
    try {
      setLoading(true);
      const response = await API.put(`/api/teacher-status-records/${formStatus.id}`, {
        ysb_id_teacher: formStatus.ysb_id_teacher,
        nip_ypi: formStatus.nip_ypi,
        status_code: formStatus.status_code,
        date: formStatus.date
      }, fetchParams);

      if (response?.status === 200) {
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
        });
        // Update local state
        setTeacherStatusRecord((prev) =>
          prev.map((item, i) =>
            i === editingRowId ? { ...item, ...formStatus } : item
          )
        );
        setEditingRowId(null); // Exit edit mode
        setLoading(false);
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response.data.message}`,
        icon: 'error',
        timer: 3000,
        buttons: false
      });
      setLoading(false);
    }
  });

  return (
    <div>
      {loading && <LoaderAction />}
      <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered style={{ fontFamily: "sans-serif", border: "none" }}>
        <div style={{ width: "100%", display: "flex", padding: "10px 0px", backgroundColor: "" }}>
          <div style={{ flex: "92%", fontSize: "20px", display: "flex", alignItems: "center", paddingLeft: "10px", color: "#2e649d", fontWeight: "600" }}>
            Update Guru
          </div>
          <div style={{ flex: "8%", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2e649d" }}>
            <FaTimes onClick={props.onHide} style={{ cursor: "pointer" }} />
          </div>
        </div>
        <Modal.Body style={{ backgroundColor: "", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px", border: "none", backgroundImage: "transparent" }}>
          <Form onSubmit={(e) => handleSubmit.mutate(e)} className="mt-3">
            {/* Other form fields (unchanged) */}
            {/* ... Your existing form fields ... */}

            <table className="table dt-responsive nowrap w-100 mt-4" id="basic-datatable">
              <thead>
                <tr style={{ backgroundColor: "white", borderBottom: "1px solid rgb(214, 214, 214)" }}>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "" }}>NIP YPI</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "" }}>STATUS</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "" }}>TANGGAL</th>
                  <th style={{ fontFamily: "Poppins", fontSize: "12px", color: "#525252", border: "none", textAlign: "center" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {teacherStatusRecord.map((user, index) => (
                  <tr key={index} style={{ fontFamily: "Poppins", fontSize: "11px", textAlign: "center" }}>
                    {editingRowId === index ? (
                      <>
                        <td style={{ lineHeight: "2" }}>
                          <div style={{ display: "flex", textAlign: "left" }}>
                            <input
                              type="text"
                              name="nip_ypi"
                              onChange={handleChangeStatus}
                              value={formStatus.nip_ypi}
                              placeholder="...."
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#818181",
                                padding: "5px 5px 5px 10px",
                                flex: 1,
                                fontSize: "14px",
                                width: "300px"
                              }}
                            />
                          </div>
                        </td>
                        <td style={{ lineHeight: "2" }}>
                          <div style={{ display: "flex", textAlign: "left" }}>
                            <select
                              aria-label="Default select example"
                              onChange={handleChangeStatus}
                              value={formStatus.status_code}
                              name="status_code"
                              style={{
                                color: "#2e649d",
                                cursor: "pointer",
                                border: "2px solid #2e649d",
                                width: "100%",
                                height: "45px",
                                borderRadius: "5px"
                              }}
                            >
                              <option value="" hidden>Status ..</option>
                              {getTeacherSchool.map((status, idx) => (
                                <option key={idx} value={status?.status_code}>
                                  {status?.status} ({status?.status_code})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td style={{ lineHeight: "2" }}>
                          <div style={{ display: "flex", textAlign: "left" }}>
                            <input
                              type="date"
                              name="date"
                              onChange={handleChangeStatus}
                              value={formStatus.date}
                              placeholder="...."
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                outline: "none",
                                color: "#818181",
                                padding: "5px 5px 5px 10px",
                                flex: 1,
                                fontSize: "14px",
                                width: "300px"
                              }}
                            />
                          </div>
                        </td>
                        <td style={{ lineHeight: "2", textAlign: "center" }}>
                          <FaSave
                            onClick={() => handleSaveRow.mutate()}
                            style={{ cursor: "pointer", color: "#2e649d", marginRight: "10px" }}
                          />
                          <FaBan
                            onClick={handleCancelEdit}
                            style={{ cursor: "pointer", color: "#dc3545" }}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ lineHeight: "2" }}>{user.nip_ypi}</td>
                        <td style={{ lineHeight: "2" }}>{user.status_code}</td>
                        <td style={{ lineHeight: "2" }}>{user.date}</td>
                        <td style={{ lineHeight: "2", textAlign: "center" }}>
                          <FaEdit
                            onClick={() => handleEditRow(user, index)}
                            style={{ cursor: "pointer", color: "#2e649d" }}
                          />
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Other form fields (unchanged) */}
            {/* ... Your existing form fields ... */}

            <div style={{ padding: "0px 0px", marginTop: "0px", display: "flex", justifyContent: "end" }}>
              <Button className="mt-3" type="submit" color="primary" block style={{ padding: "8px 10px", fontSize: "12px", borderRadius: "5px" }}>
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}