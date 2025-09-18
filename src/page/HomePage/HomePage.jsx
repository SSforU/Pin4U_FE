import React from "react";
import styled from "styled-components";
import StationList from "./Components/StationList";
import Button from "../../component/ui/Button";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import HomeSearchBox from "../../component/ui/HomeSearchBox";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { userProfile } = useOutletContext();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        const { data } = await axios.get(`${BASE_URL}/api/requests`, {
          params: {},
        });

        const items = data?.data?.items ?? [];
        const mapped = items.map((x, i) => {
          const lines =
            typeof x.station_line === "string"
              ? x.station_line
                  .replace(/호선/g, "")
                  .split("·")
                  .map((s) => Number(s.trim()))
                  .filter(Boolean)
              : [];

          return {
            id: String(i + 1),
            slug: x.slug,
            name: `${x.station_name}역`, // “역”은 UI에서 붙이기
            lines,
            address: x.road_address_name ?? "",
            recommended_counts: Number(x.recommend_count ?? 0),
            created_at: x.created_at,
          };
        });

        setStations(mapped);
      } catch (e) {
        setErrorMsg(
          e?.response?.data?.error?.message ||
            e?.message ||
            "불러오기에 실패했어요."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddMapClick = () => {
    navigate(`/make-place`);
  };

  const filteredStations = useMemo(() => {
    const q = searchTerm.trim();
    if (!q) return stations;
    return stations.filter((s) => s.name.includes(q));
  }, [searchTerm, stations]);

  return (
    <PageContainer>
      <TitleBox>
        <PageTitle>{userProfile?.nickname} 님의 지도</PageTitle>
      </TitleBox>

      <ContentContainer>
        <HomeSearchBox onSearch={setSearchTerm} />
        {!loading && !errorMsg && <StationList stations={filteredStations} />}
      </ContentContainer>

      <ButtonContainer>
        <Button onClick={handleAddMapClick}>나만의 지도 추가하기</Button>
      </ButtonContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const TitleBox = styled.div`
  width: 90%;
  display: flex;
  padding: 15px 0;
  border-bottom: 2px solid #e7e7e7;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  margin: 0;
`;

const ContentContainer = styled.div`
  width: 90%;
  flex: 1 1 auto;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 15px;
  box-sizing: border-box;

  /* 스크롤바 기본 숨기기 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 6px; /* 스크롤바 두께 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 스크롤 thumb 색상 */
    border-radius: 10px;
    transition: opacity 0.3s;
    opacity: 0; /* 평소에는 안 보이게 */
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* hover 중일 때만 thumb 보이게 */
  &:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  padding: 20px 15px;
  box-sizing: border-box;

  position: sticky;
  bottom: 0;
  background: linear-gradient(#fff 60%, rgba(255, 255, 255, 0));
  z-index: 5;
`;
