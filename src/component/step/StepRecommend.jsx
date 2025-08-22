// 장소 추천 단계
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";
import Message from "../ui/Message";
import Button from "../ui/Button";

function StepRecommend() {
  const { memo } = useOutletContext();
  const [content, setContent] = useState(memo || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [IMAGE_FILE, setImageFile] = useState(null);
  const navigate = useNavigate();
  const { mapId } = useParams();

  // 임시 데이터 (나중에 StepLocation에서 받아올 예정)
  const [selectedPlaces] = useState([
    { id: 1, name: "카페 모모", external_id: "kakao:123456789" },
    { id: 2, name: "맛집 맛집", external_id: "kakao:987654321" },
    { id: 3, name: "힐링 카페", external_id: "kakao:456789123" },
  ]);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  // 장소별 입력 데이터 저장 (tags, message)
  const [placeRecommendations, setPlaceRecommendations] = useState(() =>
    selectedPlaces.map(() => ({ tags: [], message: "" }))
  );

  // 모든 장소의 입력이 완료되었는지 확인 (메모이제이션)
  const isAllCompleted = useMemo(() => {
    return placeRecommendations.every(
      (place) => place.tags.length > 0 && place.message.trim().length > 0
    );
  }, [placeRecommendations]);

  // memo prop이 변경될 때만 content 상태 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (memo && memo !== content) {
      setContent(memo);
    }
  }, [memo, content]);

  // 120자 제한 처리 + 장소별 메시지 반영 (메모이제이션)
  const handleMemoChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      if (newContent.length <= 120) {
        setContent(newContent);
        // setMemo 호출 제거 - 각 장소별로 독립적으로 관리
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

        // JSON.stringify 제거하고 직접 비교로 성능 최적화
        setPlaceRecommendations((p) => {
          const currentPlace = p[currentPlaceIndex];
          if (
            currentPlace.tags.length === next.length &&
            currentPlace.tags.every((tag, i) => tag === next[i])
          ) {
            return p; // 변경사항이 없으면 기존 배열 반환
          }

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
        return copy;
      });

      const nextIndex = currentPlaceIndex + 1;
      setCurrentPlaceIndex(nextIndex);

      // 다음 장소의 저장된 데이터 로드
      const nextPlaceData = placeRecommendations[nextIndex];
      setSelectedCategories(nextPlaceData?.tags || []);
      setContent(nextPlaceData?.message || "");
      setImageFile(null);
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
        return copy;
      });

      const prevIndex = currentPlaceIndex - 1;
      setCurrentPlaceIndex(prevIndex);

      // 이전 장소의 저장된 데이터 로드
      const prevPlaceData = placeRecommendations[prevIndex];
      setSelectedCategories(prevPlaceData?.tags || []);
      setContent(prevPlaceData?.message || "");
      setImageFile(null);
    }
  }, [currentPlaceIndex, placeRecommendations, selectedCategories, content]);

  // 완료 처리 (CompleteRecommend로 이동) (메모이제이션)
  const handleComplete = useCallback(() => {
    // 모든 장소 추천 데이터를 localStorage에 저장
    const finalData = {
      mapId,
      placeRecommendations,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(`recommendations_${mapId}`, JSON.stringify(finalData));
    console.log("모든 장소 추천 완료:", finalData);

    // CompleteRecommend로 이동 (절대 경로 사용)
    navigate(`/shared-map/${mapId}/complete`);
  }, [mapId, placeRecommendations, navigate]);

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
          <PlaceIcon src="/Pin.png" alt="장소 아이콘" />
          <PlaceInfo>
            <PlaceDisplay>{currentPlace?.name || "장소명"}</PlaceDisplay>
          </PlaceInfo>
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
            <InputLabel>김숭실 님에게 전달할 메시지를 입력해주세요.</InputLabel>
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
  gap: 12px; // 15px에서 12px로 줄이기
  padding: 14px 20px; /* 16px에서 14px로 줄이기 */
  height: 100%;
  justify-content: flex-start;
  /* max-width와 margin 제거 - 전체 너비 사용 */
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px; // 8px에서 6px로 줄이기
  text-align: left;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.2px;
  color: #000000;
  margin: 0;

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

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px; // 8px에서 6px로 줄이기
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
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -24px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: #bababa;
  text-align: center;
`;

// <--- 카테고리 섹션 --->
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; // 10px에서 8px로 줄이기
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

// <--- 장소 섹션 --->
const PlaceSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  gap: 2px;
`;

const PlaceIcon = styled.img`
  width: 25px;
  height: 25px;
  object-fit: contain;
`;

const PlaceInfo = styled.div`
  display: flex;
  gap: 5px;
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

// <--- 진행 표시기 --->
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

const ProgressSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
  justify-content: center; /* 20px에서 40px로 늘림 */
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease-out;

  &.hidden {
    opacity: 0;
    transform: translateY(100%);
    pointer-events: none;
  }
`;
