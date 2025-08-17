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
    overflow: hidden; /* 배경 이미지가 넘칠 때 방지용 */
  }

  #root {
    height: 100%;
  }
`;

export default GlobalStyle;
