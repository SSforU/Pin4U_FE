// PlaceMapPage.jsx
import React, { useState, useEffect } from "react";
import Map from "./Component/Map.jsx";
import PlaceCardList from "./PlaceCardList.jsx";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PlaceDetail from "./DetailPage/PlaceDetail.jsx";
import LoadingSpinner from "../../component/ui/LoadingSpinner.jsx";
import { toPinVM, toCardVM } from "../../viewModels/placeVMs.js";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function GroupPlaceMapPage() {
  const navigate = useNavigate();
  const { slug } = useParams(); // /api/requests/{slug} 에서 slug 사용

  const [data, setData] = useState(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false); // Memo 상태 추가
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAiPopup, setShowAiPopup] = useState(false); // AI 팝업 상태 추가
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false); // 복사 성공 상태 추가

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const USE_MOCK = false; // 목업으로 실행하려면 true

  // 링크 복사 함수
  const handleCopyLink = async () => {
    if (!slug) {
      window.alert("공유할 링크의 slug가 없습니다.");
      return;
    }

    const shareUrl = `${window.location.origin}/shared-map/group/${slug}/splash`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2초 후에 토스트 숨기기
    } catch (err) {
      try {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // 2초 후에 토스트 숨기기
      } catch (err) {
        window.prompt(
          "복사에 실패했어요. 아래 링크를 수동으로 복사해 주세요:",
          shareUrl
        );
      }
    }
  };

  const handleAddPlace = () => {
    if (!slug) {
      window.alert("그룹 slug가 없어요.");
      return;
    }
    navigate(`/shared-map/group/${slug}/onboarding/location`); // <StartRecommendGroupReqeust /> 라우트로
  };

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
        if (USE_MOCK) {
          const BASE_LAT = 37.4969;
          const BASE_LNG = 126.9575;
          const jitter = (n) => (Math.random() - 0.5) * n;

          const station = {
            code: "SSU-710",
            name: "숭실대입구",
            line: "7호선",
            lat: BASE_LAT,
            lng: BASE_LNG,
          };

          // /api/request/{slug} 목업 (친구 추천)
          const requestResp = {
            result: "ok",
            data: {
              slug: slug || "soongsil-univ",
              station,
              requestMessage:
                "학교 주변에서 브런치나 디저트 먹기 좋은 아늑한 곳 추천해줘!",
              items: [
                {
                  externalId: "kakao_1001",
                  id: "f-101",
                  placeName: "카페 이층양옥",
                  categoryGroupCode: "CE7",
                  categoryGroupName: "카페",
                  categoryName: "브런치 카페",
                  addressName: "서울 동작구 상도로 369",
                  roadAddressName: "서울 동작구 상도로 369",
                  x: String(BASE_LNG + jitter(0.004)), // lng
                  y: String(BASE_LAT + jitter(0.004)), // lat
                  distanceM: 240,
                  placeUrl: "https://place.map.kakao.com/1001",
                  mock: {
                    rating: 4.6,
                    ratingCount: 183,
                    imageUrls: ["/mock/cafe_1.jpg"],
                    openingHours: ["월-일 10:00-22:00"],
                  },
                  ai: {
                    summaryText:
                      "빈티지 감성, 브런치·디저트가 안정적인 카페. 친구와 수다 떨기 좋아요.",
                    evidence: "인근 후기 요약",
                    updatedAt: new Date().toISOString(),
                  },
                  recommended_count: 12,
                },
                {
                  externalId: "kakao_1002",
                  id: "f-102",
                  placeName: "평양냉면 수풀",
                  categoryGroupCode: "FD6",
                  categoryGroupName: "음식점",
                  categoryName: "한식",
                  addressName: "서울 동작구 상도로 411",
                  roadAddressName: "서울 동작구 상도로 411",
                  x: String(BASE_LNG + jitter(0.004)),
                  y: String(BASE_LAT + jitter(0.004)),
                  distanceM: 430,
                  placeUrl: "https://place.map.kakao.com/1002",
                  mock: {
                    rating: 4.4,
                    ratingCount: 96,
                    imageUrls: ["/mock/noodle_1.jpg"],
                    openingHours: ["화-일 11:00-21:00", "월 휴무"],
                  },
                  ai: {
                    summaryText:
                      "담백한 평냉과 수육이 인기. 시원한 점심으로 가볍게 좋아요.",
                    evidence: "블로그·리뷰 요약",
                    updatedAt: new Date().toISOString(),
                  },
                  recommended_count: 8,
                },
                {
                  externalId: "kakao_1003",
                  id: "f-103",
                  placeName: "리틀모닝",
                  categoryGroupCode: "FD6",
                  categoryGroupName: "음식점",
                  categoryName: "브런치",
                  addressName: "서울 동작구 상도로 285",
                  roadAddressName: "서울 동작구 상도로 285",
                  x: String(BASE_LNG + jitter(0.004)),
                  y: String(BASE_LAT + jitter(0.004)),
                  distanceM: 350,
                  placeUrl: "https://place.map.kakao.com/1003",
                  mock: {
                    rating: 4.5,
                    ratingCount: 142,
                    imageUrls: ["/mock/brunch_1.jpg"],
                    openingHours: ["월-일 10:00-16:00"],
                  },
                  ai: {
                    summaryText:
                      "전체적으로 밝고 포근한 분위기. 달걀요리·팬케이크 평이 좋아요.",
                    evidence: "포토리뷰 요약",
                    updatedAt: new Date().toISOString(),
                  },
                  recommended_count: 10,
                },
              ],
            },
            error: null,
            timestamp: new Date().toISOString(),
          };

          const autoResp = {
            result: "ok",
            data: {
              slug: slug || "soongsil-univ",
              station,
              requestMessage: requestResp.data.requestMessage,
              items: [
                {
                  externalId: "kakao_2001",
                  id: "a-201",
                  placeName: "버터필름",
                  categoryGroupCode: "FD6",
                  categoryGroupName: "음식점",
                  categoryName: "베이커리",
                  addressName: "서울 동작구 상도로 190",
                  roadAddressName: "서울 동작구 상도로 190",
                  x: String(BASE_LNG + jitter(0.005)),
                  y: String(BASE_LAT + jitter(0.005)),
                  distanceM: 510,
                  placeUrl: "https://place.map.kakao.com/2001",
                  mock: {
                    rating: 4.7,
                    ratingCount: 220,
                    imageUrls: ["/mock/bakery_1.jpg"],
                    openingHours: ["화-일 10:00-21:00", "월 휴무"],
                  },
                  ai: {
                    summaryText:
                      "버터 풍미 진한 페이스트리와 시즌 크루아상이 강점.",
                    evidence: "AI 추천 모델",
                    updatedAt: new Date().toISOString(),
                  },
                  recommended_count: 0,
                },
                {
                  externalId: "kakao_2002",
                  id: "a-202",
                  placeName: "스테이션버거",
                  categoryGroupCode: "FD6",
                  categoryGroupName: "음식점",
                  categoryName: "수제버거",
                  addressName: "서울 동작구 상도로 201",
                  roadAddressName: "서울 동작구 상도로 201",
                  x: String(BASE_LNG + jitter(0.005)),
                  y: String(BASE_LAT + jitter(0.005)),
                  distanceM: 580,
                  placeUrl: "https://place.map.kakao.com/2002",
                  mock: {
                    rating: 4.3,
                    ratingCount: 74,
                    imageUrls: ["/mock/burger_1.jpg"],
                    openingHours: ["월-일 11:30-21:30"],
                  },
                  ai: {
                    summaryText:
                      "빵이 달지 않고 패티가 촉촉—감자튀김까지 균형 좋음.",
                    evidence: "AI 추천 모델",
                    updatedAt: new Date().toISOString(),
                  },
                  recommended_count: 0,
                },
              ],
            },
            error: null,
            timestamp: new Date().toISOString(),
          };

          const friend = requestResp.data.items.map((it) => ({
            ...it,
            isAI: false,
          }));
          const ai = autoResp.data.items.map((it) => ({ ...it, isAI: true }));
          const merged = [...friend, ...ai];

          const pinVMs = merged.map((it) => toPinVM(it, it.isAI));
          const cardVMs = merged.map((it) => toCardVM(it, it.isAI));

          setData({
            id: `req-${requestResp.data.slug}`,
            slug: requestResp.data.slug,
            requestMessage: requestResp.data.requestMessage,
            station: requestResp.data.station,
            items: merged,
            pinVMs,
            cardVMs,
          });
          return;
        }

        // 실제 API 모드
        const reqRes = await axios.get(`${BASE_URL}/api/groups/${slug}/map`, {
          signal: controller.signal,
          withCredentials: true,
        });
        const reqData = reqRes?.data?.data;
        if (!reqData) throw new Error("요청 데이터가 비어 있습니다.");

        let aiItems = [];
        try {
          const aiRes = await axios.get(
            `${BASE_URL}/api/recommendations/auto?slug=${slug}&n=5&q=`,
            {
              signal: controller.signal,
              withCredentials: true,
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

    if (slug || USE_MOCK) fetchAll();
    return () => controller.abort();
  }, [slug]);

  const handleCardClick = (item) => {
    setSelectedItemId(item.id); // 클릭된 카드의 id를 상태에 저장
  };

  const handleAiTagClick = (item) => {
    console.log(`AI Tag clicked: ${item.placeName}`);
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
        <ActionsRight>
          <CopyLinkBtnImage
            onClick={handleCopyLink}
            src="/Link_Horizontal.svg" // 아이콘 경로(원하는 이미지로 교체 가능)
            alt="링크 복사"
            title="링크 복사"
            style={{ border: "1px solid #383838" }}
          />
          <MapMemoBtnImage
            onClick={() => setIsMemoOpen(!isMemoOpen)}
            src={isMemoOpen ? "/MapMemoBtn-On.svg" : "/MapMemoBtn-Off.svg"}
            alt="지도 메모 버튼"
            style={
              isMemoOpen
                ? { border: "1px solid #FF7E74" }
                : { border: "1px solid #383838" }
            }
          />
        </ActionsRight>
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

          {/* 👉 카드 오른쪽 고정 도크 */}
          <GroupInfoDock>
            <GroupThumb
              src={data.group?.image_url || "/Pin4U_Logo.png"}
              alt={`${data.group?.name ?? "그룹"} 썸네일`}
              onError={(e) => {
                e.currentTarget.src = "/mock/group_default_thumb.png";
              }}
            />
            <GroupText>{data.group?.name ?? "그룹명"}</GroupText>
            <AddPlaceButton onClick={handleAddPlace}>
              장소 추가하기
            </AddPlaceButton>
          </GroupInfoDock>
        </CardListWrapper>
      )}
      {showAiPopup && (
        <MessagePopup>
          김숭실 님이 추천 받은 장소에 기반하여 AI가 추천한 장소예요.
        </MessagePopup>
      )}
      {copySuccess && <CopyToast>링크가 복사되었어요!</CopyToast>}
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
  position: relative;
  padding-left: 120px;
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
  padding: 2.5px;
  border-radius: 999px;
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

const ActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CopyLinkBtnImage = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
  user-select: none;
  padding: 2.5px;
  border-radius: 999px;
`;

const CopyToast = styled.div`
  position: fixed;
  left: 50%;
  bottom: 18px; /* iOS 홈인디케이터 위로 살짝 */
  transform: translateX(-50%);
  background: #ffefed;
  color: #585858;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  z-index: 1200;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;

/* 오른쪽 고정 도크 */
const GroupInfoDock = styled.div`
  position: absolute;
  left: 12px;
  top: 12px;
  bottom: 12px;
  width: 98px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  z-index: 1;
`;

const GroupThumb = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid #e6e6e6;
  background: #fff;
`;

const GroupText = styled.div`
  font-size: 12px;
  color: #8a8a8a;
  text-align: center;
`;

const AddPlaceButton = styled.button`
  appearance: none;
  border: 1px solid #ff7e74;
  background: #fff;
  color: #ff7e74;
  border-radius: 12px;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
`;
