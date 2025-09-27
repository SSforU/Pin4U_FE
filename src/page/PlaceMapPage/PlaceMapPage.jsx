// PlaceMapPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import Map from "./Component/Map.jsx";
import PlaceCardList from "./PlaceCardList.jsx";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import PlaceDetail from "./DetailPage/PlaceDetail.jsx";
import LoadingSpinner from "../../component/ui/LoadingSpinner.jsx";
import { toPinVM, toCardVM } from "../../viewModels/placeVMs.js";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL; // e.g. "https://api.ss4u-pin4u.store"

export default function PlaceMapPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [data, setData] = useState(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showAiPopup, setShowAiPopup] = useState(false);
  const [error, setError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  /* ---------- utils ---------- */
  const safeJsonArray = (maybeJson) => {
    if (!maybeJson) return undefined;
    try {
      const parsed =
        typeof maybeJson === "string" ? JSON.parse(maybeJson) : maybeJson;
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  };

  // BE camelCase 위주 + 구버전 snake_case/문자열도 허용
  const normalizeItem = (raw) => {
    if (!raw) return null;

    const placeName = raw.placeName ?? raw.place_name ?? raw.name ?? "";
    const x = String(raw.x ?? "");
    const y = String(raw.y ?? "");
    const distanceM = raw.distanceM ?? raw.distance_m;
    const placeUrl =
      raw.placeUrl ??
      raw.place_url ??
      (raw.externalId && String(raw.externalId).startsWith("kakao:")
        ? `http://place.map.kakao.com/${String(raw.externalId).split(":")[1]}`
        : undefined);

    // id 우선순위: id -> place_id -> externalId
    const id = raw.id ?? raw.place_id ?? raw.externalId ?? raw.external_id;

    // 대표 이미지 후보 (있어도 시연에선 미사용, 그래도 값은 구성)
    const primaryImage =
      raw.image_url ??
      raw.thumbnail_url ??
      raw.cover_url ??
      (Array.isArray(raw.mock?.imageUrls) ? raw.mock.imageUrls[0] : undefined);

    // mock 통합 (이미지 배열은 시연 제외 가능, 나머지 전부 사용)
    const m = raw.mock || {};
    const mock = {
      rating: m.rating ?? raw.mock_rating ?? null,
      ratingCount: m.ratingCount ?? raw.mock_rating_count ?? null,
      // 이미지: BE가 imageUrls(array)거나, 과거 *_json(string)일 수도 있음
      image_urls:
        m.image_urls ??
        m.imageUrls ??
        safeJsonArray(raw.mock_image_urls_json) ??
        (primaryImage ? [primaryImage] : undefined),
      opening_hours:
        m.opening_hours ??
        m.openingHours ??
        safeJsonArray(raw.mock_opening_hours_json),
      review_snippets:
        m.review_snippets ??
        m.reviewSnippets ??
        safeJsonArray(raw.mock_review_snippets_json),
    };

    // ai 블럭도 단일화
    const ai = raw.ai ?? {
      summaryText: raw.summaryText ?? raw.ai_summary_text ?? undefined,
      evidence: raw.evidence ?? raw.ai_evidence ?? undefined,
      updatedAt: raw.updatedAt ?? raw.ai_updated_at ?? undefined,
    };

    return {
      ...raw,
      id,
      placeName,
      x,
      y,
      distanceM,
      placeUrl,
      mock,
      ai,
      // BE는 recommended_count로 내려줌(명시 어노테이션). 그 외 대비.
      recommended_count:
        raw.recommended_count ??
        raw.recommendedCount ??
        raw.recommend_count ??
        0,
    };
  };

  /* ---------- 공유 링크 복사 ---------- */
  const handleCopyLink = async () => {
    const s = slug || data?.slug;
    if (!s) return window.alert("공유할 링크의 slug가 없습니다.");
    const shareUrl = `${window.location.origin}/shared-map/personal/${s}/splash`;
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

  const goPrev = () => navigate("/");

  const selectedItem = useMemo(() => {
    if (!data || !selectedItemId) return null;
    return (
      data.items.find((it) => String(it.id) === String(selectedItemId)) || null
    );
  }, [data, selectedItemId]);

  const handleCloseDetail = () => setSelectedItemId(null);

  useEffect(() => {
    if (!showAiPopup) return;
    const t = setTimeout(() => setShowAiPopup(false), 5000);
    return () => clearTimeout(t);
  }, [showAiPopup]);

  /* ---------- 데이터 로드 ---------- */
  useEffect(() => {
    if (!slug) return;
    const controller = new AbortController();

    (async () => {
      setError("");
      try {
        // 1) 친구 추천(+근처 장소)
        const reqRes = await axios.get(`${BASE_URL}/api/requests/${slug}`, {
          withCredentials: true,
          signal: controller.signal,
        });
        const reqData = reqRes?.data?.data;
        if (!reqData) throw new Error("요청 데이터가 비어 있습니다.");

        const friendItems = (reqData.items ?? [])
          .map(normalizeItem)
          .filter(Boolean)
          .map((it) => ({ ...it, isAI: false }));

        // 2) AI 추천 (실패 허용)
        let aiItems = [];
        try {
          const aiRes = await axios.get(
            `${BASE_URL}/api/recommendations/auto`,
            {
              withCredentials: true,
              params: { slug, n: 5, q: "" },
              signal: controller.signal,
            }
          );
          aiItems =
            (aiRes?.data?.data?.items ?? [])
              .map(normalizeItem)
              .filter(Boolean)
              .map((it) => ({ ...it, isAI: true })) ?? [];
        } catch {
          aiItems = [];
        }

        const merged = [...friendItems, ...aiItems];

        // 3) 뷰모델
        const pinVMs = merged.map((it) => toPinVM(it, it.isAI));
        const cardVMs = merged.map((it) => toCardVM(it, it.isAI));

        setData({
          id: `req-${reqData.slug}`,
          slug: reqData.slug,
          requestMessage: reqData.requestMessage,
          station: reqData.station, // { code, name, line, lat, lng }
          group: reqData.group ?? null, // { id, slug, name, image_url }
          items: merged,
          pinVMs,
          cardVMs,
        });

        if (aiItems.length > 0) setShowAiPopup(true);
      } catch (e) {
        if (e.name !== "CanceledError") {
          console.error("[request error]", {
            url: e?.config?.url,
            method: e?.config?.method,
            params: e?.config?.params,
            status: e?.response?.status,
            data: e?.response?.data,
            headers: e?.response?.headers,
          });
          setError(
            e?.response?.status >= 500
              ? "서버 오류가 발생했어요. 잠시 후 다시 시도해 주세요."
              : e?.response?.data?.error?.message || e.message
          );
        }
      }
    })();

    return () => controller.abort();
  }, [slug]);

  const handleCardClick = (item) => setSelectedItemId(item.id);
  const handleAiTagClick = () => setShowAiPopup(true);

  if (!data) {
    return (
      <PageContainer>
        <LoadingSpinner size="large" text="지도 정보를 불러오는 중..." />
      </PageContainer>
    );
  }

  // 라인 키 추출(“7호선”, “7”, “4,7” 등 대응)
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
          <StationName>{data.station?.name}역</StationName>
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
          notesSlug={slug}
        />
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
      {copySuccess && <CopyToast>링크가 복사되었어요!</CopyToast>}
      {error && <CopyToast>{error}</CopyToast>}
    </PageContainer>
  );
}

/* --- styled --- */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
`;
const Header = styled.div`
  padding: 16px;
  font-size: 20px;
  font-weight: 500;
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
