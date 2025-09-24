// 지도 유형 선택 레이아웃
import React, { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useMatch,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../../component/ui/ProgressBar.jsx";
import Button from "../../component/ui/Button.jsx";
import { getResponsiveStyles } from "../../styles/responsive.js";

const STEPS = ["nickname", "maptype"];
const TOTAL_STEPS = 4;

function MakePlaceLayout() {
  const navigate = useNavigate();
  const { userProfile } = useOutletContext();
  const [mapType, setMapType] = useState(null);
  const [nickname, setNickname] = useState("");

  // 로그인 프로필 닉네임으로 초기화 (localStorage 미사용)
  useEffect(() => {
    if (!nickname && userProfile?.nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile, nickname]);

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + 1;

  // 로그인 시 닉네임 스텝 생략: 프로필 닉네임으로 설정 후 maptype으로 이동
  useEffect(() => {
    if (stepParam === "nickname" && userProfile?.nickname) {
      if (!nickname) {
        setNickname(userProfile.nickname);
      }
      navigate("/make-place/maptype", { replace: true });
    }
  }, [stepParam, userProfile, nickname, navigate]);

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "nickname" &&
      !userProfile?.nickname &&
      (!nickname.trim() || nickname.length < 2)) ||
    (stepParam === "maptype" && !mapType);

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/make-place/${STEPS[safe]}`);
  }

  function goNext() {
    if (stepParam === "nickname") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "maptype") {
      if (mapType === "self") {
        navigate("/make-place/personal/station", {
          state: { nickname, mapType },
        });
      } else if (mapType === "group") {
        navigate("/make-place/group/group-profile", {
          state: { nickname, mapType },
        });
      }
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
            nickname,
            setNickname,
            mapType,
            setMapType,
            userProfile,
          }}
        />
      </Main>

      <Bottom>
        <Button disabled={isNextDisabled} onClick={goNext}>
          다음
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
  ${getResponsiveStyles("layout")}
  margin-top: 40px;
  display: flex;
`;

const PrevButtonWraaper = styled.img`
  cursor: pointer;
`;

const Bottom = styled.div`
  padding: 20px;
`;
