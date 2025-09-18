import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./component/page/HomePage";
import MakePlaceLayout from "./component/page/MakePlaceLayout";
import PlaceMapPage from "./component/page/PlaceMapPage";
import { Navigate } from "react-router-dom";
import StepStation from "./component/step/StepStation";
import StepMemo from "./component/step/StepMemo";
import CompleteMakePlace from "./component/page/CompleteMakePlace";
import StepNickname from "./component/step/StepNickname";
import CompleteRecommend from "./component/page/CompleteRecommend";
import RecommendPlaceLayout from "./component/page/RecommendPlaceLayout";
import StepLocation from "./component/step/StepLocation";
import StepRecommend from "./component/step/StepRecommend";
import StartRecommend from "./component/page/StartRecommend";
import StartMakePlace from "./component/page/StartMakePlace";
import StepSelectMapType from "./component/step/StepSelectMapType";
import StepGroupProfile from "./component/step/StepGroupProfile";

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
