import React from "react";
import { useParams } from "react-router-dom";

export default function GroupPlaceMapPage() {
  const slug = useParams().slug;
  return (
    <div>
      GroupPlaceMapPage
      {slug}
    </div>
  );
}
