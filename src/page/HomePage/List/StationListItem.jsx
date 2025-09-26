import React from "react";
import styled from "styled-components";

const StationListItem = ({ station, onClick }) => {
  return (
    <Container onClick={() => onClick?.(station)}>
      <StationInfo>
        <StationNameGroup>
          <StationName>{station.name}</StationName>
          {station.lines.map((line, index) => (
            <SubwayLineIcon key={index} imageUrl={subwayLineImages[line]} />
          ))}
        </StationNameGroup>
        <Address>{station.address}</Address>
      </StationInfo>
      <LikeGroup>
        <img
          src="/Recommend_Memo.png"
          style={{ width: "16px", height: "16px" }}
        />
        <LikeCount>{station.place_count}</LikeCount>
      </LikeGroup>
    </Container>
  );
};

export default StationListItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 20px 10px;
  background-color: #fff;
  border-bottom: 2px solid #e7e7e7;

  &:hover {
    background-color: #f5f5f5; /* 마우스를 올렸을 때 배경색 변경 */
  }

  &:active {
    background-color: #e0e0e0; /* 클릭했을 때 배경색 변경 */
    transform: scale(0.98); /* 클릭했을 때 약간 작아지는 효과 추가 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* 클릭했을 때 그림자 효과 변경 */
  }
`;

const StationInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StationNameGroup = styled.div`
  display: flex;
  align-items: center;
`;

const StationName = styled.p`
  font-size: 16px;
  font-weight: medium;
  margin: 0;
  margin-right: 2px;
`;

const Address = styled.p`
  font-size: 12px;
  color: #888;
  margin: 4px 0 0 0;
`;

const LikeGroup = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const LikeCount = styled.span`
  font-size: 14px;
  margin-left: 4px;
  color: #585858;
`;

const subwayLineImages = {
  1: "/subway/1호선.png",
  2: "/subway/2호선.png",
  3: "/subway/3호선.png",
  4: "/subway/4호선.png",
  5: "/subway/5호선.png",
  6: "/subway/6호선.png",
  7: "/subway/7호선.png",
  8: "/subway/8호선.png",
  9: "/subway/9호선.png",
};

const SubwayLineIcon = styled.div`
  width: 25px;
  height: 25px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  background-image: ${(props) => `url('${props.imageUrl}')`};
`;
