// 실제 화면 크기에 최적화된 반응형 크기 관리
export const responsiveSizes = {
  // 데스크톱
  desktop: {
    layout: "1200px", // 전체 페이지 레이아웃
    content: "800px", // 메인 콘텐츠 영역
    component: "400px", // 개별 컴포넌트
    search: "100%", // 검색/입력 컴포넌트 - 너비 제한 해제
  },
  // 랩탑
  laptop: {
    layout: "1024px",
    content: "700px",
    component: "350px",
    search: "100%",
  },
  // 태블릿
  tablet: {
    layout: "768px",
    content: "600px",
    component: "300px",
    search: "100%",
  },
  // 모바일
  mobile: {
    layout: "480px",
    content: "100%",
    component: "100%",
    search: "100%", // 모바일에서도 100% 사용
  },
};

// 반응형 스타일을 한 번에 적용하는 함수
export function getResponsiveStyles(componentType) {
  return `
    width: 100%;
    max-width: ${responsiveSizes.desktop[componentType]};
    margin: 0 auto; /* 수평 중앙 정렬 */

    /* 랩탑 */
    @media (max-width: 1024px) {
      max-width: ${responsiveSizes.laptop[componentType]};
    }
    
    /* 태블릿 */
    @media (max-width: 768px) {
      max-width: ${responsiveSizes.tablet[componentType]};
    }
    
    /* 모바일 */
    @media (max-width: 480px) {
      max-width: ${responsiveSizes.mobile[componentType]};
    }
  `;
}
