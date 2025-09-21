import React from "react";
import styled from "styled-components";
import StationList from "./List/StationList.jsx";
import Button from "../../component/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import HomeSearchBox from "./Component/HomeSearchBox.jsx";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import GroupList from "./List/GroupList.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { userProfile } = useOutletContext();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const MOCK_ITEMS = [
    {
      slug: "soongsil-univ",
      station_name: "숭실대입구",
      station_line: "7호선",
      road_address_name: "서울 동작구 상도로 369",
      recommend_count: 12,
      created_at: "2025-09-15T10:12:00Z",
    },
    {
      slug: "yongsan",
      station_name: "용산",
      station_line: "1·경의중앙호선",
      road_address_name: "서울 용산구 한강대로 405",
      recommend_count: 8,
      created_at: "2025-09-12T08:22:10Z",
    },
    {
      slug: "seoul-station",
      station_name: "서울",
      station_line: "1·4·공항철도호선",
      road_address_name: "서울 중구 한강대로 405",
      recommend_count: 31,
      created_at: "2025-09-10T02:40:00Z",
    },
    {
      slug: "gangnam",
      station_name: "강남",
      station_line: "2·신분당호선",
      road_address_name: "서울 강남구 강남대로 396",
      recommend_count: 44,
      created_at: "2025-09-09T11:05:00Z",
    },
    {
      slug: "hongdae",
      station_name: "홍대입구",
      station_line: "2·경의중앙·공항철도호선",
      road_address_name: "서울 마포구 양화로 160",
      recommend_count: 27,
      created_at: "2025-09-08T14:33:20Z",
    },
  ];

  const MOCK_GROUPS = [
    {
      id: "g1",
      name: "일이삼사",
      thumbnail: "", // 이미지 없으면 이니셜 fallback
      stationName: "홍대입구역",
      lines: [7],
    },
    {
      id: "g2",
      name: "친구들 모임",
      thumbnail: "",
      stationName: "강남역",
      lines: [2], // 문자열도 들어오면 그대로 뱃지에 표시됨
    },
    {
      id: "g3",
      name: "동아리",
      thumbnail: "",
      stationName: "홍대입구역",
      lines: [2],
    },
    {
      id: "g1",
      name: "그룹명",
      thumbnail: "", // 이미지 없으면 이니셜 fallback
      stationName: "숭실대입구역",
      lines: [7],
    },
    {
      id: "g2",
      name: "친구들 모임",
      thumbnail: "",
      stationName: "강남역",
      lines: [2], // 문자열도 들어오면 그대로 뱃지에 표시됨
    },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // const { data } = await axios.get(`${BASE_URL}/api/requests`, {
        //   params: {},
        // });

        // const items = data?.data?.items ?? [];
        const items = MOCK_ITEMS; // TODO: 나중에 주석 해제

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
            name: `${x.station_name}역`,
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

      <GroupList
        title="그룹 지도"
        groups={MOCK_GROUPS}
        onItemClick={(g) => navigate(`/group/${g.id}`)}
      />
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
  height: 100vh;
  background: #fff;
`;

const TitleBox = styled.div`
  /* width: 90%;
  display: flex;
  padding: 15px 20px; */
  width: 100%;
  padding: 16px 35px;
  height: calc(100dvh * 90 / 844);
  border-bottom: 1px solid #ffffff;
  display: flex;
  align-items: flex-end;
  justify-content: start;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  margin: 0;
`;

const ContentContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 30px;
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
  padding: 10px 15px 20px;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  background: linear-gradient(#fff 60%, rgba(255, 255, 255, 0));
  z-index: 5;
`;
