// #1 고정 사용자 조회 API 호출 (props 전달용)
import React, { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useParams,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import ProgressBar from "../../../component/ui/ProgressBar.jsx";
import Button from "../../../component/ui/Button.jsx";
import StepNickname from "../../../step/StepNickname.jsx";
import StepLocation from "../../../step/StepLocation.jsx";
import { getResponsiveStyles } from "../../../styles/responsive.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const STEPS = ["nickname", "location", "recommend"];
console.log("STEPS 배열:", STEPS);
const FLOW_OFFSET = 1; // 1단계부터 시작
const TOTAL_STEPS = 3; // 전체 단계 수

function RecommendGroupPlaceLayout() {
  console.log(
    "🚀 RecommendGroupPlaceLayout 컴포넌트 렌더링됨 - " +
      new Date().toISOString()
  );
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // App.jsx에서 userProfile 받기

  const [searchParams, _setSearchParams] = useSearchParams();
  // 1) 먼저 쿼리에서 읽음, URL 경로에서 step 추출
  const getStepFromUrl = () => {
    const pathname = window.location.pathname;
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];

    // URL 경로의 마지막 부분이 STEPS에 포함되어 있으면 그것을 사용
    if (STEPS.includes(lastPart)) {
      return lastPart;
    }

    // 그렇지 않으면 로그인 상태에 따라 기본값 결정
    return userProfile?.nickname ? "location" : "nickname";
  };
  const qsStep = searchParams.get("step") ?? getStepFromUrl();
  // 2) 그 다음 상태 초기화
  const [step, setStep] = useState(qsStep);

  const [nickname, setNickname] = useState("");
  const [location, setLocation] = useState(null);

  // location 상태 변경 시 로그 추가
  useEffect(() => {
    console.log("RecommendGroupPlaceLayout: location 상태 변경:", {
      location,
      isArray: Array.isArray(location),
      length: Array.isArray(location) ? location.length : "N/A",
      step,
      isNextDisabled:
        step === "location" &&
        (!location || (Array.isArray(location) && location.length === 0)),
    });
  }, [location, step]);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 3) 주소창의 step이 바뀌면 상태도 맞추기
  useEffect(() => {
    console.log("URL 변경 감지:", {
      qsStep,
      currentStep: step,
      currentPath: window.location.pathname,
    });
    setStep(qsStep);
  }, [qsStep]);

  // 4) 컴포넌트 최초 로드 시에만 로그인 사용자 리다이렉트
  useEffect(() => {
    const currentPath = window.location.pathname;
    const isOnMainPath =
      currentPath.endsWith("/onboarding") ||
      currentPath.endsWith("/onboarding/");

    // 메인 온보딩 경로에 있고, 로그인된 사용자면 location으로 리다이렉트
    if (isOnMainPath && userProfile?.nickname) {
      navigate(`/shared-map/group/${slug}/onboarding/location`, {
        replace: true,
      });
    }
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 로그인된 사용자 닉네임 자동 설정
  useEffect(() => {
    if (userProfile?.nickname && !nickname) {
      setNickname(userProfile.nickname);
    }
  }, [userProfile, nickname]);

  // 신규 회원가입 사용자의 닉네임 서버 저장
  const updateNicknameToServer = async (newNickname) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/me`,
        {
          nickname: newNickname,
        },
        {
          withCredentials: true,
        }
      );

      console.log("닉네임 업데이트 성공:", response.data);

      // userProfile 새로고침을 위해 App.jsx에서 다시 불러오기 트리거
      window.dispatchEvent(new CustomEvent("refreshUserProfile"));
    } catch (error) {
      console.error("닉네임 업데이트 실패:", error);
      alert("닉네임 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 로그인 시 닉네임 스텝 생략: 프로필 닉네임으로 설정 후 location으로 이동
  useEffect(() => {
    console.log("닉네임 스킵 로직 체크:", {
      step,
      userProfileNickname: userProfile?.nickname,
      nickname,
      slug,
    });

    if (step === "nickname" && userProfile?.nickname) {
      console.log("로그인된 사용자 닉네임 스킵 실행");
      navigate(`/shared-map/group/${slug}/onboarding/location`, {
        replace: true,
      });
    }
  }, [step, userProfile?.nickname, nickname, slug, navigate]);

  const currentIndex = Math.max(0, STEPS.indexOf(step));
  const currentStep = currentIndex + FLOW_OFFSET;

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (step === "nickname" &&
      !userProfile?.nickname &&
      (!nickname.trim() || nickname.length < 2)) ||
    (step === "location" &&
      (!location || (Array.isArray(location) && location.length === 0)));

  // 디버깅: 버튼 상태 확인
  useEffect(() => {
    console.log("버튼 상태 디버깅:", {
      step,
      location,
      isNextDisabled,
      locationCheck:
        !location || (Array.isArray(location) && location.length === 0),
      nicknameCheck:
        step === "nickname" &&
        !userProfile?.nickname &&
        (!nickname.trim() || nickname.length < 2),
    });
  }, [step, location, isNextDisabled, userProfile, nickname]);

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    console.log("goToStep 호출:", {
      index,
      safe,
      stepName: STEPS[safe],
      currentPath: window.location.pathname,
    });

    // 현재 경로를 확인하여 적절한 경로로 이동
    const currentPath = window.location.pathname;
    let targetPath;

    if (currentPath.includes("/personal/")) {
      targetPath = `/shared-map/personal/${slug}/onboarding/${STEPS[safe]}`;
    } else if (currentPath.includes("/group/")) {
      targetPath = `/shared-map/group/${slug}/onboarding/${STEPS[safe]}`;
    } else {
      // 기본값 (fallback)
      targetPath = `/shared-map/${slug}/onboarding/${STEPS[safe]}`;
    }

    console.log("네비게이션 경로:", targetPath);
    console.log("현재 경로와 목표 경로 비교:", {
      currentPath,
      targetPath,
      isSame: currentPath === targetPath,
    });

    // 현재 경로와 목표 경로가 다를 때만 네비게이션
    if (currentPath !== targetPath) {
      navigate(targetPath);
    } else {
      console.log("이미 목표 경로에 있어서 네비게이션하지 않음");
    }
  }

  async function goNext() {
    console.log("goNext 함수 호출됨:", { step, currentIndex, location });

    try {
      if (step === "nickname") {
        console.log("닉네임 단계 처리");
        // 신규 회원가입 사용자인 경우 (로그인은 되어있지만 닉네임이 없는 경우)
        if (userProfile?.id && !userProfile?.nickname && nickname.trim()) {
          await updateNicknameToServer(nickname.trim());
        }
        goToStep(currentIndex + 1);
      } else if (step === "location") {
        console.log("장소 단계 처리, 다음 단계로 이동:", currentIndex + 1);
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
        {step === "nickname" ? (
          <StepNickname
            nickname={nickname}
            setNickname={setNickname}
            detailText={`[${
              userProfile?.nickname || "사용자"
            }] 멤버에게 공개돼요.`}
          />
        ) : step === "location" ? (
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

      {step !== "recommend" && (
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
