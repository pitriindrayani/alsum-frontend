import NotFoundPageImage from "../../assets/on-progress.png"
import "./Styled.css"

export default function NotFoundPage() {

  return (
  // <div className="image-container">
    
  //   <img src={NotFoundPageImage} alt="Not Found" className="full-screen-image" />
  // </div>

   <div className="image-container text-center">
    <h3 className="mb-3">Sedang dalam pengembangan 🙏</h3>
    <img src={NotFoundPageImage} alt="Not Found" className="full-screen-image" />
  </div>
  );
}
