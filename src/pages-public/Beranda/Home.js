import Beranda from "../../components-public/Beranda";
import { useMediaQuery } from 'react-responsive'

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})
  
  return (
    <div >  
      <Beranda />
    </div>
  );
}
