import { useEffect, useState } from "react";
import { Form, Button } from 'reactstrap'
import { APIUS } from "../../../../../../config/apius";
import Modal from 'react-bootstrap/Modal';
import { useMutation } from "react-query";
import "bulma/css/bulma.css";
import "../../../../../../index.css";
import swal from "sweetalert";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
  
export default function ModalRoleUpdate(props) {
  document.title = "List Sub Module";
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(1000);
  const [ascending, setAscending] = useState(0);
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("")
  
  // Untuk Close Proops Data
  const [propsData, setProopsData] = useState()
  const [loading, setLoading] = useState(false);
  const [getDataModule, setGetDataModule] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [inputList, setInputList] = useState([
    {
      id_module: "",
    },
  ]);  

  let fetchParams = {
    headers : {"Authorization" : `${token}`,"Content-Type" : "application/json"}
  };

  const [formSubModule, setFormTreatment] = useState({
    subModule: [],
  });


  const GetResponseData = async () => {
    try {
      // e.preventDefault();
      setLoading(true)
      const response = await APIUS.get(`/api/privileges/module-menus?page=${page}&limit=${limit}&ascending=${ascending}&search=${keyword}&search=${search}&id_module=${props.idTrash}`,fetchParams)

      // Checking process
      if (response?.status === 200) {
        setGetDataModule(response.data.data)
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

  useEffect(() => {
    GetResponseData()
  },[])

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
  
      const payload = {
        menus: formSubModule?.subModule.map(item => ({ id_menu: item.id_menu })),
      };
  
      // permintaan DELETE dengan payload
      const response = await APIUS.delete(`/api/privileges/module-menus/${props.idTrash}`, {
        data: payload,
        ...fetchParams, 
      });
  
      // Periksa respons
      if (response?.status === 200) {
        swal({
          title: 'Success',
          text: response.data.message,
          icon: 'success',
          timer: 5000,
          buttons: false,
        });
        props.GetResponseData()
        props.onHide()
        setLoading(false)
      }
    } catch (error) {
      swal({
        title: 'Failed',
        text: `${error.response?.data?.message || 'An error occurred'}`,
        icon: 'error',
        timer: 3000,
        buttons: false,
      });
      setLoading(false);
      props.onHide();
    }
  });
  
  const handleChangeCheckbox = (e) => {
    // Destructuring
    const { value, checked } = e.target;
    const { subModule } = formSubModule;
    // console.log(`${value} is ${checked}`);

    // Case 1 : The user checks the box
    if (checked) {
      setFormTreatment({
        subModule: [...subModule, {"id_menu" : `${value}`}],
      });
    }
  
    // Case 2  : The user unchecks the box
    else {
      setFormTreatment({
        subModule: subModule.filter(e => {return e.id_menu !== `${value}`} ),

      });
    }
  };

  return (

    <Modal {...props} size="md" aria-labelledby="contained-modal-title-vcenter" centered >  

        <div className="d-flex header-modal">
        <h5>Hapus Menu</h5>

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
                    <h6 style={{color: "#4368c5"}} >Pilih menu yang ingin dihapus : </h6>
                    <div className="mt-3" style={{fontSize: "14px"}}>
                        {getDataModule.map((user,index) => (
                            <div className="mb-2" key={index} style={{display:"flex", width:"100%", cursor:"pointer"}}>
                                <input className="mr-2" autoFofcus type='checkbox' value={user?.id_menu} name="id_menu" onChange={handleChangeCheckbox}  />
                                <div>
                                    {user?.menu_data.name}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>
            </div>
            );
            })}

            <div className="d-flex">
            <div className="ml-auto">
                <Button className="mt-4 btn-modal-create" type='submit'>
                Hapus
                </Button>
            </div>
            </div>
        </Form>
      </Modal.Body>
    </Modal>
    );
}
