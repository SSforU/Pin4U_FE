import React from "react";
import styled from "styled-components";
import GroupListItem from "./GroupListItem.jsx";

export default function GroupList({
  title = "그룹 지도",
  groups = [],
  onItemClick,
}) {
  return (
    <Section>
      <SectionHead>{title}</SectionHead>

      <Scroller>
        {groups.length === 0 ? (
          <EmptyMessage>그룹지도를 추가해 주세요!!</EmptyMessage>
        ) : (
          groups.map((g) => (
            <GroupListItem
              key={g.id}
              thumbnail={g.thumbnail}
              name={g.name}
              stationName={g.stationName}
              lines={g.lines}
              onClick={() => onItemClick?.(g)}
            />
          ))
        )}
      </Scroller>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 0 6px;
  border-top: 7px solid #f3f3f3; /* 섹션 구분띠(스크린샷 느낌) */
`;

const SectionHead = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #202020;
  margin: 0 0 12px 35px;
`;

const Scroller = styled.div`
  width: 100%;
  display: flex;
  gap: 0;
  padding: 0 2px 0px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 숨김(모바일 느낌) */
  &::-webkit-scrollbar {
    height: 6px;
    display: none;
  }
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE10+ */
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.25);
    border-radius: 10px;
  }
`;

const EmptyMessage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 14px;
  color: #888;
`;
