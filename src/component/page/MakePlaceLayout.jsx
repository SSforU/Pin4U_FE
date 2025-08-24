// #1 고정 사용자 조회 API 호출 + props 전달
// #4 URL 생성(slug) API 연동 (완료 버튼 누르면 링크 생성)
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Outlet,
  useNavigate,
  useMatch,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../ui/ProgressBar";
import Button from "../ui/Button";
import StepNickname from "../step/StepNickname";
import { getResponsiveStyles } from "../../styles/responsive";

const STEPS = ["station", "memo"];
const FLOW_OFFSET = 2; // 이 레이아웃은 2단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function MakePlaceLayout() {
  const navigate = useNavigate();
  const { userProfile } = useOutletContext();
  const [nickname, setNickname] = useState("");
  const [station, setStation] = useState(null);
  const [memo, setMemo] = useState("");
  const [showNickname, setShowNickname] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // localStorage에서 첫 방문자 여부 확인
  useEffect(() => {
    const isFirstTimeUser = localStorage.getItem("isFirstTimeUser");
    if (isFirstTimeUser) {
      setShowNickname(false); // 첫 방문자가 아니면 기존 단계들 보여줌
    } else {
      setShowNickname(true); // 첫 방문자면 닉네임 입력 단계 보여줌
    }
  }, []);

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건
  const isNextDisabled = showNickname
    ? !nickname.trim() || nickname.length < 2 // 닉네임 단계에서는 2자 이상이어야 활성화
    : (stepParam === "station" && !station) ||
      (stepParam === "memo" && !memo.trim());

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/make-place/${STEPS[safe]}`);
  }

  async function goNext() {
    if (showNickname) {
      // 닉네임 단계에서는 닉네임 입력 완료 처리
      handleNicknameComplete(nickname);
    } else if (stepParam === "station") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "memo") {
      // 메모 단계에서 완료 버튼을 누르면 링크 생성 후 complete 페이지로 이동
      try {
        // localStorage에서 데이터 가져오기
        const selectedStation = localStorage.getItem("selectedStation");
        const requestMessage = localStorage.getItem("requestMessage");

        // 백엔드에 링크 생성 요청
        const response = await axios.post(`${BASE_URL}/api/requests`, {
          owner_nickname: userProfile?.nickname,
          station_code: selectedStation,
          request_message: requestMessage,
        });

        if (response.data.result === "success") {
          // 백엔드에서 생성된 slug를 localStorage에 저장
          const { slug } = response.data.data.request;
          localStorage.setItem("createdSlug", slug);

          // CompleteMakePlace로 이동
          navigate("/complete");
        }
      } catch (error) {
        console.error("링크 생성 실패:", error);
        // 에러 처리 (사용자에게 알림 등)
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

  // 닉네임 입력 완료 시 호출되는 함수
  const handleNicknameComplete = (inputNickname) => {
    setNickname(inputNickname);
    localStorage.setItem("isFirstTimeUser", "true"); // 첫 방문자 구분용으로 저장
    setShowNickname(false);
    // station 단계로 이동
    navigate("/make-place/station");
  };

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
        <UserInfoSection>
          <UserTitle>
            {userProfile?.nickname || "사용자"}
            님의 지도 만들기
          </UserTitle>
        </UserInfoSection>

        {/* 닉네임이 없으면 StepNickname을 보여주고, 있으면 기존 단계들을 보여줌 */}
        {showNickname ? (
          <StepNickname nickname={nickname} setNickname={setNickname} />
        ) : (
          <Outlet
            context={{
              nickname,
              setNickname,
              station,
              setStation,
              memo,
              setMemo,
              userProfile,
            }}
          />
        )}
      </Main>

      <Bottom>
        <Button disabled={isNextDisabled} onClick={goNext}>
          {stepParam === "memo" ? "완료" : "다음"}
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

const UserInfoSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const UserTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 1.3;
  color: #000000;
  margin: 0;
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
