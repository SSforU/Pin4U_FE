import React from "react";
import styled from "styled-components";

function SkeletonUI({ type = "card", count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <SkeletonCard>
            <SkeletonImage />
            <SkeletonContent>
              <SkeletonTitle />
              <SkeletonText />
              <SkeletonText short />
            </SkeletonContent>
          </SkeletonCard>
        );
      case "list":
        return (
          <SkeletonListItem>
            <SkeletonAvatar />
            <SkeletonContent>
              <SkeletonTitle />
              <SkeletonText />
            </SkeletonContent>
          </SkeletonListItem>
        );
      case "text":
        return (
          <SkeletonContent>
            <SkeletonTitle />
            <SkeletonText />
            <SkeletonText />
            <SkeletonText short />
          </SkeletonContent>
        );
      default:
        return <SkeletonBox />;
    }
  };

  return (
    <SkeletonContainer>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </SkeletonContainer>
  );
}

export default SkeletonUI;

const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px;
`;

const shimmerEffect = `
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200px 100%;
  animation: shimmer 1.5s infinite;
`;

const SkeletonBox = styled.div`
  width: 100%;
  height: 60px;
  background: #f0f0f0;
  border-radius: 8px;
  ${shimmerEffect}
`;

const SkeletonCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 16px;
`;

const SkeletonListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e7e7e7;
`;

const SkeletonImage = styled.div`
  width: 60px;
  height: 60px;
  background: #f0f0f0;
  border-radius: 8px;
  flex-shrink: 0;
  ${shimmerEffect}
`;

const SkeletonAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: #f0f0f0;
  border-radius: 50%;
  flex-shrink: 0;
  ${shimmerEffect}
`;

const SkeletonContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonTitle = styled.div`
  height: 20px;
  background: #f0f0f0;
  border-radius: 4px;
  width: 70%;
  ${shimmerEffect}
`;

const SkeletonText = styled.div`
  height: 16px;
  background: #f0f0f0;
  border-radius: 4px;
  width: ${(props) => (props.short ? "50%" : "100%")};
  ${shimmerEffect}
`;
