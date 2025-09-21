import React, { useState } from "react";
import styled from "styled-components";
import Memo from "./Memo.jsx";

function Message({
  value = "",
  onChange,
  placeholder = "메시지를 입력하세요...",
  maxLength = 100,
  onImageChange,
  onPrivateChange,
  isPrivate = false,
  userProfile,
  ...props
}) {
  const [IMAGE_FILE, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showPublicNoticePopup, setShowPublicNoticePopup] = useState(false);
  const [showPrivateSuccessPopup, setShowPrivateSuccessPopup] = useState(false);

  // 이미지 파일 선택 처리
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        // 이미지 업로드 시 공개 알림 팝업 표시
        setShowPublicNoticePopup(true);
        // 2초 후 공개 알림 팝업 숨기기
        setTimeout(() => {
          setShowPublicNoticePopup(false);
        }, 2000);
      };
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

  // 비공개 체크박스 핸들러
  const handlePrivateToggle = () => {
    if (!isPrivate) {
      // 체크 시 바로 변경하고 성공 팝업 표시
      if (onPrivateChange) {
        onPrivateChange(true);
      }
      // 기존 팝업들 숨기기
      setShowPublicNoticePopup(false);
      setShowPrivateSuccessPopup(true);

      // 2초 후 성공 팝업 숨기기
      setTimeout(() => {
        setShowPrivateSuccessPopup(false);
      }, 2000);
    } else {
      // 체크 해제 시 바로 변경하고 공개 알림 팝업 표시
      if (onPrivateChange) {
        onPrivateChange(false);
      }
      // 기존 팝업들 숨기기
      setShowPrivateSuccessPopup(false);
      setShowPublicNoticePopup(true);

      // 2초 후 공개 알림 팝업 숨기기
      setTimeout(() => {
        setShowPublicNoticePopup(false);
      }, 2000);
    }
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

        {/* 사진 비공개 섹션 - MemoSection 안에 왼쪽 배치 */}
        {imagePreview && (
          <PrivateSection>
            <PrivateCheckboxContainer>
              <PrivateCheckbox
                type="checkbox"
                id="private-checkbox"
                checked={isPrivate}
                onChange={handlePrivateToggle}
              />
              <PrivateLabel htmlFor="private-checkbox">
                <PrivateCheckboxIcon $isChecked={isPrivate}>
                  {isPrivate && (
                    <PrivateCheckIcon src="/LinkCopyComplete.png" alt="체크" />
                  )}
                </PrivateCheckboxIcon>
                <PrivateText>사진 비공개</PrivateText>
              </PrivateLabel>
            </PrivateCheckboxContainer>
          </PrivateSection>
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

      {/* 공개 알림 팝업 */}
      {showPublicNoticePopup && (
        <PublicNoticePopup>
          <PublicNoticeContent>
            <PublicNoticeText>모든 사용자에게 사진이 보여요.</PublicNoticeText>
          </PublicNoticeContent>
        </PublicNoticePopup>
      )}

      {/* 비공개 성공 팝업 */}
      {showPrivateSuccessPopup && (
        <PrivateSuccessPopup>
          <PrivateSuccessContent>
            <PrivateSuccessText>
              {userProfile?.nickname || "사용자"} 님에게만 사진이 보여요.
            </PrivateSuccessText>
          </PrivateSuccessContent>
        </PrivateSuccessPopup>
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

// 비공개 섹션 스타일
const PrivateSection = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1;
`;

const PrivateCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PrivateCheckbox = styled.input`
  display: none;
`;

const PrivateLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
`;

const PrivateCheckboxIcon = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${(props) => (props.$isChecked ? "#ff7e74" : "#E7E7E7")};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.$isChecked ? "#ff7e74" : "#ffffff")};
  transition: all 0.2s ease;
  flex-shrink: 0;
`;

const PrivateCheckIcon = styled.img`
  width: 12px;
  height: 12px;
  object-fit: contain;
`;

const PrivateText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #bababa;
`;

// 공개 알림 팝업 스타일
const PublicNoticePopup = styled.div`
  position: fixed;
  top: 83%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffefed;
  border: none;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const PublicNoticeContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PublicNoticeText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #585858;
  margin: 0;
  text-align: center;
  line-height: 1.4;
`;

// 비공개 성공 팝업 스타일
const PrivateSuccessPopup = styled.div`
  position: fixed;
  top: 83%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffefed;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, -40%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
`;

const PrivateSuccessContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
`;

const PrivateSuccessText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.4;
  color: #585858;
  margin: 0;
`;
