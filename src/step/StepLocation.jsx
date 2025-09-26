// 링크로 접속한 사용자의 온보딩
// #1 고정 사용자 조회 API 연동
// #5 역 주변 반경 장소 검색 API 연동
import React from "react";
import SearchBox from "../component/ui/SearchBox.jsx";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../styles/responsive.js";
import { useParams } from "react-router-dom";
import axios from "axios";

function StepLocation(props) {
  // props로 상태 주입 (필수)
  const location = props?.location;
  const setLocation = props?.setLocation;
  const { slug } = useParams(); // slug 파라미터 가져오기
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [stationInfo, setStationInfo] = useState(null);
  const [requestMemo, setRequestMemo] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // 오류 처리 로직 추가
  const [selectedLocations, setSelectedLocations] = useState(() => {
    if (location && Array.isArray(location) && location.length > 0)
      return location;
    if (location && typeof location === "object" && !Array.isArray(location))
      return [location];
    return [];
  });

  // slug로부터 역 정보와 메모 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;

      try {
        // 7번 API: 역 정보와 메모
        const requestResponse = await axios.get(
          `${BASE_URL}/api/requests/${slug}`,
          { withCredentials: true }
        );
        if (requestResponse.data?.data?.station) {
          setStationInfo(requestResponse.data.data.station);
          setRequestMemo(requestResponse.data.data.requestMessage || "");
        }
      } catch (error) {
        console.error("데이터 조회 실패:", error);
      }
    };
    fetchData();
  }, [slug, BASE_URL]);

  // 실제 API 호출로 장소 검색
  const fetchStations = async (q) => {
    if (!q || !stationInfo) {
      setItems([]);
      return;
    }
    setLoading(true);

    try {
      // API 명세에 맞게 호출 (limit 파라미터 제거 - 서버에서 10개 고정)
      const response = await axios.get(`${BASE_URL}/api/places/search`, {
        params: {
          q: q.trim(),
          station: stationInfo.code,
        },
        withCredentials: true,
      });

      if (response.data.result === "success") {
        // API 응답을 SearchBox에서 사용하는 형식으로 변환
        const places = response.data.data.items.map((place) => ({
          id: place.external_id, // external_id를 id로 사용
          external_id: place.external_id, // API 호출 시 사용할 external_id
          title: place.place_name,
          subtitle: place.address_name,
          // 추가 정보들
          category: place.category_group_name,
          distance: place.distance_m,
          rating: place.mock?.rating,
          ratingCount: place.mock?.rating_count,
          phone: place.phone,
          roadAddress: place.road_address_name,
          placeUrl: place.place_url,
          coordinates: {
            x: parseFloat(place.x),
            y: parseFloat(place.y),
          },
          // 원본 데이터 보존
          originalData: place,
        }));

        setItems(places);
      } else {
        console.error("장소 검색 실패:", response.data.error);
        setItems([]);
      }
    } catch (error) {
      console.error("장소 검색 API 호출 실패:", error);

      // 에러 타입별 처리
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          console.error("잘못된 요청:", data.error?.message);
        } else if (status === 404) {
          console.error("역을 찾을 수 없음:", data.error?.message);
        } else if (status === 429) {
          console.error("API 쿼터 초과:", data.error?.message);
        } else if (status === 502) {
          console.error("외부 API 오류:", data.error?.message);
        }
      }

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (item) => {
    // 이미 선택된 장소인지 확인
    const isAlreadySelected = selectedLocations.some(
      (loc) => loc.id === item.id
    );
    if (!isAlreadySelected) {
      console.log("StepLocation: 선택된 장소 데이터:", item);
      const newSelectedLocations = [...selectedLocations, item];

      setSelectedLocations(newSelectedLocations);

      // 부모 컴포넌트에 배열로 전달 (다음 버튼 활성화를 위해)
      if (typeof setLocation === "function") {
        setLocation(newSelectedLocations);
      }

      setQuery(""); // 검색어 초기화
    }
  };

  const handleLocationRemove = (locationId) => {
    const newSelectedLocations = selectedLocations.filter(
      (loc) => loc.id !== locationId
    );
    setSelectedLocations(newSelectedLocations);
    // 부모 컴포넌트 state 업데이트
    if (typeof setLocation === "function") {
      setLocation(
        newSelectedLocations.length > 0 ? newSelectedLocations : null
      );
    }
  };

  return (
    <Wrapper>
      <ContentSection>
        {/* 역과 메모 정보 표시 */}
        <InfoSection>
          {/* 역 정보 */}
          <InfoItem>
            <InfoIcon src="/Pin.png" alt="위치" />
            <InfoText>{stationInfo?.name || "로딩 중..."}</InfoText>
          </InfoItem>

          {/* 메모 정보 */}
          <InfoItem>
            <InfoIcon src="/Recommend_Memo.png" alt="메모" />
            <InfoText>{requestMemo || "로딩 중..."}</InfoText>
          </InfoItem>
        </InfoSection>

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
                    {loc.distance && (
                      <LocationDistance>{loc.distance}m</LocationDistance>
                    )}
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
  gap: 15px;
  padding: 0px;
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

const LocationDistance = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  color: #888888;
  margin-top: 2px;
  font-weight: 400;
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

// 새로운 스타일 추가
const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 2px;
  padding: 8px 10px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const InfoText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  color: #333333;
  line-height: 1.5;
`;
