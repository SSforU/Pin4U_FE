import React from "react";
import styled from "styled-components";

export default function GroupListItem({
  thumbnail,
  name,
  stationName,
  lines = [],
  onClick,
}) {
  return (
    <ItemWrap onClick={onClick} role="button" tabIndex={0}>
      <Thumb>
        {thumbnail ? (
          <img src={thumbnail} alt={`${name} 썸네일`} />
        ) : (
          <ThumbFallback>{name?.[0] ?? "G"}</ThumbFallback>
        )}
      </Thumb>

      <Title>{name}</Title>

      <MetaRow>
        <StationName>{stationName}</StationName>
        {lines.length > 0 &&
          lines.map((line, index) => (
            <SubwayLineIcon key={index} imageUrl={subwayLineImages[line]} />
          ))}
      </MetaRow>
    </ItemWrap>
  );
}

const ItemWrap = styled.div`
  width: 80px;
  margin-left: 15px;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
`;

const Thumb = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 999px;
  background: #f6f6f6;
  border: 2px solid #e28a81; /* 코럴 느낌 */
  display: grid;
  place-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbFallback = styled.span`
  font-size: 28px;
  color: #999;
`;

const Title = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
`;

const StationName = styled.span`
  color: #8f8f8f;
  font-size: 10px;
  font-size: 600;
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
  width: 16px;
  height: 16px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  background-image: ${(props) => `url('${props.imageUrl}')`};
`;
