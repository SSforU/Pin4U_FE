import React from "react";
import styled from "styled-components";
import StationListItem from "./StationListItem";
import SearchBox from "../ui/SearchBox";
import { useState } from "react";

const ListContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StationList = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const stationsData = [
    {
      id: "1",
      slug: "abCDef12",
      name: "숭실대입구역",
      lines: [7],
      address: "서울 동작구 상도로 378",
      recommended_counts: 13,
      created_at: "2025-08-16T00:00:00Z",
    },
    {
      id: "2",
      slug: "abCDef18",
      name: "이수역",
      lines: [4, 7],
      address: "서울 동작구 동작대로 105-2",
      recommended_counts: 18,
      created_at: "2025-08-10T00:00:00Z",
    },
    // 더 많은 데이터...
  ];

  // 실제에선 API 호출
  const fetchStations = async (q) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 200));
    setItems(q ? stationsData.filter((x) => x.name.includes(q)) : []);
    setLoading(false);
  };

  return (
    <ListContainer>
      <SearchBox
        query={query}
        onChange={setQuery}
        onDebouncedChange={fetchStations}
        debounceMs={200}
        suggestions={items}
        loading={loading}
        onSelect={(item) => {
          setQuery(item.title); // 선택값 반영 (선택)
        }}
        placeholder={"장소, 지하철, 주소 검색"}
      />
      {stationsData.map((station) => (
        <StationListItem key={station.id} station={station} />
      ))}
    </ListContainer>
  );
};

export default StationList;
