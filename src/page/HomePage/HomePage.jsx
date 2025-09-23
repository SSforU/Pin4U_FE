import React from "react";
import styled from "styled-components";
import StationList from "./List/StationList.jsx";
import Button from "../../component/ui/Button.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect, useRef } from "react";
import HomeSearchBox from "./Component/HomeSearchBox.jsx";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import GroupList from "./List/GroupList.jsx";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const actionsRef = useRef(null); // 아이콘 영역
  const menuRef = useRef(null); // 드롭다운

  const { userProfile } = useOutletContext();

  // 타이틀에 쓸 표시용 닉네임(저장 성공 전엔 기존 값 유지)
  const [displayNickname, setDisplayNickname] = useState(
    userProfile?.nickname ?? ""
  );

  // 닉네임 편집 시트 상태
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [nicknameInput, setNicknameInput] = useState(
    userProfile?.nickname ?? ""
  );
  const [saving, setSaving] = useState(false);
  const [nickError, setNickError] = useState("");

  const MOCK_ITEMS = [
    {
      slug: "soongsil-univ",
      station_name: "숭실대입구",
      station_line: "7호선",
      road_address_name: "서울 동작구 상도로 369",
      recommend_count: 12,
      created_at: "2025-09-15T10:12:00Z",
    },
    {
      slug: "yongsan",
      station_name: "용산",
      station_line: "1·경의중앙호선",
      road_address_name: "서울 용산구 한강대로 405",
      recommend_count: 8,
      created_at: "2025-09-12T08:22:10Z",
    },
    {
      slug: "seoul-station",
      station_name: "서울",
      station_line: "1·4·공항철도호선",
      road_address_name: "서울 중구 한강대로 405",
      recommend_count: 31,
      created_at: "2025-09-10T02:40:00Z",
    },
    {
      slug: "gangnam",
      station_name: "강남",
      station_line: "2·신분당호선",
      road_address_name: "서울 강남구 강남대로 396",
      recommend_count: 44,
      created_at: "2025-09-09T11:05:00Z",
    },
    {
      slug: "hongdae",
      station_name: "홍대입구",
      station_line: "2·경의중앙·공항철도호선",
      road_address_name: "서울 마포구 양화로 160",
      recommend_count: 27,
      created_at: "2025-09-08T14:33:20Z",
    },
  ];

  const MOCK_GROUPS = [
    {
      id: "g1",
      slug: "group-1",
      name: "일이삼사",
      thumbnail: "", // 이미지 없으면 이니셜 fallback
      stationName: "홍대입구역",
      lines: [7],
    },
    {
      id: "g2",
      slug: "group-2",
      name: "친구들 모임",
      thumbnail: "",
      stationName: "강남역",
      lines: [2], // 문자열도 들어오면 그대로 뱃지에 표시됨
    },
    {
      id: "g3",
      slug: "group-3",
      name: "동아리",
      thumbnail: "",
      stationName: "홍대입구역",
      lines: [2],
    },
    {
      id: "g1",
      slug: "group-4",
      name: "그룹명",
      thumbnail: "", // 이미지 없으면 이니셜 fallback
      stationName: "숭실대입구역",
      lines: [7],
    },
    {
      id: "g2",
      slug: "group-5",
      name: "친구들 모임",
      thumbnail: "",
      stationName: "강남역",
      lines: [2], // 문자열도 들어오면 그대로 뱃지에 표시됨
    },
  ];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");

      try {
        // const { data } = await axios.get(`${BASE_URL}/api/requests`, {
        //   params: {},
        // });

        // const items = data?.data?.items ?? [];
        const items = MOCK_ITEMS; // TODO: 나중에 주석 해제

        const mapped = items.map((x, i) => {
          const lines =
            typeof x.station_line === "string"
              ? x.station_line
                  .replace(/호선/g, "")
                  .split("·")
                  .map((s) => Number(s.trim()))
                  .filter(Boolean)
              : [];

          return {
            id: String(i + 1),
            slug: x.slug,
            name: `${x.station_name}역`,
            lines,
            address: x.road_address_name ?? "",
            recommended_counts: Number(x.recommend_count ?? 0),
            created_at: x.created_at,
          };
        });

        setStations(mapped);
      } catch (e) {
        setErrorMsg(
          e?.response?.data?.error?.message ||
            e?.message ||
            "불러오기에 실패했어요."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddMapClick = () => {
    navigate(`/make-place`);
  };

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!isMenuOpen) return;
      const inActions = actionsRef.current?.contains(e.target);
      const inMenu = menuRef.current?.contains(e.target);
      if (!inActions && !inMenu) setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isMenuOpen]);

  const handleSettingsClick = () => setIsMenuOpen((v) => !v);
  const handleBellClick = () => {
    // TODO: 알림 페이지로 이동하거나 드로어 열기
    navigate("/notifications");
  };

  // “닉네임 변경” 메뉴 클릭 → 시트 열기
  const handleOpenEditNickname = () => {
    setIsMenuOpen(false);
    setNicknameInput(userProfile?.nickname ?? "");
    setNickError("");
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setNickError("");
    setNicknameInput(userProfile?.nickname ?? "");
  };

  const validateNickname = (v) => {
    // 2~16자 제약(한글/영문/숫자/공백 허용 예시)
    if (!v || v.trim().length < 2) return "닉네임은 2자 이상이어야 해요.";
    if (v.trim().length > 16) return "닉네임은 16자 이하여야 해요.";
    return "";
  };

  const saveNickname = async () => {
    const err = validateNickname(nicknameInput);
    if (err) {
      setNickError(err);
      return;
    }
    setSaving(true);
    try {
      // 쿠키(uid) 인증 필요하므로 withCredentials 권장
      await axios.patch(
        `${BASE_URL}/api/me`,
        { nickname: nicknameInput.trim() },
        { withCredentials: true }
      );
      // 화면 표시용 닉네임 갱신
      setDisplayNickname(nicknameInput.trim());
      setIsEditOpen(false);
    } catch (e) {
      setNickError(
        e?.response?.data?.error?.message ||
          e?.message ||
          "닉네임을 저장하지 못했어요."
      );
    } finally {
      setSaving(false);
    }
  };

  const handlePlan = () => {
    setIsMenuOpen(false);
    navigate("/billing"); // 요금제 관리 라우트 예시
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsLogoutOpen(true);
  };

  const cancelLogout = () => setIsLogoutOpen(false);
  const confirmLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      // 쿠키(uid) 기반 인증이므로 반드시 withCredentials:true
      await axios.post(`${BASE_URL}/api/auth/logout`, null, {
        withCredentials: true,
      });

      // 필요하다면 사용자 프로필/전역 상태도 초기화(예시)
      // setUserProfile?.(null);

      setIsLogoutOpen(false);
      navigate("/login", { replace: true });
    } catch (e) {
      // 401/403이면 이미 로그아웃 상태로 간주하고 그냥 진행해도 괜찮음
      const status = e?.response?.status;
      if (status === 401 || status === 403) {
        setIsLogoutOpen(false);
        navigate("/login", { replace: true });
        return;
      }
      alert(
        e?.response?.data?.error?.message ||
          e?.message ||
          "로그아웃에 실패했어요."
      );
    } finally {
      setLoggingOut(false);
    }
    navigate("/logout-splash", { replace: true });
  };

  // ESC로 닫기
  useEffect(() => {
    if (!isLogoutOpen) return;
    const onKeyDown = (e) => e.key === "Escape" && cancelLogout();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLogoutOpen]);

  const filteredStations = useMemo(() => {
    const q = searchTerm.trim();
    if (!q) return stations;
    return stations.filter((s) => s.name.includes(q));
  }, [searchTerm, stations]);

  return (
    <PageContainer>
      <TitleBox>
        <PageTitle>
          {displayNickname || userProfile?.nickname} 님의 지도
        </PageTitle>
        <RightActions ref={actionsRef}>
          <IconButton aria-label="알림" onClick={handleBellClick} title="알림">
            <img src="/Bell.svg" alt="알림" width={24} height={24} />
          </IconButton>

          <IconButton
            aria-label="설정"
            onClick={handleSettingsClick}
            title="설정"
          >
            <img src="/Settings.svg" alt="설정" width={24} height={24} />
          </IconButton>

          {isMenuOpen && (
            <Menu ref={menuRef} role="menu" aria-label="설정 메뉴">
              <MenuItem onClick={handleOpenEditNickname}>닉네임 변경</MenuItem>
              <MenuItem onClick={handlePlan}>요금제 관리</MenuItem>
              <MenuItem danger onClick={handleLogout}>
                로그아웃
              </MenuItem>
            </Menu>
          )}
        </RightActions>
      </TitleBox>

      <ContentContainer>
        <HomeSearchBox onSearch={setSearchTerm} />
        {!loading && !errorMsg && <StationList stations={filteredStations} />}
      </ContentContainer>

      <GroupList
        title="그룹 지도"
        groups={MOCK_GROUPS}
        onItemClick={(g) => navigate(`/group-place-map/${g.slug}`)}
      />
      <ButtonContainer>
        <Button onClick={handleAddMapClick}>나만의 지도 추가하기</Button>
      </ButtonContainer>
      {isEditOpen && (
        <Dimmed onClick={closeEdit}>
          <TopSheet
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <NameRow>
              <NameInput
                autoFocus
                value={nicknameInput}
                onChange={(e) => {
                  setNicknameInput(e.target.value);
                  if (nickError) setNickError("");
                }}
                placeholder="닉네임 (2~16자)"
                maxLength={24}
                spellCheck={false}
                autoComplete="off"
                aria-label="닉네임 입력"
              />

              <TextButton type="button" onClick={closeEdit}>
                취소
              </TextButton>
              <PrimaryTextButton
                type="button"
                onClick={saveNickname}
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장"}
              </PrimaryTextButton>
            </NameRow>

            {nickError && <ErrorText>{nickError}</ErrorText>}
          </TopSheet>
        </Dimmed>
      )}
      {isLogoutOpen && (
        <ConfirmBackdrop onClick={cancelLogout}>
          <ConfirmCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            onClick={(e) => e.stopPropagation()}
          >
            <ConfirmTitle id="logout-title">로그아웃 하시겠어요?</ConfirmTitle>
            <ConfirmActions>
              <ConfirmButton type="button" onClick={cancelLogout}>
                아니오
              </ConfirmButton>
              <ConfirmPrimary
                type="button"
                onClick={confirmLogout}
                disabled={loggingOut}
              >
                {loggingOut ? "로그아웃 중..." : "네"}
              </ConfirmPrimary>
            </ConfirmActions>
          </ConfirmCard>
        </ConfirmBackdrop>
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  background: #fff;
`;

const TitleBox = styled.div`
  width: 100%;
  padding: 16px 35px;
  height: calc(100dvh * 90 / 844);
  border-bottom: 1px solid #ffffff;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
  color: #000;
  margin: 0;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative; /* 드롭다운 기준 */
`;

const IconButton = styled.button`
  all: unset;
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.15s ease;
  &:hover {
    background: #f2f2f2;
  }
  &:active {
    background: #e9e9e9;
  }
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 0;
  min-width: 160px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  padding: 6px;
  display: grid;
  gap: 4px;
  z-index: 10;
`;

const MenuItem = styled.button`
  all: unset;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: ${(p) => (p.danger ? "#d64545" : "#222")};
  cursor: pointer;
  &:hover {
    background: #f7f7f7;
  }
`;

const Dimmed = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const TopSheet = styled.div`
  position: static;
  top: 0;
  background: #fff;
  z-index: 60;
  padding: 44px 28px 5px 30px;
  width: 100%;
  box-sizing: border-box;
`;

/* 한 줄: [이름 입력칸] [취소] [저장] */
const NameRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  column-gap: 16px;
`;

const NameInput = styled.input`
  min-width: 0;
  width: 100%;
  font-size: 24px; /* 시안처럼 굵고 크게 */
  font-weight: 700;
  line-height: 1.2;
  border: none;
  outline: none;
  padding: 6px 2px 10px;
  border-bottom: 1px solid #eee;
  &:focus {
    border-bottom-color: #ddd;
  }
`;

const TextButton = styled.button`
  all: unset;
  cursor: pointer;
  padding: 6px 4px;
  color: #666;
  font-size: 15px;
`;

const PrimaryTextButton = styled(TextButton)`
  color: #e57368; /* 코랄 톤 */
  font-weight: 700;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
`;

const ErrorText = styled.p`
  margin: 6px 2px 0;
  font-size: 13px;
  color: #d64545;
`;

const ConfirmBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100; /* 닉네임 시트보다 위 */
`;

const ConfirmCard = styled.div`
  width: 84%;
  max-width: 360px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  padding: 22px 20px 12px;
  text-align: center;
`;

const ConfirmTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111;
  margin-bottom: 12px;
`;

const ConfirmActions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding-top: 8px;
`;

const ConfirmButton = styled.button`
  height: 44px;
  border-radius: 12px;
  border: none;
  background: #f3f3f3;
  color: #333;
  font-size: 15px;
  cursor: pointer;
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ConfirmPrimary = styled(ConfirmButton)`
  background: #ffebe8; /* 연한 코랄 톤 */
  color: #d05b51; /* 텍스트 코랄 */
  font-weight: 700;
`;

const ContentContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 30px;
  box-sizing: border-box;

  /* 스크롤바 기본 숨기기 */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 6px; /* 스크롤바 두께 */
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3); /* 스크롤 thumb 색상 */
    border-radius: 10px;
    transition: opacity 0.3s;
    opacity: 0; /* 평소에는 안 보이게 */
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  /* hover 중일 때만 thumb 보이게 */
  &:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
`;

const ButtonContainer = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: center;
  padding: 10px 15px 20px;
  box-sizing: border-box;
  position: sticky;
  bottom: 0;
  background: linear-gradient(#fff 60%, rgba(255, 255, 255, 0));
  z-index: 5;
`;
