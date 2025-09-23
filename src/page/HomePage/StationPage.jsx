// src/page/StationPage/StationPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import HomeSearchBox from "../HomePage/Component/HomeSearchBox.jsx";
import MemoList from "./List/MemoList.jsx";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

/** ---- 목업 메모 데이터 ---- */
const MOCK_MEMOS = [
  { id: "m1", text: "공부하기 좋은 카페 추천해줘", count: 13 },
  { id: "m2", text: "데이트하기 좋은 곳 추천 부탁", count: 13 },
  { id: "m3", text: "조용하고 밝은 공간 부탁", count: 7 },
  { id: "m4", text: "브런치 맛집 추천", count: 9 },
];
/** ------------------------ */

export default function StationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const station = state?.station; // StationListItem에서 넘겨준 객체
  const allPlaces = useMemo(() => state?.allPlaces ?? [], [state?.allPlaces]);
  const [deleting, setDeleting] = useState(false);

  // 새로고침 등으로 state가 사라졌으면 홈으로
  useEffect(() => {
    if (!station) navigate("/", { replace: true });
  }, [station, navigate]);

  // 해당 역의 장소 메모만 필터링
  const stationMemos = useMemo(() => {
    if (!station) return [];
    return allPlaces
      .filter((p) => p.station_name === station.name.replace("역", ""))
      .map((p, idx) => ({
        id: p.slug ?? `m${idx + 1}`,
        slug: p.slug,
        text: p.request_message ?? p.road_address_name ?? "메모 없음",
        count: p.recommend_count ?? 0,
      }));
  }, [station, allPlaces]);

  const [q, setQ] = useState("");
  const [items, setItems] = useState(stationMemos);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => setItems(stationMemos), [stationMemos]);

  const filtered = useMemo(() => {
    const keyword = q.trim();
    return keyword ? items.filter((m) => m.text.includes(keyword)) : items;
  }, [q, items]);

  if (!station) return null;

  // PlaceMapPage의 라인 아이콘 처리와 동일한 로직
  const getLineKey = (lineArrOrStr) => {
    if (!lineArrOrStr) return "";
    if (Array.isArray(lineArrOrStr)) return String(lineArrOrStr[0] ?? "");
    const first = String(lineArrOrStr).split(",")[0].trim().replace("호선", "");
    return first.match(/\d+/)?.[0] ?? "";
  };

  const lineKey = getLineKey(station.lines);
  const lineSrc = subwayLineImages[lineKey];

  const goPrev = () => navigate(-1);

  const handleMemoClick = (memo) => {
    if (!isEditing) {
      navigate(`/place-map/${memo.slug}`);
    } else {
      // 편집 모드에서는 클릭시 아무 동작 안함
    }
  };

  const toggleEdit = () => {
    setIsEditing(true);
    setSelectedIds([]);
  };

  const handleDelete = async () => {
    if (deleting || selectedIds.length === 0) return;
    setDeleting(true);

    // 선택된 아이템들의 slug 목록
    const targets = items.filter((m) => selectedIds.includes(m.id));
    const reqs = targets.map((m) =>
      axios.delete(
        `${BASE_URL}/api/requests/${encodeURIComponent(m.slug)}`,
        { withCredentials: true } // uid 쿠키 인증
      )
    );

    const results = await Promise.allSettled(reqs);
    const failed = results.filter((r) => r.status === "rejected");

    // 성공한 항목만 UI에서 제거
    const succeededSlugs = new Set(
      targets
        .map((t, i) => (results[i].status === "fulfilled" ? t.slug : null))
        .filter(Boolean)
    );
    setItems((prev) => prev.filter((m) => !succeededSlugs.has(m.slug)));
    setSelectedIds([]);
    setIsEditing(false);
    setDeleting(false);

    if (failed.length) {
      alert(
        `${failed.length}개 항목 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.`
      );
    }
  };

  const handleDone = () => {
    setIsEditing(false);
    setSelectedIds([]);
  };

  return (
    <PageContainer>
      {/* --- 헤더: PlaceMapPage 스타일 --- */}
      <Header>
        <StationWrapper>
          <PrevButton src="/PrevButton.png" alt="뒤로가기" onClick={goPrev} />
          <StationName>{station.name}</StationName>
          {!!lineSrc && <SubwayLineIcon $imageUrl={lineSrc} />}
        </StationWrapper>

        {!isEditing ? (
          <EditButton onClick={toggleEdit}>편집</EditButton>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <DeleteButton onClick={handleDelete} disabled={deleting}>
              {deleting ? "삭제 중..." : "삭제"}
            </DeleteButton>
            <DoneButton onClick={handleDone} disabled={deleting}>
              완료
            </DoneButton>
          </div>
        )}
      </Header>

      {/* --- 컨텐츠: HomePage처럼 검색 + 스크롤 영역 --- */}
      <ContentContainer>
        <HomeSearchBox onSearch={setQ} />
        <MemoList
          items={filtered}
          onItemClick={handleMemoClick}
          isEditing={isEditing}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </ContentContainer>
    </PageContainer>
  );
}

/* ===== styles (HomePage/PlaceMapPage 조합) ===== */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
`;

const Header = styled.div`
  padding: 16px 20px;
  height: calc(100dvh * 90 / 844);
  border-bottom: 1px solid #ffffff;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const StationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PrevButton = styled.img`
  cursor: pointer;
  width: 28px;
  height: 28px;
  position: relative;
  top: 2px;
`;

const StationName = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 500;
`;

const SubwayLineIcon = styled.div`
  width: 35px;
  height: 35px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  background-image: ${(p) => `url('${p.$imageUrl}')`};
`;

const EditButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: none;
  color: #585858;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: none;
  color: #ff7e74;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
`;

const DoneButton = styled.button`
  font-size: 14px;
  font-weight: 600;
  border: none;
  background: none;
  color: #585858;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  pointer-events: ${(p) => (p.disabled ? "none" : "auto")};
`;

const ContentContainer = styled.div`
  width: 100%;
  flex: 1 1 auto;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;

  padding: 0 30px 16px;
  box-sizing: border-box;

  /* HomePage의 스크롤바 스타일 참고 */
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    transition: opacity 0.3s;
    opacity: 0;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &:hover::-webkit-scrollbar-thumb {
    opacity: 1;
  }
`;

const subwayLineImages = {
  1: "/subway/1호선.png",
  2: "/subway/2호선.png",
  3: "/subway/3호선.png",
  4: "/subway/4호선.png",
  5: "/subway/5호선.png",
  6: "/subway/6호선.png",
  7: "/subway/7호선.png",
  8: "/subway/8호선.png",
  9: "/subway/9호선.png",
};
