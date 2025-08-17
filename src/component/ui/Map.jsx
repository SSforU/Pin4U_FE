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

export default function HomeMap() {
  useEffect(() => {
    // 카카오맵 API가 로드될 때까지 기다리는 함수
    const initMap = () => {
      if (window.kakao && window.kakao.maps) {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5721, 126.9854),
          level: 10,
        };
        // eslint-disable-next-line no-unused-vars
        const map = new window.kakao.maps.Map(container, options);
      } else {
        // API가 아직 로드되지 않았다면 잠시 후 다시 시도
        setTimeout(initMap, 100);
      }
    };

    initMap();
  }, []);

  return <MapContainer id="map"></MapContainer>;
}
