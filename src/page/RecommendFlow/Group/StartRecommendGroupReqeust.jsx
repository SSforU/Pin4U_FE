// 그룹 지도용 추천 시작 페이지
// 링크로 접속한 사용자가 station과 memo 정보를 조회
// #7 A-지도화면 API 연동
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../../../styles/responsive.js";
import Button from "../../../component/ui/Button.jsx";
import axios from "axios";

function StartRecommendGroupRequest() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { userProfile } = useOutletContext(); // null 가능
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [groupInfo, setGroupInfo] = useState({ name: "", image_url: "" });

  const [isRequested, setIsRequested] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [locationData, setLocationData] = useState({ station: "", memo: "" });

  const pollTimerRef = useRef(null);

  // 1) 그룹 정보 조회 (비인증)
  useEffect(() => {
    const fetchGroupInfo = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/groups/${slug}/map`, {
          withCredentials: true,
        });
        console.log("그룹 맵 API 응답:", res.data);

        const data = res?.data?.data;
        // group 객체에서 그룹 정보 추출
        setGroupInfo({
          name: data?.group?.name || "그룹",
          image_url: data?.group?.image_url || "/Pin4U_Logo.png",
        });
      } catch (error) {
        console.error("그룹 정보 조회 실패:", error);
        setGroupInfo({ name: "그룹", image_url: "/Pin4U_Logo.png" });
      }
    };
    if (slug) fetchGroupInfo();
  }, [slug, BASE_URL]);

  // 2) 내 멤버십 상태 확인 → 승인된 경우에만 map 조회
  useEffect(() => {
    const fetchStatusThenMaybeMap = async () => {
      setIsLoading(true);
      try {
        // 쿠키 상태 확인
        console.log("API 호출 전 쿠키 상태:", document.cookie);
        console.log("사용자 프로필 상태:", userProfile);

        const res = await axios.get(
          `${BASE_URL}/api/groups/${slug}/members/me/status`,
          { withCredentials: true }
        );
        const status = res?.data?.data?.status; // "none"|"pending"|"approved"

        console.log("멤버십 상태:", status);

        setIsRequested(status === "pending" || status === "approved");
        setIsApproved(status === "approved");

        if (status === "approved") {
          // 3) 승인된 경우에만 /map 호출
          console.log("승인된 멤버 - 지도 데이터 조회 중...");
          const mapRes = await axios.get(`${BASE_URL}/api/groups/${slug}/map`, {
            withCredentials: true,
          });

          console.log("/api/groups/:slug/map response:", mapRes?.data);

          const { station, requestMessage } = mapRes?.data?.data || {};
          setLocationData({
            station: station?.name || "",
            memo: requestMessage || "",
          });
        } else {
          // 승인되지 않은 경우 기본값 설정
          setLocationData({
            station: "승인 후 노출",
            memo: "승인 후 노출",
          });
        }
      } catch (err) {
        console.error("멤버십 상태 조회 실패:", err);

        // 401: 로그인 필요
        if (err?.response?.status === 401) {
          console.warn("로그인 필요");
          setLocationData({
            station: "로그인 후 확인 가능",
            memo: "로그인이 필요합니다",
          });
        }
        // 403: 오너 승인 필요 → isApproved=false 유지
        else if (err?.response?.status === 403) {
          console.warn("오너 승인 필요");
          setLocationData({
            station: "승인 후 노출",
            memo: "그룹 멤버 승인이 필요합니다",
          });
        }
        // 404: 그룹 없음
        else if (err?.response?.status === 404) {
          console.error("그룹을 찾을 수 없음");
          setLocationData({
            station: "그룹을 찾을 수 없습니다",
            memo: "유효하지 않은 그룹입니다",
          });
        } else {
          setLocationData({
            station: "정보를 불러올 수 없습니다",
            memo: "정보를 불러올 수 없습니다",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) fetchStatusThenMaybeMap();

    // 컴포넌트 언마운트 시 폴링 정리
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [slug, BASE_URL, userProfile]);

  // 3) 멤버 요청 함수 (API 연동)
  const handleRequest = async () => {
    if (isRequested) return;

    // 로그인 상태 확인
    if (!userProfile || !userProfile.id) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      // 로그인 페이지로 리다이렉트
      window.location.href = `/shared-map/group/${slug}/login`;
      return;
    }

    try {
      setIsLoading(true);

      // 디버깅 정보 추가
      console.log("그룹 가입 요청 디버깅:", {
        userProfile,
        slug,
        BASE_URL,
        로그인상태: !!userProfile,
        쿠키확인: document.cookie,
      });

      // user_id 제거 - 백엔드에서 쿠키로 식별
      const body = { action: "request" };

      const res = await axios.post(
        `${BASE_URL}/api/groups/${slug}/members`,
        body,
        { withCredentials: true }
      );

      const apiResult = res?.data?.result;

      if (apiResult === "success") {
        setIsRequested(true);
        setRequestSuccess(true);

        // 성공 메시지 표시
        setTimeout(() => setRequestSuccess(false), 2000);

        // 4) 승인 폴링 (최대 60초, 3초 간격)
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        let elapsed = 0;

        console.log("승인 상태 폴링 시작...");

        pollTimerRef.current = setInterval(async () => {
          elapsed += 3000;
          try {
            const statusRes = await axios.get(
              `${BASE_URL}/api/groups/${slug}/members/me/status`,
              { withCredentials: true }
            );
            const status = statusRes?.data?.data?.status;

            console.log(`폴링 ${elapsed / 1000}초: 상태 = ${status}`);

            if (status === "approved") {
              console.log("승인 완료! 지도 데이터 로딩...");
              setIsApproved(true);
              clearInterval(pollTimerRef.current);

              // 승인됐으니 /map 로딩해서 정보 채우기
              const mapRes = await axios.get(
                `${BASE_URL}/api/groups/${slug}/map`,
                { withCredentials: true }
              );
              const { station, requestMessage } = mapRes?.data?.data || {};
              setLocationData({
                station: station?.name || "",
                memo: requestMessage || "",
              });
            }
          } catch (e) {
            // 401/403 등은 무시하고 계속 폴링
            console.log("폴링 중 에러 (무시):", e?.response?.status);
          }

          if (elapsed >= 60000) {
            console.log("폴링 시간 초과 (60초)");
            clearInterval(pollTimerRef.current);
          }
        }, 3000);
      } else {
        console.error("멤버 요청 실패:", res?.data?.error);
        alert("멤버 요청에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("멤버 요청 중 오류:", error);

      if (error?.response?.status === 401) {
        alert("로그인이 필요합니다.");
        window.location.href = `/shared-map/group/${slug}/login`;
      } else if (error?.response?.status === 404) {
        alert("그룹을 찾을 수 없습니다.");
      } else {
        alert("멤버 요청 중 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 5) 장소 추천 함수: 승인된 경우에만
  const handleRecommend = () => {
    if (isApproved) {
      navigate(`/shared-map/group/${slug}/onboarding`);
    }
  };

  return (
    <Wrapper>
      <Main>
        <ImageContainer>
          <Image
            src={groupInfo.image_url || "/Pin4U_Logo.png"}
            alt="그룹 프로필"
          />
        </ImageContainer>
        <Content>
          <Title>
            [{groupInfo.name || "그룹"}]을 위한
            <br />
            장소를 추천해주세요!
          </Title>
        </Content>

        {/* 위치와 메모 정보 추가 */}
        <InfoSection>
          {/* 위치 정보 */}
          <InfoItem>
            <InfoIcon src="/Pin.png" alt="위치" />
            <InfoText>
              {isLoading
                ? "로딩 중..."
                : isApproved
                ? locationData.station || "역 정보 없음"
                : locationData.station || "승인 후 노출"}
            </InfoText>
          </InfoItem>

          {/* 메모 정보 */}
          <InfoItem>
            <InfoIcon src="/Recommend_Memo.png" alt="메모" />
            <InfoText>
              {isLoading
                ? "로딩 중..."
                : isApproved
                ? locationData.memo || "메모 없음"
                : locationData.memo || "승인 후 노출"}
            </InfoText>
          </InfoItem>
        </InfoSection>
      </Main>

      <Bottom>
        <RequestButtonSection>
          <RequestButton
            onClick={handleRequest}
            disabled={isRequested}
            $isRequested={isRequested}
          >
            {isRequested ? (
              <>
                <ButtonCheckIcon src="/LinkCopyComplete.png" alt="체크" />
                멤버 요청 완료 (승인 대기)
              </>
            ) : (
              "멤버 요청하기"
            )}
          </RequestButton>
          <RecommendButton
            onClick={handleRecommend}
            disabled={!isApproved}
            $isApproved={isApproved}
          >
            장소 추천하러 가기
          </RecommendButton>
        </RequestButtonSection>
        {requestSuccess && (
          // 멤버 요청 버튼 클릭 시 나오는 팝업
          <RequestSuccessPopup>
            <RequestSuccessContent>
              <RequestSuccessText>
                멤버 요청이 완료되었어요!
                <br />
                오너가 승인하면 장소 추천이 가능해요.
              </RequestSuccessText>
            </RequestSuccessContent>
          </RequestSuccessPopup>
        )}
        <LoginSuccessText>로그인이 완료되었어요!</LoginSuccessText>
      </Bottom>
    </Wrapper>
  );
}
export default StartRecommendGroupRequest;

// styled-components는 기존과 동일하게 유지
const Wrapper = styled.div`
  ${getResponsiveStyles("layout")}
  display: grid;
  grid-template-rows: 1fr auto;
  height: 100%;
`;

// 버튼쪽 영역
const Bottom = styled.div`
  width: 100%;
  padding: 20px;
  margin-bottom: 20px;
  /* flex-wrap: wrap; */

  @media (max-width: 768px) {
    padding: 16px 10px;
    margin-bottom: 16px;
  }

  @media (max-width: 480px) {
    padding: 14px 5px;
    margin-bottom: 14px;
  }
`;

const Main = styled.main`
  padding: 20px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
  text-align: center;
  flex: 1;
  min-height: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  max-width: 400px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 24px;
  line-height: 1.3;
  color: #000000;
  margin: 0;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 120px;
  height: 120px;
  background-color: #f7f7f7;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    max-width: 250px;
  }

  @media (max-width: 480px) {
    max-width: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 300px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  width: 100%;
`;

const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
`;

const InfoText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 1.4;
  color: #585858;
  margin: 0;
  text-align: left;
  word-break: keep-all;

  @media (max-width: 768px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const RequestButtonSection = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 20px;
  justify-content: center;
  /* flex-wrap: wrap; */

  @media (max-width: 768px) {
    gap: 16px;
    padding: 0 10px;
  }

  @media (max-width: 480px) {
    gap: 14px;
    padding: 0 5px;
  }
`;

const RequestButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
  background-color: ${(props) => (props.$isRequested ? "#FFD5D2" : "#ff7e74")};
  color: ${(props) => (props.$isRequested ? "#FFFFFF" : "#ffffff")};
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.$isRequested ? "not-allowed" : "pointer")};
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  height: 50px;
  min-width: 190px;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${(props) => (props.$isRequested ? "none" : "translateY(-1px)")};
  }
  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }
  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 200px;
    padding: 11px 16px;
  }

  @media (max-width: 1024px) {
    min-width: 180px;
    padding: 11px 14px;
  }

  @media (max-width: 768px) {
    min-width: 160px;
    padding: 11px 12px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    min-width: 140px;
    padding: 11px 10px;
    font-size: 14px;
    height: 48px;
  }
`;

// 장소 추천하러 가기 버튼
const RecommendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 20px;
  background-color: ${(props) => (props.$isApproved ? "#ff7e74" : "#FFD5D2")};
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: ${(props) => (props.$isApproved ? "pointer" : "not-allowed")};
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  line-height: 18px;
  transition: all 0.2s ease;
  height: 50px;
  min-width: 100px;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => (props.$isApproved ? "#ff665c" : "#f5f5f5")};
  }

  /* 반응형 버튼 너비 */
  @media (max-width: 1440px) {
    min-width: 90px;
    padding: 11px 16px;
  }

  @media (max-width: 1024px) {
    min-width: 80px;
    padding: 11px 14px;
  }

  @media (max-width: 768px) {
    min-width: 70px;
    padding: 11px 12px;
    font-size: 15px;
  }

  @media (max-width: 480px) {
    min-width: 60px;
    padding: 11px 10px;
    font-size: 14px;
    height: 48px;
  }
`;

// 멤버 요청 성공 팝업
const RequestSuccessPopup = styled.div`
  position: fixed;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffefed;
  border-radius: 16px;
  box-shadow: 0 2px 13px rgba(0, 0, 0, 0.2);
  padding: 24px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  min-width: 300px;
  max-height: 80px;
  justify-content: center;
  animation: popupFadeIn 0.4s ease-out;

  @keyframes popupFadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @media (max-width: 480px) {
    min-width: 280px;
    padding: 20px 24px;
    margin: 0 20px;
  }
`;

const RequestSuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const ButtonCheckIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 6px;
  filter: brightness(0) invert(1);
`;

const RequestSuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: #585858;
  margin: 0;
  text-align: left;

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const LoginSuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: #838383;
  text-align: center;
`;
