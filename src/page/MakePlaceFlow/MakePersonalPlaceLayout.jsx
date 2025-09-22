// 개인 지도 생성 레이아웃
import React, { useState } from "react";
import axios from "axios";
import {
  Outlet,
  useNavigate,
  useMatch,
  useOutletContext,
  useLocation,
} from "react-router-dom";
import styled from "styled-components";
import ProgressBar from "../../component/ui/ProgressBar.jsx";
import Button from "../../component/ui/Button.jsx";
import { getResponsiveStyles } from "../../styles/responsive.js";

const PERSONAL_STEPS = ["station", "memo"];
const TOTAL_STEPS = 4; // 전체 단계 수는 유지 (MakePlaceLayout의 2단계 + Personal의 2단계)

function MakePersonalPlaceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useOutletContext();

  // MakePlaceLayout에서 전달받은 데이터
  const { nickname, mapType } = location.state || {};
  const [station, setStation] = useState(null);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/personal/:step");
  const stepParam = match?.params?.step || PERSONAL_STEPS[0];

  const currentIndex = Math.max(0, PERSONAL_STEPS.indexOf(stepParam));
  const currentStep = currentIndex + 3; // MakePlaceLayout의 2단계 + 현재 인덱스 + 1

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "station" && !station) ||
    (stepParam === "memo" && !memo.trim());

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, PERSONAL_STEPS.length - 1));
    navigate(`/make-place/personal/${PERSONAL_STEPS[safe]}`);
  }

  async function goNext() {
    if (stepParam === "station") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "memo") {
      // 메모 단계에서 완료 버튼을 누르면 링크 생성 후 complete 페이지로 이동
      try {
        const requestData = {
          station_code: station?.code,
          request_message: memo,
        };

        // 요청 생성(API 연동)
        const response = await axios.post(
          `${BASE_URL}/api/requests`,
          requestData,
          { withCredentials: true }
        );

        if (response.data.result === "success") {
          const { slug } = response.data.data.request;
          localStorage.setItem("createdSlug", slug);
          localStorage.setItem("mapType", "personal"); // 개인 지도 타입 저장
          navigate("/complete");
        }
      } catch (error) {
        console.error("오류 발생:", error);

        // 백엔드가 구현되지 않았을 때 임시 slug 생성
        if (error.response?.status === 404 || !error.response) {
          console.log("백엔드가 구현되지 않음. 임시 slug 생성");
          const tempSlug = `temp-personal-${Date.now()}`;
          localStorage.setItem("createdSlug", tempSlug);
          localStorage.setItem("mapType", "personal");
          navigate("/complete");
          return;
        }

        let message = "오류가 발생했습니다.";

        if (error.response?.status === 500) {
          message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.response?.status === 400) {
          message = "잘못된 요청입니다.";
        }

        setErrorMessage(message);
        setShowErrorModal(true);
      }
    }
  }

  function goPrev() {
    if (currentIndex > 0) {
      goToStep(currentIndex - 1);
    } else {
      // 첫 번째 단계에서 뒤로가기 시 MakePlaceLayout으로 돌아가기
      navigate("/make-place/maptype");
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
            mapType,
            station,
            setStation,
            memo,
            setMemo,
            userProfile,
          }}
        />
      </Main>

      <Bottom>
        <Button disabled={isNextDisabled} onClick={goNext}>
          {stepParam === "memo" ? "완료" : "다음"}
        </Button>
      </Bottom>

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

export default MakePersonalPlaceLayout;

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
