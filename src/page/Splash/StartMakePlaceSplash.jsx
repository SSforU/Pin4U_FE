import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { KAKAO_AUTH_URL } from "../../utils/oauth";

function StartMakePlace() {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogin(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // 인가코드 추출
  const handleKakaoLogin = () => {
    // 출발점 정보를 localStorage에 저장
    localStorage.setItem("kakaoLoginFrom", "make-place");
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <Wrapper>
      <ContentContainer $showLogin={showLogin}>
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
      </ContentContainer>

      {showLogin && (
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
      )}
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
  animation: fadeIn 1.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  gap: 60px;
  transition: transform 0.5s ease-in-out;
  transform: ${(props) =>
    props.$showLogin ? "translateY(-80px)" : "translateY(0)"};
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
