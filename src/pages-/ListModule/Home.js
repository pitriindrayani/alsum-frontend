import ListModule from "../../components/ListModule/HomeOri";
import { useMediaQuery } from 'react-responsive'

export default function Home() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 780px)'})

  return (
    <ListModule />
  );
}
