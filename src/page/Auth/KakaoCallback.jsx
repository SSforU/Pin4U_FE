import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import LoadingSpinner from "../../component/ui/LoadingSpinner.jsx";
import axios from "axios";

function KakaoCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("카카오 로그인 처리 중...");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const handleKakaoCallback = async () => {
      try {
        // URL에서 인증 코드 추출
        const code = searchParams.get("code");
        const error = searchParams.get("error");

        if (error) {
          throw new Error("카카오 로그인에 실패했습니다.");
        }

        if (!code) {
          throw new Error("인증 코드를 받지 못했습니다.");
        }

        setMessage("로그인 정보를 확인하는 중...");

        // 백엔드에 인증 코드 전송하여 토큰 교환
        const response = await axios.post(`${BASE_URL}/api/auth/kakao`, {
          code: code,
        });

        if (response.data.result === "success") {
          // 로그인 성공 시 사용자 정보 저장
          const userData = response.data.data;
          localStorage.setItem("userProfile", JSON.stringify(userData));

          setStatus("success");
          setMessage("로그인 성공! 잠시 후 페이지로 이동합니다...");

          // localStorage에서 출발점 정보 읽어오기
          const from = localStorage.getItem("kakaoLoginFrom");
          const redirectPath = getRedirectPath(from);

          // 출발점 정보 삭제
          localStorage.removeItem("kakaoLoginFrom");

          // 2초 후 해당 페이지로 이동
          setTimeout(() => {
            navigate(redirectPath);
          }, 2000);
        } else {
          throw new Error(
            response.data.message || "로그인 처리에 실패했습니다."
          );
        }
      } catch (error) {
        console.error("카카오 로그인 에러:", error);
        setStatus("error");
        setMessage(error.message || "로그인 중 오류가 발생했습니다.");

        // 3초 후 메인 페이지로 이동
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    // 출발점에 따른 리다이렉트 경로 결정
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
