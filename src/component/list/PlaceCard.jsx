// PlaceCard.jsx
import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";

const StyledCard = styled.div`
  width: 140px;
  height: 180px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  flex-shrink: 0;
  &:hover {
    transform: translateY(-4px);
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const PlaceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  text-align: center;
`;

const PlaceName = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
`;

const SubText = styled.div`
  font-size: 12px;
  color: #888;
`;

const PlaceCard = ({ placeName, subText, imageUrl, onClick, isAI }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // 5초 후에 메시지를 숨깁니다.
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리합니다.
    }
  }, [showMessage]);

  const handleAiTagClick = (e) => {
    e.stopPropagation(); // 카드 전체 클릭 이벤트가 발생하지 않도록 방지
    setShowMessage(true);
  };

  return (
    <StyledCard onClick={onClick}>
      <ImageWrapper>
        <PlaceImage src={imageUrl} alt={placeName} />
        {isAI && <AiTag src="/Info_icon.svg" onClick={handleAiTagClick} />}
        {/* isAI prop이 true일 때 태그 표시 */}
      </ImageWrapper>
      <ContentWrapper>
        <PlaceName>{placeName}</PlaceName>
        <SubText>{subText}</SubText>
      </ContentWrapper>
      {showMessage && (
        <MessagePopup>
          김숭실 님이 추천 받은 장소에 기반하여 AI가 추천한 장소예요.
        </MessagePopup>
      )}
    </StyledCard>
  );
};

export default PlaceCard;

// AI 태그를 위한 새로운 컴포넌트
const AiTag = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  padding: 4px 6px;
`;

const MessagePopup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1000;
  white-space: nowrap;
`;
