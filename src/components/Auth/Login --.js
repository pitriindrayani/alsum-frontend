import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { APIUS } from "../../config/apius";
import { useMediaQuery } from 'react-responsive'
import { Button} from 'reactstrap'

import ImageLogin from '../../assets/login-gedung.png'
import ImgDesktop from '../../assets/bg-desktop-img.jpg'
import LogoLogin from '../../assets/logo-login.png'
import "./Login.css"
import ToastError from "../NotificationToast/ToastError"
import ToastSuccess from "../NotificationToast/ToastSuccess"
import { ScaleLoader } from "react-spinners";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'

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
      //  body
      const body = JSON.stringify(form);
      const now = Date.now();
      const expiryTime = now + 86400000;

      // Insert data for login process
      // const response = await API.post("/user-service/auth/login", body, config);

      const response = await APIUS.post("/api/auth/login", body, config);
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem("token_expiry", expiryTime);
      localStorage.setItem('name-admin', response.data.data.user.username)
      localStorage.setItem('ysb_branch_id', response.data.data.user.ysb_branch_id)
      localStorage.setItem('photo-admin', response.data.data.user.photo_profile)
      localStorage.setItem('id_admin', JSON.stringify(response.data.data.user.id));
      localStorage.setItem('email_admin', JSON.stringify(response.data.data.user.email));
      localStorage.setItem('level', response.data.data.user.level);
      // localStorage.setItem('ysb_branch_id', response.data.data.user.ysb_branch_id ?? "");
      localStorage.setItem('ysb_school_id', response.data.data.user.ysb_school_id ?? "");
      localStorage.setItem('id_teacher', response.data.data.user.ysb_teacher_id ?? "");
      localStorage.setItem('id_role', response.data.data.user.id_role ?? "");
      localStorage.setItem('ysb_role_name', response.data.data.user.ysb_role_name ?? "");
      localStorage.setItem('teacher_data', response.data.data.user.teacher_data !== null ? JSON.stringify(response.data.data.user.teacher_data) : "");
      localStorage.setItem('menus', JSON.stringify(response.data.data.user.aplikasi)? JSON.stringify(response.data.data.user.aplikasi) : "" )
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
                            fontSize:"15px", borderRadius:"50px", backgroundColor:"#4368c5", color:"white"}}>
                              Login
                            </Button>
                            }
                  </div>
              </form>
            </div>

          </div>
         
          <div className="footer-login-phone">
            <div className="footer-center-phone">
              <p>2025 <FontAwesomeIcon icon={faCopyright} /> Yayasan Syiar Bangsa</p>
            </div>
          </div>
          </>
          : 
          <>
          {/* DESKTOP */}

          <div className="page-login all-page login-isqom-submission">
            <div className="row">
              <div className="col-md-8 bg-login">
                 {/* <img src={ImgDesktop} alt="image" className="img-fluid"  /> */}
                <div className="content-login">
                  <h1>Sekolah Islam Al Azhar Summarecon</h1>
                  <div className="img-wrapper-login">
                     <img src={ImageLogin} className="img-fluid" />
                  </div>
                </div>
                <div className="footer-login">
                  <div className="footer-center">
                    <p>2025 <FontAwesomeIcon icon={faCopyright} /> Yayasan Syiar Bangsa</p>
                  </div>
                </div>
                
              </div>

              <div className="col-md-4 ">
                <div className="bg-form-login-top">
                  <img src={LogoLogin} alt="logo"  />
                </div>
                <div className="form-login mt-3">
                  <h5 style={{color:"#4368c5"}}>Login</h5>
               
                  <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className="form-group">
                      <label > Email / NIK YSB</label>
                      <input id="email" type="" className="form-control" value={email}  name="email" onChange={handleChange}  required autoFocus />
                      <div className="invalid-feedback">
                        Email is invalid
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="custem-label-forgot" >Password
                      </label>                      
                      <input id="password" type="password" className="form-control" value={password} onChange={handleChange}  name="password" required data-eye />
                      <div className="invalid-feedback">
                        Password is required
                      </div>
                    </div>
                

                    <div className="btn-login">
                            {loading? 
                            <Button className="w-100 button-login" type='submit' color="warning" style={{padding:"0px 0px", 
                            fontSize:"15px", borderRadius:"5px", backgroundColor:"", color:"white"}}>
                              <ScaleLoader color={'white'} height={25} width={5} />
                            </Button>
                            :
                            <Button className=" w-100 button-login" type='submit' color="primary" style={{padding:"10px 0px", 
                            fontSize:"15px", borderRadius:"5px", backgroundColor:"#4368c5", color:"white"}}>
                              Login
                            </Button>
                            }
                      </div>
                  </form>

                  <div className="mt-4 text-center">
                    Lupa Password?
                  </div>
                </div>

              </div>
            </div>
          </div>
                        
          </>
        }

          
      </>
  );
}
