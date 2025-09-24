import { Navigate } from "react-router-dom";
import StartMakePlaceSplash from "../page/Splash/StartMakePlaceSplash.jsx";

export default function StartMakePlaceGate() {
  const hasProfile = Boolean(localStorage.getItem("userProfile"));
  return hasProfile ? <Navigate to="/" replace /> : <StartMakePlaceSplash />;
}
