import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../styles/responsive.js";

function StepGroupProfile() {
  const outlet = useOutletContext?.() || {};
  const { groupProfile, setGroupProfile } = outlet;

  const [groupName, setGroupName] = useState(groupProfile?.name || "");
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
    }
  };

  // 이미지 모달 열기 (전체 보기용)
  const handleImageClick = () => {
    setShowImageModal(true);
  };

  // 이미지 모달 닫기
  const handleCloseModal = () => {
    setShowImageModal(false);
  };

  // groupProfile 상태 업데이트
  React.useEffect(() => {
    if (typeof setGroupProfile === "function") {
      setGroupProfile({
        name: groupName,
        image: IMAGE_FILE,
      });
    }
  }, [groupName, IMAGE_FILE, setGroupProfile]);

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>그룹 프로필을 설정해주세요.</Title>
          <Detail>친구들과 우리만의 그룹 지도를 만들어봐요.</Detail>
        </TextBlock>

        <InputGroup>
          <ImageUploadSection>
            {!imagePreview ? (
              <UploadImageContainer>
                <UploadImage src="/Pin4U_Logo.png" alt="이미지 업로드" />
              </UploadImageContainer>
            ) : (
              <ImageContainer>
                <ImagePreview
                  src={imagePreview}
                  alt="그룹 이미지 미리보기"
                  onClick={handleImageClick}
                  style={{ cursor: "pointer" }}
                />
              </ImageContainer>
            )}
            <ImageInput
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              id="group-image-input"
            />

            <ImageUploadButton htmlFor="group-image-input">
              프로필 사진 수정
            </ImageUploadButton>
          </ImageUploadSection>
        </InputGroup>
        <FormSection>
          <InputGroup>
            <Input
              type="text"
              placeholder="그룹명을 입력해주세요"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={10}
            />
            <CharCount>{groupName.length}/10</CharCount>
          </InputGroup>
        </FormSection>
      </ContentSection>

      {/* 이미지 전체 보기 모달 */}
      {showImageModal && (
        <ImageModal onClick={handleCloseModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={imagePreview} alt="전체 이미지" />
          </ModalContent>
        </ImageModal>
      )}
    </Wrapper>
  );
}

export default StepGroupProfile;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 24px;
  padding: 24px 20px;
  height: 100%;
  justify-content: flex-start;
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.2px;
  color: #000000;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
  padding-left: 4px;

  @media (max-width: 768px) {
    font-size: 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #eeeeee;
  border-radius: 8px;
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  color: #333333;
  background-color: #ffffff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #ff7e74;
  }

  &::placeholder {
    color: #999999;
  }
`;

const CharCount = styled.span`
  font-family: "Pretendard", sans-serif;
  font-size: 12px;
  color: #999999;
  text-align: right;
  margin-top: 4px;
`;

const ImageUploadSection = styled.div`
  position: relative;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 120px;
`;

const ImageUploadButton = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ff7e74;
  font-size: 16px;
  font-weight: 500;
  width: 120px;
  height: 20px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff5f4;
    border-color: #ff7e74;
    transform: scale(1.02);
  }
`;

const UploadImage = styled.img`
  width: 70px;
  height: 70px;
  background-color: #f7f7f7;
  object-fit: contain;
  border-radius: 50%;
`;

const UploadImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  background-color: #f7f7f7;
  object-fit: contain;
  border-radius: 50%;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 120px;
  height: 120px;
  background-color: #333333;
  border-radius: 50%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const ImagePreview = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
`;

const ImageInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
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
