import React, { useState } from "react"; // useState 추가
import { Outlet, useNavigate, useMatch } from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import { getResponsiveStyles } from "../../styles/responsive";

const STEPS = ["station", "memo"];
const FLOW_OFFSET = 2; // 이 레이아웃은 2단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function MakePlaceLayout() {
  const navigate = useNavigate();
  const [station, setStation] = useState(null); // 역 선택 정보를 담을 state

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const isLast = currentIndex === STEPS.length - 1;

  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건 추가
  const isNextDisabled = stepParam === "station" && !station;

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/make-place/${STEPS[safe]}`);
  }

  function goNext() {
    if (!isLast) {
      goToStep(currentIndex + 1);
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1);
    } else {
      navigate("/");
    }
  }

  return (
    <Wrapper>
      <Top>
        <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <PrevButtonContainer>
          <PrevButtonWraaper
            src="/PrevButton.png"
            alt="뒤로가기"
            onClick={goPrev}
          />
        </PrevButtonContainer>
      </Top>

      <Main>
        <Outlet
          context={{
            // station과 setStation을 context로 전달
            station,
            setStation,
            currentStep,
            totalSteps: TOTAL_STEPS,
            currentIndex,
            goNext,
            goPrev,
            isLast,
          }}
        />
      </Main>

      <Bottom>
        {/* disabled 조건에 isNextDisabled 추가 */}
        <Button disabled={isNextDisabled || isLast} onClick={goNext}>
          {isLast ? "완료" : "다음"}
        </Button>
      </Bottom>
    </Wrapper>
  );
}

export default MakePlaceLayout;

// styled-components
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
  ${getResponsiveStyles("progress")}
  margin-top: 40px;
  display: flex;
`;

const PrevButtonWraaper = styled.img`
  cursor: pointer;
`;

const Bottom = styled.div`
  padding: 20px;
`;
