import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./component/page/HomePage";
import MakePlaceLayout from "./component/page/MakePlaceLayout";
import PlaceMapPage from "./component/page/PlaceMapPage";
import { Navigate } from "react-router-dom";
import StepStation from "./component/page/StepStation";
import StepMemo from "./component/page/StepMemo";
import StepInvite from "./component/page/StepInvite";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "place-map/:slug", element: <PlaceMapPage /> },

      {
        path: "make-place",
        element: <MakePlaceLayout />, // 공통 레이아웃 + 상태
        children: [
          { index: true, element: <Navigate to="station" replace /> },
          { path: "station", element: <StepStation /> },
          { path: "memo", element: <StepMemo /> },
        ],
      },
      { path: "invite", element: <StepInvite /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
