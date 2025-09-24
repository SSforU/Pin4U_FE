import HomePage from "../page/HomePage/HomePage.jsx";
import StartMakePlaceSplash from "../page/Splash/StartMakePlaceSplash.jsx";

export default function RootEntry() {
  const hasProfile = Boolean(localStorage.getItem("userProfile"));
  return hasProfile ? <HomePage /> : <StartMakePlaceSplash />;
}
