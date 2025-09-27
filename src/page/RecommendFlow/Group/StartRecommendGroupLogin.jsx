// 그룹 지도용 추천 시작 페이지
// 링크로 접속한 사용자가 station과 memo 정보를 조회
// #7 A-지도화면 API 연동
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../../styles/responsive.js";
import { KAKAO_AUTH_URL } from "../../../utils/oauth";

function StartRecommendGroupLogin() {
  const { slug } = useParams();

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
  const [groupInfo, setGroupInfo] = useState({ name: "", image_url: "" });

  // 로그인 전이므로 기본값 사용 (그룹 정보 API는 인증 필요)
  useEffect(() => {
    // 로그인 전에는 그룹 상세 정보를 가져올 수 없으므로 기본값 사용
    setGroupInfo({
      name: "그룹",
      image_url: "/Pin4U_Logo.png",
    });
  }, []);

  // 로그인 페이지이므로 기본 메시지 표시
  useEffect(() => {
    setIsLoading(false);
    setLocationData({
      station: "로그인 후 확인 가능",
      memo: "그룹에 가입하여 내용을 확인하세요",
    });
  }, []);

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <Image
            src={groupInfo.image_url || "/Pin4U_Logo.png"}
            alt="그룹 프로필"
          />
        </ImageContainer>
        <Content>
          <Title>
            [{groupInfo.name || "그룹"}]을 위한
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

export default StartRecommendGroupLogin;
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
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
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
