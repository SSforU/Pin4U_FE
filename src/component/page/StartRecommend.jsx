import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import Button from "../ui/Button";

function StartRecommend() {
  const navigate = useNavigate();
  const { mapId } = useParams();

  // 임시 데이터 (나중에 MakePlaceLayout에서 받아올 예정)
  const locationData = {
    station: "숭실대입구역 7호선",
    memo: "공부하기 좋은 카페 추천해 줘!",
  };

  const handleGoRecommend = () => {
    navigate(`/shared-map/${mapId}/onboarding/nickname`);
  };

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <PlaneImage src="/Pin4U_Logo.png" alt="Pin4U 로고" />
        </ImageContainer>
        <Content>
          <Title>
            김숭실 님을 위한
            <br />
            장소를 추천해주세요!
          </Title>
        </Content>

        {/* 위치와 메모 정보 추가 */}
        <InfoSection>
          {/* 위치 정보 */}
          <InfoItem>
            <InfoIcon src="/Pin.png" alt="위치" />
            <InfoText>{locationData.station}</InfoText>
          </InfoItem>

          {/* 메모 정보 */}
          <InfoItem>
            <InfoIcon src="/Recommend_Memo.png" alt="메모" />
            <InfoText>{locationData.memo}</InfoText>
          </InfoItem>
        </InfoSection>
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
  gap: 30px;
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
  font-weight: 600;
  font-size: 24px;
  line-height: 1.3;
  color: #000000;
  margin: 0;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
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

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  color: #585858;
  margin: 0;
  text-align: left;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
