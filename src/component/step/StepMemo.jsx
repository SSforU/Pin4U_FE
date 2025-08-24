// 최초 앱 접속자 온보딩
// 고정 사용자가 작성한 memo localStorage에 저장
import { React, useState, useEffect } from "react";
import styled from "styled-components";
import { getResponsiveStyles } from "../../styles/responsive";
import { useOutletContext } from "react-router-dom";
import Memo from "../ui/Memo";

function StepMemo() {
  const { memo, setMemo } = useOutletContext();
  const [content, setContent] = useState(memo || "");

  // memo prop이 변경될 때만 content 상태 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (memo && memo !== content) {
      setContent(memo);
    }
  }, [memo]); // content 의존성 제거

  // 80자 제한 처리 (API 명세에 맞춤)
  const handleMemoChange = (e) => {
    const newContent = e.target.value;
    if (newContent.length <= 80) {
      setContent(newContent);
      // 부모 컴포넌트에 즉시 전달 (디바운싱 없이)
      if (setMemo) {
        setMemo(newContent);
      }
      // localStorage에 저장
      localStorage.setItem("requestMessage", newContent);
    }
  };

  return (
    <Wrapper>
      <TextBlock>
        <Title>친구들에게 메모를 남겨주세요.</Title>
        <Detail>친구들이 입력된 메모를 참고해 추천해 줄 수 있어요.</Detail>
      </TextBlock>

      <MemoContainer>
        <Memo
          height={80}
          value={content}
          onChange={handleMemoChange}
          placeholder={"메모 입력"}
          maxLength={80}
        />
        <CharCount>{content.length}/80</CharCount>
      </MemoContainer>
    </Wrapper>
  );
}

export default StepMemo;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  max-width: 500px;
  display: flex;
  margin: 0 auto;
  padding: 24px 20px 0;
  flex-direction: column;
  align-items: stretch;
  gap: 54px;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Title = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 26px;
  color: #000000;
`;

const Detail = styled.div`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  margin: 0;
  padding-left: 5px;
`;

const MemoContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -26px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: #bababa;
  text-align: center;
`;
