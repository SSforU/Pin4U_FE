import { Navigate, useOutletContext } from "react-router-dom";
import StartMakePlaceSplash from "../page/Splash/StartMakePlaceSplash.jsx";

export default function StartMakePlaceGate() {
  const { userProfile } = useOutletContext();
  return userProfile ? <Navigate to="/" replace /> : <StartMakePlaceSplash />;
}
