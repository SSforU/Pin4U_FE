import styled from "styled-components";

const Page = styled.div`
  width: 100vw;
  height: 100dvh; /* 데스크톱/모바일 모두 가득 */
  display: grid;
  place-items: center;
  background: #0b0c10;
  overflow: hidden;
`;

/* 폰 화면 (iPhone 390×844 비율 유지) */
const PhoneFrame = styled.div`
  /* 핵심: 한쪽만 지정 + aspect-ratio 로 다른 축을 자동 계산 */
  aspect-ratio: 500 / 844;

  /* 세로를 기준으로 채우되, 가로를 넘치지 않도록 클램프 */
  width: min(100vw, calc(100dvh * (500 / 844)));
  /* height는 aspect-ratio에 따라 자동 계산됨 */

  background: #fff;
  overflow: hidden;
  position: relative; /* 내부 absolute 기준 */
  box-sizing: border-box;

  /* 모바일에선 진짜 풀화면으로 쓰고 싶다면 이 분기 사용 */
  @media (max-width: 1023.98px) {
    width: 100vw;
    height: 100vh; /* 폴백 */
    height: 100dvh; /* 주소창 변화 대응 */
    border-radius: 0;
    box-shadow: none;
    /* iOS 안전영역 */
    padding: max(0px, env(safe-area-inset-top))
      max(0px, env(safe-area-inset-right)) max(0px, env(safe-area-inset-bottom))
      max(0px, env(safe-area-inset-left));
  }
`;

export default function AppShell({ children }) {
  return (
    <Page>
      <PhoneFrame>{children}</PhoneFrame>
    </Page>
  );
}
