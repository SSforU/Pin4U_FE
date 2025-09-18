import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AppShell from "./AppShell.jsx";
import GlobalStyle from "./styles/GlobalStyle.js";
import LoadingSpinner from "./component/ui/LoadingSpinner";
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
        const response = await axios.get(`${BASE_URL}/api/user/1`);

        if (response.data.result === "success") {
          setUserProfile(response.data.data.user);
          // localStorage에도 저장 (백업용)
          localStorage.setItem(
            "userProfile",
            JSON.stringify(response.data.data.user)
          );
        }
      } catch (error) {
        console.error("사용자 프로필 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
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
      <Outlet context={{ userProfile }} />
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
