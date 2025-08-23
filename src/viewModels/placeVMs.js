// 서버 응답의 기본 아이템 타입
// (기존 PlaceMapPage.jsx의 items[]와 AI 추천 API의 items[] 모두 동일하다고 가정)
export const toPinVM = (item, isAI = false) => ({
  id: item.id,
  name: item.place_name,
  lng: parseFloat(item.x),
  lat: parseFloat(item.y),
  count: item.recommended_count,
  isAI: isAI, // AI 추천 여부 플래그 추가
});

export const toCardVM = (item, isAI = false) => ({
  id: item.id,
  name: item.place_name,
  imageUrl: item.mock?.image_urls?.[0],
  summary: item.ai?.summary_text,
  isAI: isAI, // AI 추천 여부 플래그 추가
});
