// PlaceCardList.jsx
import React from "react";
import styled from "styled-components";
import PlaceCard from "./PlaceCard";

const ListContainer = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const PlaceCardList = ({ items, onCardClick }) => {
  return (
    <ListContainer>
      {items.map((item) => (
        <PlaceCard
          key={item.id}
          placeName={item.place_name}
          subText={item.ai?.summary_text || item.category_group_name}
          imageUrl={item.mock.image_urls[0] || "/default-image.png"}
          onClick={() => onCardClick(item)}
        />
      ))}
    </ListContainer>
  );
};

export default PlaceCardList;
