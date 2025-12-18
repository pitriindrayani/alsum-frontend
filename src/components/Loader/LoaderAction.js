import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { ScaleLoader } from "react-spinners";

export default function Login() {
  // let navigate = useNavigate();
  // useEffect(() => {
  //   if (localStorage.getItem("token") == null || undefined) {
  //       navigate("/");
  //     }
  // }, []);
  document.title = "Hris";
  const [loading, setLoading] = useState(false);
    
  return (
    <Modal size="sm" show={loading? loading: "false"} centered style={{ fontFamily: "sans-serif", border:"none", backgroundColor:"transparent"}}>
    <Modal.Body className="transparent-modal-body">
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "15vh" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "center", fontSize: "20px" }}>
            <ScaleLoader color={'#848484'} fontSize={''} />
          </div>
          <div style={{ marginTop: "20px", fontWeight: "bold", fontSize: "20px", color: "#848484" }}>
            Please Wait.....
          </div>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  );
}
