import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function StartMakePlace({ onComplete }) {
  const navigate = useNavigate();

  const handleSubmit = () => {
    // onComplete 호출하여 App.jsx의 isFirstVisit을 false로 변경
    onComplete();
    console.log("onComplete 호출됨 - isFirstVisit을 false로 변경");
    // MakePlaceLayout으로 이동
    navigate("/make-place");
  };

  return (
    <Wrapper>
      <ContentContainer>
        <LogoContainer>
          <Logo src="/Pin4U_Logo.png" alt="Pin4U 로고" />
        </LogoContainer>

        <TextSection>
          <Title>당신만을 위한 퍼스널 지도</Title>
          <Detail>
            지도 앱에서 찾는 뻔한 장소를 넘어
            <br />
            내 친구들만 아는 숨겨진 장소까지,
            <br />
            지금 Pin4U에서 알아보세요!
          </Detail>
        </TextSection>

        <ButtonSection>
          <Button onClick={handleSubmit}>나만의 지도 만들러 가기</Button>
        </ButtonSection>
      </ContentContainer>
    </Wrapper>
  );
}

export default StartMakePlace;

// styled-components
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  gap: 60px;
`;

const LogoContainer = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3;
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
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #585858;
  margin: 0;
`;

const ButtonSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 20px;
`;
