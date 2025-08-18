import React from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";

function SearchBox({ placeholder, onClick, ...props }) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <SearchBoxContainer onClick={handleClick} {...props}>
      <SearchIcon>
        <SearchIconImage src="/Search.png" alt="검색" />
      </SearchIcon>
      <SearchText>{placeholder}</SearchText>
    </SearchBoxContainer>
  );
}

export default SearchBox;

// styled-components
const SearchBoxContainer = styled.button`
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
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;

  &:hover {
    background-color: #f0f0f0;
    border-color: #a0a0a0;
  }

  &:active {
    transform: translateY(1px);
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

const SearchText = styled.span`
  flex: 1;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 16px;
  color: #bababa;
  line-height: 18px;
  text-align: left;
  pointer-events: none;
`;
