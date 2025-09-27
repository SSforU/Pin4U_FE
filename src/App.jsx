import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AppShell from "./AppShell.jsx";
import GlobalStyle from "./styles/GlobalStyle.js";
import LoadingSpinner from "./component/ui/LoadingSpinner.jsx";
import styled from "styled-components";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // 고정 사용자(id=1) 프로필 조회
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/me`, {
          withCredentials: true,
        });

        // 스펙: 200이면 사용자 객체 본문, 204이면 본문 없음
        if (response.status === 200 && response.data && response.data.id) {
          setUserProfile(response.data);
          localStorage.setItem("userProfile", JSON.stringify(response.data));
        } else if (response.status === 204) {
          setUserProfile(null);
          localStorage.removeItem("userProfile");
        }
      } catch (error) {
        console.error("사용자 프로필 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();

    // 닉네임 업데이트 후 프로필 새로고침을 위한 이벤트 리스너
    const handleRefreshUserProfile = () => {
      fetchUserProfile();
    };

    window.addEventListener("refreshUserProfile", handleRefreshUserProfile);

    return () => {
      window.removeEventListener(
        "refreshUserProfile",
        handleRefreshUserProfile
      );
    };
  }, [BASE_URL]);

  // 로딩 중일 때
  if (loading) {
    return (
      <AppShell>
        <GlobalStyle />
        <PageContainer>
          <LoadingSpinner size="large" text="사용자 정보를 불러오는 중..." />
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <GlobalStyle />
      <Outlet context={{ userProfile, isUserProfileLoading: loading }} />
    </AppShell>
  );
}

export default App;

//styled-components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
`;
