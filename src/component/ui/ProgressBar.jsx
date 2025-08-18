import React from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";

function ProgressBar({ currentStep = 1, totalSteps = 3, ...props }) {
  return (
    <div {...props}>
      <ProgressBarContainer>
        <ProgressFill currentStep={currentStep} totalSteps={totalSteps} />
      </ProgressBarContainer>
    </div>
  );
}

export default ProgressBar;

// styled-components
const ProgressBarContainer = styled.div`
  ${getResponsiveStyles("progress")} // 반응형

  height: 6px;
  background-color: #d9d9d9;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  margin-top: 20px;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: #ff7e74;
  border-radius: 3px;
  transition: width 0.5s ease-in-out;
  width: ${(props) => {
    const progress = (props.currentStep / props.totalSteps) * 100;
    return `${progress}%`;
  }};
`;
