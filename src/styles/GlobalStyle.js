// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* 전역 초기화 스타일 */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    min-height: 100%;
    overflow: auto; /* 스크롤 허용 (모바일에서 하단 영역 잘림 방지) */
  }

  #root {
    height: 100%;
  }
`;

export default GlobalStyle;
