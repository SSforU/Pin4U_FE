// src/page/StationPage/components/MemoItem.jsx
import styled from "styled-components";

export default function MemoListItem({
  item,
  onClick,
  isEditing,
  selected,
  toggleSelect,
}) {
  return (
    <Item $isEditing={isEditing} onClick={() => !isEditing && onClick?.(item)}>
      <Left>
        {isEditing && (
          <StyledCheckbox
            checked={selected}
            onChange={toggleSelect}
            onClick={(e) => e.stopPropagation()}
          />
        )}
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

  ${(p) =>
    !p.$isEditing &&
    `
    &:hover {
      background-color: #f5f5f5;
    }
    &:active {
      background-color: #e0e0e0;
      transform: scale(0.98);
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
  `}
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

const Count = styled.span``;

const StyledCheckbox = styled.input.attrs({ type: "checkbox" })`
  appearance: none; /* 기본 체크박스 제거 */
  width: 18px;
  height: 18px;
  border: 2px solid #838383;
  border-radius: 4px;
  cursor: pointer;

  &:checked {
    background-color: #ffefed;
    border-color: #838383;
    background-image: url("/check-icon.svg"); /* 체크 표시 아이콘 */
    background-size: 24px 24px;
    background-position: center;
    background-repeat: no-repeat;
  }
`;
