// src/page/StationPage/components/MemoList.jsx
import styled from "styled-components";
import MemoItem from "./MemoListItem.jsx";

export default function MemoList({ items, onItemClick }) {
  return (
    <List>
      {items?.map((m) => (
        <MemoItem key={m.id} item={m} onClick={onItemClick} />
      ))}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
