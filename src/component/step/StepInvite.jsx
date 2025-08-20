// 최초 앱 접속자 온보딩
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getResponsiveStyles } from "../../styles/responsive";
import ProgressBar from "../ui/ProgressBar";

function StepInvite() {
  const navigate = useNavigate();
  const [mapId, setMapId] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);

  // 컴포넌트 마운트 시 고유한 mapId 생성
  useEffect(() => {
    // 간단한 고유 ID 생성 (실제로는 서버에서 생성해야 하는데 임의로 작성)
    const generateMapId = () => {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `${timestamp}-${random}`;
    };
    setMapId(generateMapId());
  }, []);

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/shared-map/${mapId}/onboarding`;

    // 숨겨진 input 요소 생성
    const input = document.createElement("input");
    input.value = shareUrl;
    input.style.position = "fixed";
    input.style.opacity = 0;

    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, 99999); // 모바일 지원

    try {
      document.execCommand("copy");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // 에러 발생 시에도 링크는 보여줌
      alert(`복사 실패! 링크: ${shareUrl}`, err);
    }

    document.body.removeChild(input);
  };

  const handleComplete = () => {
    navigate("/");
  };

  return (
    <Wrapper>
      <Main>
        <Preview />
        <Content>
          <Title>
            김숭실 님을 위한
            <br />
            지도가 완성되었어요!
          </Title>
          <Detail>친구들과 공유해 숨겨진 장소를 알아보세요.</Detail>
        </Content>
      </Main>

      <Bottom>
        <ActionButtons>
          <CopyLinkButton onClick={handleCopyLink}>
            <LinkIcon src="/Link_Horizontal.png" alt="링크" />
            {copySuccess ? "링크 복사 완료!" : "내 지도 링크 복사하기"}
          </CopyLinkButton>
          <CompleteButton onClick={handleComplete}>완료하기</CompleteButton>
        </ActionButtons>
        {copySuccess && (
          <CopySuccessMessage>
            링크가 클립보드에 복사되었습니다!
          </CopySuccessMessage>
        )}
      </Bottom>
    </Wrapper>
  );
}

export default StepInvite;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  min-height: 100dvh;
  display: grid;
  grid-template-rows: 1fr auto;
  margin: 0 auto;
  padding: 24px 20px 0;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: relative;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 54px;
  width: 100%;
`;

// 버튼쪽 영역
const Bottom = styled.div`
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Preview = styled.div`
  width: 180px;
  height: 180px;
  background-color: #d9d9d9;
  border-radius: 10px;
  position: relative;

  &::after {
    content: "🗺️";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
  }
`;

const Content = styled.div`
  text-align: center;
  padding: 0 60px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 26px;
  color: #000000;
  margin-bottom: 14px;
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 18px;
  color: #585858;
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const CopyLinkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 77px;
  background-color: transparent;
  color: #ff7e74;
  border: 1.5px solid #ff7e74;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  transition: all 0.2s ease;
  height: 50px;
  justify-content: center;
  min-width: 220px;
  max-width: 220px;

  &:hover {
    background-color: #fff5f5;
  }

  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 200px;
    max-width: 200px;
    padding: 11px 60px;
  }

  @media (max-width: 1024px) {
    min-width: 180px;
    max-width: 180px;
    padding: 11px 50px;
  }

  @media (max-width: 768px) {
    min-width: 160px;
    max-width: 160px;
    padding: 11px 40px;
  }

  @media (max-width: 480px) {
    min-width: 140px;
    max-width: 140px;
    padding: 11px 30px;
  }
`;

const CompleteButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 77px;
  background-color: #ff7e74;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  transition: background-color 0.2s ease;
  height: 50px;
  justify-content: center;
  min-width: 100px;
  max-width: 100px;

  &:hover {
    background-color: #ff665c;
  }

  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 90px;
    max-width: 90px;
    padding: 11px 60px;
  }

  @media (max-width: 1024px) {
    min-width: 80px;
    max-width: 80px;
    padding: 11px 50px;
  }

  @media (max-width: 768px) {
    min-width: 70px;
    max-width: 70px;
    padding: 11px 40px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
    max-width: 60px;
    padding: 11px 30px;
  }
`;

const LinkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const CopySuccessMessage = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  color: #ff7e74;
  margin-top: 10px;
  text-align: center;
`;
