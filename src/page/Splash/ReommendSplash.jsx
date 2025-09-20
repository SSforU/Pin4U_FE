import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

function SplashPage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 현재 URL에서 /splash를 제거하고 추천 페이지로 이동
      const currentPath = window.location.pathname;
      const targetPath = currentPath.replace("/splash", "");
      navigate(targetPath);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, slug]);

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
      </ContentContainer>
    </Wrapper>
  );
}

export default SplashPage;

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
