// 회전 css
import React from "react";
import styled, { keyframes } from "styled-components";

function LoadingSpinner({ size = "medium", text = "로딩 중..." }) {
  return (
    <LoadingContainer>
      <Spinner size={size} />
      <LoadingText>{text}</LoadingText>
    </LoadingContainer>
  );
}

export default LoadingSpinner;

// 회전 애니메이션
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px 20px;
  width: 100%;
  height: 100%;
`;

const Spinner = styled.div`
  width: ${(props) => {
    switch (props.size) {
      case "small":
        return "24px";
      case "large":
        return "48px";
      default:
        return "32px";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "small":
        return "24px";
      case "large":
        return "48px";
      default:
        return "32px";
    }
  }};
  border: 3px solid #f3f3f3;
  border-top: 3px solid #ff7e74;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #888888;
  margin: 0;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;
