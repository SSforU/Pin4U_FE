// src/page/StationPage/components/MemoItem.jsx
import styled from "styled-components";

export default function MemoListItem({ item, onClick }) {
  return (
    <Item role="button" onClick={() => onClick?.(item)}>
      <Left>
        <Square>▢</Square>
        <Text>{item.text}</Text>
      </Left>
      <Right>
        <img src="/Pin.png" style={{ width: "16px", height: "16px" }} />
        <Count>{item.count}</Count>
      </Right>
    </Item>
  );
}

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 10px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Square = styled.span`
  font-size: 14px;
  color: #ff8f5c;
`;

const Text = styled.div`
  font-size: 14px;
  color: #222;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #fe7350;
  font-weight: 600;
`;

const PinIcon = styled.span``;
const Count = styled.span``;
