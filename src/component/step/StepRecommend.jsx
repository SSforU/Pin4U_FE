// 장소 추천 단계
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";
import Message from "../ui/Message";

function StepRecommend() {
  const { memo, setMemo } = useOutletContext();
  const [content, setContent] = useState(memo || "");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [IMAGE_FILE, setImageFile] = useState(null);

  // memo prop이 변경될 때만 content 상태 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (memo && memo !== content) {
      setContent(memo);
    }
  }, [memo]); // content 의존성 제거

  // 120자 제한 처리
  const handleMemoChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= 120) {
      setContent(newContent);
      // 부모 컴포넌트에 즉시 전달 (디바운싱 없이)
      if (setMemo) {
        setMemo(newContent);
      }
    }
  };

  // 이미지 변경 처리
  const handleImageChange = (file) => {
    setImageFile(file);
  };

  // 카테고리 토글 처리
  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) => {
      // 이미 선택된 카테고리라면 제거
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      }

      // 최대 3개까지만 선택 가능
      if (prev.length >= 3) {
        return prev; // 3개가 이미 선택된 상태면 추가하지 않음
      }

      // 새로운 카테고리 추가
      return [...prev, category];
    });
  };

  // 카테고리가 비활성화되어야 하는지 확인
  const isCategoryDisabled = (category) => {
    return (
      selectedCategories.length >= 3 && !selectedCategories.includes(category)
    );
  };

  const categories = [
    "분위기 맛집",
    "핫플",
    "힐링 스팟",
    "또간집",
    "숨은 맛집",
    "가성비 갑",
  ];

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>추천한 장소에 대해 설명해주세요.</Title>
          <Detail>
            입력해 주신 정보는 장소에 대한 AI 요약을 제공하는 데 쓰여요.
          </Detail>
        </TextBlock>

        <CategorySection>
          <TextBlock>
            <CategoryLabel>
              이 장소의 키워드를 선택해주세요. (최대 3개)
            </CategoryLabel>
          </TextBlock>
          {/* 해당 장소 추가 예정 */}
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
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 32px;
  padding: 24px 20px;
  height: 100%;
  justify-content: flex-start;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
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
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
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
    font-size: 13px;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const InputLabel = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  color: #383838;
`;

const InputContainer = styled.div`
  position: relative;
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -26px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #bababa;
  text-align: center;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CategoryLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  color: #333;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3개씩 균등하게 배치 */
  gap: 12px;
  width: 100%;

  /* 모바일에서는 2개씩 */
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const CategoryButton = styled.div`
  padding: 12px 16px;
  border: 2px solid
    ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.isSelected ? "#ff7e74" : "#e0e0e0";
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
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

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
  }
`;
