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
import ProgressBar from "../../component/ui/ProgressBar";
import Button from "../../component/ui/Button";
import { getResponsiveStyles } from "../../styles/responsive";

const STEPS = ["nickname", "maptype", "group-profile", "station", "memo"];
const TOTAL_STEPS = 5;

function MakePlaceLayout() {
  const navigate = useNavigate();
  const { userProfile } = useOutletContext();
  const [mapType, setMapType] = useState(null);
  const [groupProfile, setGroupProfile] = useState(null);
  const [nickname, setNickname] = useState("");
  const [station, setStation] = useState(null);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/:step");
  const stepParam = match?.params?.step || STEPS[0];

  const currentIndex = Math.max(0, STEPS.indexOf(stepParam));
  const currentStep = currentIndex + 1;

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "nickname" && (!nickname.trim() || nickname.length < 2)) ||
    (stepParam === "maptype" && !mapType) ||
    (stepParam === "group-profile" &&
      (!groupProfile?.name || groupProfile.name.length < 2)) ||
    (stepParam === "station" && !station) ||
    (stepParam === "memo" && !memo.trim());

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, STEPS.length - 1));
    navigate(`/make-place/${STEPS[safe]}`);
  }

  async function goNext() {
    if (stepParam === "nickname") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "maptype") {
      if (mapType === "self") {
        navigate("/make-place/station");
      } else if (mapType === "group") {
        navigate("/make-place/group-profile");
      }
    } else if (stepParam === "group-profile") {
      navigate("/make-place/station");
    } else if (stepParam === "station") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "memo") {
      // 메모 단계에서 완료 버튼을 누르면 링크 생성 후 complete 페이지로 이동
      try {
        let requestData = {
          owner_nickname: userProfile?.nickname,
          station_code: station?.code,
          request_message: memo,
        };

        // 그룹 지도인 경우 그룹 생성 먼저
        if (mapType === "group") {
          // 1단계: 그룹 생성
          const groupResponse = await axios.post(`${BASE_URL}/api/groups`, {
            group_name: groupProfile?.name,
            group_description: groupProfile?.description,
            owner_nickname: userProfile?.nickname,
          });

          if (groupResponse.data.result === "success") {
            const { group_slug } = groupResponse.data.data.group;
            requestData.group_slug = group_slug;
          } else {
            throw new Error("그룹 생성에 실패했습니다.");
          }
        }

        // 2단계: 요청 생성
        const response = await axios.post(
          `${BASE_URL}/api/requests`,
          requestData
        );

        if (response.data.result === "success") {
          const { slug } = response.data.data.request;
          localStorage.setItem("createdSlug", slug);
          navigate("/complete");
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
            groupProfile,
            setGroupProfile,
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
