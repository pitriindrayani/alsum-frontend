import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { API } from "../../config/api";
import {Alert,Row,Col,Form,Input,Label,Button,CardText,CardTitle,FormFeedback,UncontrolledTooltip} from 'reactstrap'
import Logo_Dashboard from '../../assets/logo-mis.png'
import source from '../../assets/login-v2.svg'
import { useForm, Controller } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import ShowMoreText from 'react-show-more-text';
import InputPasswordToggle from './InputToggle'

export default function Login() {
  let navigate = useNavigate();
  document.title = "Gotell";
  const [state, dispatch] = useContext(UserContext);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Data body
      const body = JSON.stringify(form);

      // Insert data for login process
      const response = await API.post("/api/auth/reset-pass", body, config);
      // console.log(response);

      // Checking process
      if (response?.status === 200) {
        // Send data to useContext

        const alert = (
          <Alert variant="success" className="py-1">
            Check Your Email
          </Alert>
        );
        setMessage(alert);
        navigate("/");
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
           Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  const [loading, setLoading] = useState(false);
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  const isDesktopOrLaptop = useMediaQuery({query: '(min-width: 1224px)'})
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' })
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)'})
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)'})
  const isRetina = useMediaQuery({ query: '(min-resolution: 2dppx)' })

  return (

  <div className='auth-wrapper auth-cover' >
    {isTabletOrMobile ?
      <Col className='auth-inner m-0' style={{ height: "100vh" , padding:"25px 10px"}}>
        
      {/*<Col className=' d-flex align-items-center auth-bg' lg='8' sm='12' style={{backgroundColor:"#E0E0E0", justifyContent:"center",textAlign:"center"}}>
        <div>
          <img className='img-fluid' style={{width:"50%"}} src={Logo_Dashboard} alt='Login Cover' />
        </div>
      </Col>*/}

      {/*<Col className='d-none d-lg-flex' style={{justifyContent:"center",textAlign:"center"}}>
        <div>
          <img className='img-fluid' style={{width:"70%"}} src={Logo_Dashboard} alt='Login Cover' />
        </div>
      </Col>*/}

        <div style={{display:"flex", justifyContent:"center"}}>
          <img className='img-fluid' style={{width:"50%"}} src={Logo_Dashboard} alt='Login Cover' />
        </div>

        <CardTitle tag='h2' className='fw-bold' style={{fontWeight:"bold",fontFamily:"Poppins", fontSize:"50px", textAlign:"center"}}>
          Forgot Password 
        </CardTitle>
        
        {message && message}
        <Form className='auth-login-form mt-2'  onSubmit={(e) => handleSubmit.mutate(e)}>
          <div className='mb-2'>
            <Label className='form-label' for='login-email' style={{fontSize:"15px", fontWeight:"bold"}}>
              Email
            </Label>
            <Input autoFofcus type='email' placeholder='john@example.com'  value={email} name="email" onChange={handleChange}/>
          </div>

          <Button className="mt-4" type='submit' color='primary' block style={{padding:"15px 0px", fontSize:"20px", borderRadius:"25px"}}>
            Send Recovery Email
          </Button>
        </Form>
        <p className='text-center mt-3'>
          <span className='me-25'>Already Account?</span>
          <Link to='/'>
            <span>Click</span>
          </Link>
        </p>
      </Col>
      :
      <Row className='auth-inner m-0' style={{height:"100vh"}}>
          <Col className='d-flex align-items-center auth-bg px-5' lg='4' sm='12' >
            <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>

              <Col className='d-none d-lg-flex' style={{justifyContent:"center",textAlign:"center"}}>
                <div>
                  <img className='img-fluid' style={{width:"70%"}} src={Logo_Dashboard} alt='Login Cover' />
                </div>
              </Col>

              <CardTitle tag='h2' className='fw-bold' style={{fontWeight:"bold",fontFamily:"Poppins", fontSize:"50px", textAlign:"center"}}>
                Forgot Password 
              </CardTitle>
              
              {message && message}
              <Form className='auth-login-form mt-2'  onSubmit={(e) => handleSubmit.mutate(e)}>
              <div className='mb-2'>
                <Label className='form-label' for='login-email' style={{fontSize:"15px", fontWeight:"bold"}}>
                  Email
                </Label>
                <Input autoFofcus type='email' placeholder='john@example.com'  value={email} name="email" onChange={handleChange}/>
              </div>
  
              <Button className="mt-4" type='submit' color='primary' block style={{padding:"15px 0px", fontSize:"20px", borderRadius:"25px"}}>
               Send Recovery Email
              </Button>
            </Form>
              <p className='text-center mt-3'>
                <span className='me-25'>Forgot Password?</span>
                <Link to='/forgotpassword'>
                  <span>Click</span>
                </Link>
              </p>
            </Col>
            </Col>
            

          <Col className=' d-flex align-items-center auth-bg' lg='8' sm='12' style={{backgroundColor:"#E0E0E0", justifyContent:"center",textAlign:"center"}}>
            <div className='w-100 d-lg-flex align-items-center justify-content-center'>
              <img className='img-fluid' style={{width:"50%"}} src={source} alt='Login Cover' />
            </div>
          </Col>
        </Row>
      }
    </div>
    

    // <div className='auth-wrapper auth-cover' >
    //   <Row className='auth-inner m-0' style={{height:"100vh"}}>
    //     <Col className='d-flex align-items-center auth-bg px-5' lg='4' sm='12' >
    //       <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
            
    //         <Col className='d-none d-lg-flex' style={{justifyContent:"center",textAlign:"center"}}>
    //           <div>
    //             <img className='img-fluid' style={{width:"70%"}} src={Logo_Dashboard} alt='Login Cover' />
    //           </div>
    //         </Col>

    //         <CardTitle tag='h2' className='fw-bold' style={{fontWeight:"bold",fontFamily:"Poppins", fontSize:"50px", textAlign:"center"}}>
    //          Forgot Password 
    //         </CardTitle>
            
    //         <Form className='auth-login-form mt-2'  onSubmit={(e) => handleSubmit.mutate(e)}>
    //           <div className='mb-2'>
    //             <Label className='form-label' for='login-email' style={{fontSize:"15px", fontWeight:"bold"}}>
    //               Email
    //             </Label>
    //             <Input autoFofcus type='email' placeholder='john@example.com'  value={email} name="email" onChange={handleChange}/>
    //           </div>
  
    //           <Button className="mt-4" type='submit' color='primary' block style={{padding:"15px 0px", fontSize:"20px", borderRadius:"25px"}}>
    //            Send Recovery Email
    //           </Button>
    //         </Form>
           
    //         <p className='text-center mt-3'>
    //           <Link to='/'>
    //             <span>Back To Login</span>
    //           </Link>
    //         </p>
    //         {message && message}

    //       </Col>
    //     </Col>

    //     <Col className=' d-lg-flex align-items-center' lg='8' sm='12' style={{backgroundColor:"#E0E0E0",justifyContent:"center",textAlign:"center"}}>
    //       <div className='w-100 d-lg-flex align-items-center justify-content-center'>
    //         <img className='img-fluid' style={{width:"50%"}} src={source} alt='Login Cover' />
    //       </div>
    //     </Col>
    //   </Row>
    // </div>
  );
}
