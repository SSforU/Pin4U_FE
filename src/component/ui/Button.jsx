import React from "react";
import styled from "styled-components";

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

//styled-components
const StyledButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#bababa" : "#ff7e74")};
  border: none;
  border-radius: 10px;
  padding: 11px 77px;
  width: 330px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease-in-out; // width 값이 바뀔 때 부드럽게 처리

  // 마우스 올렸을 때
  &:hover {
    background-color: ${(props) => (props.disabled ? "#bababa" : "#ff6b5f")};
    transform: ${(props) =>
      props.disabled
        ? "none"
        : "translateY(-1px)"}; // 애니메이션 처리 : 활성 상태면 위로 살짝 들린 느낌
  }

  // 클릭했을 때
  &:active {
    transform: ${(props) =>
      props.disabled
        ? "none"
        : "translateY(0)"}; // 애니메이션 처리 : 클릭하면 아래로 눌리는 느낌(원래 위치로 돌아옴)
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
