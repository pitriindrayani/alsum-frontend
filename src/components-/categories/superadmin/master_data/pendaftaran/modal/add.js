import { useState } from "react";
import { Form, Button, Col, Row  } from 'reactstrap';
import { APIUS } from "../../../../../../config/apius";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import LoaderAction from "../../../../../Loader/LoaderHome";
import "../../../../../../index.css";
import ToastSuccess from "../../../../../NotificationToast/ToastSuccess";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalPendaftaranAdd(props) {
  const token = localStorage.getItem("token");
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [form, setForm] = useState({
    nik: "",
    nama_lengkap: "",
    kelas:"",
    tahun_ajaran: "",
    tahun_ajaran_pindahan: "",
    semester: "",
    email_murid: "",
    password:"",
    nama_alias: "", 
    jenis_kelamin: "", 
    file_akte_kelahiran: "", 
    file_kartu_keluarga: "", 
    file_ktp_orang_tua: "", 
    file_raport: "", 
    file_surat_keterangan_asal_sekolah: "", 
    nisn: "", 
    no_kk: "", 
    tempat_lahir: "", 
    tanggal_lahir_siswa: "", 
    agama: "", 
    kewarnegaraan: "", 
    anak_ke: "", 
    jumlah_saudara_kandung: "",
    bahasa_dirumah: "", 
    alamat_lengkap: "", 
    provinsi: "", 
    kota_kabupaten: "", 
    kecamatan: "", 
    kelurahan: "", 
    kode_pos: "", 
    warga_summarecon: "", 
    jarak_rumah_sekolah: "", 
    waktu_tempuh_sekolah: "", 
    ke_sekolah_dengan: "", 
    penyakit_diderita: "", 
    kelainan_jasmani: "", 
    pernah_dirawat_di: "", 
    tinggi: "", 
    berat: "", 
    linkar_kepala: "", 
    ukuran_sepatu: "", 
    sekolah_asal: "", 
    provinsi_asal: "", 
    kota_kabupaten_asal: "", 
    kecamatan_asal: "", 
    kelurahan_desa_asal: "", 
    kode_pos_asal: "", 
    nama_sekolah_asal: "", 
    akreditasi_sekolah_asal: "", 
    pindahan_dari_sekolah: "", 
    nama_lengkap_ayah: "", 
    nik_ayah: "", 
    tempat_lahir_ayah: "", 
    tanggal_lahir_ayah: "", 
    kewarganegaraan_ayah: "", 
    pendidikan_terakhir_ayah: "", 
    pekerjaan_ayah: "", 
    penghasilan_ayah: "", 
    no_handphone_ayah: "", 
    alamat_email_ayah: "", 
    keterangan_ayah: "", 
    nama_lengkap_ibu: "", 
    nik_ibu: "", 
    tempat_lahir_ibu: "", 
    tanggal_lahir_ibu: "",
    kewarnegaraan_ibu: "", 
    pekerjaan_ibu: "", 
    penghasilan_ibu: "", 
    no_handphone_ibu: "", 
    alamat_email_ibu: "", 
    keterangan_ibu: "", 
    bidang_akademik: "", 
    kesenian: "", 
    pendidikan_jasmani: "", 
    lain_lain: "", 
    saudara_kandung_di_sekolah: ""
    
  });

  const {
    nik,
    nama_lengkap,
    kelas,
    tahun_ajaran,
    tahun_ajaran_pindahan,
    semester,
    email_murid,
    password,
    nama_alias, 
    jenis_kelamin, 
    file_akte_kelahiran, 
    file_kartu_keluarga, 
    file_ktp_orang_tua, 
    file_raport, 
    file_surat_keterangan_asal_sekolah, 
    nisn, 
    no_kk, 
    tempat_lahir, 
    tanggal_lahir_siswa, 
    agama, 
    kewarnegaraan, 
    anak_ke, 
    jumlah_saudara_kandung,
    bahasa_dirumah, 
    alamat_lengkap, 
    provinsi, 
    kota_kabupaten, 
    kecamatan, 
    kelurahan, 
    kode_pos, 
    warga_summarecon, 
    jarak_rumah_sekolah, 
    waktu_tempuh_sekolah, 
    ke_sekolah_dengan, 
    penyakit_diderita, 
    kelainan_jasmani, 
    pernah_dirawat_di, 
    tinggi, 
    berat, 
    linkar_kepala, 
    ukuran_sepatu, 
    sekolah_asal, 
    provinsi_asal, 
    kota_kabupaten_asal, 
    kecamatan_asal, 
    kelurahan_desa_asal, 
    kode_pos_asal, 
    nama_sekolah_asal, 
    akreditasi_sekolah_asal, 
    pindahan_dari_sekolah, 
    nama_lengkap_ayah, 
    nik_ayah, 
    tempat_lahir_ayah, 
    tanggal_lahir_ayah, 
    kewarganegaraan_ayah, 
    pendidikan_terakhir_ayah, 
    pekerjaan_ayah, 
    penghasilan_ayah, 
    no_handphone_ayah, 
    alamat_email_ayah, 
    keterangan_ayah, 
    nama_lengkap_ibu, 
    nik_ibu, 
    tempat_lahir_ibu, 
    tanggal_lahir_ibu,
    kewarnegaraan_ibu, 
    pekerjaan_ibu, 
    penghasilan_ibu, 
    no_handphone_ibu, 
    alamat_email_ibu, 
    keterangan_ibu, 
    bidang_akademik, 
    kesenian, 
    pendidikan_jasmani, 
    lain_lain, 
    saudara_kandung_di_sekolah
    
  } = form;

  const handleChange = async (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.type === "radio"? e.target.value : e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await APIUS.post("/api/students/store", {
        nik: form?.nik,
        nama_lengkap: form?.nama_lengkap,
        kelas: form?.kelas,
        tahun_ajaran: form?.tahun_ajaran,
        tahun_ajaran_pindahan: form?.tahun_ajaran_pindahan,
        semester: form?.semester,
        email_murid: form?.email_murid,
        password: form?.password,
        nama_alias: form?. nama_alias,
        jenis_kelamin: form?.jenis_kelamin,
        file_akte_kelahiran: form?.file_akte_kelahiran,
        file_kartu_keluarga: form?.file_kartu_keluarga,
        file_ktp_orang_tua: form?.file_ktp_orang_tua,
        file_raport: form?.file_raport,
        file_surat_keterangan_asal_sekolah: form?.file_surat_keterangan_asal_sekolah,
        nisn: form?.nisn,
        nik: form?.nik,
        no_kk: form?.no_kk, 
        tempat_lahir: form?.tempat_lahir, 
        tanggal_lahir_siswa: form?.tanggal_lahir_siswa, 
        agama: form?.agama, 
        kewarnegaraan: form?.kewarnegaraan, 
        anak_ke: form?.anak_ke,
        jumlah_saudara_kandung: form?.jumlah_saudara_kandung,
        bahasa_dirumah: form?.bahasa_dirumah, 
        alamat_lengkap: form?.alamat_lengkap, 
        provinsi: form?.provinsi,
        kota_kabupaten: form?.kota_kabupaten, 
        kecamatan: form?.kecamatan, 
        kelurahan: form?.kelurahan, 
        kode_pos: form?.kode_pos, 
        warga_summarecon: form?.warga_summarecon, 
        jarak_rumah_sekolah: form?.jarak_rumah_sekolah, 
        waktu_tempuh_sekolah: form?.waktu_tempuh_sekolah, 
        ke_sekolah_dengan: form?.ke_sekolah_dengan, 
        penyakit_diderita: form?.penyakit_diderita, 
        kelainan_jasmani: form?.kelainan_jasmani, 
        pernah_dirawat_di: form?.pernah_dirawat_di, 
        tinggi: form?.tinggi, 
        berat: form?.berat, 
        linkar_kepala: form?.linkar_kepala,
        ukuran_sepatu: form?.ukuran_sepatu, 
        sekolah_asal: form?.sekolah_asal, 
        provinsi_asal: form?.provinsi_asal,
        kota_kabupaten_asal: form?.kota_kabupaten_asal,
        kecamatan_asal: form?.kecamatan_asal,
        kelurahan_desa_asal: form?.kelurahan_desa_asal, 
        kode_pos_asal: form?.kode_pos_asal, 
        nama_sekolah_asal: form?.nama_sekolah_asal, 
        akreditasi_sekolah_asal: form?.akreditasi_sekolah_asal, 
        pindahan_dari_sekolah: form?.pindahan_dari_sekolah, 
        nama_lengkap_ayah: form?.nama_lengkap_ayah, 
        nik_ayah: form?.nik_ayah,
        tempat_lahir_ayah: form?.tempat_lahir_ayah, 
        tanggal_lahir_ayah: form?.tanggal_lahir_ayah, 
        kewarganegaraan_ayah: form?.kewarganegaraan_ayah, 
        pendidikan_terakhir_ayah: form?.pendidikan_terakhir_ayah, 
        pekerjaan_ayah: form?.pekerjaan_ayah, 
        penghasilan_ayah: form?.penghasilan_ayah, 
        no_handphone_ayah: form?.no_handphone_ayah, 
        alamat_email_ayah: form?.alamat_email_ayah, 
        keterangan_ayah: form?.keterangan_ayah, 
        nama_lengkap_ibu: form?.nama_lengkap_ibu, 
        nik_ibu: form?.nik_ibu, 
        tempat_lahir_ibu: form?.tempat_lahir_ibu, 
        tanggal_lahir_ibu: form?.tanggal_lahir_ibu,
        kewarnegaraan_ibu: form?.kewarnegaraan_ibu, 
        pekerjaan_ibu: form?.pekerjaan_ibu, 
        penghasilan_ibu: form?.penghasilan_ibu, 
        no_handphone_ibu: form?.no_handphone_ibu, 
        alamat_email_ibu: form?.alamat_email_ibu, 
        keterangan_ibu: form?.keterangan_ibu, 
        bidang_akademik: form?.bidang_akademik, 
        kesenian: form?.kesenian, 
        pendidikan_jasmani: form?.pendidikan_jasmani, 
        lain_lain: form?.lain_lain, 
        saudara_kandung_di_sekolah: form?.saudara_kandung_di_sekolah,
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
      setLoading(false)
    }
  });

  return (
  <div className="modal">
    {loading && <LoaderAction/>}

    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered backdrop="static" keyboard={false} scrollable>  

      <div className="d-flex header-modal">
        <h5>Tambah Siswa</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
      <Form onSubmit={(e) => handleSubmit.mutate(e)}  >
       
          <Row>
             <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kelas
                </label>
                <input  className="label-input-form"  type='text' name="kelas" onChange={handleChange} value={kelas}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Tahun Ajaran
                </label>
                <input  className="label-input-form"  type='text' name="tahun_ajaran" onChange={handleChange} value={tahun_ajaran}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Tahun Ajaran Pindahan
                </label>
                <input  className="label-input-form"  type='text' name="tahun_ajaran_pindahan" onChange={handleChange} value={tahun_ajaran_pindahan}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Semester
                </label>
                <input  className="label-input-form"  type='text' name="semester" onChange={handleChange} value={semester}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Nomor Induk
                </label>
                <input className="label-input-form"  type='number' name="nik" onChange={handleChange} value={nik}  
                  placeholder='...'/>
                <style>{`input::placeholder { color: #B9B9B9;}`} </style>
              </div>
            </Col>
            <Col md="6">
             <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  NISN
                </label>
                <input className="label-input-form"  type='number' name="nisn" onChange={handleChange} value={nisn}  
                  placeholder='...'/>
                <style>{`input::placeholder { color: #B9B9B9;}`} </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Nama Siswa
                </label>
                <input  className="label-input-form"  type='text' name="nama_lengkap" onChange={handleChange} value={nama_lengkap}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Nama Panggilan
                </label>
                <input  className="label-input-form"  type='text' name="nama_alias" onChange={handleChange} value={nama_alias}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Jenis Kelamin
                </label>
                <input  className="label-input-form"  type='text' name="jenis_kelamin" onChange={handleChange} value={jenis_kelamin}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Tempat Lahir
                </label>
                <input  className="label-input-form"  type='text' name="tempat_lahir" onChange={handleChange} value={tempat_lahir}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Tanggal Lahir
                </label>
                <input  className="label-input-form"  type='text' name="tanggal_lahir_siswa" onChange={handleChange} value={tanggal_lahir_siswa}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Agama
                </label>
                <input  className="label-input-form"  type='text' name="agama" onChange={handleChange} value={agama}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Alamat
                </label>
                <input  className="label-input-form"  type='text' name="alamat_lengkap" onChange={handleChange} value={alamat_lengkap}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Kecamatan
                </label>
                <input  className="label-input-form"  type='text' name="kecamatan" onChange={handleChange} value={kecamatan}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Kelurahan
                </label>
                <input  className="label-input-form"  type='text' name="kelurahan" onChange={handleChange} value={kelurahan}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Kode Pos
                </label>
                <input  className="label-input-form"  type='text' name="kode_pos" onChange={handleChange} value={kode_pos}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Kota/Kabupaten
                </label>
                <input  className="label-input-form"  type='text' name="kota_kabupaten" onChange={handleChange} value={kota_kabupaten}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
             <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Provinsi
                </label>
                <input  className="label-input-form"  type='text' name="provinsi" onChange={handleChange} value={provinsi}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Kewarganegaraan
                </label>
                <input  className="label-input-form"  type='text' name="kewarnegaraan" onChange={handleChange} value={kewarnegaraan}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  No Kartu Keluarga
                </label>
                <input  className="label-input-form"  type='text' name="no_kk" onChange={handleChange} value={no_kk}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Anak Ke
                </label>
                <input  className="label-input-form"  type='text' name="anak_ke" onChange={handleChange} value={anak_ke}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Jumlah Saudara Kandung
                </label>
                <input  className="label-input-form"  type='text' name="jumlah_saudara_kandung" onChange={handleChange} value={jumlah_saudara_kandung}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Bahasa Di Rumah
                </label>
                <input  className="label-input-form"  type='text' name="bahasa_dirumah" onChange={handleChange} value={bahasa_dirumah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Warga Summarecon
                </label>
                <input  className="label-input-form"  type='text' name="warga_summarecon" onChange={handleChange} value={warga_summarecon}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                 Jarak Rumah Sekolah
                </label>
                <input  className="label-input-form"  type='text' name="jarak_rumah_sekolah" onChange={handleChange} value={jarak_rumah_sekolah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Waktu Tempuh Sekolah
                </label>
                <input  className="label-input-form"  type='text' name="waktu_tempuh_sekolah" onChange={handleChange} value={waktu_tempuh_sekolah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Ke Sekolah Dengan
                </label>
                <input  className="label-input-form"  type='text' name="ke_sekolah_dengan" onChange={handleChange} value={ke_sekolah_dengan}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Penyakit Diderita
                </label>
                <input  className="label-input-form"  type='text' name="penyakit_diderita" onChange={handleChange} value={penyakit_diderita}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kelainan Jasmani
                </label>
                <input  className="label-input-form"  type='text' name="kelainan_jasmani" onChange={handleChange} value={kelainan_jasmani}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Pernah Dirawat di
                </label>
                <input  className="label-input-form"  type='text' name="pernah_dirawat_di" onChange={handleChange} value={pernah_dirawat_di}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Tinggi
                </label>
                <input  className="label-input-form"  type='text' name="tinggi" onChange={handleChange} value={tinggi}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Berat Badan
                </label>
                <input  className="label-input-form"  type='text' name="berat" onChange={handleChange} value={berat}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Lingkar Kepala
                </label>
                <input  className="label-input-form"  type='text' name="linkar_kepala" onChange={handleChange} value={linkar_kepala}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Ukuran Sepatu
                </label>
                <input  className="label-input-form"  type='text' name="ukuran_sepatu" onChange={handleChange} value={ukuran_sepatu}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Sekolah Asal
                </label>
                <input  className="label-input-form"  type='text' name="sekolah_asal" onChange={handleChange} value={sekolah_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Provinsi Asal
                </label>
                <input  className="label-input-form"  type='text' name="provinsi_asal" onChange={handleChange} value={provinsi_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                kota_kabupaten_asal
                </label>
                <input  className="label-input-form"  type='text' name="kota_kabupaten_asal" onChange={handleChange} value={kota_kabupaten_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kecamatan Asal
                </label>
                <input  className="label-input-form"  type='text' name="kecamatan_asal" onChange={handleChange} value={kecamatan_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kelurahan Desa Asal
                </label>
                <input  className="label-input-form"  type='text' name="kelurahan_desa_asal" onChange={handleChange} value={kelurahan_desa_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kode Pos Asal
                </label>
                <input  className="label-input-form"  type='text' name="kode_pos_asal" onChange={handleChange} value={kode_pos_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Nama Sekolah Asal
                </label>
                <input  className="label-input-form"  type='text' name="nama_sekolah_asal" onChange={handleChange} value={nama_sekolah_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Akreditasi Sekolah Asal
                </label>
                <input  className="label-input-form"  type='text' name="akreditasi_sekolah_asal" onChange={handleChange} value={akreditasi_sekolah_asal}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Pindahan Dari Sekolah
                </label>
                <input  className="label-input-form"  type='text' name="pindahan_dari_sekolah" onChange={handleChange} value={pindahan_dari_sekolah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Nama Lengkap Ayah
                </label>
                <input  className="label-input-form"  type='text' name="nama_lengkap_ayah" onChange={handleChange} value={nama_lengkap_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                NIK Ayah
                </label>
                <input  className="label-input-form"  type='text' name="nik_ayah" onChange={handleChange} value={nik_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Tempat Lahir Ayah
                </label>
                <input  className="label-input-form"  type='text' name="tempat_lahir_ayah" onChange={handleChange} value={tempat_lahir_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Tanggal Lahir Ayah
                </label>
                <input  className="label-input-form"  type='text' name="tanggal_lahir_ayah" onChange={handleChange} value={tanggal_lahir_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Kewarganegaraan Ayah
                </label>
                <input  className="label-input-form"  type='text' name="kewarganegaraan_ayah" onChange={handleChange} value={kewarganegaraan_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Pendidikan Terakhir Ayah
                </label>
                <input  className="label-input-form"  type='text' name="pendidikan_terakhir_ayah" onChange={handleChange} value={pendidikan_terakhir_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Pekerjaan Ayah
                </label>
                <input  className="label-input-form"  type='text' name="pekerjaan_ayah" onChange={handleChange} value={pekerjaan_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col><Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Penghasilan Ayah
                </label>
                <input  className="label-input-form"  type='text' name="penghasilan_ayah" onChange={handleChange} value={penghasilan_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col><Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                Pendidikan Terakhir Ayah
                </label>
                <input  className="label-input-form"  type='text' name="pendidikan_terakhir_ayah" onChange={handleChange} value={pendidikan_terakhir_ayah}  
                  placeholder='...' />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
           
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Email
                </label>
                <input  className="label-input-form"  type='email' name="email_murid" onChange={handleChange} value={email_murid}  
                  placeholder='...'  />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
            <Col md="6">
              <div className="mt-4 label-group-form" >
                <label className="label-name-form">
                  Password
                </label>
                <input  className="label-input-form" type='password' name="password" onChange={handleChange} value={password}  
                  placeholder='...'  />
                <style>{`input::placeholder { color: #B9B9B9;}`}
                </style>
              </div>
            </Col>
          </Row>
         
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
  