// PlaceMapPage.jsx
import React, { useState, useEffect } from "react";
import Map from "../ui/Map";
import PlaceCardList from "../list/PlaceCardList";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PlaceDetail from "../ui/PlaceDetail";
import LoadingSpinner from "../ui/LoadingSpinner";
import { toPinVM, toCardVM } from "../../viewModels/placeVMs";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function PlaceMapPage() {
  const navigate = useNavigate();
  const { slug } = useParams(); // /api/requests/{slug} 에서 slug 사용

  const [data, setData] = useState(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false); // Memo 상태 추가
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAiPopup, setShowAiPopup] = useState(false); // AI 팝업 상태 추가
  const [error, setError] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  function goPrev() {
    navigate("/");
  }

  const selectedItem = selectedItemId
    ? data.items.find((item) => item.id === selectedItemId)
    : null;

  // PlaceDetail 닫기 함수
  const handleCloseDetail = () => {
    setSelectedItemId(null);
  };

  // AI 팝업 타이머 설정
  useEffect(() => {
    if (showAiPopup) {
      const timer = setTimeout(() => {
        setShowAiPopup(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showAiPopup]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAll() {
      setError("");

      try {
        const reqRes = await axios.get(`${BASE_URL}/api/requests/${slug}`, {
          signal: controller.signal,
        });
        const reqData = reqRes?.data?.data;
        if (!reqData) throw new Error("요청 데이터가 비어 있습니다.");

        let aiItems = [];
        try {
          const aiRes = await axios.get(
            `${BASE_URL}/api/recommendations/auto?slug=${slug}&n=5&q=`,
            {
              signal: controller.signal,
            }
          );
          aiItems = aiRes?.data?.data?.items ?? [];
        } catch (e) {
          // AI가 아직 없거나 실패해도 메인 로딩을 막지 않도록 조용히 넘어감
          aiItems = [];
        }

        // 3) 아이템 합치기 + isAI 플래그
        const friendItems = (reqData.items ?? []).map((it) => ({
          ...it,
          isAI: false,
        }));
        const aiItemsMarked = aiItems.map((it) => ({ ...it, isAI: true }));

        const mergedItems = [...friendItems, ...aiItemsMarked];

        // 4) 뷰모델 구성
        const pinVMs = mergedItems.map((item) => toPinVM(item, item.isAI));
        const cardVMs = mergedItems.map((item) => toCardVM(item, item.isAI));

        // 5) 화면 상태 세팅(기존 형태 유지)
        setData({
          ...reqData,
          items: mergedItems,
          pinVMs,
          cardVMs,
        });

        // AI 결과가 있다면 안내 팝업 잠깐 노출
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error(e);
          setError(e.message || "데이터를 불러오지 못했습니다.");
        }
      }
    }

    if (slug) fetchAll();
    return () => controller.abort();
  }, [slug]);

  const handleCardClick = (item) => {
    setSelectedItemId(item.id); // 클릭된 카드의 id를 상태에 저장
  };

  const handleAiTagClick = (item) => {
    console.log(`AI Tag clicked: ${item.place_name}`);
    setShowAiPopup(true);
  };

  if (!data) {
    return (
      <PageContainer>
        <LoadingSpinner size="large" text="지도 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  // 2) API가 "7", 7, "7호선", "4,7" 등 무엇을 주든 첫 번째 라인 번호만 추출
  const getLineKey = (line) => {
    if (line == null) return "";
    // 문자열로 만들고, "호선" 제거, 콤마/공백 기준 첫 토큰만 사용, 숫자만 남기기
    const first = String(line).split(",")[0].trim().replace("호선", "");
    const digits = first.match(/\d+/)?.[0] ?? "";
    return digits;
  };

  const lineKey = getLineKey(data?.station?.line);
  const lineSrc = subwayLineImages[lineKey];

  return (
    <PageContainer>
      <Header>
        <StationWrapper>
          <PrevButton src="/PrevButton.png" alt="뒤로가기" onClick={goPrev} />
          <StationName>{data.station.name}역</StationName>
          <SubwayLineIcon $imageUrl={lineSrc} />
        </StationWrapper>
        <MapMemoBtnImage
          onClick={() => setIsMemoOpen(!isMemoOpen)}
          src={isMemoOpen ? "/MapMemoBtn-On.png" : "/MapMemoBtn-Off.png"}
          alt="지도 메모 버튼"
        />
      </Header>
      <MapWrapper>
        {isMemoOpen && (
          <MapMemo>
            <MemoText>{data.requestMessage}</MemoText>
          </MapMemo>
        )}
        <Map
          station={data.station}
          items={data.pinVMs}
          selectedItemId={selectedItemId}
          onMarkerClick={handleCardClick} // 마커 클릭 이벤트 연결
        />
      </MapWrapper>
      {selectedItemId ? (
        <PlaceDetail item={selectedItem} onClose={handleCloseDetail} />
      ) : (
        <CardListWrapper>
          <PlaceCardList
            items={data.cardVMs}
            onCardClick={handleCardClick}
            onAiTagClick={handleAiTagClick}
          />
        </CardListWrapper>
      )}
      {showAiPopup && (
        <MessagePopup>
          김숭실 님이 추천 받은 장소에 기반하여 AI가 추천한 장소예요.
        </MessagePopup>
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
`;

const Header = styled.div`
  padding: 16px;
  font-size: 20px;
  font-weight: medium;
  text-align: center;
  height: calc(100dvh * 140 / 844);
  border-bottom: 1px solid #ffffff;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: space-between;
`;

const MapWrapper = styled.div`
  position: relative;
`;

const StationName = styled.div`
  padding: 0;
  margin: 0;
`;

const StationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const CardListWrapper = styled.div`
  height: 220px;
`;

const PrevButton = styled.img`
  cursor: pointer;
  width: 28px;
  height: 28px;
  position: relative;
  top: 2px;
`;

const subwayLineImages = {
  1: "/subway/1호선.png",
  2: "/subway/2호선.png",
  3: "/subway/3호선.png",
  4: "/subway/4호선.png",
  5: "/subway/5호선.png",
  6: "/subway/6호선.png",
  7: "/subway/7호선.png",
  8: "/subway/8호선.png",
  9: "/subway/9호선.png",
};

const SubwayLineIcon = styled.div`
  width: 35px;
  height: 35px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  background-image: ${(props) => `url('${props.$imageUrl}')`};
`;
const MapMemoBtnImage = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const MapMemo = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  background-color: #ffefedc8; // 분홍색
  padding: 10px 16px;
  border-radius: 8px;
  text-align: start;
  z-index: 10; /* 이 속성을 추가하여 지도보다 위에 오도록 합니다 */
`;

const MemoText = styled.p`
  margin: 0;
  font-size: 16px;
  color: #333;
`;

const MessagePopup = styled.div`
  position: fixed;
  bottom: calc(100svh * 265 / 844);
  left: 50%;
  transform: translateX(-50%);
  background-color: #ffefeddc;
  color: #585858;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  white-space: nowrap;
`;
