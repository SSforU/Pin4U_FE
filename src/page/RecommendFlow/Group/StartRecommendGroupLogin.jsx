// 그룹 지도용 추천 시작 페이지
// 링크로 접속한 사용자가 station과 memo 정보를 조회
// #7 A-지도화면 API 연동
import React, { useState, useEffect } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../../styles/responsive.js";
import { KAKAO_AUTH_URL } from "../../../utils/oauth";
import axios from "axios";

function StartRecommendGroup() {
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleKakaoLogin = () => {
    // 출발점 정보를 localStorage에 저장
    localStorage.setItem("kakaoLoginFrom", `group-request-${slug}`);
    window.location.href = KAKAO_AUTH_URL;
  };

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
        const response = await axios.get(`${BASE_URL}/api/requests/${slug}`);

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

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <Image src="/Pin4U_Logo.png" alt="그룹 프로필" />
        </ImageContainer>
        <Content>
          <Title>
            {/* 그룹명 변수로 바꿔야함(백엔드) */}[
            {userProfile?.nickname || "사용자"}]을 위한
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

      <LoginSection>
        <KakaoLoginButton onClick={handleKakaoLogin}>
          <KakaoLoginImage src="/Kakao_Login.png" alt="카카오 로그인" />
        </KakaoLoginButton>
        <LoginText>
          이미 계정이 있나요?{" "}
          <span className="login-link" onClick={handleKakaoLogin}>
            로그인
          </span>
        </LoginText>
      </LoginSection>
    </Wrapper>
  );
}

export default StartRecommendGroup;
// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("layout")}
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

const Main = styled.main`
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
  width: 120px;
  height: 120px;
  background-color: #f7f7f7;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    max-width: 250px;
  }

  @media (max-width: 480px) {
    max-width: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
  max-width: 70px;
  height: auto;
  object-fit: contain;
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

const LoginSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  animation: slideUp 0.5s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
`;

const KakaoLoginImage = styled.img`
  width: 350px;
  height: 100%;
`;

const KakaoLoginButton = styled.button`
  width: 350px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  img {
    width: 100%;
    height: auto;
    max-width: 350px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 480px) {
    width: 300px;

    img {
      max-width: 300px;
    }
  }
`;

const LoginText = styled.div`
  margin-top: 20px;
  text-align: center;
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  color: #666666;

  .login-link {
    color: #ff7e74;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      color: #ff7e74;
    }
  }
`;
