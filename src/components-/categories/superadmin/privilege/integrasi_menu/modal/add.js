import {  useState,useEffect } from "react";
import { Form,Button} from 'reactstrap';
import { APIUS } from "../../../../../../config/apius";
import { FaPlus, FaTimes} from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import swal from "sweetalert";
import "../../../../../../index.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ModalRoleAdd(props) {
  const token = localStorage.getItem("token");
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataMenu, setGetDataMenu] = useState([]);
  const [search, setSearch] = useState("")
  const [keyword, setKeyword] = useState("");
  const [ascending, setAscending] = useState(0);
  const [limit, setLimit] = useState(1000);
  const [page, setPage] = useState(0);

  // const {id_app, slug_name} = useParams();

  const [inputList, setInputList] = useState([
    {
      id_menu: "",
    },
  ]);  

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const GetResponseData = async () => {
    try {
      setLoading(true)
      // e.preventDefault();
      const response = await APIUS.get(`/api/privileges/menus?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&search=${search}`,fetchParams)
      // Checking process
      if (response?.status === 200) {
        setGetDataMenu(response.data.data)
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

  // console.log('apa?',props.idAdd)

  useEffect(() => {
    GetResponseData()
  },[])

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true)
      // Insert data for login process
      const response = await APIUS.post("/api/privileges/module-menus/store",{
        id_module: props.idAdd,
        menus: inputList,
      },fetchParams);
      // Checking process
      if (response?.status === 200){
        swal({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          buttons: false
        })
        props.GetResponseData()
        props.onHide()
        setLoading(false)
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
      props.onHide();
    }
  });

// handle input change
const handleInputChange = (e, index, fieldName) => {
  const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

  // Copy inputList agar tidak merusak data asli
  const updatedInputList = [...inputList];

  // Update hanya elemen yang sedang aktif
  updatedInputList[index] = {
    ...updatedInputList[index],
    [fieldName]: value,
  };
  setInputList(updatedInputList);
  };

  const handleAddClick = () => {
    setInputList([
      ...inputList,
      {
        id_menu: "",
      },
    ]);
  };
  
  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  return (
  <div>
    {/* {loading && <LoaderAction/>} */}

     <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" >  

      <div className="d-flex header-modal">
        <h5>Tambah Menu</h5>

        <div className="ml-auto x-close">
          <FontAwesomeIcon icon={faXmark} onClick={() => setProopsData(props.onHide)} />
        </div>
      </div>
      <hr/>

      <Modal.Body className="modal-body">
        <Form  onSubmit={(e) => handleSubmit.mutate(e)}> 
           {inputList.map((x, i) => {
            return (
            <div>
                <div className="mt-2" >
                    <label className="label-form" >Pilih Menu </label>
                    <select aria-label="Default select example" onChange={(e) => handleInputChange(e, i, "id_menu")}  name="id_menu" className="select-form" >
                        <option value="" hidden>Pilih Menu..</option>
                        {getDataMenu.map((menu,index) => (
                        <option key={index} value={menu?.id} >{menu?.name} ( {menu?.url} )</option>
                        ))}         
                    </select>
                </div>
                <div className="" style={{ display: "" }}>
                    <div className="mt-3">
                        {inputList.length !== 1 && <button className="mr10" style={{border:"none", backgroundColor:"red", color:"white", borderRadius:"3px", fontSize:"12px", padding:"5px 10px"}} onClick={() => handleRemoveClick(i)}>Remove</button>}
                    </div>
                    <div className="mt-3">
                        {inputList.length - 1 === i && <button style={{border:"none", backgroundColor:"#4368c5", color:"white", borderRadius:"3px", fontSize:"12px", padding:"5px 10px"}} onClick={handleAddClick}><FaPlus style={{marginRight:"5px", fontSize:"10px"}}/>Add</button>}
                    </div>
                </div>
            </div>
            );
            })}
            
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
  