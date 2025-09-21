// src/page/StationPage/components/MemoItem.jsx
import styled from "styled-components";

export default function MemoListItem({ item, onClick }) {
  return (
    <Item role="button" onClick={() => onClick?.(item)}>
      <Left>
        <img
          src="/Recommend_Memo.png"
          style={{ width: "20px", height: "20px" }}
        />
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
  padding: 20px 10px;
  border-bottom: 1px solid #f1f1f1;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5; /* 마우스를 올렸을 때 배경색 변경 */
  }

  &:active {
    background-color: #e0e0e0; /* 클릭했을 때 배경색 변경 */
    transform: scale(0.98); /* 클릭했을 때 약간 작아지는 효과 추가 */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* 클릭했을 때 그림자 효과 변경 */
  }
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
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #585858;
`;

const PinIcon = styled.span``;
const Count = styled.span``;
