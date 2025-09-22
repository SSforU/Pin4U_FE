// component/page/AlarmPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AlarmItem from "./List/AlarmItem.jsx";
import axios from "axios";

export default function AlarmPage() {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [items, setItems] = useState([]);

  // ⚠️ 서버의 알림 목록 API가 아직 없다면, 아래 MOCK을 사용하다가 교체.
  const MOCK = useMemo(
    () => [
      {
        id: "n1",
        requesterName: "박숭실",
        requester_id: 9007199254740991, // 명세 예시의 큰 정수
        groupName: "그룹명",
        group_slug: "group-1",
        created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        status: "pending",
      },
      {
        id: "n2",
        requesterName: "이숭실",
        requester_id: 1234,
        groupName: "그룹명",
        group_slug: "group-1",
        created_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        status: "pending",
      },
      {
        id: "n3",
        requesterName: "최숭실",
        requester_id: 5678,
        groupName: "그룹명",
        group_slug: "group-2",
        created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        status: "pending",
      },
    ],
    []
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMsg("");
      try {
        // 실제 API가 준비되면 이 부분으로 교체:
        // const { data } = await axios.get(`${BASE_URL}/api/notifications`, { withCredentials: true });
        // setItems(data?.data?.items ?? []);
        setItems(MOCK);
      } catch (e) {
        setErrorMsg(
          e?.response?.data?.error?.message ||
            e?.message ||
            "알림을 불러오지 못했어요."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [BASE_URL, MOCK]);

  const handleDone = (id, nextStatus) => {
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, status: nextStatus } : x))
    );
  };

  return (
    <Page>
      <Header>
        <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <img
            src="/Chevron_Left.svg"
            alt="뒤로가기"
            style={{ height: "30px", width: "30px" }}
          />
        </BackBtn>
        <Title>알림</Title>
      </Header>

      <Divider />

      <Body>
        {loading && <Hint>불러오는 중…</Hint>}
        {!!errorMsg && <Error>{errorMsg}</Error>}
        {!loading &&
          !errorMsg &&
          items.map((it) => (
            <AlarmItem
              key={it.id}
              item={it}
              onDone={handleDone}
              BASE_URL={BASE_URL}
            />
          ))}
      </Body>
    </Page>
  );
}

/* styles */
const Page = styled.div`
  height: 100dvh;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: calc(100dvh * 70 / 844);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 8px;
`;

const BackBtn = styled.button`
  all: unset;
  display: grid;
  place-items: center;
  cursor: pointer;
  margin-left: 20px;
  position: relative;
  top: 1px;
`;

const Title = styled.h1`
  margin: 0 18px;
  font-size: 20px;
  font-weight: 600;
  color: #111;
`;

const Divider = styled.div`
  height: 10px;
  background: #f7f7f7;
`;

const Body = styled.div`
  flex: 1 1 auto;
  padding: 12px 18px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const Hint = styled.div`
  padding: 16px 2px;
  color: #666;
  font-size: 14px;
`;

const Error = styled(Hint)`
  color: #d64545;
`;
