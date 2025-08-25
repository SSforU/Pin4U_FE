import React from "react";
import styled, { keyframes } from "styled-components";

function PulseLoader({ size = "medium", color = "#ff7e74" }) {
  return (
    <PulseContainer>
      <PulseDot size={size} color={color} delay="0ms" />
      <PulseDot size={size} color={color} delay="150ms" />
      <PulseDot size={size} color={color} delay="300ms" />
    </PulseContainer>
  );
}

export default PulseLoader;

const pulse = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const PulseContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
`;

const PulseDot = styled.div`
  width: ${(props) => {
    switch (props.size) {
      case "small":
        return "8px";
      case "large":
        return "16px";
      default:
        return "12px";
    }
  }};
  height: ${(props) => {
    switch (props.size) {
      case "small":
        return "8px";
      case "large":
        return "16px";
      default:
        return "12px";
    }
  }};
  background-color: ${(props) => props.color};
  border-radius: 50%;
  animation: ${pulse} 1.4s ease-in-out infinite both;
  animation-delay: ${(props) => props.delay};
`;
