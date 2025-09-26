import { useOutletContext } from "react-router-dom";
import HomePage from "../page/HomePage/HomePage.jsx";
import StartMakePlaceSplash from "../page/Splash/StartMakePlaceSplash.jsx";

export default function RootEntry() {
  const { userProfile } = useOutletContext();
  return userProfile ? <HomePage /> : <StartMakePlaceSplash />;
}
