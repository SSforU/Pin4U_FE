// 링크로 접속한 사용자의 온보딩
import React from "react";
import SearchBox from "../ui/SearchBox";
import { useState } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";

function StepLocation() {
  const { location, setLocation } = useOutletContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState(
    location ? [location] : []
  );

  // 실제에선 API 호출
  const fetchStations = async (q) => {
    setLoading(true);
    const db = [
      {
        id: 1,
        title: "미학당",
        subtitle: "서울 동작구 사당로 56 2층 초록색문",
      },
      { id: 2, title: "서브웨이 숭실대점", subtitle: "서울 동작구 상도동 501" },
      {
        id: 3,
        title: "베트남식당 퍼민",
        subtitle: "서울 동작구 사당로 36 1층 101호",
      },
      {
        id: 4,
        title: "스타벅스 숭실대점",
        subtitle: "서울 동작구 상도동 502",
      },
      {
        id: 5,
        title: "맥도날드 숭실대점",
        subtitle: "서울 동작구 상도동 503",
      },
      {
        id: 6,
        title: "은화수식당",
        subtitle: "서울 동작구 상도동 503",
      },
      {
        id: 7,
        title: "니뽕내뽕",
        subtitle: "서울 동작구 상도동 503",
      },
    ];
    await new Promise((r) => setTimeout(r, 200));
    setItems(q ? db.filter((x) => x.title.includes(q)) : []);
    setLoading(false);
  };

  const handleLocationSelect = (item) => {
    // 이미 선택된 장소인지 확인
    const isAlreadySelected = selectedLocations.some(
      (loc) => loc.id === item.id
    );
    if (!isAlreadySelected) {
      const newSelectedLocations = [...selectedLocations, item];
      setSelectedLocations(newSelectedLocations);
      setLocation(newSelectedLocations); // 부모 컴포넌트에 배열로 전달
      setQuery(""); // 검색어 초기화
    }
  };

  const handleLocationRemove = (locationId) => {
    const newSelectedLocations = selectedLocations.filter(
      (loc) => loc.id !== locationId
    );
    setSelectedLocations(newSelectedLocations);
    setLocation(newSelectedLocations.length > 0 ? newSelectedLocations : null);
  };

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>
            김숭실 님에게 추천하고 싶은
            <br />
            장소를 추천해주세요.
          </Title>
          <Detail>
            김숭실님이 설정한 역 반경 800m 안에서 추천이 가능해요.
          </Detail>
        </TextBlock>

        <SearchSection>
          <SearchBox
            query={query}
            onChange={setQuery}
            onDebouncedChange={fetchStations}
            debounceMs={200}
            suggestions={items}
            loading={loading}
            onSelect={handleLocationSelect}
            placeholder="장소, 주소 검색"
          />
        </SearchSection>

        {selectedLocations.length > 0 && (
          <SelectedLocationsSection>
            <SelectedLocationsList>
              {selectedLocations.map((loc) => (
                <SelectedLocationItem key={loc.id}>
                  <LocationInfo>
                    <LocationTitle>{loc.title}</LocationTitle>
                  </LocationInfo>
                  <RemoveButton
                    src="/Cancel.png"
                    alt="삭제"
                    onClick={() => handleLocationRemove(loc.id)}
                  />
                </SelectedLocationItem>
              ))}
            </SelectedLocationsList>
          </SelectedLocationsSection>
        )}
      </ContentSection>
    </Wrapper>
  );
}

export default StepLocation;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  padding: 24px 20px;
  height: 100%;
  justify-content: flex-start;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.2px;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  padding-left: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 120px;
`;

// < --- 선택된 장소 css --- >
const SelectedLocationsSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
`;

const SelectedLocationsList = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 7px;
  width: 100%;
  align-content: flex-start;
`;

const SelectedLocationItem = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 8px;
  background-color: #ffefed;
  border-radius: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: fit-content;
  height: 40px;
  min-height: 40px;
  cursor: pointer;

  &:hover {
    background-color: #fcddd9;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 2px 6px;
    height: 40px;
    min-height: 40px;
  }

  @media (max-width: 480px) {
    padding: 2px 4px;
    height: 40px;
    min-height: 40px;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LocationTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #585858;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const RemoveButton = styled.img`
  width: 12px;
  height: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  opacity: 0.7;
  margin-left: 4px;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 11px;
    height: 11px;
  }

  @media (max-width: 480px) {
    width: 10px;
    height: 10px;
  }
`;
