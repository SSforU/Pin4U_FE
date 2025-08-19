import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { getResponsiveStyles } from "../../styles/responsive";
import ProgressBar from "../ui/ProgressBar";

function StepInvite() {
  const navigate = useNavigate();

  const handleCopyLink = () => {
    // 링크 복사 로직
    alert("링크가 복사되었습니다!");
  };

  const handleComplete = () => {
    navigate("/");
  };

  // const handleShare = () => {
  //   // 공유 로직
  //   if (navigator.share) {
  //     navigator.share({
  //       title: "내 지도",
  //       text: "친구들과 공유해 숨겨진 장소를 알아보세요.",
  //       url: window.location.href,
  //     });
  //   } else {
  //     handleCopyLink();
  //   }
  // };

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
            <LinkIcon src="/Link_Horizontal.png" alt="링크" />내 지도 링크
            복사하기
          </CopyLinkButton>
          <CompleteButton onClick={handleComplete}>완료하기</CompleteButton>
        </ActionButtons>
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
`;

const CopyLinkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 11px 30px;
  background: none;
  border: 1.5px solid #ff7e74;
  border-radius: 10px;
  color: #ff7e74;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 280px;
  justify-content: center;

  &:hover {
    background-color: #fff5f5;
  }
`;

const LinkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const CompleteButton = styled.button`
  height: 50px;
  padding: 11px 30px;
  background-color: #ff7e74;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-width: 120px;

  &:hover {
    background-color: #ff6b5f;
  }
`;

const ShareButton = styled.button`
  position: absolute;
  right: 20px;
  top: 24px;
  width: 50px;
  height: 50px;
  background: none;
  border: 1.5px solid #ff7e74;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff5f5;
  }
`;

const ShareIcon = styled.img`
  width: 16px;
  height: 18px;
`;
