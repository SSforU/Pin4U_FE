import React from "react";
import styled from "styled-components";
import StationListItem from "./StationListItem";
import SearchBox from "../ui/SearchBox";

const ListContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function StationList({ stations }) {
  return (
    <ListContainer>
      {stations.length > 0 ? (
        stations.map((station) => (
          <StationListItem key={station.id} station={station}></StationListItem>
        ))
      ) : (
        <p>나만의 지도를 추가해 주세요!!</p>
      )}
    </ListContainer>
  );
}

export default StationList;
