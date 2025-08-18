import React from "react";
import SearchBox from "../ui/SearchBox";
import { useState } from "react";

export default function StepStation() {
  const [query, setQuery] = useState("");
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
    <div>
      Step: Station
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
        placeholder={"지하철 역을 검색하세요"}
      />
    </div>
  );
}
