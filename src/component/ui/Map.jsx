// Map.jsx
import React, { useEffect } from "react";
import styled from "styled-components";

const MapContainer = styled.div`
  width: 100%;

  /* 기본: 뷰포트 높이의 450/844 만큼 */
  height: calc(100dvh * 450 / 844);

  /* 모바일 브라우저에서 주소창 수축 고려 */
  @supports (height: 100svh) {
    height: calc(100svh * 450 / 844);
  }

  /* 혹시나 너무 작은 화면 보호용 최소 높이 */
  min-height: 240px;
`;

export default function Map({ station, items }) {
  useEffect(() => {
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(station.lat, station.lng),
          level: 4,
        };
        const map = new window.kakao.maps.Map(container, options);

        // API의 items 정보를 기반으로 마커를 지도에 표시하는 로직을 여기에 추가
        // 예시:
        // items.forEach(item => {
        //   const markerPosition = new window.kakao.maps.LatLng(item.y, item.x);
        //   new window.kakao.maps.Marker({
        //     map: map,
        //     position: markerPosition,
        //     title: item.place_name,
        //   });
        // });
      } else {
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, [station, items]); // station이나 items가 변경될 때 지도를 다시 로드

  return <MapContainer id="map"></MapContainer>;
}
