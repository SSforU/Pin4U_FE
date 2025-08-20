import React from "react";
import styled from "styled-components";
import StationList from "../list/StationList";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import HomeSearchBox from "../ui/HomeSearchBox";

const stationsData = [
  {
    id: "1",
    slug: "abCDef12",
    name: "숭실대입구역",
    lines: [7],
    address: "서울 동작구 상도로 378",
    recommended_counts: 13,
    created_at: "2025-08-16T00:00:00Z",
  },
  {
    id: "2",
    slug: "abCDef18",
    name: "이수역",
    lines: [4, 7],
    address: "서울 동작구 동작대로 105-2",
    recommended_counts: 18,
    created_at: "2025-08-10T00:00:00Z",
  },
  // 더 많은 데이터...
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleAddMapClick = () => {
    navigate(`/make-place`);
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredStations =
    searchTerm.trim() === ""
      ? stationsData
      : stationsData.filter((station) =>
          station.name.includes(searchTerm.trim())
        );

  return (
    <PageContainer>
      <TitleBox>
        <PageTitle>김숭실 님의 지도</PageTitle>
      </TitleBox>

      <ContentContainer>
        <HomeSearchBox onSearch={setSearchTerm} />
        <StationList stations={filteredStations} />
      </ContentContainer>

      <ButtonContainer>
        <Button onClick={handleAddMapClick}>나만의 지도 추가하기</Button>
      </ButtonContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 0 15px;
  box-sizing: border-box;
`;

const TitleBox = styled.div`
  width: 90%;
  display: flex;
  padding: 15px 0;
  border-bottom: 2px solid #e7e7e7;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  margin: 0;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: #fff;
  border: 1px solid #e7e7e7;
  border-radius: 10px;
  padding: 0 15px;
  margin-top: 15px;
`;

const SearchIcon = styled.svg`
  width: 20px;
  height: 20px;
  stroke: #888;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: #333;
  &::placeholder {
    color: #bbb;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 400px;
  flex: 1;
  overflow-y: auto;
  padding: 0 15px;
  box-sizing: border-box;
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  padding: 20px 15px;
  box-sizing: border-box;
`;
