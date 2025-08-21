// PlaceCard.jsx
import React from "react";
import styled from "styled-components";

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

const PlaceCard = ({
  placeName,
  subText,
  imageUrl,
  onClick,
  isAI,
  onAiTagClick,
}) => {
  const handleAiTagClick = (e) => {
    e.stopPropagation(); // Prevents the card's onClick from firing
    if (onAiTagClick) {
      onAiTagClick(); // Call the new handler passed from the parent
    }
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
