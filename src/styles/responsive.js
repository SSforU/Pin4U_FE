// 500×844 비율에 최적화된 반응형 크기 관리
export const responsiveSizes = {
  // 데스크톱 (500px 기준)
  desktop: {
    button: "450px", // 500px의 90%
    progress: "450px",
    search: "450px",
  },
  // 랩탑
  laptop: {
    button: "400px", // 500px의 80%
    progress: "400px",
    search: "400px",
  },
  // 태블릿
  tablet: {
    button: "350px", // 500px의 70%
    progress: "350px",
    search: "350px",
  },
  // 모바일
  mobile: {
    button: "300px", // 500px의 60%
    progress: "300px",
    search: "300px",
  },
  // 작은 모바일
  smallMobile: {
    button: "250px", // 500px의 50%
    progress: "250px",
    search: "250px",
  },
};

// 반응형 스타일을 한 번에 적용하는 함수
export function getResponsiveStyles(componentType) {
  return `
    width: 100%;
    max-width: ${responsiveSizes.desktop[componentType]};
    min-width: ${responsiveSizes.smallMobile[componentType]};
    margin: 0 auto; /* 수평 중앙 정렬 */

     /* 랩탑 */
    @media (max-width: 1440px) {
      max-width: ${responsiveSizes.laptop[componentType]};
    }
    
    /* 태블릿 */
    @media (max-width: 1024px) {
      max-width: ${responsiveSizes.tablet[componentType]};
    }
    
    /* 모바일 */
    @media (max-width: 768px) {
      max-width: ${responsiveSizes.mobile[componentType]};
    }
    
    /* 작은 모바일 */
    @media (max-width: 480px) {
      max-width: ${responsiveSizes.smallMobile[componentType]};
    }
  `;
}
