// 장소 추천 단계
// #6 추천 장소 최종 제출 API 호출 (POST)
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getResponsiveStyles } from "../styles/responsive.js";
import { useOutletContext } from "react-router-dom";
import Message from "../component/ui/Message.jsx";
import Button from "../component/ui/Button.jsx";
import PulseLoader from "../component/ui/PulseLoader.jsx";
import SkeletonUI from "../component/ui/SkeletonUI.jsx";
import axios from "axios";

function StepRecommend() {
  const { memo, userProfile, location, nickname } = useOutletContext();
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const IMAGE_MAKE_KEY_PATH =
    import.meta.env.VITE_IMAGE_MAKE_KEY_PATH || "/api/uploads/images/make-key";

  // StepLocation에서 선택한 장소들 (상위 컨텍스트 전달)
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);
  // 장소별 입력 데이터 저장 (tags, message, image)
  const [placeRecommendations, setPlaceRecommendations] = useState([]);

  // 컴포넌트 마운트/상위 location 변경 시 선택 장소 초기화
  useEffect(() => {
    try {
      setIsLoading(true);
      const locationsArray = Array.isArray(location)
        ? location
        : location
        ? [location]
        : [];
      const normalized = locationsArray.map((loc) => ({
        id: loc.id, // StepLocation에서 설정한 id 필드 사용
        external_id: loc.external_id, // 원본 external_id도 보존
        title: loc.title,
      }));
      const initialRecommendations = normalized.map(() => ({
        tags: [],
        message: "",
        image: null,
      }));
      setSelectedPlaces(normalized);
      setPlaceRecommendations(initialRecommendations);
    } catch (error) {
      console.error("선택된 장소 초기화 실패:", error);
      setSelectedPlaces([]);
      setPlaceRecommendations([]);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  }, [location]);

  // 닉네임은 상위 컨텍스트에서 전달됨
  useEffect(() => {}, [userProfile, nickname]);

  // 현재 장소의 데이터를 UI에 반영
  useEffect(() => {
    if (
      placeRecommendations.length > 0 &&
      currentPlaceIndex < placeRecommendations.length
    ) {
      const currentData = placeRecommendations[currentPlaceIndex];
      setContent(currentData.message || "");
      setSelectedCategories(currentData.tags || []);
    }
  }, [currentPlaceIndex, placeRecommendations]);

  // 모든 장소의 입력이 완료되었는지 확인 (메모이제이션)
  const isAllCompleted = useMemo(() => {
    return (
      placeRecommendations.length > 0 &&
      placeRecommendations.every((place) => place.message.trim().length > 0)
    );
  }, [placeRecommendations]);

  // memo prop이 변경될 때만 content 상태 동기화 (초기 로드 시에만)
  useEffect(() => {
    if (memo && memo !== content && content === "") {
      setContent(memo);
    }
  }, [memo, content]);

  // 120자 제한 처리 + 장소별 메시지 반영 (메모이제이션)
  const handleMemoChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      if (newContent.length <= 120) {
        setContent(newContent);
        // 현재 장소의 메시지 업데이트
        setPlaceRecommendations((prev) => {
          const copy = [...prev];
          copy[currentPlaceIndex] = {
            ...copy[currentPlaceIndex],
            message: newContent,
          };
          return copy;
        });
      }
    },
    [currentPlaceIndex]
  );

  // 업로드 진행 상태
  const [isUploading, setIsUploading] = useState(false);

  // 이미지 업로드 함수 (make-key → S3 PUT)
  const uploadImageToServer = useCallback(
    async (file) => {
      if (!file) return null;
      try {
        setIsUploading(true);
        // 1) 키 생성 요청
        const makeKeyRes = await axios.post(
          `${BASE_URL}${IMAGE_MAKE_KEY_PATH}`,
          {
            slug,
            filename: file.name || "image.jpg",
          },
          { withCredentials: true }
        );

        const key = makeKeyRes?.data?.data?.key;
        const publicUrl = makeKeyRes?.data?.data?.public_url;
        if (!key || !publicUrl) {
          throw new Error("키 생성 실패: key 또는 public_url 누락");
        }

        // 2) 퍼블릭 URL로 직접 업로드 (버킷 정책이 퍼블릭 쓰기/테스트용 전제)
        await axios.put(publicUrl, file, {
          headers: {
            "Content-Type": file.type || "application/octet-stream",
            "x-amz-acl": "public-read",
          },
          withCredentials: false,
        });

        // 3) 업로드 완료된 public_url 사용
        return publicUrl;
      } finally {
        setIsUploading(false);
      }
    },
    [BASE_URL, IMAGE_MAKE_KEY_PATH, slug]
  );

  // 이미지 변경 처리 (퍼블리싱 단계) (메모이제이션)
  const handleImageChange = useCallback(
    async (file) => {
      if (file) {
        try {
          const url = await uploadImageToServer(file);
          if (url) {
            setPlaceRecommendations((prev) => {
              const copy = [...prev];
              copy[currentPlaceIndex] = {
                ...copy[currentPlaceIndex],
                image: url,
                imageFile: file, // 파일 객체도 저장
              };
              return copy;
            });
          }
        } catch (e) {
          console.error("이미지 업로드 실패:", e);
        }
      } else {
        // 이미지 제거 시 URL과 파일 모두 제거
        setPlaceRecommendations((prev) => {
          const copy = [...prev];
          copy[currentPlaceIndex] = {
            ...copy[currentPlaceIndex],
            image: null,
            imageFile: null,
          };
          return copy;
        });
      }
    },
    [currentPlaceIndex, uploadImageToServer]
  );

  // 카테고리 토글 처리 + 장소별 태그 반영 (최대 3개) (메모이제이션)
  const handleCategoryToggle = useCallback(
    (category) => {
      setSelectedCategories((prev) => {
        let next;
        if (prev.includes(category)) {
          next = prev.filter((cat) => cat !== category);
        } else if (prev.length >= 3) {
          next = prev; // 3개 초과 금지
        } else {
          next = [...prev, category];
        }

        // 현재 장소의 태그 업데이트
        setPlaceRecommendations((p) => {
          const copy = [...p];
          copy[currentPlaceIndex] = {
            ...copy[currentPlaceIndex],
            tags: next,
          };
          return copy;
        });

        return next;
      });
    },
    [currentPlaceIndex]
  );

  // 카테고리가 비활성화되어야 하는지 확인 (메모이제이션)
  const isCategoryDisabled = useCallback(
    (category) => {
      return (
        selectedCategories.length >= 3 && !selectedCategories.includes(category)
      );
    },
    [selectedCategories]
  );

  // 다음 장소로 이동 (다음 장소의 저장된 값 불러오기) (메모이제이션)
  const handleNextPlace = useCallback(() => {
    if (currentPlaceIndex < selectedPlaces.length - 1) {
      // 현재 입력 중인 데이터를 저장
      setPlaceRecommendations((prev) => {
        const copy = [...prev];
        copy[currentPlaceIndex] = {
          ...copy[currentPlaceIndex],
          tags: selectedCategories,
          message: content,
        };
        console.log(
          `StepRecommend: ${currentPlaceIndex + 1}번째 장소 데이터 저장:`,
          copy[currentPlaceIndex]
        );
        return copy;
      });

      const nextIndex = currentPlaceIndex + 1;
      setCurrentPlaceIndex(nextIndex);

      // 다음 장소의 저장된 데이터 로드
      const nextPlaceData = placeRecommendations[nextIndex];
      console.log(
        `StepRecommend: ${nextIndex + 1}번째 장소 데이터 로드:`,
        nextPlaceData
      );
      setSelectedCategories(nextPlaceData?.tags || []);
      setContent(nextPlaceData?.message || "");
    }
  }, [
    currentPlaceIndex,
    selectedPlaces.length,
    placeRecommendations,
    selectedCategories,
    content,
  ]);

  // 이전 장소로 이동 (이전 장소의 저장된 값 불러오기) (메모이제이션)
  const handlePrevPlace = useCallback(() => {
    if (currentPlaceIndex > 0) {
      // 현재 입력 중인 데이터를 저장
      setPlaceRecommendations((prev) => {
        const copy = [...prev];
        copy[currentPlaceIndex] = {
          ...copy[currentPlaceIndex],
          tags: selectedCategories,
          message: content,
        };
        console.log(
          `StepRecommend: ${currentPlaceIndex + 1}번째 장소 데이터 저장:`,
          copy[currentPlaceIndex]
        );
        return copy;
      });

      const prevIndex = currentPlaceIndex - 1;
      setCurrentPlaceIndex(prevIndex);

      // 이전 장소의 저장된 데이터 로드
      const prevPlaceData = placeRecommendations[prevIndex];
      console.log(
        `StepRecommend: ${prevIndex + 1}번째 장소 데이터 로드:`,
        prevPlaceData
      );
      setSelectedCategories(prevPlaceData?.tags || []);
      setContent(prevPlaceData?.message || "");
    }
  }, [currentPlaceIndex, placeRecommendations, selectedCategories, content]);

  // 완료 처리 (API 호출 후 CompleteRecommend로 이동) (메모이제이션)
  const handleComplete = useCallback(async () => {
    if (isUploading) {
      return; // 업로드 중엔 제출 방지
    }
    try {
      // 1. 닉네임 수집 - 개인은 입력받은 닉네임, 그룹은 나중에 그룹명 사용
      const currentPath = window.location.pathname;
      let recommenderNickname = "";

      if (currentPath.includes("/shared-map/group/")) {
        // 그룹 추천: 로그인한 사용자의 닉네임 사용
        recommenderNickname = (userProfile?.nickname || "").trim();

        // 로그인 사용자 닉네임 검증
        if (recommenderNickname.length < 2 || recommenderNickname.length > 16) {
          alert("로그인 정보에 문제가 있습니다. 다시 로그인해주세요.");
          return;
        }
      } else {
        // 개인 추천: 입력받은 닉네임 사용 및 검증
        recommenderNickname = (nickname || "").trim();

        if (recommenderNickname.length < 2 || recommenderNickname.length > 16) {
          alert("닉네임은 2~16자 사이로 입력해주세요.");
          return;
        }
      }
      const locationsWithDetails = selectedPlaces || [];
      // 2. API 요청 데이터 구성 - API 명세에 맞게 수정
      // guest_id 생성 (UUID v4 형식)
      const generateGuestId = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            const r = (Math.random() * 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
          }
        );
      };

      const guestId = generateGuestId();

      // 그룹인 경우 그룹 이름을 사용하기 위해 최종 추천자 닉네임 결정
      let finalRecommenderNickname = recommenderNickname;

      const items = locationsWithDetails.map((location, index) => ({
        external_id: location.external_id, // 서버 검증용
        recommender_nickname: finalRecommenderNickname,
        recommend_message: placeRecommendations[index]?.message || "",
        image_url: placeRecommendations[index]?.image || null,
        tags: placeRecommendations[index]?.tags || [],
        image_is_public: !(placeRecommendations[index]?.isPrivate || false), // 비공개 상태 추가
        guest_id: guestId, // guest_id 추가
      }));

      console.log("StepRecommend: API 요청 데이터:", { items });
      console.log("StepRecommend: locationsWithDetails:", locationsWithDetails);
      console.log("StepRecommend: placeRecommendations:", placeRecommendations);

      // 디버깅을 위한 추가 로그
      console.log("StepRecommend: 각 장소의 external_id 확인:");
      locationsWithDetails.forEach((loc, index) => {
        console.log(`장소 ${index + 1}:`, {
          id: loc.id,
          external_id: loc.external_id,
          title: loc.title,
        });
      });

      // 3. 그룹인 경우 개인 요청 생성, 개인인 경우 바로 추천 제출
      let finalSlug = slug;

      if (currentPath.includes("/shared-map/group/")) {
        console.log("StepRecommend: 그룹 추천 - 개인 요청 생성 시도");
        try {
          // 1. 먼저 그룹 정보를 가져와서 station_code와 request_message 확인
          const groupInfoResponse = await axios.get(
            `${BASE_URL}/api/groups/${slug}/map`,
            { withCredentials: true }
          );

          const groupData = groupInfoResponse.data.data;
          console.log("StepRecommend: 그룹 정보:", groupData);

          // 로그인 사용자 닉네임을 그대로 사용 (이미 설정됨)
          console.log(
            "StepRecommend: 로그인 사용자 닉네임 사용:",
            finalRecommenderNickname
          );

          // 2. 그룹 정보를 바탕으로 개인 요청 생성
          const createRequestResponse = await axios.post(
            `${BASE_URL}/api/requests`,
            {
              station_code: groupData.station?.code || "",
              request_message: groupData.requestMessage || "",
              group_slug: slug,
            },
            { withCredentials: true }
          );

          console.log(
            "StepRecommend: 개인 요청 생성 응답:",
            createRequestResponse.data
          );

          if (createRequestResponse.data.result === "success") {
            // API 응답 구조 확인: data.request.slug 또는 data.slug
            const responseData = createRequestResponse.data.data;
            console.log(
              "🔍 DEBUGGING - 전체 responseData:",
              JSON.stringify(responseData, null, 2)
            );
            console.log(
              "🔍 DEBUGGING - responseData.request:",
              responseData.request
            );
            console.log(
              "🔍 DEBUGGING - responseData.request?.slug:",
              responseData.request?.slug
            );

            finalSlug =
              responseData.slug ||
              responseData.request?.slug ||
              responseData.request?.id;

            console.log("StepRecommend: API 응답 data 구조:", responseData);
            console.log(
              "StepRecommend: 개인 요청 생성 완료, 새 slug:",
              finalSlug
            );

            if (!finalSlug) {
              console.error(
                "StepRecommend: slug를 찾을 수 없습니다. 전체 응답:",
                createRequestResponse.data
              );
              throw new Error("생성된 요청에서 slug를 찾을 수 없습니다");
            }
          } else {
            throw new Error(
              "개인 요청 생성 실패: " +
                createRequestResponse.data.error?.message
            );
          }
        } catch (createError) {
          console.error("StepRecommend: 개인 요청 생성 실패:", createError);
          if (createError.response) {
            console.error(
              "StepRecommend: 에러 응답:",
              createError.response.data
            );
          }
          throw createError;
        }

        // 로그인 사용자 닉네임이 이미 items에 설정되어 있음
      }

      // 4. API 호출 - 추천 장소 최종 제출
      console.log(
        "StepRecommend: API 요청 URL:",
        `${BASE_URL}/api/requests/${finalSlug}/recommendations`
      );
      console.log("StepRecommend: 사용할 slug 값:", finalSlug);
      console.log("StepRecommend: 현재 경로:", currentPath);

      const response = await axios.post(
        `${BASE_URL}/api/requests/${finalSlug}/recommendations`,
        { items: items },
        { withCredentials: true }
      );

      if (response.data.result === "success") {
        console.log("추천 제출 완료");

        // 5. CompleteRecommend로 이동 (현재 경로 기준으로 personal/group 분기)
        const currentPath = window.location.pathname;
        if (currentPath.includes("/shared-map/personal/")) {
          navigate(`/shared-map/personal/${slug}/complete`);
        } else if (currentPath.includes("/shared-map/group/")) {
          navigate(`/shared-map/group/${slug}/complete`);
        } else {
          // 안전장치: 기본값은 personal로 처리
          navigate(`/shared-map/personal/${slug}/complete`);
        }
      }
    } catch (error) {
      console.error("추천 제출 실패:", error);
      if (error.response) {
        const { status, data } = error.response;
        console.error(`에러 ${status}:`, data.error?.message);
      }
    }
  }, [
    slug,
    placeRecommendations,
    navigate,
    BASE_URL,
    isUploading,
    nickname,
    selectedPlaces,
    userProfile?.nickname,
  ]);

  // 카테고리 배열 메모이제이션
  const categories = useMemo(
    () => [
      "분위기 맛집",
      "핫플",
      "힐링 스팟",
      "또간집",
      "숨은 맛집",
      "가성비 갑",
    ],
    []
  );

  // 현재 장소 메모이제이션
  const currentPlace = useMemo(
    () => selectedPlaces[currentPlaceIndex],
    [selectedPlaces, currentPlaceIndex]
  );

  // 안전한 렌더링을 위한 체크
  if (isLoading) {
    return (
      <Wrapper>
        <ContentSection>
          <TextBlock>
            <Title>장소 정보를 불러오는 중...</Title>
            <Detail>잠시만 기다려주세요.</Detail>
          </TextBlock>
          <PulseLoader size="large" color="#ff7e74" />
        </ContentSection>
      </Wrapper>
    );
  }

  if (!selectedPlaces || selectedPlaces.length === 0) {
    return (
      <Wrapper>
        <ContentSection>
          <TextBlock>
            <Title>장소 정보를 불러오는 중...</Title>
            <Detail>잠시만 기다려주세요.</Detail>
          </TextBlock>
          <SkeletonUI type="card" count={3} />
        </ContentSection>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <ContentSection>
        <TextBlock>
          <Title>추천한 장소를 소개해주세요.</Title>
          <Detail>
            입력해 주신 정보는 장소에 대한 AI 요약을 제공하는 데 쓰여요.
          </Detail>
        </TextBlock>
        {/* 장소 표시 */}
        <PlaceSection>
          <PlaceTitle>
            <PlaceIcon src="/Pin.png" alt="장소 아이콘" />
            <PlaceDisplay>{currentPlace?.title || "장소명"}</PlaceDisplay>
          </PlaceTitle>
        </PlaceSection>

        <CategorySection>
          <TextBlock>
            <CategoryLabel>
              이 장소의 키워드를 선택해주세요. (최대 3개)
            </CategoryLabel>
          </TextBlock>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryButton
                key={category}
                isSelected={selectedCategories.includes(category)}
                disabled={isCategoryDisabled(category)}
                onClick={() => handleCategoryToggle(category)}
              >
                {category}
              </CategoryButton>
            ))}
          </CategoryGrid>
        </CategorySection>

        <InputSection>
          <TextBlock>
            <InputLabel>
              {userProfile?.nickname || "사용자"} 님에게 전달할 메시지를
              입력해주세요.
            </InputLabel>
          </TextBlock>
          <InputContainer>
            <Message
              value={content}
              onChange={handleMemoChange}
              placeholder="메시지 입력"
              maxLength={120}
              onImageChange={handleImageChange}
              onPrivateChange={(isPrivate) => {
                // 현재 장소의 비공개 상태 업데이트
                setPlaceRecommendations((prev) => {
                  const copy = [...prev];
                  copy[currentPlaceIndex] = {
                    ...copy[currentPlaceIndex],
                    isPrivate,
                  };
                  return copy;
                });
              }}
              isPrivate={
                placeRecommendations[currentPlaceIndex]?.isPrivate || false
              }
              currentImageFile={
                placeRecommendations[currentPlaceIndex]?.imageFile || null
              }
              currentImageUrl={
                placeRecommendations[currentPlaceIndex]?.image || null
              }
              userProfile={userProfile}
            />
            <CharCount>{content.length}/120</CharCount>
          </InputContainer>
        </InputSection>

        {/* 진행 표시기 - 별도 섹션으로 분리 */}
        <ProgressSection>
          <ArrowButton
            onClick={() => handlePrevPlace()}
            disabled={currentPlaceIndex === 0}
            direction="left"
          >
            <ArrowIcon
              src="/PrevButton.png"
              alt="이전 장소"
              direction="left"
              disabled={currentPlaceIndex === 0}
            />
          </ArrowButton>

          <ProgressIndicator>
            {currentPlaceIndex + 1} / {selectedPlaces.length}
          </ProgressIndicator>

          <ArrowButton
            onClick={() => handleNextPlace()}
            disabled={currentPlaceIndex === selectedPlaces.length - 1}
            direction="right"
          >
            <ArrowIcon
              src="/PrevButton.png"
              alt="다음 장소"
              direction="right"
              disabled={currentPlaceIndex === selectedPlaces.length - 1}
            />
          </ArrowButton>
        </ProgressSection>
      </ContentSection>

      {/* 진행 버튼: 모든 장소 입력 완료 시에만 표시 */}
      <ButtonSection className={!isAllCompleted ? "hidden" : ""}>
        <Button onClick={handleComplete}>완료하기</Button>
      </ButtonSection>
    </Wrapper>
  );
}

export default StepRecommend;

// styled-components
const Wrapper = styled.div`
  ${getResponsiveStyles("search")}
  width: 100%;
  min-height: 100dvh; /* 모바일에서 안전한 전체 높이 */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  background-color: #ffffff;
  overflow: auto; /* 스크롤 허용 */
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  padding: 12px 20px;
  height: 100%;
  justify-content: flex-start;
  /* max-width와 margin 제거 - 전체 너비 사용 */
`;

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  text-align: left;
  padding-bottom: 3px;
`;

const Title = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.2px;
  color: #000000;
  margin: 0px 0px 5px 0px;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Detail = styled.p`
  font-family: "Pretendard", sans-serif;
  color: #585858;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  padding-left: 0;
  padding-bottom: 5px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// <--- 장소 섹션 --->
const PlaceSection = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 4px;
  gap: 0px;
`;

const PlaceTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const PlaceIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 0;
`;

const PlaceDisplay = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #383838;
  margin: 0px;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InputLabel = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  color: #333333;
  margin: 0;
`;

const InputContainer = styled.div`
  position: relative;
  max-height: 180px;
`;

const CharCount = styled.div`
  position: absolute;
  right: 0;
  top: -20px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  color: #bababa;
  text-align: center;
  z-index: 1;
`;

// <--- 카테고리 섹션 --->
const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
`;

const CategoryLabel = styled.label`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const CategoryButton = styled.div`
  padding: 12px 16px;
  border: 2px solid
    ${(props) => {
      if (props.disabled) return "#e0e0e0";
      return props.isSelected ? "#ff7e74" : "#E7E7E7";
    }};
  border-radius: 8px;
  background-color: ${(props) => {
    if (props.disabled) return "#f5f5f5";
    return props.isSelected ? "#ffefed" : "#E7E7E7";
  }};
  color: ${(props) => {
    if (props.disabled) return "#bababa";
    return props.isSelected ? "#ff7e74" : "#585858";
  }};
  font-family: "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      border: 2px solid #ff7e74;
      color: #ff7e74;
      background-color: #ffefed;
    `}
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
    min-height: 40px;
  }
`;

// <--- 진행 표시기 --->
const ProgressSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
`;

const ProgressIndicator = styled.div`
  font-family: "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #585858;
  margin: 0;
  padding: 8px 0px;
  text-align: center;
  min-width: 60px;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 6px 14px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 5px 12px;
  }
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    ${(props) =>
      !props.disabled &&
      `
      transform: scale(1.1);
    `}
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

const ArrowIcon = styled.img`
  width: 20px;
  height: 20px;
  object-fit: contain;
  transform: ${(props) =>
    props.direction === "right" ? "rotate(180deg)" : "none"};
  filter: ${(props) =>
    props.disabled ? "grayscale(100%) opacity(0.3)" : "none"};

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
  }
`;

const ButtonSection = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  background: #ffffff;
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom)) 20px;
  border-top: 1px solid #f0f0f0;
  z-index: 10;
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease-out;
  min-height: 50px;

  &.hidden {
    opacity: 0;
    transform: translateY(0);
    pointer-events: none;
    visibility: hidden; /* 보이지 않게 하되 공간은 유지 */
  }
`;
