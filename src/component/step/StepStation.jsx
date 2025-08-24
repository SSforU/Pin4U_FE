// 최초 앱 접속자 온보딩
// #3 지하철역 검색 API 연동
// 고정 사용자가 선택한 역 localStorage에 저장
import React from "react";
import SearchBox from "../ui/SearchBox";
import { useState } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";
// TODO: API 연동 시 아래 주석 해제
// import axios from "axios";

function StepStation() {
  const { station, setStation } = useOutletContext();
  const [query, setQuery] = useState(station?.title || "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Mock Data (API 연동 전까지 사용)
  const mockStations = [
    {
      code: "S0701",
      name: "숭실대입구",
      line: "7",
      lat: 37.49641,
      lng: 126.95365,
    },
    { code: "7-734", name: "봉천", line: "7", lat: 37.48236, lng: 126.94245 },
    {
      code: "7-735",
      name: "신대방삼거리",
      line: "7",
      lat: 37.4999,
      lng: 126.9284,
    },
    { code: "7-736", name: "신림", line: "7", lat: 37.4842, lng: 126.9297 },
    { code: "7-737", name: "봉천", line: "7", lat: 37.4824, lng: 126.9425 },
    { code: "2-234", name: "강남", line: "2", lat: 37.4981, lng: 127.0276 },
    { code: "2-235", name: "역삼", line: "2", lat: 37.5002, lng: 127.0365 },
    { code: "2-236", name: "선릉", line: "2", lat: 37.5045, lng: 127.049 },
    { code: "9-901", name: "김포공항", line: "9", lat: 37.5624, lng: 126.8019 },
    { code: "9-902", name: "공항시장", line: "9", lat: 37.5634, lng: 126.8107 },
  ];

  // 역 검색 함수 (Mock Data 사용)
  const fetchStations = async (q) => {
    if (!q || q.trim().length < 1) {
      setItems([]);
      return;
    }

    setLoading(true);

    // API 연동 전까지 Mock Data 사용
    setTimeout(() => {
      const filteredStations = mockStations.filter(
        (station) =>
          station.name.includes(q.trim()) ||
          station.code.includes(q.trim()) ||
          station.line.includes(q.trim())
      );

      // SearchBox에서 사용하는 형식으로 변환
      const stations = filteredStations.map((station) => ({
        id: station.code,
        title: station.name,
        subtitle: `${station.line}호선`,
        code: station.code,
        line: station.line,
        lat: station.lat,
        lng: station.lng,
      }));

      setItems(stations);
      setLoading(false);
    }, 300); // API 호출 시뮬레이션을 위한 지연

    // TODO: API 연동 시 아래 주석 해제하고 위 Mock Data 로직 제거
    /*
    try {
      const response = await axios.get(
        `${BASE_URL}/api/stations/search?q=${encodeURIComponent(q.trim())}`
      );
      
      if (response.data.result === "success") {
        // API 응답을 SearchBox에서 사용하는 형식으로 변환
        const stations = response.data.data.items.map(station => ({
          id: station.code,
          title: station.name,
          subtitle: `${station.line}호선`,
          code: station.code,
          line: station.line,        // 원본 호선 번호 보존
          lat: station.lat,
          lng: station.lng,
        }));
        setItems(stations);
      } else {
        setItems([]);
        console.error("역 검색 실패:", response.data.error);
      }
    } catch (error) {
      console.error("역 검색 API 호출 실패:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <Wrapper>
      <TextBlock>
        <Title>
          방문할 장소와 가장 가까운
          <br />
          &nbsp;지하철 역을 입력해 주세요.
        </Title>
        <Detail>입력한 지하철 역과 가까운 장소를 추천해 드릴게요.</Detail>
      </TextBlock>
      <SearchBox
        query={query}
        onChange={setQuery}
        onDebouncedChange={fetchStations}
        debounceMs={200}
        suggestions={items}
        loading={loading}
        onSelect={(item) => {
          setQuery(item.title); // 선택값 반영 (선택)

          // API 응답 형식에 맞게 station 객체 구성
          const selectedStation = {
            code: item.code,
            name: item.title,
            line: item.line, // 원본 호선 번호 사용
            lat: item.lat,
            lng: item.lng,
          };

          setStation(selectedStation); // 부모의 state 업데이트

          // localStorage에 station code만 저장 (API 호출 시 사용)
          localStorage.setItem("selectedStation", item.code);
        }}
        placeholder={"지하철 역을 검색하세요"}
      />
    </Wrapper>
  );
}

export default StepStation;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  max-width: 500px;
  display: flex;
  margin: 0 auto;
  padding: 24px 20px 0;
  flex-direction: column;
  align-items: stretch; /*좌측 정렬 핵심 속성 */
  gap: 54px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;

const Detail = styled.div`
  color: #585858;
  font-size: 14px;
  margin: 0;
  padding-left: 5px;
`;
