import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StationListItem = ({ station }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/place-map/${station.slug}`);
  };

  return (
    <Container onClick={handleClick}>
      <StationInfo>
        <StationNameGroup>
          <StationName>{station.name}</StationName>
          {station.lines.map((line, index) => (
            <LineBadge key={index} lineColor={lineColors[line]}>
              {line}
            </LineBadge>
          ))}
        </StationNameGroup>
        <Address>{station.address}</Address>
      </StationInfo>
      <LikeGroup>
        <img src="Pin.png" />
        <LikeCount>{station.recommended_counts}</LikeCount>
      </LikeGroup>
    </Container>
  );
};

export default StationListItem;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  width: 110%;
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
  margin-right: 8px;
`;

const LineBadge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  margin: 0 2px;
  border-radius: 50px;
  font-size: 10px;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => props.lineColor || "#ccc"};
`;

const Address = styled.p`
  font-size: 12px;
  color: #888;
  margin: 4px 0 0 0;
`;

const LikeGroup = styled.div`
  display: flex;
  align-items: center;
  color: #f44336;
  position: relative;
  top: 20px;
`;

const LikeCount = styled.span`
  font-size: 14px;
  margin-left: 4px;
`;

// 지하철 노선 색상 매핑
const lineColors = {
  4: "#00A1D3", // 하늘색
  7: "#54681E", // 진녹색
};
