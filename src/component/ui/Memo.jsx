import React from "react";
import styled from "styled-components";

const StyledTextarea = styled.textarea`
  width: 100%;
  ${(props) => props.height && `height:${props.height}px;`}
  padding: 16px 14px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
  border: 2px solid #bababa;
  border-radius: 10px;
  background-color: #f7f7f7;
  resize: none;
  box-sizing: border-box;
  overflow: hidden;

  &::placeholder {
    color: #bababa;
  }

  &:focus {
    outline: none;
    border-color: #ff7e74;
    background-color: #ffffff;
  }
`;

function Memo(props) {
  const { height, value, onChange, placeholder, maxLength } = props;
  return (
    <StyledTextarea
      height={height}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}

export default Memo;
