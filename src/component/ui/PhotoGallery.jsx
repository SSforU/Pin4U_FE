// PhotoGallery.jsx
import React from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-top-left-radius: 30px;
  border-top-right-radius: 30px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  padding: 25px 30px;
  box-sizing: border-box;
  z-index: 20;
  height: calc(100dvh * 422 / 844);
  display: flex;
  flex-direction: column;
`;

const GalleryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10px;
  background-color: #fff;
  flex-shrink: 0;
  padding-bottom: 15px;
`;

const BackButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  margin: 0;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  padding: 16px;
  overflow-y: auto;
  flex-grow: 1;
`;

const EnlargedImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
`;

export default function PhotoGallery({ imageUrls, onClose }) {
  return (
    <Overlay>
      <GalleryHeader>
        <BackButton src="/PrevButton.png" alt="뒤로가기" onClick={onClose} />
        <HeaderTitle>사진</HeaderTitle>
      </GalleryHeader>
      <ImageGrid>
        {imageUrls.map((url, index) => (
          <EnlargedImage key={index} src={url} alt={`사진 ${index + 1}`} />
        ))}
      </ImageGrid>
    </Overlay>
  );
}
