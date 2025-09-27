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
  const { slug } = useParams(); // 그룹 slug

  const [data, setData] = useState(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const USE_MOCK = false;

  const handleCopyLink = async () => {
    if (!slug) {
      window.alert("공유할 링크의 slug가 없습니다.");
      return;
    }
    const shareUrl = `${window.location.origin}/shared-map/group/${slug}/splash`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch {
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
    navigate(`/shared-map/group/${slug}/onboarding/location`);
  };

  function goPrev() {
    navigate("/");
  }

  const selectedItem = selectedItemId
    ? data.items.find((item) => item.id === selectedItemId)
    : null;

  const handleCloseDetail = () => {
    setSelectedItemId(null);
  };

  useEffect(() => {
    if (showAiPopup) {
      const timer = setTimeout(() => setShowAiPopup(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAiPopup]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchAll() {
      setError("");

      try {
        if (USE_MOCK) {
          // 데모용 목업은 생략 (기존 코드 유지 가능)
          return;
        }

        // 1) 그룹 지도 불러오기
        const reqRes = await axios.get(`${BASE_URL}/api/groups/${slug}/map`, {
          signal: controller.signal,
          withCredentials: true,
        });
        const reqData = reqRes?.data?.data;
        if (!reqData) throw new Error("요청 데이터가 비어 있습니다.");

        // 대표 request slug 확보 (백엔드가 group.map 응답의 slug에 담아줌)
        const requestSlug = reqData.slug;

        // 2) AI 추천 불러오기 — 실패해도 무시
        let aiItems = [];
        try {
          // ✅ 중요: AI 추천은 '그룹 slug'가 아니라 '대표 requestSlug'로 호출
          const aiRes = await axios.get(
            `${BASE_URL}/api/recommendations/auto`,
            {
              params: { slug: requestSlug, n: 5, q: "" },
              signal: controller.signal,
              withCredentials: true,
            }
          );
          aiItems = aiRes?.data?.data?.items ?? [];
        } catch {
          aiItems = [];
        }

        // 3) 아이템 합치기 + isAI 플래그
        const friendItems = (reqData.items ?? []).map((it) => ({
          ...it,
          isAI: false,
        }));
        const aiItemsMarked = (aiItems ?? []).map((it) => ({
          ...it,
          isAI: true,
        }));
        const mergedItems = [...friendItems, ...aiItemsMarked];

        // 4) 뷰모델 구성
        const pinVMs = mergedItems.map((item) => toPinVM(item, item.isAI));
        const cardVMs = mergedItems.map((item) => toCardVM(item, item.isAI));

        // 5) 화면 상태 세팅
        setData({
          ...reqData, // 서버 응답 그대로 유지
          requestSlug, // ✅ 대표 request slug 저장 (메모/AI 호출용)
          items: mergedItems,
          pinVMs,
          cardVMs,
        });
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

  const handleCardClick = (item) => setSelectedItemId(item.id);
  const handleAiTagClick = (item) => setShowAiPopup(true);

  if (!data) {
    return (
      <PageContainer>
        <LoadingSpinner size="large" text="지도 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  const getLineKey = (line) => {
    if (line == null) return "";
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
            src="/Link_Horizontal.svg"
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
          onMarkerClick={handleCardClick}
        />
      </MapWrapper>

      {selectedItemId ? (
        <PlaceDetail
          item={selectedItem}
          onClose={handleCloseDetail}
          /** ✅ 그룹 노트 모드로 호출: /api/groups/{group_slug}/places/notes */
          notesBase="groups"
          notesSlug={slug}
        />
      ) : (
        <CardListWrapper>
          <PlaceCardList
            items={data.cardVMs}
            onCardClick={handleCardClick}
            onAiTagClick={handleAiTagClick}
          />
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

/* styled-components (동일) */
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
  background-color: #ffefedc8;
  padding: 10px 16px;
  border-radius: 8px;
  text-align: start;
  z-index: 10;
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
  bottom: 18px;
  transform: translateX(-50%);
  background: #ffefed;
  color: #585858;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  z-index: 1200;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
`;
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
