// PlaceDetail.jsx
import React from "react";
import styled from "styled-components";
import RecommendMsg from "./RecommendMsg";
import { useState } from "react";
import PhotoGallery from "./PhotoGallery";
import axios from "axios";
import { useParams } from "react-router-dom";

// mockApiData를 PlaceDetail 컴포넌트 내부로 이동
// const mockApiData = {
//   result: "success",
//   data: {
//     external_id: "kakao:123456789",
//     place_name: "장소이름예시",
//     notes: [
//       {
//         nickname: "민수",
//         recommend_message: "평일 저녁 조용",
//         image_url: "/picture.png",
//         tags: ["분위기 맛집"],
//         created_at: "2025-08-16T00:01:00Z",
//       },
//       {
//         nickname: "지은",
//         recommend_message: "단체 4~6명 OK",
//         image_url: "/picture.png",
//         tags: ["힐링 스팟"],
//         created_at: "2025-08-16T00:02:00Z",
//       },
//     ],
//   },
// };

export default function PlaceDetail({ item, onClose }) {
  const { slug } = useParams(); // /api/requests/{slug}/... 에 사용
  const [showMessage, setShowMessage] = useState(false);
  const [showGallery, setShowGallery] = useState(false); // 갤러리 상태 추가
  const [messageData, setMessageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  if (!item) {
    return null;
  }

  // 메시지 보기 버튼 클릭 시: 실제 API 호출
  const handleMessageButtonClick = async () => {
    if (!item.external_id) return; // 안전장치
    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${BASE_URL}/api/requests/${slug}/places/notes`,
        { params: { external_id: item.external_id } } // ?external_id=...
      );
      const payload = res?.data?.data;
      if (!payload) throw new Error("메시지 데이터가 비어 있습니다.");

      setMessageData(payload); // { external_id, place_name, notes: [...] }
      setShowMessage(true);
    } catch (e) {
      console.error(e);
      setError(e.message || "메시지를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 뱃지 숫자: 서버에서 목록을 열기 전엔 모를 수 있으니
  // item.note_count(있다면) → 열고 나선 messageData.notes.length 표시
  const noteCount =
    (typeof item.note_count === "number" ? item.note_count : null) ??
    messageData?.notes?.length ??
    0;

  return (
    <>
      <DetailContainer>
        <Header>
          <PlaceName>{item.place_name}</PlaceName>
          <HeaderRight>
            <MessageButtonContainer>
              <MessageButton
                onClick={handleMessageButtonClick}
                disabled={isLoading}
                src="/Mail.svg"
              />
              {noteCount > 0 && <MessageCount>{noteCount}</MessageCount>}
            </MessageButtonContainer>
            <CloseButton src="/X.svg" onClick={onClose} />
          </HeaderRight>
        </Header>

        <Section>
          <SectionIcon src="/Clock_icon.png" alt="영업시간" />
          {/* 영업시간 정보는 mock 데이터에 없으므로 임의로 추가하거나 비워둡니다 */}
          <SectionContent>정보 없음</SectionContent>
        </Section>
        <Section>
          <SectionIcon src="/Marker_icon.png" alt="주소" />
          <SectionContent>
            {item.road_address_name || item.address_name}
          </SectionContent>
        </Section>
        <Section>
          <SectionIcon src="/Bulb_icon.png" alt="AI 요약" />
          <SectionContent>AI 요약</SectionContent>
        </Section>
        <SummaryContent style={{ marginBottom: "16px" }}>
          {item.ai.summary_text}
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
          {item.mock.image_urls.map((url, index) => (
            <PlaceImage key={index} src={url} alt={`${item.place_name} 사진`} />
          ))}
        </ImageContainer>
      </DetailContainer>
      {showMessage && messageData && (
        <RecommendMsg
          place={messageData.place_name}
          notes={messageData.notes}
          placeUrl={item.place_url}
          onClose={() => setShowMessage(false)}
        />
      )}
      {showGallery && (
        <PhotoGallery
          imageUrls={item.mock.image_urls}
          onClose={() => setShowGallery(false)}
        />
      )}
    </>
  );
}

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
