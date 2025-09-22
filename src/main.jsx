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
import CompleteRecommendPersonal from "./page/RecommendFlow/Personal/CompleteRecommendPersonal.jsx";
import CompleteRecommendGroup from "./page/RecommendFlow/Group/CompleteRecommendGroup.jsx";
import RecommendPersonalPlaceLayout from "./page/RecommendFlow/Personal/RecommendPersonalPlaceLayout.jsx";
import RecommendGroupPlaceLayout from "./page/RecommendFlow/Group/RecommendGroupPlaceLayout.jsx";
import StepLocation from "./step/StepLocation.jsx";
import StepRecommend from "./step/StepRecommend.jsx";
import StartRecommendPersonal from "./page/RecommendFlow/Personal/StartRecommendPersonal.jsx";
import StartRecommendGroupLogin from "./page/RecommendFlow/Group/StartRecommendGroupLogin.jsx";
import StartRecommendGroupReqeust from "./page/RecommendFlow/Group/StartRecommendGroupReqeust.jsx";
import StartMakePlaceSplash from "./page/Splash/StartMakePlaceSplash.jsx";
import RecommendSplash from "./page/Splash/RecommendSplash.jsx";
import StationPage from "./page/HomePage/StationPage.jsx";
import KakaoCallback from "./page/Auth/KakaoCallback.jsx";
import GroupPlaceMapPage from "./page/PlaceMapPage/GroupPlaceMapPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "place-map/:slug", element: <PlaceMapPage /> },
      { path: "station/:slug", element: <StationPage /> },
      { path: "group-place-map/:slug", element: <GroupPlaceMapPage /> },

      {
        path: "start-make-place",
        element: <StartMakePlaceSplash />,
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
          { index: true, element: <Navigate to="station" replace /> },
          { path: "station", element: <StepStation /> },
          { path: "memo", element: <StepMemo /> },
        ],
      },
      {
        path: "make-place/group",
        element: <MakeGroupPlaceLayout />, // 그룹 지도 레이아웃
        children: [
          { index: true, element: <Navigate to="group-profile" replace /> },
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
        path: "shared-map/group/:slug/login",
        element: <StartRecommendGroupLogin />,
      },
      {
        path: "shared-map/group/:slug/request",
        element: <StartRecommendGroupReqeust />,
      },
      {
        path: "shared-map/group/:slug",
        element: <StartRecommendGroupReqeust />,
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
        path: "shared-map/personal/:slug/complete",
        element: <CompleteRecommendPersonal />,
      },
      {
        path: "shared-map/group/:slug/complete",
        element: <CompleteRecommendGroup />,
      },
      // 카카오 로그인
      {
        path: "oauth/callback/kakao",
        element: <KakaoCallback />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
