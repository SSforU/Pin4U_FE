// #1 고정 사용자 조회 API 호출
import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { getResponsiveStyles } from "../../../styles/responsive.js";

function CompleteRecommendGroup() {
  const navigate = useNavigate();
  const { userProfile } = useOutletContext();
  const { slug } = useParams(); // URL에서 slug 가져오기
  const [copySuccess, setCopySuccess] = useState(false);

  // 링크 복사 함수 - PlaceMapPage 로직 참고해서 견고하게 구현
  const handleCopyLink = async () => {
    // 라우트 파라미터 우선, 없으면 localStorage에서 slug 확인
    const s = slug || localStorage.getItem("createdSlug");
    if (!s) {
      window.alert("공유할 링크의 slug가 없습니다.");
      return;
    }

    const shareUrl = `${window.location.origin}/shared-map/group/${s}/splash`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // 2초 후에 토스트 숨기기
    } catch (err) {
      try {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // 2초 후에 토스트 숨기기
      } catch (err) {
        window.prompt(
          "복사에 실패했어요. 아래 링크를 수동으로 복사해 주세요:",
          shareUrl
        );
      }
    }
  };

  const handleComplete = () => {
    // 추천 작성자(로그인한 사용자)의 홈페이지로 이동
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
