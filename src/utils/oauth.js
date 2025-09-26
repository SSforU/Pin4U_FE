// 카카오 OAuth 설정 (로그인)
const FRONTEND_URL =
  import.meta.env.VITE_KAKAO_REDIRECT_URI || "http://localhost:5173";
export const CLIENT_ID = "d5e14b6afd14509b1aee4ef3de5b99b2"; // 실제 카카오 앱 키로 교체 필요
export const REDIRECT_URI = `${FRONTEND_URL}/oauth/callback/kakao`;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
