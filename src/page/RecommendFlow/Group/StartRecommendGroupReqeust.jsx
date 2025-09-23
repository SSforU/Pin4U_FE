// 그룹 지도용 추천 시작 페이지
// 링크로 접속한 사용자가 station과 memo 정보를 조회
// #7 A-지도화면 API 연동
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../../styles/responsive.js";
import Button from "../../../component/ui/Button.jsx";
import axios from "axios";

function StartRecommendGroupRequest() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // 멤버 요청 함수
  const handleRequest = () => {
    // 멤버 요청 처리 (백엔드 연동 전 임시)
    setIsRequested(true);
    setRequestSuccess(true);

    // 3초 후 팝업 숨기기
    setTimeout(() => {
      setRequestSuccess(false);
    }, 3000);

    // 개발용: 5초 후 자동 승인 (실제로는 백엔드에서 승인 알림을 받아야 함)
    setTimeout(() => {
      setIsApproved(true);
    }, 5000);
  };

  // 장소 추천 함수
  const handleRecommend = () => {
    if (isApproved) {
      navigate(`/shared-map/group/${slug}/onboarding`);
    }
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
            {/* 그룹명 변수로 바꿔야함(백엔드) */} [
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

      <Bottom>
        <RequestButtonSection>
          <RequestButton
            onClick={handleRequest}
            disabled={isRequested}
            $isRequested={isRequested}
          >
            {isRequested ? (
              <>
                <ButtonCheckIcon src="/LinkCopyComplete.png" alt="체크" />
                멤버 요청 완료
              </>
            ) : (
              "멤버 요청하기"
            )}
          </RequestButton>
          <RecommendButton
            onClick={handleRecommend}
            disabled={!isApproved}
            $isApproved={isApproved}
          >
            장소 추천하러 가기
          </RecommendButton>
        </RequestButtonSection>
        {requestSuccess && (
          // 멤버 요청 버튼 클릭 시 나오는 팝업
          <RequestSuccessPopup>
            <RequestSuccessContent>
              <RequestSuccessText>
                멤버 요청이 완료되었어요!
                <br />
                {userProfile?.nickname || "사용자"} 님이 요청을 수락하면
                <br />
                장소 추천이 가능해요.
              </RequestSuccessText>
            </RequestSuccessContent>
          </RequestSuccessPopup>
        )}
        <LoginSuccessText>로그인이 완료되었어요!</LoginSuccessText>
      </Bottom>
    </Wrapper>
  );
}
export default StartRecommendGroupRequest;
// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("layout")}
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
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

const Main = styled.main`
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  text-align: center;
  flex: 1;
  min-height: 0;
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

const RequestButtonSection = styled.div`
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

const RequestButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
  background-color: ${(props) => (props.$isRequested ? "#FFD5D2" : "#ff7e74")};
  color: ${(props) => (props.$isRequested ? "#FFFFFF" : "#ffffff")};
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.$isRequested ? "not-allowed" : "pointer")};
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  height: 50px;
  min-width: 190px;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${(props) => (props.$isRequested ? "none" : "translateY(-1px)")};
  }
  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
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

// 장소 추천하러 가기 버튼
const RecommendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
  background-color: ${(props) => (props.$isApproved ? "#ff7e74" : "#FFD5D2")};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.$isApproved ? "pointer" : "not-allowed")};
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  transition: all 0.2s ease;
  height: 50px;
  min-width: 100px;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isApproved ? "#ff665c" : "#f5f5f5")};
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

// 멤버 요청 성공 팝업
const RequestSuccessPopup = styled.div`
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffefed;
  border-radius: 16px;
  box-shadow: 0 2px 13px rgba(0, 0, 0, 0.2);
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  min-width: 300px;
  max-height: 80px;
  justify-content: center;
  animation: popupFadeIn 0.4s ease-out;

  @keyframes popupFadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (max-width: 480px) {
    min-width: 280px;
    padding: 20px 24px;
    margin: 0 20px;
  }
`;

const RequestSuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const ButtonCheckIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  filter: brightness(0) invert(1);
`;

const RequestSuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #585858;
  margin: 0;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoginSuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #838383;
  text-align: center;
`;
