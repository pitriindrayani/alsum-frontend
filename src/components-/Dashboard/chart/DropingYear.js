// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import { useState,useEffect } from 'react';
import axios from 'axios'
import { API } from '../../../config/api';
import { setAuthToken } from '../../../config/api';
import { FadeLoader, HashLoader } from 'react-spinners';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const Dropping = ({year,month}) => {
 
  const [users, setUsers] = useState()
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("username");
  const idUser = localStorage.getItem("id");
  const [loading,setLoading] = useState(false)
  // const nameMenu1 = localStorage.getItem("sidebar-dashboard");
  // const nameMenu2 = localStorage.getItem("sidebar-master_data");
  // const nameMenu3 = localStorage.getItem("sidebar-user_management");
  // const nameMenu4 = localStorage.getItem("sidebar-report");
  // const nameMenu5 = localStorage.getItem("sidebar-master_data-submenu")

  // console.log(nameMenu1+ " ini daftart menu")
  // console.log(nameMenu2+ " ini daftart menu")
  // console.log(nameMenu3+ " ini daftart menu")
  // console.log(nameMenu4+ " ini daftart menu")
  // console.log(nameMenu5+ " ini daftart menu")

  let obj = {
    year : `${year}`,
    }; 

    let fetchParams = {
      // method : "GET",
      // body : JSON(name),
      headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
    };

  const getDataUsers = async () => {
    setLoading(true)
    const response = await API.post('/api/dashboard-marketing/total-head-all',obj,fetchParams)
    setUsers(response.data.data[0])
    setLoading(false)
  }

  useEffect(() => {
    getDataUsers()
  }, [])

  return (
    <Card style={{borderLeft:"7px solid yellow", boxShadow:"2px 2px 10px #BFBFBF"}}>
      <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
        <CardTitle tag='p'>Dropping {year}</CardTitle>
      </CardHeader>
      {loading? 
        <CardBody>
          <div style={{ height: '100px' }}>
            <CardTitle tag='h4' style={{display:"flex",justifyContent:"center",alignItems:"center", height:"50%",fontSize:"30px", paddingTop:"30px"}}><FadeLoader color={'#3F45FF'} /></CardTitle>
            <CardTitle tag='h4' style={{display:"flex",alignItems:"center", height:"50%",fontSize:"30px"}} >Rp.</CardTitle>
          </div>
        </CardBody>
      :
      <CardBody>
        <div style={{ height: '100px' }}>
          <CardTitle tag='h4' style={{display:"flex",justifyContent:"center",alignItems:"center", height:"50%",fontSize:"30px", paddingTop:"30px"}}>{users?.target}</CardTitle>
          <CardTitle tag='h4' style={{display:"flex",alignItems:"center", height:"50%",fontSize:"30px"}} >Rp.</CardTitle>
        </div>
      </CardBody>
      }
    </Card>
  )
}

export default Dropping;
