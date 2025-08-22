import React, { useState } from "react";
import styled from "styled-components";
import Memo from "./Memo";

function Message({
  value = "",
  onChange,
  placeholder = "메시지를 입력하세요...",
  maxLength = 100,
  onImageChange,
  ...props
}) {
  const [IMAGE_FILE, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  // 이미지 파일 선택 처리
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // 부모 컴포넌트에 이미지 파일 전달
      if (onImageChange) {
        onImageChange(file);
      }
    }
  };

  // 이미지 제거 처리
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview("");
    if (onImageChange) {
      onImageChange(null);
    }
  };

  // 이미지 모달 열기
  const handleImageClick = () => {
    setShowImageModal(true);
  };

  // 이미지 모달 닫기
  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  return (
    <MessageContainer {...props}>
      {/* 메모 입력 섹션 - Memo 컴포넌트 재사용 */}
      <MemoSection>
        <Memo
          height={imagePreview ? 180 : 160}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
        />

        {/* 이미지 업로드 버튼을 텍스트 영역 안에 배치 */}
        {!imagePreview && (
          <ImageUploadButton htmlFor="image-input">
            <UploadImage src="/UploadImage.png" alt="이미지 업로드" />
          </ImageUploadButton>
        )}

        {/* 이미지 프리뷰를 텍스트 영역 안에 배치 */}
        {imagePreview && (
          <ImagePreviewContainer>
            <ImagePreview
              src={imagePreview}
              alt="미리보기"
              onClick={handleImageClick}
              style={{ cursor: "pointer" }}
            />
            <RemoveImageButton onClick={handleImageRemove}>×</RemoveImageButton>
          </ImagePreviewContainer>
        )}

        {/* 숨겨진 파일 입력 */}
        <ImageInput
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          id="image-input"
        />
      </MemoSection>

      {/* 이미지 전체 보기 모달 */}
      {showImageModal && (
        <ImageModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={imagePreview} alt="전체 이미지" />
          </ModalContent>
        </ImageModal>
      )}
    </MessageContainer>
  );
}

export default Message;

// styled-components
const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const ImageInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

const UploadImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
`;

const ImagePreviewContainer = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ImagePreview = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e0e0e0;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border: none;
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #ff5252;
    transform: scale(1.1);
  }
`;

const MemoSection = styled.div`
  position: relative;
  width: 100%;
`;

const ImageUploadButton = styled.label`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fafafa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background-color: #fff5f4;
    transform: scale(1.05);
  }
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  width: auto;
  height: auto;
  max-width: 90vw;
  max-height: 90vh;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalImage = styled.img`
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;
