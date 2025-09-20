import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import HomePage from "./page/HomePage/HomePage.jsx";
import MakePlaceLayout from "./page/MakePlaceFlow/MakePlaceLayout.jsx";
import MakePersonalPlaceLayout from "./page/MakePlaceFlow/MakePersonalPlaceLayout.jsx";
import MakeGroupPlaceLayout from "./page/MakePlaceFlow/MakeGroupPlaceLayout.jsx";
import PlaceMapPage from "./page/PlaceMapPage/PlaceMapPage.jsx";
import { Navigate } from "react-router-dom";
import StepStation from "./step/StepStation.jsx";
import StepMemo from "./step/StepMemo.jsx";
import CompleteMakePlace from "./page/MakePlaceFlow/CompleteMakePlace.jsx";
import StepNickname from "./step/StepNickname.jsx";
import StepSelectMapType from "./step/StepSelectMapType.jsx";
import StepGroupProfile from "./step/StepGroupProfile.jsx";
import CompleteRecommend from "./page/RecommendFlow/CompleteRecommend.jsx";
import RecommendPersonalPlaceLayout from "./page/RecommendFlow/Personal/RecommendPersonalPlaceLayout.jsx";
import RecommendGroupPlaceLayout from "./page/RecommendFlow/Group/RecommendGroupPlaceLayout.jsx";
import StepLocation from "./step/StepLocation.jsx";
import StepRecommend from "./step/StepRecommend.jsx";
import StartRecommendPersonal from "./page/RecommendFlow/Personal/StartRecommendPersonal.jsx";
import StartRecommendGroup from "./page/RecommendFlow/Group/StartRecommendGroup.jsx";
import StartMakePlace from "./page/Splash/StartMakePlaceSplash.jsx";
import RecommendSplash from "./page/Splash/ReommendSplash.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "place-map/:slug", element: <PlaceMapPage /> },

      {
        path: "start-make-place",
        element: <StartMakePlace />,
      },

      {
        path: "make-place",
        element: <MakePlaceLayout />, // 지도 유형 선택 레이아웃
        children: [
          { index: true, element: <Navigate to="nickname" replace /> },
          { path: "nickname", element: <StepNickname /> },
          { path: "maptype", element: <StepSelectMapType /> },
        ],
      },
      {
        path: "make-place/personal",
        element: <MakePersonalPlaceLayout />, // 개인 지도 레이아웃
        children: [
          { index: true, element: <Navigate to="nickname" replace /> },
          { path: "nickname", element: <StepNickname /> },
          { path: "maptype", element: <StepSelectMapType /> },
          { path: "station", element: <StepStation /> },
          { path: "memo", element: <StepMemo /> },
        ],
      },
      {
        path: "make-place/group",
        element: <MakeGroupPlaceLayout />, // 그룹 지도 레이아웃
        children: [
          { index: true, element: <Navigate to="nickname" replace /> },
          { path: "nickname", element: <StepNickname /> },
          { path: "maptype", element: <StepSelectMapType /> },
          { path: "group-profile", element: <StepGroupProfile /> },
          { path: "station", element: <StepStation /> },
          { path: "memo", element: <StepMemo /> },
        ],
      },
      { path: "complete", element: <CompleteMakePlace /> },
      {
        path: "shared-map/personal/:slug/splash",
        element: <RecommendSplash />,
      },
      {
        path: "shared-map/group/:slug/splash",
        element: <RecommendSplash />,
      },
      {
        path: "shared-map/personal/:slug",
        element: <StartRecommendPersonal />,
      },
      {
        path: "shared-map/group/:slug",
        element: <StartRecommendGroup />,
      },
      {
        path: "shared-map/personal/:slug/onboarding",
        element: <RecommendPersonalPlaceLayout />,
        children: [
          { index: true, element: <Navigate to="nickname" replace /> },
          { path: "nickname", element: <StepNickname /> },
          { path: "location", element: <StepLocation /> },
          { path: "recommend", element: <StepRecommend /> },
        ],
      },
      {
        path: "shared-map/group/:slug/onboarding",
        element: <RecommendGroupPlaceLayout />,
        children: [
          { index: true, element: <Navigate to="nickname" replace /> },
          { path: "nickname", element: <StepNickname /> },
          { path: "location", element: <StepLocation /> },
          { path: "recommend", element: <StepRecommend /> },
        ],
      },
      {
        path: "shared-map/:slug/complete",
        element: <CompleteRecommend />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
