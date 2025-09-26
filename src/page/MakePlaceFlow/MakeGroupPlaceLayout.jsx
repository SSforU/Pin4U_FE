// 그룹 지도 생성 레이아웃
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

const GROUP_STEPS = ["group-profile", "station", "memo"];
const TOTAL_STEPS = 5; // 전체 단계 수는 유지 (MakePlaceLayout의 2단계 + Group의 3단계)

function MakeGroupPlaceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useOutletContext();

  // MakePlaceLayout에서 전달받은 데이터
  const { nickname, mapType } = location.state || {};
  const [groupProfile, setGroupProfile] = useState(null);
  const [station, setStation] = useState(null);
  const [memo, setMemo] = useState("");

  // 오류 발생 시 모달 상태
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // useMatch로 현재 step 추출
  const match = useMatch("/make-place/group/:step");
  const stepParam = match?.params?.step || GROUP_STEPS[0];

  const currentIndex = Math.max(0, GROUP_STEPS.indexOf(stepParam));
  const currentStep = currentIndex + 3; // MakePlaceLayout의 2단계 + 현재 인덱스 + 1

  // 다음 버튼 비활성화 조건
  const isNextDisabled =
    (stepParam === "group-profile" &&
      (!groupProfile?.name || groupProfile.name.length < 2)) ||
    (stepParam === "station" && !station) ||
    (stepParam === "memo" && !memo.trim());

  function goToStep(index) {
    const safe = Math.max(0, Math.min(index, GROUP_STEPS.length - 1));
    navigate(`/make-place/group/${GROUP_STEPS[safe]}`);
  }

  async function goNext() {
    if (stepParam === "group-profile") {
      // 이름을 localStorage에도 저장(완료 시 안전하게 읽기 위함)
      if (groupProfile?.name) {
        localStorage.setItem("groupName", groupProfile.name);
      }
      navigate("/make-place/group/station");
    } else if (stepParam === "station") {
      goToStep(currentIndex + 1);
    } else if (stepParam === "memo") {
      // 메모 단계에서 완료 버튼을 누르면 그룹 생성 API 호출
      try {
        // localStorage에 저장된 그룹 이름 우선 사용
        const savedGroupName = (localStorage.getItem("groupName") || "").trim();
        const groupName = savedGroupName || groupProfile?.name || "";

        // 역 이름에서 '역' 접미사 제거
        const rawStationName = station?.name || "";
        const stationName = rawStationName.endsWith("역")
          ? rawStationName.slice(0, -1)
          : rawStationName;

        const body = {
          name: groupName,
          image_url: groupProfile?.image || "",
          station_name: stationName,
          station_line: station?.line || "",
          request_message: memo,
        };

        const groupResponse = await axios.post(`${BASE_URL}/api/groups`, body, {
          withCredentials: true,
        });

        console.log("👉 그룹 생성 응답:", {
          status: groupResponse.status,
          data: groupResponse.data,
          headers: groupResponse.headers,
        });

        if (groupResponse.data?.result === "success") {
          const { slug: groupSlug } = groupResponse.data.data || {};
          if (!groupSlug) throw new Error("group slug missing");
          console.log("👉 group_slug:", groupSlug);

          // ★★★ 그룹 생성 직후 '첫 요청'을 반드시 만든다 ★★★
          const reqBody = {
            station_code: station?.code,
            request_message: memo,
            group_slug: groupSlug,
          };

          const reqRes = await axios.post(`${BASE_URL}/api/requests`, reqBody, {
            withCredentials: true,
          });
          if (reqRes.data?.result !== "success")
            throw new Error("첫 요청 생성 실패");

          localStorage.setItem("createdSlug", groupSlug);
          localStorage.setItem("mapType", "group");

          // 그룹 생성 후 홈페이지 새로고침 트리거 설정
          localStorage.setItem("shouldRefreshHome", "true");

          navigate("/complete");
        } else {
          throw new Error("그룹 생성에 실패했습니다.");
        }
      } catch (error) {
        console.error("그룹 생성 오류 상세:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            withCredentials: error.config?.withCredentials,
          },
        });

        let message = "오류가 발생했습니다.";

        if (error.response?.status === 500) {
          message = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.response?.status === 400) {
          message = "잘못된 요청입니다.";
        } else if (error.response?.status === 401) {
          message = "로그인이 필요합니다.";
        } else if (error.response?.status === 403) {
          message = "권한이 없습니다.";
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

export default MakeGroupPlaceLayout;

// styled-components
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh; /* 모바일 브라우저 UI 제외한 뷰포트 기준 높이 */
  height: 100%;
`;

const Top = styled.div`
  padding: 20px 20px 0px 20px;
`;

const Main = styled.main`
  padding: 20px;
  overflow: auto;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
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
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px calc(16px + env(safe-area-inset-bottom)) 20px;
  background: #ffffff;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
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
