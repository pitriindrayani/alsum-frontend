// import NotFoundPageImage from "../../assets/signature/404-not-found.jpg"
import OnProgress from "../../assets/on-progress.jpg"


export default function NotFoundPage() {

  return (

    <div className="body" >
      <div className="body-header d-flex">
         <div className="title-dashboard">
            <h4>Sedang dalam pengembangan 🙏</h4>
          </div>
      </div> 
      <div className="body-content text-center" style={{padding: "35px 0"}}>
        <img src={OnProgress} className="img-fluid" style={{width:"50%"}} />
      </div>

    </div>

  );
}
