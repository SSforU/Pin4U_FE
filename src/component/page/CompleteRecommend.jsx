import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

function CompleteRecommend() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <PlaneImage src="/Recommend_Plane.png" alt="비행기" />
        </ImageContainer>
        <Content>
          <Title>
            김숭실 님을 위한
            <br />
            장소 추천을 완료했어요!
          </Title>
          <Detail>좋은 장소를 공유해 주셔서 감사해요.</Detail>
        </Content>
      </Main>

      <Bottom>
        <Button onClick={handleGoHome}>내 지도 만들러 가기</Button>
      </Bottom>
    </Wrapper>
  );
}

export default CompleteRecommend;

// styled-components
const Wrapper = styled.div`
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
