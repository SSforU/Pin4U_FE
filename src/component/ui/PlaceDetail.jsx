// PlaceDetail.jsx
import React from "react";
import styled from "styled-components";
import RecommendMsg from "./RecommendMsg";
import { useState } from "react";
import PhotoGallery from "./PhotoGallery";

// mockApiData를 PlaceDetail 컴포넌트 내부로 이동
const mockApiData = {
  result: "success",
  data: {
    external_id: "kakao:123456789",
    recommended_count: 2,
    notes: [
      {
        nickname: "민수",
        recommend_message: "평일 저녁 조용",
        image_url: "/user_avatar_minsu.png",
        tags: ["분위기 맛집"],
        created_at: "2025-08-16T00:01:00Z",
      },
      {
        nickname: "지은",
        recommend_message: "단체 4~6명 OK",
        image_url: "/user_avatar_jieun.png",
        tags: ["힐링 스팟"],
        created_at: "2025-08-16T00:02:00Z",
      },
    ],
  },
};

export default function PlaceDetail({ item, onClose }) {
  const [showMessage, setShowMessage] = useState(false);
  const [showGallery, setShowGallery] = useState(false); // 갤러리 상태 추가
  const [messageData, setMessageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!item) {
    return null;
  }

  const handleMessageButtonClick = () => {
    setIsLoading(true);
    // 실제 API 호출 로직은 여기에 구현
    // fetch(`/api/notes/${item.id}`).then(...)

    // mock 데이터 사용
    try {
      // API 호출을 흉내내는 setTimeout
      setTimeout(() => {
        setMessageData(mockApiData.data);
        setIsLoading(false);
        setShowMessage(true);
      }, 500); // 0.5초 지연
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <>
      <DetailContainer>
        <Header>
          <PlaceName>{item.place_name}</PlaceName>
          <MessageButton
            onClick={handleMessageButtonClick}
            disabled={isLoading}
          >
            {isLoading ? "로딩 중..." : "메시지 보기"}
          </MessageButton>
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
          notes={messageData.notes}
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

const MessageButton = styled.button`
  background-color: #ffefed;
  color: #c94040;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
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
