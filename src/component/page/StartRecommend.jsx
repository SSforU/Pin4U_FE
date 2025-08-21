import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import Button from "../ui/Button";

function StartRecommend() {
  const navigate = useNavigate();
  const { mapId } = useParams();

  const handleGoRecommend = () => {
    navigate(`/shared-map/${mapId}/onboarding/nickname`);
  };

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <PlaneImage src="/Pin4U_Logo.png" alt="비행기" />
        </ImageContainer>
        <Content>
          <Title>장소 추천을 시작해보세요!</Title>
        </Content>
      </Main>

      <Bottom>
        <Button onClick={handleGoRecommend}>장소 추천하러 가기</Button>
      </Bottom>
    </Wrapper>
  );
}

export default StartRecommend;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("layout")}
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

const Main = styled.main`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  text-align: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  max-width: 400px;
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
  line-height: 1.5;
  color: #585858;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 160px;

  @media (max-width: 768px) {
    max-width: 250px;
  }

  @media (max-width: 480px) {
    max-width: 200px;
  }
`;

const PlaneImage = styled.img`
  width: 100%;
  max-width: 160px;
  height: auto;
  object-fit: contain;
`;

const Bottom = styled.div`
  padding: 20px;
`;
