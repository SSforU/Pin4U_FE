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
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import StepNickname from "../step/StepNickname";
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

  function goNext() {
    if (stepParam === "nickname") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "location") {
      goToStep(currentIndex + 1);
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
