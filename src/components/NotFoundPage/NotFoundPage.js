import NotFoundPageImage from "../../assets/signature/404-not-found.jpg"
import "./Styled.css"

export default function NotFoundPage() {

  return (
  <div className="image-container">
    <img src={NotFoundPageImage} alt="Not Found" className="full-screen-image" />
  </div>
  );
}
