import React from "react";
import { Outlet } from "react-router-dom";

export default function MakePlaceLayout() {
  return (
    <div>
      <h2>Make Place</h2>
      <Outlet />
    </div>
  );
}


