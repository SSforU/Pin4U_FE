// PlaceCard.jsx
import React from "react";
import styled from "styled-components";

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

const PlaceCard = ({ placeName, subText, imageUrl, onClick }) => {
  return (
    <StyledCard onClick={onClick}>
      <ImageWrapper>
        <PlaceImage src={imageUrl} alt={placeName} />
      </ImageWrapper>
      <ContentWrapper>
        <PlaceName>{placeName}</PlaceName>
        <SubText>{subText}</SubText>
      </ContentWrapper>
    </StyledCard>
  );
};

export default PlaceCard;
