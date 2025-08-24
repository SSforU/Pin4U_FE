// 장소 추천 단계
// #6 추천 장소 최종 제출 API 호출 (POST)
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";
import Message from "../ui/Message";
import Button from "../ui/Button";
import axios from "axios";

function StepRecommend() {
  const { memo, userProfile } = useOutletContext();
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [IMAGE_FILE, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { slug } = useParams();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // StepLocation에서 선택한 장소들을 localStorage에서 불러오기
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  // 장소별 입력 데이터 저장 (tags, message, image)
  const [placeRecommendations, setPlaceRecommendations] = useState([]);

  // 컴포넌트 마운트 시 localStorage에서 선택된 장소들 불러오기
  useEffect(() => {
    const loadSelectedLocations = () => {
      try {
        const savedLocations = localStorage.getItem("selectedLocations");
        if (savedLocations) {
          const locations = JSON.parse(savedLocations);
          console.log("StepRecommend: 로드된 장소들:", locations);
          setSelectedPlaces(locations);

          // 각 장소별로 기본 데이터 구조 초기화
          const initialRecommendations = locations.map(() => ({
            tags: [],
            message: "",
            image: null,
          }));
          setPlaceRecommendations(initialRecommendations);
          console.log(
            "StepRecommend: 초기화된 추천 데이터:",
            initialRecommendations
          );
        } else {
          console.log("StepRecommend: localStorage에 선택된 장소가 없습니다.");
        }
      } catch (error) {
        console.error("선택된 장소 정보 로드 실패:", error);
        // 에러 시 기본 데이터로 초기화
        setSelectedPlaces([]);
        setPlaceRecommendations([]);
      }
    };

    loadSelectedLocations();
  }, []);

  // 현재 장소의 데이터를 UI에 반영
  useEffect(() => {
    if (
      placeRecommendations.length > 0 &&
      currentPlaceIndex < placeRecommendations.length
    ) {
      const currentData = placeRecommendations[currentPlaceIndex];
      setContent(currentData.message || "");
      setSelectedCategories(currentData.tags || []);
      setImageFile(currentData.image || null);
    }
  }, [currentPlaceIndex, placeRecommendations]);

  // 모든 장소의 입력이 완료되었는지 확인 (메모이제이션)
  const isAllCompleted = useMemo(() => {
    return (
      placeRecommendations.length > 0 &&
      placeRecommendations.every(
        (place) => place.tags.length > 0 && place.message.trim().length > 0
      )
    );
  }, [placeRecommendations]);

  // memo prop이 변경될 때만 content 상태 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (memo && memo !== content && content === "") {
      setContent(memo);
    }
  }, [memo, content]);

  // 120자 제한 처리 + 장소별 메시지 반영 (메모이제이션)
  const handleMemoChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      if (newContent.length <= 120) {
        setContent(newContent);
        // 현재 장소의 메시지 업데이트
        setPlaceRecommendations((prev) => {
          const copy = [...prev];
          copy[currentPlaceIndex] = {
            ...copy[currentPlaceIndex],
            message: newContent,
          };
          return copy;
        });
      }
    },
    [currentPlaceIndex]
  );

  // 이미지 변경 처리 (퍼블리싱 단계) (메모이제이션)
  const handleImageChange = useCallback((file) => {
    setImageFile(file);
  }, []);

  // 카테고리 토글 처리 + 장소별 태그 반영 (최대 3개) (메모이제이션)
  const handleCategoryToggle = useCallback(
    (category) => {
      setSelectedCategories((prev) => {
        let next;
        if (prev.includes(category)) {
          next = prev.filter((cat) => cat !== category);
        } else if (prev.length >= 3) {
          next = prev; // 3개 초과 금지
        } else {
          next = [...prev, category];
        }

        // 현재 장소의 태그 업데이트
        setPlaceRecommendations((p) => {
          const copy = [...p];
          copy[currentPlaceIndex] = {
            ...copy[currentPlaceIndex],
            tags: next,
          };
          return copy;
        });

        return next;
      });
    },
    [currentPlaceIndex]
  );

  // 카테고리가 비활성화되어야 하는지 확인 (메모이제이션)
  const isCategoryDisabled = useCallback(
    (category) => {
      return (
        selectedCategories.length >= 3 && !selectedCategories.includes(category)
      );
    },
    [selectedCategories]
  );

  // 다음 장소로 이동 (다음 장소의 저장된 값 불러오기) (메모이제이션)
  const handleNextPlace = useCallback(() => {
    if (currentPlaceIndex < selectedPlaces.length - 1) {
      // 현재 입력 중인 데이터를 저장
      setPlaceRecommendations((prev) => {
        const copy = [...prev];
        copy[currentPlaceIndex] = {
          ...copy[currentPlaceIndex],
          tags: selectedCategories,
          message: content,
        };
        console.log(
          `StepRecommend: ${currentPlaceIndex + 1}번째 장소 데이터 저장:`,
          copy[currentPlaceIndex]
        );
        return copy;
      });

      const nextIndex = currentPlaceIndex + 1;
      setCurrentPlaceIndex(nextIndex);

      // 다음 장소의 저장된 데이터 로드
      const nextPlaceData = placeRecommendations[nextIndex];
      console.log(
        `StepRecommend: ${nextIndex + 1}번째 장소 데이터 로드:`,
        nextPlaceData
      );
      setSelectedCategories(nextPlaceData?.tags || []);
      setContent(nextPlaceData?.message || "");
      setImageFile(nextPlaceData?.image || null);
    }
  }, [
    currentPlaceIndex,
    selectedPlaces.length,
    placeRecommendations,
    selectedCategories,
    content,
  ]);

  // 이전 장소로 이동 (이전 장소의 저장된 값 불러오기) (메모이제이션)
  const handlePrevPlace = useCallback(() => {
    if (currentPlaceIndex > 0) {
      // 현재 입력 중인 데이터를 저장
      setPlaceRecommendations((prev) => {
        const copy = [...prev];
        copy[currentPlaceIndex] = {
          ...copy[currentPlaceIndex],
          tags: selectedCategories,
          message: content,
        };
        console.log(
          `StepRecommend: ${currentPlaceIndex + 1}번째 장소 데이터 저장:`,
          copy[currentPlaceIndex]
        );
        return copy;
      });

      const prevIndex = currentPlaceIndex - 1;
      setCurrentPlaceIndex(prevIndex);

      // 이전 장소의 저장된 데이터 로드
      const prevPlaceData = placeRecommendations[prevIndex];
      console.log(
        `StepRecommend: ${prevIndex + 1}번째 장소 데이터 로드:`,
        prevPlaceData
      );
      setSelectedCategories(prevPlaceData?.tags || []);
      setContent(prevPlaceData?.message || "");
      setImageFile(prevPlaceData?.image || null);
    }
  }, [currentPlaceIndex, placeRecommendations, selectedCategories, content]);

  // 완료 처리 (API 호출 후 CompleteRecommend로 이동) (메모이제이션)
  const handleComplete = useCallback(async () => {
    try {
      // 1. localStorage에서 데이터 수집
      const nickname = localStorage.getItem("friendNickname");
      const locations = JSON.parse(
        localStorage.getItem("selectedLocations") || "[]"
      );

      console.log("StepRecommend: 완료 처리 시작");
      console.log("StepRecommend: 닉네임:", nickname);
      console.log("StepRecommend: 선택된 장소들:", locations);
      console.log("StepRecommend: 장소별 추천 데이터:", placeRecommendations);

      // 2. API 요청 데이터 구성 - API 명세에 맞게 수정
      const items = locations.map((location, index) => ({
        external_id: location.external_id, // StepLocation에서 저장된 external_id 사용
        recommender_nickname: nickname,
        recommend_message: placeRecommendations[index]?.message || "",
        image_url: placeRecommendations[index]?.image || null,
        tags: placeRecommendations[index]?.tags || [],
        // guest_id 제거 - 서버가 쿠키에서 자동 추출
      }));

      console.log("StepRecommend: API 요청 데이터:", { items });

      // 3. API 호출 - 추천 장소 최종 제출
      const response = await axios.post(
        `${BASE_URL}/api/requests/${slug}/recommendations`,
        { items: items }
      );

      if (response.data.result === "success") {
        // 4. localStorage에 데이터 저장 (기존 로직 유지)
        const finalData = {
          slug,
          placeRecommendations,
          completedAt: new Date().toISOString(),
        };

        const messages = placeRecommendations.map((place) => place.message);
        const images = placeRecommendations.map((place) => place.image);
        const tags = placeRecommendations.map((place) => place.tags);

        localStorage.setItem("recommendMessages", JSON.stringify(messages));
        localStorage.setItem("recommendImages", JSON.stringify(images));
        localStorage.setItem("recommendTags", JSON.stringify(tags));
        localStorage.setItem(
          `recommendations_${slug}`,
          JSON.stringify(finalData)
        );

        console.log("추천 제출 완료:", finalData);

        // 5. CompleteRecommend로 이동
        navigate(`/shared-map/${slug}/complete`);
      }
    } catch (error) {
      console.error("추천 제출 실패:", error);
      // 에러 처리 (사용자에게 알림 등)
      if (error.response) {
        const { status, data } = error.response;
        console.error(`에러 ${status}:`, data.error?.message);
      }
    }
  }, [slug, placeRecommendations, navigate, BASE_URL]);

  // 카테고리 배열 메모이제이션
  const categories = useMemo(
    () => [
      "분위기 맛집",
      "핫플",
      "힐링 스팟",
      "또간집",
      "숨은 맛집",
      "가성비 갑",
    ],
    []
  );

  // 현재 장소 메모이제이션
  const currentPlace = useMemo(
    () => selectedPlaces[currentPlaceIndex],
    [selectedPlaces, currentPlaceIndex]
  );

  // 안전한 렌더링을 위한 체크
  if (!selectedPlaces || selectedPlaces.length === 0) {
    return <div>장소 정보를 불러오는 중...</div>;
  }

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>추천한 장소를 소개해주세요.</Title>
          <Detail>
            입력해 주신 정보는 장소에 대한 AI 요약을 제공하는 데 쓰여요.
          </Detail>
        </TextBlock>
        {/* 장소 표시 */}
        <PlaceSection>
          <PlaceTitle>
            <PlaceIcon src="/Pin.png" alt="장소 아이콘" />
            <PlaceDisplay>{currentPlace?.title || "장소명"}</PlaceDisplay>
          </PlaceTitle>
        </PlaceSection>

        <CategorySection>
          <TextBlock>
            <CategoryLabel>
              이 장소의 키워드를 선택해주세요. (최대 3개)
            </CategoryLabel>
          </TextBlock>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryButton
                key={category}
                isSelected={selectedCategories.includes(category)}
                disabled={isCategoryDisabled(category)}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryGrid>
        </CategorySection>

        <InputSection>
          <TextBlock>
            <InputLabel>
              {userProfile?.nickname || "사용자"} 님에게 전달할 메시지를
              입력해주세요.
            </InputLabel>
          </TextBlock>
          <InputContainer>
            <Message
              value={content}
              onChange={handleMemoChange}
              placeholder="메시지 입력"
              maxLength={120}
              onImageChange={handleImageChange}
            />
            <CharCount>{content.length}/120</CharCount>
          </InputContainer>
        </InputSection>
        {/* 진행 표시기 - 별도 섹션으로 분리 */}
        <ProgressSection>
          <ArrowButton
            onClick={() => handlePrevPlace()}
            disabled={currentPlaceIndex === 0}
            direction="left"
          >
            <ArrowIcon
              src="/PrevButton.png"
              alt="이전 장소"
              direction="left"
              disabled={currentPlaceIndex === 0}
            />
          </ArrowButton>

          <ProgressIndicator>
            {currentPlaceIndex + 1} / {selectedPlaces.length}
          </ProgressIndicator>

          <ArrowButton
            onClick={() => handleNextPlace()}
            disabled={currentPlaceIndex === selectedPlaces.length - 1}
            direction="right"
          >
            <ArrowIcon
              src="/PrevButton.png"
              alt="다음 장소"
              direction="right"
              disabled={currentPlaceIndex === selectedPlaces.length - 1}
            />
          </ArrowButton>
        </ProgressSection>
        {/* 진행 버튼: 모든 장소 입력 완료 시에만 표시 */}
        <ButtonSection className={!isAllCompleted ? "hidden" : ""}>
          <Button onClick={handleComplete}>완료하기</Button>
        </ButtonSection>
      </ContentSection>
    </Wrapper>
  );
}

export default StepRecommend;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  background-color: #ffffff;
  overflow: auto; /* 스크롤 허용 */
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 12px 20px;
  height: 100%;
  justify-content: flex-start;
  /* max-width와 margin 제거 - 전체 너비 사용 */
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  text-align: left;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.2px;
  color: #000000;
  margin: 0px 0px 5px 0px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  padding-left: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// <--- 장소 섹션 --->
const PlaceSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 0px;
`;

const PlaceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const PlaceIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 0;
`;

const PlaceDisplay = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #383838;
  margin: 0px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const PlaceAddress = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #888888;
  margin: 0px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const PlaceDistance = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #ff7e74;
  margin: 0px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputLabel = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #333333;
  margin: 0;
`;

const InputContainer = styled.div`
  position: relative;
  max-height: 180px;
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -20px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: #bababa;
  text-align: center;
  z-index: 1;
`;

// <--- 카테고리 섹션 --->
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
`;

const CategoryLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const CategoryButton = styled.div`
  padding: 12px 16px;
  border: 2px solid
    ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.isSelected ? "#ff7e74" : "#E7E7E7";
    }};
  border-radius: 8px;
  background-color: ${(props) => {
    if (props.disabled) return "#f5f5f5";
    return props.isSelected ? "#ffefed" : "#E7E7E7";
  }};
  color: ${(props) => {
    if (props.disabled) return "#bababa";
    return props.isSelected ? "#ff7e74" : "#585858";
  }};
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      border: 2px solid #ff7e74;
      color: #ff7e74;
      background-color: #ffefed;
    `}
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    min-height: 40px;
  }
`;

// <--- 진행 표시기 --->
const ProgressSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
`;

const ProgressIndicator = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #585858;
  margin: 0;
  padding: 8px 0px;
  text-align: center;
  min-width: 60px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      transform: scale(1.1);
    `}
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  transform: ${(props) =>
    props.direction === "right" ? "rotate(180deg)" : "none"};
  filter: ${(props) =>
    props.disabled ? "grayscale(100%) opacity(0.3)" : "none"};

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  justify-content: center;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease-out;
  min-height: 50px;

  &.hidden {
    opacity: 0;
    transform: translateY(0);
    pointer-events: none;
    visibility: hidden; /* 보이지 않게 하되 공간은 유지 */
  }
`;
