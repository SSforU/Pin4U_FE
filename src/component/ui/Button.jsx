import React from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive.js";

function Button({
  children,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  return (
    <StyledButton type={type} disabled={disabled} onClick={onClick} {...props}>
      <ButtonText>{children}</ButtonText>
    </StyledButton>
  );
}

export default Button;

// styled-components
const StyledButton = styled.button`
  ${getResponsiveStyles("button")} // 반응형

  background-color: ${(props) => (props.disabled ? "#FFD5D2" : "#ff7e74")};
  border: none;
  border-radius: 10px;
  padding: 11px 77px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-1px)")};
  }
  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }
`;

const ButtonText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: #ffffff;
  line-height: 18px;
  white-space: nowrap;
`;
