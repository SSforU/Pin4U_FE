// 지도 유형 선택 스텝 (개인/그룹)
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../styles/responsive";
import { useOutletContext, useNavigate } from "react-router-dom";

function StepSelectMapType() {
  const outlet = useOutletContext?.() || {};
  const { mapType, setMapType, userProfile } = outlet;
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState(mapType || null);

  function handleSelect(type) {
    setSelectedType(type);
    if (typeof setMapType === "function") {
      setMapType(type);
    }

    // mapType에 따라 다른 경로로 이동
    if (type === "self") {
      // 개인 지도: station으로 이동
      navigate("/make-place/station");
    } else if (type === "group") {
      // 그룹 지도: group-profile로 이동
      navigate("/make-place/group-profile");
    }
  }

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>
            반가워요, {userProfile?.nickname || "사용자"} 님!
            <br />
            어떤 지도를 만들어볼까요?
          </Title>
          <Detail>원하시는 지도를 선택해주세요.</Detail>
        </TextBlock>

        <Options>
          <OptionCard
            role="button"
            aria-label="개인 추천맵 선택"
            tabIndex={0}
            selected={selectedType === "self"}
            onClick={() => handleSelect("self")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelect("self");
            }}
          >
            <Image src="/Self_Map.svg" alt="개인 추천맵" />
            <OptionTitle>나만의 지도</OptionTitle>
            <OptionDesc>오직 나만이 지도를 관리할 수 있어요.</OptionDesc>
          </OptionCard>

          <OptionCard
            role="button"
            aria-label="그룹 추천맵 선택"
            tabIndex={0}
            selected={selectedType === "group"}
            onClick={() => handleSelect("group")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleSelect("group");
            }}
          >
            <Image src="/Group_Map.svg" alt="그룹 추천맵" />
            <OptionTitle>그룹 지도</OptionTitle>
            <OptionDesc>친구들과 함께 지도를 채울 수 있어요.</OptionDesc>
          </OptionCard>
        </Options>
      </ContentSection>
    </Wrapper>
  );
}

export default StepSelectMapType;

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
  gap: 10px;
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

const Options = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 2px solid ${(props) => (props.selected ? "#ff7e74" : "#eeeeee")};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  margin-top: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 100px;
  height: auto;
  object-fit: contain;
`;

const OptionTitle = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
`;

const OptionDesc = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #585858;
`;
