import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import LoadingSpinner from "../../component/ui/LoadingSpinner.jsx";
import axios from "axios";
import { CLIENT_ID, REDIRECT_URI } from "../../utils/oauth.js";

function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("카카오 로그인 처리 중...");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error || !code) {
          throw new Error(error || "인증 코드를 받지 못했습니다.");
        }

        setMessage("로그인 정보를 확인하는 중..."); // 1. 카카오 서버에 인가 코드(code)를 보내 accessToken 받기
        // [변경 1 - 중요]
        // B안: 프론트에서 인가코드(code)를 access_token으로 교환
        // 백엔드 변경 없이 스웨거/컨트롤러 스펙({ accessToken })에 맞추기 위함
        const tokenResp = await axios.post(
          "https://kauth.kakao.com/oauth/token",
          new URLSearchParams({
            grant_type: "authorization_code",
            client_id: CLIENT_ID, // TODO: 실제 REST API 키
            redirect_uri: REDIRECT_URI, // 현재 사용 중인 REDIRECT_URI와 동일해야 함
            code,
            // client_secret: "<선택: 있으면 추가>"
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        );

        const accessToken = tokenResp.data?.access_token;
        if (!accessToken) {
          throw new Error("카카오 access_token을 받지 못했습니다.");
        }

        setMessage("로그인 정보를 확인하는 중...");

        // [변경 2 - 중요]
        // 교환한 accessToken을 백엔드에 전달(스웨거/백엔드와 일치)
        const response = await axios.post(
          `${BASE_URL}/api/auth/kakao/login`,
          { accessToken }, // ← 기존 { code }에서 수정
          { withCredentials: true }
        );

        // [변경 3 - 중요]
        // 백엔드 응답이 ApiResponse 래퍼가 아닌 LoginResponse 원형({ user, isNew })임
        // 기존 result === "success" 검사 → user 존재 여부로 판정
        const data = response.data;
        // 백엔드가 { user, isNew } 또는 사용자 원형을 반환할 수 있으므로 모두 대응
        const user = data && (data.user ? data.user : data);
        if (user && user.id) {
          // 로그인 성공 시 사용자 정보 저장(원형 사용자 객체만 저장)
          localStorage.setItem("userProfile", JSON.stringify(user));

          setStatus("success");
          setMessage("로그인 성공! 잠시 후 페이지로 이동합니다...");

          const from = localStorage.getItem("kakaoLoginFrom");
          const redirectPath = getRedirectPath(from);
          localStorage.removeItem("kakaoLoginFrom");

          setTimeout(() => {
            navigate(redirectPath);
          }, 1500);
        } else {
          // 응답 구조 불일치/누락 시 실패 처리
          throw new Error("로그인 처리에 실패했습니다.");
        }
      } catch (error) {
        console.error("카카오 로그인 에러:", error);
        console.error("에러 응답 데이터:", error.response?.data);

        setStatus("error");
        setMessage(
          error.response?.data?.error?.message ||
            error.message ||
            "로그인 중 오류가 발생했습니다."
        );

        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    // 출발점에 따른 리다이렉트 경로 결정
    // StartMakePlaceSplash, StartRecommendLogin에서 로그인 로직이 있어 구분 위해
    const getRedirectPath = (from) => {
      if (!from) return "/"; // 기본값은 메인 페이지

      if (from === "make-place") {
        return "/make-place";
      } else if (from.startsWith("group-request-")) {
        const slug = from.replace("group-request-", "");
        return `/shared-map/group/${slug}/request`;
      }

      return "/"; // 알 수 없는 출발점은 메인 페이지로
    };

    handleKakaoCallback();
  }, [searchParams, navigate, BASE_URL]);

  return (
    <Wrapper>
      <ContentContainer>
        <LogoContainer>
          <Logo src="/Pin4U_Logo.png" alt="Pin4U 로고" />
        </LogoContainer>

        <StatusContainer>
          <LoadingSpinner size="large" text={message} />

          {status === "success" && (
            <SuccessMessage>로그인이 완료되었습니다!</SuccessMessage>
          )}

          {status === "error" && (
            <ErrorMessage>로그인에 실패했습니다.</ErrorMessage>
          )}
        </StatusContainer>
      </ContentContainer>
    </Wrapper>
  );
}

export default KakaoCallback;

// styled-components
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  text-align: center;
  padding: 20px;
`;

const LogoContainer = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const SuccessMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #4caf50;
  margin-top: 10px;
`;

const ErrorMessage = styled.div`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: #f44336;
  margin-top: 10px;
`;
