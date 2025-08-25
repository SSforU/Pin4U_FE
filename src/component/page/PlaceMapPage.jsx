// PlaceMapPage.jsx
import React, { useState, useEffect } from "react";
import Map from "../ui/Map"; // Map 컴포넌트의 경로가 올바른지 확인해주세요
import PlaceCardList from "../list/PlaceCardList";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PlaceDetail from "../ui/PlaceDetail";
import { toPinVM, toCardVM } from "../../viewModels/placeVMs";
import axios from "axios";
import { useParams } from "react-router-dom";

// 지인 추천 API 데이터 예시 (기존 데이터)
// const friendMockApiData = {
//   result: "success",
//   data: {
//     slug: "abCDef12",
//     station: {
//       code: "7-733",
//       name: "숭실대입구",
//       line: "7",
//       lat: 37.49641,
//       lng: 126.95365,
//     },
//     request_message: "카페 추천 부탁!",
//     items: [
//       {
//         external_id: "kakao:123456789",
//         id: "123456789",
//         place_name: "미학당",
//         category_group_code: "CE7",
//         category_group_name: "카페",
//         category_name: "음식점 > 카페",
//         address_name: "서울 동작구 ㅇㅇ로 12",
//         road_address_name: "서울 동작구 ㅇㅇ로 12길 3",
//         x: "126.95790",
//         y: "37.49611",
//         place_url: "http://place.map.kakao.com/123456789",
//         mock: {
//           rating: 4.6,
//           rating_count: 128,
//           image_urls: ["/picture.png"],
//         },
//         ai: {
//           summary_text: "조용한 분위기 선호 사용자에게 적합한 카페.",
//           tags: ["조용", "카페"],
//         },
//         recommended_count: 2,
//       },
//       {
//         external_id: "kakao:987654321",
//         id: "987654321",
//         place_name: "잔디속에있다고 상상을해",
//         category_group_code: "CE7",
//         category_group_name: "카페",
//         category_name: "음식점 > 카페",
//         address_name: "서울 동작구 ㅇㅇ로 13",
//         road_address_name: "서울 동작구 ㅇㅇ로 13길 4",
//         x: "126.95800",
//         y: "37.49620",
//         place_url: "http://place.map.kakao.com/987654321",
//         mock: {
//           rating: 4.8,
//           rating_count: 99,
//           image_urls: ["/picture.png"],
//         },
//         ai: {
//           summary_text: "야외 정원이 매력적인 카페.",
//           tags: ["야외", "정원"],
//         },
//         recommended_count: 3,
//       },
//       {
//         external_id: "kakao:112233445",
//         id: "112233445",
//         place_name: "콘하스",
//         category_group_code: "CE7",
//         category_group_name: "카페",
//         category_name: "음식점 > 카페",
//         address_name: "서울 동작구 ㅇㅇ로 14",
//         road_address_name: "서울 동작구 ㅇㅇ로 14길 5",
//         x: "126.95810",
//         y: "37.49630",
//         place_url: "http://place.map.kakao.com/112233445",
//         mock: {
//           rating: 4.5,
//           rating_count: 201,
//           image_urls: ["/picture.png"],
//         },
//         ai: {
//           summary_text: "넓고 쾌적한 공간의 인테리어가 좋은 카페.",
//           tags: ["넓은 공간", "인테리어"],
//         },
//         recommended_count: 5,
//       },
//     ],
//   },
// };

// AI 추천 API 데이터 예시 (새로운 데이터)
// const aiMockApiData = {
//   result: "success",
//   data: {
//     items: [
//       {
//         external_id: "kakao:999999999",
//         id: "999999999",
//         place_name: "카페가뜨겁다",
//         category_group_code: "CE7",
//         category_group_name: "카페",
//         category_name: "카페 > 디저트카페",
//         address_name: "서울 동작구 ㅇㅇ로 12",
//         road_address_name: "서울 동작구 ㅇㅇ로 12길 3",
//         x: "126.95790",
//         y: "37.49611",
//         place_url: "http://place.map.kakao.com/999999999",
//         distance_m: 420,
//         mock: {
//           rating: 4.5,
//           rating_count: 87,
//           image_urls: [
//             "/picture.png",
//             "/picture.png",
//             "/picture.png",
//             "/picture.png",
//           ],
//         },
//         ai: {
//           summary_text: "조용한 공부하기 좋은 카페",
//           tags: ["조용", "디저트"],
//         },
//         reason: "사용자 선호(조용/카페)와 유사",
//         recommended_count: 0, // AI 추천 장소는 추천 수 0으로 초기화
//       },
//       {
//         external_id: "kakao:987654321",
//         id: "987654321",
//         place_name: "잔디속에있다고 상상을상해",
//         category_group_code: "CE7",
//         category_group_name: "카페",
//         category_name: "음식점 > 카페",
//         address_name: "서울 동작구 ㅇㅇ로 13",
//         road_address_name: "서울 동작구 ㅇㅇ로 13길 4",
//         x: "126.95800",
//         y: "37.49620",
//         place_url: "http://place.map.kakao.com/987654321",
//         mock: {
//           rating: 4.8,
//           rating_count: 99,
//           image_urls: ["/picture.png"],
//         },
//         ai: {
//           summary_text: "야외 정원이 매력적인 카페.",
//           tags: ["야외", "정원"],
//         },
//         recommended_count: 3,
//       },
//     ],
//   },
// };

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
        // 1) 지인 추천(요청 상세) 불러오기: /api/requests/{slug}
        const reqRes = await axios.get(`${BASE_URL}/api/requests/${slug}`, {
          signal: controller.signal,
        });
        const reqData = reqRes?.data?.data;
        if (!reqData) throw new Error("요청 데이터가 비어 있습니다.");

        // 2) AI 추천 불러오기
        //    백엔드 설계에 맞게 엔드포인트 한 곳만 골라 쓰세요:
        //    (예시 A) /api/requests/{slug}/ai
        //    (예시 B) /api/ai-recommendations?slug={slug}
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
        if (aiItemsMarked.length > 0) setShowAiPopup(true);
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
    console.log(`Card clicked: ${item.place_name}`);
    setSelectedItemId(item.id); // 클릭된 카드의 id를 상태에 저장
  };

  const handleAiTagClick = (item) => {
    // This handler is now specifically for the AI tag
    console.log(`AI Tag clicked: ${item.place_name}`);
    setShowAiPopup(true);
  };

  if (!data) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <StationWrapper>
          <PrevButton src="/PrevButton.png" alt="뒤로가기" onClick={goPrev} />
          <StationName>{data.station.name}역</StationName>
          <SubwayLineIcon $imageUrl={subwayLineImages[data.station.line]} />
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
      {/* AI 팝업 렌더링 위치 */}
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
  1: "/1호선.png",
  2: "/2호선.png",
  3: "/3호선.png",
  4: "/4호선.png",
  5: "/5호선.png",
  6: "/6호선.png",
  7: "/7호선.png",
  8: "/8호선.png",
  9: "/9호선.png",
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
