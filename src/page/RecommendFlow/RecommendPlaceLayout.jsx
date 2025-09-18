// #1 고정 사용자 조회 API 호출 (props 전달용)
import React, { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useMatch,
  useParams,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../../component/ui/ProgressBar";
import Button from "../../component/ui/Button";
import StepNickname from "../../step/StepNickname";
import { getResponsiveStyles } from "../../styles/responsive";

const STEPS = ["nickname", "location", "recommend"];
const FLOW_OFFSET = 1; // 1단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function RecommendPlaceLayout() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState(null);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 닉네임이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (nickname.trim()) {
      localStorage.setItem("recommendUserNickname", nickname);
    }
  }, [nickname]);

  // useMatch로 현재 step 추출
  const match = useMatch("/shared-map/:slug/onboarding/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "nickname" && !nickname.trim()) ||
    (stepParam === "location" && !location);

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/shared-map/${slug}/onboarding/${STEPS[safe]}`);
  }

  async function goNext() {
    try {
      if (stepParam === "nickname") {
        goToStep(currentIndex + 1);
      } else if (stepParam === "location") {
        goToStep(currentIndex + 1);
      }
    } catch (error) {
      console.error("오류 발생:", error);

      let message = "오류가 발생했습니다.";

      if (error.response?.status === 500) {
        message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      } else if (error.response?.status === 400) {
        message = "잘못된 요청입니다.";
      } else if (!error.response) {
        message = "서버에 연결할 수 없습니다.";
      }

      setErrorMessage(message);
      setShowErrorModal(true);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1);
    } else {
      navigate(`/shared-map/${slug}`);
    }
  }

  return (
    <Wrapper>
      <Top>
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <PrevButtonContainer>
          <PrevButtonWrapper
            src="/PrevButton.png"
            alt="뒤로가기"
            onClick={goPrev}
          />
        </PrevButtonContainer>
      </Top>

      <Main>
        {stepParam === "nickname" ? (
          <StepNickname nickname={nickname} setNickname={setNickname} />
        ) : (
          <Outlet
            context={{
              nickname,
              setNickname,
              location,
              setLocation,
              memo,
              setMemo,
              slug,
              userProfile, // userProfile을 하위 컴포넌트들에게 전달
            }}
          />
        )}
      </Main>

      {stepParam !== "recommend" && (
        // Recommend 단계에서는 버튼 미노출
        <Bottom>
          <Button disabled={isNextDisabled} onClick={goNext}>
            다음으로
          </Button>
        </Bottom>
      )}

      {/* 오류 발생 시 에러 모달 */}
      {showErrorModal && (
        <ErrorModal>
          <ErrorContent>
            <ErrorTitle>오류가 발생하였습니다!</ErrorTitle>
            <ErrorMessage>{errorMessage}</ErrorMessage>
            <ErrorButton onClick={() => setShowErrorModal(false)}>
              확인
            </ErrorButton>
          </ErrorContent>
        </ErrorModal>
      )}
    </Wrapper>
  );
}

export default RecommendPlaceLayout;

// styled-components (MakePlaceLayout과 동일)
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
`;

const Top = styled.div`
  padding: 20px 20px 0px 20px;
`;

const Main = styled.main`
  padding: 0px 20px 20px 20px;
  overflow: auto;
`;

const PrevButtonContainer = styled.div`
  ${getResponsiveStyles("layout")}
  margin-top: 25px;
  display: flex;
`;

const PrevButtonWrapper = styled.img`
  cursor: pointer;
`;

const Bottom = styled.div`
  padding: 40px;
`;

// 오류 발생 시 에러 모달 스타일
const ErrorModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ErrorContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 300px;
  width: 90%;
  text-align: center;
`;

const ErrorTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const ErrorButton = styled.button`
  background-color: #ff7e74;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: #ff6b61;
  }
`;
