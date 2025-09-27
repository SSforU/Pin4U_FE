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
import ProgressBar from "../../../component/ui/ProgressBar.jsx";
import Button from "../../../component/ui/Button.jsx";
import StepNickname from "../../../step/StepNickname.jsx";
import StepLocation from "../../../step/StepLocation.jsx";
import { getResponsiveStyles } from "../../../styles/responsive.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const STEPS = ["nickname", "location", "recommend"];
const FLOW_OFFSET = 1; // 1단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function RecommendGroupPlaceLayout() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState(null);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // useMatch로 현재 step 추출
  const match = useMatch("/shared-map/group/:slug/onboarding/:step");
  const stepParam = match?.params?.step || STEPS[0];

  // 로그인 시 닉네임 스텝 생략: 프로필 닉네임으로 설정 후 location으로 이동
  useEffect(() => {
    if (stepParam === "nickname" && userProfile?.nickname) {
      if (!nickname) setNickname(userProfile.nickname);
      navigate(`/shared-map/group/${slug}/onboarding/location`, {
        replace: true,
      });
    }
  }, [stepParam, userProfile, nickname, slug, navigate]);

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "nickname" &&
      !userProfile?.nickname &&
      (!nickname.trim() || nickname.length < 2)) ||
    (stepParam === "location" && !location);

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    // 현재 경로를 확인하여 적절한 경로로 이동
    const currentPath = window.location.pathname;
    if (currentPath.includes("/personal/")) {
      navigate(`/shared-map/personal/${slug}/onboarding/${STEPS[safe]}`);
    } else if (currentPath.includes("/group/")) {
      navigate(`/shared-map/group/${slug}/onboarding/${STEPS[safe]}`);
    } else {
      // 기본값 (fallback)
      navigate(`/shared-map/${slug}/onboarding/${STEPS[safe]}`);
    }
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
      // 현재 경로를 확인하여 적절한 추천 페이지로 이동
      const currentPath = window.location.pathname;
      if (currentPath.includes("/personal/")) {
        navigate(`/shared-map/personal/${slug}`);
      } else if (currentPath.includes("/group/")) {
        navigate(`/shared-map/group/${slug}`);
      } else {
        // 기본값 (fallback)
        navigate(`/shared-map/${slug}`);
      }
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
          <StepNickname
            nickname={nickname}
            setNickname={setNickname}
            detailText={`[${
              userProfile?.nickname || "사용자"
            }] 멤버에게 공개돼요.`}
          />
        ) : stepParam === "location" ? (
          <ContentSection>
            <TextBlock>
              <Title>
                그룹 지도에 추가하고 싶은 <br />
                장소를 입력해주세요.
              </Title>
              <Detail>
                [{userProfile?.nickname || "사용자"}]님이 설정한 역 반경{" "}
                <span style={{ color: "#ff7e74" }}>1.5km</span>안에서 추천이
                가능해요.
              </Detail>
            </TextBlock>
            <StepLocation location={location} setLocation={setLocation} />
          </ContentSection>
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

export default RecommendGroupPlaceLayout;

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

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 15px;
  padding: 24px 20px;
  height: 100%;
  justify-content: flex-start;
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

const ErrorMessage = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #333;
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

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  letter-spacing: -0.2px;
  color: #333;
  margin: 0;
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  margin: 0;
  padding-left: 5px;
`;
