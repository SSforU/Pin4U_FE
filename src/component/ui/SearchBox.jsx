import React from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useEffect } from "react";

function SearchBox({
  query,
  onChange,
  onDebouncedChange, // 추가: 타이핑 멈춘 뒤 호출
  debounceMs = 200, // 추가: 지연 시간
  suggestions = [],
  onSelect,
  loading = false,
  placeholder,
  ...props
}) {
  // 디바운스 효과
  useEffect(() => {
    if (!onDebouncedChange) return;
    const id = setTimeout(() => onDebouncedChange(query), debounceMs);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <>
      <SearchBoxContainer {...props}>
        <SearchIcon>
          <SearchIconImage src="/Search.png" alt="검색" />
        </SearchIcon>
        <SearchInput
          value={query}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
      </SearchBoxContainer>

      <List>
        {loading && <Hint>불러오는 중…</Hint>}
        {!loading && !query && <Hint>검색어를 입력해 주세요.</Hint>}
        {!loading && query && suggestions.length === 0 && (
          <Hint>검색 결과가 없어요.</Hint>
        )}

        {suggestions.map((it) => (
          <Item key={it.id} onClick={() => onSelect?.(it)}>
            <Title>{it.title}</Title>
            {it.subtitle && <Sub>{it.subtitle}</Sub>}
          </Item>
        ))}
      </List>
    </>
  );
}

export default SearchBox;

// styled-components
const SearchBoxContainer = styled.div`
  ${getResponsiveStyles("search")} // 반응형

  background-color: #f7f7f7;
  border: 1px solid #bababa;
  border-radius: 10px;
  height: 50px;
  display: flex;
  align-items: center;
  padding: 16px 14px;
  gap: 10px;
  position: relative;
  transition: all 0.2s ease-in-out;
  cursor: text;

  &:focus-within {
    border-color: #ff7e74;
  }
`;

const SearchIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchIconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const SearchInput = styled.input`
  flex: 1;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #333;
  line-height: 18px;
  text-align: left;
  border: none;
  background-color: transparent;
  outline: none;

  &::placeholder {
    color: #bababa;
  }
`;

const List = styled.div`
  max-height: 60vh;
  overflow: auto;
  padding-bottom: 8px;
`;

const Item = styled.button`
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 8px;
  padding: 12px 4px;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background: #f7f8fa;
  }
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

const Sub = styled.div`
  grid-column: 1 / -1;
  font-size: 12px;
  color: #6b7280;
`;

const Hint = styled.div`
  padding: 16px 6px;
  color: #6b7280;
  font-size: 14px;
`;
