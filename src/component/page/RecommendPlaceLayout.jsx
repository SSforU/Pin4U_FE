// src/component/page/OnboardingLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate, useMatch, useParams } from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import { getResponsiveStyles } from "../../styles/responsive";

const STEPS = ["nickname", "location", "memo"];
const FLOW_OFFSET = 1; // 1단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function RecommendPlaceLayout() {
  const navigate = useNavigate();
  const { mapId } = useParams();
  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState(null);
  const [memo, setMemo] = useState("");

  // useMatch로 현재 step 추출
  const match = useMatch("/shared-map/:mapId/onboarding/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "nickname" && !nickname.trim()) ||
    (stepParam === "location" && !location) ||
    (stepParam === "memo" && !memo.trim());

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/shared-map/${mapId}/onboarding/${STEPS[safe]}`);
  }

  function goNext() {
    if (stepParam === "nickname") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "location") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "memo") {
      handleComplete();
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1);
    } else {
      navigate(`/shared-map/${mapId}`);
    }
  }

  const handleComplete = () => {
    // 참여 완료 처리
    const participationData = {
      mapId,
      nickname,
      location,
      memo,
      participatedAt: new Date().toISOString(),
    };

    // 로컬 스토리지에 저장 (나중에 서버로 전송)
    const existingData = JSON.parse(
      localStorage.getItem(`map_${mapId}`) || "[]"
    );
    existingData.push(participationData);
    localStorage.setItem(`map_${mapId}`, JSON.stringify(existingData));

    console.log("참여 완료:", participationData);
    navigate(`/shared-map/${mapId}/complete`);
  };

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
        <Outlet
          context={{
            nickname,
            setNickname,
            location,
            setLocation,
            memo,
            setMemo,
            mapId,
          }}
        />
      </Main>

      <Bottom>
        <Button disabled={isNextDisabled} onClick={goNext}>
          {stepParam === "memo" ? "참여 완료" : "다음"}
        </Button>
      </Bottom>
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
  padding: 20px;
  overflow: auto;
`;

const PrevButtonContainer = styled.div`
  ${getResponsiveStyles("layout")}
  margin-top: 40px;
  display: flex;
`;

const PrevButtonWrapper = styled.img`
  cursor: pointer;
`;

const Bottom = styled.div`
  padding: 20px;
`;
