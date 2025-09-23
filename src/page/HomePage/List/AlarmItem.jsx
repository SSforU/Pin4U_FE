// component/page/Alarm/AlarmItem.jsx
import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

export default function AlarmItem({ item, onDone, BASE_URL }) {
  // item: { id, requesterName, groupName, group_slug, requester_id, created_at }
  const [status, setStatus] = useState(item.status ?? "pending"); // 'pending' | 'approved' | 'rejected'
  const [loading, setLoading] = useState(false);
  const timeAgo = getTimeAgo(item.created_at);

  const handleAction = async (action) => {
    if (loading || status !== "pending") return;
    setLoading(true);
    try {
      // 명세: POST /api/groups/{group_slug}/members
      // body: { action: "approve" | "reject", user_id: number }, cookie 인증(uid)
      await axios.post(
        `${BASE_URL}/api/groups/${item.group_slug}/members`,
        { action, user_id: item.requester_id },
        { withCredentials: true }
      );

      const next = action === "approve" ? "approved" : "rejected";
      setStatus(next);
      onDone?.(item.id, next);
    } catch (e) {
      alert(
        e?.response?.data?.error?.message ||
          e?.message ||
          "요청 처리에 실패했어요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row>
      <Texts>
        <Title>
          <strong>{item.requesterName}</strong> 님이 [{item.groupName}]
        </Title>
        {status === "pending" ? (
          <Title>멤버 승인 요청을 보냈어요.</Title>
        ) : status === "approved" ? (
          <Title>멤버 승인 요청을 수락했어요.</Title>
        ) : (
          <Title>멤버 승인 요청을 거절했어요.</Title>
        )}
        <Time>{timeAgo}</Time>
      </Texts>

      {status === "pending" && (
        <Actions>
          <GhostButton
            type="button"
            disabled={loading}
            onClick={() => handleAction("reject")}
          >
            거절
          </GhostButton>
          <PrimaryButton
            type="button"
            disabled={loading}
            onClick={() => handleAction("approve")}
          >
            수락
          </PrimaryButton>
        </Actions>
      )}
    </Row>
  );
}

/* utils */
function getTimeAgo(iso) {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h <= 0) {
      const m = Math.max(1, Math.floor(diff / 60000));
      return `약 ${m}분 전`;
    }
    return `약 ${h}시간 전`;
  } catch {
    return "";
  }
}

/* styles */
const Row = styled.div`
  padding: 14px 0 12px;
  border-bottom: 1px solid #eee;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
`;

const Texts = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 25px;
`;

const Title = styled.div`
  font-size: 15px;
  color: #111;
  & > strong {
    font-weight: 700;
  }
`;

const Desc = styled.div`
  font-size: 14px;
  color: #444;
`;

const Time = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #999;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const GhostButton = styled.button`
  padding: 6px 10px;
  border-radius: 10px;
  border: 1px solid #ff7e74;
  color: #ff7e74;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(GhostButton)`
  color: #fff;
  border: none;
  background: #ff7e74;
`;
