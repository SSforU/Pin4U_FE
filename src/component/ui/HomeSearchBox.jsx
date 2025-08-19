import React from "react";
import styled from "styled-components";

export default function HomeSearchBox({ onSearch }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <SearchBoxContainer>
      <SearchIcon>
        <SearchIconImage src="/Search.png" alt="검색" />
      </SearchIcon>
      <SearchInput
        type="text"
        placeholder="역 이름을 입력하세요..."
        onChange={handleInputChange}
      />
    </SearchBoxContainer>
  );
}

const SearchBoxContainer = styled.div`
  background-color: #f7f7f7;
  border: 1px solid #bababa;
  border-radius: 10px;
  height: 50px;
  width: 100%;
  margin-top: 14px;
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
