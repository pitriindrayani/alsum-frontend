import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "../../config/api";
import { useMediaQuery } from 'react-responsive'
import {Button} from 'reactstrap'
// import "./Login.css"
import ToastError from "../NotificationToast/ToastError"
import ToastSuccess from "../NotificationToast/ToastSuccess"
import { ScaleLoader } from "react-spinners";
import LogoDesktop from '../../assets/logo-desktop.png'
import cardImg from '../../assets/card-login-img.jpg'

export default function Login() {
  let navigate = useNavigate();
  document.title = "Login";
  const [loading, setLoading] = useState(false);
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)

      // Configuration
      const config = {
        headers: { "Content-type": "application/json" }
      };
      // Data body
      const body = JSON.stringify(form);
      const now = Date.now();
      const expiryTime = now + 86400000;

      // Insert data for login process
      const response = await API.post("/api/auth/login", body, config);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem("token_expiry", expiryTime);
      localStorage.setItem('name-admin', response.data.data.user.username)
      localStorage.setItem('photo-admin', response.data.data.user.photo_profile)
      localStorage.setItem('id_admin', JSON.stringify(response.data.data.user.id));
      localStorage.setItem('email_admin', JSON.stringify(response.data.data.user.email));
      localStorage.setItem('level', response.data.data.user.level);
      localStorage.setItem('ysb_branch_id', response.data.data.user.ysb_branch_id ?? "");
      localStorage.setItem('ysb_school_id', response.data.data.user.ysb_school_id ?? "");
      localStorage.setItem('id_teacher', response.data.data.user.id_teacher ?? "");
      localStorage.setItem('id_role', response.data.data.user.id_role ?? "");
      localStorage.setItem('ysb_role_name', response.data.data.user.ysb_role_name ?? "");
      localStorage.setItem('teacher_data', response.data.data.user.teacher_data !== null ? JSON.stringify(response.data.data.user.teacher_data) : "");
      localStorage.setItem('menus', JSON.stringify(response.data.data.user.modules)? JSON.stringify(response.data.data.user.modules) : "" )
      localStorage.setItem('role_permission', JSON.stringify(response.data.data.user.role_permission)? JSON.stringify(response.data.data.user.role_permission) : "" )
      localStorage.setItem('roles', JSON.stringify(response.data.data.user.roles).length === 0 ? "" : JSON.stringify(response.data.data.user.roles))

      // Checking process tes
      if (response?.status === 200) {
        setLoading(false)
        ToastSuccess.fire({
          icon: 'success',
          title: response.data.message,
          background: '#1d3557', 
          color: '#ffffff'
        })
        navigate("/dashboard");
      }
    } catch (error) {
      setLoading(false)
      ToastError.fire({
        icon: 'error',
        title: `${error.response.data.message}`,
      })
    }
  });

  return (
         <>

        {isTabletOrMobile ? 
          <>

          <div className="bg-phone">
            {/* <img src={BgPhoneImage}  /> */}
            {/* <img className="bg-blue" src={BgPhoneImage2}  /> */}
            
          </div>

          <div className="card-login-phone">
            <div className="card">
              <h5 className="mb-3" style={{fontSize: "19px", color:"#252525ff"}}>Login</h5>
              

              <form onSubmit={(e) => handleSubmit.mutate(e)}>
                  <div className="form-group mb-3">
                      <label className="custem-label-forgot" >Email / NIK YSB</label>
                      <input id="email" type="" className="form-control" value={email}  name="email" onChange={handleChange}  required />
                      <div className="invalid-feedback">
                        Email / NIK YSB is invalid
                      </div>
                  </div>

                  <div className="form-group mb-3">
                      <label className="custem-label-forgot" > Password </label>
                      <input id="password" type="password" className="form-control" value={password} onChange={handleChange}  name="password" required data-eye  />
                      <div className="invalid-feedback">
                        Password is required
                      </div>
                  </div>
                

                  <div className="btn-login-phone mb-2 mt-4">
                            {loading? 
                            <Button className="w-100 button-login-phone" type='submit' color="warning" style={{padding:"0px 0px", 
                            fontSize:"15px", borderRadius:"50px", backgroundColor:"", color:"white"}}>
                              <ScaleLoader color={'white'} height={25} width={5} />
                            </Button>
                            :
                            <Button className=" w-100 button-login-phone" type='submit' color="primary" style={{padding:"8px 0px", 
                            fontSize:"15px", borderRadius:"50px", backgroundColor:"#FECB22", color:"000"}}>
                              Login
                            </Button>
                            }
                  </div>
              </form>
            </div>

          </div>
         
          <div className="footer-login-phone">
            <div className="footer-center-phone">
              <p>Copyright 2025. Yayasan Syiar Bangsa. All rights reserved.</p>
            </div>
          </div>
          </>
          : 
          <>
          {/* DESKTOP */}
          <div className="page-login-desktop">
              <div className="logo-desktop">
                <img src={LogoDesktop} alt="image" className="img-fluid"  />
              </div>

              <div className="row login card-login justify-content-center">
                <div className="card  ">
                  <div className="card-body">

                    <div className="img-card">
                      <img src={cardImg}  /> 
                      
                    </div>

                      <form onSubmit={(e) => handleSubmit.mutate(e)}>
                        <div className="mb-3 input-box mt-3 ">
                          <p className="text-right">Username</p>
                          {/* <label  className="form-label">Username</label> */}
                          <input id="email" type="" className="form-control" value={email}  name="email" onChange={handleChange}  required autoFocus />
                        </div>
                        <div className="mb-3 input-box mt-4" >
                          <p className="text-right">Password</p>
                           <input id="password" type="password" className="form-control" value={password} onChange={handleChange}  name="password" required data-eye />
                            {/* <span class="eye">
                            <i class="bi bi-eye" id="hide1"></i>
                            <i class="bi bi-eye-slash" id="hide2"></i>
                            </span> */}
                        </div>
                        <div className="btn-login">
                            {loading? 
                            <Button className="w-100 button-login" type='submit' color="warning" style={{padding:"0px 0px", 
                            fontSize:"15px", borderRadius:"5px", backgroundColor:"", color:"white"}}>
                              <ScaleLoader color={'white'} height={25} width={5} />
                            </Button>
                            :
                            <Button className=" w-100 button-login" type='submit' color="primary" style={{padding:"10px 0px", 
                            fontSize:"15px", borderRadius:"5px", backgroundColor:"#FECB22", color:"#000", border: "none"}}>
                              Login
                            </Button>
                            }
                      </div>
                      </form>
                  </div>
                </div>
              </div>

              <div className="footer-login justify-content-center">
                <p>Copyright 2025. Yayasan Syiar Bangsa. All rights reserved.</p>
              </div>
          </div>
                        
          </>
        }

          
      </>
  );
}
