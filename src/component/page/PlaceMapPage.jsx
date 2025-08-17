import React from "react";
import { useParams } from "react-router-dom";

export default function PlaceMapPage() {
  const { slug } = useParams();
  return <div>PlaceMap: {slug}</div>;
}


