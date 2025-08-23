// PlaceCardList.jsx
import React from "react";
import styled from "styled-components";
import PlaceCard from "./PlaceCard";

const ListContainer = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  overflow-x: auto;
  background-color: #f7f7f7;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 전체 */
  &::-webkit-scrollbar {
    height: 4px; /* 가로 스크롤바 두께 */
  }

  /* 스크롤바 트랙 (배경) */
  &::-webkit-scrollbar-track {
    background: transparent; /* 배경을 투명하게 해서 안 보이게 */
  }

  /* 스크롤바 막대 (thumb) */
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1; /* 회색 바 */
    border-radius: 999px; /* 완전 둥글게 */
  }

  /* hover 했을 때 */
  &::-webkit-scrollbar-thumb:hover {
    background: #999;
  }
`;

const PlaceCardList = ({ items, onCardClick, onAiTagClick }) => {
  return (
    <ListContainer>
      {items.map((item) => (
        <PlaceCard
          key={item.id}
          placeName={item.name}
          subText={item.summary}
          imageUrl={item.imageUrl || "/default-image.png"}
          isAI={item.isAI}
          onClick={() => onCardClick(item)}
          onAiTagClick={item.isAI ? () => onAiTagClick(item) : undefined} // Only pass handler if it's an AI card
        />
      ))}
    </ListContainer>
  );
};

export default PlaceCardList;
