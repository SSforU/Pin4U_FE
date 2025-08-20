// Message.jsx
import React from "react";
import styled from "styled-components";

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
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 80%;
  max-width: 350px;
  padding: 24px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.img`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const HeaderText = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
  text-align: left;
`;

const UserAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const Nickname = styled.span`
  font-weight: bold;
`;

const MessageContent = styled.p`
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  text-align: left;
  line-height: 1.5;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
`;

const Tag = styled.span`
  background-color: #e6e6e6;
  color: #555;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
`;

export default function Message({ notes, onClose }) {
  return (
    <Overlay onClick={onClose}>
      <MessageModal onClick={(e) => e.stopPropagation()}>
        <CloseButton src="/Close_icon.png" alt="닫기" onClick={onClose} />
        <HeaderText>장소 추천</HeaderText>
        {notes.map((note, index) => (
          <div key={index}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <UserAvatar
                src={note.image_url || "/default_avatar.png"}
                alt="아바타"
              />
              <Nickname>{note.nickname}</Nickname>님이 추천한 장소예요.
            </div>
            <MessageContent>{note.recommend_message}</MessageContent>
            {note.tags && (
              <TagContainer>
                {note.tags.map((tag, tagIndex) => (
                  <Tag key={tagIndex}># {tag}</Tag>
                ))}
              </TagContainer>
            )}
          </div>
        ))}
      </MessageModal>
    </Overlay>
  );
}
