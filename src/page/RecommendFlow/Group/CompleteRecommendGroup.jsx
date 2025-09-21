// #1 고정 사용자 조회 API 호출
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getResponsiveStyles } from "../../../styles/responsive.js";

function CompleteRecommendGroup() {
  const navigate = useNavigate();
  const { userProfile } = useOutletContext();
  const [copySuccess, setCopySuccess] = useState(false);

  // 링크 복사 함수 - CompleteMakePlace에서 생성된 링크 그대로 사용
  const handleCopyLink = () => {
    const savedLink = localStorage.getItem("savedShareLink");
    if (savedLink) {
      navigator.clipboard.writeText(savedLink).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      });
    } else {
      // 링크가 저장되지 않았으면 에러 처리
      alert("저장된 링크가 없습니다.");
    }
  };

  const handleComplete = () => {
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
            {userProfile?.nickname || "사용자"} 님을 위한
            <br />
            장소 추천을 완료했어요!
          </Title>
          <Detail>
            {localStorage.getItem("recommendUserNickname") || "친구"}님을 위한
            지도도 생성해보세요!
          </Detail>
        </Content>
      </Main>

      <Bottom>
        <ActionButtons>
          <CopyLinkButton onClick={handleCopyLink}>
            <LinkIcon src="/Link_Horizontal.png" alt="링크" />
            그룹 지도 링크 복사하기
          </CopyLinkButton>
          <CompleteButton onClick={handleComplete}>완료하기</CompleteButton>
        </ActionButtons>
        {copySuccess && (
          <CopySuccessPopup>
            <CopySuccessContent>
              <CheckIcon src="/LinkCopyComplete.png" alt="체크" />
              <CopySuccessText>링크가 복사되었어요!</CopySuccessText>
            </CopySuccessContent>
          </CopySuccessPopup>
        )}
      </Bottom>
    </Wrapper>
  );
}

export default CompleteRecommendGroup;

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

// 버튼쪽 영역
const Bottom = styled.div`
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  /* flex-wrap: wrap; */

  @media (max-width: 768px) {
    padding: 16px 10px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px 5px;
    margin-bottom: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 20px;
  justify-content: center;
  /* flex-wrap: wrap; */

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    padding: 0 5px;
  }
`;

const CopyLinkButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
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
  min-width: 220px;
  white-space: nowrap;

  &:hover {
    background-color: #fff5f5;
  }

  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 200px;
    padding: 11px 16px;
  }

  @media (max-width: 1024px) {
    min-width: 180px;
    padding: 11px 14px;
  }

  @media (max-width: 768px) {
    min-width: 160px;
    padding: 11px 12px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    min-width: 140px;
    padding: 11px 10px;
    font-size: 14px;
    height: 48px;
  }
`;

const CompleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
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
  min-width: 100px;
  white-space: nowrap;

  &:hover {
    background-color: #ff665c;
  }

  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 90px;
    padding: 11px 16px;
  }

  @media (max-width: 1024px) {
    min-width: 80px;
    padding: 11px 14px;
  }

  @media (max-width: 768px) {
    min-width: 70px;
    padding: 11px 12px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
    padding: 11px 10px;
    font-size: 14px;
    height: 48px;
  }
`;

const LinkIcon = styled.img`
  width: 24px;
  height: 24px;
`;

// 링크 복사 성공 팝업
const CopySuccessPopup = styled.div`
  opacity: 0.8;
  position: fixed;
  top: 82%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ff7e74;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 11px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1000;
  min-width: 200px;
  justify-content: center;
  animation: popupFadeIn 0.3s ease-out;

  @keyframes popupFadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`;

const CopySuccessContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckIcon = styled.img`
  width: 15px;
  height: 15px;
`;

const CopySuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  color: #ffffff;
  margin: 0;
  white-space: nowrap;
`;
