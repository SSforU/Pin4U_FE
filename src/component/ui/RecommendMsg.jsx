// Message.jsx
import React from "react";
import styled from "styled-components";
import { useState } from "react";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const MessageModal = styled.div`
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 70%;
  max-width: 300px;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  background: #fff2f2;
  border-radius: 10px;
  border-image-slice: 27 27 27 27;
  border-image-width: 20px 20px 20px 20px;
  border-image-outset: 5px 5px 5px 5px;
  border-image-repeat: stretch stretch;
  border-image-source: url("/Msg_border.png");
  border-style: solid;
  padding-bottom: 90px; /* 길찾기 버튼 공간 확보 */
`;

const UserAvatar = styled.img`
  width: 20px;
  height: 20px;
`;

const Nickname = styled.span`
  /* font-weight: bold; */
`;

const SectionContainer = styled.div`
  margin-top: 15px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  /* font-weight: bold; */
  margin-bottom: 8px;
  text-align: left;
  gap: 5px;
  font-size: 16px;
`;

const SectionIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const TagImg = styled.img`
  width: 20px;
  height: 20px;
`;

const MessageImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 20px;
  margin-top: 10px;
`;

// 테두리 및 패딩 역할을 하는 부모 컴포넌트
const MessageContentBorder = styled.div`
  /* 깅엄 체크 무늬 배경 이미지 적용 */
  background-image: url("/repeat.png");
  background-repeat: repeat;
  background-size: 20px;

  border-radius: 8px;
  padding: 12px;
  position: relative; /* 자식 요소를 위한 포지셔닝 */
`;

// 불투명도를 조절하는 흰색 배경 역할을 하는 자식 컴포넌트
const MessageContentInner = styled.div`
  background-color: rgba(255, 255, 255, 0.7); /* 투명도를 조절한 흰색 배경 */
  border-radius: 4px; /* 부모보다 약간 작은 border-radius */
  padding: 10px; /* 내부 텍스트 패딩 */
`;

// 텍스트 스타일
const MessageText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;

const FindPathButton = styled.button`
  background-color: #ffffff;
  color: #ff7e74;
  border: 1px solid #ff7e74;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  width: 170px;

  &:hover {
    background-color: #ffefed;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: -20px;
  right: -20px;
  pointer-events: none;
`;

const ArrowButton = styled.button`
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  border: none;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: all;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

export default function RecommendMsg({ place, notes, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentNote = notes[currentIndex];
  const hasMultipleNotes = notes && notes.length > 1;

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % notes.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + notes.length) % notes.length
    );
  };

  return (
    <Overlay onClick={onClose}>
      <MessageModal onClick={(e) => e.stopPropagation()}>
        <SectionContainer>
          <SectionTitle>
            <SectionIcon src="/Pin.png" alt="장소 아이콘" />
            {place}
          </SectionTitle>
        </SectionContainer>
        <SectionTitle>
          <UserAvatar src={"/User_Voice.svg"} />
          <Nickname>{currentNote.nickname}</Nickname>님이 추천한 장소예요.
        </SectionTitle>
        {currentNote.tags && (
          <SectionTitle>
            <TagImg src={"/Tag.svg"} />
            {currentNote.tags.map((tag, tagIndex) => (
              <span key={tagIndex}>{tag}</span>
            ))}
          </SectionTitle>
        )}
        {/* 여기에 사진과 메시지 내용을 추가 */}
        <MessageImage src="/picture.png" alt="추천 사진" />
        <MessageContentBorder>
          <MessageContentInner>
            <MessageText>{currentNote.recommend_message}</MessageText>
          </MessageContentInner>
        </MessageContentBorder>

        <FindPathButton>
          <img
            src="/kakaoMap.png"
            alt="마커"
            style={{ width: "16px", height: "16px", borderRadius: "5px" }}
          />
          길찾기 바로가기
        </FindPathButton>
        {hasMultipleNotes && (
          <ButtonContainer>
            <ArrowButton onClick={handlePrev} disabled={currentIndex === 0}>
              <img src="/Chevron_Left.png" />
            </ArrowButton>
            <ArrowButton
              onClick={handleNext}
              disabled={currentIndex === notes.length - 1}
            >
              <img src="/Chevron_Right.png" />
            </ArrowButton>
          </ButtonContainer>
        )}
      </MessageModal>
    </Overlay>
  );
}
