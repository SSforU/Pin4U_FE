// Map.jsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const MapContainer = styled.div`
  width: 100%;
  height: calc(100dvh * 450 / 844);

  @supports (height: 100svh) {
    height: calc(100svh * 450 / 844);
  }

  min-height: 240px;
`;

export default function Map({ station, items, selectedItemId }) {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(station.lat, station.lng),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);
        mapRef.current = map;

        // 기존 마커들 제거
        if (Object.keys(markersRef.current).length > 0) {
          for (const key in markersRef.current) {
            markersRef.current[key].marker.setMap(null);
          }
        }
        markersRef.current = {};

        // 마커 이미지 생성
        const blurredImage = new window.kakao.maps.MarkerImage(
          "/Pin_blur.png",
          new window.kakao.maps.Size(30, 30),
          { offset: new window.kakao.maps.Point(15, 30) }
        );
        const clearImage = new window.kakao.maps.MarkerImage(
          "/Pin.png",
          new window.kakao.maps.Size(30, 30),
          { offset: new window.kakao.maps.Point(15, 30) }
        );

        items.forEach((item) => {
          const markerPosition = new window.kakao.maps.LatLng(item.y, item.x);

          const marker = new window.kakao.maps.Marker({
            map: map,
            position: markerPosition,
            title: item.place_name,
            image: blurredImage, // 초기에는 흐릿한 이미지 설정
          });

          markersRef.current[item.id] = { marker, clearImage, blurredImage };

          window.kakao.maps.event.addListener(marker, "click", function () {
            // 클릭 시 PlaceMapPage로 선택된 아이템 ID를 전달하는 로직이 필요
            // 현재 코드에서는 직접적인 상위 컴포넌트 상태 변경이 어려우므로 alert만 유지
            alert("클릭한 장소: " + item.place_name);
          });
        });
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, [station, items]);

  // selectedItemId가 변경될 때 마커 상태 업데이트
  useEffect(() => {
    if (mapRef.current && markersRef.current) {
      for (const id in markersRef.current) {
        const markerInfo = markersRef.current[id];
        if (markerInfo.marker) {
          if (id === selectedItemId) {
            markerInfo.marker.setImage(markerInfo.clearImage);
            mapRef.current.panTo(markerInfo.marker.getPosition());
          } else {
            markerInfo.marker.setImage(markerInfo.blurredImage);
          }
        }
      }
    }
  }, [selectedItemId]);

  return <MapContainer id="map"></MapContainer>;
}
