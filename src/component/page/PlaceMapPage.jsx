// PlaceMapPage.jsx
import React, { useState, useEffect } from "react";
import Map from "../ui/Map"; // Map 컴포넌트의 경로가 올바른지 확인해주세요
import PlaceCardList from "../list/PlaceCardList";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// API 데이터 예시 (실제로는 fetch를 통해 받아옵니다)
const mockApiData = {
  result: "success",
  data: {
    slug: "abCDef12",
    station: {
      code: "7-733",
      name: "숭실대입구",
      line: "7",
      lat: 37.49641,
      lng: 126.95365,
    },
    request_message: "카페 추천 부탁!",
    items: [
      {
        external_id: "kakao:123456789",
        id: "123456789",
        place_name: "미학당 지점",
        category_group_code: "CE7",
        category_group_name: "카페",
        category_name: "음식점 > 카페",
        address_name: "서울 동작구 ㅇㅇ로 12",
        road_address_name: "서울 동작구 ㅇㅇ로 12길 3",
        x: "126.95790",
        y: "37.49611",
        place_url: "http://place.map.kakao.com/123456789",
        mock: {
          rating: 4.6,
          rating_count: 128,
          image_urls: ["/static/images/cafe_ondu_1.jpg"],
        },
        ai: {
          summary_text: "조용한 분위기 선호 사용자에게 적합한 카페.",
          tags: ["조용", "카페"],
        },
        recommended_count: 2,
      },
      {
        external_id: "kakao:987654321",
        id: "987654321",
        place_name: "잔디속에있다고 상상을해",
        category_group_code: "CE7",
        category_group_name: "카페",
        category_name: "음식점 > 카페",
        address_name: "서울 동작구 ㅇㅇ로 13",
        road_address_name: "서울 동작구 ㅇㅇ로 13길 4",
        x: "126.95800",
        y: "37.49620",
        place_url: "http://place.map.kakao.com/987654321",
        mock: {
          rating: 4.8,
          rating_count: 99,
          image_urls: ["/static/images/cafe_garden_1.jpg"],
        },
        ai: {
          summary_text: "야외 정원이 매력적인 카페.",
          tags: ["야외", "정원"],
        },
        recommended_count: 3,
      },
      {
        external_id: "kakao:112233445",
        id: "112233445",
        place_name: "콘하스 지점",
        category_group_code: "CE7",
        category_group_name: "카페",
        category_name: "음식점 > 카페",
        address_name: "서울 동작구 ㅇㅇ로 14",
        road_address_name: "서울 동작구 ㅇㅇ로 14길 5",
        x: "126.95810",
        y: "37.49630",
        place_url: "http://place.map.kakao.com/112233445",
        mock: {
          rating: 4.5,
          rating_count: 201,
          image_urls: ["/static/images/cafe_conhas_1.jpg"],
        },
        ai: {
          summary_text: "넓고 쾌적한 공간의 인테리어가 좋은 카페.",
          tags: ["넓은 공간", "인테리어"],
        },
        recommended_count: 5,
      },
    ],
  },
};

export default function PlaceMapPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isMemoOpen, setIsMemoOpen] = useState(false); // Memo 상태 추가

  function goPrev() {
    navigate("/");
  }

  useEffect(() => {
    // 실제 API 호출 로직은 이 곳에 구현
    // fetch(`/api/place-map/${slug}`).then(...)
    // 현재는 목업 데이터 사용
    setData(mockApiData.data);
  }, []);

  const handleCardClick = (item) => {
    console.log(`Card clicked: ${item.place_name}`);
    // 카드 클릭 시 지도에서 해당 장소를 하이라이트하는 등의 로직 추가
  };

  if (!data) {
    return <div>로딩 중...</div>;
  }

  return (
    <PageContainer>
      <Header>
        <StationWrapper>
          <PrevButton src="/PrevButton.png" alt="뒤로가기" onClick={goPrev} />
          <StationName>{data.station.name}역</StationName>
          <SubwayLineIcon imageUrl={subwayLineImages[data.station.line]} />
        </StationWrapper>
        <MapMemoBtnImage
          onClick={() => setIsMemoOpen(!isMemoOpen)}
          src={isMemoOpen ? "/MapMemoBtn-On.png" : "/MapMemoBtn-Off.png"}
          alt="지도 메모 버튼"
        />
      </Header>
      <MapWrapper>
        <Map station={data.station} items={data.items} />
        {isMemoOpen && (
          <MapMemo>
            <MemoText>{data.request_message}</MemoText>
          </MapMemo>
        )}
      </MapWrapper>
      <CardListWrapper>
        <PlaceCardList items={data.items} onCardClick={handleCardClick} />
      </CardListWrapper>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #ffffff;
`;

const Header = styled.div`
  padding: 16px;
  font-size: 20px;
  font-weight: medium;
  text-align: center;
  height: calc(100dvh * 140 / 844);
  border-bottom: 1px solid #ffffff;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: space-between;
`;

const MapWrapper = styled.div`
  flex: 1;
`;

const StationName = styled.div`
  padding: 0;
  margin: 0;
`;

const StationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
`;

const CardListWrapper = styled.div`
  height: 220px;
`;

const PrevButton = styled.img`
  cursor: pointer;
  width: 28px;
  height: 28px;
  position: relative;
  top: 2px;
`;

const subwayLineImages = {
  1: "/1호선.png",
  2: "/2호선.png",
  3: "/3호선.png",
  4: "/4호선.png",
  5: "/5호선.png",
  6: "/6호선.png",
  7: "/7호선.png",
  8: "/8호선.png",
  9: "/9호선.png",
};

const SubwayLineIcon = styled.div`
  width: 35px;
  height: 35px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  background-image: ${(props) => `url('${props.imageUrl}')`};
`;
const MapMemoBtnImage = styled.img`
  width: 25px;
  height: 25px;
  cursor: pointer;
`;

const MapMemo = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  background-color: #ffc0cb; // 분홍색
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const MemoText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #333;
`;
