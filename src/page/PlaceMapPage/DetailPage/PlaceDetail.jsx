// PlaceDetail.jsx
import React, { useState } from "react";
import styled from "styled-components";
import RecommendMsg from "./RecommendMsg";
import PhotoGallery from "./PhotoGallery";
import axios from "axios";

export default function PlaceDetail({
  item,
  onClose,
  /** ✅ 기본은 개인지도 호환용 "requests" */
  notesBase = "requests", // "groups" | "requests"
  notesSlug, // group_slug or request_slug
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [messageData, setMessageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  if (!item) return null;

  // ---- camel/snake 호환 처리 ----
  const mock = item?.mock || {};
  const ai = item?.ai || {};

  const openingHours = mock.openingHours || mock.opening_hours || [];

  const imageUrls = mock.imageUrls || mock.image_urls || [];

  const aiSummary = ai.summaryText ?? ai.summary_text ?? "-";

  const roadAddr = item.roadAddressName ?? item.road_address_name ?? null;

  const addr = roadAddr ?? item.addressName ?? item.address_name ?? "-";

  const externalId = item.externalId ?? item.external_id ?? null;

  const placeName = item.placeName ?? item.place_name ?? "-";

  const placeUrl = item.placeUrl ?? item.place_url ?? undefined;

  const noteCount = item.isAI
    ? 0
    : (typeof item.recommended_count === "number"
        ? item.recommended_count
        : item.recommendedCount ?? null) ??
      messageData?.notes?.length ??
      0;

  // ---- 메모 버튼: 그룹/개인 엔드포인트 호출 + 404 폴백 ----
  const handleMessageButtonClick = async () => {
    if (!externalId || !notesSlug) return;
    setIsLoading(true);
    try {
      const fetchNotes = async (base) => {
        const url = `${BASE_URL}/api/${base}/${notesSlug}/places/notes`;
        return axios.get(url, {
          params: { external_id: externalId },
          withCredentials: true,
        });
      };

      // 1차: 지정된 베이스(groups 또는 requests)
      let res = await fetchNotes(notesBase);

      // 404 또는 payload 없음 → 반대 베이스로 폴백
      if (res?.status === 404 || !res?.data?.data) {
        const altBase = notesBase === "groups" ? "requests" : "groups";
        res = await fetchNotes(altBase);
      }

      const payload = res?.data?.data;
      if (!payload) throw new Error("메시지 데이터가 비어 있습니다.");

      // payload: { external_id, place_name, notes: [...] }
      setMessageData(payload);
      setShowMessage(true);
    } catch (e) {
      console.error("[PlaceDetail] notes fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DetailContainer>
        <Header>
          <PlaceName>{placeName}</PlaceName>
          <HeaderRight>
            {!item.isAI && (
              <MessageButtonContainer>
                <MessageButton
                  onClick={handleMessageButtonClick}
                  disabled={isLoading || !externalId || !notesSlug}
                  src="/Mail.svg"
                  alt="추천 메모 보기"
                />
                {noteCount > 0 && <MessageCount>{noteCount}</MessageCount>}
              </MessageButtonContainer>
            )}
            <CloseButton src="/X.svg" alt="닫기" onClick={onClose} />
          </HeaderRight>
        </Header>

        <Section>
          <SectionIcon src="/Clock_icon.png" alt="영업시간" />
          <SectionContent>
            {Array.isArray(openingHours) && openingHours.length > 0
              ? openingHours.join(" · ")
              : "-"}
          </SectionContent>
        </Section>

        <Section>
          <SectionIcon src="/Marker_icon.png" alt="주소" />
          <SectionContent>{addr}</SectionContent>
        </Section>

        <Section>
          <SectionIcon src="/Bulb_icon.png" alt="AI 요약" />
          <SectionContent>AI 요약</SectionContent>
        </Section>
        <SummaryContent style={{ marginBottom: "16px" }}>
          {aiSummary}
        </SummaryContent>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SectionTitle>사진</SectionTitle>
          <MoreButton onClick={() => setShowGallery(true)}>더보기</MoreButton>
        </div>

        <ImageContainer>
          {(imageUrls || []).map((url, idx) => (
            <PlaceImage key={idx} src={url} alt={`${placeName} 사진`} />
          ))}
        </ImageContainer>
      </DetailContainer>

      {showMessage && messageData && (
        <RecommendMsg
          place={messageData.placeName ?? messageData.place_name}
          notes={messageData.notes}
          placeUrl={placeUrl}
          onClose={() => setShowMessage(false)}
        />
      )}

      {showGallery && (
        <PhotoGallery
          $imageUrls={imageUrls}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

/* styled-components (동일) */
const DetailContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  padding: 25px 35px;
  box-sizing: border-box;
  z-index: 20;
  height: calc(100dvh * 422 / 844);
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;
const PlaceName = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;
const MessageButtonContainer = styled.div`
  position: relative;
`;
const MessageButton = styled.img`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
`;
const MessageCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ff7e74;
  color: #ffffff;
  font-size: 10px;
  font-weight: bold;
  border-radius: 50%;
  padding: 1px 5px;
  min-width: 10px;
  text-align: center;
`;
const Section = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const SectionTitle = styled.span`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;
const SectionContent = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;
const SummaryContent = styled.p`
  font-size: 16px;
  color: #666;
  margin: 0;
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #e7e7e7;
  background-color: #f7f7f7;
  text-align: start;
`;
const SectionIcon = styled.img`
  width: 14px;
  height: 14px;
`;
const ImageContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  overflow-x: auto;
  padding-bottom: 8px;
`;
const PlaceImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
`;
const MoreButton = styled.span`
  font-size: 14px;
  color: #c94040;
  cursor: pointer;
`;
const CloseButton = styled.img`
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`;
const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
