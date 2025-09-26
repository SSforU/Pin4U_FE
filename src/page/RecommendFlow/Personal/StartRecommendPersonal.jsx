// 그룹 지도용 추천 시작 페이지
// 링크로 접속한 사용자가 station과 memo 정보를 조회
// #7 A-지도화면 API 연동
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../../styles/responsive.js";
import Button from "../../../component/ui/Button.jsx";
import axios from "axios";

function StartRecommendPersonal() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // API에서 받아온 데이터 상태
  const [locationData, setLocationData] = useState({
    station: "",
    memo: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  // API에서 요청 정보 조회 (station + memo)
  useEffect(() => {
    const fetchRequestInfo = async () => {
      try {
        setIsLoading(true);
        // API 호출
        const response = await axios.get(`${BASE_URL}/api/requests/${slug}`, {
          withCredentials: true,
        });

        // 올바른 응답 구조에서 데이터 추출
        const { station, requestMessage } = response.data.data;
        // 필요한 데이터만 추출
        setLocationData({
          station: station.name, // 역 이름만
          memo: requestMessage, // 요청 메시지만
        });
      } catch (error) {
        console.error("요청 정보 조회 실패:", error);
        // 에러 시 기본값 설정
        setLocationData({
          station: "정보를 불러올 수 없습니다",
          memo: "정보를 불러올 수 없습니다",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchRequestInfo();
    }
  }, [slug, BASE_URL]);

  const handleGoRecommend = () => {
    navigate(`/shared-map/personal/${slug}/onboarding/nickname`);
  };

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <PlaneImage src="/Pin4U_Logo.png" alt="Pin4U 로고" />
        </ImageContainer>
        <Content>
          <Title>
            {userProfile?.nickname || "사용자"} 님을 위한
            <br />
            장소를 추천해주세요!
          </Title>
        </Content>

        {/* 위치와 메모 정보 추가 */}
        <InfoSection>
          {/* 위치 정보 */}
          <InfoItem>
            <InfoIcon src="/Pin.png" alt="위치" />
            <InfoText>
              {isLoading ? "로딩 중..." : locationData.station}
            </InfoText>
          </InfoItem>

          {/* 메모 정보 */}
          <InfoItem>
            <InfoIcon src="/Recommend_Memo.png" alt="메모" />
            <InfoText>{isLoading ? "로딩 중..." : locationData.memo}</InfoText>
          </InfoItem>
        </InfoSection>
      </Main>

      <Bottom>
        <Button onClick={handleGoRecommend}>장소 추천하러 가기</Button>
      </Bottom>
    </Wrapper>
  );
}

export default StartRecommendPersonal;
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
