import React from "react";
import styled from "styled-components";

const SearchInput = styled.input`
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export default function HomeSearchBox({ onSearch }) {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <SearchInput
      type="text"
      placeholder="역 이름을 입력하세요..."
      onChange={handleInputChange}
    />
  );
}
