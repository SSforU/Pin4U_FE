import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./page/HomePage/HomePage";
import MakePlaceLayout from "./page/MakePlaceFlow/MakePlaceLayout";
import PlaceMapPage from "./page/HomePage/Components/PlaceMapPage";
import { Navigate } from "react-router-dom";
import StepStation from "./step/StepStation";
import StepMemo from "./step/StepMemo";
import CompleteMakePlace from "./page/MakePlaceFlow/ompleteMakePlace";
import StepNickname from "./step/StepNickname";
import StepSelectMapType from "./step/StepSelectMapType";
import StepGroupProfile from "./step/StepGroupProfile";
import CompleteRecommend from "./page/RecommendFlow/CompleteRecommend";
import RecommendPlaceLayout from "./page/RecommendFlow/RecommendPlaceLayou";
import StepLocation from "./step/StepLocation";
import StepRecommend from "./step/StepRecommend";
import StartRecommend from "./page/RecommendFlow/StartRecommend";
import StartMakePlace from "./page/MakePlaceFlow/StartMakePlace";

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
        element: <MakePlaceLayout />, // 공통 레이아웃 + 상태
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
        path: "shared-map/:slug",
        element: <StartRecommend />,
      },
      {
        path: "shared-map/:slug/onboarding",
        element: <RecommendPlaceLayout />,
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
