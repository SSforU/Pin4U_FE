import { Outlet } from "react-router-dom";
import StartMakePlace from "./component/page/StartMakePlace.jsx";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AppShell from "./AppShell.jsx";
import GlobalStyle from "./styles/GlobalStyle.js";
import styled from "styled-components";

function App() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
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
  }, []);

  // localStorage에서 첫 방문자 여부 확인
  useEffect(() => {
    const isFirstTimeUser = localStorage.getItem("isFirstTimeUser");
    if (isFirstTimeUser) {
      setIsFirstVisit(false);
    } else {
      setIsFirstVisit(true);
    }
  }, []);

  // 로딩 중일 때
  if (loading) {
    return (
      <AppShell>
        <GlobalStyle />
        <Loading>로딩 중...</Loading>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <GlobalStyle />
      {isFirstVisit ? (
        <StartMakePlace onComplete={() => setIsFirstVisit(false)} />
      ) : (
        <Outlet context={{ userProfile }} />
      )}
    </AppShell>
  );
}

export default App;

//styled-components
const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-family: "Pretendard, sans-serif";
  font-size: 18px;
  color: #585858;
`;
