// 최초 앱 접속자 온보딩
import React from "react";
import SearchBox from "../ui/SearchBox";
import { useState } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";

function StepStation() {
  const { station, setStation } = useOutletContext();
  const [query, setQuery] = useState(station?.title || "");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  // 실제에선 API 호출
  const fetchStations = async (q) => {
    setLoading(true);
    const db = [
      { id: 1, title: "숭실대입구", subtitle: "7호선" },
      { id: 2, title: "상도", subtitle: "7호선" },
      { id: 3, title: "이수", subtitle: "4·7호선" },
    ];
    await new Promise((r) => setTimeout(r, 200));
    setItems(q ? db.filter((x) => x.title.includes(q)) : []);
    setLoading(false);
  };

  return (
    <Wrapper>
      <TextBlock>
        <Title>
          방문할 장소와 가장 가까운
          <br />
          &nbsp;지하철 역을 입력해 주세요.
        </Title>
        <Detail>입력한 지하철 역과 가까운 장소를 추천해 드릴게요.</Detail>
      </TextBlock>
      <SearchBox
        query={query}
        onChange={setQuery}
        onDebouncedChange={fetchStations}
        debounceMs={200}
        suggestions={items}
        loading={loading}
        onSelect={(item) => {
          setQuery(item.title); // 선택값 반영 (선택)
          setStation(item); // 부모의 state 업데이트
        }}
        placeholder={"지하철 역을 검색하세요"}
      />
    </Wrapper>
  );
}

export default StepStation;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  max-width: 500px;
  display: flex;
  margin: 0 auto;
  padding: 24px 20px 0;
  flex-direction: column;
  align-items: stretch; /*좌측 정렬 핵심 속성 */
  gap: 54px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.2px;
`;

const Detail = styled.div`
  color: #585858;
  font-size: 14px;
  margin: 0;
  padding-left: 5px;
`;
