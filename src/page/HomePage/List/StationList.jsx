import React from "react";
import styled from "styled-components";
import StationListItem from "./StationListItem.jsx";
import SearchBox from "../../../component/ui/SearchBox.jsx";
import LoadingSpinner from "../../../component/ui/LoadingSpinner.jsx";

const ListContainer = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

function StationList({ stations, loading = false, onItemClick }) {
  if (loading) {
    return (
      <ListContainer>
        <LoadingSpinner size="medium" text="역 정보를 불러오는 중..." />
      </ListContainer>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <ListContainer>
        <p>나만의 지도를 추가해 주세요!!</p>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      {stations.map((station) => (
        <StationListItem
          key={station.id}
          station={station}
          onClick={onItemClick}
        ></StationListItem>
      ))}
    </ListContainer>
  );
}

export default StationList;
