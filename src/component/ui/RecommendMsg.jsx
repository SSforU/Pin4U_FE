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
  padding-bottom: 70px; /* 길찾기 버튼 공간 확보 */
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
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
`;

const MessageContent = styled.p`
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: left;
  line-height: 1.5;
`;

const FindPathButton = styled.button`
  background-color: #ff5050;
  color: #ffffff;
  border: none;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #e64040;
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
        <MessageImage src="/example_recommend.jpeg" alt="추천 사진" />
        <MessageContent>{currentNote.recommend_message}</MessageContent>

        <FindPathButton>
          <img
            src="/marker_white.png"
            alt="마커"
            style={{ width: "16px", height: "16px" }}
          />
          길찾기 바로 가기
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
