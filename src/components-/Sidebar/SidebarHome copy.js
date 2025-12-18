import {React, useState} from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {FaDotCircle} from "react-icons/fa";
import {  useNavigate, Link, useLocation } from "react-router-dom";
import "./Sidebar.css"
import { setAuthToken } from '../../config/api';
// import Logo from "../../assets/logo-dashboard.png";
// import Logo from "../../assets/logo.png";
import Logo from "../../assets/logo-dash.png";
import Arrow from "../../assets/arrow.png";
import App from "../../assets/app.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-regular-svg-icons'
import { useMediaQuery } from 'react-responsive'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function SidebarHome(){

  const navigate = useNavigate();
  const storageItems = JSON.parse(localStorage.getItem('menus'));
  const levelUser = localStorage.getItem('level');

  const navigateHome = ()=>{
    navigate("/dashboard");
  };

  // Responsive to mobile or dekstop
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const location = useLocation();

const dummySidebar1= [
  {
    "level" : "developer",
    "aplikasi": [
                  {
                    "kategori_aplikasi_id" : "1",
                    "nama_aplikasi" : "Siakad",
                    "modules" : [
                                {
                                  "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
                                  "name": "Laporan Adab",
                                  "slug_name": "data",
                                  "icon_name": "fa fa-file-text-o",
                                  "color_icon": "#7F8FDF",
                                  "number_order": 1,
                                  "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "created_at": "2024-12-23 09:53:30",
                                  "updated_at": "2025-08-26 04:21:13",
                                  "menus": [
                                            {
                                              "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
                                              "name": "Beranda",
                                              "slug_name": "daftar_pengguna",
                                              "show": 0,
                                              "url": "/on-dev",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 15,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": null,
                                              "created_at": "2025-09-02 01:41:26",
                                              "updated_at": "2025-09-02 01:41:26"
                                            },
                                            {
                                              "id": "6287d66b-e858-4126-97ef-e93007390383",
                                              "name": "Nama Menu",
                                              "slug_name": "Nama_Menu",
                                              "show": 0,
                                              "url": "/on-dev1",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 14,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2025-09-02 01:34:55",
                                              "updated_at": "2025-09-02 02:05:33"
                                            },
                              
                                          ]
                                },
                                {
                                  "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
                                  "name": "LMS",
                                  "slug_name": "data",
                                  "icon_name": "fa fa-leanpub",
                                  "color_icon": "#7F8FDF",
                                  "number_order": 1,
                                  "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "created_at": "2024-12-23 09:53:30",
                                  "updated_at": "2025-08-26 04:21:13",
                                  "menus": [
                                            {
                                                "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
                                                "name": "Beranda",
                                                "slug_name": "daftar_pengguna",
                                                "show": 0,
                                                "url": "/on-dev2",
                                                "icon": "fa fa-user",
                                                "color_icon": null,
                                                "number_order": 15,
                                                "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                                "update_by": null,
                                                "created_at": "2025-09-02 01:41:26",
                                                "updated_at": "2025-09-02 01:41:26"
                                            },
                                            {
                                                "id": "6287d66b-e858-4126-97ef-e93007390383",
                                                "name": "Nama Menu",
                                                "slug_name": "karyawan",
                                                "show": 0,
                                                "url": "/on-dev3",
                                                "icon": "fa fa-user",
                                                "color_icon": null,
                                                "number_order": 14,
                                                "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                                "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                                "created_at": "2025-09-02 01:34:55",
                                                "updated_at": "2025-09-02 02:05:33"
                                            },
                              
                                          ]
                                },
                                
                              ]
                  },
                  {
                    "kategori_aplikasi_id" : "2",
                    "nama_aplikasi" : "Operasional",
                    "modules" : [ 
                                {
                                  "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
                                  "name": "QR Patrol",
                                  "slug_name": "data",
                                  "icon_name": "fa fa-user-secret",
                                  "color_icon": "#7F8FDF",
                                  "number_order": 1,
                                  "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "created_at": "2024-12-23 09:53:30",
                                  "updated_at": "2025-08-26 04:21:13",
                                  "menus": [
                                        {
                                          "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
                                          "name": "Beranda",
                                          "slug_name": "beranda_patrol",
                                          "show": 0,
                                          "url": "/beranda-patrol",
                                          "icon": "fa fa-user",
                                          "color_icon": null,
                                          "number_order": 15,
                                          "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                          "update_by": null,
                                          "created_at": "2025-09-02 01:41:26",
                                          "updated_at": "2025-09-02 01:41:26"
                                        },
                                        {
                                          "id": "2e4abb41-0659-48e7-92e2-db8d134457db1",
                                          "name": "List Titik Pemeriksaan",
                                          "slug_name": "list_titik_pemeriksaan",
                                          "show": 0,
                                          "url": "/list-check-points",
                                          "icon": "fa fa-user",
                                          "color_icon": null,
                                          "number_order": 15,
                                          "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                          "update_by": null,
                                          "created_at": "2025-09-02 01:41:26",
                                          "updated_at": "2025-09-02 01:41:26"
                                        },
                                        {
                                            "id": "6287d66b-e858-4126-97ef-e93007390383",
                                            "name": "Catatan Pemeriksaan ",
                                            "slug_name": "catatan_pemeriksaan",
                                            "show": 0,
                                            "url": "/inspection-notes",
                                            "icon": "fa fa-user",
                                            "color_icon": null,
                                            "number_order": 14,
                                            "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                            "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                            "created_at": "2025-09-02 01:34:55",
                                            "updated_at": "2025-09-02 02:05:33"
                                        },
                                      
                                    ]
                                  },
                                  {
                                    "id": "8eff7b32-8de5-4d6e-859f-74da4a7f507c",
                                    "name": "Pembayaran",
                                    "slug_name": "privilege",
                                    "icon_name": "fa fa-money",
                                    "color_icon": "#7F00FF",
                                    "number_order": 2,
                                    "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                    "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                    "created_at": "2024-07-16 13:09:45",
                                    "updated_at": "2025-08-26 04:21:54",
                                    "menus": [
                                        {
                                          "id": "1456d5d4-deb7-44f9-8be9-5c65bc3d79d2",
                                          "name": "Beranda",
                                          "slug_name": "menu",
                                          "show": 1,
                                          "url": "/on-dev4",
                                          "icon": "fa fa-user",
                                          "color_icon": "black",
                                          "number_order": 5,
                                          "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                          "update_by": null,
                                          "created_at": "2024-07-16 10:00:53",
                                          "updated_at": "2024-07-16 10:00:53"
                                        },
                                        {
                                          "id": "f302f7eb-7341-476f-8003-2796d8f39322",
                                          "name": "Nama Menu",
                                          "slug_name": "module",
                                          "show": 1,
                                          "url": "/on-dev5",
                                          "icon": "fa fa-user",
                                          "color_icon": "black",
                                          "number_order": 4,
                                          "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                          "update_by": null,
                                          "created_at": "2024-07-16 09:59:50",
                                          "updated_at": "2024-07-16 09:59:50"
                                        }
                                    ]
                                  }
                              ]
                  },
                  {
                    "kategori_aplikasi_id" : "3",
                    "nama_aplikasi" : "Super Admin",
                    "modules" : [
                                {
                                  "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
                                  "name": "Master Data",
                                  "slug_name": "data",
                                  "icon_name": "fa fa-database",
                                  "color_icon": "#7F8FDF",
                                  "number_order": 1,
                                  "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "created_at": "2024-12-23 09:53:30",
                                  "updated_at": "2025-08-26 04:21:13",
                                  "menus": [
                                      // {
                                      //     "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
                                      //     "name": "Daftar Pengguna",
                                      //     "slug_name": "daftar_pengguna",
                                      //     "show": 0,
                                      //     "url": "/users",
                                      //     "icon": "fa fa-user",
                                      //     "color_icon": null,
                                      //     "number_order": 15,
                                      //     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                      //     "update_by": null,
                                      //     "created_at": "2025-09-02 01:41:26",
                                      //     "updated_at": "2025-09-02 01:41:26"
                                      // },
                                          
                                          {
                                              "id": "6287d66b-e858-4126-97ef-e93007390383",
                                              "name": "Karyawan",
                                              "slug_name": "karyawan",
                                              "show": 0,
                                              "url": "/employees",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 14,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2025-09-02 01:34:55",
                                              "updated_at": "2025-09-02 02:05:33"
                                          },
                                          {
                                              "id": "8d6de10a-5e22-4ba5-afa5-da581f9088af",
                                              "name": "Siswa",
                                              "slug_name": "siswa",
                                              "show": 0,
                                              "url": "/students",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 3,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": null,
                                              "created_at": "2025-09-02 01:31:03",
                                              "updated_at": "2025-09-02 01:31:03"
                                          },
                                          {
                                              "id": "09d44113-214a-4866-af52-f54e4b79c571",
                                              "name": "Guru",
                                              "slug_name": "guru",
                                              "show": 1,
                                              "url": "/teachers",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 123,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2025-01-15 10:55:35",
                                              "updated_at": "2025-08-27 02:55:36"
                                          },
                                          {
                                              "id": "650cee05-fbf0-45bf-a8a1-a06ca9e66a65",
                                              "name": "Departemen",
                                              "slug_name": "departemen",
                                              "show": 1,
                                              "url": "/department",
                                              "icon": "-",
                                              "color_icon": null,
                                              "number_order": 16,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": null,
                                              "created_at": "2025-09-06 02:59:12",
                                              "updated_at": "2025-09-06 02:59:12"
                                          },
                                          {
                                              "id": "1f4b5d23-d942-4d02-8216-ad5cb49a8ab1",
                                              "name": "Cabang",
                                              "slug_name": "cabang",
                                              "show": 1,
                                              "url": "/cabang",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 11,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2024-12-26 07:40:33",
                                              "updated_at": "2025-08-28 09:14:21"
                                          },
                                          {
                                              "id": "b5e18b18-8a58-40de-a050-0d145752295a",
                                              "name": "Sekolah",
                                              "slug_name": "sekolah",
                                              "show": 1,
                                              "url": "/schools",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 10,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2024-12-23 10:57:48",
                                              "updated_at": "2025-09-02 02:19:07"
                                          },
                                          {
                                              "id": "b9463b0d-3c53-4b93-915d-86e0594c0982",
                                              "name": "Jenjang",
                                              "slug_name": "jenjang",
                                              "show": 1,
                                              "url": "/educational-level",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 9,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2024-12-23 10:57:15",
                                              "updated_at": "2025-09-02 01:29:15"
                                          },
                                          {
                                              "id": "b9463b0d-3c53-4b93-915d-86e0594c09821",
                                              "name": "Ruangan",
                                              "slug_name": "ruangan",
                                              "show": 1,
                                              "url": "/ruangan",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 9,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2024-12-23 10:57:15",
                                              "updated_at": "2025-09-02 01:29:15"
                                          },
                                          {
                                              "id": "b9463b0d-3c53-4b93-915d-86e0594c098a21",
                                              "name": "Lantai",
                                              "slug_name": "Lantai",
                                              "show": 1,
                                              "url": "/lantai",
                                              "icon": "fa fa-user",
                                              "color_icon": null,
                                              "number_order": 9,
                                              "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                              "created_at": "2024-12-23 10:57:15",
                                              "updated_at": "2025-09-02 01:29:15"
                                          }
                                    ]
                                },
                                {
                                  "id": "8eff7b32-8de5-4d6e-859f-74da4a7f507c",
                                  "name": "Privilege",
                                  "slug_name": "privilege",
                                  "icon_name": "fa fa-key",
                                  "color_icon": "#7F00FF",
                                  "number_order": 2,
                                  "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                  "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                  "created_at": "2024-07-16 13:09:45",
                                  "updated_at": "2025-08-26 04:21:54",
                                  "menus": [
                                            {
                                                "id": "1456d5d4-deb7-44f9-8be9-5c65bc3d79d2",
                                                "name": "Menu",
                                                "slug_name": "menu",
                                                "show": 1,
                                                "url": "/privileges/menus",
                                                "icon": "fa fa-user",
                                                "color_icon": "black",
                                                "number_order": 5,
                                                "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                                "update_by": null,
                                                "created_at": "2024-07-16 10:00:53",
                                                "updated_at": "2024-07-16 10:00:53"
                                            },
                                            {
                                                "id": "f302f7eb-7341-476f-8003-2796d8f39322",
                                                "name": "Module",
                                                "slug_name": "module",
                                                "show": 1,
                                                "url": "/privileges/modules",
                                                "icon": "fa fa-user",
                                                "color_icon": "black",
                                                "number_order": 4,
                                                "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                                "update_by": null,
                                                "created_at": "2024-07-16 09:59:50",
                                                "updated_at": "2024-07-16 09:59:50"
                                            },
                                            {
                                                "id": "f302f7eb-7341-476f-8003-2796d8f39322",
                                                "name": "Apps",
                                                "slug_name": "aplikasi",
                                                "show": 1,
                                                "url": "/privileges/apps",
                                                "icon": "fa fa-user",
                                                "color_icon": "black",
                                                "number_order": 4,
                                                "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                                "update_by": null,
                                                "created_at": "2024-07-16 09:59:50",
                                                "updated_at": "2024-07-16 09:59:50"
                                            },
                                            {
                                                "id": "190dd7a3-e0de-48bb-b0bf-0b1b8f0867bc",
                                                "name": "Role",
                                                "slug_name": "role",
                                                "show": 1,
                                                "url": "/privileges/roles",
                                                "icon": "fa fa-user",
                                                "color_icon": "black",
                                                "number_order": 2,
                                                "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                                "update_by": null,
                                                "created_at": "2024-07-16 09:58:12",
                                                "updated_at": "2024-07-16 09:58:12"
                                            },
                                            {
                                                "id": "c82da5f5-5f88-44d0-a593-9146b53cad42",
                                                "name": "User Privilege",
                                                "slug_name": "user_privilege",
                                                "show": 1,
                                                "url": "/privileges/users",
                                                "icon": "fa fa-user",
                                                "color_icon": "black",
                                                "number_order": 1,
                                                "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
                                                "update_by": null,
                                                "created_at": "2024-07-16 09:56:32",
                                                "updated_at": "2024-07-16 09:56:32"
                                            }
                                      ]
                                  },
                                  {
                                    "id": "02dd0137-c07f-470a-a0fd-2b7fc418990b",
                                    "name": "Sistem",
                                    "slug_name": "system",
                                    "icon_name": "fa fa-microchip",
                                    "color_icon": "#44EC82",
                                    "number_order": 3,
                                    "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                    "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                    "created_at": "2025-04-16 14:35:01",
                                    "updated_at": "2025-08-26 04:22:00",
                                    "menus": [
                                          {
                                            "id": "95dde436-9531-461d-8e1b-a6a304791a61",
                                            "name": "Ganti Password",
                                            "slug_name": "ganti_password",
                                            "show": 1,
                                            "url": "/change-password",
                                            "icon": "fa fa-key",
                                            "color_icon": null,
                                            "number_order": 26,
                                            "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
                                            "update_by": null,
                                            "created_at": "2025-04-16 14:35:51",
                                            "updated_at": "2025-04-16 14:35:51"
                                          }
                                      ]
                                    }
                                ]
                    }

                ] 
  }
]

// const dummySidebar2 = [
  
//   {
//     "level": "user",
//     "aplikasi": "Siakad",
//     "modules": [
//                 {
//                     "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
//                     "name": "Laporan Adab",
//                     "slug_name": "data",
//                     "icon_name": "fa fa-file-text-o",
//                     "color_icon": "#7F8FDF",
//                     "number_order": 1,
//                     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-12-23 09:53:30",
//                     "updated_at": "2025-08-26 04:21:13",
//                     "menus": [
//                         {
//                             "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
//                             "name": "Menu 1",
//                             "slug_name": "daftar_pengguna",
//                             "show": 0,
//                             "url": "/on-dev",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 15,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-09-02 01:41:26",
//                             "updated_at": "2025-09-02 01:41:26"
//                         },
//                         {
//                             "id": "6287d66b-e858-4126-97ef-e93007390383",
//                             "name": "Menu 1",
//                             "slug_name": "karyawan",
//                             "show": 0,
//                             "url": "/on-dev1",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 14,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2025-09-02 01:34:55",
//                             "updated_at": "2025-09-02 02:05:33"
//                         },
                        
//                     ]
//                 },
//               {
//                     "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
//                     "name": "LMS",
//                     "slug_name": "data",
//                     "icon_name": "fa fa-leanpub",
//                     "color_icon": "#7F8FDF",
//                     "number_order": 1,
//                     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-12-23 09:53:30",
//                     "updated_at": "2025-08-26 04:21:13",
//                     "menus": [
//                         {
//                             "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
//                             "name": "Beranda",
//                             "slug_name": "daftar_pengguna",
//                             "show": 0,
//                             "url": "/on-dev2",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 15,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-09-02 01:41:26",
//                             "updated_at": "2025-09-02 01:41:26"
//                         },
//                         {
//                             "id": "6287d66b-e858-4126-97ef-e93007390383",
//                             "name": "Nama Menu",
//                             "slug_name": "karyawan",
//                             "show": 0,
//                             "url": "/on-dev3",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 14,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2025-09-02 01:34:55",
//                             "updated_at": "2025-09-02 02:05:33"
//                         },
                        
//                     ]
//                 }
//             ]
//   },
//   {
//     "aplikasi": "Operasional",
//     "modules": [
//                 {
//                     "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
//                     "name": "QR Patrol",
//                     "slug_name": "data",
//                     "icon_name": "fa fa-user-secret",
//                     "color_icon": "#7F8FDF",
//                     "number_order": 1,
//                     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-12-23 09:53:30",
//                     "updated_at": "2025-08-26 04:21:13",
//                     "menus": [
//                         {
//                             "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
//                             "name": "Beranda",
//                             "slug_name": "daftar_pengguna",
//                             "show": 0,
//                             "url": "/beranda-patrol",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 15,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-09-02 01:41:26",
//                             "updated_at": "2025-09-02 01:41:26"
//                         },
//                         {
//                             "id": "6287d66b-e858-4126-97ef-e93007390383",
//                             "name": "Titik Pemeriksaan ",
//                             "slug_name": "titik_pemeriksaan",
//                             "show": 0,
//                             "url": "/log-check-points",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 14,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2025-09-02 01:34:55",
//                             "updated_at": "2025-09-02 02:05:33"
//                         },
                        
//                     ]
//                 },
//                 {
//                     "id": "8eff7b32-8de5-4d6e-859f-74da4a7f507c",
//                     "name": "Pembayaran",
//                     "slug_name": "privilege",
//                     "icon_name": "fa fa-money",
//                     "color_icon": "#7F00FF",
//                     "number_order": 2,
//                     "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-07-16 13:09:45",
//                     "updated_at": "2025-08-26 04:21:54",
//                     "menus": [
//                         {
//                             "id": "1456d5d4-deb7-44f9-8be9-5c65bc3d79d2",
//                             "name": "Beranda",
//                             "slug_name": "menu",
//                             "show": 1,
//                             "url": "/on-dev4",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 5,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 10:00:53",
//                             "updated_at": "2024-07-16 10:00:53"
//                         },
//                         {
//                             "id": "f302f7eb-7341-476f-8003-2796d8f39322",
//                             "name": "Nama Menu",
//                             "slug_name": "module",
//                             "show": 1,
//                             "url": "/on-dev5",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 4,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 09:59:50",
//                             "updated_at": "2024-07-16 09:59:50"
//                         }
//                     ]
//                 }
//             ]
//   },
//   // --------------------------------------------------------------------------------------
//   {
//     "level": "developer",
//     "aplikasi": "Super Admin",
//     "modules": [
//                 {
//                     "id": "8c20d7ca-8bf7-41d5-85ac-1a9fc18847b1",
//                     "name": "Master Data",
//                     "slug_name": "data",
//                     "icon_name": "fa fa-database",
//                     "color_icon": "#7F8FDF",
//                     "number_order": 1,
//                     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-12-23 09:53:30",
//                     "updated_at": "2025-08-26 04:21:13",
//                     "menus": [
//                         // {
//                         //     "id": "2e4abb41-0659-48e7-92e2-db8d134457db",
//                         //     "name": "Daftar Pengguna",
//                         //     "slug_name": "daftar_pengguna",
//                         //     "show": 0,
//                         //     "url": "/users",
//                         //     "icon": "fa fa-user",
//                         //     "color_icon": null,
//                         //     "number_order": 15,
//                         //     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                         //     "update_by": null,
//                         //     "created_at": "2025-09-02 01:41:26",
//                         //     "updated_at": "2025-09-02 01:41:26"
//                         // },
//                          {
//                             "id": "650cee05-fbf0-45bf-a8a1-a06ca9e66a65",
//                             "name": "Department",
//                             "slug_name": "department",
//                             "show": 1,
//                             "url": "/department",
//                             "icon": "-",
//                             "color_icon": null,
//                             "number_order": 16,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-09-06 02:59:12",
//                             "updated_at": "2025-09-06 02:59:12"
//                         },
//                         {
//                             "id": "6287d66b-e858-4126-97ef-e93007390383",
//                             "name": "Karyawan",
//                             "slug_name": "karyawan",
//                             "show": 0,
//                             "url": "/employees",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 14,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2025-09-02 01:34:55",
//                             "updated_at": "2025-09-02 02:05:33"
//                         },
//                         {
//                             "id": "8d6de10a-5e22-4ba5-afa5-da581f9088af",
//                             "name": "Siswa",
//                             "slug_name": "siswa",
//                             "show": 0,
//                             "url": "/students",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 3,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-09-02 01:31:03",
//                             "updated_at": "2025-09-02 01:31:03"
//                         },
//                         {
//                             "id": "09d44113-214a-4866-af52-f54e4b79c571",
//                             "name": "Guru",
//                             "slug_name": "guru",
//                             "show": 1,
//                             "url": "/teachers",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 123,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2025-01-15 10:55:35",
//                             "updated_at": "2025-08-27 02:55:36"
//                         },
//                         {
//                             "id": "1f4b5d23-d942-4d02-8216-ad5cb49a8ab1",
//                             "name": "Cabang",
//                             "slug_name": "cabang",
//                             "show": 1,
//                             "url": "/cabang",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 11,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2024-12-26 07:40:33",
//                             "updated_at": "2025-08-28 09:14:21"
//                         },
//                         {
//                             "id": "b5e18b18-8a58-40de-a050-0d145752295a",
//                             "name": "Sekolah",
//                             "slug_name": "sekolah",
//                             "show": 1,
//                             "url": "/schools",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 10,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2024-12-23 10:57:48",
//                             "updated_at": "2025-09-02 02:19:07"
//                         },
//                         {
//                             "id": "b9463b0d-3c53-4b93-915d-86e0594c0982",
//                             "name": "Jenjang",
//                             "slug_name": "jenjang",
//                             "show": 1,
//                             "url": "/educational-level",
//                             "icon": "fa fa-user",
//                             "color_icon": null,
//                             "number_order": 9,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "created_at": "2024-12-23 10:57:15",
//                             "updated_at": "2025-09-02 01:29:15"
//                         }
//                     ]
//                 },
//                 {
//                     "id": "8eff7b32-8de5-4d6e-859f-74da4a7f507c",
//                     "name": "Privilege",
//                     "slug_name": "privilege",
//                     "icon_name": "fa fa-key",
//                     "color_icon": "#7F00FF",
//                     "number_order": 2,
//                     "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2024-07-16 13:09:45",
//                     "updated_at": "2025-08-26 04:21:54",
//                     "menus": [
//                         {
//                             "id": "1456d5d4-deb7-44f9-8be9-5c65bc3d79d2",
//                             "name": "Menu",
//                             "slug_name": "menu",
//                             "show": 1,
//                             "url": "/privileges/menus",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 5,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 10:00:53",
//                             "updated_at": "2024-07-16 10:00:53"
//                         },
//                         {
//                             "id": "f302f7eb-7341-476f-8003-2796d8f39322",
//                             "name": "Module",
//                             "slug_name": "module",
//                             "show": 1,
//                             "url": "/privileges/modules",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 4,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 09:59:50",
//                             "updated_at": "2024-07-16 09:59:50"
//                         },
//                         {
//                             "id": "190dd7a3-e0de-48bb-b0bf-0b1b8f0867bc",
//                             "name": "Role",
//                             "slug_name": "role",
//                             "show": 1,
//                             "url": "/privileges/roles",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 2,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 09:58:12",
//                             "updated_at": "2024-07-16 09:58:12"
//                         },
//                         {
//                             "id": "c82da5f5-5f88-44d0-a593-9146b53cad42",
//                             "name": "User Privilege",
//                             "slug_name": "user_privilege",
//                             "show": 1,
//                             "url": "/privileges/users",
//                             "icon": "fa fa-user",
//                             "color_icon": "black",
//                             "number_order": 1,
//                             "create_by": "08b61cf0-e8ed-4b19-a2e8-611cc8dbc93a",
//                             "update_by": null,
//                             "created_at": "2024-07-16 09:56:32",
//                             "updated_at": "2024-07-16 09:56:32"
//                         }
//                     ]
//                 },
//                 {
//                     "id": "02dd0137-c07f-470a-a0fd-2b7fc418990b",
//                     "name": "System",
//                     "slug_name": "system",
//                     "icon_name": "fa fa-microchip",
//                     "color_icon": "#44EC82",
//                     "number_order": 3,
//                     "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "update_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                     "created_at": "2025-04-16 14:35:01",
//                     "updated_at": "2025-08-26 04:22:00",
//                     "menus": [
//                         {
//                             "id": "95dde436-9531-461d-8e1b-a6a304791a61",
//                             "name": "Ganti Password",
//                             "slug_name": "ganti_password",
//                             "show": 1,
//                             "url": "/change-password",
//                             "icon": "fa fa-key",
//                             "color_icon": null,
//                             "number_order": 26,
//                             "create_by": "ae87aa00-d9ce-4782-8650-d82538df87ad",
//                             "update_by": null,
//                             "created_at": "2025-04-16 14:35:51",
//                             "updated_at": "2025-04-16 14:35:51"
//                         }
//                     ]
//                 }
//             ]
//   },
// ];



  return (

  <Sidebar backgroundColor='#4368c5'  className='sidebar' style={{width:"100%",height:"100%",position:"",border:"none", color:"#fff" }}>
    <Menu 
    >
     
    {isTabletOrMobile ? 
    // SIDEBAR MOBILE
        <>
          {/* <div className='logo-dashboard' style={{paddingBottom:"15px",  borderBottom: "1px solid #6a6ac9ff" }}>
            <img src={Logo} onClick={navigateHome}  />
          </div> */}
          
          <MenuItem 
            className='dash-side'
                // onClick={navigateHome}  
                href="/dashboard"
                style={{fontSize:"14px", paddingLeft: "16px", }}> 
                <FontAwesomeIcon icon={faHouse}/> 
                <span style={{paddingLeft: "9px", }}>
                Halaman Utama </span>
          </MenuItem>
        
          {dummySidebar1?.map((item, index) => (
            (item.url === "" || item.url == null) ? (
              (item.name === "User Previlege" && levelUser !== "developer") ? (
              <></>
              ) : (
                  <div >
                    {item.aplikasi.map((aplikasi, index) => (
                      <div>
                        <div className='app-name' key={index} >
                          <img src={App} className='icon-app' /> {aplikasi.nama_aplikasi}
                        </div>

                        {aplikasi.modules.map((module) => (
                            <SubMenu   className='menu-module'   label={module.name}  style={{paddingLeft:"20px", height:"5vh"}} 
                            icon={<i className={module.icon_name} style={{marginRight:"-20px"}}/>}>
                            
                              {module.menus.map((itemss) => (

                                
                                <MenuItem  
                                      className="menu-item "  
                                      href={itemss.url}
                                      // component={<Link to={{ pathname: `${itemss.url}`}}/>}
                                      active={window.location.pathname === `${itemss.url}`}
                                      style={{height:"4vh", fontSize:"13px", paddingLeft: "62px", backgroundColor:'#4368c5'}}>
                                      <img src={Arrow} className='icon-arrow' style={{marginRight:"6px"}} /> {itemss.name}
                                    </MenuItem> 
                                
                              ))}
                            </SubMenu>

                        ))}
                      </div>
                    ))}
                    
                  </div>
                  )
              ) : (
                <MenuItem 
                  className="menu-item" 
                  // component={<Link to={{ pathname: `${item.url}`}}/>}
                  href={item.url}
                  active={window.location.pathname === `${item.url}`}
                  style={{fontFamily: "sans-serif", marginLeft: "0px"}} 
                  icon={<i className={item.icon_name} 
                  style={{marginLeft: "15px", color:"#666666", fontSize: "20px"}} />}>
                  {item.name}
                </MenuItem>
                
            )
          ))}
                              
                                          
        </>
        : 
        <>
        {/* SIDEBAR DESKTOP */}
        <div className='logo-dashboard' style={{paddingBottom:"15px",  borderBottom: "1px solid #6a6ac9ff" }}>
            <img src={Logo} onClick={navigateHome}  />
          </div>
          
          <MenuItem 
            className='dash-side'
                onClick={navigateHome}  
                style={{fontSize:"14px", paddingLeft: "16px", }}> 
                <FontAwesomeIcon icon={faHouse}/> 
                <span style={{paddingLeft: "9px", }}>
                Halaman Utama  </span>
          </MenuItem>
          
        {storageItems.map((aplikasi, index) => (
        <div key={index}>
          {/* Nama Aplikasi */}
          <div className="app-name">
            <img src={App} className="icon-app" alt="app-icon" />{" "}
            {aplikasi.nama_aplikasi}
          </div>

          {/* Loop modules */}
          {aplikasi.modules.map((module) => (
            <SubMenu
              key={module.id}
              className="menu-module"
              label={module.name}
              style={{ paddingLeft: "20px", height: "5vh" }}
              icon={
                <i
                  className={module.icon_name}
                  style={{ marginRight: "-20px", color: module.color_icon || "#666" }}
                />
              }
            >
              {/* Loop menus */}
              {module.menus.map((menu) => (
                (menu.name === "User Privilege" && levelUser !== "developer") ? (
                  <></>
                ) : (
                  <MenuItem
                    key={menu.id}
                    className="menu-item"
                    component={<Link to={{ pathname: `${menu.url}` }} />}
                    active={window.location.pathname === `${menu.url}`}
                    style={{
                      height: "4vh",
                      fontSize: "13px",
                      paddingLeft: "62px",
                      backgroundColor: "#4368c5",
                    }}
                  >
                    <img
                      src={Arrow}
                      className="icon-arrow"
                      style={{ marginRight: "6px" }}
                      alt="arrow-icon"
                    />{" "}
                    {menu.name}
                  </MenuItem>
                )
              ))}
            </SubMenu>
          ))}
        </div>
      ))}
                                    
        </>
    }

      

      {/* <MenuItem 
      className='dash-side'
          onClick={navigateHome}  
          style={{fontSize:"14px", paddingLeft: "16px", }}> 
          <FontAwesomeIcon icon={faHouse}/> 
          <span style={{paddingLeft: "9px", }}>
          Halaman Utama </span>
      </MenuItem>
      

      {dummySidebar2?.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
          <></>
          ) : (
          <div>
            <div className='app-name'>
             
              <img src={App} className='icon-app' /> {item.aplikasi}
            </div>
            {item.modules.map((module, index) => (
              <SubMenu   className='menu-module'  key={index}  label={module.name}  style={{paddingLeft:"20px", height:"5vh"}} 
                icon={<i className={module.icon_name} style={{marginRight:"-20px"}}/>}>
                {module.menus.map((itemss) => (

                <MenuItem  
                  className="menu-item "  
                  component={<Link to={{ pathname: `${itemss.url}`}}/>}
                  active={window.location.pathname === `${itemss.url}`}
                  style={{height:"4vh", fontSize:"13px", paddingLeft: "62px", backgroundColor:'#4368c5'}}>
                  <img src={Arrow} className='icon-arrow' style={{marginRight:"6px"}} /> {itemss.name}
                </MenuItem>
                ))}
              </SubMenu>
            ))}
        </div>
          )
        ) : (
           <MenuItem 
            className="menu-item" 
            component={<Link to={{ pathname: `${item.url}`}}/>}
            
            active={window.location.pathname === `${item.url}`}
            style={{fontFamily: "sans-serif", marginLeft: "0px"}} 
            icon={<i className={item.icon_name} 
            style={{marginLeft: "15px", color:"#666666", fontSize: "20px"}} />}>
            {item.name}
          </MenuItem>
          
        )
      ))} */}

    {/* ok sblm dumy */}
     {/* {storageItems?.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
            <></>
          ) : (
          <SubMenu   className='menu-role'  key={index}  label={item.name}  
            icon={<i className={item.icon_name} style={{color:"#4747AC"}}/>}>
            {item.menus.map((itemss) => (
            <MenuItem 
              className="menu-item"  
              component={<Link to={{ pathname: `${itemss.url}`}}/>}
              
               active={window.location.pathname === `${itemss.url}`}
              style={{height:"4vh", fontSize:"13px", marginLeft: "20px"}}>
              <img src={Arrow} className='icon-arrow' /> {itemss.name}
            </MenuItem>
            ))}
          </SubMenu>
          )
        ) : (
          <MenuItem 
          className="menu-item" 
          component={<Link to={{ pathname: `${item.url}`}}/>}
          
          active={window.location.pathname === `${item.url}`}
          style={{fontFamily: "sans-serif", marginLeft: "0px"}} 
          icon={<i className={item.icon_name} 
          style={{marginLeft: "15px", color:"#666666", fontSize: "20px"}} />}>
            {item.name}
          </MenuItem>
        )
      ))} */}
          
      {/* {storageItems.map((item, index) => (
        (item.url === "" || item.url == null) ? (
          (item.name === "User Previlege" && levelUser !== "developer") ? (
            <></>
          ) : (
          <SubMenu  className='menu-role'  key={index}  label={item.name}  
            icon={<i className={item.icon_name}/>}>
            {item.menus.map((itemss) => (
              <MenuItem className="menu-item"  href={itemss.url} style={{height:"4vh", fontSize:"13px", marginLeft: "20px"}}>
                <img src={Arrow} className='icon-arrow' /> {itemss.name}
               
                  
              </MenuItem>
            ))}
          </SubMenu>
          )
        ) : (
          <MenuItem className="menu-item" href={item.url} style={{fontFamily: "sans-serif", marginLeft: "0px"}} icon={<i className={item.icon_name} style={{marginLeft: "15px", color:"#666666", fontSize: "20px"}} />}>
            {item.name}
          </MenuItem>
        )
      ))} */}
    </Menu>
  </Sidebar>
  )
}
