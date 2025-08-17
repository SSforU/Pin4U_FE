import React from "react";
import { useParams } from "react-router-dom";
import Map from "../ui/Map";

export default function PlaceMapPage() {
  const { slug } = useParams();
  return (
    <div>
      PlaceMap: {slug}
      <Map />
    </div>
  );
}
