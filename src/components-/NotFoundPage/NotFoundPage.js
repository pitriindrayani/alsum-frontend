 import NotFoundPageImage from "../../assets/notfound.png"
import OnProgress from "../../assets/on-progress.jpg"


export default function NotFoundPage() {

  return (

    <div className="body" >
      <div className="body-header d-flex">
         <div className="title-dashboard">
            <h4>Page Not Found 😪</h4>
          </div>
      </div> 
      <div className="body-content text-center" style={{padding: "40px 0"}}>
        <img src={NotFoundPageImage} className="img-fluid" style={{width:"40%"}} />
      </div>

    </div>

  );
}
