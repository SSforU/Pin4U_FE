// PlaceCard.jsx
import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";

const StyledCard = styled.div`
  width: 100px;
  height: 150px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 5px 0px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  flex-shrink: 0;
  &:hover {
    transform: translateY(-4px);
  }
  position: relative;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: relative;
`;

const PlaceImage = styled.img`
  width: ${(props) => (props.isDefault ? "60%" : "90%")};
  height: ${(props) => (props.isDefault ? "60%" : "90%")};
  object-fit: cover;
  border-radius: 8px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2px 8px 14px 8px;
  text-align: center;
`;

const PlaceName = styled.div`
  font-weight: 500;
  color: #333;
  font-size: ${(props) => props.fontSize};
`;

const PlaceCard = ({ placeName, imageUrl, onClick, isAI, onAiTagClick }) => {
  // 폰트 크기 상태를 관리하는 state
  const [fontSize, setFontSize] = useState("16px");

  useEffect(() => {
    // placeName의 길이에 따라 폰트 크기 조정
    if (placeName && placeName.length > 12) {
      setFontSize("9px");
    } else if (placeName && placeName.length > 5) {
      setFontSize("12px");
    } else {
      setFontSize("16px");
    }
  }, [placeName]); // placeName이 변경될 때마다 이펙트 실행

  const handleAiTagClick = (e) => {
    e.stopPropagation(); // Prevents the card's onClick from firing
    if (onAiTagClick) {
      onAiTagClick(); // Call the new handler passed from the parent
    }
  };

  return (
    <StyledCard onClick={onClick}>
      <ImageWrapper>
        <PlaceImage
          src={imageUrl}
          alt={placeName}
          isDefault={imageUrl === "/Pin4U_Logo.png"}
        />
      </ImageWrapper>
      <ContentWrapper>
        <PlaceName fontSize={fontSize}>{placeName}</PlaceName>
      </ContentWrapper>
      {isAI && <AiTag src="/AI_icon.svg" onClick={handleAiTagClick} />}
      {/* isAI prop이 true일 때 태그 표시 */}
    </StyledCard>
  );
};

export default PlaceCard;

// AI 태그를 위한 새로운 컴포넌트
const AiTag = styled.img`
  position: absolute;
  bottom: 3px;
  left: 3px;
  padding: 4px 4px;
`;
