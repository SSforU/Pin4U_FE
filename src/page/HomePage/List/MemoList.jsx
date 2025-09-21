// src/page/StationPage/components/MemoList.jsx
import styled from "styled-components";
import MemoItem from "./MemoListItem.jsx";

export default function MemoList({
  items,
  onItemClick,
  isEditing,
  selectedIds,
  setSelectedIds,
}) {
  return (
    <List>
      {items?.map((m) => (
        <MemoItem
          key={m.id}
          item={m}
          onClick={onItemClick}
          isEditing={isEditing}
          selected={selectedIds.includes(m.id)}
          toggleSelect={() => {
            setSelectedIds((prev) =>
              prev.includes(m.id)
                ? prev.filter((id) => id !== m.id)
                : [...prev, m.id]
            );
          }}
        />
      ))}
    </List>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
